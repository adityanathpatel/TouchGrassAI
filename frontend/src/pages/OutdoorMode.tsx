import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { StatusBar } from "../components/StatusBar";
import { loadPack, persistPack } from "../lib/store";
import type { PackedAdventure } from "../types";

export function OutdoorModePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pack, setPack] = useState<PackedAdventure | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [showChecklist, setShowChecklist] = useState(false);

  useEffect(() => {
    if (!id) return;
    loadPack(id).then((p) => {
      if (!p) return;
      const started = p.startedAt || new Date().toISOString();
      const next = { ...p, status: "active" as const, startedAt: started };
      persistPack(next);
      setPack(next);
    });
  }, [id]);

  useEffect(() => {
    if (!pack?.startedAt) return;
    const interval = setInterval(() => {
      const diff = Math.floor((Date.now() - new Date(pack.startedAt!).getTime()) / 60000);
      setElapsed(diff);
    }, 10000);
    const initialDiff = Math.floor((Date.now() - new Date(pack.startedAt).getTime()) / 60000);
    setElapsed(initialDiff);
    return () => clearInterval(interval);
  }, [pack?.startedAt]);

  if (!pack) return <div className="outdoor">Loading adventure…</div>;
  const done = pack.missions.filter((m) => m.completed).length;
  const current = pack.missions.find((m) => !m.completed) || pack.missions[pack.missions.length - 1];

  async function completeCurrent() {
    if (!pack || !current) return;
    const missions = pack.missions.map((m) => (m.id === current.id ? { ...m, completed: true } : m));
    const next: PackedAdventure = { ...pack, missions };
    await persistPack(next);
    setPack(next);
  }

  async function toggleChecklist(itemId: string) {
    if (!pack) return;
    const checklist = pack.checklist.map((c) => (c.id === itemId ? { ...c, completed: !c.completed } : c));
    const next: PackedAdventure = { ...pack, checklist };
    await persistPack(next);
    setPack(next);
  }

  return (
    <div className="outdoor">
      <div className="topbar">
        <strong>TouchGrass</strong>
        <StatusBar />
      </div>
      {pack.is_demo && <span className="demo-flag">Demo Mode</span>}
      <p className="quiet" style={{ margin: "0.4rem 0" }}>Use the phone briefly, then put it away.</p>
      
      <h1>🌿 {pack.plan.title}</h1>
      
      <div style={{ display: "flex", gap: "1.2rem", margin: "0.5rem 0", color: "#d7e4d4" }}>
        <span>📍 {pack.route?.distance_km ?? "—"} km</span>
        <span>⏱️ {elapsed}m / {pack.plan.duration_minutes}m</span>
        <span>📸 {pack.observations.length} notices</span>
      </div>

      <p className="progress" style={{ margin: "0.8rem 0 0.2rem" }}>
        Missions: {done}/{pack.missions.length}
      </p>

      <p className="quiet" style={{ margin: "0.2rem 0" }}>Current mission</p>
      <div className="card" style={{ background: "#21462f", border: "1px solid #3c6e4e", margin: "0.5rem 0 1rem" }}>
        <p className="mission" style={{ margin: 0, fontSize: "1.25rem", color: "#fff" }}>
          {current?.prompt || "All missions completed! Feel free to explore freely."}
        </p>
      </div>

      {current && !current.completed && (
        <button className="btn" onClick={completeCurrent}>
          ✓ Mark Mission Complete
        </button>
      )}

      <Link className="btn secondary" to={`/observe/${pack.id}`} style={{ display: "block", textAlign: "center" }}>
        📸 Add Observation / Note
      </Link>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
        <button
          className="btn secondary"
          type="button"
          onClick={() => setShowChecklist(!showChecklist)}
        >
          📋 {showChecklist ? "Hide Checklist" : "Checklist"}
        </button>
        <Link className="btn secondary" to={`/map/${pack.id}`} style={{ textAlign: "center" }}>
          🗺️ Route Map
        </Link>
      </div>

      {showChecklist && (
        <div className="card" style={{ background: "#1c3d29", border: "1px solid #3c6e4e", margin: "0.8rem 0" }}>
          <strong style={{ color: "#fff" }}>Outdoor Checklist</strong>
          <div style={{ marginTop: "0.5rem" }}>
            {pack.checklist.map((c) => (
              <label key={c.id} style={{ display: "flex", alignItems: "center", gap: "0.5rem", margin: "0.4rem 0", color: "#d7e4d4", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={!!c.completed}
                  onChange={() => toggleChecklist(c.id)}
                />
                <span style={{ textDecoration: c.completed ? "line-through" : "none" }}>{c.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: "1rem" }}>
        <a className="btn secondary" href="tel:112" style={{ display: "block", textAlign: "center", borderColor: "#a65232", color: "#ffb499" }}>
          🆘 Emergency (112)
        </a>
        <button
          className="btn secondary"
          style={{ width: "100%", marginTop: "0.5rem", background: "rgba(255,255,255,0.08)" }}
          onClick={() => navigate(`/finish/${pack.id}`)}
        >
          🏁 Finish Adventure
        </button>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem", fontSize: "0.88rem" }}>
        <Link to={`/progress/${pack.id}`} style={{ color: "#d7e4d4" }}>
          Detailed progress →
        </Link>
        <span className="quiet" style={{ color: "#8ea88c" }}>Stay on marked paths</span>
      </div>
    </div>
  );
}
