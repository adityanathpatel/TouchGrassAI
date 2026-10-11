import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../lib/api";
import { allPacks, loadPack, persistPack } from "../lib/store";
import type { Journal, PackedAdventure } from "../types";

function JournalView({ pack, journal }: { pack: PackedAdventure; journal: Journal }) {
  function exportJournal() {
    const md = `# ${journal.title}
*Location: ${pack.locationLabel || "Nature walk"}*
*Date: ${pack.finishedAt ? new Date(pack.finishedAt).toLocaleDateString() : new Date().toLocaleDateString()}*
*Distance: ${pack.route?.distance_km ?? "—"} km | Duration: ${pack.plan.duration_minutes} min*

## Summary
${journal.summary}

## Highlights
${journal.highlights.map((h) => `- ${h}`).join("\n")}

## Discoveries
${journal.discoveries.map((d) => `- ${d}`).join("\n")}

## Observations
${pack.observations.map((o) => `### ${o.category}: ${o.note || "(photo/audio note)"}\n${o.aiLabel ? `*AI: ${o.aiLabel}*\n` : ""}${o.transcript ? `*Voice transcript: "${o.transcript}"*\n` : ""}`).join("\n")}

## Reflection
${journal.reflection}

## Next Time
${journal.next_time.map((n) => `- ${n}`).join("\n")}
`;
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${journal.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-journal.md`;
    a.click();
  }

  return (
    <article className="journal-card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          {pack.is_demo && <span className="demo-flag">Demo Scrapbook</span>}
          <p className="quiet" style={{ margin: "0.2rem 0" }}>📍 {pack.locationLabel || "Outdoor Expedition"}</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <span className="pill online" style={{ fontSize: "0.75rem" }}>
            {pack.finishedAt ? new Date(pack.finishedAt).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" }) : "Recent walk"}
          </span>
        </div>
      </div>

      <h1 style={{ marginTop: "0.4rem", fontSize: "clamp(1.8rem, 5vw, 2.6rem)" }}>{journal.title}</h1>

      <div style={{ display: "flex", gap: "1rem", color: "var(--muted)", fontSize: "0.95rem", margin: "0.4rem 0 1.2rem" }}>
        <span>📍 <strong>{pack.route?.distance_km ?? "—"} km</strong> explored</span>
        <span>⏱️ <strong>{pack.plan.duration_minutes} min</strong> outside</span>
        <span>🎯 <strong>{pack.missions.filter((m) => m.completed).length}</strong> missions done</span>
      </div>

      {/* AI-Generated Story */}
      <div className="card" style={{ background: "var(--sand)", border: "1.5px dashed var(--line)", padding: "1.2rem", margin: "1rem 0" }}>
        <h3 style={{ margin: "0 0 0.4rem", color: "var(--moss)" }}>🌿 Field Story</h3>
        <p className="serif" style={{ fontSize: "1.2rem", color: "var(--ink)", lineHeight: 1.6, margin: 0 }}>
          "{journal.summary}"
        </p>
      </div>

      <h2>Highlights</h2>
      <ul>
        {journal.highlights.map((h) => (
          <li key={h} style={{ margin: "0.3rem 0" }}>{h}</li>
        ))}
      </ul>

      {/* Scrapbook Photo Gallery */}
      {pack.observations.some((o) => o.photoDataUrl) && (
        <div style={{ margin: "1.8rem 0" }}>
          <h2>Scrapbook Field Photos</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1.2rem", marginTop: "0.8rem" }}>
            {pack.observations
              .filter((o) => o.photoDataUrl)
              .map((obs) => (
                <div key={obs.id} className="scrapbook-polaroid">
                  <img src={obs.photoDataUrl} alt={obs.category} />
                  <div className="caption">{obs.category}: {obs.note || "Field Discovery"}</div>
                  {obs.aiLabel && (
                    <div style={{ textAlign: "center", fontSize: "0.75rem", color: "var(--muted)", marginTop: "0.2rem" }}>
                      AI Tag: {obs.aiLabel}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      <h2>Discoveries</h2>
      <ul>
        {journal.discoveries.map((h) => (
          <li key={h} style={{ margin: "0.3rem 0" }}>{h}</li>
        ))}
      </ul>

      {pack.observations.length > 0 && (
        <>
          <h2>Field Notes & Audio Logs ({pack.observations.length})</h2>
          <div className="stack" style={{ gap: "0.8rem", margin: "1rem 0" }}>
            {pack.observations.map((obs) => (
              <div key={obs.id} className="card" style={{ padding: "0.9rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                  <span className="chip on" style={{ fontSize: "0.78rem", padding: "0.2rem 0.6rem" }}>{obs.category}</span>
                  {obs.aiLabel && <span className="pill online" style={{ fontSize: "0.72rem" }}>AI: {obs.aiLabel}</span>}
                </div>
                {obs.audioDataUrl && (
                  <div style={{ margin: "0.4rem 0" }}>
                    <audio controls src={obs.audioDataUrl} style={{ width: "100%", height: "32px" }} />
                  </div>
                )}
                {obs.note && <p style={{ margin: "0.3rem 0", color: "var(--ink)" }}>{obs.note}</p>}
                {obs.transcript && <p className="quiet" style={{ margin: "0.2rem 0", fontStyle: "italic" }}>"{obs.transcript}"</p>}
              </div>
            ))}
          </div>
        </>
      )}

      <h2>Personal Reflection</h2>
      <p style={{ fontSize: "1.05rem", lineHeight: 1.6 }}>{journal.reflection}</p>

      {/* Next Adventure Suggestion */}
      <div className="card" style={{ marginTop: "1.8rem", background: "var(--bg-deep)", borderLeft: "5px solid var(--moss)" }}>
        <h3 style={{ margin: "0 0 0.3rem" }}>🧭 Next Adventure Suggestion</h3>
        <p style={{ margin: "0 0 0.8rem" }}>
          {journal.next_time?.[0]
            ? `Next time: ${journal.next_time.join(" · ")}`
            : "Keep the momentum going: Try a morning quiet loop or a new trail in an unfamiliar neighborhood."}
        </p>
        <Link className="btn" to="/create" style={{ display: "inline-flex" }}>
          Plan Next Adventure →
        </Link>
      </div>

      <div className="stack" style={{ marginTop: "1.5rem" }}>
        <button className="btn" type="button" onClick={exportJournal}>
          📄 Export Scrapbook Journal (.md)
        </button>
        <Link className="btn secondary" to="/adventures" style={{ textAlign: "center" }}>
          View All Saved Adventures
        </Link>
      </div>
    </article>
  );
}



export function JournalPage() {
  const { id } = useParams();
  const [pack, setPack] = useState<PackedAdventure | null>(null);
  const [packs, setPacks] = useState<PackedAdventure[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (id) loadPack(id).then((p) => setPack(p || null));
    else allPacks().then((list) => setPacks(list.filter((p) => p.journal || p.status === "complete")));
  }, [id]);

  async function generate() {
    if (!pack) return;
    setBusy(true);
    setError("");
    try {
      const data = await api.generateJournal({
        adventure_id: pack.id,
        observations: pack.observations,
        completed_missions: pack.missions.filter((m) => m.completed).map((m) => m.prompt),
        notes: pack.observations.map((o) => o.note).join("\n"),
        voice_transcripts: pack.observations.map((o) => o.transcript).filter(Boolean),
        distance_km: pack.route?.distance_km,
        duration_minutes: pack.plan.duration_minutes,
        demo: pack.is_demo,
      });
      const next = { ...pack, journal: data.journal as Journal };
      await persistPack(next);
      setPack(next);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Journal generation needs local AI or Demo Mode.");
    } finally {
      setBusy(false);
    }
  }

  if (!id) {
    return (
      <section>
        <h1>Adventure Journal</h1>
        {packs.length === 0 && <p>Finish an adventure, then write it here.</p>}
        <div className="stack">
          {packs.map((p) => (
            <Link key={p.id} className="card" to={`/journal/${p.id}`} style={{ textDecoration: "none", color: "inherit" }}>
              <h3>{p.journal?.title || p.plan.title}</h3>
              <p className="quiet">{p.finishedAt?.slice(0, 10)}</p>
            </Link>
          ))}
        </div>
      </section>
    );
  }

  if (!pack) return <p>Journal not found.</p>;
  return (
    <section className="journal-page">
      {error && <div className="banner">{error}</div>}
      {pack.journal ? (
        <JournalView pack={pack} journal={pack.journal} />
      ) : (
        <>
          <h1>Write the walk down</h1>
          <p>Uses your notes, missions, and the local open-weight model. Nothing is uploaded by default.</p>
          <button className="btn" disabled={busy} onClick={generate}>
            {busy ? "Writing…" : "Generate Adventure Journal"}
          </button>
        </>
      )}
    </section>
  );
}
