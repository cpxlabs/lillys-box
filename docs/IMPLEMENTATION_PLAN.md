# 🚀 High-Priority Implementation Plan
**Project**: Pet Care Game
**Created**: 2026-01-15
**Status**: Ready for Implementation
**Estimated Time**: 2-3 weeks

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Phase 1: Testing Infrastructure Setup](#phase-1-testing-infrastructure-setup)
3. [Phase 2: Critical Bug Fixes](#phase-2-critical-bug-fixes)
4. [Phase 3: Performance & Quality Improvements](#phase-3-performance--quality-improvements)
5. [Phase 4: Claude Code Configuration](#phase-4-claude-code-configuration)
6. [Implementation Checklist](#implementation-checklist)
7. [Success Criteria](#success-criteria)

---

## 🎯 Overview

This plan addresses the critical issues found in the code review and establishes a solid foundation for production deployment.

### Priority Levels
- 🔴 **P0**: Must fix before production (Blockers)
- 🟡 **P1**: Should fix before production (Critical)
- 🟢 **P2**: Nice to have (Quality improvements)

### Timeline
```
Week 1: Phase 1 + Phase 2 (Testing + Critical Fixes)
Week 2: Phase 3 (Performance & Quality)
Week 3: Phase 4 + Polish (Claude Config + Final touches)
```

---

## 📦 Phase 1: Testing Infrastructure Setup

**Priority**: 🔴 P0
**Estimated Time**: 2-3 days
**Goal**: Establish testing foundation with >60% coverage on critical paths

### Step 1.1: Install Testing Dependencies

```bash
# Install testing libraries
pnpm add -D jest @testing-library/react-native @testing-library/jest-native @testing-library/react-hooks
pnpm add -D @types/jest jest-expo babel-jest
pnpm add -D react-test-renderer

# Install testing utilities
pnpm add -D @testing-library/user-event
```

### Step 1.2: Configure Jest

**Create**: `jest.config.js`
```javascript
module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)'
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.tsx',
    '!src/types/**/*',
  ],
  coverageThresholds: {
    global: {
      statements: 60,
      branches: 55,
      functions: 60,
      lines: 60,
    },
  },
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
```

**Create**: `jest.setup.js`
```javascript
import '@testing-library/jest-native/extend-expect';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock expo modules
jest.mock('expo-constants', () => ({
  Constants: {
    expoConfig: {
      extra: {},
    },
  },
}));

// Mock Google Mobile Ads
jest.mock('react-native-google-mobile-ads', () => ({
  default: jest.fn(() => ({
    initialize: jest.fn(() => Promise.resolve()),
    setRequestConfiguration: jest.fn(() => Promise.resolve()),
  })),
  MaxAdContentRating: {
    G: 'G',
  },
  BannerAd: 'BannerAd',
  TestIds: {
    BANNER: 'test-banner',
    INTERSTITIAL: 'test-interstitial',
    REWARDED: 'test-rewarded',
  },
}));

// Mock uuid
jest.mock('react-native-get-random-values', () => ({
  getRandomValues: jest.fn(),
}));

// Silence console warnings in tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};
```

### Step 1.3: Update package.json Scripts

**Edit**: `package.json`
```json
{
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --maxWorkers=2"
  }
}
```

### Step 1.4: Create Critical Test Files

#### 1.4.1: Test petStats Utility

**Create**: `src/utils/__tests__/petStats.test.ts`
```typescript
import {
  calculateHealth,
  getPetMood,
  getEnergyDecayRate,
  getEnergyMultiplier,
  canPerformActivity,
  calculateHappinessChange,
} from '../petStats';
import { Pet } from '../../types';
import { GAME_BALANCE } from '../../config/gameBalance';

describe('petStats', () => {
  describe('calculateHealth', () => {
    it('should calculate health correctly for all stats at 100', () => {
      const pet = {
        hunger: 100,
        hygiene: 100,
        energy: 100,
        happiness: 100,
      };
      const health = calculateHealth(pet);
      expect(health).toBe(100);
    });

    it('should calculate health correctly for all stats at 50', () => {
      const pet = {
        hunger: 50,
        hygiene: 50,
        energy: 50,
        happiness: 50,
      };
      const health = calculateHealth(pet);
      expect(health).toBeGreaterThan(0);
      expect(health).toBeLessThan(100);
    });

    it('should apply penalty multiplier when any stat is below 10', () => {
      const pet1 = {
        hunger: 5,
        hygiene: 100,
        energy: 100,
        happiness: 100,
      };
      const pet2 = {
        hunger: 50,
        hygiene: 100,
        energy: 100,
        happiness: 100,
      };

      const health1 = calculateHealth(pet1);
      const health2 = calculateHealth(pet2);

      expect(health1).toBeLessThan(health2);
    });

    it('should handle edge case of all stats at 0', () => {
      const pet = {
        hunger: 0,
        hygiene: 0,
        energy: 0,
        happiness: 0,
      };
      const health = calculateHealth(pet);
      expect(health).toBe(0);
    });
  });

  describe('getPetMood', () => {
    it('should return excellent for health >= 80', () => {
      expect(getPetMood(100)).toBe('excellent');
      expect(getPetMood(80)).toBe('excellent');
    });

    it('should return good for health 60-79', () => {
      expect(getPetMood(79)).toBe('good');
      expect(getPetMood(60)).toBe('good');
    });

    it('should return fair for health 40-59', () => {
      expect(getPetMood(59)).toBe('fair');
      expect(getPetMood(40)).toBe('fair');
    });

    it('should return poor for health 20-39', () => {
      expect(getPetMood(39)).toBe('poor');
      expect(getPetMood(20)).toBe('poor');
    });

    it('should return critical for health < 20', () => {
      expect(getPetMood(19)).toBe('critical');
      expect(getPetMood(0)).toBe('critical');
    });
  });

  describe('getEnergyDecayRate', () => {
    it('should return day rate during daytime hours', () => {
      // Mock date to 12:00 PM
      jest.spyOn(Date.prototype, 'getHours').mockReturnValue(12);
      expect(getEnergyDecayRate()).toBe(GAME_BALANCE.decay.energyDay);
    });

    it('should return night rate during nighttime hours', () => {
      // Mock date to 11:00 PM
      jest.spyOn(Date.prototype, 'getHours').mockReturnValue(23);
      expect(getEnergyDecayRate()).toBe(GAME_BALANCE.decay.energyNight);
    });
  });

  describe('getEnergyMultiplier', () => {
    it('should return high multiplier for energy >= 70', () => {
      expect(getEnergyMultiplier(100)).toBe(GAME_BALANCE.energyMultipliers.high);
      expect(getEnergyMultiplier(70)).toBe(GAME_BALANCE.energyMultipliers.high);
    });

    it('should return medium multiplier for energy 40-69', () => {
      expect(getEnergyMultiplier(69)).toBe(GAME_BALANCE.energyMultipliers.medium);
      expect(getEnergyMultiplier(40)).toBe(GAME_BALANCE.energyMultipliers.medium);
    });

    it('should return low multiplier for energy 20-39', () => {
      expect(getEnergyMultiplier(39)).toBe(GAME_BALANCE.energyMultipliers.low);
      expect(getEnergyMultiplier(20)).toBe(GAME_BALANCE.energyMultipliers.low);
    });

    it('should return critical multiplier for energy < 20', () => {
      expect(getEnergyMultiplier(19)).toBe(GAME_BALANCE.energyMultipliers.critical);
      expect(getEnergyMultiplier(0)).toBe(GAME_BALANCE.energyMultipliers.critical);
    });
  });

  describe('canPerformActivity', () => {
    const createMockPet = (energy: number): Pet => ({
      id: '1',
      name: 'Test',
      type: 'cat',
      color: 'base',
      gender: 'other',
      hunger: 50,
      hygiene: 50,
      energy,
      happiness: 50,
      health: 50,
      money: 0,
      clothes: { head: null, eyes: null, torso: null, paws: null },
      background: null,
      createdAt: Date.now(),
      lastUpdated: Date.now(),
    });

    it('should allow sleep when energy < 80', () => {
      const pet = createMockPet(70);
      expect(canPerformActivity(pet, 'sleep')).toBe(true);
    });

    it('should not allow sleep when energy >= 80', () => {
      const pet = createMockPet(80);
      expect(canPerformActivity(pet, 'sleep')).toBe(false);
    });

    it('should not allow activities when energy < 20', () => {
      const pet = createMockPet(15);
      expect(canPerformActivity(pet, 'feed')).toBe(false);
      expect(canPerformActivity(pet, 'play')).toBe(false);
      expect(canPerformActivity(pet, 'bathe')).toBe(false);
    });

    it('should allow activities when energy >= 20', () => {
      const pet = createMockPet(20);
      expect(canPerformActivity(pet, 'feed')).toBe(true);
      expect(canPerformActivity(pet, 'play')).toBe(true);
      expect(canPerformActivity(pet, 'bathe')).toBe(true);
    });
  });

  describe('calculateHappinessChange', () => {
    const createMockPet = (hunger: number, hygiene: number, energy: number, health: number): Pet => ({
      id: '1',
      name: 'Test',
      type: 'cat',
      color: 'base',
      gender: 'other',
      hunger,
      hygiene,
      energy,
      happiness: 50,
      health,
      money: 0,
      clothes: { head: null, eyes: null, torso: null, paws: null },
      background: null,
      createdAt: Date.now(),
      lastUpdated: Date.now(),
    });

    it('should increase happiness when all stats are high', () => {
      const pet = createMockPet(80, 80, 80, 80);
      const change = calculateHappinessChange(pet, 1);
      expect(change).toBeGreaterThan(0);
    });

    it('should decrease happiness when health is very low', () => {
      const pet = createMockPet(50, 50, 50, 30);
      const change = calculateHappinessChange(pet, 1);
      expect(change).toBeLessThan(0);
    });

    it('should scale with time passed', () => {
      const pet = createMockPet(80, 80, 80, 80);
      const change1 = calculateHappinessChange(pet, 1);
      const change2 = calculateHappinessChange(pet, 2);
      expect(change2).toBeCloseTo(change1 * 2, 1);
    });
  });
});
```

#### 1.4.2: Test Storage Utility

**Create**: `src/utils/__tests__/storage.test.ts`
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
import { savePet, loadPet, deletePet } from '../storage';
import { Pet } from '../../types';

describe('storage', () => {
  const mockPet: Pet = {
    id: 'test-id',
    name: 'TestPet',
    type: 'cat',
    color: 'base',
    gender: 'other',
    hunger: 100,
    hygiene: 100,
    energy: 80,
    happiness: 75,
    health: 85,
    money: 0,
    clothes: {
      head: null,
      eyes: null,
      torso: null,
      paws: null,
    },
    background: null,
    createdAt: Date.now(),
    lastUpdated: Date.now(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('savePet', () => {
    it('should save pet data to AsyncStorage', async () => {
      await savePet(mockPet);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@pet_care_game:pet',
        expect.any(String)
      );
    });

    it('should update lastUpdated timestamp', async () => {
      const timeBefore = Date.now();
      await savePet(mockPet);

      const savedData = JSON.parse(
        (AsyncStorage.setItem as jest.Mock).mock.calls[0][1]
      );

      expect(savedData.lastUpdated).toBeGreaterThanOrEqual(timeBefore);
    });

    it('should throw error if save fails', async () => {
      (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(
        new Error('Save failed')
      );

      await expect(savePet(mockPet)).rejects.toThrow('Save failed');
    });
  });

  describe('loadPet', () => {
    it('should load pet data from AsyncStorage', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(mockPet)
      );

      const pet = await loadPet();
      expect(pet).toEqual(mockPet);
    });

    it('should return null if no pet exists', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

      const pet = await loadPet();
      expect(pet).toBeNull();
    });

    it('should migrate legacy data without color', async () => {
      const legacyPet = { ...mockPet };
      delete (legacyPet as any).color;

      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(legacyPet)
      );

      const pet = await loadPet();
      expect(pet?.color).toBe('base');
    });

    it('should handle corrupted data gracefully', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        'invalid json'
      );

      const pet = await loadPet();
      expect(pet).toBeNull();
    });
  });

  describe('deletePet', () => {
    it('should delete pet data from AsyncStorage', async () => {
      await deletePet();

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(
        '@pet_care_game:pet'
      );
    });

    it('should throw error if delete fails', async () => {
      (AsyncStorage.removeItem as jest.Mock).mockRejectedValueOnce(
        new Error('Delete failed')
      );

      await expect(deletePet()).rejects.toThrow('Delete failed');
    });
  });
});
```

#### 1.4.3: Test PetContext (Integration)

**Create**: `src/context/__tests__/PetContext.test.tsx`
```typescript
import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { PetProvider, usePet } from '../PetContext';
import * as storage from '../../utils/storage';

jest.mock('../../utils/storage');

describe('PetContext', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <PetProvider>{children}</PetProvider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
    (storage.loadPet as jest.Mock).mockResolvedValue(null);
  });

  describe('createPet', () => {
    it('should create a new pet', async () => {
      const { result } = renderHook(() => usePet(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.createPet('Fluffy', 'cat', 'other', 'base');
      });

      expect(result.current.pet).toBeTruthy();
      expect(result.current.pet?.name).toBe('Fluffy');
      expect(result.current.pet?.type).toBe('cat');
      expect(storage.savePet).toHaveBeenCalled();
    });
  });

  describe('feed', () => {
    it('should increase hunger when feeding', async () => {
      const { result } = renderHook(() => usePet(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.createPet('Fluffy', 'cat', 'other', 'base');
      });

      const hungerBefore = result.current.pet!.hunger;

      act(() => {
        result.current.feed();
      });

      expect(result.current.pet!.hunger).toBeGreaterThanOrEqual(hungerBefore);
    });

    it('should not exceed 100 hunger', async () => {
      const { result } = renderHook(() => usePet(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.createPet('Fluffy', 'cat', 'other', 'base');
      });

      // Feed multiple times
      act(() => {
        result.current.feed();
        result.current.feed();
        result.current.feed();
      });

      expect(result.current.pet!.hunger).toBeLessThanOrEqual(100);
    });
  });

  describe('earnMoney', () => {
    it('should increase money amount', async () => {
      const { result } = renderHook(() => usePet(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.createPet('Fluffy', 'cat', 'other', 'base');
      });

      act(() => {
        result.current.earnMoney(50);
      });

      expect(result.current.pet!.money).toBe(50);
    });
  });
});
```

### Step 1.5: Run Tests and Verify

```bash
# Run all tests
pnpm test

