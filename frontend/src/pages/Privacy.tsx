import { api } from "../lib/api";
import { clearAllData, exportLocalData } from "../lib/store";

export function PrivacyPage() {
  async function exportData() {
    const data = await exportLocalData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "touchgrass-export.json";
    a.click();
  }

  async function wipe() {
    if (!confirm("Delete all adventure data on this device?")) return;
    await clearAllData();
    try {
      await api.deleteServer();
    } catch {
      /* local wipe still happened */
    }
    alert("Deleted.");
  }

  return (
    <section>
      <h1>Privacy</h1>
      <p>Local storage is the default. You own your walks.</p>
      <div className="card">
        <h3>What can leave the device</h3>
        <ul>
          <li>While planning online: a start coordinate to OpenStreetMap / OSRM for a real route.</li>
          <li>To local Ollama on your machine: adventure text, optional photo for identification, optional audio for Whisper.</li>
          <li>Never by default: cloud upload of photos, GPS traces, notes, or journals.</li>
        </ul>
      </div>
      <div className="stack" style={{ marginTop: "1rem" }}>
        <button className="btn secondary" onClick={exportData}>
          Export data
        </button>
        <button className="btn warn" onClick={wipe}>
          Delete all adventure data
        </button>
      </div>
    </section>
  );
}
