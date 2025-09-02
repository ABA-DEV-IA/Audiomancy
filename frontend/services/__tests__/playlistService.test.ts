import { fetchPlaylistTracks, fetchPlaylistTracksGenerate } from "@/services/playlistService";
import { Track } from "@/types/track";

describe("Playlist API helpers", () => {
  const mockTracks: Track[] = [
    {
      id: "1",
      title: "Track 1",
      artist: "Artist 1",
      audio_url: "https://example.com/audio1.mp3",
      duration: 180,
      license_url: "https://license.com/1",
      license_name: "CC-BY",
      tags: ["rock", "pop"],
      image: "https://example.com/image1.jpg",
    },
    {
      id: "2",
      title: "Track 2",
      artist: "Artist 2",
      audio_url: "https://example.com/audio2.mp3",
      duration: 200,
      license_url: "https://license.com/2",
      license_name: "CC0",
      tags: ["electro"],
      image: "https://example.com/image2.jpg",
    },
  ];

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("fetchPlaylistTracks retourne une liste de Track", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockTracks,
    });

    const tracks = await fetchPlaylistTracks("track-123", "rock,pop");
    expect(tracks).toEqual(mockTracks);
    expect(fetch).toHaveBeenCalledWith("/api/proxyPlaylist", expect.objectContaining({
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trackId: "track-123", tags: "rock,pop" }),
    }));
  });

  it("fetchPlaylistTracksGenerate retourne une liste de Track", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockTracks,
    });

    const tracks = await fetchPlaylistTracksGenerate(5, "chill vibes");
    expect(tracks).toEqual(mockTracks);
    expect(fetch).toHaveBeenCalledWith("/api/proxyPlaylistGenerate", expect.objectContaining({
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ limit: 5, prompt: "chill vibes" }),
    }));
  });

  it("fetchPlaylistTracks lève une erreur si !ok", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => "Internal Server Error",
    });

    await expect(fetchPlaylistTracks("track-123", "rock")).rejects.toThrow(
      "API error 500: Internal Server Error"
    );
  });

  it("fetchPlaylistTracksGenerate lève une erreur si !ok", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 400,
      text: async () => "Bad Request",
    });

    await expect(fetchPlaylistTracksGenerate(5, "prompt")).rejects.toThrow(
      "API error 400: Bad Request"
    );
  });
});