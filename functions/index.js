const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

admin.initializeApp();
const db = admin.firestore();

// Try environment variables first, then fall back to functions.config() (Gen1 supports both)
const stripeConfig = (() => {
  try {
    return functions.config().stripe || {};
  } catch (e) {
    return {};
  }
})();

const appConfig = (() => {
  try {
    return functions.config().app || {};
  } catch (e) {
    return {};
  }
})();

const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY || stripeConfig.secret || '';
const STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID || stripeConfig.price_id || '';
const SUCCESS_URL = process.env.SUCCESS_URL || appConfig.success_url || 'https://your-app.example/success';
const CANCEL_URL = process.env.CANCEL_URL || appConfig.cancel_url || 'https://your-app.example/cancel';
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || stripeConfig.webhook_secret || '';

const stripe = require('stripe')(STRIPE_SECRET);
const app = express();
app.use(cors({ origin: true }));
app.use(bodyParser.json());

// Create a Checkout Session
app.post('/createCheckoutSession', async (req, res) => {
  try {
    if (!STRIPE_SECRET) {
      return res.status(500).json({ error: 'Stripe secret key is not configured.' });
    }
    if (!STRIPE_PRICE_ID) {
      return res.status(500).json({ error: 'Stripe price ID is not configured.' });
    }

    const { uid } = req.body;
    if (!uid) return res.status(400).json({ error: 'Missing uid' });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price: STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: `${SUCCESS_URL}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: CANCEL_URL,
      client_reference_id: uid,
      metadata: { userId: uid },
    });

    return res.json({ url: session.url });
  } catch (err) {
    console.error('createCheckoutSession error', err);
    return res.status(500).json({ error: err.message });
  }
});

// Webhook handler - use Firebase rawBody directly (Buffer)
const webhookHandler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  if (!STRIPE_WEBHOOK_SECRET) {
    console.error('[WEBHOOK] ❌ Stripe webhook secret not configured');
    return res.status(500).send('Webhook secret not configured');
  }

  const sig = req.headers['stripe-signature'];
  if (!sig) {
    console.error('[WEBHOOK] ❌ Missing stripe-signature header');
    return res.status(400).send('Missing stripe-signature');
  }

  const rawBody = req.rawBody;
  if (!rawBody || !Buffer.isBuffer(rawBody)) {
    console.error('[WEBHOOK] ❌ Invalid raw body payload');
    return res.status(400).send('Invalid raw payload');
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('[WEBHOOK] ❌ Signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.client_reference_id || session.metadata?.userId;

    if (userId) {
      let duplicateEvent = false;
      try {
        const eventRef = db.collection('stripe_webhook_events').doc(event.id);
        const userRef = db.collection('users').doc(userId);

        await db.runTransaction(async (tx) => {
          const eventSnap = await tx.get(eventRef);
          if (eventSnap.exists) {
            duplicateEvent = true;
            return;
          }

          const expiry = new Date();
          expiry.setMonth(expiry.getMonth() + 1);

          tx.set(
            userRef,
            {
              subscriptionStatus: 'premium',
              subscriptionExpiry: admin.firestore.Timestamp.fromDate(expiry),
            },
            { merge: true }
          );

          tx.set(eventRef, {
            eventId: event.id,
            type: event.type,
            userId,
            created: admin.firestore.FieldValue.serverTimestamp(),
          });
        });

        if (duplicateEvent) {
          console.log('[WEBHOOK] Duplicate event ignored:', event.id);
        } else {
          console.log('[WEBHOOK] Premium updated for user:', userId);
        }
      } catch (err) {
        console.error('[WEBHOOK] ❌ Firestore update failed:', err.message, err.code);
        return res.status(500).send('Failed to update subscription');
      }
    } else {
      console.warn('[WEBHOOK] ⚠️ No userId in session metadata/client_reference_id');
    }
  }

  return res.status(200).json({ received: true });
};

exports.api = functions.https.onRequest(app);
exports.webhook = functions.https.onRequest(webhookHandler);
