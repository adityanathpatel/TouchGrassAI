import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Chip } from "../components/Chip";
import { api, ApiError } from "../lib/api";
import { currentPosition, DEMO_LOCATION, isOnline } from "../lib/geo";
import { loadPreferences, persistPack } from "../lib/store";
import type { AdventurePlan, Coordinate, PackedAdventure, RouteResult } from "../types";

const ACTIVITIES = ["walking", "hiking", "running", "nature", "photography", "bird watching", "custom"];
const INTERESTS = ["nature", "photography", "birds", "plants", "history", "fitness", "exploration"];

export function CreateAdventurePage() {
  const navigate = useNavigate();
  const [activity, setActivity] = useState("walking");
  const [custom, setCustom] = useState("");
  const [duration, setDuration] = useState(60);
  const [difficulty, setDifficulty] = useState("beginner");
  const [interests, setInterests] = useState<string[]>(["nature"]);
  const [location, setLocation] = useState<Coordinate | null>(null);
  const [label, setLabel] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ label: string; lat: number; lng: number; demo?: boolean }[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [aiHint, setAiHint] = useState("");

  useEffect(() => {
    api.aiStatus().then((s) => {
      if (s.message) setAiHint(s.message);
    }).catch(() => setAiHint("Backend unreachable. You can still load Demo Mode."));
  }, []);

  async function useGps() {
    const pos = await currentPosition();
    if (!pos) {
      setError("No GPS permission. Search a park or use the demo location.");
      return;
    }
    setLocation(pos);
    setLabel("Current location");
    setError("");
  }

  async function search() {
    if (!query.trim()) {
      setError("Empty location search. Type a park or neighborhood.");
      return;
    }
    try {
      const data = await api.searchLocation(query);
      setResults(data.results || []);
    } catch {
      setResults([{ ...DEMO_LOCATION, demo: true }]);
    }
  }

  async function generate() {
    setBusy(true);
    setError("");
    const prefs = await loadPreferences();
    const loc = location || { lat: DEMO_LOCATION.lat, lng: DEMO_LOCATION.lng };
    const locLabel = label || DEMO_LOCATION.label;
    try {
      if (!isOnline()) throw new ApiError("No internet. Open Demo Mode or download an adventure first.", 503);
      const generated = await api.generateAdventure({
        preferences: prefs,
        activity,
        custom_activity: custom || null,
        duration_minutes: duration,
        difficulty,
        interests,
        location: loc,
        location_label: locLabel,
      });
      const route = (await api.generateRoute(
        {
          start: loc,
          duration_minutes: duration,
          activity,
          difficulty,
        },
        generated.id
      )) as RouteResult;
      const plan = generated.plan as AdventurePlan;
      const pack: PackedAdventure = {
        id: generated.id,
        plan,
        route,
        is_demo: Boolean(generated.is_demo),
        activity,
        locationLabel: locLabel,
        downloadedAt: "",
        status: "packed",
        missions: plan.missions,
        checklist: plan.checklist,
        observations: [],
      };
      sessionStorage.setItem("draftPack", JSON.stringify(pack));
      navigate(`/preview/${generated.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not generate adventure.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section>
      <h1>Create Adventure</h1>
      <p>Tell us a place and a little time. Then put the phone away.</p>
      {aiHint && <div className="banner">{aiHint}</div>}
      {error && <div className="banner">{error}</div>}
      <div className="stack">
        <button className="btn secondary" onClick={useGps}>
          Use current location
        </button>
        <div className="field">
          <span>Search / select location</span>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Park, trailhead, neighborhood" />
          <button className="btn secondary" onClick={search}>
            Search OpenStreetMap
          </button>
        </div>
        {label && <p className="quiet">Using: {label}</p>}
        {results.map((r) => (
          <button
            key={r.label}
            className="list-btn"
            onClick={() => {
              setLocation({ lat: r.lat, lng: r.lng });
              setLabel(r.label);
            }}
          >
            {r.label} {r.demo ? <span className="demo-flag">Demo</span> : null}
          </button>
        ))}
        <div className="field">
          <span>Activity</span>
          <div className="chips">
            {ACTIVITIES.map((a) => (
              <Chip key={a} label={a} on={activity === a} onClick={() => setActivity(a)} />
            ))}
          </div>
        </div>
        {activity === "custom" && (
          <input value={custom} onChange={(e) => setCustom(e.target.value)} placeholder="Your activity" />
        )}
        <div className="field">
          <span>Duration</span>
          <div className="chips">
            {[15, 30, 60, 90, 120].map((n) => (
              <Chip key={n} label={`${n} min`} on={duration === n} onClick={() => setDuration(n)} />
            ))}
          </div>
        </div>
        <div className="field">
          <span>Difficulty</span>
          <div className="chips">
            {["beginner", "moderate", "challenging"].map((d) => (
              <Chip key={d} label={d} on={difficulty === d} onClick={() => setDifficulty(d)} />
            ))}
          </div>
        </div>
        <div className="field">
          <span>Interests</span>
          <div className="chips">
            {INTERESTS.map((i) => (
              <Chip
                key={i}
                label={i}
                on={interests.includes(i)}
                onClick={() => setInterests(interests.includes(i) ? interests.filter((x) => x !== i) : [...interests, i])}
              />
            ))}
          </div>
        </div>
        <button className="btn" disabled={busy} onClick={generate}>
          {busy ? "Generating…" : "Generate adventure"}
        </button>
      </div>
    </section>
  );
}