# Run with coverage
pnpm test:coverage

# Expected output: >60% coverage on utils
```

---

## 🐛 Phase 2: Critical Bug Fixes

**Priority**: 🔴 P0
**Estimated Time**: 3-4 days
**Goal**: Fix race conditions, add error boundaries, improve type safety

### Step 2.1: Fix Sleep Cancellation Race Condition

**Problem**: Current implementation uses polling with `setInterval` which can cause memory leaks.

**Edit**: `src/context/PetContext.tsx`

**Replace lines 182-242** with:

```typescript
const sleep = async (duration: number = GAME_BALANCE.activities.sleep.duration): Promise<{ completed: boolean }> => {
  // Create cancellation token
  const cancelToken = { cancelled: false };
  sleepCancelRef.current = cancelToken;

  const startTime = Date.now();

  setPet((currentPet) => {
    if (!currentPet || !canPerformActivity(currentPet, 'sleep')) return currentPet;

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
          setTimeout(checkCancellation, 100);
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
```

### Step 2.2: Add Error Boundary Component

**Create**: `src/components/ErrorBoundary.tsx`

```typescript
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface Props {
  children: ReactNode;
  fallback?: (error: Error, errorInfo: ErrorInfo, retry: () => void) => ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to error reporting service (e.g., Sentry)
    console.error('Error Boundary caught an error:', error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback && this.state.error && this.state.errorInfo) {
        return this.props.fallback(
          this.state.error,
          this.state.errorInfo,
          this.handleRetry
        );
      }

      return (
        <View style={styles.container}>
          <Text style={styles.emoji}>😿</Text>
          <Text style={styles.title}>Oops! Something went wrong</Text>
          <Text style={styles.message}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </Text>
          <TouchableOpacity style={styles.button} onPress={this.handleRetry}>
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: '#666',
  },
  button: {
    backgroundColor: '#9b59b6',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
```

**Edit**: `App.tsx`

Add error boundary around the app:

```typescript
import { ErrorBoundary } from './src/components/ErrorBoundary';

export default function App() {
  useEffect(() => {
    AdService.initializeAds();
  }, []);

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <LanguageProvider>
          <PetProvider>
            <AdProvider>
              <ToastProvider>
                <AppNavigator />
              </ToastProvider>
            </AdProvider>
          </PetProvider>
        </LanguageProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
```

### Step 2.3: Add Input Validation for Pet Creation

**Create**: `src/utils/validation.ts`

```typescript
export const PET_NAME_VALIDATION = {
  MIN_LENGTH: 1,
  MAX_LENGTH: 20,
  ALLOWED_CHARS: /^[a-zA-Z0-9\s\-']+$/,
};

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validatePetName = (name: string): ValidationResult => {
  if (!name || name.trim().length === 0) {
    return {
      isValid: false,
      error: 'Pet name cannot be empty',
    };
  }

  const trimmedName = name.trim();

  if (trimmedName.length < PET_NAME_VALIDATION.MIN_LENGTH) {
    return {
      isValid: false,
      error: `Pet name must be at least ${PET_NAME_VALIDATION.MIN_LENGTH} character`,
    };
  }

  if (trimmedName.length > PET_NAME_VALIDATION.MAX_LENGTH) {
    return {
      isValid: false,
      error: `Pet name cannot exceed ${PET_NAME_VALIDATION.MAX_LENGTH} characters`,
    };
  }

  if (!PET_NAME_VALIDATION.ALLOWED_CHARS.test(trimmedName)) {
    return {
      isValid: false,
      error: 'Pet name can only contain letters, numbers, spaces, hyphens, and apostrophes',
    };
  }

  return { isValid: true };
};

export const sanitizePetName = (name: string): string => {
  return name.trim().slice(0, PET_NAME_VALIDATION.MAX_LENGTH);
};
```

**Edit**: `src/screens/CreatePetScreen.tsx`

Add validation before creating pet:

```typescript
import { validatePetName, sanitizePetName } from '../utils/validation';

// In the handleCreatePet function, add validation:
const handleCreatePet = () => {
  const validation = validatePetName(petName);

  if (!validation.isValid) {
    showToast(validation.error!, 'error');
    return;
  }

  const sanitizedName = sanitizePetName(petName);
  createPet(sanitizedName, selectedPetType, selectedGender, selectedColor);
  navigation.replace('Home');
};
```

### Step 2.4: Fix TypeScript `any` Types in AdService

**Edit**: `src/services/AdService.ts`

**Replace lines 1-34** with:

```typescript
import { Platform } from 'react-native';
import { AdsConfig } from '../config/ads.config';
import { logger } from '../utils/logger';

// Type definitions for AdMob
let MobileAds: any;
let MaxAdContentRating: any;
let RewardedAd: any;
let RewardedAdEventType: any;
let InterstitialAd: any;
let AdEventType: any;

// Only import on native platforms
if (Platform.OS !== 'web') {
  try {
    const AdMobModule = require('react-native-google-mobile-ads');
    MobileAds = AdMobModule.default;
    MaxAdContentRating = AdMobModule.MaxAdContentRating;
    RewardedAd = AdMobModule.RewardedAd;
    RewardedAdEventType = AdMobModule.RewardedAdEventType;
    InterstitialAd = AdMobModule.InterstitialAd;
    AdEventType = AdMobModule.AdEventType;
  } catch (error) {
    logger.warn('[AdService] AdMob module not available:', error);
  }
}

// Define proper types
interface AdInstance {
  load: () => void;
  show: () => Promise<void>;
  addAdEventListener: (eventType: string, handler: (event?: any) => void) => () => void;
}

type AdEventHandler = (event?: any) => void;
```

Then update class properties:

```typescript
class AdService {
  private rewardedAd: AdInstance | null = null;
  private interstitialAd: AdInstance | null = null;
  // ... rest of class
}
```

### Step 2.5: Debounce Storage Writes

**Create**: `src/utils/debounce.ts`

```typescript
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}
```

**Edit**: `src/context/PetContext.tsx`

Add debounced save:

```typescript
import { debounce } from '../utils/debounce';

export const PetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // ... existing code

  // Create debounced save function (save max once per second)
  const debouncedSave = useRef(
    debounce((pet: Pet) => {
      savePet(pet).catch(logger.error);
    }, 1000)
  ).current;

  // In the decay effect, replace savePet with debouncedSave:
  useEffect(() => {
    const interval = setInterval(() => {
      setPet((currentPet) => {
        if (!currentPet) return currentPet;
        // ... decay logic

        // Use debounced save instead of direct save
        debouncedSave(updatedPet);
        return updatedPet;
      });
    }, GAME_BALANCE.time.updateInterval);

    return () => clearInterval(interval);
  }, [debouncedSave]);

  // ... rest of component
};
```

### Step 2.6: Add Tests for New Code

**Create**: `src/utils/__tests__/validation.test.ts`

```typescript
import { validatePetName, sanitizePetName, PET_NAME_VALIDATION } from '../validation';

describe('validation', () => {
  describe('validatePetName', () => {
    it('should accept valid names', () => {
      expect(validatePetName('Fluffy').isValid).toBe(true);
      expect(validatePetName('Mr. Whiskers').isValid).toBe(true);
      expect(validatePetName("O'Malley").isValid).toBe(true);
      expect(validatePetName('Rex-5').isValid).toBe(true);
    });

    it('should reject empty names', () => {
      expect(validatePetName('').isValid).toBe(false);
      expect(validatePetName('   ').isValid).toBe(false);
    });

    it('should reject names that are too long', () => {
      const longName = 'a'.repeat(PET_NAME_VALIDATION.MAX_LENGTH + 1);
      expect(validatePetName(longName).isValid).toBe(false);
    });

    it('should reject names with invalid characters', () => {
      expect(validatePetName('Fluffy😀').isValid).toBe(false);
      expect(validatePetName('Pet<script>').isValid).toBe(false);
      expect(validatePetName('Name@#$').isValid).toBe(false);
    });
  });

  describe('sanitizePetName', () => {
    it('should trim whitespace', () => {
      expect(sanitizePetName('  Fluffy  ')).toBe('Fluffy');
    });

    it('should truncate long names', () => {
      const longName = 'a'.repeat(PET_NAME_VALIDATION.MAX_LENGTH + 10);
      expect(sanitizePetName(longName).length).toBe(PET_NAME_VALIDATION.MAX_LENGTH);
    });
  });
});
```

---

## ⚡ Phase 3: Performance & Quality Improvements

**Priority**: 🟡 P1
**Estimated Time**: 3-4 days
**Goal**: Optimize re-renders, add memoization, improve accessibility

### Step 3.1: Optimize PetContext Re-renders

**Edit**: `src/context/PetContext.tsx`

Add memoization to context value:

```typescript
import React, { createContext, useContext, useState, useEffect, useRef, ReactNode, useMemo, useCallback } from 'react';

export const PetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pet, setPet] = useState<Pet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const sleepCancelRef = useRef<{ cancelled: boolean } | null>(null);

  // ... existing useEffects and functions

  // Memoize all action functions
  const createPetMemo = useCallback(async (name: string, type: PetType, gender: Gender, color: PetColor) => {
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
      background: null,
      createdAt: Date.now(),
      lastUpdated: Date.now(),
      isSleeping: false,
    };
    setPet(newPet);
    await savePet(newPet);
  }, []);

  const feedMemo = useCallback((amount?: number) => {
    feed(amount);
  }, []);

  // ... memoize other functions

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      pet,
      isLoading,
      createPet: createPetMemo,
      feed: feedMemo,
      play,
      bathe,
      sleep,
      cancelSleep,
      visitVet,
      exercise,
      petCuddle,
      setClothing,
      setBackground,
      removePet,
      earnMoney,
    }),
    [pet, isLoading, createPetMemo, feedMemo]
  );

  return (
    <PetContext.Provider value={contextValue}>
      {children}
    </PetContext.Provider>
  );
};
```

### Step 3.2: Add React.memo to Pure Components

**Edit**: `src/components/IconButton.tsx`

```typescript
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';

