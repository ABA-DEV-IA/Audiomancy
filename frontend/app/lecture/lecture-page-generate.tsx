"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useGeneratePlaylist } from "@/hooks/use_generate_playlist"
import LoadingPage from "./loading-page"
import ErrorPage from "./error-page"
import NoTracksPage from "./notrack-page"
import PlayerPage from "./player-page"
import { useGeneration } from "@/context/generation_context"

export default function LecturePageGenerate() {
  const { wish, playlistSize } = useGeneration()
  
  console.log("Wish:", wish)
  console.log("Playlist size:", playlistSize)
  const router = useRouter()

  const [playlist, setPlaylist] = useState<string[]>([])
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  const { loading, error, progress, start } = useGeneratePlaylist(
    wish,
    playlistSize,
    (data) => {
      setPlaylist(data.playlist || [])
    }
  )

  // Lancer la génération si données présentes
  useEffect(() => {
    if (!wish || !playlistSize) return

    // Lance la génération uniquement si les deux sont valides
    start()
  }, [wish, playlistSize, start])

  if (!wish || !playlistSize) return <LoadingPage />
  if (loading) return <LoadingPage />
  if (error) return <ErrorPage error={error} />
  if (!playlist || playlist.length === 0) return <NoTracksPage />

  return (
    <PlayerPage
      tracks={playlist}
      params={{ id: "generated" }} // ou autre identifiant fictif
      currentTrackIndex={currentTrackIndex}
      onSelectTrack={setCurrentTrackIndex}
      audioRef={audioRef}
    />
  )
}
