import React, { createContext, useContext } from 'react';
import { useGameBestScore } from '../hooks/useGameBestScore';

interface KidsLudoContextType {
  bestScore: number;
  updateBestScore: (score: number) => void;
}

const KidsLudoContext = createContext<KidsLudoContextType | null>(null);

export const KidsLudoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { bestScore, updateBestScore } = useGameBestScore('@game_kids-ludo_best_score');
  return (
    <KidsLudoContext.Provider value={{ bestScore, updateBestScore }}>
      {children}
    </KidsLudoContext.Provider>
  );
};

export const useKidsLudo = () => {
  const ctx = useContext(KidsLudoContext);
  if (!ctx) throw new Error('useKidsLudo must be used within KidsLudoProvider');
  return ctx;
};
