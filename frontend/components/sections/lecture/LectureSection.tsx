'use client';

import { useEffect, useRef, useState } from 'react';
import { fetchPlaylistTracks } from '@/services/playlistService';

import LoadingPage from './states/LoadingSection';
import ErrorPage from './states/ErrorSection';
import NoTracksPage from './states/NotrackSection';
import PlayerPage from './states/PlayerSection';
import { Track } from '@/types/track';

interface LecturePageProps {
  trackId: string;
  tags?: string;
}

export default function LecturePage({ trackId, tags }: LecturePageProps) {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const loadTracks = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!tags) throw new Error("Tags are required to fetch tracks");

        console.log("[LecturePage] trackId:", trackId);
        console.log("[LecturePage] tags:", tags);

        const fetchedTracks = await fetchPlaylistTracks(trackId, tags);
        setTracks(fetchedTracks);
      } catch (err: any) {
        setError(err.message || 'Erreur lors du chargement des pistes.');
        setTracks([]);
      } finally {
        setLoading(false);
      }
    };

    loadTracks();
  }, [trackId, tags]);

  if (loading) return <LoadingPage progress={0} />;
  if (error) return <ErrorPage error={error} />;
  if (tracks.length === 0) return <NoTracksPage />;

  return (
    <PlayerPage
      playlistId={trackId}
      tracks={tracks}
      currentTrackIndex={currentTrackIndex}
      onSelectTrack={setCurrentTrackIndex}
      audioRef={audioRef}
    />
  );
}
