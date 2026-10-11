export class ApiError extends Error {
  status: number;
  constructor(message: string, status = 500) {
    super(message);
    this.status = status;
  }
}

async function parse(res: Response) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const detail = typeof data.detail === "string" ? data.detail : "Request failed.";
    throw new ApiError(detail, res.status);
  }
  return data;
}

export const api = {
  health: () => fetch("/api/health").then(parse),
  aiStatus: () => fetch("/api/ai/status").then(parse),
  generateAdventure: (body: unknown) =>
    fetch("/api/adventures/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then(parse),
  demoAdventure: () => fetch("/api/adventures/demo", { method: "POST" }).then(parse),
  getAdventure: (id: string) => fetch(`/api/adventures/${id}`).then(parse),
  download: (id: string) => fetch(`/api/adventures/${id}/download`, { method: "POST" }).then(parse),
  finish: (id: string) => fetch(`/api/adventures/${id}/finish`, { method: "POST" }).then(parse),
  generateRoute: (body: unknown, adventureId?: string) =>
    fetch(`/api/routes/generate${adventureId ? `?adventure_id=${adventureId}` : ""}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then(parse),
  searchLocation: (q: string) => fetch(`/api/routes/search?q=${encodeURIComponent(q)}`).then(parse),
  createObservation: (body: unknown) =>
    fetch("/api/observations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then(parse),
  generateJournal: (body: unknown) =>
    fetch("/api/journal/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then(parse),
  analyzeImage: async (file: File, hint = "") => {
    const form = new FormData();
    form.append("file", file);
    form.append("hint", hint);
    return parse(await fetch("/api/ai/analyze-image", { method: "POST", body: form }));
  },
  transcribe: async (file: Blob) => {
    const form = new FormData();
    form.append("file", file, "note.webm");
    return parse(await fetch("/api/ai/transcribe", { method: "POST", body: form }));
  },
  exportServer: () => fetch("/api/privacy/export").then(parse),
  deleteServer: () => fetch("/api/privacy/data", { method: "DELETE" }).then(parse),
};
