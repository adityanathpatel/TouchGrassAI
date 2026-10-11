import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../lib/api";
import { persistPack, loadPack } from "../lib/store";
import type { PackedAdventure } from "../types";

export function OfflinePackPage() {
  const { id } = useParams();
  const [pack, setPack] = useState<PackedAdventure | null>(null);
  useEffect(() => {
    async function load() {
      if (!id) return;
      let local = await loadPack(id);
      if (!local) {
        const draft = sessionStorage.getItem("draftPack");
        if (draft) local = JSON.parse(draft);
      }
      if (local) {
        const next = { ...local, downloadedAt: local.downloadedAt || new Date().toISOString(), status: "packed" as const };
        await persistPack(next);
        try {
          await api.download(id);
        } catch {
          /* offline is fine; pack already local */
        }
        setPack(next);
      }
    }
    load();
  }, [id]);
  if (!pack) return <p>Preparing pack…</p>;
  return (
    <section>
      <div className="ok-banner banner" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span>✓</span> <strong>Offline Expedition Pack Ready</strong>
      </div>
      <h1 style={{ marginTop: "0.75rem" }}>{pack.plan.title}</h1>
      <p>
        Everything needed for this walk is encrypted & saved locally to your device’s storage. You can safely turn on Airplane Mode or walk beyond cellular coverage.
      </p>

      {pack.is_demo && <span className="demo-flag">🌿 Hackathon Demo Pack</span>}

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>📦 Offline Inventory</h3>
        <ul style={{ margin: "0.5rem 0", paddingLeft: "1.2rem", lineHeight: "1.7" }}>
          <li>
            <strong>Real-world Route Geometry:</strong>{" "}
            {pack.route ? `${pack.route.distance_km} km (${Math.round(pack.route.duration_minutes)} min) cached from OpenStreetMap` : "Pre-calculated terrain loop"}
          </li>
          <li><strong>Interactive Missions:</strong> {pack.plan.missions.length} sensory quests stored locally</li>
          <li><strong>Pre-walk Checklist:</strong> {pack.plan.checklist.length} safety & gear checkpoints</li>
          <li>
            <strong>Field Waypoints:</strong> {pack.route ? pack.route.waypoints.length : 0} terrain landmarks
          </li>
          <li><strong>Offline Journal Schema:</strong> Ready for camera captures, voice notes & field observations</li>
        </ul>
      </div>

      <div className="card" style={{ marginTop: "1rem", background: "rgba(46, 125, 50, 0.08)", border: "1px solid rgba(46, 125, 50, 0.25)" }}>
        <h4 style={{ margin: 0, color: "var(--brand-primary, #2e7d32)" }}>🧭 Ready for the Wild</h4>
        <p className="quiet" style={{ margin: "0.4rem 0 0 0", fontSize: "0.9rem" }}>
          Entering Outdoor Mode will activate high-contrast minimal view, battery-saving UI, and offline camera observation logging. Put your phone in your pocket and look around!
        </p>
      </div>

      <div className="stack" style={{ marginTop: "1.5rem" }}>
        <Link className="btn" to={`/outdoor/${pack.id}`} style={{ textAlign: "center", padding: "0.85rem", fontSize: "1.05rem" }}>
          🌲 Start Outdoor Mode
        </Link>
        <Link className="btn secondary" to={`/map/${pack.id}`} style={{ textAlign: "center" }}>
          🗺️ Review Route Map
        </Link>
        <Link className="btn secondary" to={`/preview/${pack.id}`} style={{ textAlign: "center" }}>
          📋 View Missions & Checklist
        </Link>
      </div>
    </section>
  );
}
