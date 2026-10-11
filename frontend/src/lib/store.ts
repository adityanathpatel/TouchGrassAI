import type { AppSettings, PackedAdventure, Preferences } from "../types";
import { clearAllData, deleteAdventure, getAdventure, idbGet, idbSet, listAdventures, saveAdventure } from "./idb";

const DEFAULT_PREFS: Preferences = {
  name: "",
  activities: ["walking"],
  fitness_level: "moderate",
  available_time_minutes: 60,
  preferred_distance_km: 3,
  difficulty: "beginner",
  interests: ["nature"],
  onboarded: false,
};

const DEFAULT_SETTINGS: AppSettings = {
  localOnly: true,
  cloudSync: false,
  demoMode: false,
};

export async function loadPreferences(): Promise<Preferences> {
  return (await idbGet<Preferences>("preferences")) || DEFAULT_PREFS;
}

export async function savePreferences(prefs: Preferences) {
  await idbSet("preferences", prefs);
}

export async function loadSettings(): Promise<AppSettings> {
  return (await idbGet<AppSettings>("settings")) || DEFAULT_SETTINGS;
}

export async function saveSettings(settings: AppSettings) {
  await idbSet("settings", settings);
}

export async function persistPack(pack: PackedAdventure) {
  await saveAdventure(pack);
  await idbSet("activeAdventureId", pack.id);
}

export async function loadPack(id: string) {
  return getAdventure<PackedAdventure>(id);
}

export async function allPacks() {
  return listAdventures<PackedAdventure>();
}

export async function exportLocalData() {
  return {
    exportedAt: new Date().toISOString(),
    leavesDevice: false,
    preferences: await loadPreferences(),
    settings: await loadSettings(),
    adventures: await allPacks(),
  };
}

export { clearAllData, deleteAdventure };

