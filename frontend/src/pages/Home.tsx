import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loadPreferences } from "../lib/store";

export function HomePage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");

  useEffect(() => {
    loadPreferences().then((p) => {
      if (!p.onboarded) navigate("/onboarding");
      setName(p.name);
    });
  }, [navigate]);

  return (
    <section>
      <div className="hero">
        <p className="quiet" style={{ margin: "0 0 0.3rem", fontWeight: 600 }}>
          {name ? `Welcome back, ${name} · Outdoor Companion` : "Outdoor Adventure Companion"}
        </p>
        <h1 style={{ fontSize: "clamp(2.3rem, 6vw, 3.6rem)", marginBottom: "0.2rem" }}>
          Ready to touch grass?
        </h1>
        <p className="tagline serif" style={{ fontSize: "1.3rem", color: "var(--moss)", fontWeight: 600 }}>
          Plan less. Explore more.
        </p>
        <p style={{ maxWidth: "560px", marginBottom: "1.5rem", fontSize: "1.05rem" }}>
          Turn any ordinary walk into a real-world outdoor adventure using open-weight AI. Download your pack, put your phone away, and connect with the living world around you.
        </p>

        <div className="stack" style={{ gap: "0.75rem" }}>
          <Link className="btn" to="/create" style={{ padding: "1rem 1.6rem", fontSize: "1.1rem" }}>
            🧭 Create Adventure
          </Link>
          <Link className="btn secondary" to="/demo" style={{ padding: "0.85rem 1.4rem" }}>
            🏕️ Try 60-Minute Nature Hunt (1-Click Demo)
          </Link>
        </div>
      </div>

      <div className="badge-grid" style={{ margin: "2rem 0 1.5rem" }}>
        <div className="badge-card">🌿 Living Nature</div>
        <div className="badge-card">🧭 Real Exploration</div>
        <div className="badge-card">📍 OSM Walk Loops</div>
        <div className="badge-card">🔒 On-Device Privacy</div>
        <div className="badge-card">📴 Zero-Cell Offline</div>
        <div className="badge-card">🤖 Open-Weight AI</div>
      </div>

      <div className="stack" style={{ marginTop: "1rem" }}>
        <Link className="card" to="/adventures" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ margin: "0 0 0.2rem" }}>🗺️ My Adventures</h3>
            <p className="quiet" style={{ margin: 0 }}>Downloaded packs and offline trails saved on this device.</p>
          </div>
          <span style={{ fontSize: "1.3rem" }}>→</span>
        </Link>
        <Link className="card" to="/journal" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ margin: "0 0 0.2rem" }}>📖 Adventure Journal</h3>
            <p className="quiet" style={{ margin: 0 }}>Digital nature scrapbook generated after you come home.</p>
          </div>
          <span style={{ fontSize: "1.3rem" }}>→</span>
        </Link>
        <Link className="card" to="/settings" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ margin: "0 0 0.2rem" }}>⚙️ Settings & Privacy</h3>
            <p className="quiet" style={{ margin: 0 }}>Dark mode, local data controls, and open AI status.</p>
          </div>
          <span style={{ fontSize: "1.3rem" }}>→</span>
        </Link>
      </div>
    </section>
  );
}

