import React, { createContext, useContext } from 'react';
import { useGameBestScore } from '../hooks/useGameBestScore';

interface MusicMakerContextType { bestScore: number; updateBestScore: (score: number) => void; }
const MusicMakerContext = createContext<MusicMakerContextType | undefined>(undefined);

export const MusicMakerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { bestScore, updateBestScore } = useGameBestScore('@music_maker:bestScore');
  return <MusicMakerContext.Provider value={{ bestScore, updateBestScore }}>{children}</MusicMakerContext.Provider>;
};

export const useMusicMaker = () => {
  const ctx = useContext(MusicMakerContext);
  if (!ctx) throw new Error('useMusicMaker must be used within MusicMakerProvider');
  return ctx;
};
