import React, { useState, useMemo, useEffect, useRef } from "react";
import { useAuth } from "./src/AuthContext";
import LoginScreen from "./src/LoginScreen";
import DashboardScreen from "./src/DashboardScreen";
import UpgradeModal from "./src/UpgradeModal";
import { BANK as QUESTION_BANK } from "./src/QuizApp";
import { doc, updateDoc, collection, addDoc, getDoc } from "firebase/firestore";
import { db } from "./src/firebase";

const BANK = QUESTION_BANK;
const YEARS = [1, 2, 3, 4, 5, 6];
const YEAR_FOCUS = {
  1: "Kata nama, kata kerja asas, ejaan suku kata, lawan kata",
  2: "Kata adjektif, kata ganti nama diri, imbuhan ber-",
  3: "Kata hubung, kata sendi nama, imbuhan meN-, simpulan bahasa",
  4: "Kata ganda, golongan kata, ayat aktif/pasif, peribahasa",
  5: "Kata majmuk, penjodoh bilangan, ayat majmuk pancangan, perumpamaan",
  6: "Ayat songsang, kata penegas, peribahasa lanjutan, kosa kata formal",
};
const COLORS = {
  cream: "#FBF6E9",
  sky: "#3E8FB0",
  skyDark: "#1F5A73",
  sun: "#F2A93B",
  sunDark: "#8A5A0F",
  hibiscus: "#D14B5A",
  hibiscusDark: "#7A1F28",
  leaf: "#5C8A3A",
  leafDark: "#33501F",
  ink: "#2B2B26",
};
const STREAK_MSGS = [
  null,
  null,
  "2 betul berturut-turut! 🔥",
  "3 berturut! Mantap! 🔥🔥",
  "4 berturut! Luar biasa! 🔥🔥🔥",
  "5 berturut! Hebat sangat! 🌟",
  "6 berturut! Juara! 🏆",
  "7 berturut! Cemerlang! 🎊",
];

const CORRECT_MSGS = [
  "Betul! Bagus! 🎉",
  "Tepat sekali! ✨",
  "Pandai! 🌟",
  "Tahniah! 🎊",
  "Benar! Teruskan! 💪",
  "Syabas! 🏅",
  "Wah, bijak! 🤩",
  "100%! 👏",
];

const WRONG_MSGS = [
  "Hampir betul! Cuba lagi 💪",
  "Tidak mengapa, teruskan! 😊",
  "Jangan berputus asa! 🌈",
  "Ulang kaji ya! 📚",
  "Lain kali pasti boleh! ✊",
];
const TOPIC_LABEL = {
  "kosa-kata": "Kosa kata",
  "ejaan": "Ejaan",
  "lawan-kata": "Lawan kata",
  "kata-nama": "Kata nama",
  "kata-kerja": "Kata kerja",
  "kata-adjektif": "Kata adjektif",
  "kata-ganti": "Kata ganti nama",
  "kata-hubung": "Kata hubung",
  "kata-sendi": "Kata sendi nama",
  "imbuhan": "Imbuhan",
  "simpulan-bahasa": "Simpulan bahasa",
  "ayat-majmuk": "Ayat majmuk",
  "kata-ganda": "Kata ganda",
  "golongan-kata": "Golongan kata",
  "ayat": "Ayat aktif/pasif",
  "peribahasa": "Peribahasa",
  "kata-majmuk": "Kata majmuk",
  "penjodoh-bilangan": "Penjodoh bilangan",
  "perumpamaan": "Perumpamaan",
  "ayat-songsang": "Ayat songsang",
  "kata-penegas": "Kata penegas",
  "tanda-baca": "Tanda baca",
  "kbat": "KBAT",
};

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function normalizeKeyPart(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "") || "child";
}

