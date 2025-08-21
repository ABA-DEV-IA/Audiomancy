// src/config/api.ts

let API_BASE_URL = "";

// Charger la config une seule fois
export const loadConfig = async () => {
  if (!API_BASE_URL) {
    const res = await fetch("/config.json");
    const config = await res.json();
    API_BASE_URL = config.NEXT_PUBLIC_BACKEND_URL;
  }
};

export let API_PLAYLIST_URL: string;
export let API_PLAYLIST_GENERATE_URL: string;

export const initApiUrls = async () => {
  await loadConfig();
  API_PLAYLIST_URL = `${API_BASE_URL}/jamendo/tracks`;
  API_PLAYLIST_GENERATE_URL = `${API_BASE_URL}/generate/playlist`;
};
