import { API_PLAYLIST_URL, API_PLAYLIST_GENERATE_URL } from '@/config/variables/api';
import { Track } from '@/types/track';

/**
 * Helper pour effectuer une requête POST et retourner du JSON typé.
 */
async function fetchJson<T>(url: string, body: Record<string, unknown>): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Erreur API (${response.status}) lors de la récupération des pistes`);
  }

  return response.json() as Promise<T>;
}

/**
 * Récupérer une playlist à partir des tags.
 */
export async function fetchPlaylistTracks(tags: string): Promise<Track[]> {
  return fetchJson<Track[]>(API_PLAYLIST_URL, { tags });
}

/**
 * Générer une playlist en fonction d'un prompt et d'une limite.
 */
export async function fetchPlaylistTracksGenerate(limit: number, prompt: string): Promise<Track[]> {
  return fetchJson<Track[]>(API_PLAYLIST_GENERATE_URL, { limit, prompt });
}