function getActiveChildProfile(userData) {
  const children = Array.isArray(userData?.children) ? userData.children : [];
  const normalized = children
    .map((child, index) => ({
      id: child?.id || `child-${index + 1}`,
      name: String(child?.name || "").trim(),
      year: Number(child?.year) || 1,
    }))
    .filter((child) => child.name)
    .slice(0, 6);

  const selected = normalized.find((child) => child.id === userData?.activeChildId) || normalized[0] || null;
  return {
    id: selected?.id || userData?.activeChildId || null,
    name: selected?.name || userData?.childName || "Belum ditetapkan",
    year: selected?.year || Number(userData?.childYear) || 1,
  };
}

function seededShuffle(arr, seed) {
  const out = [...arr];
  let s = Math.floor(Number(seed) || 1) % 2147483647;
  if (s <= 0) s += 2147483646;
  const rand = () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function playSound(type) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0.24, ctx.currentTime);
    if (type === "correct") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(523, ctx.currentTime);
      osc.frequency.setValueAtTime(784, ctx.currentTime + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
      osc.start();
      osc.stop(ctx.currentTime + 0.46);
    } else if (type === "wrong") {
      osc.type = "square";
      osc.frequency.setValueAtTime(260, ctx.currentTime);
      osc.frequency.setValueAtTime(180, ctx.currentTime + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.36);
      osc.start();
      osc.stop(ctx.currentTime + 0.36);
    } else if (type === "complete") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(523, ctx.currentTime);
      osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.75);
      osc.start();
      osc.stop(ctx.currentTime + 0.76);
    } else if (type === "start") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.setValueAtTime(620, ctx.currentTime + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.24);
      osc.start();
      osc.stop(ctx.currentTime + 0.24);
    }
  } catch (e) {
    // Ignore audio errors on restricted browsers.
  }
}

function Wau({ size = 44 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <polygon points="50,6 90,50 50,94 10,50" fill={COLORS.sun} stroke={COLORS.sunDark} strokeWidth="3" />
      <polygon points="50,6 70,50 50,94 30,50" fill={COLORS.hibiscus} opacity="0.85" />
      <circle cx="50" cy="50" r="8" fill={COLORS.cream} stroke={COLORS.sunDark} strokeWidth="2" />
    </svg>
  );
}

function Mascot({ mood }) {
  const face = mood === "happy" ? "🤩" : mood === "wrong" ? "😅" : mood === "celebrate" ? "🥳" : "😊";
  const anim = mood === "happy" ? "mascotBounce 0.5s ease" : mood === "wrong" ? "mascotShake 0.4s ease" : mood === "celebrate" ? "mascotBounce 0.6s ease 2" : "none";
  return <div style={{ fontSize: "44px", lineHeight: 1, animation: anim }}>{face}</div>;
}

function Stars({ score, total }) {
  const pct = total ? score / total : 0;
  const count = pct >= 0.9 ? 3 : pct >= 0.7 ? 2 : pct >= 0.5 ? 1 : 0;
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: "8px", margin: "10px 0" }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ fontSize: "34px", opacity: i < count ? 1 : 0.25, animation: i < count ? `starSpin 0.35s ease ${i * 0.1}s both` : "none" }}>⭐</div>
      ))}
    </div>
  );
}

function XPBadge({ xp, animate }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        background: "#FFF3CD",
        border: `1.5px solid ${COLORS.sun}`,
        borderRadius: "999px",
        padding: "4px 10px",
        fontSize: "13px",
        fontWeight: 700,
        color: COLORS.sunDark,
        transform: animate ? "scale(1.08)" : "scale(1)",
        transition: "transform 0.25s ease",
      }}
    >
      ⚡ {xp} XP
    </div>
  );
}

