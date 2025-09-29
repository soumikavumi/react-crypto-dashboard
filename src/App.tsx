import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import CoinDetail from "./pages/CoinDetail";
import Navbar from "./components/Navbar";
import "./index.css";
import "./styles.css";

export default function App() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("theme");
    return (saved === "light" || saved === "dark") ? (saved as "light" | "dark") : "dark";
  });

  useEffect(() => {
    document.documentElement.classList.remove("light");
    if (theme === "light") document.documentElement.classList.add("light");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <>
      <div className="container" style={{ paddingTop: 16 }}>
        <Navbar theme={theme} onToggleTheme={() => setTheme(theme === "light" ? "dark" : "light")} />
      </div>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/coin/:id" element={<CoinDetail />} />
      </Routes>
    </>
  );
}
