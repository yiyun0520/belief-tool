import { useState } from "react";
import { LogIn } from "lucide-react";

const THEMES = {
  d1: { bg: "#23232E", bgDeep: "#1A1A24", bgCard: "#2A2A38", border: "#3A3848", accent: "#6B63D4", t1: "#E8E6F4", t2: "#C0BDDA", t3: "#9B98B0" },
};

const SK = "ba-v2-settings";

function ldLang() {
  try {
    const s = JSON.parse(localStorage.getItem(SK));
    return s?.lang || "zh";
  } catch { return "zh"; }
}
function saveLang(lang) {
  try {
    const s = JSON.parse(localStorage.getItem(SK)) || {};
    localStorage.setItem(SK, JSON.stringify({ ...s, lang }));
  } catch {}
}

export default function LoginScreen({ onLogin }) {
  const [lang, setLang] = useState(ldLang);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const th = THEMES.d1;
  const ff = "'Noto Sans TC','Noto Sans JP',system-ui,sans-serif";

  function switchLang(l) {
    setLang(l);
    saveLang(l);
  }

  async function handleLogin() {
    setLoading(true);
    setErr(null);
    try { await onLogin(); }
    catch (e) {
      if (e.code !== "auth/popup-closed-by-user") {
        setErr(lang === "ja" ? "ログインに失敗しました" : "登入失敗，請再試");
      }
    } finally { setLoading(false); }
  }

  const isJa = lang === "ja";

  return (
    <div style={{
      minHeight: "100vh",
      background: th.bg,
      fontFamily: ff,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
    }}>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>

      {/* Lang switcher top-right */}
      <div style={{ position: "fixed", top: 16, right: 16, display: "flex", gap: 6 }}>
        {["zh", "ja"].map((l) => (
          <button key={l} onClick={() => switchLang(l)} style={{
            background: lang === l ? th.accent : "none",
            border: `0.5px solid ${lang === l ? th.accent : th.border}`,
            borderRadius: 8,
            color: lang === l ? "#fff" : th.t3,
            padding: "4px 10px",
            fontSize: 12,
            cursor: "pointer",
            fontFamily: ff,
          }}>
            {l === "zh" ? "中文" : "日本語"}
          </button>
        ))}
      </div>

      {/* Card */}
      <div style={{
        background: th.bgCard,
        border: `0.5px solid ${th.border}`,
        borderRadius: 20,
        padding: "40px 32px",
        maxWidth: 380,
        width: "100%",
        textAlign: "center",
      }}>
        {/* Icon */}
        <div style={{
          width: 56,
          height: 56,
          borderRadius: 16,
          background: th.accent + "22",
          border: `0.5px solid ${th.accent}44`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 20px",
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke={th.accent} strokeWidth="1.5"/>
            <path d="M12 8v4l2.5 2.5" stroke={th.accent} strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>

        {/* Title */}
        <h1 style={{ color: th.t1, fontSize: 20, fontWeight: 600, margin: "0 0 6px", lineHeight: 1.4 }}>
          {isJa ? "ビリーフ覚察ツール" : "信念覺察工具"}
        </h1>
        <p style={{ color: th.t3, fontSize: 12, margin: "0 0 4px" }}>
          {isJa ? "Belief Awareness" : "Belief Awareness"}
        </p>
        <p style={{ color: th.t2, fontSize: 13, lineHeight: 1.7, margin: "16px 0 28px" }}>
          {isJa
            ? "ビリーフとあなたの関係を\n継続的に観察する場所"
            : "持續觀察信念與你的關係"}
        </p>

        {/* Google login button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            background: th.accent,
            color: "#fff",
            border: "none",
            borderRadius: 20,
            padding: "13px 24px",
            fontSize: 14,
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
            fontFamily: ff,
            transition: "opacity 0.15s",
          }}
        >
          {loading ? (
            <div style={{ width: 18, height: 18, border: "2px solid #ffffff44", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          ) : (
            <LogIn size={18} />
          )}
          {isJa ? "Googleでログイン" : "使用 Google 登入"}
        </button>

        {err && (
          <p style={{ color: "#E07A8A", fontSize: 13, marginTop: 12, marginBottom: 0 }}>{err}</p>
        )}

        <p style={{ color: th.t3, fontSize: 11, margin: "20px 0 0", lineHeight: 1.6 }}>
          {isJa
            ? "Googleアカウントでログインするとデータがクラウドに保存され、複数のデバイスで同期されます。"
            : "使用 Google 帳號登入後，資料將同步到雲端，可在多個裝置使用。"}
        </p>
      </div>

      <p style={{ color: th.t3, fontSize: 11, marginTop: 20 }}>v3.0</p>
    </div>
  );
}
