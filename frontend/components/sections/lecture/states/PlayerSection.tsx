import { Footer } from '@/components/layout/footer';
import { useRouter } from 'next/navigation';
import { RefObject } from 'react';
import { formatDuration } from '@/utils/formatDuration';
import { Track } from '@/types/track';
import { PlayerPageProps } from '@/types/playerPageProps';

export default function PlayerPage({
  playlistId,
  tracks,
  currentTrackIndex,
  onSelectTrack,
  audioRef,
}: PlayerPageProps) {
  const router = useRouter();
  const currentTrack = tracks[currentTrackIndex];

  return (
    <div className="flex min-h-screen flex-col justify-between bg-[#2B2B2B] text-white">
      <div className="flex flex-grow flex-col p-6">
        {/* HEADER */}
        <div className="mb-6 rounded bg-[#6A0DAD] p-6 text-white">
          <h1 className="text-2xl font-bold">Lecture</h1>
          <p className="mt-2">Playlist : {playlistId}</p>
          <button
            type="button"
            onClick={() => router.push('/')}
            className="mt-3 rounded bg-gradient-to-r from-[#6A0DAD] to-[#A45EE5] px-4 py-2 font-semibold text-white hover:scale-105"
          >
            ← Retour
          </button>
        </div>

        {/* PLAYER */}
        <div className="mx-auto mb-6 flex w-full max-w-4xl flex-col items-center rounded-lg bg-[#301934] p-8 text-white shadow-lg">
          <img
            src={currentTrack.image}
            alt={currentTrack.title}
            className="mb-6 h-64 w-64 rounded object-cover shadow"
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              target.onerror = null;
              target.src = '/images/default-category.png';
            }}
          />
          <h2 className="mb-2 text-2xl font-bold">{currentTrack.title}</h2>
          <p className="mb-4 text-lg text-[#D9B3FF]">{currentTrack.artist}</p>

          <audio
            ref={audioRef}
            controls
            src={currentTrack.audio_url}
            onEnded={() => {
              const nextIndex = (currentTrackIndex + 1) % tracks.length;
              onSelectTrack(nextIndex);
              setTimeout(() => { audioRef.current?.play(); }, 100);
            }}
            className="mb-4 w-full"
          />

          {currentTrack.tags?.length > 0 && (
            <div className="mb-4 mt-3 flex flex-wrap gap-2">
              {currentTrack.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-[#3A1E5F] px-3 py-1 text-xs font-semibold text-[#D9B3FF]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {currentTrack.license_url && (
            <div className="mb-4 text-sm">
              <span className="mr-1 font-semibold">Licence:</span>
              <a
                href={currentTrack.license_url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-[#FF934F]"
              >
                {currentTrack.license_name}
              </a>
            </div>
          )}
        </div>

        {/* TRACK LIST */}
        <div className="rounded bg-[#301934] p-4">
          <h3 className="mb-4 text-lg font-semibold text-white">Morceaux</h3>
          <ul className="space-y-2">
            {tracks.map((track, index) => (
              <li
                key={track.id}
                role="button"
                tabIndex={0}
                className={`cursor-pointer rounded p-2 ${
                  index === currentTrackIndex
                    ? 'bg-[#6A0DAD] text-white'
                    : 'hover:bg-[#4B2A7B] hover:text-white'
                }`}
                onClick={() => onSelectTrack(index)}
                onKeyDown={(e) => { if (e.key === 'Enter') onSelectTrack(index); }}
              >
                {track.title} – {track.artist}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Footer />
    </div>
  );
}
