import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { persistPack } from "../lib/store";
import type { PackedAdventure } from "../types";

const PLACEHOLDERS = [
  { category: "Bird", note: "Small bird near the meadow (placeholder)." },
  { category: "Plant", note: "Tree with grooved bark (placeholder)." },
  { category: "Plant", note: "Flower at the path edge (placeholder)." },
  { category: "Landscape", note: "Open meadow light (placeholder)." },
];

export function DemoPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  async function load() {
    try {
      const data = await api.demoAdventure();
      const pack: PackedAdventure = {
        id: data.id,
        plan: data.plan,
        route: data.route,
        is_demo: true,
        activity: "nature exploration",
        locationLabel: "Golden Gate Park, San Francisco (demo)",
        downloadedAt: new Date().toISOString(),
        status: "packed",
        missions: data.plan.missions,
        checklist: data.plan.checklist,
        observations: PLACEHOLDERS.map((o, i) => ({
          id: `demo-obs-${i}`,
          category: o.category,
          note: o.note,
          transcript: "",
          createdAt: new Date().toISOString(),
          demo: true,
        })),
      };
      await persistPack(pack);
      sessionStorage.setItem("draftPack", JSON.stringify(pack));
      navigate(`/preview/${pack.id}`);
    } catch {
      setError("Could not reach the backend. Start the API, then retry.");
    }
  }
  return (
    <section>
      <span className="demo-flag">Demo data</span>
      <h1>60-Minute Nature Hunt</h1>
      <p>A labeled 3.8 km public loop in Golden Gate Park. Safe for hackathon judging without GPS.</p>
      {error && <div className="banner">{error}</div>}
      <button className="btn" onClick={load}>
        Load demo adventure
      </button>
    </section>
  );
}
