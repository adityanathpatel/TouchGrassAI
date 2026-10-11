import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Chip } from "../components/Chip";
import { loadPreferences, savePreferences } from "../lib/store";
import type { Preferences } from "../types";

const ALL_ACTIVITIES = [
  "walking",
  "hiking",
  "running",
  "cycling",
  "photography",
  "bird watching",
  "nature exploration",
  "gardening",
  "family activity",
];

const ALL_INTERESTS = [
  "nature",
  "photography",
  "birds",
  "plants",
  "history",
  "fitness",
  "exploration",
];

export function PreferencesPage() {
  const navigate = useNavigate();
  const [prefs, setPrefs] = useState<Preferences | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadPreferences().then(setPrefs);
  }, []);

  if (!prefs) return <p>Loading preferences…</p>;

  async function handleSave() {
    await savePreferences({ ...prefs!, onboarded: true });
    setSaved(true);
    setTimeout(() => navigate("/"), 800);
  }

  return (
    <section>
      <h1>Outdoor Preferences</h1>
      <p className="quiet">Personalizes your generated adventure missions and routes. Stored on this device.</p>
      
      {saved && <div className="ok-banner banner">Preferences saved ✓</div>}

      <div className="field">
        <span>Name or Nickname</span>
        <input
          value={prefs.name}
          onChange={(e) => setPrefs({ ...prefs, name: e.target.value })}
          placeholder="e.g. Explorer, Maya"
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem" }}>
        <div className="field">
          <span>Fitness Level</span>
          <select
            value={prefs.fitness_level}
            onChange={(e) => setPrefs({ ...prefs, fitness_level: e.target.value })}
          >
            <option value="gentle">Gentle (leisurely)</option>
            <option value="moderate">Moderate (standard)</option>
            <option value="strong">Strong (active)</option>
          </select>
        </div>

        <div className="field">
          <span>Default Difficulty</span>
          <select
            value={prefs.difficulty}
            onChange={(e) => setPrefs({ ...prefs, difficulty: e.target.value })}
          >
            <option value="beginner">Beginner</option>
            <option value="moderate">Moderate</option>
            <option value="challenging">Challenging</option>
          </select>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem" }}>
        <div className="field">
          <span>Available Time</span>
          <select
            value={prefs.available_time_minutes}
            onChange={(e) => setPrefs({ ...prefs, available_time_minutes: Number(e.target.value) })}
          >
            <option value={15}>15 minutes</option>
            <option value={30}>30 minutes</option>
            <option value={45}>45 minutes</option>
            <option value={60}>60 minutes</option>
            <option value={90}>90 minutes</option>
            <option value={120}>120 minutes</option>
          </select>
        </div>

        <div className="field">
          <span>Preferred Distance ({prefs.preferred_distance_km} km)</span>
          <input
            type="range"
            min={1}
            max={12}
            step={0.5}
            value={prefs.preferred_distance_km}
            onChange={(e) => setPrefs({ ...prefs, preferred_distance_km: Number(e.target.value) })}
            style={{ padding: 0 }}
          />
        </div>
      </div>

      <div className="field">
        <span>Favorite Activities</span>
        <div className="chips">
          {ALL_ACTIVITIES.map((a) => (
            <Chip
              key={a}
              label={a}
              on={prefs.activities.includes(a)}
              onClick={() =>
                setPrefs({
                  ...prefs,
                  activities: prefs.activities.includes(a)
                    ? prefs.activities.filter((x) => x !== a)
                    : [...prefs.activities, a],
                })
              }
            />
          ))}
        </div>
      </div>

      <div className="field">
        <span>Interests</span>
        <div className="chips">
          {ALL_INTERESTS.map((i) => (
            <Chip
              key={i}
              label={i}
              on={prefs.interests.includes(i)}
              onClick={() =>
                setPrefs({
                  ...prefs,
                  interests: prefs.interests.includes(i)
                    ? prefs.interests.filter((x) => x !== i)
                    : [...prefs.interests, i],
                })
              }
            />
          ))}
        </div>
      </div>

      <div className="stack" style={{ marginTop: "1.2rem" }}>
        <button className="btn" onClick={handleSave}>
          Save Preferences
        </button>
      </div>
    </section>
  );
}

