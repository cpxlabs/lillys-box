import React, { createContext, useContext } from 'react';
import { useGameBestScore } from '../hooks/useGameBestScore';

export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';
export type Mode = 'classic' | 'timeAttack';

type BestScores = Record<Difficulty, number>;

interface MemoryMatchContextType {
  bestScores: Record<Mode, BestScores>;
  updateBestScore: (difficulty: Difficulty, mode: Mode, score: number) => void;
}

const MemoryMatchContext = createContext<MemoryMatchContextType | undefined>(undefined);

export const MemoryMatchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { bestScore: easyClassic, updateBestScore: updateEasyClassic } = useGameBestScore('@memory_match:bestScore:easy');
  const { bestScore: mediumClassic, updateBestScore: updateMediumClassic } = useGameBestScore('@memory_match:bestScore:medium');
  const { bestScore: hardClassic, updateBestScore: updateHardClassic } = useGameBestScore('@memory_match:bestScore:hard');
  const { bestScore: expertClassic, updateBestScore: updateExpertClassic } = useGameBestScore('@memory_match:bestScore:expert');

  const { bestScore: easyTA, updateBestScore: updateEasyTA } = useGameBestScore('@memory_match:bestScore:timeAttack:easy');
  const { bestScore: mediumTA, updateBestScore: updateMediumTA } = useGameBestScore('@memory_match:bestScore:timeAttack:medium');
  const { bestScore: hardTA, updateBestScore: updateHardTA } = useGameBestScore('@memory_match:bestScore:timeAttack:hard');
  const { bestScore: expertTA, updateBestScore: updateExpertTA } = useGameBestScore('@memory_match:bestScore:timeAttack:expert');

  const updateBestScore = (difficulty: Difficulty, mode: Mode, score: number) => {
    const updaters: Record<Mode, Record<Difficulty, (s: number) => void>> = {
      classic: { easy: updateEasyClassic, medium: updateMediumClassic, hard: updateHardClassic, expert: updateExpertClassic },
      timeAttack: { easy: updateEasyTA, medium: updateMediumTA, hard: updateHardTA, expert: updateExpertTA },
    };
    if (!updaters[mode]?.[difficulty]) return;
    updaters[mode][difficulty](score);
  };

  const bestScores: Record<Mode, BestScores> = {
    classic: { easy: easyClassic, medium: mediumClassic, hard: hardClassic, expert: expertClassic },
    timeAttack: { easy: easyTA, medium: mediumTA, hard: hardTA, expert: expertTA },
  };

  return (
    <MemoryMatchContext.Provider value={{ bestScores, updateBestScore }}>
      {children}
    </MemoryMatchContext.Provider>
  );
};

export const useMemoryMatch = () => {
  const ctx = useContext(MemoryMatchContext);
  if (!ctx) throw new Error('useMemoryMatch must be used within MemoryMatchProvider');
  return ctx;
};
