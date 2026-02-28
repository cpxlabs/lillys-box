import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';
import { useGameBestScore } from '../hooks/useGameBestScore';

const STORAGE_KEY_BASE = '@whack_a_mole:bestScore';

interface WhackAMoleContextType {
  bestScore: number;
  updateBestScore: (score: number) => void;
}

const WhackAMoleContext = createContext<WhackAMoleContextType | undefined>(undefined);

export const WhackAMoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isGuest } = useAuth();
  const userId = user?.id ?? 'guest';
  const [bestScore, updateBestScore] = useGameBestScore(`${STORAGE_KEY_BASE}:${userId}`);

  return (
    <WhackAMoleContext.Provider value={{ bestScore, updateBestScore }}>
      {children}
    </WhackAMoleContext.Provider>
  );
};

export const useWhackAMole = () => {
  const ctx = useContext(WhackAMoleContext);
  if (!ctx) throw new Error('useWhackAMole must be used within WhackAMoleProvider');
  return ctx;
};
