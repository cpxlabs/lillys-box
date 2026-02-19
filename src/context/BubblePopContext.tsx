import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

const STORAGE_KEY_BASE = '@bubble_pop:bestScore';

interface BubblePopContextType {
  bestScore: number;
  updateBestScore: (score: number) => void;
}

const BubblePopContext = createContext<BubblePopContextType | undefined>(undefined);

export const BubblePopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isGuest } = useAuth();
  const userId = user?.id || (isGuest ? 'guest' : 'guest');
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
      .catch(() => { loadedRef.current = true; });
  }, [storageKey]);

  const updateBestScore = useCallback((score: number) => {
    if (!loadedRef.current) return;
    if (score > bestScoreRef.current) {
      bestScoreRef.current = score;
      setBestScore(score);
      AsyncStorage.setItem(storageKey, score.toString()).catch(() => {});
    }
  }, [storageKey]);

  return (
    <BubblePopContext.Provider value={{ bestScore, updateBestScore }}>
      {children}
    </BubblePopContext.Provider>
  );
};

export const useBubblePop = () => {
  const ctx = useContext(BubblePopContext);
  if (!ctx) throw new Error('useBubblePop must be used within BubblePopProvider');
  return ctx;
};
