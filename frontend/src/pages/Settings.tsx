import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import { allPacks, clearAllData, exportLocalData, loadSettings, saveSettings } from "../lib/store";
import type { AppSettings } from "../types";

export function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [ai, setAi] = useState<string>("Checking AI engine…");
  const [packCount, setPackCount] = useState<number>(0);
  const [currentTheme, setCurrentTheme] = useState<string>(() => {
    return localStorage.getItem("touchgrass_theme") || "light";
  });

  useEffect(() => {
    loadSettings().then(setSettings);
    allPacks().then((packs) => setPackCount(packs.length)).catch(() => setPackCount(0));
    api
      .aiStatus()
      .then((s) => setAi(`${s.configured} · Model: ${s.model} · ${s.ollama_running ? "Ollama active" : "Offline / fallback active"}`))
      .catch(() => setAi("Backend offline or local-only fallback mode."));
  }, []);

  if (!settings) return null;

  async function update(next: AppSettings) {
    setSettings(next);
    await saveSettings(next);
  }

  function handleThemeChange(theme: string) {
    setCurrentTheme(theme);
    localStorage.setItem("touchgrass_theme", theme);
    if (theme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }

  async function handleExport() {
    const data = await exportLocalData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `touchgrass-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  }

  async function handleWipe() {
    if (!confirm("Are you sure? This will delete all local adventure packs, journals, and observations stored on this device.")) return;
    await clearAllData();
    try {
      await api.deleteServer();
    } catch {
      /* local wipe still happened */
    }
    setPackCount(0);
    alert("All local adventure data wiped.");
  }

  return (
    <section>
      <h1>Settings & Privacy</h1>
      <p className="quiet">You control your hardware, storage, and models. Zero telemetry.</p>

      {/* Appearance Section */}
      <div className="card" style={{ marginBottom: "1rem" }}>
        <h3>🎨 Appearance</h3>
        <p className="quiet">High-contrast outdoor readability mode.</p>
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.6rem" }}>
          <button
            type="button"
            className={`btn ${currentTheme === "light" ? "" : "secondary"}`}
            style={{ flex: 1, padding: "0.5rem" }}
            onClick={() => handleThemeChange("light")}
          >
            ☀️ Daylight
          </button>
          <button
            type="button"
            className={`btn ${currentTheme === "dark" ? "" : "secondary"}`}
            style={{ flex: 1, padding: "0.5rem" }}
            onClick={() => handleThemeChange("dark")}
          >
            🌙 Dark Moss
          </button>
        </div>
      </div>

      {/* AI Engine Status */}
      <div className="card" style={{ marginBottom: "1rem" }}>
        <h3>🤖 Open-Weight AI Engine</h3>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.4rem" }}>
          <span style={{ display: "inline-block", width: "10px", height: "10px", borderRadius: "50%", background: "#2e7d32" }}></span>
          <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>{ai}</span>
        </div>
        <p className="quiet" style={{ marginTop: "0.5rem", fontSize: "0.85rem" }}>
          Creative tasks use local Ollama (<code style={{ background: "rgba(0,0,0,0.06)", padding: "2px 6px", borderRadius: "4px" }}>gemma2:2b</code>) or deterministic zero-dependency fallback. Routing is strictly real-world OpenStreetMap geometry.
        </p>
      </div>

      {/* Data & Privacy Controls */}
      <div className="card" style={{ marginBottom: "1rem" }}>
        <h3>🔒 Privacy & Storage</h3>
        <label style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", marginTop: "0.6rem", cursor: "pointer" }}>
          <input
            type="checkbox"
            style={{ width: "1.2rem", height: "1.2rem", marginTop: "0.2rem" }}
            checked={settings.localOnly}
            onChange={(e) => update({ ...settings, localOnly: e.target.checked, cloudSync: e.target.checked ? false : settings.cloudSync })}
          />
          <div>
            <strong>Local-only mode (Strict)</strong>
            <p className="quiet" style={{ margin: "0.2rem 0 0 0", fontSize: "0.85rem" }}>
              Location traces, camera photos, voice notes, and AI journals stay strictly in device IndexedDB.
            </p>
          </div>
        </label>

        <label style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", marginTop: "1rem", cursor: "pointer" }}>
          <input
            type="checkbox"
            style={{ width: "1.2rem", height: "1.2rem", marginTop: "0.2rem" }}
            checked={settings.cloudSync}
            onChange={(e) => update({ ...settings, cloudSync: e.target.checked })}
          />
          <div>
            <strong>Optional Cloud Sync</strong>
            <p className="quiet" style={{ margin: "0.2rem 0 0 0", fontSize: "0.85rem" }}>
              Disabled by default. When off, nothing leaves your device except public OSM tiles while connected.
            </p>
          </div>
        </label>

        <label style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", marginTop: "1rem", cursor: "pointer" }}>
          <input
            type="checkbox"
            style={{ width: "1.2rem", height: "1.2rem", marginTop: "0.2rem" }}
            checked={settings.demoMode}
            onChange={(e) => update({ ...settings, demoMode: e.target.checked })}
          />
          <div>
            <strong>Hackathon Demo Mode</strong>
            <p className="quiet" style={{ margin: "0.2rem 0 0 0", fontSize: "0.85rem" }}>
              Instant Golden Gate Park adventure without requiring outdoor GPS lock or external APIs.
            </p>
          </div>
        </label>
      </div>

      {/* Local Storage Stats & Management */}
      <div className="card" style={{ marginBottom: "1rem" }}>
        <h3>📴 Device Memory</h3>
        <p style={{ margin: "0.4rem 0" }}>
          Saved offline adventures: <strong>{packCount}</strong>
        </p>
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.8rem", flexWrap: "wrap" }}>
          <button type="button" className="btn secondary" style={{ flex: 1, minWidth: "140px" }} onClick={handleExport}>
            💾 Export JSON Backup
          </button>
          <button type="button" className="btn warn" style={{ flex: 1, minWidth: "140px" }} onClick={handleWipe}>
            🗑️ Delete All Local Data
          </button>
        </div>
      </div>

      {/* Quick Navigation Links */}
      <div className="stack" style={{ marginTop: "1.2rem" }}>
        <Link className="btn secondary" to="/preferences" style={{ textAlign: "center" }}>
          🧭 Edit Exploration Preferences
        </Link>
        <Link className="btn secondary" to="/demo" style={{ textAlign: "center" }}>
          🌿 Load Instant Demo Walk
        </Link>
        <Link className="btn secondary" to="/privacy" style={{ textAlign: "center" }}>
          🛡️ Read Full Privacy Architecture
        </Link>
      </div>
    </section>
  );
}

