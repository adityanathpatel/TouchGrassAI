import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../lib/api";
import { loadPack, persistPack } from "../lib/store";
import type { PackedAdventure } from "../types";

export function FinishPage() {
  const { id } = useParams();
  const [pack, setPack] = useState<PackedAdventure | null>(null);
  useEffect(() => {
    if (!id) return;
    loadPack(id).then(async (p) => {
      if (!p) return;
      const next = { ...p, status: "complete" as const, finishedAt: new Date().toISOString() };
      await persistPack(next);
      try {
        await api.finish(id);
      } catch {
        /* local finish is enough */
      }
      setPack(next);
    });
  }, [id]);
  if (!pack) return <p>Wrapping up…</p>;
  const photos = pack.observations.filter((o) => o.photoDataUrl).length;
  return (
    <section>
      <h1>Adventure Complete 🎉</h1>
      <div className="stats">
        <div className="stat">
          <b>{pack.route?.distance_km ?? "—"} km</b>
          Distance
        </div>
        <div className="stat">
          <b>{pack.plan.duration_minutes} min</b>
          Duration
        </div>
        <div className="stat">
          <b>
            {pack.missions.filter((m) => m.completed).length}/{pack.missions.length}
          </b>
          Missions
        </div>
        <div className="stat">
          <b>{pack.observations.length}</b>
          Observations
        </div>
        <div className="stat">
          <b>{photos}</b>
          Photos
        </div>
      </div>
      <div className="stack" style={{ marginTop: "1.2rem" }}>
        <Link className="btn" to={`/journal/${pack.id}`}>
          Generate Adventure Journal
        </Link>
        <Link className="btn secondary" to="/">
          Home
        </Link>
      </div>
    </section>
  );
}
