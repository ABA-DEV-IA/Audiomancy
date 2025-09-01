import { Track } from "@/types/track";
import { Favorite } from "@/types/favorite"; // à créer


async function fetchJson<T>(url: string, body: Record<string, unknown> = {}): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: Object.keys(body).length ? JSON.stringify(body) : undefined,
  });

  // Lire le texte brut une seule fois
  const text = await response.text();

  // Si pas de contenu => éviter le crash
  if (!text) {
    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status}`);
    }
    // @ts-expect-error on retourne un objet vide si pas de JSON
    return {};
  }

  // Essayer de parser le JSON
  let data: any;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`Réponse invalide (non-JSON): ${text}`);
  }

  if (!response.ok) {
    const errorMessage = data?.message || `Erreur HTTP ${response.status}`;
    throw new Error(errorMessage);
  }

  return data as T;
}

interface FavoriteResponse {
  success: boolean;
  message: string;
  favorite: Favorite | null;
}


export async function createFavorite(user_id: string, name: string, track_list: Track[]): Promise<Favorite> {
  const data = await fetchJson<FavoriteResponse>("/api/favorite/create", {
    user_id,
    name,
    track_list
  });

  return data.favorite as Favorite;
}

export async function listFavorites(user_id: string): Promise<Favorite[]> {
  const response = await fetch(`/api/favorite/list?user_id=${user_id}`);
  
  if (!response.ok) {
    // Si erreur HTTP 404 → on retourne tableau vide au lieu de crasher
    if (response.status === 404) return [];
    throw new Error(`Erreur HTTP ${response.status}`);
  }

  const favorites: Favorite[] = await response.json();
  return favorites.filter((f): f is Favorite => f !== null);
}


export async function deleteFavorite(favorite_id: string, user_id: string): Promise<void> {
  const response = await fetch(`/api/favorite/delete/${favorite_id}?user_id=${user_id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Erreur HTTP ${response.status}`);
  }
}

export async function renameFavorite(favorite_id: string, user_id: string, new_name: string): Promise<Favorite> {
  const response = await fetchJson<FavoriteResponse>("/api/favorite/rename", { favorite_id, user_id, new_name });
  if (!response.favorite) throw new Error(response.message);
  return response.favorite;
}