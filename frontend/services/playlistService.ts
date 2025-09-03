import { Track } from "@/types/track";

/**
 * Helper pour effectuer une requête POST et retourner du JSON typé.
 */
async function fetchJson<T>(url: string, body: Record<string, unknown>): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error ${response.status}: ${errorText}`);
  }

  return response.json() as Promise<T>;
}

/**
 * Récupérer une playlist à partir des tags et d’un trackId (catégorie).
 */
export async function fetchPlaylistTracks(trackId: string, tags: string): Promise<Track[]> {
  return fetchJson<Track[]>("/api/proxyPlaylist", { trackId, tags });
}

/**
 * Générer une playlist en fonction d'un prompt et d'une limite.
 */
export async function fetchPlaylistTracksGenerate(limit: number, prompt: string): Promise<Track[]> {
  return fetchJson<Track[]>("/api/proxyPlaylistGenerate", { limit, prompt });
}
