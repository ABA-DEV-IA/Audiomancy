'use client';

import {
  createContext, useContext, useState, ReactNode,
} from 'react';

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
