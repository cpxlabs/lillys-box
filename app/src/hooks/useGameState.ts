/**
 * Shared Game Hooks Library
 * Provides reusable hooks for common game patterns
 */

import { useCallback, useRef } from 'react';
import { useGameBestScore } from './useGameBestScore';
import { BaseGameState, UseGameStateReturn } from '../types/gameState';

/**
 * Creates a unique session ID
 */
export const createSessionId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Standard hook for managing basic game state
 *
 * @param storageKey - AsyncStorage key for persisting best score
 * @returns Game state management interface
 *
 * @example
 * ```tsx
 * const { state, startGame, setScore, updateBestScore } = useGameState('@game_my-game');
 * ```
 */
export const useGameState = (storageKey: string): UseGameStateReturn<BaseGameState> => {
  const { bestScore, updateBestScore } = useGameBestScore(storageKey);
  const sessionRef = useRef<BaseGameState>({
    sessionId: createSessionId(),
    isRunning: false,
    currentScore: 0,
    bestScore,
    startTime: 0,
    endTime: null,
    elapsedTime: 0,
  });

  const startGame = useCallback(() => {
    sessionRef.current = {
      ...sessionRef.current,
      sessionId: createSessionId(),
      isRunning: true,
      currentScore: 0,
      startTime: Date.now(),
      endTime: null,
      elapsedTime: 0,
    };
  }, []);

  const endGame = useCallback(() => {
    sessionRef.current.isRunning = false;
    sessionRef.current.endTime = Date.now();
    sessionRef.current.elapsedTime = sessionRef.current.endTime - sessionRef.current.startTime;
  }, []);

  const setScore = useCallback((score: number) => {
    sessionRef.current.currentScore = score;
  }, []);

  const handleUpdateBestScore = useCallback((score: number) => {
    updateBestScore(score);
    sessionRef.current.bestScore = score;
  }, [updateBestScore]);

  const reset = useCallback(() => {
    sessionRef.current = {
      sessionId: createSessionId(),
      isRunning: false,
      currentScore: 0,
      bestScore,
      startTime: 0,
      endTime: null,
      elapsedTime: 0,
    };
  }, [bestScore]);

  const pause = useCallback(() => {
    sessionRef.current.isRunning = false;
  }, []);

  const resume = useCallback(() => {
    sessionRef.current.isRunning = true;
  }, []);

  // eslint-disable-next-line react-hooks/refs -- game loop intentionally uses ref to avoid re-renders
  return {
    // eslint-disable-next-line react-hooks/refs -- game loop intentionally uses ref to avoid re-renders
    state: sessionRef.current,
    startGame,
    endGame,
    setScore,
    updateBestScore: handleUpdateBestScore,
    reset,
    pause,
    resume,
    // eslint-disable-next-line react-hooks/refs -- game loop intentionally uses ref to avoid re-renders
    isNewBest: sessionRef.current.currentScore > bestScore,
  };
};

/**
 * Hook for managing game difficulty/levels
 *
 * @example
 * ```tsx
 * const { level, nextLevel, goToLevel } = useGameProgress(3, 1);
 * ```
 */
export const useGameProgress = (maxLevels: number, startLevel: number = 1) => {
  const levelRef = useRef(startLevel);

  const nextLevel = useCallback(() => {
    if (levelRef.current < maxLevels) {
      levelRef.current += 1;
    }
  }, [maxLevels]);

  const previousLevel = useCallback(() => {
    if (levelRef.current > 1) {
      levelRef.current -= 1;
    }
  }, []);

  const goToLevel = useCallback((level: number) => {
    if (level >= 1 && level <= maxLevels) {
      levelRef.current = level;
    }
  }, [maxLevels]);

  // eslint-disable-next-line react-hooks/refs
  return {
    // eslint-disable-next-line react-hooks/refs
    level: levelRef.current,
    maxLevels,
    nextLevel,
    previousLevel,
    goToLevel,
    // eslint-disable-next-line react-hooks/refs
    isLastLevel: levelRef.current === maxLevels,
    // eslint-disable-next-line react-hooks/refs
    progressPercentage: (levelRef.current / maxLevels) * 100,
  };
};

