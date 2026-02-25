import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

const STORAGE_KEY_BASE = '@color_mixer:progress';

export interface LevelProgress {
  completed: boolean;
  stars: number;
  unlocked: boolean;
}

interface ColorMixerProgressData {
  levels: Record<number, LevelProgress>;
}

interface ColorMixerContextType {
  getLevelProgress: (level: number) => LevelProgress;
  updateLevelProgress: (level: number, stars: number) => void;
  getTotalStars: () => number;
  getCompletedLevelsCount: () => number;
  resetProgress: () => void;
}

const ColorMixerContext = createContext<ColorMixerContextType | undefined>(undefined);

export const ColorMixerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isGuest } = useAuth();
  const userId = user?.id || 'guest';

  const [progress, setProgress] = useState<ColorMixerProgressData>({ levels: {} });
  const progressRef = useRef<ColorMixerProgressData>({ levels: {} });
  const loadedRef = useRef(false);

  // Initialize level 1 as unlocked
  const initializeProgress = useCallback((data: ColorMixerProgressData): ColorMixerProgressData => {
    if (!data.levels[1]) {
      data.levels[1] = { completed: false, stars: 0, unlocked: true };
    }
    return data;
  }, []);

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const stored = await AsyncStorage.getItem(`${STORAGE_KEY_BASE}:${userId}`);
        let loaded: ColorMixerProgressData = { levels: {} };
        if (stored != null) {
          loaded = JSON.parse(stored);
        }
        loaded = initializeProgress(loaded);
        setProgress(loaded);
        progressRef.current = loaded;
      } catch {
        // Ignore storage errors, use default initialized state
        const initialized = initializeProgress({ levels: {} });
        setProgress(initialized);
        progressRef.current = initialized;
      }
      loadedRef.current = true;
    };
    loadProgress();
  }, [userId, initializeProgress]);

  const saveProgress = useCallback(
    async (data: ColorMixerProgressData) => {
      try {
        await AsyncStorage.setItem(`${STORAGE_KEY_BASE}:${userId}`, JSON.stringify(data));
      } catch {
        // Ignore storage errors
      }
    },
    [userId]
  );

  const getLevelProgress = useCallback(
    (level: number): LevelProgress => {
      return (
        progressRef.current.levels[level] || {
          completed: false,
          stars: 0,
          unlocked: level === 1,
        }
      );
    },
    []
  );

  const updateLevelProgress = useCallback(
    (level: number, stars: number) => {
      if (!loadedRef.current) return;

      const currentProgress = getLevelProgress(level);
      const newStars = Math.max(currentProgress.stars, stars);
      const completed = newStars > 0;

      const updatedLevels = {
        ...progressRef.current.levels,
        [level]: {
          completed,
          stars: newStars,
          unlocked: true,
        },
      };

      // Unlock next level if this level is completed
      if (completed) {
        const nextLevel = level + 1;
        if (!updatedLevels[nextLevel]) {
          updatedLevels[nextLevel] = {
            completed: false,
            stars: 0,
            unlocked: true,
          };
        } else {
          updatedLevels[nextLevel] = {
            ...updatedLevels[nextLevel],
            unlocked: true,
          };
        }
      }

      const newProgress = { levels: updatedLevels };
      progressRef.current = newProgress;
      setProgress(newProgress);
      saveProgress(newProgress);
    },
    [getLevelProgress, saveProgress]
  );

  const getTotalStars = useCallback((): number => {
    return Object.values(progressRef.current.levels).reduce((sum, level) => sum + level.stars, 0);
  }, []);

  const getCompletedLevelsCount = useCallback((): number => {
    return Object.values(progressRef.current.levels).filter((level) => level.completed).length;
  }, []);

  const resetProgress = useCallback(() => {
    const initialized = initializeProgress({ levels: {} });
    progressRef.current = initialized;
    setProgress(initialized);
    saveProgress(initialized);
  }, [initializeProgress, saveProgress]);

  return (
    <ColorMixerContext.Provider
      value={{
        getLevelProgress,
        updateLevelProgress,
        getTotalStars,
        getCompletedLevelsCount,
        resetProgress,
      }}
    >
      {children}
    </ColorMixerContext.Provider>
  );
};

export const useColorMixer = () => {
  const ctx = useContext(ColorMixerContext);
  if (!ctx) throw new Error('useColorMixer must be used within ColorMixerProvider');
  return ctx;
};
