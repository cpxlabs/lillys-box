import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';
import { useGameBestScore } from '../hooks/useGameBestScore';

const STORAGE_KEY_BASE = '@music_maker:bestScore';

interface MusicMakerContextType {
  bestScore: number;
  updateBestScore: (score: number) => void;
}

const MusicMakerContext = createContext<MusicMakerContextType | undefined>(undefined);

export const MusicMakerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isGuest } = useAuth();
  const userId = user?.id ?? 'guest';
  const [bestScore, updateBestScore] = useGameBestScore(`${STORAGE_KEY_BASE}:${userId}`);

  return (
    <MusicMakerContext.Provider value={{ bestScore, updateBestScore }}>
      {children}
    </MusicMakerContext.Provider>
  );
};

export const useMusicMaker = () => {
  const ctx = useContext(MusicMakerContext);
  if (!ctx) throw new Error('useMusicMaker must be used within MusicMakerProvider');
  return ctx;
};
