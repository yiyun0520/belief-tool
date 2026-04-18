import { useAuth } from "./useAuth";
import LoginScreen from "./LoginScreen";
import BeliefApp from "./BeliefApp";

const THEMES_MINIMAL = {
  d1: { bg: "#23232E", t1: "#E8E6F4", t3: "#9B98B0", accent: "#6B63D4" },
};

function LoadingScreen() {
  const th = THEMES_MINIMAL.d1;
  return (
    <div style={{
      minHeight: "100vh",
      background: th.bg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: 16,
      fontFamily: "'Noto Sans TC','Noto Sans JP',system-ui,sans-serif",
    }}>
      <div style={{
        width: 36,
        height: 36,
        border: `2px solid ${th.accent}44`,
        borderTop: `2px solid ${th.accent}`,
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }} />
      <span style={{ color: th.t3, fontSize: 13 }}>Loading…</span>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

export default function App() {
  const { user, loading, login, logout } = useAuth();

  if (loading) return <LoadingScreen />;
  if (!user) return <LoginScreen onLogin={login} />;
  return <BeliefApp user={user} onLogout={logout} />;
}
