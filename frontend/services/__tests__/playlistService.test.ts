import { Track } from '@/types/track';
import { fetchPlaylistTracks, fetchPlaylistTracksGenerate } from '../playlistService';

describe('Playlist Service', () => {
  const mockTracks: Track[] = [
    {
      id: '1',
      title: 'Song 1',
      artist: 'Artist 1',
      audio_url: 'https://audio1.mp3',
      duration: 180,
      license_url: 'https://license1.com',
      license_name: 'CC',
      tags: ['rock', 'pop'],
      image: 'https://image1.jpg',
    },
    {
      id: '2',
      title: 'Song 2',
      artist: 'Artist 2',
      audio_url: 'https://audio2.mp3',
      duration: 200,
      license_url: 'https://license2.com',
      license_name: 'CC',
      tags: ['electro'],
      image: 'https://image2.jpg',
    },
  ];

  beforeEach(() => {
    // Mock fetch global
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('fetchPlaylistTracks doit retourner les tracks correctement', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockTracks,
    });

    const result = await fetchPlaylistTracks('123', 'rock');

    expect(fetch).toHaveBeenCalledWith(
      '/api/proxyPlaylist',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackId: '123', tags: 'rock' }),
      }),
    );

    expect(result).toEqual(mockTracks);
  });

  it('fetchPlaylistTracksGenerate doit retourner les tracks correctement', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockTracks,
    });

    const result = await fetchPlaylistTracksGenerate(5, 'party');

    expect(fetch).toHaveBeenCalledWith(
      '/api/proxyPlaylistGenerate',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ limit: 5, prompt: 'party' }),
      }),
    );

    expect(result).toEqual(mockTracks);
  });

  it('fetchJson lance une erreur si response.ok est false', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: async () => 'Server error',
    });

    await expect(fetchPlaylistTracks('123', 'rock')).rejects.toThrow('API error 500: Server error');
  });
});
