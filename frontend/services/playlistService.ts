// src/services/playlistService.ts
import { API_PLAYLIST_URL, API_PLAYLIST_GENERATE_URL } from "@/config/variables/api";
import { Track } from "@/types/track";

// Récupérer une playlist à partir des tags
export async function fetchPlaylistTracks(playlistTags: string): Promise<Track[]> {

  const response = await fetch(API_PLAYLIST_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      tags: playlistTags.replace(/\s+/g, "+"),
    }),
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des pistes");
  }

  return response.json();
}

export async function fetchPlaylistTracksGenerate(limit: number, prompt: string): Promise<Track[]> {

  const response = await fetch(API_PLAYLIST_GENERATE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      limit,
      prompt,
    }),
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des pistes");
  }

  return response.json();
}
