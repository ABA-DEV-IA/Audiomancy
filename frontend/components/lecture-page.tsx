"use client"

import { useState, useEffect, useRef } from "react"
import { usePlaylist } from "@/hooks/usePlaylist"

interface LecturePageProps {
  playlistId: string | null
  trackId: string | null
}

function formatDuration(seconds: number) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

export function LecturePage({ playlistId, trackId }: LecturePageProps) {
  const { tracks, loading, error, fetchTracks } = usePlaylist()
  const [currentTrack, setCurrentTrack] = useState<typeof tracks[0] | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (playlistId) {
      fetchTracks(playlistId)
    }
  }, [fetchTracks, playlistId])

  useEffect(() => {
    console.log("LecturePage trackId:", trackId)
    if (trackId && tracks.length > 0) {
      const found = tracks.find((t) => t.id === trackId) || null
      setCurrentTrack(found)
    } else {
      setCurrentTrack(null)
    }
  }, [trackId, tracks])

  if (!trackId) {
    return <div className="p-6 text-white">Aucun morceau sélectionné.</div>
  }

  if (loading) {
    return <div className="p-6 text-white">Chargement des pistes...</div>
  }

  if (error) {
    return <div className="p-6 text-red-500">Erreur : {error}</div>
  }

  if (!currentTrack) {
    return <div className="p-6 text-white">Morceau non trouvé.</div>
  }

  return (
    <div className="h-screen flex flex-col bg-[#2B2B2B] p-6">
      <div className="bg-[#6A0DAD] text-white p-6 mb-6 rounded">
        <h1 className="text-2xl font-bold">LECTURE</h1>
        <p className="mt-2">{currentTrack.title} - {currentTrack.artist}</p>
      </div>

      <div className="bg-white rounded-lg p-6 mb-6 max-w-2xl mx-auto flex flex-col items-center">
        <img
          src={currentTrack.image}
          alt={currentTrack.title}
          className="w-48 h-48 object-cover rounded mb-4"
        />
        <audio
          ref={audioRef}
          controls
          src={currentTrack.audio_url}
          autoPlay
          className="w-full"
        />
        <p className="mt-4 text-gray-700">Durée : {formatDuration(currentTrack.duration)}</p>
      </div>
    </div>
  )
}
