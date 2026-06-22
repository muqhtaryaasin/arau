import React, { useState, useMemo } from "react";

const BANK = {
  1: {
    A: [
      { type: "kosa-kata", q: "Apakah nama haiwan ini? 🐱", opts: ["Kucing", "Anjing", "Ayam", "Itik"] },
      { type: "ejaan", q: "Pilih ejaan yang betul bagi 'skool'.", opts: ["sekolah", "sekolha", "sokolah", "sekolaah"] },
    ],
    B: [
      { type: "kosa-kata", q: "Apakah nama anggota keluarga ini? 👵", opts: ["Nenek", "Abang", "Kakak", "Pak cik"] },
    ],
    C: [
      { type: "kbat", img: "🏠🐶", q: "Ali ada seekor anjing. Mengapakah anjing Ali menyalak?", opts: ["Untuk memberitahu dan melindungi keluarga Ali", "Kerana lapar", "Kerana mahu bermain", "Kerana sakit"] },
    ],
  },
  2: {
    A: [
      { type: "kosa-kata", q: "Tempat membeli ubat dipanggil...", opts: ["Farmasi", "Perpustakaan", "Padang", "Dewan"] },
    ],
    B: [
      { type: "kosa-kata", q: "Tempat menyimpan buku untuk dibaca ramai ialah...", opts: ["Perpustakaan", "Kantin", "Stor", "Bilik guru"] },
    ],
    C: [
      { type: "kbat", img: "🌳🍃", q: "Pokok layu kerana tidak disiram. Apa patut dibuat?", opts: ["Siram pokok itu dengan air", "Tebang pokok", "Biarkan", "Cabut daun"] },
    ],
  },
};

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function App() {
  const [screen, setScreen] = useState("home");
  const [tahun, setTahun] = useState(1);
  const [setKey, setSetKey] = useState("A");
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [locked, setLocked] = useState(false);
  const [attemptSeed, setAttemptSeed] = useState(0);

  const questions = useMemo(() => {
    const set = (BANK[tahun] && BANK[tahun][setKey]) || [];
    return shuffle(set.map(q => ({ ...q })));
  }, [tahun, setKey, attemptSeed]);

  const current = questions[qIndex];

  function startQuiz(level, set) {
    setTahun(level);
    setSetKey(set);
    setQIndex(0);
    setScore(0);
    setSelected(null);
    setLocked(false);
    setAttemptSeed(s => s + 1);
    setScreen("quiz");
  }

  function choose(i) {
    if (locked) return;
    setSelected(i);
    setLocked(true);
    // For these sample BANK entries, assume the first option is correct
    const correct = i === 0;
    if (correct) setScore(s => s + 1);
  }

  function next() {
    setLocked(false);
    setSelected(null);
    if (qIndex + 1 < questions.length) setQIndex(i => i + 1);
    else setScreen("result");
  }

  return (
    <div style={{ padding: 18, fontFamily: 'Arial, sans-serif', maxWidth: 760, margin: '24px auto' }}>
      <header style={{ marginBottom: 18 }}>
        <h2 style={{ margin: 0 }}>Kelas Bahasa Melayu — Tahun {tahun}</h2>
        <div style={{ color: '#666', fontSize: 13 }}>Latihan interaktif Tahun 1–6 · KSSR</div>
      </header>

      {screen === 'home' && (
        <div>
          <p style={{ marginTop: 6 }}>Pilih tahun dan set latihan. Jawab soalan, kumpul XP, dan pecahkan rekod skor terbaik kamu! 🔥</p>
          {[1, 2].map(lv => (
            <div key={lv} style={{ marginBottom: 12, padding: 12, border: '1px solid #eee', borderRadius: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong>Tahun {lv}</strong>
                <small style={{ color: '#666' }}>A/B: 10 soalan · C-KBAT: 1 soalan</small>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button onClick={() => startQuiz(lv, 'A')}>📘 Set A</button>
                <button onClick={() => startQuiz(lv, 'B')}>📙 Set B</button>
                <button onClick={() => startQuiz(lv, 'C')}>🧠 KBAT</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {screen === 'quiz' && current && (
        <div>
          {current.img && <div style={{ fontSize: 42, textAlign: 'center', marginBottom: 8 }}>{current.img}</div>}
          <div style={{ marginBottom: 12, fontWeight: 700 }}>{current.q}</div>
          <div style={{ display: 'grid', gap: 8 }}>
            {current.opts.map((opt, i) => (
              <button key={i} onClick={() => choose(i)} disabled={locked} style={{ padding: 10, textAlign: 'left', borderRadius: 8 }}>
                <strong style={{ marginRight: 8 }}>{String.fromCharCode(65 + i)}.</strong> {opt}
              </button>
            ))}
          </div>

          <div style={{ marginTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>✅ {score} betul</div>
            <div>
              <button onClick={next} disabled={!locked} style={{ padding: '8px 14px' }}>{qIndex + 1 < questions.length ? 'Seterusnya →' : 'Selesai! 🎉'}</button>
            </div>
          </div>
        </div>
      )}

      {screen === 'result' && (
        <div style={{ textAlign: 'center' }}>
          <h3>Keputusan</h3>
          <div style={{ fontSize: 28, fontWeight: 700 }}>{score} / {questions.length}</div>
          <div style={{ marginTop: 12 }}>
            <button onClick={() => startQuiz(tahun, setKey)} style={{ marginRight: 8 }}>🔄 Cuba lagi</button>
            <button onClick={() => setScreen('home')}>🏠 Menu</button>
          </div>
        </div>
      )}
    </div>
  );
}
