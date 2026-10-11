import { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { StatusBar } from "./StatusBar";

export function Layout({ children, outdoor = false }: { children: React.ReactNode; outdoor?: boolean }) {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem("touchgrass_theme") === "dark" ||
      (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches && localStorage.getItem("touchgrass_theme") !== "light");
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("touchgrass_theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("touchgrass_theme", "light");
    }
  }, [dark]);

  if (outdoor) return <>{children}</>;

  return (
    <div className="shell">
      <header className="topbar">
        <Link to="/" className="brand">
          🌿 TouchGrass AI
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={() => setDark(!dark)}
            title={dark ? "Switch to daylight mode" : "Switch to forest night mode"}
          >
            {dark ? "☀️" : "🌙"}
          </button>
          <StatusBar />
        </div>
      </header>
      {children}
      <nav className="nav-bottom">
        <NavLink to="/" end>
          <span>🌿</span> Home
        </NavLink>
        <NavLink to="/adventures">
          <span>🗺️</span> Walks
        </NavLink>
        <NavLink to="/journal">
          <span>📖</span> Journal
        </NavLink>
        <NavLink to="/settings">
          <span>⚙️</span> Settings
        </NavLink>
      </nav>
    </div>
  );
}

