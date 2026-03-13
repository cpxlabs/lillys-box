import React, { createContext, useContext } from 'react';
import { useGameBestScore } from '../hooks/useGameBestScore';

interface TicTacToeContextType {
  bestScore: number;
  updateBestScore: (score: number) => void;
}

const TicTacToeContext = createContext<TicTacToeContextType | null>(null);

export const TicTacToeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { bestScore, updateBestScore } = useGameBestScore('@game_tic-tac-toe_best_score');
  return (
    <TicTacToeContext.Provider value={{ bestScore, updateBestScore }}>
      {children}
    </TicTacToeContext.Provider>
  );
};

export const useTicTacToe = () => {
  const ctx = useContext(TicTacToeContext);
  if (!ctx) throw new Error('useTicTacToe must be used within TicTacToeProvider');
  return ctx;
};
