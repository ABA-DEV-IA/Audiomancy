/**
 * Contexte d'authentification global.
 *
 * Fournit l'état utilisateur (connecté/déconnecté) et les fonctions
 * `login` / `logout` à tout l'arbre de composants via `useAuth()`.
 * @module auth_context
 */
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from '@/types/user';

/** Shape du contexte d'authentification exposé aux consommateurs. */
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

const AUTH_STORAGE_KEY = "audiomancy_user";
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Provider React qui encapsule l'état d'authentification.
 * Persiste l'état dans sessionStorage pour survivre aux navigations/refreshs.
 *
 * @param children - Composants enfants ayant accès au contexte.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Restaurer l'état depuis sessionStorage au montage
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, []);

  const login = (userData: User) => {
    // Strip any sensitive fields that shouldn't be on the client
    const { password_hash, ...safeUser } = userData as User & { password_hash?: string };
    setUser(safeUser as User);
    try {
      sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(safeUser));
    } catch { /* quota exceeded — ignore */ }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook personnalisé pour accéder au contexte d'authentification.
 *
 * @returns L'état utilisateur et les fonctions login/logout.
 * @throws {Error} Si utilisé en dehors d'un `AuthProvider`.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }
  return context;
}
