import { useState, useCallback } from "react"

interface Track {
  id: string
  title: string
  artist: string
  audio_url: string
  duration: number
  license: string
  tags: string[]
  image: string
}

export function usePlaylist() {
  const [tracks, setTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTracks = useCallback(async (playlistId: string) => {
    if (!playlistId) {
      setError("Aucun ID de playlist fourni")
      return
    }

    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/playlist/${playlistId}`)
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des pistes")
      }
      const data = await response.json()
      setTracks(data.tracks || data) // si ton JSON a un champ "tracks"
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  return { tracks, loading, error, fetchTracks }
}
