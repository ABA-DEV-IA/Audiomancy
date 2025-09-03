// app/api/generatePlaylist/route.ts

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { wish, size } = await request.json();

  // Simule des données de playlist basées sur le wish et la taille
  const fakePlaylist = Array.from({ length: size }).map((_, index) => ({
    id: `${wish.toLowerCase().replace(/\s+/g, '_')}_${index}`,
    title: `Titre ${index + 1}`,
    artist: `Artiste ${index + 1}`,
    duration: 281,
    image: '/images/default-track.png',
    audio_url: 'https://prod-1.storage.jamendo.com/?trackid=1542412&format=mp31&from=Mbl0SOSUojIaIqNph5eVbA%3D%3D%7CuEQhI5iAplxcVo%2B9l5iA1w%3D%3D',
    tags: [
      'peaceful',
      'magic',
    ],
    license_name: 'CC BY-NC-SA 3.0',
    license_url: 'https://creativecommons.org/licenses/by-nc-sa/3.0/',
  }));

  return NextResponse.json(fakePlaylist);
}
