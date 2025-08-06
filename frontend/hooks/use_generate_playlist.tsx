import { useState, useEffect } from "react"

export function useGeneratePlaylist(wish: string, playlistSize: number, onComplete: (data: any) => void) {
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!loading) return

    let interval: NodeJS.Timeout

    // Simuler progression et appel API
    async function fetchData() {
      try {
        // Appel réel API avec fetch ou axios
        const response = await fetch("/api/generateplaylist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ wish, playlistSize }),
        })
        if (!response.ok) throw new Error("Erreur API")

        // Simuler progression pendant 3 secondes
        interval = setInterval(() => {
          setProgress((p) => {
            if (p >= 100) {
              clearInterval(interval)
              response.json().then(onComplete)
              setLoading(false)
              return 100
            }
            return p + 10
          })
        }, 300)
      } catch (err: any) {
        setError(err.message || "Erreur inconnue")
        setLoading(false)
      }
    }

    fetchData()

    return () => clearInterval(interval)
  }, [loading, wish, playlistSize, onComplete])

  const start = () => {
    setProgress(0)
    setLoading(true)
    setError(null)
  }

  return { progress, loading, error, start }
}
