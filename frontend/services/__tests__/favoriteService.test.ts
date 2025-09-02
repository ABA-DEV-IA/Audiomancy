import { createFavorite, listFavorites, deleteFavorite, renameFavorite } from "@/services/favoriteService"; // chemin à adapter
import { Track } from "@/types/track";

interface Favorite {
  id: string;
  name: string;
  user_id: string;
  track_list: Track[];
}

const mockTrack: Track = {
  id: "1",
  title: "Track 1",
  artist: "Artist 1",
  audio_url: "https://example.com/audio1.mp3",
  duration: 180,
  license_url: "https://license.com/1",
  license_name: "CC-BY",
  tags: ["rock", "pop"],
  image: "https://example.com/image1.jpg",
};

const mockFavorite: Favorite = {
  id: "fav-1",
  name: "My Favorite",
  user_id: "user-1",
  track_list: [mockTrack],
};

describe("Favorite API helpers", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  // === createFavorite ===
  it("createFavorite retourne un Favorite", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      text: async () => JSON.stringify({ success: true, message: "ok", favorite: mockFavorite }),
    });

    const favorite = await createFavorite("user-1", "My Favorite", [mockTrack]);
    expect(favorite).toEqual(mockFavorite);
    expect(fetch).toHaveBeenCalledWith("/api/favorite/create", expect.any(Object));
  });

  it("createFavorite lève une erreur si !ok", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      text: async () => JSON.stringify({ message: "Erreur création" }),
    });

    await expect(createFavorite("user-1", "My Favorite", [mockTrack]))
      .rejects.toThrow("Erreur création");
  });

  // === listFavorites ===
  it("listFavorites retourne un tableau de Favorite", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => [mockFavorite],
    });

    const favorites = await listFavorites("user-1");
    expect(favorites).toEqual([mockFavorite]);
  });

  it("listFavorites retourne un tableau vide si 404", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 404,
      text: async () => "Not Found",
    });

    const favorites = await listFavorites("user-unknown");
    expect(favorites).toEqual([]);
  });

  it("listFavorites lève une erreur pour autre code HTTP", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => "Internal Server Error",
    });

    await expect(listFavorites("user-1")).rejects.toThrow("Erreur HTTP 500");
  });

  // === deleteFavorite ===
  it("deleteFavorite fonctionne si ok", async () => {
    (fetch as jest.Mock).mockResolvedValue({ ok: true, text: async () => "" });

    await expect(deleteFavorite("fav-1", "user-1")).resolves.toBeUndefined();
  });

  it("deleteFavorite lève une erreur si !ok", async () => {
    (fetch as jest.Mock).mockResolvedValue({ ok: false, text: async () => "Erreur delete" });

    await expect(deleteFavorite("fav-1", "user-1")).rejects.toThrow("Erreur delete");
  });

  // === renameFavorite ===
  it("renameFavorite retourne les données si succès", async () => {
    const mockResponse = { success: true, favorite: { ...mockFavorite, name: "New Name" } };
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await renameFavorite("fav-1", "user-1", "New Name");
    expect(result).toEqual(mockResponse);
  });

  it("renameFavorite lève une erreur si !ok", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Impossible de renommer" }),
    });

    await expect(renameFavorite("fav-1", "user-1", "New Name"))
      .rejects.toThrow("Impossible de renommer");
  });
});
