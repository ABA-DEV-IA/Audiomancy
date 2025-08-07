import { useState, useCallback } from "react"
import { generatePlaylist } from "@/services/playlistService"
import { Track } from "@/types/track"

type UseGeneratePlaylistReturn = {
  loading: boolean
  error: string | null
  progress: number
  start: () => void
}

/**
 * Hook pour générer une playlist à partir d'un souhait et d'une taille.
 * @param wish Texte représentant l'intention ou le mood.
 * @param size Nombre de pistes souhaitées.
 * @param onComplete Callback exécuté quand la playlist est prête.
 */
export function useGeneratePlaylist(
  wish: string,
  size: number,
  onComplete: (tracks: Track[]) => void
): UseGeneratePlaylistReturn {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)

  const start = useCallback(async () => {
    if (!wish || !size) {
      setError("Paramètres invalides pour la génération de la playlist.")
      return
    }

    setLoading(true)
    setError(null)
    setProgress(0)

    try {
      const tracks = await generatePlaylist(wish, size)
      onComplete(tracks)
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue.")
    } finally {
      setLoading(false)
      setProgress(100)
    }
  }, [wish, size, onComplete])

  return { loading, error, progress, start }
}
