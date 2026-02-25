import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

const STORAGE_KEY_BASE = '@memory_match:bestScore';

export type Difficulty = 'easy' | 'medium' | 'hard';

interface BestScores {
  easy: number;
  medium: number;
  hard: number;
}

interface MemoryMatchContextType {
  bestScores: BestScores;
  updateBestScore: (difficulty: Difficulty, score: number) => void;
}

const MemoryMatchContext = createContext<MemoryMatchContextType | undefined>(undefined);

export const MemoryMatchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isGuest } = useAuth();
  const userId = user?.id || (isGuest ? 'guest' : 'guest');

  const [bestScores, setBestScores] = useState<BestScores>({ easy: 0, medium: 0, hard: 0 });
  const bestScoresRef = useRef<BestScores>({ easy: 0, medium: 0, hard: 0 });
  const loadedRef = useRef(false);

  useEffect(() => {
    const loadScores = async () => {
      try {
        const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];
        const loaded: BestScores = { easy: 0, medium: 0, hard: 0 };
        for (const diff of difficulties) {
          const stored = await AsyncStorage.getItem(`${STORAGE_KEY_BASE}:${diff}:${userId}`);
          if (stored != null) {
            loaded[diff] = parseInt(stored, 10);
          }
        }
        setBestScores(loaded);
        bestScoresRef.current = loaded;
      } catch {
        // Ignore storage errors
      }
      loadedRef.current = true;
    };
    loadScores();
  }, [userId]);

  const updateBestScore = useCallback(
    (difficulty: Difficulty, score: number) => {
      if (!loadedRef.current) return;
      if (score > bestScoresRef.current[difficulty]) {
        bestScoresRef.current = { ...bestScoresRef.current, [difficulty]: score };
        setBestScores({ ...bestScoresRef.current });
        AsyncStorage.setItem(
          `${STORAGE_KEY_BASE}:${difficulty}:${userId}`,
          score.toString()
        ).catch(() => {});
      }
    },
    [userId]
  );

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
