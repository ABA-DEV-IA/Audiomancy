import { Footer } from '@/components/layout/footer';
import { useRouter } from 'next/navigation';
import { RefObject } from 'react';
import { formatDuration } from '@/utils/formatDuration';
import { Track } from '@/types/track';
import { PlayerPageProps } from '@/types/playerPageProps';
import { useAuth } from "@/context/auth_context";
import { useState } from "react";
import { CreatePlaylistModal } from "@/components/sections/lecture/create-playlist-modal";


export default function PlayerPage({
  playlistId,
  tracks,
  currentTrackIndex,
  onSelectTrack,
  audioRef,
}: PlayerPageProps) {
  const router = useRouter();

  const { isAuthenticated, user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentTrack = tracks[currentTrackIndex];

  const openModal = () => {
    if (!isAuthenticated) {
      alert("Tu dois être connecté pour ajouter une playlist aux favoris.");
      return;
    }
    setIsModalOpen(true);
  };


  const handleSaveFavorite = async (data: { name: string }) => {
    try {
      const response = await fetch("/api/favorite/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user?.id,
          name: data.name,
          track_list: tracks.map(track => ({
            id: track.id,
            title: track.title,
            artist: track.artist,
            audio_url: track.audio_url,
            image: track.image,
            tags: track.tags,
            license_name: track.license_name,
            license_url: track.license_url
          }))
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert("Erreur : " + errorData.detail || "Impossible de créer le favori");
        return;
      }

      const result = await response.json();
      console.log("Favori créé :", result);
      alert(`Playlist "${data.name}" ajoutée aux favoris !`);
    } catch (err) {
      console.error(err);
      alert("Une erreur est survenue lors de la création du favori.");
    }
  };


  return (
    <div className="flex min-h-screen flex-col justify-between bg-[#2B2B2B] text-white">
      <div className="flex flex-grow flex-col p-6">
        {/* HEADER */}
        <div className="mb-6 rounded bg-[#6A0DAD] p-6 text-white">
          <h1 className="text-2xl font-bold">Lecture</h1>
          <p className="mt-2">Playlist : {playlistId}</p>
          
          {/* BOUTON AJOUT FAVORI */}
          <button
            type="button"
            onClick={openModal}
            className="mt-3 mr-3 rounded bg-gradient-to-r from-[#4CE0B3] to-[#3AB68B] px-4 py-2 font-semibold text-black hover:scale-105"
          >
            Ajouter aux favoris
          </button>

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

      <CreatePlaylistModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveFavorite}
        tracks={tracks}
      />

      <Footer />
    </div>
  );
}
