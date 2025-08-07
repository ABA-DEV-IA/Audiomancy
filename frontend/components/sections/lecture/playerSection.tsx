import { Footer } from '@/components/layout/footer';
import { useRouter } from 'next/navigation';
import { RefObject } from 'react';

interface PlayerPageProps {
  params: { id: string }
  tracks: any[]
  currentTrackIndex: number
  onSelectTrack: (index: number) => void
  audioRef: RefObject<HTMLAudioElement>
}

function formatDuration(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function PlayerPage({
  params,
  tracks,
  currentTrackIndex,
  onSelectTrack,
  audioRef,
}: PlayerPageProps) {
  const router = useRouter();
  const currentTrack = tracks[currentTrackIndex];

  return (
    <div className="flex flex-col justify-between min-h-screen bg-[#2B2B2B] text-white">
      <div className="flex flex-col flex-grow p-6">
        {/* HEADER */}
        <div className="bg-[#6A0DAD] text-white p-6 mb-6 rounded">
          <h1 className="text-2xl font-bold">LECTURE</h1>
          <p className="mt-2">
            Playlist :
            {params.id}
          </p>
          <button
            onClick={() => router.push('/')}
            className="bg-white text-[#6A0DAD] font-semibold px-4 py-2 rounded hover:bg-gray-100 transition"
          >
            ← Retour
          </button>
        </div>

        {/* PLAYER */}
        <div className="bg-white rounded-lg p-8 mb-6 w-full max-w-4xl mx-auto flex flex-col items-center text-black shadow-lg">
          <img
            src={currentTrack.image}
            alt={currentTrack.title}
            className="w-64 h-64 object-cover rounded mb-6 shadow"
            onError={(e) => {
              e.target.onerror = null; // pour éviter une boucle infinie si l'image par défaut n'existe pas
              e.target.src = '/images/default-category.png'; // chemin de ton image par défaut
            }}
          />
          <h2 className="text-2xl font-bold mb-2">{currentTrack.title}</h2>
          <p className="text-lg text-gray-700 mb-4">{currentTrack.artist}</p>
          <audio
            ref={audioRef}
            controls
            src={currentTrack.audio_url}
            // autoPlay supprimé
            onEnded={() => {
              // Passe au morceau suivant automatiquement
              const nextIndex = (currentTrackIndex + 1) % tracks.length; // boucle à 0 quand fin de playlist
              onSelectTrack(nextIndex);

              // Après avoir changé de piste, lance la lecture automatiquement
              setTimeout(() => {
                if (audioRef.current) {
                  audioRef.current.play();
                }
              }, 100); // petit délai pour que la source soit mise à jour
            }}
            className="w-full mb-4"
          />
          <p className="text-gray-700">
            Durée :
            {' '}
            {formatDuration(currentTrack.duration)}
          </p>

          {currentTrack.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {currentTrack.tags.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="bg-gray-200 text-gray-800 text-xs font-semibold px-3 py-1 rounded-full"
                >
                  #
                  {tag}
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
              className="text-blue-600 underline"
            >
              {currentTrack.license_name}
            </a>
          </div>
          )}
        </div>

        {/* TRACK LIST */}
        <div className="bg-[#1E1E1E] rounded p-4">
          <h3 className="text-lg font-semibold mb-4">Morceaux</h3>
          <ul className="space-y-2">
            {tracks.map((track, index) => (
              <li
                key={track.id}
                className={`p-2 rounded cursor-pointer ${
                  index === currentTrackIndex
                    ? 'bg-[#6A0DAD]'
                    : 'hover:bg-[#3A3A3A]'
                }`}
                onClick={() => onSelectTrack(index)}
              >
                {track.title}
                {' '}
                -
                {track.artist}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Footer />
    </div>
  );
}
