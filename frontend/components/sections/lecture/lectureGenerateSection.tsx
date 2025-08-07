"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"

import { useGeneratePlaylist } from "@/hooks/useGeneratePlaylist"
import { useGeneration } from "@/context/generation_context"
import { Track } from "@/types/track"

import LoadingPage from "@/components/sections/lecture/loadingSection"
import ErrorPage from "@/components/sections/lecture/errorSection"
import NoTracksPage from "@/components/sections/lecture/notrackSection"
import PlayerPage from "@/components/sections/lecture/playerSection"

export default function LecturePageGenerate() {
  const { wish, playlistSize } = useGeneration()
  const router = useRouter()

  const [playlist, setPlaylist] = useState<Track[]>([])
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)
  const hasStartedRef = useRef(false)

  const { loading, error, progress, start } = useGeneratePlaylist(
    wish,
    playlistSize,
    (data) => setPlaylist(data || [])
  )

  useEffect(() => {
    if (!wish || !playlistSize || hasStartedRef.current) return
    hasStartedRef.current = true
    start()
  }, [wish, playlistSize, start])

  if (!wish || !playlistSize) return <LoadingPage />
  if (loading) return <LoadingPage />
  if (error) return <ErrorPage error={error} />
  if (!playlist.length) return <NoTracksPage />

  return (
    <PlayerPage
      tracks={playlist}
      params={{ id: "generated" }}
      currentTrackIndex={currentTrackIndex}
      onSelectTrack={setCurrentTrackIndex}
      audioRef={audioRef}
    />
  )
}
