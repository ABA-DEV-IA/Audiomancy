import { User } from "@/types/user";

/**
 * Helper pour effectuer une requête POST et retourner du JSON typé.
 */
async function fetchJson<T>(url: string, body: Record<string, unknown>): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let data: any;
    try { data = await response.json(); } catch { data = { detail: `HTTP ${response.status}` }; }
    throw new Error(data?.detail || data?.message || `Erreur HTTP ${response.status}`);
  }

  return response.json() as Promise<T>;
}


/**
 * Helper pour effectuer une requête PUT et retourner du JSON typé.
 */
async function fetchJsonPUT<T>(url: string, body: Record<string, unknown>): Promise<T> {
  const response = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let data: any;
    try { data = await response.json(); } catch { data = { detail: `HTTP ${response.status}` }; }
    throw new Error(data?.detail || data?.message || `Erreur HTTP ${response.status}`);
  }

  return response.json() as Promise<T>;
}

/**
 * Helper pour effectuer une requête DELETE et retourner du JSON typé.
 */
async function fetchJsonDELETE<T>(url: string, body: Record<string, unknown>): Promise<T> {
  const response = await fetch(url, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let data: any;
    try { data = await response.json(); } catch { data = { detail: `HTTP ${response.status}` }; }
    throw new Error(data?.detail || data?.message || `Erreur HTTP ${response.status}`);
  }

  return response.json() as Promise<T>;
}

interface UserResponse {
  success: boolean;
  message: string;
  user: User;
}

/**
 * Authentifie un utilisateur via email et mot de passe.
 *
 * @param email - Adresse email de l'utilisateur.
 * @param password - Mot de passe en clair (hashé côté backend).
 * @returns L'objet User si l'authentification réussit.
 * @throws Objet d'erreur JSON renvoyé par le backend.
 */
export async function login(email: string, password: string): Promise<User> {
  const data = await fetchJson<UserResponse>("/api/user/proxyLogin", { email, password });
  return data.user; // 🔹 On retourne seulement l'objet User
}

/**
 * Inscrit un nouvel utilisateur.
 *
 * @param email - Adresse email du nouvel utilisateur.
 * @param username - Nom d'utilisateur choisi.
 * @param password - Mot de passe en clair (hashé côté backend).
 * @returns L'objet User créé.
 * @throws Objet d'erreur JSON renvoyé par le backend.
 */
export async function register(email: string, username: string, password: string): Promise<User> {
  const data = await fetchJson<UserResponse>("/api/user/proxyCreate", { email, username, password });
  return data.user; // 🔹 On retourne seulement l'objet User
}

/**
 * Met à jour le profil d'un utilisateur existant.
 *
 * @param id - Identifiant MongoDB de l'utilisateur.
 * @param username - Nouveau nom d'utilisateur.
 * @param password - Nouveau mot de passe en clair.
 * @returns L'objet User mis à jour.
 * @throws Objet d'erreur JSON renvoyé par le backend.
 */
export async function modify(id: string, username: string, password: string): Promise<User> {
  const data = await fetchJsonPUT<UserResponse>("/api/user/proxyModify", { id, username, password });
  return data.user; // 🔹 On retourne seulement l'objet User
}

/**
 * Supprime définitivement le compte utilisateur (RGPD Article 17).
 *
 * @param email - Adresse email du compte à supprimer.
 * @throws Objet d'erreur JSON renvoyé par le backend.
 */
export async function deleteAccount(email: string): Promise<void> {
  await fetchJsonDELETE<{ status: string; message: string }>("/api/user/proxyDelete", {
    email,
    confirmation: "DELETE",
  });
}