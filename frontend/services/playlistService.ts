// src/services/playlistService.ts
import { API_PLAYLIST_URL } from '@/config/api';
import { API_PLAYLIST_GENERATE_URL } from '@/config/api';
import { Track } from '@/types/track';

// 🔹 Récupérer une playlist à partir des tags
export async function fetchPlaylistTracks(playlistTags: string): Promise<Track[]> {

  const response = await fetch(`${API_PLAYLIST_URL}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tags: playlistTags.replace(/\s+/g, '+'), // ex: "rock chill" → "rock+chill"
      // duration_min, duration_max, limit seront pris par défaut côté API
    }),
  });

  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des pistes');
  }

  const data = await response.json();

  return data;
}

export async function fetchPlaylistTracksGenerate(limit: number, prompt: string): Promise<Track[]> {
  console.log('generate playlist with tags:');

  const response = await fetch(`${API_PLAYLIST_GENERATE_URL}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      limit: limit,
      prompt: prompt
    }),
  });

  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des pistes');
  }

  const data = await response.json();

  return data;
}