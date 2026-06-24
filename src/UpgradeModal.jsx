import React, { useState } from "react";
import { useAuth } from "./AuthContext";

export default function UpgradeModal({ onClose }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const functionsUrl =
    import.meta.env.VITE_FUNCTIONS_URL ||
    import.meta.env.REACT_APP_FUNCTIONS_URL ||
    (typeof process !== "undefined" ? process.env.REACT_APP_FUNCTIONS_URL : "") ||
    "";

  async function handleUpgrade() {
    if (!user) return;
    setError("");
    setLoading(true);
    try {
      if (!functionsUrl) {
        setError("URL pembayaran belum disediakan. Tetapkan VITE_FUNCTIONS_URL dalam fail .env.");
        setLoading(false);
        return;
      }

      const resp = await fetch(`${functionsUrl}/createCheckoutSession`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.uid }),
      });
      if (!resp.ok) {
        const errorText = await resp.text();
        console.error("Checkout session request failed", resp.status, errorText);
        setError("Pembayaran belum boleh dimulakan. Sila semak konfigurasi Stripe dan cuba lagi.");
        setLoading(false);
        return;
      }

      const data = await resp.json();
      if (data.url) {
        window.location.href = data.url; // redirect to Stripe Checkout
      } else {
        console.error("No checkout url returned", data);
        setError(data.error || "Stripe tidak memulangkan pautan pembayaran.");
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError("Permintaan pembayaran gagal. Sila cuba lagi.");
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: 12,
          padding: 24,
          maxWidth: 400,
          textAlign: 'center',
          boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
          fontFamily: 'var(--font-body)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontSize: 48, marginBottom: 16 }}>🌟</div>
        <h2 style={{ fontSize: 28, margin: '0 0 12px 0', fontFamily: 'var(--font-display)', lineHeight: 1 }}>Naik Taraf ke Premium</h2>
        <p style={{ color: '#666', marginBottom: 16 }}>
          Set B dan C hanya tersedia untuk ahli Premium. Dapatkan akses ke soalan baru setiap minggu!
        </p>

        <div style={{ backgroundColor: '#f0f0f0', padding: 16, borderRadius: 8, marginBottom: 16 }}>
          <div style={{ textAlign: 'left', fontSize: 14 }}>
            <div style={{ marginBottom: 8 }}>✅ Akses Set A, B, dan C</div>
            <div style={{ marginBottom: 8 }}>✅ Soalan baru setiap minggu</div>
            <div style={{ marginBottom: 8 }}>✅ Penjejakan kemajuan terperinci</div>
            <div>✅ Tiada iklan</div>
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#FF9800' }}>RM10</div>
          <div style={{ color: '#666', fontSize: 12 }}>Setiap bulan</div>
        </div>

        {error && (
          <div
            style={{
              marginBottom: 16,
              padding: 12,
              borderRadius: 8,
              backgroundColor: '#fff4e5',
              color: '#9a5b00',
              fontSize: 13,
              textAlign: 'left',
            }}
          >
            {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: 12,
              backgroundColor: '#e0e0e0',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Kemudian
          </button>
          <button
            onClick={handleUpgrade}
            disabled={loading}
            style={{
              flex: 1,
              padding: 12,
              backgroundColor: '#FF9800',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 600,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Mengarahkan...' : 'Naik Taraf Sekarang'}
          </button>
        </div>

        <div style={{ marginTop: 12, fontSize: 12, color: '#999' }}>
          💳 Pembayaran selamat dengan Stripe
        </div>
      </div>
    </div>
  );
}
