import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Chip } from "../components/Chip";
import { currentPosition } from "../lib/geo";
import { loadPreferences, savePreferences } from "../lib/store";

const ACTIVITIES = [
  "Walking",
  "Hiking",
  "Running",
  "Cycling",
  "Bird watching",
  "Photography",
  "Nature exploration",
  "Gardening",
  "Family activity",
];

export function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [gps, setGps] = useState<"idle" | "ok" | "denied">("idle");
  const [activities, setActivities] = useState<string[]>(["Walking"]);
  const [fitness, setFitness] = useState("moderate");
  const [time, setTime] = useState(60);
  const [distance, setDistance] = useState(3);
  const [difficulty, setDifficulty] = useState("beginner");
  const [interests, setInterests] = useState<string[]>(["nature"]);
  const [error, setError] = useState("");

  function toggle(list: string[], value: string, setter: (v: string[]) => void) {
    setter(list.includes(value) ? list.filter((x) => x !== value) : [...list, value]);
  }

  async function askLocation() {
    const pos = await currentPosition();
    setGps(pos ? "ok" : "denied");
    if (!pos) setError("Location is optional. You can search a park later.");
  }

  async function finish(skipRest = false) {
    const existing = await loadPreferences();
    await savePreferences({
      ...existing,
      name: name || "Explorer",
      activities: skipRest ? existing.activities : activities.map((a) => a.toLowerCase()),
      fitness_level: fitness,
      available_time_minutes: time,
      preferred_distance_km: distance,
      difficulty,
      interests,
      onboarded: true,
    });
    navigate("/");
  }

  return (
    <section>
      <p className="quiet">Welcome · {step + 1} / 5</p>
      {step === 0 && (
        <>
          <h1>What should we call you?</h1>
          <div className="field">
            <span>Name or nickname</span>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Optional" />
          </div>
        </>
      )}
      {step === 1 && (
        <>
          <h1>Stay local.</h1>
          <p>Location is used only on this device to start a route. It is not uploaded by default.</p>
          <button className="btn" onClick={askLocation}>
            Allow location
          </button>
          <p className="quiet">{gps === "ok" ? "Location ready." : gps === "denied" ? "No GPS permission. You can still search a place." : ""}</p>
        </>
      )}
      {step === 2 && (
        <>
          <h1>What do you like outside?</h1>
          <div className="chips">
            {ACTIVITIES.map((a) => (
              <Chip key={a} label={a} on={activities.includes(a)} onClick={() => toggle(activities, a, setActivities)} />
            ))}
          </div>
        </>
      )}
      {step === 3 && (
        <>
          <h1>How far, how long?</h1>
          <div className="field">
            <span>Fitness</span>
            <select value={fitness} onChange={(e) => setFitness(e.target.value)}>
              <option value="gentle">Gentle</option>
              <option value="moderate">Moderate</option>
              <option value="strong">Strong</option>
            </select>
          </div>
          <div className="field">
            <span>Available time (minutes)</span>
            <select value={time} onChange={(e) => setTime(Number(e.target.value))}>
              {[15, 30, 60, 90, 120].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <span>Preferred distance (km)</span>
            <input type="number" min={0.5} step={0.5} value={distance} onChange={(e) => setDistance(Number(e.target.value))} />
          </div>
          <div className="field">
            <span>Difficulty</span>
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
              <option value="beginner">Beginner</option>
              <option value="moderate">Moderate</option>
              <option value="challenging">Challenging</option>
            </select>
          </div>
        </>
      )}
      {step === 4 && (
        <>
          <h1>Interests</h1>
          <div className="chips">
            {["nature", "photography", "birds", "plants", "history", "fitness", "exploration"].map((i) => (
              <Chip key={i} label={i} on={interests.includes(i)} onClick={() => toggle(interests, i, setInterests)} />
            ))}
          </div>
        </>
      )}
      {error && <p className="banner">{error}</p>}
      <div className="stack" style={{ marginTop: "1.2rem" }}>
        {step < 4 ? (
          <button className="btn" onClick={() => setStep(step + 1)}>
            Continue
          </button>
        ) : (
          <button className="btn" onClick={() => finish(false)}>
            Save and go home
          </button>
        )}
        <button className="btn ghost skip" onClick={() => (step < 4 ? setStep(step + 1) : finish(true))}>
          Skip optional info
        </button>
        <Link to="/preferences">Edit all preferences later</Link>
      </div>
    </section>
  );
}
