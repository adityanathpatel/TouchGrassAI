import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { loadPack, persistPack } from "../lib/store";
import type { PackedAdventure } from "../types";

export function ProgressPage() {
  const { id } = useParams();
  const [pack, setPack] = useState<PackedAdventure | null>(null);

  useEffect(() => {
    if (id) loadPack(id).then((p) => setPack(p || null));
  }, [id]);

  if (!pack) return <p>No active adventure found.</p>;

  const photos = pack.observations.filter((o) => o.photoDataUrl).length;

  async function toggleMission(missionId: string) {
    const missions = pack!.missions.map((m) => (m.id === missionId ? { ...m, completed: !m.completed } : m));
    const next = { ...pack!, missions };
    await persistPack(next);
    setPack(next);
  }

  async function toggleChecklist(itemId: string) {
    const checklist = pack!.checklist.map((c) => (c.id === itemId ? { ...c, completed: !c.completed } : c));
    const next = { ...pack!, checklist };
    await persistPack(next);
    setPack(next);
  }

  return (
    <section>
      <h1>Adventure Progress</h1>
      <p className="quiet">Glance briefly, then head back outside.</p>

      <div className="stats">
        <div className="stat">
          <b>
            {pack.missions.filter((m) => m.completed).length}/{pack.missions.length}
          </b>
          Missions
        </div>
        <div className="stat">
          <b>
            {pack.checklist.filter((c) => c.completed).length}/{pack.checklist.length}
          </b>
          Checklist
        </div>
        <div className="stat">
          <b>{pack.observations.length}</b>
          Observations
        </div>
        <div className="stat">
          <b>{photos}</b>
          Photos
        </div>
        <div className="stat">
          <b>{pack.route?.distance_km ?? "—"} km</b>
          Distance
        </div>
        <div className="stat">
          <b>{pack.plan.duration_minutes} min</b>
          Planned
        </div>
      </div>

      <h2 style={{ marginTop: "1.5rem" }}>Discovery Missions</h2>
      <div className="stack" style={{ gap: "0.5rem" }}>
        {pack.missions.map((m) => (
          <label key={m.id} className="card" style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={!!m.completed}
              onChange={() => toggleMission(m.id)}
            />
            <div style={{ textDecoration: m.completed ? "line-through" : "none", color: m.completed ? "var(--muted)" : "var(--ink)" }}>
              <strong>{m.title}</strong>
              <p style={{ margin: 0, fontSize: "0.9rem" }}>{m.prompt}</p>
            </div>
          </label>
        ))}
      </div>

      <h2 style={{ marginTop: "1.5rem" }}>Look for / Checklist</h2>
      <div className="stack" style={{ gap: "0.5rem" }}>
        {pack.checklist.map((c) => (
          <label key={c.id} className="card" style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={!!c.completed}
              onChange={() => toggleChecklist(c.id)}
            />
            <span style={{ textDecoration: c.completed ? "line-through" : "none", color: c.completed ? "var(--muted)" : "var(--ink)" }}>
              {c.label}
            </span>
          </label>
        ))}
      </div>

      {pack.observations.length > 0 && (
        <>
          <h2 style={{ marginTop: "1.5rem" }}>Recorded Notices ({pack.observations.length})</h2>
          <div className="stack" style={{ gap: "0.8rem" }}>
            {pack.observations.map((obs) => (
              <div key={obs.id} className="card" style={{ padding: "0.8rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span className="chip on" style={{ fontSize: "0.75rem", padding: "0.15rem 0.5rem" }}>{obs.category}</span>
                  <span className="quiet" style={{ fontSize: "0.8rem" }}>{new Date(obs.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                </div>
                {obs.photoDataUrl && <img src={obs.photoDataUrl} alt={obs.category} className="photo-preview" style={{ maxHeight: "150px", marginTop: "0.4rem" }} />}
                {obs.note && <p style={{ margin: "0.3rem 0", color: "var(--ink)" }}>{obs.note}</p>}
                {obs.transcript && <p className="quiet" style={{ margin: 0, fontStyle: "italic" }}>"{obs.transcript}"</p>}
                {obs.audioDataUrl && <audio controls src={obs.audioDataUrl} style={{ width: "100%", height: "28px", marginTop: "0.3rem" }} />}
              </div>
            ))}
          </div>
        </>
      )}

      <div className="stack" style={{ marginTop: "1.5rem" }}>
        <Link className="btn" to={`/outdoor/${pack.id}`} style={{ textAlign: "center" }}>
          Return to Outdoor Mode
        </Link>
      </div>
    </section>
  );
}

