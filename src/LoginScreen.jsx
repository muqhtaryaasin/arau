import React, { useState } from "react";
import { useAuth } from "./AuthContext";

export default function LoginScreen({ onLoginSuccess }) {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [parentName, setParentName] = useState("");
  const [childName, setChildName] = useState("");
  const [childYear, setChildYear] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signup, login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignup) {
        if (!parentName.trim()) {
          setError("Nama ibu bapa diperlukan");
          setLoading(false);
          return;
        }
        if (!childName.trim()) {
          setError("Nama anak diperlukan");
          setLoading(false);
          return;
        }
        await signup(email, password, parentName, childName, Number(childYear));
      } else {
        await login(email, password);
      }
      onLoginSuccess?.();
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("Email sudah digunakan");
      } else if (err.code === "auth/weak-password") {
        setError("Kata laluan terlalu lemah (minimum 6 karakter)");
      } else if (err.code === "auth/user-not-found") {
        setError("Email tidak ditemui");
      } else if (err.code === "auth/wrong-password") {
        setError("Kata laluan salah");
      } else if (err.code === "auth/invalid-email") {
        setError("Email tidak sah");
      } else {
        setError(err.message);
      }
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: 18, fontFamily: 'var(--font-body)', maxWidth: 420, margin: '60px auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h1 style={{ fontSize: 36, margin: '0 0 8px 0', fontFamily: 'var(--font-display)', lineHeight: 1 }}>📚 Kelas Bahasa Melayu</h1>
        <p style={{ color: '#666', margin: 0 }}>Latihan interaktif Tahun 1–6</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <h2 style={{ fontSize: 24, margin: '0 0 16px 0', textAlign: 'center', fontFamily: 'var(--font-display)', lineHeight: 1 }}>
          {isSignup ? "Daftar Akaun Baru" : "Log Masuk"}
        </h2>

        {isSignup && (
          <>
            <input
              type="text"
              placeholder="Nama ibu bapa"
              value={parentName}
              onChange={(e) => setParentName(e.target.value)}
              style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd', fontSize: 14 }}
            />
            <input
              type="text"
              placeholder="Nama anak"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd', fontSize: 14 }}
            />
            <select
              value={childYear}
              onChange={(e) => setChildYear(e.target.value)}
              style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd', fontSize: 14 }}
            >
              {[1, 2, 3, 4, 5, 6].map((year) => (
                <option key={year} value={year}>Tahun {year}</option>
              ))}
            </select>
          </>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd', fontSize: 14 }}
        />

        <input
          type="password"
          placeholder="Kata laluan"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd', fontSize: 14 }}
        />

        {error && (
          <div style={{ backgroundColor: '#fee', color: '#c33', padding: 10, borderRadius: 8, fontSize: 14 }}>
            ❌ {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: 12,
            backgroundColor: '#007BFF',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            fontSize: 16,
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Memproses..." : isSignup ? "Daftar" : "Log Masuk"}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: 16, fontSize: 14, color: '#666' }}>
        {isSignup ? "Sudah ada akaun? " : "Belum ada akaun? "}
        <button
          onClick={() => {
            setIsSignup(!isSignup);
            setError("");
            setEmail("");
            setPassword("");
            setParentName("");
            setChildName("");
            setChildYear(1);
          }}
          style={{ background: 'none', border: 'none', color: '#007BFF', cursor: 'pointer', fontWeight: 600 }}
        >
          {isSignup ? "Log Masuk" : "Daftar"}
        </button>
      </div>

      <div style={{ marginTop: 24, textAlign: 'center', fontSize: 12, color: '#999' }}>
        <p>✅ Privasi terjamin</p>
        <p>🔒 Data terenkripsi</p>
      </div>
    </div>
  );
}