type IconButtonProps = {
  emoji: string;
  label: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
};

export const IconButton: React.FC<IconButtonProps> = React.memo(({
  emoji,
  label,
  onPress,
  disabled = false,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabled, style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
    >
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
});

IconButton.displayName = 'IconButton';

// ... styles
```

### Step 3.3: Add Accessibility Labels

**Edit**: `src/components/StatusCard.tsx`

Add accessibility props:

```typescript
<View
  style={styles.statRow}
  accessibilityLabel={`${t('common.hunger')}: ${pet.hunger} percent`}
>
  <Text style={styles.statLabel}>🍖 {t('common.hunger')}</Text>
  <View
    style={styles.progressBarContainer}
    accessible={false}
  >
    <View style={[styles.progressBar, { width: `${pet.hunger}%` }]} />
  </View>
  <Text style={styles.statValue}>{pet.hunger}</Text>
</View>
```

### Step 3.4: Add Haptic Feedback

**Install**: `expo-haptics`

```bash
pnpm add expo-haptics
```

**Create**: `src/utils/haptics.ts`

```typescript
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export const hapticFeedback = {
  light: () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  },

  medium: () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  },

  heavy: () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
  },

  success: () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  },

  warning: () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  },

  error: () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  },

  selection: () => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
  },
};
```

**Edit**: `src/components/IconButton.tsx`

Add haptic feedback on press:

```typescript
import { hapticFeedback } from '../utils/haptics';

