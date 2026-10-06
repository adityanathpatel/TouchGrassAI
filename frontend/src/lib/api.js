const API_URL = "http://localhost:8001/api";

export const api = {
  async generateAdventure(data) {
    try {
      const res = await fetch(`${API_URL}/adventures/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error("Failed to generate adventure");
      return res.json();
    } catch (e) {
      console.error(e);
      throw e;
    }
  },
  
  async getAdventure(id) {
    const res = await fetch(`${API_URL}/adventures/${id}`);
    if (!res.ok) throw new Error("Not found");
    return res.json();
  }
};
