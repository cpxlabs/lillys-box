import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

const STORAGE_KEY_BASE = '@pet_runner:bestScore';

interface PetRunnerContextType {
  bestScore: number;
  updateBestScore: (score: number) => void;
}

const PetRunnerContext = createContext<PetRunnerContextType | undefined>(undefined);

export const PetRunnerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
    <PetRunnerContext.Provider value={{ bestScore, updateBestScore }}>
      {children}
    </PetRunnerContext.Provider>
  );
};

export const usePetRunner = () => {
  const ctx = useContext(PetRunnerContext);
  if (!ctx) throw new Error('usePetRunner must be used within PetRunnerProvider');
  return ctx;
};
