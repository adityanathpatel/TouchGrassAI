import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { MapView } from "../components/MapView";
import { loadPack } from "../lib/store";
import type { PackedAdventure } from "../types";

export function RouteMapPage() {
  const { id } = useParams();
  const [pack, setPack] = useState<PackedAdventure | null>(null);
  useEffect(() => {
    if (!id) return;
    const draft = sessionStorage.getItem("draftPack");
    if (draft) {
      const parsed = JSON.parse(draft) as PackedAdventure;
      if (parsed.id === id) {
        setPack(parsed);
        return;
      }
    }
    loadPack(id).then((p) => setPack(p || null));
  }, [id]);
  if (!pack || !pack.route) return <p>Route not available. Download a pack or use Demo Mode.</p>;
  const route = pack.route;

  return (
    <section>
      <h1>Expedition Route Map</h1>
      <p className="quiet">
        Deterministic path geometry generated via OpenStreetMap / OSRM. No hallucinated trails.
      </p>

      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", margin: "0.8rem 0" }}>
        <span className="demo-flag" style={{ background: "rgba(46, 125, 50, 0.12)", color: "var(--brand-primary, #2e7d32)", fontWeight: 600 }}>
          🚶 {route.distance_km} km
        </span>
        <span className="demo-flag" style={{ background: "rgba(46, 125, 50, 0.12)", color: "var(--brand-primary, #2e7d32)", fontWeight: 600 }}>
          ⏱️ ~{Math.round(route.duration_minutes)} min walk
        </span>
        <span className="demo-flag" style={{ background: "rgba(100, 116, 139, 0.12)", color: "var(--text-color)", fontWeight: 500 }}>
          📍 {route.waypoints.length} Waypoints
        </span>
      </div>

      {route.fallback && (
        <div className="banner" style={{ marginBottom: "1rem" }}>
          ⚠️ Remote routing service timed out. Showing pre-calculated geographic loop from local OSM cache.
        </div>
      )}

      <MapView route={route} height={420} />

      {route.waypoints.length > 0 && (
        <div className="card" style={{ marginTop: "1rem" }}>
          <h3>📌 Route Landmarks</h3>
          <ul style={{ margin: "0.5rem 0", paddingLeft: "1.2rem", lineHeight: "1.6" }}>
            {route.waypoints.map((wp, idx) => (
              <li key={idx}>
                <strong>{idx === 0 ? "🟢 Departure" : idx === route.waypoints.length - 1 ? "🏁 Destination" : `📍 Waypoint ${idx}`}:</strong> {`${wp.lat.toFixed(4)}, ${wp.lng.toFixed(4)}`}
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="quiet" style={{ marginTop: "0.8rem", fontSize: "0.85rem" }}>
        🔒 Privacy Guarantee: Your live location during the walk is processed entirely on-device and never transmitted to remote tracking servers.
      </p>

      <div className="stack" style={{ marginTop: "1.2rem" }}>
        <Link className="btn" to={`/preview/${pack.id}`} style={{ textAlign: "center" }}>
          📋 Proceed to Adventure Preview
        </Link>
        <Link className="btn secondary" to={`/offline/${pack.id}`} style={{ textAlign: "center" }}>
          📴 Download Offline Pack
        </Link>
        <Link className="btn secondary" to="/create" style={{ textAlign: "center" }}>
          🔄 Plan Another Route
        </Link>
      </div>
    </section>
  );
}
