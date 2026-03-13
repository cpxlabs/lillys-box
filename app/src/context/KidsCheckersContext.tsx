import React, { createContext, useContext } from 'react';
import { useGameBestScore } from '../hooks/useGameBestScore';

interface KidsCheckersContextType {
  bestScore: number;
  updateBestScore: (score: number) => void;
}

const KidsCheckersContext = createContext<KidsCheckersContextType | null>(null);

export const KidsCheckersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { bestScore, updateBestScore } = useGameBestScore('@game_kids-checkers_best_score');
  return (
    <KidsCheckersContext.Provider value={{ bestScore, updateBestScore }}>
      {children}
    </KidsCheckersContext.Provider>
  );
};

export const useKidsCheckers = () => {
  const ctx = useContext(KidsCheckersContext);
  if (!ctx) throw new Error('useKidsCheckers must be used within KidsCheckersProvider');
  return ctx;
};
