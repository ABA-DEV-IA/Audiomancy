"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Track } from "@/types/track";

interface Favorite {
  title: string | null;
  playlist: Track[] | null;
}

interface FavoriteContextType extends Favorite {
  setFavorite: (fav: Favorite) => void;
}

const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined);

export function FavoriteProvider({ children }: { children: ReactNode }) {
  const [favorite, setFavorite] = useState<Favorite>({
    title: null,
    playlist: null,
  });

  return (
    <FavoriteContext.Provider
      value={{
        title: favorite.title,
        playlist: favorite.playlist,
        setFavorite,
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );
}

export function usePlaylist() {
  const context = useContext(FavoriteContext);
  if (!context) {
    throw new Error("usePlaylist must be used inside PlaylistProvider");
  }
  return context;
}