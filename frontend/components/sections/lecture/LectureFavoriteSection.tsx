"use client";

import { usePlaylist } from "@/context/favorite_context";
import PlayerPage from "./states/PlayerSection";
import { useRef, useState } from "react";

export default function LectureFavoritePage() {
  const { title, playlist } = usePlaylist();
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  if (!playlist) return <p>Aucune playlist chargée.</p>;

  return (
    <div>
      <PlayerPage
        playlistId={title as string}
        tracks={playlist}
        currentTrackIndex={currentTrackIndex}
        onSelectTrack={setCurrentTrackIndex}
        audioRef={audioRef}
        isFavorite={true}
      />
    </div>
  );
}