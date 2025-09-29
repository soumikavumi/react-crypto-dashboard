import { Link } from "react-router-dom";

type Props = {
  theme: "light" | "dark";
  onToggleTheme: () => void;
};

export default function Navbar({ theme, onToggleTheme }: Props) {
  return (
    <nav className="card" style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "space-between" }}>
      <Link to="/" style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <strong style={{ fontSize: 18 }}>CryptoView</strong>
        <span className="badge" style={{ background: "rgba(56,189,248,.15)", color: "var(--accent)" }}>React + TS</span>
      </Link>
      <div style={{ display: "flex", gap: 8 }}>
        <button className="button" onClick={onToggleTheme}>
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
        <a className="button" href="https://www.coingecko.com/en/api" target="_blank" rel="noreferrer">API</a>
        <a className="button" href="https://github.com/" target="_blank" rel="noreferrer">GitHub</a>
      </div>
    </nav>
  );
}
