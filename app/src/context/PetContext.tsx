import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
  useMemo,
} from 'react';
import { Pet, PetType, PetColor, Gender, ClothingSlot } from '../types';
import { savePet, loadPet, deletePet } from '../utils/storage';
import {
  calculateHealth,
  getEnergyDecayRate,
  getEnergyMultiplier,
  canPerformActivity,
  calculateHappinessChange,
} from '../utils/petStats';
import { GAME_BALANCE } from '../config/gameBalance';
import { logger } from '../utils/logger';
import { debounce } from '../utils/debounce';
import { useAuth } from './AuthContext';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

type PetContextType = {
  pet: Pet | null;
  isLoading: boolean;
  createPet: (name: string, type: PetType, gender: Gender, color: PetColor) => Promise<void>;
  feed: (amount?: number, cost?: number) => void;
  play: () => void;
  bathe: (amount?: number) => void;
  sleep: (duration?: number) => Promise<{ completed: boolean }>;
  cancelSleep: () => void;
  visitVet: (treatmentType?: 'antibiotic' | 'antiInflammatory', useMoney?: boolean) => boolean;
  exercise: () => void;
  petCuddle: () => void;
  setClothing: (slot: ClothingSlot, itemId: string | null) => void;
  removePet: () => Promise<void>;
  earnMoney: (amount: number) => void;
};

const PetContext = createContext<PetContextType | undefined>(undefined);