export default function App() {
  const { user, userData, loading, isPremium } = useAuth();
  const [screen, setScreen] = useState("home");
  const [tahun, setTahun] = useState(1);
  const [setKey, setSetKey] = useState("A");
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [xp, setXp] = useState(0);
  const [xpAnim, setXpAnim] = useState(false);
  const [selected, setSelected] = useState(null);
  const [locked, setLocked] = useState(false);
  const [attemptSeed, setAttemptSeed] = useState(0);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [history, setHistory] = useState([]);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [mascotMood, setMascotMood] = useState("neutral");
  const [toast, setToast] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [quizProgress, setQuizProgress] = useState({});
  const toastTimer = useRef(null);

  const activeChild = getActiveChildProfile(userData);
  const activeChildName = activeChild.name;
  const activeChildYear = activeChild.year;

  function getProgressKey(level, set) {
    const childPart = normalizeKeyPart(activeChildName || "child");
    const yearPart = Number(activeChildYear || level || 1);
    return `${childPart}-${yearPart}-${level}-${set}`;
  }

  function getProgressInfo(level, set) {
    const total = ((BANK[level] && BANK[level][set]) || []).length;
    const saved = quizProgress[getProgressKey(level, set)];
    if (!saved || !total) {
      return { answered: 0, total, pct: 0, completed: false, resumable: false };
    }
    const answered = saved.completed ? total : Math.max(0, Math.min(saved.resumeIndex || 0, total));
    const pct = Math.round((answered / total) * 100);
    return {
      answered,
      total,
      pct,
      completed: Boolean(saved.completed),
      resumable: answered > 0 && answered < total && !saved.completed,
    };
  }

  function progressLabel(level, set) {
    const p = getProgressInfo(level, set);
    if (!p.total) return "Belum mula";
    if (p.completed) return `Selesai ${p.total}/${p.total}`;
    if (!p.answered) return "Belum mula";
    return `${p.answered}/${p.total} (${p.pct}%)`;
  }

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes mascotBounce { 0%,100%{transform:translateY(0)} 40%{transform:translateY(-8px)} }
      @keyframes mascotShake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-5px)} 75%{transform:translateX(5px)} }
      @keyframes starSpin { 0%{transform:scale(0) rotate(-120deg);opacity:0} 100%{transform:scale(1) rotate(0);opacity:1} }
      @keyframes cardSlide { 0%{transform:translateX(25px);opacity:0} 100%{transform:translateX(0);opacity:1} }
      @keyframes correctPulse { 0%{box-shadow:0 0 0 0 rgba(92,138,58,0.5)} 100%{box-shadow:0 0 0 10px rgba(92,138,58,0)} }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
      clearTimeout(toastTimer.current);
    };
  }, []);

  useEffect(() => {
    return () => clearTimeout(toastTimer.current);
  }, []);

  useEffect(() => {
    setQuizProgress(userData?.setProgress || {});
  }, [userData?.setProgress]);

  function showToastMsg(msg) {
    clearTimeout(toastTimer.current);
    setToast(msg);
    setShowToast(true);
    toastTimer.current = setTimeout(() => setShowToast(false), 1800);
  }

  const questions = useMemo(() => {
    const set = (BANK[tahun] && BANK[tahun][setKey]) || [];
    const baseSeed = Number(attemptSeed) || 1;
    return seededShuffle(set, baseSeed + 31).map((q, idx) => {
      const indexed = q.opts.map((opt, i) => ({ opt, isCorrect: i === 0 }));
      const shuffled = seededShuffle(indexed, baseSeed + idx * 97 + 13);
      return {
        ...q,
        opts: shuffled.map((x) => x.opt),
        correct: shuffled.findIndex((x) => x.isCorrect),
      };
    });
  }, [tahun, setKey, attemptSeed]);

  const current = questions[qIndex];

  async function persistSetProgress(options = {}) {
    if (!user || screen !== "quiz") return;
    const level = options.level ?? tahun;
    const set = options.set ?? setKey;
    const totalQuestions = options.totalQuestions ?? ((BANK[level] && BANK[level][set]) || []).length;
    const resumeIndex = options.resumeIndex ?? Math.max(0, Math.min(qIndex + (locked ? 1 : 0), totalQuestions));
    const payload = {
      level,
      set,
      totalQuestions,
      resumeIndex,
      score: options.score ?? score,
      xp: options.xp ?? xp,
      streak: options.streak ?? streak,
      bestStreak: options.bestStreak ?? bestStreak,
      attemptSeed: options.attemptSeed ?? attemptSeed,
      history: options.history ?? history,
      completed: Boolean(options.completed),
      updatedAt: new Date(),
    };
    const key = getProgressKey(level, set);
    setQuizProgress((prev) => ({ ...prev, [key]: payload }));
    try {
      await updateDoc(doc(db, "users", user.uid), {
        [`setProgress.${key}`]: payload,
      });
    } catch (err) {
      console.error("Error saving set progress:", err);
    }
  }

  useEffect(() => {
    if (screen !== "quiz" || !user) return;
    persistSetProgress();
  }, [screen, user, tahun, setKey, qIndex, locked, score, xp, streak, bestStreak, history, attemptSeed]);

  function startQuiz(level, set) {
    // Check if user is trying to access premium content
    if ((set === "B" || set === "C") && !isPremium) {
      setShowUpgradeModal(true);
      return;
    }

    const existing = quizProgress[getProgressKey(level, set)];
    if (existing && !existing.completed && (existing.resumeIndex || 0) > 0) {
      playSound("start");
      setTahun(level);
      setSetKey(set);
      setQIndex(Math.max(0, Math.min(existing.resumeIndex, Math.max(0, ((BANK[level] && BANK[level][set]) || []).length - 1))));
      setScore(existing.score || 0);
      setXp(existing.xp || 0);
      setXpAnim(false);
      setSelected(null);
      setLocked(false);
      setHistory(existing.history || []);
      setStreak(existing.streak || 0);
      setBestStreak(existing.bestStreak || 0);
      setMascotMood("neutral");
      setConfetti(false);
      setAttemptSeed(existing.attemptSeed || Date.now());
      setScreen("quiz");
      showToastMsg("Sambung dari soalan terakhir anda");
      return;
    }

    playSound("start");
    setTahun(level);
    setSetKey(set);
    setQIndex(0);
    setScore(0);
    setXp(0);
    setXpAnim(false);
    setSelected(null);
    setLocked(false);
    setHistory([]);
    setStreak(0);
    setBestStreak(0);
    setMascotMood("neutral");
    setConfetti(false);
    setAttemptSeed(Date.now());
    setScreen("quiz");
  }

  function choose(i) {
    if (locked) return;
    setSelected(i);
    setLocked(true);
    const correct = i === current.correct;
    if (correct) {
      setScore(s => s + 1);
      const nextStreak = streak + 1;
      const earned = 10 + Math.max(0, (nextStreak - 1) * 5);
      setStreak(nextStreak);
      setBestStreak((prev) => Math.max(prev, nextStreak));
      setXp((prev) => prev + earned);
      setXpAnim(true);
      setTimeout(() => setXpAnim(false), 300);
      setMascotMood("happy");
      playSound("correct");
      const streakMsg = STREAK_MSGS[Math.min(nextStreak, STREAK_MSGS.length - 1)];
      showToastMsg(streakMsg || CORRECT_MSGS[Math.floor(Math.random() * CORRECT_MSGS.length)]);
    } else {
      setStreak(0);
      setMascotMood("wrong");
      playSound("wrong");
      showToastMsg(WRONG_MSGS[Math.floor(Math.random() * WRONG_MSGS.length)]);
    }
    setHistory((prev) => [...prev, { q: current.q, correct }]);
  }

  async function next() {
    if (qIndex + 1 < questions.length) {
      setMascotMood("neutral");
      setLocked(false);
      setSelected(null);
      setQIndex(i => i + 1);
    } else {
      await persistSetProgress({
        completed: true,
        level: tahun,
        set: setKey,
        totalQuestions: questions.length,
        resumeIndex: questions.length,
      });
      // Save score to Firestore
      await saveScore();
      if (score / questions.length >= 0.6) {
        setConfetti(true);
        setTimeout(() => setConfetti(false), 2400);
      }
      setMascotMood("celebrate");
      playSound("complete");
      setScreen("result");
    }
  }

  async function saveScore() {
    if (!user) return;
    try {
      const accuracy = Math.round((score / questions.length) * 100);
      
      // Save to scores collection
      await addDoc(collection(db, "users", user.uid, "quizAttempts"), {
        parentName: userData?.parentName || userData?.displayName || "",
        childId: activeChild.id || null,
        childName: activeChildName || "",
        childYear: activeChildYear || tahun,
        year: tahun,
        set: setKey,
        score,
        totalQuestions: questions.length,
        accuracy,
        timestamp: new Date(),
      });

      // Update user stats
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);
      const currentData = userDoc.data();
      const totalAnswered = (currentData.totalQuestionsAnswered || 0) + questions.length;
      const totalScore = (currentData.totalScore || 0) + score;
      const newAccuracy = Math.round((totalScore / totalAnswered) * 100);

      await updateDoc(userRef, {
        totalQuestionsAnswered: totalAnswered,
        totalScore: totalScore,
        accuracy: newAccuracy,
      });
    } catch (err) {
      console.error("Error saving score:", err);
    }
  }

  if (loading) {
    return (
      <div style={{ padding: 18, textAlign: "center", marginTop: 100, fontFamily: "'Trebuchet MS', 'Segoe UI', sans-serif", color: COLORS.skyDark }}>
        <p style={{ fontWeight: 700 }}>Memuat...</p>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  const answeredCount = qIndex + (locked ? 1 : 0);
  const wrongCount = Math.max(0, answeredCount - score);
  const progressPct = questions.length ? (qIndex + (locked ? 1 : 0)) / questions.length : 0;
  const progressColor = progressPct < 0.4 ? COLORS.hibiscus : progressPct < 0.7 ? COLORS.sun : COLORS.leaf;

  return (
    <div style={{ maxWidth: 820, margin: "20px auto", padding: "0 12px", fontFamily: "var(--font-body)" }}>
      <div style={{ background: COLORS.cream, borderRadius: 18, overflow: "hidden", boxShadow: "0 8px 26px rgba(0,0,0,0.08)", position: "relative" }}>
        {confetti && (
          <>
            <style>{`@keyframes fall{0%{transform:translateY(-20px) rotate(0deg);opacity:1}100%{transform:translateY(300px) rotate(320deg);opacity:0}}`}</style>
            {[...Array(20)].map((_, idx) => (
              <span
                key={idx}
                style={{
                  position: "absolute",
                  top: 0,
                  left: `${(idx * 37) % 100}%`,
                  fontSize: 16,
                  zIndex: 8,
                  animation: `fall ${0.9 + (idx % 5) * 0.25}s ease-out forwards`,
                }}
              >
                {idx % 3 === 0 ? "🎉" : idx % 3 === 1 ? "✨" : "⭐"}
              </span>
            ))}
          </>
        )}
        {showToast && (
          <div style={{ position: "absolute", top: 72, left: "50%", transform: "translateX(-50%)", zIndex: 10, background: "white", border: `2px solid ${COLORS.sun}`, color: COLORS.ink, padding: "8px 14px", borderRadius: 999, fontSize: 13, fontWeight: 700, boxShadow: "0 4px 16px rgba(0,0,0,0.14)" }}>
            {toast}
          </div>
        )}
        <header style={{ marginBottom: 0, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 18px", background: `linear-gradient(135deg, ${COLORS.skyDark}, ${COLORS.sky})` }}>
          <Wau size={42} />
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: 0, color: "white", fontSize: 24, fontFamily: "var(--font-display)", letterSpacing: 0.3 }}>Kelas Bahasa Melayu</h2>
            <div style={{ color: "#D9EDF7", fontSize: 13, userSelect: "none", WebkitUserSelect: "none" }}>Latihan interaktif Tahun 1–6 · KSSR</div>
            <div style={{ color: "#E8F6FF", fontSize: 12, marginTop: 4, userSelect: "none", WebkitUserSelect: "none" }}>Anak aktif: {activeChildName} · Tahun {activeChildYear}</div>
          </div>
          {screen === "quiz" && <XPBadge xp={xp} animate={xpAnim} />}
          <button
            onClick={() => setScreen('dashboard')}
            style={{
              padding: "8px 12px",
              cursor: "pointer",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.5)",
              fontSize: 16,
              background: "rgba(255,255,255,0.2)",
              color: "white",
            }}
          >
            👤
          </button>
        </header>

        <div style={{ padding: 18 }}>

      {screen === 'dashboard' && (
        <DashboardScreen
          onBack={() => setScreen('home')}
          onStartQuiz={(action) => {
            if (action === 'upgrade') {
              setShowUpgradeModal(true);
              return;
            }
            setScreen('home');
          }}
        />
      )}

      {screen === 'home' && (
        <div>
          <div style={{ background: "#E3F2FA", borderRadius: 12, padding: "10px 14px", marginBottom: 16, border: `1px solid ${COLORS.sky}` }}>
            <div style={{ fontSize: 11, color: COLORS.skyDark, fontWeight: 700 }}>Profil aktif</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.ink }}>Nama anak: {activeChildName}</div>
            <div style={{ fontSize: 12, color: COLORS.ink, opacity: 0.85 }}>Tahun {activeChildYear} · Score dan progress akan disimpan di profil ini.</div>
          </div>
          <div style={{ textAlign: "center", marginBottom: "18px" }}>
            <div style={{ fontSize: "40px" }}>🏆</div>
            <p style={{ marginTop: 8, color: COLORS.ink, fontSize: 15, lineHeight: 1.45 }}>Pilih tahun dan set latihan. Jawab soalan, kumpul XP, dan pecahkan rekod skor terbaik kamu! 🔥</p>
          </div>
          {[Number(activeChildYear) || 1]
            .filter((year) => YEARS.includes(year))
            .map((lv) => (
            <div key={lv} style={{ marginBottom: 14, padding: 18, border: `2px solid ${COLORS.sky}`, borderRadius: 16, background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: "wrap", marginBottom: 8 }}>
                <strong style={{ color: COLORS.skyDark, fontSize: 17, fontFamily: "var(--font-display)" }}>Tahun {lv}</strong>
                <small style={{ color: '#666', textAlign: "left", lineHeight: 1.35, flex: "1 1 260px", fontSize: 13 }}>A: 20 soalan percuma · B/KBAT: 20 soalan Premium</small>
              </div>
              <div style={{ fontSize: 12, color: COLORS.ink, opacity: 0.82, marginBottom: 12, lineHeight: 1.4 }}>{YEAR_FOCUS[lv]}</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(88px, 1fr))", gap: 8, marginBottom: 10 }}>
                <div style={{ background: "#F2F8FB", borderRadius: 9, padding: "6px 8px", border: `1px solid ${COLORS.sky}` }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: COLORS.skyDark }}>Set A</div>
                  <div style={{ fontSize: 11, color: COLORS.ink }}>{progressLabel(lv, "A")}</div>
                </div>
                <div style={{ background: "#FFF7EA", borderRadius: 9, padding: "6px 8px", border: `1px solid ${COLORS.sun}` }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: COLORS.sunDark }}>Set B</div>
                  <div style={{ fontSize: 11, color: COLORS.ink }}>{progressLabel(lv, "B")}</div>
                </div>
                <div style={{ background: "#FCEFF1", borderRadius: 9, padding: "6px 8px", border: `1px solid ${COLORS.hibiscus}` }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: COLORS.hibiscusDark }}>KBAT</div>
                  <div style={{ fontSize: 11, color: COLORS.ink }}>{progressLabel(lv, "C")}</div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 12 }}>
                <button
                  onClick={() => startQuiz(lv, 'A')}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 4,
                    border: "none",
                    borderRadius: 12,
                    padding: "12px 8px",
                    background: COLORS.sky,
                    color: "white",
                    cursor: "pointer",
                    fontWeight: 700,
                    fontSize: 14,
                    fontFamily: "inherit",
                    lineHeight: 1.15,
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                >
                  <span>📘 Set A</span>
                  <span style={{ fontSize: 10, opacity: 0.9 }}>{getProgressInfo(lv, "A").resumable ? "Sambung" : "Mula"}</span>
                </button>
                <button
                  onClick={() => startQuiz(lv, 'B')}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 4,
                    border: "none",
                    borderRadius: 12,
                    padding: "12px 8px",
                    background: COLORS.sun,
                    color: COLORS.sunDark,
                    opacity: isPremium ? 1 : 0.58,
                    cursor: isPremium ? 'pointer' : 'not-allowed',
                    fontWeight: 700,
                    fontSize: 14,
                    fontFamily: "inherit",
                    lineHeight: 1.15,
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                >
                  <span>📙 Set B {!isPremium ? '🔒' : ''}</span>
                  <span style={{ fontSize: 10, opacity: 0.9 }}>{getProgressInfo(lv, "B").resumable ? "Sambung" : "Mula"}</span>
                </button>
                <button
                  onClick={() => startQuiz(lv, 'C')}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 4,
                    border: "none",
                    borderRadius: 12,
                    padding: "12px 8px",
                    background: COLORS.hibiscus,
                    color: "white",
                    opacity: isPremium ? 1 : 0.58,
                    cursor: isPremium ? 'pointer' : 'not-allowed',
                    fontWeight: 700,
                    fontSize: 14,
                    fontFamily: "inherit",
                    lineHeight: 1.15,
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                >
                  <span>🧠 KBAT {!isPremium ? '🔒' : ''}</span>
                  <span style={{ fontSize: 10, opacity: 0.9 }}>{getProgressInfo(lv, "C").resumable ? "Sambung" : "Mula"}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {screen === 'quiz' && current && (
        <div style={{ background: "white", padding: 14, borderRadius: 14, border: "1px solid #E5E0CF" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <button
              onClick={() => setScreen('home')}
              style={{ border: "1px solid #D8D2BE", background: "#fff", borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontWeight: 700, fontFamily: "inherit", color: COLORS.skyDark }}
            >
              ← Kembali
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {streak >= 2 && <div style={{ fontSize: 12, color: "#8A5A0F", fontWeight: 700 }}>🔥 {streak}</div>}
              <div style={{ fontSize: 12, color: COLORS.ink }}>{qIndex + 1}/{questions.length}</div>
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 999, display: "inline-block", color: current.type === "kbat" ? COLORS.hibiscusDark : COLORS.leafDark, background: current.type === "kbat" ? "#FCEBEB" : "#EAF3DE" }}>
              {TOPIC_LABEL[current.type] || current.type}
            </div>
          </div>
          <div style={{ height: 8, background: "#E5E0CF", borderRadius: 999, marginBottom: 12, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progressPct * 100}%`, background: progressColor, borderRadius: 999, transition: "width 0.35s ease" }} />
          </div>
          <div style={{ textAlign: "center", marginBottom: 10 }}>
            <Mascot mood={mascotMood} />
          </div>
          {current.img && <div style={{ fontSize: 42, textAlign: 'center', marginBottom: 8, background: "#F5F1E2", borderRadius: 12, padding: 10 }}>{current.img}</div>}
          <div style={{ marginBottom: 12, fontWeight: 700, lineHeight: 1.5, color: COLORS.ink, animation: "cardSlide 0.25s ease", fontSize: 16 }}>{current.q}</div>
          <div style={{ display: 'grid', gap: 8 }}>
            {current.opts.map((opt, i) => (
              <button
                key={i}
                onClick={() => choose(i)}
                disabled={locked}
                style={{
                  padding: 11,
                  textAlign: 'left',
                  borderRadius: 10,
                  backgroundColor: locked && i === current.correct ? '#EAF3DE' : selected === i && i !== current.correct ? '#FCEBEB' : '#fff',
                  border: `2px solid ${locked && i === current.correct ? COLORS.leaf : selected === i && i !== current.correct ? COLORS.hibiscus : '#ddd'}`,
                  cursor: locked ? 'default' : 'pointer',
                  fontFamily: "inherit",
                  animation: locked && i === current.correct ? "correctPulse 0.35s ease" : "none",
                }}
              >
                <strong style={{ marginRight: 8 }}>{String.fromCharCode(65 + i)}.</strong> {opt}
              </button>
            ))}
          </div>

          <div style={{ marginTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ color: COLORS.ink, fontWeight: 700, fontSize: 13 }}>✅ {score} betul | 💬 {wrongCount} salah</div>
            <div>
              <button
                onClick={next}
                disabled={!locked}
                style={{
                  padding: '9px 14px',
                  cursor: locked ? 'pointer' : 'not-allowed',
                  borderRadius: 10,
                  border: "none",
                  fontFamily: "inherit",
                  background: locked ? `linear-gradient(135deg, ${COLORS.sky}, ${COLORS.skyDark})` : "#D8D2BE",
                  color: "white",
                  fontWeight: 700,
                }}
              >
                {qIndex + 1 < questions.length ? 'Seterusnya →' : 'Selesai! 🎉'}
              </button>
            </div>
          </div>
        </div>
      )}

      {screen === 'result' && (
        <div style={{ textAlign: 'center', background: "white", borderRadius: 14, padding: 16, border: "1px solid #E5E0CF" }}>
          <Mascot mood="celebrate" />
          <Stars score={score} total={questions.length} />
          <h3 style={{ color: COLORS.skyDark, marginTop: 4, fontFamily: "var(--font-display)", fontSize: 28 }}>Keputusan</h3>
          <div style={{ fontSize: 34, fontWeight: 700, color: COLORS.skyDark }}>{score} / {questions.length}</div>
          <div style={{ fontSize: 14, color: '#666', marginBottom: 14 }}>
            Ketepatan: {Math.round((score / questions.length) * 100)}%
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 14, flexWrap: "wrap" }}>
            <div style={{ background: "#EAF3DE", borderRadius: 10, padding: "8px 14px" }}>
              <div style={{ fontSize: 11, color: COLORS.leafDark }}>XP Dikumpul</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.leafDark }}>⚡ {xp}</div>
            </div>
            <div style={{ background: "#FFF3CD", borderRadius: 10, padding: "8px 14px" }}>
              <div style={{ fontSize: 11, color: COLORS.sunDark }}>Streak Terbaik</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.sunDark }}>🔥 {bestStreak}</div>
            </div>
          </div>
          <div style={{ textAlign: "left", background: "white", borderRadius: 12, padding: "10px 14px", border: "1px solid #E5E0CF", maxHeight: 170, overflowY: "auto", marginBottom: 12 }}>
            {history.map((h, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "5px 0", borderBottom: i < history.length - 1 ? "1px solid #F0EBDD" : "none", gap: 8 }}>
                <span style={{ color: COLORS.ink, flex: 1 }}>{h.q.length > 55 ? `${h.q.slice(0, 55)}...` : h.q}</span>
                <span style={{ color: h.correct ? COLORS.leafDark : COLORS.hibiscusDark, fontWeight: 700, flexShrink: 0 }}>{h.correct ? "✓" : "✗"}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12, display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
            <button
              onClick={() => startQuiz(tahun, setKey)}
              style={{ border: "none", borderRadius: 10, padding: "10px 14px", background: COLORS.sun, color: COLORS.sunDark, cursor: "pointer", fontWeight: 700, fontFamily: "inherit" }}
            >
              🔄 Cuba lagi
            </button>
            <button
              onClick={() => setScreen('home')}
              style={{ border: "none", borderRadius: 10, padding: "10px 14px", background: COLORS.sky, color: "white", cursor: "pointer", fontWeight: 700, fontFamily: "inherit" }}
            >
              🏠 Menu
            </button>
          </div>
        </div>
      )}

      {showUpgradeModal && (
        <UpgradeModal onClose={() => setShowUpgradeModal(false)} />
      )}

        </div>
      </div>
    </div>
  );
}
