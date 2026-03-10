import { useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';
import { logger } from '../utils/logger';

/**
 * Hook that manages per-user best score persistence for a mini-game.
 *
 * Usage:
 *   const { bestScore, updateBestScore } = useGameBestScore('@my_game:bestScore');
 *
 * @param storageKeyBase - The base AsyncStorage key (e.g. '@balloon_float:bestScore').
 *   The current user id is appended automatically so scores are isolated per user.
 */
export function useGameBestScore(storageKeyBase: string): {
  bestScore: number;
  updateBestScore: (score: number) => void;
} {
  const { user, isGuest } = useAuth();
  const storageKey = `${storageKeyBase}:${user?.id ?? (isGuest ? 'guest' : 'guest')}`;

  const [bestScore, setBestScore] = useState(0);
  const bestScoreRef = useRef(0);
  const loadedRef = useRef(false);

  useEffect(() => {
    loadedRef.current = false;
    bestScoreRef.current = 0;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBestScore(0);

    AsyncStorage.getItem(storageKey)
      .then((stored) => {
        if (stored != null) {
          const val = parseInt(stored, 10);
          if (!isNaN(val)) {
            setBestScore(val);
            bestScoreRef.current = val;
          }
        }
        loadedRef.current = true;
      })
      .catch((e) => {
        logger.warn('useGameBestScore: failed to load best score', e);
        loadedRef.current = true;
      });
  }, [storageKey]);

  const updateBestScore = useCallback(
    (score: number) => {
      if (!loadedRef.current) return;
      if (score > bestScoreRef.current) {
        bestScoreRef.current = score;
        setBestScore(score);
        AsyncStorage.setItem(storageKey, score.toString()).catch((e) => {
          logger.warn('useGameBestScore: failed to save best score', e);
        });
      }
    },
    [storageKey],
  );

  return { bestScore, updateBestScore };
}
