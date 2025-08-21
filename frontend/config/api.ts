let API_BASE_URL = "";

// URLs finales exportées
export let API_PLAYLIST_URL = "";
export let API_PLAYLIST_GENERATE_URL = "";

export const initApiUrls = async () => {
  if (!API_BASE_URL) {
    // Charger config.json depuis le frontend
    const res = await fetch("/config.json");
    if (!res.ok) throw new Error("Impossible de charger la config API");
    const config = await res.json();
    API_BASE_URL = config.NEXT_PUBLIC_BACKEND_URL;

    // Initialiser les URLs
    API_PLAYLIST_URL = `${API_BASE_URL}/jamendo/tracks`;
    API_PLAYLIST_GENERATE_URL = `${API_BASE_URL}/generate/playlist`;
  }
};
