'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { fetchPlaylistTracksGenerate } from '@/services/playlistService';
import { useGeneration } from '@/context/generation_context';
import { Track } from '@/types/track';

import LoadingPage from '@/components/sections/lecture/states/LoadingSection';
import ErrorPage from '@/components/sections/lecture/states/ErrorSection';
import NoTracksPage from '@/components/sections/lecture/states/NotrackSection';
import PlayerPage from '@/components/sections/lecture/states/PlayerSection';

export default function LectureGeneratePage() {
  const { wish, playlistSize } = useGeneration();
  const router = useRouter();

  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (!wish || !playlistSize || hasStartedRef.current) return;

    hasStartedRef.current = true;

    const generatePlaylist = async () => {
      setLoading(true);
      setError(null);
      setProgress(0);

      try {
        // Ici tu pourrais ajouter un faux "progress" animé si tu veux
        const tracks = await fetchPlaylistTracksGenerate(playlistSize, wish);
        setPlaylist(tracks || []);
      } catch (err: any) {
        setError(err.message || 'Une erreur est survenue lors de la génération de la playlist.');
        setPlaylist([]);
      } finally {
        setLoading(false);
        setProgress(100);
      }
    };

    generatePlaylist();
  }, [wish, playlistSize]);

  if (!wish || !playlistSize) return <LoadingPage progress={progress} />;
  if (loading) return <LoadingPage progress={progress} />;
  if (error) return <ErrorPage error={error} />;
  if (!playlist.length) return <NoTracksPage />;

  return (
    <PlayerPage
      playlistId="generated"
      tracks={playlist}
      currentTrackIndex={currentTrackIndex}
      onSelectTrack={setCurrentTrackIndex}
      audioRef={audioRef}
    />
  );
}
