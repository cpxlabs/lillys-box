import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

const STORAGE_KEY_BASE = '@catch_the_ball:bestScore';

interface CatchTheBallContextType {
  bestScore: number;
  updateBestScore: (score: number) => void;
}

const CatchTheBallContext = createContext<CatchTheBallContextType | undefined>(undefined);

export const CatchTheBallProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const userId = user?.id || 'guest';
  const storageKey = `${STORAGE_KEY_BASE}:${userId}`;

  const [bestScore, setBestScore] = useState(0);
  const bestScoreRef = useRef(0);
  const loadedRef = useRef(false);

  useEffect(() => {
    AsyncStorage.getItem(storageKey)
      .then((stored) => {
        if (stored != null) {
          const val = parseInt(stored, 10);
          setBestScore(val);
          bestScoreRef.current = val;
        }
        loadedRef.current = true;
      })
      .catch(() => {
        loadedRef.current = true;
      });
  }, [storageKey]);

  const updateBestScore = useCallback(
    (score: number) => {
      if (!loadedRef.current) return;
      if (score > bestScoreRef.current) {
        bestScoreRef.current = score;
        setBestScore(score);
        AsyncStorage.setItem(storageKey, score.toString()).catch(() => {});
      }
    },
    [storageKey],
  );

  return (
    <CatchTheBallContext.Provider value={{ bestScore, updateBestScore }}>
      {children}
    </CatchTheBallContext.Provider>
  );
};

export const useCatchTheBall = () => {
  const ctx = useContext(CatchTheBallContext);
  if (!ctx) throw new Error('useCatchTheBall must be used within CatchTheBallProvider');
  return ctx;
};
