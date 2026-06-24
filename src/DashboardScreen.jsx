import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { doc, getDoc, updateDoc, collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

function formatExpiry(value) {
  if (!value) return "";
  const date = typeof value?.toDate === "function" ? value.toDate() : new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString('ms-MY');
}

function buildChildId(index) {
  return `child-${index + 1}`;
}

function toChildren(data) {
  const list = Array.isArray(data?.children) ? data.children : [];
  const normalized = list
    .map((child, index) => ({
      id: child?.id || buildChildId(index),
      name: String(child?.name || "").trim(),
      year: Number(child?.year) || 1,
    }))
    .filter((child) => child.name)
    .slice(0, 6);

  if (!normalized.length && data?.childName) {
    normalized.push({
      id: buildChildId(0),
      name: String(data.childName).trim(),
      year: Number(data.childYear) || 1,
    });
  }
  return normalized;
}

function isAttemptForChild(attempt, child) {
  if (!attempt || !child) return false;
  if (attempt.childId && child.id) return attempt.childId === child.id;
  const nameMatch = String(attempt.childName || "").trim().toLowerCase() === String(child.name || "").trim().toLowerCase();
  const yearMatch = Number(attempt.childYear) === Number(child.year);
  return nameMatch && yearMatch;
}

function toDateSafe(value) {
  if (!value) return null;
  const date = typeof value?.toDate === "function" ? value.toDate() : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export default function DashboardScreen({ onBack, onStartQuiz }) {
  const { user, userData, logout, isPremium } = useAuth();
  const [stats, setStats] = useState({ totalQuestions: 0, accuracy: 0, weeksActive: 0 });
  const [parentName, setParentName] = useState("");
  const [children, setChildren] = useState([]);
  const [activeChildId, setActiveChildId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [statsLoading, setStatsLoading] = useState(false);

  const activeChild = children.find((child) => child.id === activeChildId) || children[0] || null;

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) return;
      const data = userDoc.data();
      const loadedChildren = toChildren(data);
      const selectedId = loadedChildren.some((child) => child.id === data.activeChildId)
        ? data.activeChildId
        : loadedChildren[0]?.id || null;
      setParentName(data.parentName || userData?.parentName || data.displayName || "");
      setChildren(loadedChildren);
      setActiveChildId(selectedId);
    };
    loadProfile();
  }, [user, userData?.parentName]);

  useEffect(() => {
    const calculateChildStats = async () => {
      if (!user || !activeChild) {
        setStats({ totalQuestions: 0, accuracy: 0, weeksActive: 0 });
        return;
      }

      setStatsLoading(true);
      try {
        const attemptsSnap = await getDocs(collection(db, "users", user.uid, "quizAttempts"));
        const childAttempts = attemptsSnap.docs
          .map((snap) => snap.data())
          .filter((attempt) => isAttemptForChild(attempt, activeChild));

        const totalQuestions = childAttempts.reduce((sum, attempt) => sum + (Number(attempt.totalQuestions) || 0), 0);
        const totalCorrect = childAttempts.reduce((sum, attempt) => sum + (Number(attempt.score) || 0), 0);
        const accuracy = totalQuestions ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

        let weeksActive = 1;
        if (childAttempts.length) {
          const earliest = childAttempts
            .map((attempt) => toDateSafe(attempt.timestamp))
            .filter(Boolean)
            .sort((a, b) => a - b)[0];
          if (earliest) {
            weeksActive = Math.max(1, Math.ceil((new Date() - earliest) / (7 * 24 * 60 * 60 * 1000)));
          }
        }

        setStats({ totalQuestions, accuracy, weeksActive });
      } catch (err) {
        console.error("Failed to load child stats", err);
        setStats({ totalQuestions: 0, accuracy: 0, weeksActive: 0 });
      }
      setStatsLoading(false);
    };

    calculateChildStats();
  }, [user, activeChildId, children]);

  const handleChildFieldChange = (id, field, value) => {
    setChildren((prev) =>
      prev.map((child) =>
        child.id === id
          ? {
              ...child,
              [field]: field === "year" ? Number(value) || 1 : value,
            }
          : child
      )
    );
  };

  const handleAddChild = () => {
    if (children.length >= 6) return;
    const newChild = {
      id: `child-${Date.now()}-${children.length + 1}`,
      name: "",
      year: 1,
    };
    setChildren((prev) => [...prev, newChild]);
    if (!activeChildId) setActiveChildId(newChild.id);
  };

  const handleRemoveChild = (id) => {
    setChildren((prev) => {
      const next = prev.filter((child) => child.id !== id);
      if (!next.length) {
        const fallback = {
          id: buildChildId(0),
          name: "",
          year: 1,
        };
        setActiveChildId(fallback.id);
        return [fallback];
      }
      if (id === activeChildId) setActiveChildId(next[0].id);
      return next;
    });
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    setSaveMsg("");
    try {
      const trimmedParentName = parentName.trim();
      const cleanedChildren = children
        .map((child, index) => ({
          id: child.id || buildChildId(index),
          name: String(child.name || "").trim(),
          year: Number(child.year) || 1,
        }))
        .filter((child) => child.name)
        .slice(0, 6);

      if (!trimmedParentName) {
        setSaveMsg("Nama ibu bapa diperlukan");
        setSaving(false);
        return;
      }

      if (!cleanedChildren.length) {
        setSaveMsg("Sila isi sekurang-kurangnya seorang anak");
        setSaving(false);
        return;
      }

      const selectedId = cleanedChildren.some((child) => child.id === activeChildId)
        ? activeChildId
        : cleanedChildren[0].id;
      const selectedChild = cleanedChildren.find((child) => child.id === selectedId) || cleanedChildren[0];

      await updateDoc(doc(db, "users", user.uid), {
        parentName: trimmedParentName,
        displayName: trimmedParentName,
        children: cleanedChildren,
        activeChildId: selectedId,
        childName: selectedChild.name,
        childYear: selectedChild.year,
      });
      setChildren(cleanedChildren);
      setActiveChildId(selectedId);
      setSaveMsg("Profil disimpan");
    } catch (err) {
      setSaveMsg("Gagal simpan profil");
      console.error("Failed to save profile", err);
    }
    setSaving(false);
  };

  return (
    <div style={{ padding: 18, fontFamily: 'var(--font-body)', maxWidth: 820, margin: '24px auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 32, lineHeight: 1 }}>👤 Profil Saya</h2>
        <button onClick={onBack} style={{ padding: '8px 12px', cursor: 'pointer', borderRadius: 6, border: '1px solid #ddd' }}>
          ← Kembali
        </button>
      </div>

      <div style={{ backgroundColor: '#E3F2FA', border: '1px solid #3E8FB0', padding: 10, borderRadius: 12, marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <div style={{ fontSize: 11, color: '#1F5A73', fontWeight: 700, marginBottom: 2 }}>Profil aktif</div>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#2B2B26', lineHeight: 1.35 }}>Nama anak: {activeChild?.name || 'Belum ditetapkan'}</div>
        <div style={{ fontSize: 12, color: '#2B2B26', opacity: 0.85, lineHeight: 1.35 }}>Tahun {activeChild?.year || 1} · Score dan progress akan disimpan di profil ini.</div>
        <div style={{ fontSize: 11, color: '#1F5A73', marginTop: 4 }}>Jumlah anak: {children.filter((child) => child.name).length}/6</div>
      </div>

      {/* Parent / Child Profile */}
      <div style={{ backgroundColor: 'white', border: '1px solid #ddd', padding: 16, borderRadius: 12, marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'grid', gap: 14 }}>
          <label style={{ display: 'grid', gap: 6 }}>
            <span style={{ color: '#666', fontSize: 12 }}>Nama ibu bapa</span>
            <input
              value={parentName}
              onChange={(e) => setParentName(e.target.value)}
              style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ddd', fontSize: 14, boxSizing: 'border-box' }}
            />
          </label>
          <div style={{ display: 'grid', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
              <span style={{ color: '#666', fontSize: 12 }}>Profil anak (maksimum 6)</span>
              <button
                onClick={handleAddChild}
                disabled={children.length >= 6}
                style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #3E8FB0', background: children.length >= 6 ? '#f2f2f2' : '#E3F2FA', color: '#1F5A73', fontWeight: 700, cursor: children.length >= 6 ? 'not-allowed' : 'pointer' }}
              >
                + Tambah Anak
              </button>
            </div>
            {children.map((child, index) => (
              <div key={child.id} style={{ border: '1px solid #e1e1e1', borderRadius: 10, padding: 10, background: activeChildId === child.id ? '#F4FBFF' : '#fff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                  <strong style={{ fontSize: 12, color: '#1F5A73' }}>Anak {index + 1}</strong>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <button
                      onClick={() => setActiveChildId(child.id)}
                      style={{ padding: '5px 9px', borderRadius: 7, border: '1px solid #3E8FB0', background: activeChildId === child.id ? '#3E8FB0' : '#fff', color: activeChildId === child.id ? '#fff' : '#1F5A73', fontWeight: 700, cursor: 'pointer', fontSize: 12 }}
                    >
                      {activeChildId === child.id ? 'Aktif' : 'Jadikan Aktif'}
                    </button>
                    <button
                      onClick={() => handleRemoveChild(child.id)}
                      disabled={children.length <= 1}
                      style={{ padding: '5px 9px', borderRadius: 7, border: '1px solid #D14B5A', background: children.length <= 1 ? '#f2f2f2' : '#fff1f3', color: '#7A1F28', fontWeight: 700, cursor: children.length <= 1 ? 'not-allowed' : 'pointer', fontSize: 12 }}
                    >
                      Buang
                    </button>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 8 }}>
                  <input
                    value={child.name}
                    onChange={(e) => handleChildFieldChange(child.id, 'name', e.target.value)}
                    placeholder="Nama anak"
                    style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ddd', fontSize: 14, boxSizing: 'border-box' }}
                  />
                  <select
                    value={child.year}
                    onChange={(e) => handleChildFieldChange(child.id, 'year', e.target.value)}
                    style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ddd', fontSize: 14, boxSizing: 'border-box' }}
                  >
                    {[1, 2, 3, 4, 5, 6].map((year) => <option key={year} value={year}>Tahun {year}</option>)}
                  </select>
                </div>
              </div>
            ))}
          </div>
          <div>
            <span style={{ color: '#666', fontSize: 12 }}>Email</span>
            <div style={{ fontSize: 14, color: '#333', marginTop: 6 }}>{user?.email}</div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={handleSaveProfile}
              disabled={saving}
              style={{ padding: '10px 16px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: 8, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}
            >
              {saving ? 'Menyimpan...' : 'Simpan Profil'}
            </button>
            {saveMsg && <span style={{ fontSize: 12, color: '#666' }}>{saveMsg}</span>}
          </div>
        </div>
      </div>

      {/* Subscription Status */}
      <div
        style={{
          backgroundColor: isPremium ? '#e3f2fd' : '#fff3e0',
          border: `2px solid ${isPremium ? '#2196F3' : '#FF9800'}`,
          padding: 16,
          borderRadius: 10,
          marginBottom: 16,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 12, color: '#666' }}>Nama Langganan</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: isPremium ? '#2196F3' : '#FF9800' }}>
              {isPremium ? "🌟 Premium" : "📖 Percuma"}
            </div>
            {isPremium && userData?.subscriptionExpiry && (
              <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                Luput pada: {formatExpiry(userData.subscriptionExpiry) || 'Tidak ditetapkan'}
              </div>
            )}
          </div>
          {!isPremium && (
            <button
              onClick={() => onStartQuiz?.('upgrade')}
              style={{
                padding: '10px 16px',
                backgroundColor: '#FF9800',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Naik Taraf →
            </button>
          )}
        </div>
      </div>

      {/* Statistics */}
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ margin: '0 0 6px 0', fontSize: 22, fontFamily: 'var(--font-display)', lineHeight: 1 }}>📊 Statistik</h3>
        <div style={{ fontSize: 12, color: '#666', marginBottom: 12 }}>
          Berdasarkan anak aktif: <strong>{activeChild?.name || 'Belum ditetapkan'}</strong>{' '}
          {activeChild?.year ? `(Tahun ${activeChild.year})` : ''}
          {statsLoading ? ' · Mengemas kini...' : ''}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <div style={{ backgroundColor: '#e8f5e9', padding: 12, borderRadius: 8, textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: '#666' }}>Soalan Dijawab</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#4caf50' }}>{stats.totalQuestions}</div>
          </div>
          <div style={{ backgroundColor: '#e3f2fd', padding: 12, borderRadius: 8, textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: '#666' }}>Ketepatan</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#2196F3' }}>{stats.accuracy}%</div>
          </div>
          <div style={{ backgroundColor: '#f3e5f5', padding: 12, borderRadius: 8, textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: '#666' }}>Minggu Aktif</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#9c27b0' }}>{stats.weeksActive}</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
        <button
          onClick={onBack}
          style={{
            flex: 1,
            padding: 12,
            backgroundColor: '#007BFF',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          📝 Mula Ujian
        </button>
        <button
          onClick={handleLogout}
          style={{
            flex: 1,
            padding: 12,
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          🚪 Log Keluar
        </button>
      </div>

      {/* FAQ */}
      <div style={{ marginTop: 24, padding: 12, backgroundColor: '#f9f9f9', borderRadius: 8, fontSize: 12, color: '#666' }}>
        <p style={{ margin: '0 0 8px 0' }}>
          <strong>❓ Soalan Lazim:</strong>
        </p>
        <ul style={{ margin: '0 0 0 16px', padding: 0 }}>
          <li>Soalan baru ditambah setiap Isnin</li>
          <li>Set B dan C hanya untuk ahli Premium</li>
          <li>Skor tersimpan secara automatik</li>
          <li>Profil ibu bapa dan anak boleh dikemas kini di sini</li>
        </ul>
      </div>
    </div>
  );
}