export const IconButton: React.FC<IconButtonProps> = React.memo(({
  emoji,
  label,
  onPress,
  disabled = false,
  style,
}) => {
  const handlePress = () => {
    hapticFeedback.light();
    onPress();
  };

  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabled, style]}
      onPress={handlePress}
      disabled={disabled}
      // ... rest
    >
```

### Step 3.5: Add Code Formatting (Prettier)

**Install Prettier**:

```bash
pnpm add -D prettier
```

**Create**: `.prettierrc`

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

**Create**: `.prettierignore`

```
node_modules/
.expo/
dist/
coverage/
*.lock
```

**Add to package.json**:

```json
{
  "scripts": {
    "format": "prettier --write \"src/**/*.{ts,tsx}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx}\""
  }
}
```

### Step 3.6: Add ESLint

**Install ESLint**:

```bash
pnpm add -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-react eslint-plugin-react-hooks
```

**Create**: `.eslintrc.js`

```javascript
module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'react', 'react-hooks'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
```

**Add to package.json**:

```json
{
  "scripts": {
    "lint": "eslint \"src/**/*.{ts,tsx}\"",
    "lint:fix": "eslint \"src/**/*.{ts,tsx}\" --fix"
  }
}
```

---

## 🤖 Phase 4: Claude Code Configuration

**Priority**: 🟢 P2
**Estimated Time**: 1-2 days
**Goal**: Set up Claude Code for optimal AI-assisted development

### Step 4.1: Initialize Claude Code

**Run**:

```bash
# Initialize Claude Code in your project
claude init
```

This will create a `.claude/` directory with configuration files.

### Step 4.2: Create Project Instructions

**Create**: `.claude/instructions.md`

```markdown
# Pet Care Game - Claude Code Instructions

