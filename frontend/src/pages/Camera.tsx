import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../lib/api";
import { isOnline } from "../lib/geo";

const MODES = ["Nature", "Macro (Leaves/Flora)", "Wildlife", "Landscape"];

export function CameraPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photo, setPhoto] = useState<string>("");
  const [mode, setMode] = useState("Nature");
  const [analyzing, setAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<string>("");
  const [cameraError, setCameraError] = useState(false);

  useEffect(() => {
    let activeStream: MediaStream | null = null;
    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: "environment" } })
      .then((s) => {
        activeStream = s;
        setStream(s);
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
      })
      .catch(() => {
        setCameraError(true);
      });

    return () => {
      activeStream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  function capturePhoto() {
    if (videoRef.current && canvasRef.current) {
      const v = videoRef.current;
      const c = canvasRef.current;
      c.width = v.videoWidth || 640;
      c.height = v.videoHeight || 480;
      const ctx = c.getContext("2d");
      if (ctx) {
        ctx.drawImage(v, 0, 0, c.width, c.height);
        const dataUrl = c.toDataURL("image/jpeg", 0.85);
        setPhoto(dataUrl);
        // flash feedback
        stream?.getTracks().forEach((t) => t.stop());
      }
    }
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(String(reader.result || ""));
    reader.readAsDataURL(file);
  }

  async function runAiIdentify() {
    if (!photo || !isOnline()) return;
    setAnalyzing(true);
    try {
      // convert dataUrl to blob
      const res = await fetch(photo);
      const blob = await res.blob();
      const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
      const data = await api.analyzeImage(file, mode);
      const r = data.result;
      setAiResult(`${r.possible_identification || r.possible_object} (${r.confidence_label || "AI Guess"})\n${r.disclaimer || ""}`);
    } catch {
      setAiResult("Vision identification unavailable offline.");
    } finally {
      setAnalyzing(false);
    }
  }

  function usePhoto() {
    // store in sessionStorage for AddObservationPage to pick up
    if (photo) {
      sessionStorage.setItem("capturedPhoto", photo);
    }
    if (id) {
      navigate(`/observe/${id}`);
    } else {
      navigate("/");
    }
  }

  function retake() {
    setPhoto("");
    setAiResult("");
    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: "environment" } })
      .then((s) => {
        setStream(s);
        if (videoRef.current) videoRef.current.srcObject = s;
      })
      .catch(() => setCameraError(true));
  }

  return (
    <section>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.8rem" }}>
        <h1>Field Camera</h1>
        <button className="btn ghost" onClick={() => (id ? navigate(`/outdoor/${id}`) : navigate(-1))}>
          ✕ Close
        </button>
      </div>

      <div className="chips" style={{ marginBottom: "0.8rem" }}>
        {MODES.map((m) => (
          <button
            key={m}
            className={`chip ${mode === m ? "on" : ""}`}
            onClick={() => setMode(m)}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="camera-viewfinder">
        {!photo ? (
          <>
            {!cameraError ? (
              <video ref={videoRef} autoPlay playsInline muted className="camera-video" />
            ) : (
              <div style={{ padding: "2rem", color: "#fff", textAlign: "center", margin: "auto" }}>
                <p>📷 Live camera stream unavailable.</p>
                <p className="quiet" style={{ color: "#bbb" }}>Use file picker or device gallery below.</p>
                <button className="btn secondary" style={{ color: "#fff", borderColor: "#fff" }} onClick={() => fileRef.current?.click()}>
                  Upload / Take Photo
                </button>
              </div>
            )}
            <div className="viewfinder-grid">
              <div /><div /><div />
              <div /><div /><div />
              <div /><div /><div />
            </div>
            <div className="viewfinder-overlay">
              <span className="pill online">🌿 {mode}</span>
              <span style={{ fontSize: "0.85rem" }}>Tap to snap</span>
            </div>
            <div className="shutter-bar">
              <button
                type="button"
                className="btn ghost"
                style={{ color: "#fff" }}
                onClick={() => fileRef.current?.click()}
              >
                🖼️ Gallery
              </button>
              <button
                type="button"
                className="shutter-btn"
                onClick={capturePhoto}
                title="Capture Photo"
              />
              <div style={{ width: "40px" }} />
            </div>
          </>
        ) : (
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <img src={photo} alt="Captured" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div className="viewfinder-overlay">
              <span className="pill online">Captured ✓</span>
              <button className="btn ghost" style={{ color: "#fff" }} onClick={retake}>
                🔄 Retake
              </button>
            </div>
          </div>
        )}
      </div>

      <canvas ref={canvasRef} style={{ display: "none" }} />
      <input ref={fileRef} type="file" accept="image/*" capture="environment" style={{ display: "none" }} onChange={handleFile} />

      {photo && (
        <div className="stack" style={{ marginTop: "1rem" }}>
          {aiResult && (
            <div className="card" style={{ background: "var(--bg-deep)" }}>
              <strong>AI Identification</strong>
              <p style={{ margin: "0.3rem 0" }}>{aiResult}</p>
            </div>
          )}
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button className="btn" style={{ flex: 1 }} onClick={usePhoto}>
              ✓ Attach to Observation
            </button>
            <button className="btn secondary" disabled={analyzing} onClick={runAiIdentify}>
              {analyzing ? "Analyzing…" : "Scan with AI"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
