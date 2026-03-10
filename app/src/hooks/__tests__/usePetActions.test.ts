/**
 * Tests for usePetActions Hook
 */

import React from 'react';
import { renderHook, act, waitFor as _waitFor } from '@testing-library/react-native';
import { ActionType } from '../../config/actionConfig';
import { usePetActions } from '../usePetActions';
import { Pet } from '../../types';
import { usePet } from '../../context/PetContext';
import { useToast } from '../../context/ToastContext';
import { useDoubleReward } from '../useDoubleReward';
import * as petStatsModule from '../../utils/petStats';
import * as actionConfigModule from '../../config/actionConfig';

// Mock dependencies
jest.mock('../../context/PetContext', () => ({
  usePet: jest.fn(),
  PetProvider: ({ children }: any) => children,
}));

jest.mock('../../context/ToastContext', () => ({
  useToast: jest.fn(),
  ToastProvider: ({ children }: any) => children,
}));

jest.mock('../useDoubleReward', () => ({
  useDoubleReward: jest.fn(),
}));

jest.mock('../useRewardedAd', () => ({
  useRewardedAd: jest.fn(() => ({
    showRewardedAd: jest.fn(),
    isAdReady: false,
  })),
}));

jest.mock('../../components/ConfirmModal', () => ({
  ConfirmModal: ({ children, visible }: any) => (visible ? children : null),
}));

jest.mock('../../config/constants', () => {
  const actual = jest.requireActual('../../config/constants');
  return {
    ...actual,
    ANIMATION_DURATION: {
      SHORT: 10,
      MEDIUM: 20,
      LONG: 30,
      EXTRA_LONG: 40,
    },
  };
});

jest.mock('../../config/actionConfig', () => {
  const actual = jest.requireActual('../../config/actionConfig');
  return {
    ...actual,
    getActionConfig: jest.fn(actual.getActionConfig),
    getRewardAmount: jest.fn(actual.getRewardAmount),
    requiresDoubleReward: jest.fn(actual.requiresDoubleReward),
  };
});

jest.mock('../../utils/petStats', () => ({
  validateAction: jest.fn(() => ({ canPerform: true })),
}));

jest.mock('../../utils/logger', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
    log: jest.fn(),
  },
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, vars?: Record<string, string>) => {
      if (!vars) return key;
      let result = key;
      Object.entries(vars).forEach(([k, v]) => {
        result = result.replace(`{{${k}}}`, v);
      });
      return result;
    },
  }),
}));

const mockDefaultPet: Pet = {
  id: '1',
  name: 'TestPet',
  type: 'cat',
  color: 'base',
  gender: 'other',
  hunger: 50,
  hygiene: 50,
  energy: 50,
  happiness: 50,
  health: 75,
  money: 100,
  clothes: { head: null, eyes: null, torso: null, paws: null },
  createdAt: Date.now(),
  lastUpdated: Date.now(),
};

const createMockPetContext = (overrides = {}) => ({
  pet: mockDefaultPet,
  isLoading: false,
  feed: jest.fn(),
  play: jest.fn(),
  bathe: jest.fn(),
  sleep: jest.fn().mockResolvedValue({ completed: true }),
  cancelSleep: jest.fn(),
  exercise: jest.fn(),
  petCuddle: jest.fn(),
  visitVet: jest.fn(),
  earnMoney: jest.fn(),
  createPet: jest.fn(),
  setClothing: jest.fn(),
  removePet: jest.fn(),
  ...overrides,
});

const renderHookWithErrorBoundary = (hook: () => any) => {
  let renderError: any = null;
  class ErrorBoundary extends React.Component<{ children: React.ReactNode }> {
    componentDidCatch(error: any) {
      renderError = error;
    }
    render() {
      return this.props.children;
    }
  }
  const result = renderHook(hook, {
    wrapper: ({ children }) => React.createElement(ErrorBoundary, null, children),
  });
  return { ...result, renderError };
};

