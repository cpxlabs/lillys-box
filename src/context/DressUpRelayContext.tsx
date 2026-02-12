import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

const STORAGE_KEY_BASE = '@dress_up_relay:bestScore';

interface DressUpRelayContextType {
  bestScore: number;
  updateBestScore: (score: number) => void;
}

const DressUpRelayContext = createContext<DressUpRelayContextType | undefined>(undefined);

export const DressUpRelayProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isGuest } = useAuth();
  const userId = user?.id || 'guest';

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
        AsyncStorage.setItem(`${STORAGE_KEY_BASE}:${userId}`, score.toString()).catch(() => {});
      }
    },
    [userId]
  );

  return (
    <DressUpRelayContext.Provider value={{ bestScore, updateBestScore }}>
      {children}
    </DressUpRelayContext.Provider>
  );
};

export const useDressUpRelay = () => {
  const ctx = useContext(DressUpRelayContext);
  if (!ctx) throw new Error('useDressUpRelay must be used within DressUpRelayProvider');
  return ctx;
};
