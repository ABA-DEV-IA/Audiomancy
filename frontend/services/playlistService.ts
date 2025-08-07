// src/services/playlistService.ts
import { API_PLAYLIST_URL, API_PLAYLIST_GENERATE_URL } from '@/config/api';
import { Track } from '@/types/track';

export async function fetchPlaylistTracks(playlistId: string): Promise<Track[]> {
  const response = await fetch(`${API_PLAYLIST_URL}/${playlistId}`);
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des pistes');
  }
  const data = await response.json();
  return data.tracks || data;
}

export async function generatePlaylist(wish: string, size: number): Promise<Track[]> {
  console.log('✅ Fetching playlist...');
  console.log(JSON.stringify({ wish, size }));
  const response = await fetch(`${API_PLAYLIST_GENERATE_URL}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ wish, size }),
  });

  if (!response.ok) throw new Error('Erreur API');
  const data = await response.json();
  console.log('📦 Données reçues:', data);

  return data || data;
}
