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
    const data = await response.json();
    throw data;
  }

  return response.json() as Promise<T>;
}


async function fetchJsonPUT<T>(url: string, body: Record<string, unknown>): Promise<T> {
  const response = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const data = await response.json();
    throw data;
  }

  return response.json() as Promise<T>;
}

interface UserResponse {
  success: boolean;
  message: string;
  user: User;
}

export async function login(email: string, password: string): Promise<User> {
  const data = await fetchJson<UserResponse>("/api/user/proxyLogin", { email, password });
  return data.user; // 🔹 On retourne seulement l'objet User
}

export async function register(email: string, username: string, password: string): Promise<User> {
  const data = await fetchJson<UserResponse>("/api/user/proxyCreate", { email, username, password });
  return data.user; // 🔹 On retourne seulement l'objet User
}

export async function modify(id: string, username: string, password: string): Promise<User> {
  console.log(id, username, password );
  const data = await fetchJsonPUT<UserResponse>("/api/user/proxyModify", { id, username, password });
  return data.user; // 🔹 On retourne seulement l'objet User
}