/**
 * Hook for game timer functionality
 *
 * @param duration - Time limit in seconds (0 = no limit)
 * @param onTimeEnd - Callback when time runs out
 *
 * @example
 * ```tsx
 * const { timeLeft, start, pause, resume, reset } = useGameTimer(60, () => endGame());
 * ```
 */
export const useGameTimer = (duration: number, onTimeEnd?: () => void) => {
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(0);
  const timeLeftRef = useRef<number>(duration);

  const start = useCallback(() => {
    if (timerRef.current) return; // Already running
    startTimeRef.current = Date.now() - pausedTimeRef.current;

    timerRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      timeLeftRef.current = Math.max(0, duration - elapsed / 1000);

      if (timeLeftRef.current <= 0) {
        clearInterval(timerRef.current!);
        onTimeEnd?.();
      }
    }, 100);
  }, [duration, onTimeEnd]);

  const pause = useCallback(() => {
    if (!timerRef.current) return;
    clearInterval(timerRef.current);
    pausedTimeRef.current = Date.now() - startTimeRef.current;
    timerRef.current = null;
  }, []);

  const resume = useCallback(() => {
    start();
  }, [start]);

  const reset = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = null;
    startTimeRef.current = 0;
    pausedTimeRef.current = 0;
    timeLeftRef.current = duration;
  }, [duration]);

  return {
    // eslint-disable-next-line react-hooks/refs
    timeLeft: Math.ceil(timeLeftRef.current),
    // eslint-disable-next-line react-hooks/refs
    isRunning: timerRef.current !== null,
    start,
    pause,
    resume,
    reset,
    // eslint-disable-next-line react-hooks/refs
    percentageLeft: (timeLeftRef.current / duration) * 100,
  };
};

/**
 * Hook for managing game streaks/combos
 *
 * @example
 * ```tsx
 * const { streak, addToStreak, breakStreak, bestStreak } = useGameStreak('@game_my-game_streak');
 * ```
 */
export const useGameStreak = (_storageKey: string) => {
  const streakRef = useRef(0);
  const bestStreakRef = useRef(0);

  const addToStreak = useCallback(() => {
    streakRef.current += 1;
    if (streakRef.current > bestStreakRef.current) {
      bestStreakRef.current = streakRef.current;
    }
  }, []);

  const breakStreak = useCallback(() => {
    streakRef.current = 0;
  }, []);

  const resetBest = useCallback(() => {
    bestStreakRef.current = 0;
  }, []);

  // eslint-disable-next-line react-hooks/refs
  return {
    // eslint-disable-next-line react-hooks/refs
    currentStreak: streakRef.current,
    // eslint-disable-next-line react-hooks/refs
    bestStreak: bestStreakRef.current,
    addToStreak,
    breakStreak,
    resetBest,
  };
};

/**
 * Hook for game analytics/metrics tracking
 *
 * @example
 * ```tsx
 * const analytics = useGameAnalytics('my-game');
 * analytics.trackEvent('level_complete', { level: 5, time: 125 });
 * ```
 */
export const useGameAnalytics = (_gameId: string) => {
  const eventsRef = useRef<Array<{ event: string; data: Record<string, unknown>; timestamp: number }>>([]);

  const trackEvent = useCallback(
    (eventName: string, data?: Record<string, unknown>) => {
      eventsRef.current.push({
        event: eventName,
        data: data || {},
        timestamp: Date.now(),
      });
    },
    [],
  );

  const getEvents = useCallback(() => {
    return [...eventsRef.current];
  }, []);

  const clearEvents = useCallback(() => {
    eventsRef.current = [];
  }, []);

  // eslint-disable-next-line react-hooks/refs
  return {
    trackEvent,
    getEvents,
    clearEvents,
    // eslint-disable-next-line react-hooks/refs
    totalEvents: eventsRef.current.length,
  };
};
