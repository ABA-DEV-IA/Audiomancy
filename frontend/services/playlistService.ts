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
 * Récupérer une playlist à partir des tags via le proxy.
 * Valeurs par défaut appliquées si non fournies.
 */
export async function fetchPlaylistTracks(
  tags: string,
  limit = 10,
  duration_min = 180,
  duration_max = 480
): Promise<Track[]> {
  // Formatage des tags pour correspondre à ce que FastAPI attend
  const formattedTags = tags.trim().replace(/\s+/g, '+');

  return fetchJson<Track[]>('/api/proxyPlaylist', {
    tags: formattedTags,
    limit,
    duration_min,
    duration_max,
  });
}

/**
 * Générer une playlist via le proxy à partir d'un prompt et d'une limite
 */
export async function fetchPlaylistTracksGenerate(limit = 10, prompt: string): Promise<Track[]> {
  return fetchJson<Track[]>('/api/proxyPlaylistGenerate', { limit, prompt });
}
