import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

const STORAGE_KEY = '@game_color-tap_best_score';

interface ColorTapContextType {
  bestScore: number;
  updateBestScore: (score: number) => void;
}

const ColorTapContext = createContext<ColorTapContextType | null>(null);

export const ColorTapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isGuest } = useAuth();
  const userId = user?.id || (isGuest ? 'guest' : 'guest');
  const [bestScore, setBestScore] = useState(0);

  useEffect(() => {
    const loadScore = async () => {
      try {
        const stored = await AsyncStorage.getItem(`${STORAGE_KEY}:${userId}`);
        if (stored !== null) {
          setBestScore(Number(stored));
        }
      } catch {
        // Ignore storage errors
      }
    };
    loadScore();
  }, [userId]);

  const updateBestScore = (score: number) => {
    if (score > bestScore) {
      setBestScore(score);
      AsyncStorage.setItem(`${STORAGE_KEY}:${userId}`, String(score)).catch(() => {});
    }
  };

  return (
    <ColorTapContext.Provider value={{ bestScore, updateBestScore }}>
      {children}
    </ColorTapContext.Provider>
  );
};

export const useColorTap = () => {
  const ctx = useContext(ColorTapContext);
  if (!ctx) {
    throw new Error('useColorTap must be used within ColorTapProvider');
  }
  return ctx;
};
