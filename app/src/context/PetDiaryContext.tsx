import React, { createContext, useContext } from 'react';
import { useGameBestScore } from '../hooks/useGameBestScore';

interface PetDiaryContextType {
  bestScore: number;
  updateBestScore: (score: number) => void;
}

const PetDiaryContext = createContext<PetDiaryContextType | null>(null);

export const PetDiaryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { bestScore, updateBestScore } = useGameBestScore('@game_pet-diary_best_score');
  return (
    <PetDiaryContext.Provider value={{ bestScore, updateBestScore }}>
      {children}
    </PetDiaryContext.Provider>
  );
};

export const usePetDiary = () => {
  const ctx = useContext(PetDiaryContext);
  if (!ctx) throw new Error('usePetDiary must be used within PetDiaryProvider');
  return ctx;
};
