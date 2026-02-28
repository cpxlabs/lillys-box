import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';
import { useGameBestScore } from '../hooks/useGameBestScore';

const STORAGE_KEY_BASE = '@jigsaw_pets:bestScore';

interface JigsawPetsContextType {
  bestScore: number;
  updateBestScore: (score: number) => void;
}

const JigsawPetsContext = createContext<JigsawPetsContextType | undefined>(undefined);

export const JigsawPetsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isGuest } = useAuth();
  const userId = user?.id ?? 'guest';
  const [bestScore, updateBestScore] = useGameBestScore(`${STORAGE_KEY_BASE}:${userId}`);

  return (
    <JigsawPetsContext.Provider value={{ bestScore, updateBestScore }}>
      {children}
    </JigsawPetsContext.Provider>
  );
};

export const useJigsawPets = () => {
  const ctx = useContext(JigsawPetsContext);
  if (!ctx) throw new Error('useJigsawPets must be used within JigsawPetsProvider');
  return ctx;
};