## Project Overview
A 2D mobile pet care game built with React Native and Expo for Android, targeting children aged 4-8. Players care for virtual pets (cats or dogs) through feeding, bathing, playing, and customization activities.

## Tech Stack
- **React Native** 0.73.2 with **Expo** 50
- **TypeScript** (strict mode enabled)
- **React Navigation** v6 (Native Stack)
- **Context API** for global state management
- **AsyncStorage** for local persistence
- **AdMob** for monetization (COPPA compliant)
- **i18next** for internationalization (EN/PT-BR)

## Architecture Principles

### Directory Structure
```
src/
├── components/      # Reusable UI components
├── screens/         # Full-screen views
├── context/         # Global state (Context API)
├── hooks/           # Custom React hooks
├── utils/           # Pure utility functions
├── services/        # External service integrations
├── config/          # Configuration files
├── data/            # Static data
├── types/           # TypeScript type definitions
└── locales/         # i18n translation files
```

### Coding Standards

#### 1. Component Structure
- Use **functional components only** (no class components)
- Use custom hooks for reusable logic
- Memoize components with `React.memo` when appropriate
- Use `useCallback` for event handlers passed to child components
- Use `useMemo` for expensive calculations

#### 2. State Management
- **Context API** for global state (Pet, Ad, Language, Toast)
- **useState** for local component state
- **NO Redux** - keep it simple with Context
- Debounce frequent state updates (e.g., storage writes)

