# 🚀 Setup Guide — Kelas Bahasa Melayu with Authentication & Subscriptions

## ✅ What's Been Implemented

Your app now has:
- ✅ **Login/Sign-Up Screen** — Email + password authentication with Firebase
- ✅ **User Dashboard** — Profile, subscription status, and statistics
- ✅ **Subscription System** — Free tier (Set A only) vs Premium (All sets + analytics)
- ✅ **Score Tracking** — Automatic saving to Firestore
- ✅ **Upgrade Modal** — Prompts users to upgrade when accessing premium content
- ✅ **User Progress** — Total questions answered, accuracy %, weeks active

---

## 📋 Next Steps

### **Step 1: Install Dependencies**
```bash
npm install
```

### **Step 2: Create Firebase Project**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add Project"**
3. Name it (e.g., "Kelas Bahasa Melayu")
4. Enable Google Analytics (optional)
5. Create the project

### **Step 3: Enable Authentication**
1. In Firebase, go to **Authentication** → **Sign-in method**
2. Enable these providers:
   - ✅ **Email/Password**
   - ✅ **Google**
   - ✅ **Apple** (if available in your region)
3. Save

### **Step 4: Create Firestore Database**
1. Go to **Firestore Database** → **Create Database**
2. Start in **Production mode** (we'll add security rules next)
3. Choose region: **asia-southeast1** (closest to Malaysia)
4. Create

### **Step 5: Configure Firebase Config**
1. Go to **Project Settings** (gear icon) → **General**
2. Scroll down to **Your apps** section
3. Click **"Web App"** (the `</>`  icon)
4. Copy your Firebase config
5. Update `src/firebase.js`:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};
```

### **Step 6: Add Firestore Security Rules**
1. Go to **Firestore Database** → **Rules**
2. Replace with this:

```firebase
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
      
      // Quiz attempts subcollection
      match /quizAttempts/{document=**} {
        allow read, write: if request.auth.uid == userId;
      }
    }
  }
}
```

3. Publish rules

### **Step 7: Test Locally**
```bash
npm run dev
```

Visit `http://localhost:5173`

---

## 🎯 Default Features

### **FREE TIER:**
- Set A only (2 questions per year)
- Basic score display
- Account creation

### **PREMIUM TIER (RM10/month):**
- All Sets (A, B, C-KBAT)
- New questions weekly *(prepare to add these manually or via API)*
- Progress dashboard with analytics
- Accuracy tracking

---

## 💳 Payment Integration (Future)
## 💳 Payment Integration (Stripe) — Implemented Guide

This project includes example Firebase Cloud Functions for creating a Stripe Checkout session and handling Stripe webhooks. Follow these steps to configure and deploy.

1. Install client & server deps

Client (web app):
```bash
npm install @stripe/stripe-js
```

Functions (from `/functions`):
```bash
cd functions
npm install
```

2. Configure environment variables

In your functions environment set these (or set local env for emulator):

- `STRIPE_SECRET_KEY` — Your Stripe secret key (starts with `sk_...`)
- `STRIPE_PRICE_ID` — The Price ID you created in Stripe for the monthly plan (starts with `price_...`)
- `STRIPE_WEBHOOK_SECRET` — The webhook signing secret from Stripe (for verifying webhooks)
- `SUCCESS_URL` and `CANCEL_URL` — URLs to redirect after checkout (e.g. your deployed app URLs)

This project currently uses Firebase Functions runtime config via `functions.config()`.

Set them with the CLI:

```bash
npx firebase-tools@latest functions:config:set \
  stripe.secret="sk_..." \
  stripe.price_id="price_..." \
  stripe.webhook_secret="whsec_..." \
  app.success_url="https://your-app.example/success" \
  app.cancel_url="https://your-app.example/cancel" \
  --project quizarau
```

Then deploy your functions:

```bash
cd functions
npx firebase-tools@latest deploy --only functions --project quizarau
```

