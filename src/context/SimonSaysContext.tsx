import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

const STORAGE_KEY_BASE = '@simon_says:bestScore';

interface SimonSaysContextType {
  bestScore: number;
  updateBestScore: (score: number) => void;
}

const SimonSaysContext = createContext<SimonSaysContextType | undefined>(undefined);

export const SimonSaysProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isGuest } = useAuth();
  const userId = user?.id || (isGuest ? 'guest' : 'guest');

  const [bestScore, setBestScore] = useState<number>(0);
  const bestScoreRef = useRef<number>(0);
  const loadedRef = useRef(false);

  useEffect(() => {
    const loadScore = async () => {
      try {
        const stored = await AsyncStorage.getItem(`${STORAGE_KEY_BASE}:${userId}`);
        if (stored != null) {
          const score = parseInt(stored, 10);
          setBestScore(score);
          bestScoreRef.current = score;
        }
      } catch {
        // Ignore storage errors
      }
      loadedRef.current = true;
    };
    loadScore();
  }, [userId]);

  const updateBestScore = useCallback(
    (score: number) => {
      if (!loadedRef.current) return;
      if (score > bestScoreRef.current) {
        bestScoreRef.current = score;
        setBestScore(score);
        AsyncStorage.setItem(
          `${STORAGE_KEY_BASE}:${userId}`,
          score.toString()
        ).catch(() => {});
      }
    },
    [userId]
  );

  return (
    <SimonSaysContext.Provider value={{ bestScore, updateBestScore }}>
      {children}
    </SimonSaysContext.Provider>
  );
};

export const useSimonSays = () => {
  const ctx = useContext(SimonSaysContext);
  if (!ctx) throw new Error('useSimonSays must be used within SimonSaysProvider');
  return ctx;
};
