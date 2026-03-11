import React, { createContext, useContext } from 'react';
import { useGameBestScore } from '../hooks/useGameBestScore';

interface KidsChessContextType {
  bestScore: number;
  updateBestScore: (score: number) => void;
}

const KidsChessContext = createContext<KidsChessContextType | null>(null);

export const KidsChessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { bestScore, updateBestScore } = useGameBestScore('@game_kids-chess_best_score');
  return (
    <KidsChessContext.Provider value={{ bestScore, updateBestScore }}>
      {children}
    </KidsChessContext.Provider>
  );
};

export const useKidsChess = () => {
  const ctx = useContext(KidsChessContext);
  if (!ctx) throw new Error('useKidsChess must be used within KidsChessProvider');
  return ctx;
};
