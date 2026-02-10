/**
 * Service de gestion des favoris utilisateur.
 *
 * Fournit les opérations CRUD (create, read, delete, rename) sur les
 * playlists sauvegardées via les routes proxy Next.js → FastAPI.
 * @module favoriteService
 */
import { Track } from "@/types/track";
import { Favorite } from "@/types/favorite";


/**
 * Effectue une requête POST générique et parse la réponse JSON.
 *
 * @template T - Le type attendu de la réponse JSON.
 * @param url - URL de l'endpoint à appeler.
 * @param body - Corps de la requête (optionnel).
 * @returns La réponse parsée en tant que T.
 * @throws {Error} Si la réponse HTTP est en erreur ou si le JSON est invalide.
 */
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


/**
 * Crée un nouveau favori (playlist sauvegardée).
 *
 * @param user_id - Identifiant de l'utilisateur.
 * @param name - Nom du favori.
 * @param track_list - Liste des pistes à inclure.
 * @returns Le favori créé.
 */
export async function createFavorite(user_id: string, name: string, track_list: Track[]): Promise<Favorite> {
  const data = await fetchJson<FavoriteResponse>("/api/favorite/create", {
    user_id,
    name,
    track_list
  });

  return data.favorite as Favorite;
}

/**
 * Récupère la liste de tous les favoris d'un utilisateur.
 *
 * @param user_id - Identifiant de l'utilisateur.
 * @returns Tableau des favoris (vide si aucun ou si 404).
 */
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


/**
 * Supprime un favori par son identifiant.
 *
 * @param favorite_id - Identifiant du favori à supprimer.
 * @param user_id - Identifiant du propriétaire.
 * @throws {Error} Si la suppression échoue côté serveur.
 */
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

/**
 * Renomme un favori existant.
 *
 * @param favoriteId - Identifiant du favori à renommer.
 * @param userId - Identifiant du propriétaire.
 * @param newName - Nouveau nom du favori.
 * @returns Les données de réponse du serveur.
 * @throws {Error} Si le renommage échoue côté serveur.
 */
export async function renameFavorite(favoriteId: string, userId: string, newName: string) {
  const res = await fetch("/api/favorite/rename", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: userId,
      favorite_id: favoriteId,
      new_name: newName,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Erreur lors du renommage");
  }
  return data;
}