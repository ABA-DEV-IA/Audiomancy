// app/api/generatePlaylist/route.ts

import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { wish, playlistSize } = await request.json()

  // Simule des données de playlist basées sur le wish et la taille
  const fakePlaylist = Array.from({ length: playlistSize }).map((_, index) => ({
    id: `${wish.toLowerCase().replace(/\s+/g, "_")}_${index}`,
    title: `Titre ${index + 1}`,
    artist: `Artiste ${index + 1}`,
    duration: 180 + index * 10,
    image: "/images/default-track.png",
    audio_url: "/audios/default.mp3",
    tags: [wish.toLowerCase()],
    license: "https://creativecommons.org/licenses/by/4.0/"
  }))

  return NextResponse.json(fakePlaylist)
}
