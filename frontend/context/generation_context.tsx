/**
 * Contexte de génération de playlist par IA.
 *
 * Stocke le souhait utilisateur (`wish`) et la taille de playlist
 * demandée (`playlistSize`) pour les transmettre entre les étapes
 * du flux de génération (formulaire → chargement → lecture).
 * @module generation_context
 */
'use client';

import {
  createContext, useContext, useState, ReactNode,
} from 'react';

/** Shape du contexte de génération exposé aux consommateurs. */
type GenerationData = {
  wish: string,
  playlistSize: number,
  setGenerationData: (data: { wish: string; playlistSize: number }) => void
}

const GenerationContext = createContext<GenerationData | undefined>(undefined);

export function GenerationProvider({ children }: { children: ReactNode }) {
  const [wish, setWish] = useState('');
  const [playlistSize, setPlaylistSize] = useState(0);

  const setGenerationData = ({ wish, playlistSize }: { wish: string; playlistSize: number }) => {
    setWish(wish);
    setPlaylistSize(playlistSize);
  };

  return (
    <GenerationContext.Provider value={{ wish, playlistSize, setGenerationData }}>
      {children}
    </GenerationContext.Provider>
  );
}

export const useGeneration = () => {
  const context = useContext(GenerationContext);
  if (!context) {
    throw new Error('useGeneration must be used within a GenerationProvider');
  }
  return context;
};
