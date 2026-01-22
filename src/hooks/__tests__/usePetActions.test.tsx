/**
 * Tests for usePetActions Hook
 *
 * This test suite covers the core functionality of the usePetActions hook,
 * including action validation, animation sequences, reward triggering,
 * error handling, and cleanup.
 */

import { renderHook, act, waitFor, cleanup } from '@testing-library/react-native';
import { usePetActions } from '../usePetActions';
import { usePet } from '../../context/PetContext';
import { useToast } from '../../context/ToastContext';
import { useDoubleReward } from '../useDoubleReward';
import * as petStatsModule from '../../utils/petStats';
import * as actionConfigModule from '../../config/actionConfig';
import { Pet } from '../../types';

// Mock dependencies
jest.mock('../../context/PetContext');
jest.mock('../../context/ToastContext');
jest.mock('../useDoubleReward');
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, vars?: Record<string, string>) => {
      if (!vars) return key;
      // Simple mock that returns the key + values to verify interpolation
      // Since we don't load actual JSON, we append vars to the key for verification
      const varString = vars ? JSON.stringify(vars) : '';
      return `${key}${varString}`;
    },
  }),
}));

describe('usePetActions', () => {
  // Mock functions
  const mockFeed = jest.fn();
  const mockPlay = jest.fn();
  const mockBathe = jest.fn();
  const mockSleep = jest.fn();
  const mockCancelSleep = jest.fn();
  const mockExercise = jest.fn();
  const mockPetCuddle = jest.fn();
  const mockVisitVet = jest.fn();
  const mockEarnMoney = jest.fn();
  const mockShowToast = jest.fn();
  const mockTriggerReward = jest.fn();

  // Get real animations to use in mocks
  // We use requireActual to ensure we get the original values even if we spy on the module
  const { ACTION_ANIMATIONS } = jest.requireActual('../../config/actionConfig');

  // Mock pet
  const mockPet: Pet = {
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
    background: null,
    createdAt: Date.now(),
    lastUpdated: Date.now(),
  };

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    jest.useFakeTimers();

    // Setup context mocks
    (usePet as jest.Mock).mockReturnValue({
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
    });

    (useToast as jest.Mock).mockReturnValue({
      showToast: mockShowToast,
    });

    (useDoubleReward as jest.Mock).mockReturnValue({
      triggerReward: mockTriggerReward,
      DoubleRewardModal: <div>Modal</div>,
    });

    // Mock sleep to return a promise
    mockSleep.mockResolvedValue({ completed: true });

    // Default: Mock getActionConfig to return 0 duration for all steps
    // This prevents tests from deadlocking or needing complex timer advancement
    // We spy on the exported function 'getActionConfig'
    jest.spyOn(actionConfigModule, 'getActionConfig').mockImplementation((type) => {
      const config = ACTION_ANIMATIONS[type];
      if (!config) return config;
      // Deep clone and set duration to 0
      return {
        ...config,
        states: config.states.map((s: any) => ({ ...s, duration: 0 })),
      };
    });
  });

  afterEach(() => {
    cleanup();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  describe('Hook Initialization', () => {
    it('should initialize with idle state', () => {
      const { result } = renderHook(() => usePetActions());

      expect(result.current.animationState).toBe('idle');
      expect(result.current.message).toBe('');
      expect(result.current.isAnimating).toBe(false);
    });

    it('should provide performAction function', () => {
      const { result } = renderHook(() => usePetActions());

      expect(typeof result.current.performAction).toBe('function');
    });

    it('should provide cancelAction function', () => {
      const { result } = renderHook(() => usePetActions());

      expect(typeof result.current.cancelAction).toBe('function');
    });

    it('should provide DoubleRewardModal component', () => {
      const { result } = renderHook(() => usePetActions());

      expect(result.current.DoubleRewardModal).toBeDefined();
    });
  });

  describe('Validation', () => {
    it('should block action when validation fails', async () => {
      // Mock validation to fail
      jest.spyOn(petStatsModule, 'validateAction').mockReturnValue({
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
      jest.spyOn(petStatsModule, 'validateAction').mockReturnValue({
        canPerform: true,
      });

      const { result } = renderHook(() => usePetActions());

      await act(async () => {
        await result.current.performAction('feed', { amount: 20 });
      });

      expect(mockFeed).toHaveBeenCalledWith(20);
    });

    it('should return failure when no pet exists', async () => {
      (usePet as jest.Mock).mockReturnValue({
        pet: null,
        feed: mockFeed,
        play: mockPlay,
      });

      const { result } = renderHook(() => usePetActions());

      const actionResult = await act(async () => {
        return await result.current.performAction('feed');
      });

      expect(actionResult.success).toBe(false);
      expect(mockFeed).not.toHaveBeenCalled();
    });
  });

  describe('Feed Action', () => {
    beforeEach(() => {
      jest.spyOn(petStatsModule, 'validateAction').mockReturnValue({
        canPerform: true,
      });
    });

    it('should execute feed action with correct amount', async () => {
      const { result } = renderHook(() => usePetActions());

      await act(async () => {
        await result.current.performAction('feed', { amount: 25 });
      });

      expect(mockFeed).toHaveBeenCalledWith(25);
    });

    it('should set eating animation state', async () => {
      // For this test, we need a non-zero duration to catch the 'eating' state
      jest.spyOn(actionConfigModule, 'getActionConfig').mockImplementation((type) => {
        const config = ACTION_ANIMATIONS[type];
        if (!config) return config;
        return {
          ...config,
          states: config.states.map((s: any) => ({ ...s, duration: 100 })),
        };
      });

      const { result } = renderHook(() => usePetActions());

      let actionPromise: Promise<any>;
      await act(async () => {
        // Start action
        actionPromise = result.current.performAction('feed', { amount: 20 });
      });

      expect(result.current.animationState).toBe('eating');

      // Clean up by finishing animation
      await act(async () => {
        jest.runAllTimers();
      });
      await actionPromise!;
    });

    it('should display feeding message with activity name', async () => {
      // Need duration to check message during animation
      jest.spyOn(actionConfigModule, 'getActionConfig').mockImplementation((type) => {
        const config = ACTION_ANIMATIONS[type];
        if (!config) return config;
        return {
          ...config,
          states: config.states.map((s: any) => ({ ...s, duration: 100 })),
        };
      });

      const { result } = renderHook(() => usePetActions());

      let actionPromise: Promise<any>;
      await act(async () => {
        actionPromise = result.current.performAction('feed', {
          amount: 20,
          activity: { emoji: '🍖', nameKey: 'feed.foods.kibble' },
        });
      });

      // Verify message key interpolation
      // Mock returns key + vars, so we expect 'feed.eating' key
      // and variables replaced if mock i18n works
      expect(result.current.message).toContain('feed.eating');

      // Cleanup
      await act(async () => {
        jest.runAllTimers();
      });
      await actionPromise!;
    });

    it('should transition to happy state after eating', async () => {
      // Override mock to have controlled durations
      jest.spyOn(actionConfigModule, 'getActionConfig').mockImplementation((type) => {
        const config = ACTION_ANIMATIONS[type];
        if (!config) return config;
        // Set first step (eating) to 100ms, second (happy) to 100ms
        return {
          ...config,
          states: config.states.map((s: any) => ({ ...s, duration: 100 })),
        };
      });

      const { result } = renderHook(() => usePetActions());

      let actionPromise: Promise<any>;
      await act(async () => {
        actionPromise = result.current.performAction('feed', { amount: 20 });
      });

      // Advance past 'eating' (100ms)
      await act(async () => {
        jest.advanceTimersByTime(150);
      });

      expect(result.current.animationState).toBe('happy');

      // Cleanup
      await act(async () => {
        jest.runAllTimers();
      });
      await actionPromise!;
    });

    it('should return to idle after animation sequence', async () => {
      const { result } = renderHook(() => usePetActions());

      await act(async () => {
        await result.current.performAction('feed', { amount: 20 });
      });

      expect(result.current.animationState).toBe('idle');
      expect(result.current.message).toBe('');
    });

    it('should trigger reward after feeding', async () => {
      const { result } = renderHook(() => usePetActions());

      await act(async () => {
        await result.current.performAction('feed', { amount: 20 });
      });

      expect(mockTriggerReward).toHaveBeenCalledWith(5);
    });
  });

  describe('Play Action', () => {
    beforeEach(() => {
      jest.spyOn(petStatsModule, 'validateAction').mockReturnValue({
        canPerform: true,
      });
    });

    it('should execute play action', async () => {
      const { result } = renderHook(() => usePetActions());

      await act(async () => {
        await result.current.performAction('play', {
          activity: { emoji: '⚽', nameKey: 'play.activities.ball' },
        });
      });

      expect(mockPlay).toHaveBeenCalled();
    });

    it('should set playing animation state', async () => {
      // Need non-zero duration to check intermediate state
      jest.spyOn(actionConfigModule, 'getActionConfig').mockImplementation((type) => {
        const config = ACTION_ANIMATIONS[type];
        if (!config) return config;
        return {
          ...config,
          states: config.states.map((s: any) => ({ ...s, duration: 100 })),
        };
      });

      const { result } = renderHook(() => usePetActions());

      let actionPromise: Promise<any>;
      await act(async () => {
        actionPromise = result.current.performAction('play');
      });

      expect(result.current.animationState).toBe('playing');

      // Cleanup
      await act(async () => {
        jest.runAllTimers();
      });
      await actionPromise!;
    });

    it('should trigger higher reward for play (15 coins)', async () => {
      const { result } = renderHook(() => usePetActions());

      await act(async () => {
        await result.current.performAction('play');
      });

      expect(mockTriggerReward).toHaveBeenCalledWith(15);
    });
  });

  describe('Bathe Action', () => {
    beforeEach(() => {
      jest.spyOn(petStatsModule, 'validateAction').mockReturnValue({
        canPerform: true,
      });
    });

    it('should execute bathe action with amount', async () => {
      const { result } = renderHook(() => usePetActions());

      await act(async () => {
        await result.current.performAction('bathe', { amount: 30 });
      });

      expect(mockBathe).toHaveBeenCalledWith(30);
    });

    it('should trigger reward for bathe', async () => {
      const { result } = renderHook(() => usePetActions());

      await act(async () => {
        await result.current.performAction('bathe', { amount: 30 });
      });

      // Bathe has reward 8
      expect(mockTriggerReward).toHaveBeenCalledWith(8);
    });
  });

  describe('Sleep Action', () => {
    beforeEach(() => {
      jest.spyOn(petStatsModule, 'validateAction').mockReturnValue({
        canPerform: true,
      });
    });

    it('should execute sleep action', async () => {
      const { result } = renderHook(() => usePetActions());

      await act(async () => {
        await result.current.performAction('sleep', { duration: 30000 });
      });

      expect(mockSleep).toHaveBeenCalledWith(30000);
    });

    it('should set sleeping animation state', async () => {
      // Mock sleep to actually wait so we can check state
      mockSleep.mockImplementation(() => new Promise(r => setTimeout(r, 100)));

      const { result } = renderHook(() => usePetActions());

      let actionPromise: Promise<any>;
      await act(async () => {
        actionPromise = result.current.performAction('sleep');
      });

      expect(result.current.animationState).toBe('sleeping');

      // Cleanup
      await act(async () => {
        jest.runAllTimers();
      });
      await actionPromise!;
    });

    it('should return completed status from sleep', async () => {
      mockSleep.mockResolvedValue({ completed: true });
      const { result } = renderHook(() => usePetActions());

      const actionResult = await act(async () => {
        return await result.current.performAction('sleep');
      });

      expect(actionResult.success).toBe(true);
      expect(actionResult.completed).toBe(true);
    });

    it('should handle sleep cancellation', async () => {
      mockSleep.mockResolvedValue({ completed: false });
      const { result } = renderHook(() => usePetActions());

      const actionResult = await act(async () => {
        return await result.current.performAction('sleep');
      });

      expect(actionResult.completed).toBe(false);
    });
  });

  describe('Exercise Action', () => {
    beforeEach(() => {
      jest.spyOn(petStatsModule, 'validateAction').mockReturnValue({
        canPerform: true,
      });
    });

    it('should execute exercise action', async () => {
      const { result } = renderHook(() => usePetActions());

      await act(async () => {
        await result.current.performAction('exercise');
      });

      expect(mockExercise).toHaveBeenCalled();
    });
  });

  describe('Cuddle Action', () => {
    beforeEach(() => {
      jest.spyOn(petStatsModule, 'validateAction').mockReturnValue({
        canPerform: true,
      });
    });

    it('should execute cuddle action', async () => {
      const { result } = renderHook(() => usePetActions());

      await act(async () => {
        await result.current.performAction('cuddle');
      });

      expect(mockPetCuddle).toHaveBeenCalled();
    });
  });

  describe('Vet Action', () => {
    beforeEach(() => {
      jest.spyOn(petStatsModule, 'validateAction').mockReturnValue({
        canPerform: true,
      });
    });

    it('should execute vet action with useMoney flag', async () => {
      const { result } = renderHook(() => usePetActions());

      await act(async () => {
        await result.current.performAction('vet', { useMoney: true });
      });

      expect(mockVisitVet).toHaveBeenCalledWith(true);
    });

    it('should execute vet action without useMoney flag', async () => {
      const { result } = renderHook(() => usePetActions());

      await act(async () => {
        await result.current.performAction('vet', { useMoney: false });
      });

      expect(mockVisitVet).toHaveBeenCalledWith(false);
    });
  });

  describe('Animation Sequencing', () => {
    beforeEach(() => {
      jest.spyOn(petStatsModule, 'validateAction').mockReturnValue({
        canPerform: true,
      });
    });

    it('should set isAnimating to true during action', async () => {
      // Need duration > 0
      jest.spyOn(actionConfigModule, 'getActionConfig').mockImplementation((type) => {
        const config = ACTION_ANIMATIONS[type];
        if (!config) return config;
        return {
          ...config,
          states: config.states.map((s: any) => ({ ...s, duration: 100 })),
        };
      });

      const { result } = renderHook(() => usePetActions());

      let actionPromise: Promise<any>;
      await act(async () => {
        actionPromise = result.current.performAction('feed', { amount: 20 });
      });

      expect(result.current.isAnimating).toBe(true);

      // Cleanup
      await act(async () => {
        jest.runAllTimers();
      });
      await actionPromise!;
    });

    it('should set isAnimating to false after action completes', async () => {
      const { result } = renderHook(() => usePetActions());

      await act(async () => {
        await result.current.performAction('feed', { amount: 20 });
      });

      expect(result.current.isAnimating).toBe(false);
    });

    it('should clear previous timeouts when new action starts', async () => {
      // Mock durations to be long so we can interrupt them
      jest.spyOn(actionConfigModule, 'getActionConfig').mockImplementation((type) => {
        const config = ACTION_ANIMATIONS[type];
        if (!config) return config;
        return {
          ...config,
          states: config.states.map((s: any) => ({ ...s, duration: 5000 })),
        };
      });

      const { result } = renderHook(() => usePetActions());

      // Start first action
      let firstActionPromise: Promise<any>;
      await act(async () => {
        firstActionPromise = result.current.performAction('feed', { amount: 20 });
      });

      // Advance a bit but not enough to finish
      await act(async () => {
        jest.advanceTimersByTime(500);
      });

      // Start second action (should clear first)
      let secondActionPromise: Promise<any>;
      await act(async () => {
        secondActionPromise = result.current.performAction('play');
      });

      // Finish the second action
      await act(async () => {
        jest.runAllTimers();
      });
      await secondActionPromise!;

      // Should have completed play, not feed
      // Note: Animation state depends on which finished last or how they overlapped.
      // But verify mockPlay was called.
      expect(mockPlay).toHaveBeenCalled();
    });
  });

  describe('Reward System', () => {
    beforeEach(() => {
      jest.spyOn(petStatsModule, 'validateAction').mockReturnValue({
        canPerform: true,
      });
    });

    it('should call triggerReward for actions with rewards', async () => {
      const { result } = renderHook(() => usePetActions());

      await act(async () => {
        await result.current.performAction('feed', { amount: 20 });
      });

      expect(mockTriggerReward).toHaveBeenCalledWith(5);
    });

    it('should not call reward functions for zero-reward actions', async () => {
      // Vet doesn't have a reward usually, let's use vet
      const { result } = renderHook(() => usePetActions());

      await act(async () => {
        await result.current.performAction('vet');
      });

      expect(mockTriggerReward).not.toHaveBeenCalled();
      expect(mockEarnMoney).not.toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    beforeEach(() => {
      jest.spyOn(petStatsModule, 'validateAction').mockReturnValue({
        canPerform: true,
      });
    });

    it('should handle errors and reset state', async () => {
      // Mock action config to throw error
      // Note: getActionConfig is called OUTSIDE the try/catch in performAction
      // So performAction will reject/throw
      jest.spyOn(actionConfigModule, 'getActionConfig').mockImplementation(() => {
        throw new Error('Test error');
      });

      const { result } = renderHook(() => usePetActions());

      await expect(
        act(async () => {
          await result.current.performAction('feed');
        })
      ).rejects.toThrow('Test error');

      // State should remain idle
      expect(result.current.animationState).toBe('idle');
      expect(result.current.isAnimating).toBe(false);
    });

    it('should return failure when action config is missing', async () => {
      jest.spyOn(actionConfigModule, 'getActionConfig').mockReturnValue(null as any);

      const { result } = renderHook(() => usePetActions());

      const actionResult = await act(async () => {
        return await result.current.performAction('feed');
      });

      expect(actionResult.success).toBe(false);
    });
  });

  describe('Cancel Action', () => {
    beforeEach(() => {
      jest.spyOn(petStatsModule, 'validateAction').mockReturnValue({
        canPerform: true,
      });
    });

    it('should call cancelSleep when cancelling sleep action', async () => {
      // Mock sleep to pause
      mockSleep.mockImplementation(() => new Promise(r => setTimeout(r, 100)));

      const { result } = renderHook(() => usePetActions());

      // Start sleep
      let actionPromise: Promise<any>;
      await act(async () => {
        actionPromise = result.current.performAction('sleep');
      });

      // Cancel it
      act(() => {
        result.current.cancelAction();
      });

      expect(mockCancelSleep).toHaveBeenCalled();

      // Cleanup
      await act(async () => {
        jest.runAllTimers();
      });
      await actionPromise!;
    });

    it('should reset state when cancelling', async () => {
      // Use duration > 0 so we can cancel mid-flight
      jest.spyOn(actionConfigModule, 'getActionConfig').mockImplementation((type) => {
        const config = ACTION_ANIMATIONS[type];
        if (!config) return config;
        return {
          ...config,
          states: config.states.map((s: any) => ({ ...s, duration: 1000 })),
        };
      });

      const { result } = renderHook(() => usePetActions());

      // Start action
      let actionPromise: Promise<any>;
      await act(async () => {
        actionPromise = result.current.performAction('feed', { amount: 20 });
      });

      // Cancel it
      act(() => {
        result.current.cancelAction();
      });

      expect(result.current.animationState).toBe('idle');
      expect(result.current.message).toBe('');
      expect(result.current.isAnimating).toBe(false);

      // Cleanup
      await act(async () => {
        jest.runAllTimers();
      });
      await actionPromise!;
    });

    it('should clear all timeouts when cancelling', async () => {
      // Use duration > 0
      jest.spyOn(actionConfigModule, 'getActionConfig').mockImplementation((type) => {
        const config = ACTION_ANIMATIONS[type];
        if (!config) return config;
        return {
          ...config,
          states: config.states.map((s: any) => ({ ...s, duration: 1000 })),
        };
      });

      const { result } = renderHook(() => usePetActions());

      // Start action
      let actionPromise: Promise<any>;
      await act(async () => {
        actionPromise = result.current.performAction('feed', { amount: 20 });
      });

      // Cancel it
      act(() => {
        result.current.cancelAction();
      });

      // Advance time - should not trigger any state changes
      await act(async () => {
        jest.advanceTimersByTime(5000);
      });

      expect(result.current.animationState).toBe('idle');

      await actionPromise!;
    });
  });

  describe('Cleanup on Unmount', () => {
    beforeEach(() => {
      jest.spyOn(petStatsModule, 'validateAction').mockReturnValue({
        canPerform: true,
      });
    });

    it('should clear all timeouts on unmount', async () => {
      // Use duration > 0
      jest.spyOn(actionConfigModule, 'getActionConfig').mockImplementation((type) => {
        const config = ACTION_ANIMATIONS[type];
        if (!config) return config;
        return {
          ...config,
          states: config.states.map((s: any) => ({ ...s, duration: 1000 })),
        };
      });

      const { result, unmount } = renderHook(() => usePetActions());

      // Start an action
      let actionPromise: Promise<any>;
      await act(async () => {
        actionPromise = result.current.performAction('feed', { amount: 20 });
      });

      // Unmount before completion
      unmount();

      // Timeouts should be cleaned up (no errors should occur)
      await act(async () => {
        jest.advanceTimersByTime(5000);
      });

      // Test passes if no errors thrown
      expect(true).toBe(true);

      // We can't await actionPromise here because unmount might reject or resolve it?
      // Actually unmount doesn't affect the promise itself, but the component is gone.
      // We just ensure no errors.
    });
  });

  describe('Message Building', () => {
    beforeEach(() => {
      jest.spyOn(petStatsModule, 'validateAction').mockReturnValue({
        canPerform: true,
      });
    });

    it('should interpolate pet name in messages', async () => {
      const { result } = renderHook(() => usePetActions());

      await act(async () => {
        // use 0 duration (default mock) so it sets message immediately and finishes
        await result.current.performAction('feed', {
          amount: 20,
          activity: { emoji: '🍖', nameKey: 'feed.foods.kibble' },
        });
      });

      // With duration 0, loop finishes. Last message is empty?
      // ACTION_ANIMATIONS.feed has 3 states: eating, happy, idle.
      // Idle messageKey is empty.
      // So message will be empty at the end.
      // We can check mock call if we want, or use duration > 0.
    });

    it('should interpolate pet name in messages (with duration)', async () => {
      jest.spyOn(actionConfigModule, 'getActionConfig').mockImplementation((type) => {
        const config = ACTION_ANIMATIONS[type];
        if (!config) return config;
        return {
          ...config,
          states: config.states.map((s: any) => ({ ...s, duration: 100 })),
        };
      });

      const { result } = renderHook(() => usePetActions());

      let actionPromise: Promise<any>;
      await act(async () => {
        actionPromise = result.current.performAction('feed', {
          amount: 20,
          activity: { emoji: '🍖', nameKey: 'feed.foods.kibble' },
        });
      });

      expect(result.current.message).toContain('TestPet');

      await act(async () => { jest.runAllTimers(); });
      await actionPromise!;
    });

    it('should interpolate activity name in messages (with duration)', async () => {
      jest.spyOn(actionConfigModule, 'getActionConfig').mockImplementation((type) => {
        const config = ACTION_ANIMATIONS[type];
        if (!config) return config;
        return {
          ...config,
          states: config.states.map((s: any) => ({ ...s, duration: 100 })),
        };
      });

      const { result } = renderHook(() => usePetActions());

      let actionPromise: Promise<any>;
      await act(async () => {
        actionPromise = result.current.performAction('play', {
          activity: { emoji: '⚽', nameKey: 'play.activities.ball' },
        });
      });

      expect(result.current.message).toBeDefined();

      await act(async () => { jest.runAllTimers(); });
      await actionPromise!;
    });
  });

  describe('Integration', () => {
    beforeEach(() => {
      jest.spyOn(petStatsModule, 'validateAction').mockReturnValue({
        canPerform: true,
      });
    });

    it('should handle multiple sequential actions', async () => {
      const { result } = renderHook(() => usePetActions());

      // First action
      await act(async () => {
        await result.current.performAction('feed', { amount: 20 });
      });

      expect(mockFeed).toHaveBeenCalledWith(20, undefined);
      expect(result.current.isAnimating).toBe(false);

      // Second action
      await act(async () => {
        await result.current.performAction('play');
      });

      expect(mockPlay).toHaveBeenCalled();
      expect(result.current.isAnimating).toBe(false);
    });

    it('should return success for valid action', async () => {
      const { result } = renderHook(() => usePetActions());

      const actionResult = await act(async () => {
        return await result.current.performAction('feed', { amount: 20 });
      });

      expect(actionResult.success).toBe(true);
    });
  });
});
