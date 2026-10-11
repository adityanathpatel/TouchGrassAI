import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MapView } from "../components/MapView";
import { persistPack } from "../lib/store";
import type { PackedAdventure } from "../types";

export function AdventurePreviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const pack = useMemo(() => {
    const raw = sessionStorage.getItem("draftPack");
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PackedAdventure;
    if (id && parsed.id !== id) return parsed;
    return parsed;
  }, [id]);

  if (!pack) {
    return (
      <section>
        <h1>No draft</h1>
        <p>Create an adventure first.</p>
        <Link to="/create">Create Adventure</Link>
      </section>
    );
  }

  const { plan, route } = pack;
  return (
    <section>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.4rem" }}>
        <span className="pill online">🌿 Ready to explore</span>
        {pack.is_demo && <span className="demo-flag">Demo data</span>}
      </div>

      <h1 style={{ marginBottom: "0.2rem" }}>{plan.title}</h1>
      <p style={{ fontSize: "1.05rem", marginBottom: "1rem" }}>{plan.description}</p>

      {/* Prominent Metadata Pills */}
      <div className="stats" style={{ marginBottom: "1.2rem" }}>
        <div className="stat">
          <b>⏱️ {plan.duration_minutes} min</b>
          Planned Duration
        </div>
        <div className="stat">
          <b>📍 {route?.distance_km ?? "—"} km</b>
          Walking Distance
        </div>
        <div className="stat">
          <b>🧗 {plan.difficulty}</b>
          Difficulty Level
        </div>
        <div className="stat">
          <b>🌿 {pack.activity}</b>
          Activity Type
        </div>
      </div>

      <div className="card" style={{ marginBottom: "1.2rem", background: "var(--bg-deep)" }}>
        <h3 style={{ margin: "0 0 0.3rem" }}>🎯 Expedition Goal</h3>
        <p style={{ margin: 0 }}>{plan.goal}</p>
      </div>

      {route && (
        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.4rem" }}>
            <h2>Route Preview</h2>
            <Link to={`/map/${pack.id}`} style={{ fontSize: "0.9rem", fontWeight: 600 }}>
              Full Screen Map →
            </Link>
          </div>
          <p className="quiet" style={{ margin: "0 0 0.6rem" }}>
            Real OpenStreetMap loop · ~{Math.round(route.duration_minutes)} min walk · {route.fallback ? "Deterministic loop" : "OSRM pedestrian routing"}
          </p>
          <MapView route={route} height={280} />
        </div>
      )}

      <h2>Discovery Missions</h2>
      <div className="stack" style={{ gap: "0.5rem", marginBottom: "1.5rem" }}>
        {plan.missions.map((m) => (
          <div key={m.id} className="card" style={{ padding: "0.85rem 1rem" }}>
            <strong>🎯 {m.title}</strong>
            <p style={{ margin: "0.2rem 0 0", fontSize: "0.92rem" }}>{m.prompt}</p>
          </div>
        ))}
      </div>

      {plan.bonus_challenge && (
        <div className="card" style={{ marginBottom: "1.5rem", borderLeft: "4px solid var(--moss)" }}>
          <strong>✨ Bonus Outdoor Challenge</strong>
          <p style={{ margin: "0.3rem 0 0" }}>{plan.bonus_challenge}</p>
        </div>
      )}

      <h2>Things to Look For & Pack</h2>
      <ul style={{ marginBottom: "1.5rem" }}>
        {plan.checklist.map((c) => (
          <li key={c.id} style={{ margin: "0.4rem 0" }}>{c.label}</li>
        ))}
      </ul>

      <h2>Safety Guidelines</h2>
      <ul style={{ marginBottom: "1.8rem" }}>
        {plan.safety_notes.map((n) => (
          <li key={n} style={{ margin: "0.4rem 0" }}>{n}</li>
        ))}
      </ul>

      <div className="stack" style={{ gap: "0.75rem" }}>
        <button
          className="btn"
          style={{ padding: "1rem", fontSize: "1.1rem" }}
          onClick={async () => {
            const next = { ...pack, downloadedAt: new Date().toISOString(), status: "packed" as const };
            await persistPack(next);
            sessionStorage.setItem("draftPack", JSON.stringify(next));
            navigate(`/offline/${pack.id}`);
          }}
        >
          📥 Download Adventure Pack (Go Offline)
        </button>
        <Link className="btn secondary" to={`/map/${pack.id}`} style={{ textAlign: "center" }}>
          🗺️ Inspect Route Map
        </Link>
      </div>
    </section>

  );
}
