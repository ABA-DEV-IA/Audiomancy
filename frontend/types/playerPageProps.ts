import { Track } from '@/types/track';
import { RefObject } from 'react';

export interface PlayerPageProps {
  playlistId: string;
  tracks: Track[];
  currentTrackIndex: number;
  onSelectTrack: (index: number) => void;
  audioRef: RefObject<HTMLAudioElement>;
  isFavorite?: Boolean;
}