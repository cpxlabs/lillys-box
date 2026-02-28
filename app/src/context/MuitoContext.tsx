import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

const STORAGE_KEY_BASE = '@muito_game:bestScore';

interface MuitoContextType {
  score: number;
  bestScore: number;
  addScore: (points: number) => void;
  resetScore: () => void;
}

const MuitoContext = createContext<MuitoContextType | undefined>(undefined);

export const MuitoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isGuest } = useAuth();
  const userId = user?.id ?? 'guest';
  const storageKey = `${STORAGE_KEY_BASE}:${userId}`;

  const [score, setScore] = useState(0);
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

  useEffect(() => {
    if (loadedRef.current && score > bestScoreRef.current) {
      bestScoreRef.current = score;
      setBestScore(score);
      AsyncStorage.setItem(storageKey, score.toString()).catch((err) => {
        if (__DEV__) console.warn('[MuitoContext] Failed to save best score:', err);
      });
    }
  }, [score, storageKey]);

  const addScore = useCallback((points: number) => {
    setScore((prev) => prev + points);
  }, []);

  const resetScore = useCallback(() => setScore(0), []);

  return (
    <MuitoContext.Provider value={{ score, bestScore, addScore, resetScore }}>
      {children}
    </MuitoContext.Provider>
  );
};

export const useMuito = () => {
  const ctx = useContext(MuitoContext);
  if (!ctx) throw new Error('useMuito must be used within MuitoProvider');
  return ctx;
};
