import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import { allPacks, clearAllData, deleteAdventure } from "../lib/store";
import type { PackedAdventure } from "../types";

export function AdventuresPage() {
  const [packs, setPacks] = useState<PackedAdventure[]>([]);
  const [filter, setFilter] = useState<"all" | "active" | "complete">("all");

  async function load() {
    const list = await allPacks();
    setPacks(list);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: string, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Delete this adventure pack and its saved observations?")) return;
    await deleteAdventure(id);
    try {
      await fetch(`/api/adventures/${id}`, { method: "DELETE" });
    } catch {
      /* local delete is primary */
    }
    load();
  }

  const filtered = packs.filter((p) => {
    if (filter === "active") return p.status !== "complete";
    if (filter === "complete") return p.status === "complete";
    return true;
  });

  return (
    <section>
      <h1>My Adventures</h1>
      <p className="quiet">Downloaded packs and completed walks stored on this device.</p>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <button
          className={`chip ${filter === "all" ? "on" : ""}`}
          onClick={() => setFilter("all")}
        >
          All ({packs.length})
        </button>
        <button
          className={`chip ${filter === "active" ? "on" : ""}`}
          onClick={() => setFilter("active")}
        >
          In Progress ({packs.filter((p) => p.status !== "complete").length})
        </button>
        <button
          className={`chip ${filter === "complete" ? "on" : ""}`}
          onClick={() => setFilter("complete")}
        >
          Completed ({packs.filter((p) => p.status === "complete").length})
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "2rem 1rem" }}>
          <p style={{ margin: "0 0 1rem" }}>No adventures found in this view.</p>
          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
            <Link className="btn" to="/create">
              Create New Adventure
            </Link>
            <Link className="btn secondary" to="/demo">
              Load Demo Adventure
            </Link>
          </div>
        </div>
      ) : (
        <div className="stack" style={{ gap: "0.9rem" }}>
          {filtered.map((p) => {
            const completedMissions = p.missions.filter((m) => m.completed).length;
            const photosCount = p.observations.filter((o) => o.photoDataUrl).length;
            const targetUrl = p.status === "complete" ? `/journal/${p.id}` : `/outdoor/${p.id}`;

            return (
              <div key={p.id} className="card" style={{ position: "relative" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.4rem" }}>
                  <div>
                    <span className={`pill ${p.status === "complete" ? "online" : "offline"}`} style={{ fontSize: "0.72rem" }}>
                      {p.status === "complete" ? "Completed ✓" : p.status === "active" ? "In Progress" : "Packed"}
                    </span>
                    {p.is_demo && <span className="demo-flag" style={{ marginLeft: "0.4rem" }}>Demo</span>}
                  </div>
                  <button
                    type="button"
                    className="btn ghost"
                    style={{ fontSize: "0.85rem", color: "var(--warn)", padding: "0.2rem 0.5rem" }}
                    onClick={(e) => handleDelete(p.id, e)}
                    title="Delete adventure"
                  >
                    🗑️ Delete
                  </button>
                </div>

                <h3 style={{ margin: "0.2rem 0 0.4rem" }}>{p.plan.title}</h3>
                <p className="quiet" style={{ margin: "0 0 0.6rem" }}>{p.locationLabel || "Local exploration"}</p>

                <div style={{ display: "flex", gap: "1rem", fontSize: "0.88rem", color: "var(--muted)", flexWrap: "wrap", marginBottom: "0.8rem" }}>
                  <span>📍 {p.route?.distance_km ?? "—"} km</span>
                  <span>⏱️ {p.plan.duration_minutes} min</span>
                  <span>🎯 {completedMissions}/{p.missions.length} missions</span>
                  <span>📸 {p.observations.length} notices ({photosCount} photos)</span>
                </div>

                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <Link className="btn" to={targetUrl} style={{ padding: "0.5rem 1rem", fontSize: "0.9rem" }}>
                    {p.status === "complete" ? "Read Journal" : "Continue Outside"}
                  </Link>
                  <Link className="btn secondary" to={`/map/${p.id}`} style={{ padding: "0.5rem 1rem", fontSize: "0.9rem" }}>
                    View Map
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