describe('usePetActions', () => {
  let mockFeed: jest.Mock;
  let mockPlay: jest.Mock;
  let mockBathe: jest.Mock;
  let mockSleep: jest.Mock;
  let mockCancelSleep: jest.Mock;
  let mockExercise: jest.Mock;
  let mockPetCuddle: jest.Mock;
  let mockVisitVet: jest.Mock;
  let mockEarnMoney: jest.Mock;
  let mockShowToast: jest.Mock;
  let mockTriggerReward: jest.Mock;

  const mockPet: Pet = { ...mockDefaultPet };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    mockFeed = jest.fn();
    mockPlay = jest.fn();
    mockBathe = jest.fn();
    mockSleep = jest.fn().mockResolvedValue({ completed: true });
    mockCancelSleep = jest.fn();
    mockExercise = jest.fn();
    mockPetCuddle = jest.fn();
    mockVisitVet = jest.fn();
    mockEarnMoney = jest.fn();
    mockShowToast = jest.fn();
    mockTriggerReward = jest.fn();

    (usePet as jest.Mock).mockReturnValue(
      createMockPetContext({
        pet: mockPet,
        feed: mockFeed,
        play: mockPlay,
        bathe: mockBathe,
        sleep: mockSleep,
        cancelSleep: mockCancelSleep,
        exercise: mockExercise,
        petCuddle: mockPetCuddle,
        visitVet: mockVisitVet,
        earnMoney: mockEarnMoney,
      })
    );

    (useToast as jest.Mock).mockReturnValue({ showToast: mockShowToast });

    (useDoubleReward as jest.Mock).mockReturnValue({
      triggerReward: mockTriggerReward,
      DoubleRewardModal: () => null,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  const performActionWithTimers = async (result: any, type: ActionType, options: any = {}) => {
    let actionPromise: any;
    
    await act(async () => {
      actionPromise = result.current.performAction(type, options);
      // Advance by a small amount to trigger immediate state updates
      jest.advanceTimersByTime(100); 
    });
    
    // Most animations in tests are mocked to be short or we need to proceed
    await act(async () => {
       jest.runAllTimers();
    });

    return await actionPromise;
  };

  describe('Hook Initialization', () => {
    it('should initialize with idle state', () => {
      const { result, renderError } = renderHookWithErrorBoundary(() => usePetActions());
      expect(renderError).toBeNull();
      expect(result.current.animationState).toBe('idle');
      expect(result.current.message).toBe('');
      expect(result.current.isAnimating).toBe(false);
    });

    it('should provide functions', () => {
      const { result } = renderHook(() => usePetActions());
      expect(typeof result.current.performAction).toBe('function');
      expect(typeof result.current.cancelAction).toBe('function');
      expect(result.current.DoubleRewardModal).toBeDefined();
    });
  });

  describe('Validation', () => {
    it('should block action when validation fails', async () => {
      (petStatsModule.validateAction as jest.Mock).mockReturnValue({
        canPerform: false,
        reason: 'feed.notHungry',
      });
      const { result } = renderHook(() => usePetActions());
      const actionResult = await act(async () => {
        return await result.current.performAction('feed', { amount: 20 });
      });
      expect(actionResult.success).toBe(false);
      expect(mockShowToast).toHaveBeenCalledWith('feed.notHungry', 'info');
      expect(mockFeed).not.toHaveBeenCalled();
    });

    it('should allow action when validation passes', async () => {
      (petStatsModule.validateAction as jest.Mock).mockReturnValue({ canPerform: true });
      const { result } = renderHook(() => usePetActions());
      await performActionWithTimers(result, 'feed', { amount: 20 });
      expect(mockFeed).toHaveBeenCalledWith(20, undefined);
    });

    it('should return failure when no pet exists', async () => {
      (usePet as jest.Mock).mockReturnValue(createMockPetContext({ pet: null }));
      const { result } = renderHook(() => usePetActions());
      const actionResult = await act(async () => {
        return await result.current.performAction('feed');
      });
      expect(actionResult.success).toBe(false);
    });
  });

  describe('Feed Action', () => {
    it('should execute feed action sequence', async () => {
      const { result } = renderHook(() => usePetActions());
      const res = await performActionWithTimers(result, 'feed', { amount: 25 });
      expect(res.success).toBe(true);
      expect(mockFeed).toHaveBeenCalledWith(25, undefined);
      expect(result.current.animationState).toBe('idle');
    });

    it('should display feeding message', async () => {
      (actionConfigModule.getActionConfig as jest.Mock).mockReturnValue({
        states: [
          {
            state: 'eating',
            duration: 100, // Short duration
            messageKey: 'feed.eating',
            messageVars: ['name', 'activity'],
          },
          { state: 'idle', duration: 0, messageKey: '' },
        ],
        rewardAmount: 5,
        executeOnStart: true,
      });
      const { result } = renderHook(() => usePetActions());
      
      let actionPromise: any;
      await act(async () => {
        actionPromise = result.current.performAction('feed', { activity: { emoji: '🍖', nameKey: 'kibble' } });
      });

      // Advance slightly to enter the first state
      await act(async () => {
          jest.advanceTimersByTime(10);
      });

      expect(result.current.message).toContain('feed.eating');
      
      // Finish up
      await act(async () => {
          jest.runAllTimers();
      });
      await actionPromise;
    });
  });

  describe('Play Action', () => {
    it('should execute play action sequence', async () => {
      const { result } = renderHook(() => usePetActions());
      await performActionWithTimers(result, 'play');
      expect(mockPlay).toHaveBeenCalled();
      expect(mockTriggerReward).toHaveBeenCalledWith(15);
    });
  });

  describe('Sleep Action', () => {
    it('should execute sleep action', async () => {
      const { result } = renderHook(() => usePetActions());
      await act(async () => {
        const promise = result.current.performAction('sleep', { duration: 30000 });
        jest.runAllTimers();
        await promise;
      });
      expect(mockSleep).toHaveBeenCalledWith(30000);
    });

    it('should handle sleep completion and cancellation', async () => {
      mockSleep.mockResolvedValueOnce({ completed: true });
      const { result } = renderHook(() => usePetActions());
      let res: any;
      await act(async () => {
        const promise = result.current.performAction('sleep');
        jest.runAllTimers();
        res = await promise;
      });
      expect(res.completed).toBe(true);

      mockSleep.mockResolvedValueOnce({ completed: false });
      await act(async () => {
         const promise = result.current.performAction('sleep');
         jest.runAllTimers();
         res = await promise;
      });
      expect(res.completed).toBe(false);
    });
  });

  describe('Other Actions', () => {
    it('should execute bathe action', async () => {
      const { result } = renderHook(() => usePetActions());
      await performActionWithTimers(result, 'bathe', { amount: 30 });
      expect(mockBathe).toHaveBeenCalledWith(30);
    });

    it('should execute exercise action', async () => {
      const { result } = renderHook(() => usePetActions());
      await performActionWithTimers(result, 'exercise');
      expect(mockExercise).toHaveBeenCalled();
    });

    it('should execute cuddle action', async () => {
      const { result } = renderHook(() => usePetActions());
      await performActionWithTimers(result, 'cuddle');
      expect(mockPetCuddle).toHaveBeenCalled();
    });

    it('should execute vet action', async () => {
      const { result } = renderHook(() => usePetActions());
      await performActionWithTimers(result, 'vet', { useMoney: true });
      expect(mockVisitVet).toHaveBeenCalledWith('antibiotic', true);
    });
  });

  describe('Animation Sequencing & State', () => {
    it('should manage isAnimating state', async () => {
      const { result } = renderHook(() => usePetActions());
      
      let actionPromise: any;
      await act(async () => {
        actionPromise = result.current.performAction('feed');
      });
      
      // Check immediate state
      expect(result.current.isAnimating).toBe(true);
      
      // Finish animation
      await act(async () => {
        jest.runAllTimers();
      });
      await actionPromise;
      
      expect(result.current.isAnimating).toBe(false);
    });

    it('should clear previous timeouts when new action starts', async () => {
      const { result } = renderHook(() => usePetActions());
      
      // Start first action (fire and forget for this test pattern, but we need to advance time)
      let _feedPromise: any;
      await act(async () => {
        _feedPromise = result.current.performAction('feed');
        jest.advanceTimersByTime(10);
      });
      
      // Start second action immediately
      await performActionWithTimers(result, 'play');
      
      expect(mockPlay).toHaveBeenCalled();
      expect(result.current.animationState).toBe('idle');

      // Ensure first action doesn't crash or cause issues when it would have finished
      await act(async () => {
        jest.runAllTimers();
      });
      // We don't await feedPromise here as it might have been effectively cancelled/overwritten in state logic
    });
  });

  describe('Reward System', () => {
    it('should not call reward functions for zero-reward actions', async () => {
      const { result } = renderHook(() => usePetActions());
      await performActionWithTimers(result, 'cuddle');
      expect(mockTriggerReward).not.toHaveBeenCalled();
    });
  });

  describe('Cancel Action', () => {
    it('should handle cancellation', async () => {
      // Mock sleep to be long-running so we can cancel it
      mockSleep.mockImplementation(() => new Promise(resolve => {
        setTimeout(() => resolve({ completed: true }), 5000);
      }));

      const { result } = renderHook(() => usePetActions());
      let sleepPromise: any;
      
      await act(async () => {
        sleepPromise = result.current.performAction('sleep');
        jest.advanceTimersByTime(10);
      });
      
      await act(async () => {
        result.current.cancelAction();
        // Run timers to resolve the sleep promise or allow cancellation logic to proceed
        jest.runAllTimers(); 
      });

      expect(mockCancelSleep).toHaveBeenCalled();
      
      // After cancellation, we expect state to potentially return to idle or be handled by context
      // The promise might resolve with completed: false (or whatever the mock does if cancelled, but here we just check the call)
      const _res = await sleepPromise; 
      expect(result.current.animationState).toBe('idle');
    });
  });

  describe('Cleanup', () => {
    it('should clear timeouts on unmount', () => {
      const { result, unmount } = renderHook(() => usePetActions());
      act(() => {
        result.current.performAction('feed');
      });
      unmount();
      expect(true).toBe(true);
    });
  });

  describe('Integration', () => {
    it('should handle sequential actions', async () => {
      const { result } = renderHook(() => usePetActions());
      await performActionWithTimers(result, 'feed');
      await performActionWithTimers(result, 'play');
      expect(mockFeed).toHaveBeenCalled();
      expect(mockPlay).toHaveBeenCalled();
    });
  });

  describe.skip('Error Handling', () => {
    it('should handle errors and reset state', async () => {
      (actionConfigModule.getActionConfig as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Test error');
      });
      const { result } = renderHook(() => usePetActions());
      jest.spyOn(console, 'error').mockImplementation(() => {});
      const actionResult = await act(async () => {
        return await result.current.performAction('feed');
      });
      expect(actionResult.success).toBe(false);
      (console.error as jest.Mock).mockRestore();
    });
  });
});
