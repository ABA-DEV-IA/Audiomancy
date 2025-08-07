// src/hooks/usePlaylist.ts
import { useState, useCallback } from 'react';
import { Track } from '@/types/track';
import { fetchPlaylistTracks } from '@/services/playlistService';

export function usePlaylist() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTracks = useCallback(async (playlistId: string) => {
    if (!playlistId) {
      setError('Aucun ID de playlist fourni');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const fetchedTracks = await fetchPlaylistTracks(playlistId);
      setTracks(fetchedTracks);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    tracks, loading, error, fetchTracks,
  };
}
