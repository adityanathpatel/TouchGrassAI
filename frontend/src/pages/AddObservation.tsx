import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../lib/api";
import { currentPosition, isOnline } from "../lib/geo";
import { loadPack, persistPack } from "../lib/store";
import type { Observation } from "../types";

const CATEGORIES = ["Bird", "Plant", "Animal", "Insect", "Landscape", "Weather", "Object", "Personal observation"];

export function AddObservationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [category, setCategory] = useState("Plant");
  const [note, setNote] = useState("");
  const [photo, setPhoto] = useState<string>("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [transcript, setTranscript] = useState("");
  const [ai, setAi] = useState<{ object: string; species?: string | null; confidence: number; desc: string; disclaimer: string } | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [recording, setRecording] = useState(false);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const speechRef = useRef<any>(null);
  const chunks = useRef<Blob[]>([]);
  const [audioUrl, setAudioUrl] = useState("");
  const [audioDataUrl, setAudioDataUrl] = useState("");

  useEffect(() => {
    const captured = sessionStorage.getItem("capturedPhoto");
    if (captured) {
      setPhoto(captured);
      sessionStorage.removeItem("capturedPhoto");
    }
  }, []);

  async function onPhoto(file: File) {
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = () => setPhoto(String(reader.result || ""));
    reader.readAsDataURL(file);
  }

  async function analyze() {
    if (!photo && !photoFile) {
      setError("Add a photo first.");
      return;
    }
    if (!isOnline()) {
      setError("Photo analysis needs a local vision model when you are back online. The photo is still saved on device.");
      return;
    }
    setAnalyzing(true);
    setError("");
    try {
      let fileToAnalyze = photoFile;
      if (!fileToAnalyze && photo) {
        const res = await fetch(photo);
        const blob = await res.blob();
        fileToAnalyze = new File([blob], "observation.jpg", { type: "image/jpeg" });
      }
      if (!fileToAnalyze) throw new Error("No image data available.");
      const data = await api.analyzeImage(fileToAnalyze, category);
      const r = data.result;
      setAi({
        object: r.possible_object || "Outdoor object",
        species: r.possible_species,
        confidence: typeof r.confidence === "number" ? Math.round(r.confidence * 100) : 50,
        desc: r.short_description || "Visual identification guess.",
        disclaimer: r.disclaimer || "AI identification can be incorrect.",
      });
      if (!note && r.possible_object) {
        setNote(`Observed: ${r.possible_object}${r.possible_species ? ` (${r.possible_species})` : ""}`);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Vision model unavailable.");
    } finally {
      setAnalyzing(false);
    }
  }


  async function startVoice() {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      mediaRef.current = rec;
      chunks.current = [];
      rec.ondataavailable = (e) => chunks.current.push(e.data);

      const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRec) {
        try {
          const sr = new SpeechRec();
          sr.continuous = true;
          sr.interimResults = true;
          sr.lang = "en-US";
          sr.onresult = (evt: any) => {
            let final = "";
            for (let i = 0; i < evt.results.length; i++) {
              final += evt.results[i][0].transcript + " ";
            }
            if (final.trim()) setTranscript(final.trim());
          };
          sr.start();
          speechRef.current = sr;
        } catch {
          /* speech recognition fallback to backend whisper */
        }
      }

      rec.onstop = async () => {
        const blob = new Blob(chunks.current, { type: rec.mimeType || "audio/webm" });
        setAudioUrl(URL.createObjectURL(blob));
        const reader = new FileReader();
        reader.onload = () => setAudioDataUrl(String(reader.result || ""));
        reader.readAsDataURL(blob);

        if (!transcript && isOnline()) {
          try {
            const data = await api.transcribe(blob);
            if (data.transcript) setTranscript(data.transcript);
          } catch {
            /* local speech or typed text is sufficient */
          }
        }
      };

      rec.start();
      setRecording(true);
    } catch {
      setError("Microphone unavailable. You can still type a note.");
    }
  }

  function stopVoice() {
    if (speechRef.current) {
      try { speechRef.current.stop(); } catch { /* ignore */ }
    }
    mediaRef.current?.stop();
    setRecording(false);
  }

  async function save() {
    if (!id) return;
    const pack = await loadPack(id);
    if (!pack) return;
    const gps = await currentPosition();
    const obs: Observation = {
      id: crypto.randomUUID(),
      category,
      note,
      transcript,
      photoDataUrl: photo || undefined,
      audioDataUrl: audioDataUrl || audioUrl || undefined,
      latitude: gps?.lat,
      longitude: gps?.lng,
      createdAt: new Date().toISOString(),
      aiLabel: ai ? `${ai.object}${ai.species ? ` (${ai.species})` : ""}` : null,
      aiConfidence: ai ? ai.confidence / 100 : null,
    };
    const next = { ...pack, observations: [...pack.observations, obs] };
    await persistPack(next);
    if (isOnline()) {
      try {
        await api.createObservation({
          adventure_id: id,
          category,
          note,
          transcript,
          latitude: gps?.lat,
          longitude: gps?.lng,
          ai_label: obs.aiLabel,
          ai_confidence: obs.aiConfidence,
        });
      } catch {
        /* local copy is the source of truth */
      }
    }
    navigate(`/outdoor/${id}`);
  }

  return (
    <section>
      <h1>Add Observation</h1>
      <p className="quiet">Stored on this device first. You own your outdoor data.</p>
      {error && <div className="banner">{error}</div>}

      <div className="field">
        <span>Category</span>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="field">
        <span>Photo</span>
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
          <button
            type="button"
            className="btn secondary"
            style={{ flex: 1 }}
            onClick={() => navigate(id ? `/camera/${id}` : "/camera")}
          >
            📷 Open Field Camera
          </button>
          <button
            type="button"
            className="btn secondary"
            style={{ flex: 1 }}
            onClick={() => fileRef.current?.click()}
          >
            🖼️ Upload / File
          </button>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          style={{ display: "none" }}
          onChange={(e) => e.target.files?.[0] && onPhoto(e.target.files[0])}
        />
        {photo && <img className="photo-preview" src={photo} alt="Observation preview" />}
        {photo && (
          <button className="btn secondary" type="button" disabled={analyzing} onClick={analyze} style={{ marginTop: "0.5rem" }}>
            {analyzing ? "Analyzing with local vision model…" : "Run Optional AI Identification"}
          </button>
        )}

        {ai && (
          <div className="card" style={{ marginTop: "0.6rem", background: "var(--bg-deep)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <strong>Possible identification: {ai.object}</strong>
              <span className="pill online">{ai.confidence}% confidence</span>
            </div>
            {ai.species && <p style={{ margin: "0.3rem 0" }}><em>Possible species: {ai.species}</em></p>}
            <p className="quiet" style={{ margin: "0.3rem 0" }}>{ai.desc}</p>
            <p className="quiet" style={{ margin: 0, fontStyle: "italic", color: "var(--warn)" }}>⚠️ {ai.disclaimer}</p>
          </div>
        )}
      </div>

      <div className="field">
        <span>Voice Note</span>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          {!recording ? (
            <button className="btn secondary" type="button" onClick={startVoice}>
              🎙️ Record Audio
            </button>
          ) : (
            <button className="btn warn" type="button" onClick={stopVoice}>
              ⏹️ Stop Recording
            </button>
          )}
          {recording && <span style={{ color: "var(--warn)", fontWeight: 600 }}>● Listening…</span>}
        </div>
        {audioUrl && (
          <div style={{ marginTop: "0.5rem" }}>
            <audio controls src={audioUrl} style={{ width: "100%", height: "36px" }} />
          </div>
        )}
        {transcript && (
          <div className="card" style={{ marginTop: "0.5rem", padding: "0.6rem 0.8rem" }}>
            <span className="quiet" style={{ display: "block", fontWeight: 600 }}>Voice Transcript:</span>
            <p style={{ margin: "0.2rem 0" }}>"{transcript}"</p>
            <button
              type="button"
              className="btn ghost"
              style={{ fontSize: "0.85rem", padding: 0 }}
              onClick={() => setNote((n) => (n ? `${n}\n${transcript}` : transcript))}
            >
              + Append to note
            </button>
          </div>
        )}
      </div>

      <div className="field">
        <span>Field Note</span>
        <textarea
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="What did you notice? (e.g. broad grooved bark, high chirping, morning frost)"
        />
      </div>

      <button className="btn" onClick={save} style={{ width: "100%", marginTop: "0.5rem" }}>
        Save Observation to Device
      </button>
    </section>
  );
}