#### 3. TypeScript Rules
- **Strict mode** is enabled - maintain this
- **NO `any` types** - use proper types or `unknown`
- Define interfaces for all props
- Use discriminated unions for state machines
- Path alias `@/*` maps to `src/*`

#### 4. Game Logic
- **All game balance values** must be in `config/gameBalance.ts`
- Never hardcode stat values in components
- Use utility functions from `utils/petStats.ts` for calculations
- Test all game logic changes

#### 5. Internationalization
- **ALL user-facing strings** must use i18n: `t('key')`
- Add translations to both `locales/en.json` and `locales/pt-BR.json`
- Developer-facing errors can be in English
- Never hardcode display text in components

#### 6. Data Persistence
- Use `utils/storage.ts` wrappers (never call AsyncStorage directly)
- Always handle save failures gracefully
- Validate and migrate data on load
- Debounce frequent saves (already implemented)

#### 7. Child Safety (COPPA Compliance)
- All ads must be G-rated (MaxAdContentRating.G)
- No data collection without parent consent
- Simple, safe UX for children 4-8
- No external links without warnings
- No in-app purchases (planned for future)

#### 8. Testing Requirements
- Write tests for all utility functions
- Test complex state logic (PetContext)
- Use React Native Testing Library for components
- Target: >60% coverage on business logic
- Mock external dependencies (AsyncStorage, AdMob)

#### 9. Performance
- Memoize context values to prevent unnecessary re-renders
- Debounce expensive operations
- Use `FlatList` for long lists (if needed in future)
- Optimize images (use `expo-image` if slow)
- Keep animations on UI thread (use `'worklet'` with Reanimated)

#### 10. Accessibility
- Add `accessibilityLabel` to all interactive elements
- Add `accessibilityRole` for semantic meaning
- Use `accessibilityState` for disabled/selected states
- Support dynamic font sizing (future enhancement)
- Add haptic feedback for important interactions

