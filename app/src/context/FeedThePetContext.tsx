import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

const STORAGE_KEY_BASE = '@feed_the_pet:bestScore';

interface FeedThePetContextType {
  bestScore: number;
  updateBestScore: (score: number) => void;
}

const FeedThePetContext = createContext<FeedThePetContextType | undefined>(undefined);

export const FeedThePetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
    [storageKey]
  );

  return (
    <FeedThePetContext.Provider value={{ bestScore, updateBestScore }}>
      {children}
    </FeedThePetContext.Provider>
  );
};

export const useFeedThePet = () => {
  const ctx = useContext(FeedThePetContext);
  if (!ctx) throw new Error('useFeedThePet must be used within FeedThePetProvider');
  return ctx;
};
