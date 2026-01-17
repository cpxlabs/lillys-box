import React, { createContext, useContext, useState, useEffect, useRef, ReactNode, useMemo, useCallback } from 'react';
import { Pet, PetType, PetColor, Gender, ClothingSlot, TreatmentType } from '../types';
import { savePet, loadPet, deletePet } from '../utils/storage';
import { calculateHealth, getEnergyDecayRate, getEnergyMultiplier, canPerformActivity, calculateHappinessChange } from '../utils/petStats';
import { GAME_BALANCE } from '../config/gameBalance';
import { TIMER_INTERVAL, TIME } from '../config/constants';
import { logger } from '../utils/logger';
import { debounce } from '../utils/debounce';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

type PetContextType = {
  pet: Pet | null;
  isLoading: boolean;
  createPet: (name: string, type: PetType, gender: Gender, color: PetColor) => Promise<void>;
  feed: (amount?: number) => void;
  play: () => void;
  bathe: (amount?: number) => void;
  sleep: (duration?: number) => Promise<{ completed: boolean }>;
  cancelSleep: () => void;
  visitVet: (useMoney?: boolean) => boolean;
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

  // Create debounced save function (save max once per second)
  const debouncedSave = useRef(
    debounce((petToSave: Pet) => {
      savePet(petToSave).catch(logger.error);
    }, TIMER_INTERVAL.DEBOUNCE_SAVE_DELAY)
  ).current;

  useEffect(() => {
    loadPet().then((loadedPet) => {
      setPet(loadedPet);
      setIsLoading(false);
    });
  }, []);

  // Enhanced decay system with energy, happiness, and health
  useEffect(() => {
    const interval = setInterval(() => {
      setPet((currentPet) => {
        if (!currentPet) return currentPet;

        // Skip decay if pet is sleeping
        if (currentPet.isSleeping) return currentPet;

        const now = Date.now();
        const lastUpdate = currentPet.lastUpdated || now;
        const minutesPassed = (now - lastUpdate) / TIME.MS_PER_MINUTE;

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

    return () => clearInterval(interval);
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
    await savePet(newPet);
  };

  const feed = (amount?: number, cost?: number): boolean => {
    // Check if can afford food
    if (cost !== undefined && pet && pet.money < cost) {
      logger.error(`feed: Insufficient funds - has ${pet.money}, needs ${cost}`);
      return false;
    }

    let success = false;
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
        money: cost !== undefined ? currentPet.money - cost : currentPet.money,
      };

      updatedPet.health = calculateHealth(updatedPet);
      savePet(updatedPet).catch(logger.error);
      success = true;
      return updatedPet;
    });
    return success;
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
      savePet(updatedPet).catch(logger.error);
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
      savePet(updatedPet).catch(logger.error);
      return updatedPet;
    });
  };

  const sleep = async (duration: number = GAME_BALANCE.activities.sleep.duration): Promise<{ completed: boolean }> => {
    // Check if pet can sleep before starting
    if (!pet || !canPerformActivity(pet, 'sleep')) {
      return { completed: false };
    }

    // Create cancellation token
    const cancelToken = { cancelled: false };
    sleepCancelRef.current = cancelToken;

    const startTime = Date.now();

    setPet((currentPet) => {
      if (!currentPet) return currentPet;

      const updatedPet: Pet = {
        ...currentPet,
        isSleeping: true,
        sleepStartTime: startTime,
      };
      savePet(updatedPet).catch(logger.error);
      return updatedPet;
    });

    // Wait for sleep duration with cancellation support using Promise.race
    const completed = await Promise.race([
      // Sleep timer
      new Promise<boolean>((resolve) => {
        const timer = setTimeout(() => resolve(true), duration);
        // Store timer for cleanup
        (cancelToken as any).timer = timer;
      }),
      // Cancellation checker
      new Promise<boolean>((resolve) => {
        const checkCancellation = () => {
          if (cancelToken.cancelled) {
            // Clear the sleep timer
            if ((cancelToken as any).timer) {
              clearTimeout((cancelToken as any).timer);
            }
            resolve(false);
          } else {
            // Check again in 100ms
            setTimeout(checkCancellation, TIMER_INTERVAL.SLEEP_CANCELLATION_CHECK);
          }
        };
        checkCancellation();
      }),
    ]);

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
      savePet(updatedPet).catch(logger.error);
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

  const visitVet = (treatment: TreatmentType, useMoney: boolean = true): boolean => {
    if (!pet) {
      logger.error('visitVet: No pet exists');
      return false;
    }

    const treatmentConfig = GAME_BALANCE.activities.vet[treatment];
    if (!treatmentConfig) {
      logger.error(`visitVet: Unknown treatment type: ${treatment}`);
      return false;
    }

    // Check if treatment allows ads and has no money
    if (!useMoney && !treatmentConfig.allowAds) {
      logger.error(`visitVet: ${treatment} does not allow ads`);
      return false;
    }

    // Check if can afford
    if (useMoney && pet.money < treatmentConfig.cost) {
      logger.error(`visitVet: Insufficient funds - has ${pet.money}, needs ${treatmentConfig.cost}`);
      return false;
    }

    logger.info(`visitVet: Starting vet visit (treatment: ${treatment}, useMoney: ${useMoney})`)

    setPet((currentPet) => {
      if (!currentPet) return currentPet;

      const updatedPet: Pet = {
        ...currentPet,
        money: useMoney ? currentPet.money - treatmentConfig.cost : currentPet.money,
      };

      // Set health to minimum target (guarantee minimum health, but keep higher health if already above)
      updatedPet.health = Math.max(treatmentConfig.healthTarget, calculateHealth(updatedPet));

      savePet(updatedPet).catch(logger.error);
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
      savePet(updatedPet).catch(logger.error);
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
      savePet(updatedPet).catch(logger.error);
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
      savePet(updatedPet).catch(logger.error);
      return updatedPet;
    });
  };

  const removePet = async () => {
    await deletePet();
    setPet(null);
  };

  const earnMoney = (amount: number) => {
    setPet((currentPet) => {
      if (!currentPet) return currentPet;
      
      const updatedPet: Pet = {
        ...currentPet,
        money: (currentPet.money ?? 0) + amount, // Defensive fallback for robustness
      };
      savePet(updatedPet).catch(logger.error);
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