import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import tracks from "@/config/playlist/playlist.json"

function formatDuration(seconds: number) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

export function LecturePage() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const currentTrack = tracks[currentTrackIndex]

  const handleEnded = () => {
    const nextIndex = (currentTrackIndex + 1) % tracks.length
    setCurrentTrackIndex(nextIndex)
    setHasStarted(true)
  }

  useEffect(() => {
    if (hasStarted && audioRef.current) {
      audioRef.current.play()
    }
  }, [currentTrackIndex, hasStarted])

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-[#6A0DAD] text-white p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">LECTURE</h1>
        </div>
      </div>

      {/* Content scrollable */}
      <div className="flex-1 bg-[#2B2B2B] p-6 overflow-y-auto">
        {/* Zone lecture */}
        <div className="bg-white rounded-lg p-6 mb-6 max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[#6A0DAD] font-medium">
              {currentTrack.title} - {currentTrack.artist}
            </span>
          </div>
          <div className="h-48 bg-gray-50 rounded flex flex-col items-center justify-center">
            <img
              src={currentTrack.image}
              alt={currentTrack.title}
              className="w-32 h-32 object-cover rounded mb-4"
            />
            <audio
              ref={audioRef}
              controls
              src={currentTrack.audio_url}
              onEnded={handleEnded}
              className="w-full"
            />
          </div>
        </div>

        {/* Playlist */}
        <div className="max-w-2xl mx-auto">
          <h3 className="text-white text-lg mb-4 text-center">PLAYLIST</h3>
          <div className="space-y-2">
            {tracks.map((track, index) => (
              <Card
                key={track.id}
                className={`
                  cursor-pointer transition-colors duration-200
                  ${currentTrackIndex === index
                    ? "bg-[#3A1F47] border-2 border-[#A45EE5]"
                    : "bg-[#301934] border border-transparent hover:bg-[#4B2E5A]"
                  }
                `}
                onClick={() => {
                  setCurrentTrackIndex(index)
                  setHasStarted(true)
                }}
              >
                <CardContent className="p-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={track.image}
                      alt={track.title}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex flex-col text-white">
                      <span>{track.title}</span>
                      <span className="text-xs text-gray-300">{track.artist}</span>
                    </div>
                  </div>
                  <span className="text-[#D9B3FF] text-sm">
                    {formatDuration(track.duration)}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="flex-12 bg-[#2B2B2B] p-10 overflow-y-auto pb-24"></div>
      </div>
    </div>
  )
}