export const PetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pet, setPet] = useState<Pet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const sleepCancelRef = useRef<{ cancelled: boolean } | null>(null);
  const { user, isGuest } = useAuth();

  // Get userId for storage operations
  const userId = user?.id || (isGuest ? 'guest' : undefined);

  // Create debounced save function (save max once per second)
  // Fix: useMemo instead of useRef to avoid accessing .current during render
  // and ensure the debounced function is stable across renders but created once.
  // Actually, useRef is fine if we init it differently, but useMemo is cleaner for this.
  // However, debounce returns a function.
  // The lint error was "Cannot access ref value during render" because we were doing `useRef(...).current`
  // inside the render body to ASSIGN `debouncedSave`.
  // Standard pattern for stable callback is useCallback or useRef initialized in useEffect or lazy init.
  // Here we want a stable debounced function instance.

  const debouncedSave = useMemo(
    () => debounce((petToSave: Pet) => {
      savePet(petToSave, userId).catch(logger.error);
    }, 1000),
    [userId]

  );

  // Load pet when user changes — mounted guard prevents stale state on fast unmount
  useEffect(() => {
    let mounted = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    loadPet(userId).then((loadedPet) => {
      if (!mounted) return;
      setPet(loadedPet);
      setIsLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, [userId]);

  // Enhanced decay system with energy, happiness, and health
  useEffect(() => {
    const interval = setInterval(() => {
      setPet((currentPet) => {
        if (!currentPet) return currentPet;

        // Skip decay if pet is sleeping
        if (currentPet.isSleeping) return currentPet;

        const now = Date.now();
        const lastUpdate = currentPet.lastUpdated || now;
        const minutesPassed = (now - lastUpdate) / 60000;

        // Calculate decay based on time passed
        const hungerDecay = GAME_BALANCE.decay.hunger * minutesPassed;
        const hygieneDecay = GAME_BALANCE.decay.hygiene * minutesPassed;
        const energyDecay = getEnergyDecayRate() * minutesPassed;

        // Apply decay to stats
        const tempPet = {
          ...currentPet,
          hunger: Math.max(0, currentPet.hunger - hungerDecay),
          hygiene: Math.max(0, currentPet.hygiene - hygieneDecay),
          energy: Math.max(0, currentPet.energy - energyDecay),
        };

        // Calculate health first (needed for happiness decay)
        const health = calculateHealth(tempPet);

        // Calculate happiness change
        const happinessChange = calculateHappinessChange({ ...tempPet, health }, minutesPassed);

        const updatedPet: Pet = {
          ...tempPet,
          happiness: Math.min(100, Math.max(0, currentPet.happiness + happinessChange)),
          health,
          lastUpdated: now,
        };

        // Use debounced save instead of direct save
        debouncedSave(updatedPet);
        return updatedPet;
      });
    }, GAME_BALANCE.time.updateInterval);

    return () => {
      clearInterval(interval);
      debouncedSave.cancel(); // flush any pending write before unmount
    };
  }, [debouncedSave]);

  const createPet = async (name: string, type: PetType, gender: Gender, color: PetColor) => {
    const newPet: Pet = {
      id: uuidv4(),
      name,
      type,
      color,
      gender,
      hunger: GAME_BALANCE.initialStats.hunger,
      hygiene: GAME_BALANCE.initialStats.hygiene,
      energy: GAME_BALANCE.initialStats.energy,
      happiness: GAME_BALANCE.initialStats.happiness,
      health: GAME_BALANCE.initialStats.health,
      money: GAME_BALANCE.initialStats.money,
      clothes: {
        head: null,
        eyes: null,
        torso: null,
        paws: null,
      },
      createdAt: Date.now(),
      lastUpdated: Date.now(),
      isSleeping: false,
    };
    setPet(newPet);
    await savePet(newPet, userId);
  };

  const feed = (amount?: number, cost?: number) => {
    setPet((currentPet) => {
      if (!currentPet || !canPerformActivity(currentPet, 'feed')) return currentPet;

      const multiplier = getEnergyMultiplier(currentPet.energy);
      const effects = GAME_BALANCE.activities.feed;

      const updatedPet: Pet = {
        ...currentPet,
        hunger: Math.min(100, currentPet.hunger + (amount || effects.hunger) * multiplier),
        energy: Math.min(100, currentPet.energy + effects.energy),
        happiness: Math.min(100, currentPet.happiness + effects.happiness * multiplier),
        hygiene: Math.max(0, currentPet.hygiene + effects.hygiene),
        money: Math.max(0, currentPet.money - (cost || 0)), // Deduct food cost
      };

      updatedPet.health = calculateHealth(updatedPet);
      savePet(updatedPet, userId).catch(logger.error);
      return updatedPet;
    });
  };

  const play = () => {
    setPet((currentPet) => {
      if (!currentPet || !canPerformActivity(currentPet, 'play')) return currentPet;

      const multiplier = getEnergyMultiplier(currentPet.energy);
      const effects = GAME_BALANCE.activities.play;

      const updatedPet: Pet = {
        ...currentPet,
        hunger: Math.max(0, currentPet.hunger + effects.hunger),
        hygiene: Math.max(0, currentPet.hygiene + effects.hygiene),
        energy: Math.max(0, currentPet.energy + effects.energy),
        happiness: Math.min(100, currentPet.happiness + effects.happiness * multiplier),
        money: currentPet.money + effects.money,
      };

      updatedPet.health = calculateHealth(updatedPet);
      savePet(updatedPet, userId).catch(logger.error);
      return updatedPet;
    });
  };

  const bathe = (amount?: number) => {
    setPet((currentPet) => {
      if (!currentPet || !canPerformActivity(currentPet, 'bathe')) return currentPet;

      const multiplier = getEnergyMultiplier(currentPet.energy);
      const effects = GAME_BALANCE.activities.bathe;

      const updatedPet: Pet = {
        ...currentPet,
        hygiene: Math.min(100, currentPet.hygiene + (amount || effects.hygiene)),
        hunger: Math.max(0, currentPet.hunger + effects.hunger),
        energy: Math.max(0, currentPet.energy + effects.energy),
        happiness: Math.min(100, currentPet.happiness + effects.happiness * multiplier),
      };

      updatedPet.health = calculateHealth(updatedPet);
      savePet(updatedPet, userId).catch(logger.error);
      return updatedPet;
    });
  };

  const sleep = async (
    duration: number = GAME_BALANCE.activities.sleep.duration
  ): Promise<{ completed: boolean }> => {
    // Check if pet can sleep before starting
    if (!pet || !canPerformActivity(pet, 'sleep')) {
      return { completed: false };
    }

    // Create cancellation token (typed — no more `as any`)
    const cancelToken: { cancelled: boolean; timer?: ReturnType<typeof setTimeout> } = {
      cancelled: false,
    };
    sleepCancelRef.current = cancelToken;

    const startTime = Date.now();

    setPet((currentPet) => {
      if (!currentPet) return currentPet;

      const updatedPet: Pet = {
        ...currentPet,
        isSleeping: true,
        sleepStartTime: startTime,
      };
      savePet(updatedPet, userId).catch(logger.error);
      return updatedPet;
    });

    // Wait for sleep duration with cancellation support using Promise.race
    let checkerTimeout: ReturnType<typeof setTimeout> | null = null;
    const completed = await Promise.race([
      // Sleep timer
      new Promise<boolean>((resolve) => {
        const timer = setTimeout(() => resolve(true), duration);
        cancelToken.timer = timer;
      }),
      // Cancellation checker
      new Promise<boolean>((resolve) => {
        const checkCancellation = () => {
          if (cancelToken.cancelled) {
            if (cancelToken.timer) {
              clearTimeout(cancelToken.timer);
            }
            resolve(false);
          } else {
            // Check again in 100ms
            checkerTimeout = setTimeout(checkCancellation, 100);
          }
        };
        checkCancellation();
      }),
    ]);

    // Clean up checker timeout to prevent memory leak
    if (checkerTimeout) {
      clearTimeout(checkerTimeout);
    }

    // Calculate partial recovery if cancelled early
    const actualDuration = Math.min(Date.now() - startTime, duration);
    const completionRatio = actualDuration / duration;

    // Wake up and apply benefits (partial or full)
    setPet((currentPet) => {
      if (!currentPet) return currentPet;

      const effects = GAME_BALANCE.activities.sleep;
      const updatedPet: Pet = {
        ...currentPet,
        energy: Math.min(100, currentPet.energy + effects.energy * completionRatio),
        happiness: Math.min(100, currentPet.happiness + effects.happiness * completionRatio),
        hunger: Math.max(0, currentPet.hunger + effects.hunger * completionRatio),
        isSleeping: false,
        sleepStartTime: undefined,
      };

      updatedPet.health = calculateHealth(updatedPet);
      savePet(updatedPet, userId).catch(logger.error);
      return updatedPet;
    });

    // Clear the cancel ref
    sleepCancelRef.current = null;

    return { completed };
  };

  const cancelSleep = () => {
    if (sleepCancelRef.current) {
      sleepCancelRef.current.cancelled = true;
    }
  };

  const visitVet = (
    treatmentType: 'antibiotic' | 'antiInflammatory' = 'antibiotic',
    useMoney: boolean = true
  ): boolean => {
    if (!pet) {
      logger.error('visitVet: No pet exists');
      return false;
    }

    const effects = GAME_BALANCE.activities.vet[treatmentType];

    // Check if can afford
    if (useMoney && pet.money < effects.cost) {
      logger.error(`visitVet: Insufficient funds - has ${pet.money}, needs ${effects.cost}`);
      return false;
    }

    logger.info(
      `visitVet: Starting vet visit (treatment: ${treatmentType}, useMoney: ${useMoney})`
    );

    setPet((currentPet) => {
      if (!currentPet) return currentPet;

      // Improve underlying stats slightly to support health increase
      const statsImprovement = 15;

      const updatedPet: Pet = {
        ...currentPet,
        hunger: Math.min(100, currentPet.hunger + statsImprovement),
        hygiene: Math.min(100, currentPet.hygiene + statsImprovement),
        energy: Math.min(100, currentPet.energy + statsImprovement),
        happiness: Math.min(100, currentPet.happiness + statsImprovement),
        money: useMoney ? currentPet.money - effects.cost : currentPet.money,
      };

      // Set health to minimum target (guarantee minimum health, but keep higher health if already above)
      const calculatedHealth = calculateHealth(updatedPet);
      updatedPet.health = Math.max(effects.healthTarget, calculatedHealth);

      logger.info(
        `visitVet: Health updated - calculated: ${calculatedHealth}, target: ${effects.healthTarget}, final: ${updatedPet.health}`
      );

      savePet(updatedPet, userId).catch(logger.error);
      return updatedPet;
    });

    return true;
  };

  const exercise = () => {
    setPet((currentPet) => {
      if (!currentPet || !canPerformActivity(currentPet, 'exercise')) return currentPet;

      const multiplier = getEnergyMultiplier(currentPet.energy);
      const effects = GAME_BALANCE.activities.exercise;

      const updatedPet: Pet = {
        ...currentPet,
        hunger: Math.max(0, currentPet.hunger + effects.hunger),
        hygiene: Math.max(0, currentPet.hygiene + effects.hygiene),
        energy: Math.max(0, currentPet.energy + effects.energy),
        happiness: Math.min(100, currentPet.happiness + effects.happiness * multiplier),
        money: currentPet.money + effects.money,
      };

      updatedPet.health = calculateHealth(updatedPet);
      savePet(updatedPet, userId).catch(logger.error);
      return updatedPet;
    });
  };

  const petCuddle = () => {
    setPet((currentPet) => {
      if (!currentPet) return currentPet;

      const effects = GAME_BALANCE.activities.petCuddle;

      const updatedPet: Pet = {
        ...currentPet,
        energy: Math.max(0, currentPet.energy + effects.energy),
        happiness: Math.min(100, currentPet.happiness + effects.happiness),
      };

      updatedPet.health = calculateHealth(updatedPet);
      savePet(updatedPet, userId).catch(logger.error);
      return updatedPet;
    });
  };

  const setClothing = (slot: ClothingSlot, itemId: string | null) => {
    setPet((currentPet) => {
      if (!currentPet) return currentPet;

      const updatedPet: Pet = {
        ...currentPet,
        clothes: {
          ...currentPet.clothes,
          [slot]: itemId,
        },
      };
      savePet(updatedPet, userId).catch(logger.error);
      return updatedPet;
    });
  };

  const removePet = async () => {
    await deletePet(userId);
    setPet(null);
  };

  const earnMoney = (amount: number) => {
    setPet((currentPet) => {
      if (!currentPet) return currentPet;

      const updatedPet: Pet = {
        ...currentPet,
        money: (currentPet.money ?? 0) + amount, // Defensive fallback for robustness
      };
      savePet(updatedPet, userId).catch(logger.error);
      return updatedPet;
    });
  };

  return (
    <PetContext.Provider
      value={{
        pet,
        isLoading,
        createPet,
        feed,
        play,
        bathe,
        sleep,
        cancelSleep,
        visitVet,
        exercise,
        petCuddle,
        setClothing,
        removePet,
        earnMoney,
      }}
    >
      {children}
    </PetContext.Provider>
  );
};

export const usePet = (): PetContextType => {
  const context = useContext(PetContext);
  if (!context) {
    throw new Error('usePet deve ser usado dentro de PetProvider');
  }
  return context;
};