#### 11. Error Handling
- Always wrap async operations in try-catch
- Use logger instead of console.log
- Show user-friendly error messages
- Never fail silently on save errors
- Error boundary wraps entire app

#### 12. Git & Commits
- Write clear, descriptive commit messages
- Reference issue numbers when applicable
- Keep commits focused and atomic
- Don't commit commented-out code
- Don't commit console.logs

## Common Patterns

### Creating a New Screen
1. Create file in `src/screens/`
2. Use functional component with typed props
3. Import navigation types from `types/navigation.ts`
4. Use `useTranslation()` for i18n
5. Use `usePet()` for pet state
6. Add to navigator in `App.tsx`

### Creating a New Component
1. Create file in `src/components/`
2. Use TypeScript for props interface
3. Consider memoization with `React.memo`
4. Add accessibility labels
5. Style with StyleSheet (not inline styles)

### Adding a New Activity
1. Add effect values to `config/gameBalance.ts`
2. Add function to `PetContext.tsx`
3. Create screen in `src/screens/`
4. Add i18n strings
5. Write tests for the activity logic
6. Add button to `HomeScreen.tsx`

### Modifying Game Balance
1. Update values in `config/gameBalance.ts` ONLY
2. Document the reason for the change
3. Test the impact on gameplay
4. Consider if dependent code needs updates

## What NOT to Do

❌ Don't use `any` types
❌ Don't hardcode game balance values
❌ Don't skip i18n for user-facing text
❌ Don't call AsyncStorage directly
❌ Don't use class components
❌ Don't add Redux or other state libraries
❌ Don't skip tests for new utility functions
❌ Don't use console.log (use logger)
❌ Don't commit .env files or secrets
❌ Don't add features without tests

## Current Status

### ✅ Completed
- Core game loop with stat decay
- Pet creation and customization
- Activities: feed, bathe, play, sleep, vet
- Clothing and background customization
- AdMob integration (banner, interstitial, rewarded)
- i18n (EN/PT-BR)
- Data persistence with migration
- Error boundary
- Testing infrastructure
- Input validation

### 🚧 In Progress
- Performance optimizations
- Accessibility improvements
- Code quality improvements

### 📋 Planned
- Sound effects and music
- More pet types and colors
- Mini-games
- Achievements system
- Cloud save (optional)
- iOS support

## Testing

Always run tests before committing:
```bash
pnpm test           # Run all tests
pnpm test:watch     # Watch mode
pnpm test:coverage  # Check coverage
```

## Useful Commands

```bash
pnpm start          # Start Expo dev server
pnpm android        # Run on Android
pnpm test           # Run tests
pnpm lint           # Check linting
pnpm format         # Format code
```

## Questions to Ask Before Coding

1. Does this need i18n?
2. Should this be tested?
3. Is this the right place for this code?
4. Does this follow our architecture?
5. Have I checked gameBalance.ts?
6. Is this accessible for children?
7. Does this affect COPPA compliance?
8. Have I memoized if needed?

## Resources

