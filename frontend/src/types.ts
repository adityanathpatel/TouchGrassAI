export type Coordinate = { lat: number; lng: number };

export type Mission = { id: string; title: string; prompt: string; completed?: boolean };
export type ChecklistItem = { id: string; label: string; completed?: boolean };

export type AdventurePlan = {
  title: string;
  description: string;
  goal: string;
  difficulty: string;
  duration_minutes: number;
  missions: Mission[];
  checklist: ChecklistItem[];
  safety_notes: string[];
  bonus_challenge?: string | null;
  route_requirements?: string;
};

export type RouteResult = {
  provider: string;
  fallback: boolean;
  distance_km: number;
  duration_minutes: number;
  start: Coordinate;
  end: Coordinate;
  waypoints: Coordinate[];
  geometry: number[][];
  source: string;
};

export type Observation = {
  id: string;
  category: string;
  note: string;
  transcript: string;
  photoDataUrl?: string;
  audioDataUrl?: string;
  latitude?: number | null;
  longitude?: number | null;
  aiLabel?: string | null;
  aiConfidence?: number | null;
  createdAt: string;
  demo?: boolean;
};

export type Journal = {
  title: string;
  summary: string;
  highlights: string[];
  discoveries: string[];
  reflection: string;
  interesting_observations: string[];
  next_time: string[];
};

export type PackedAdventure = {
  id: string;
  plan: AdventurePlan;
  route: RouteResult | null;
  is_demo: boolean;
  activity: string;
  locationLabel: string;
  downloadedAt: string;
  status: "packed" | "active" | "complete";
  missions: Mission[];
  checklist: ChecklistItem[];
  observations: Observation[];
  startedAt?: string;
  finishedAt?: string;
  journal?: Journal;
};

export type Preferences = {
  name: string;
  activities: string[];
  fitness_level: string;
  available_time_minutes: number;
  preferred_distance_km: number;
  difficulty: string;
  interests: string[];
  onboarded: boolean;
};

export type AppSettings = {
  localOnly: boolean;
  cloudSync: boolean;
  demoMode: boolean;
};
