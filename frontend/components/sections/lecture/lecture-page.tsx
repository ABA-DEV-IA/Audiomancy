"use client"

import { useEffect, useRef, useState } from "react"
import { usePlaylist } from "@/hooks/usePlaylist"
import { useRouter } from "next/navigation"
import LoadingPage from "./loadingSection"
import ErrorPage from "./errorSection"
import NoTracksPage from "./notrackSection"
import PlayerPage from "./playerSection"

interface LecturePageProps {
  params: { id: string }
}

export default function LecturePage({ params }: LecturePageProps) {
  const { tracks, loading, error, fetchTracks } = usePlaylist()
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (params.id) {
      fetchTracks(params.id)
    }
  }, [fetchTracks, params.id])

  if (loading) return <LoadingPage />
  if (error) return <ErrorPage error={error} />
  if (tracks.length === 0) return <NoTracksPage />

  return (
    <PlayerPage
      params={params}
      tracks={tracks}
      currentTrackIndex={currentTrackIndex}
      onSelectTrack={setCurrentTrackIndex}
      audioRef={audioRef}
    />
  )
}