- [React Native Docs](https://reactnative.dev/)
- [Expo Docs](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Testing Library](https://testing-library.com/docs/react-native-testing-library/intro/)
- [AdMob COPPA](https://support.google.com/admob/answer/9004676)

## Contact

For questions about the codebase, refer to:
- `README.md` - Project overview
- `FOLDER_STRUCTURE.md` - Architecture details
- `NEXT_STEPS.md` - Roadmap
- This file - Coding standards
```

### Step 4.3: Create .claudeignore

**Create**: `.claudeignore`

```
# Dependencies
node_modules/
.pnpm-store/

# Build outputs
.expo/
dist/
web-build/
coverage/

# Cache
.metro-health-check*
*.log

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/

# Temp files
*.tmp
*.temp

# Lock files (Claude doesn't need these)
pnpm-lock.yaml
package-lock.json
yarn.lock

# Assets (large files)
assets/sprites/
assets/backgrounds/
```

### Step 4.4: Update .gitignore

**Edit**: `.gitignore`

Add Claude Code files:

```
# Claude Code
.claude/
.claude-session
*.claude-context
```

### Step 4.5: Create MCP Server Config (Optional)

If you want to connect external tools/APIs to Claude Code:

**Create**: `.claude/mcp-config.json`

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/home/user/pet-care-game"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "<your-token-here>"
      }
    }
  }
}
```

### Step 4.6: Test Claude Code Setup

```bash
# Test that Claude Code can read your project
claude status

# Ask Claude a question about your codebase
claude "What's the current game balance for feeding?"

# Get Claude to help with a task
claude "Add a unit test for the calculateHealth function"
```

---

## ✅ Implementation Checklist

Use this checklist to track your progress:

### Phase 1: Testing Infrastructure ✅
- [ ] Install testing dependencies
- [ ] Configure Jest
- [ ] Create jest.setup.js
- [ ] Update package.json scripts
- [ ] Write tests for petStats.ts
- [ ] Write tests for storage.ts
- [ ] Write tests for PetContext.tsx
- [ ] Run tests and verify >60% coverage
- [ ] Fix any failing tests

### Phase 2: Critical Bug Fixes ✅
- [ ] Fix sleep cancellation race condition
- [ ] Create ErrorBoundary component
- [ ] Add ErrorBoundary to App.tsx
- [ ] Create validation.ts utility
- [ ] Add validation to CreatePetScreen
- [ ] Fix TypeScript `any` types in AdService
- [ ] Create debounce.ts utility
- [ ] Add debounced saves to PetContext
- [ ] Write tests for validation
- [ ] Test all bug fixes manually
- [ ] Verify no regressions

### Phase 3: Performance & Quality ✅
- [ ] Optimize PetContext with useMemo
- [ ] Memoize context value
- [ ] Add React.memo to IconButton
- [ ] Add React.memo to StatusCard
- [ ] Add React.memo to other pure components
- [ ] Add accessibility labels to all buttons
- [ ] Add accessibility to status bars
- [ ] Install expo-haptics
- [ ] Create haptics.ts utility
- [ ] Add haptic feedback to buttons
- [ ] Install Prettier
- [ ] Create .prettierrc
- [ ] Format entire codebase
- [ ] Install ESLint
- [ ] Create .eslintrc.js
- [ ] Fix all linting errors
- [ ] Add pre-commit hooks (optional)

### Phase 4: Claude Code Configuration ✅
- [ ] Run `claude init`
- [ ] Create .claude/instructions.md
- [ ] Create .claudeignore
- [ ] Update .gitignore for Claude files
- [ ] Create MCP config (optional)
- [ ] Test Claude Code setup
- [ ] Verify Claude understands project context

### Final Verification ✅
- [ ] All tests passing
- [ ] No console errors in app
- [ ] App builds successfully
- [ ] All features work as expected
- [ ] Performance is smooth
- [ ] Accessibility labels present
- [ ] Haptic feedback works
- [ ] Code is formatted
- [ ] No linting errors
- [ ] Claude Code responds correctly

---

## 🎯 Success Criteria

### Testing
- ✅ Jest configured and running
- ✅ >60% coverage on utils/
- ✅ All critical paths tested
- ✅ CI/CD ready (test:ci script)

### Code Quality
- ✅ No race conditions
- ✅ Error boundaries in place
- ✅ Input validation implemented
- ✅ TypeScript strict mode (no `any`)
- ✅ Code formatted with Prettier
- ✅ No ESLint errors

### Performance
- ✅ Context value memoized
- ✅ Pure components memoized
- ✅ Storage writes debounced
- ✅ No unnecessary re-renders

### Accessibility
- ✅ All buttons have labels
- ✅ Haptic feedback implemented
- ✅ Screen reader compatible

### Developer Experience
- ✅ Claude Code configured
- ✅ Clear project instructions
- ✅ Easy to onboard new contributors
- ✅ Consistent code style

---

## 📊 Metrics to Track

After implementation, measure these metrics:

1. **Test Coverage**: Should be >60% on utils/, >40% overall
2. **Build Time**: Should remain under 2 minutes
3. **App Size**: Should be under 30MB
4. **Startup Time**: Should be under 3 seconds
5. **Frame Rate**: Should maintain 60fps on mid-range devices
6. **Crash Rate**: Should be <0.1% (with error boundaries)

---

## 🚀 Next Steps After Completion

Once all phases are complete:

1. **Run Full Test Suite**
   ```bash
   pnpm test:coverage
   ```

2. **Build Production APK**
   ```bash
   eas build --platform android --profile production
   ```

3. **Test on Real Devices**
   - Test on Android 8+ devices
   - Verify performance on low-end devices
   - Test accessibility features
   - Verify COPPA compliance

4. **Update Documentation**
   - Update README with new features
   - Document testing strategy
   - Update NEXT_STEPS.md

5. **Deploy to Production**
   - Submit to Google Play Store
   - Set up crash reporting (Sentry)
   - Monitor user feedback

---

## 🆘 Troubleshooting

### Tests Failing
- Clear cache: `pnpm test --clearCache`
- Check mock setup in jest.setup.js
- Verify all dependencies installed

### TypeScript Errors
- Run `pnpm tsc --noEmit` to check types
- Ensure all dependencies have type definitions
- Check tsconfig.json is correct

### Build Errors
- Clear Expo cache: `expo start -c`
- Delete node_modules and reinstall
- Check for conflicting dependencies

### Claude Code Not Working
- Verify `.claude/instructions.md` exists
- Check `.claudeignore` is not too restrictive
- Run `claude status` to check configuration

---

## 📅 Timeline Summary

| Phase | Duration | Priority | Status |
|-------|----------|----------|--------|
| Phase 1: Testing Setup | 2-3 days | 🔴 P0 | ⏳ Pending |
| Phase 2: Critical Fixes | 3-4 days | 🔴 P0 | ⏳ Pending |
| Phase 3: Performance | 3-4 days | 🟡 P1 | ⏳ Pending |
| Phase 4: Claude Config | 1-2 days | 🟢 P2 | ⏳ Pending |
| **Total** | **9-13 days** | - | ⏳ Pending |

---

## 🎉 Completion

When all items are checked off:

1. Commit all changes
2. Create a release tag: `v1.1.0`
3. Update CHANGELOG.md
4. Celebrate! 🎊

You'll have a production-ready, well-tested, performant, and maintainable codebase!

---

**Last Updated**: 2026-01-15
**Plan Version**: 1.0
**Status**: Ready for Implementation
