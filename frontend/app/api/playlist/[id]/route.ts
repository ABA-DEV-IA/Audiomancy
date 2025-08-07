import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const params = await context.params;
  if (!params || !params.id) {
    return NextResponse.json({ error: 'Missing playlist id' }, { status: 400 });
  }

  try {
    const playlistPath = path.resolve(process.cwd(), 'config', 'playlist', `${params.id}.json`);
    const jsonData = await fs.readFile(playlistPath, 'utf-8');
    const playlist = JSON.parse(jsonData);
    return NextResponse.json(playlist);
  } catch (error) {
    return NextResponse.json({ error: 'Playlist not found' }, { status: 404 });
  }
}