If you later upgrade to a Firebase CLI release that supports `functions:params:set`, you can migrate your config to the newer params workflow.

3. Deploy functions

Deploy with your Firebase project `quizarau` (this repo is pre-configured with `.firebaserc`):

```bash
# from project root
cd functions
firebase deploy --only functions --project quizarau
```

After deploy you will have endpoints (replace REGION if you deploy to a different region):

- `https://us-central1-quizarau.cloudfunctions.net/api/createCheckoutSession` — create a Checkout session
- `https://us-central1-quizarau.cloudfunctions.net/webhook` — webhook endpoint

4. Client: call the createCheckoutSession endpoint

We updated `src/UpgradeModal.jsx` to POST the logged-in user's `uid` to the functions endpoint. Configure the base URL for functions in your web app by copying `.env.example` to `.env` and editing if necessary:

```
cp .env.example .env
# then edit .env if you use a different region or project
```

Then restart the dev server. The upgrade button will call `/createCheckoutSession`, receive a Checkout `url`, and redirect the browser to Stripe Checkout.

5. Verify webhook

In Stripe Dashboard, add the webhook URL (the deployed `/webhook` endpoint) and subscribe to `checkout.session.completed`. Use the Stripe CLI to test webhooks locally during development.

6. What the webhook does

When Stripe signals `checkout.session.completed`, the Cloud Function updates the user's Firestore document:

```
users/{userId}:
  subscriptionStatus: 'premium'
  subscriptionExpiry: <Timestamp one month from purchase>
```

7. Local testing

- Use the Firebase emulator for functions and Firestore when developing locally.
- Use the Stripe CLI to create test checkout sessions and send test webhook events:

```bash
stripe listen --forward-to localhost:5001/YOUR_PROJECT/us-central1/webhook
stripe trigger checkout.session.completed
```

8. Notes

- Replace the placeholder `VITE_FUNCTIONS_URL` with your functions base URL.
- Ensure `STRIPE_PRICE_ID` matches the Price you create in Stripe for the RM10/month plan.
- For production, consider using Stripe Billing subscriptions (recurring) instead of one-off payment + expiry logic.


---

## 📊 Firestore Structure

```
users/{userId}/
├── email: "user@example.com"
├── displayName: "Ahmad"
├── subscriptionStatus: "free" | "premium"
├── subscriptionExpiry: Timestamp | null
├── createdAt: Timestamp
├── totalQuestionsAnswered: 42
├── accuracy: 85
└── quizAttempts/
    ├── {attemptId}/
    │   ├── year: 1
    │   ├── set: "A"
    │   ├── score: 2
    │   ├── totalQuestions: 2
    │   ├── accuracy: 100
    │   └── timestamp: Timestamp
```

---

## 🔧 Troubleshooting

### "Firebase config is missing"
→ Make sure you updated `src/firebase.js` with your real config

### "Permission denied" error on Firestore
→ Check your Firestore rules allow the user's UID to access data

### "User not found" on login
→ Make sure user signed up first, or check if email is correct

### Score not saving
→ Check browser console for Firestore errors
→ Verify Firestore database is in Production mode

---

## 🎓 Adding More Questions

Edit `QuizApp.jsx` and expand the `BANK` object:

```javascript
const BANK = {
  1: {
    A: [
      { type: "kosa-kata", q: "Question?", opts: ["A", "B", "C", "D"], correct: 0 },
      // Add more questions...
    ],
  },
};
```

For **weekly new questions**, store them in Firestore instead:

```javascript
// Fetch from Firestore
const docSnap = await getDoc(doc(db, "questions", `year_1_set_A`));
const questions = docSnap.data().items;
```

---

## ✨ Ready to Launch?

Your app is now subscription-ready! 🚀

Next steps:
1. ✅ Deploy to Vercel/Netlify
2. ✅ Add Stripe payment integration
3. ✅ Set up weekly question updates
4. ✅ Configure email notifications

Good luck! 🎉
