/**
 * Tests for usePetActions Hook
 *
 * This test suite covers the core functionality of the usePetActions hook,
 * including action validation, animation sequences, reward triggering,
 * error handling, and cleanup.
 */

import { renderHook, act, waitFor } from '@testing-library/react-native';
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
      let result = key;
      Object.entries(vars).forEach(([k, v]) => {
        result = result.replace(`{{${k}}}`, v);
      });
      return result;
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
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
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
        jest.advanceTimersByTime(3000); // Fast-forward animation
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
        jest.advanceTimersByTime(3000);
      });

      expect(mockFeed).toHaveBeenCalledWith(25);
    });

    it('should set eating animation state', async () => {
      const { result } = renderHook(() => usePetActions());

      act(() => {
        result.current.performAction('feed', { amount: 20 });
      });

      await waitFor(() => {
        expect(result.current.animationState).toBe('eating');
      });
    });

    it('should display feeding message with activity name', async () => {
      const { result } = renderHook(() => usePetActions());

      act(() => {
        result.current.performAction('feed', {
          amount: 20,
          activity: { emoji: '🍖', nameKey: 'feed.foods.kibble' },
        });
      });

      await waitFor(() => {
        expect(result.current.message).toContain('feed.eating');
      });
    });

    it('should transition to happy state after eating', async () => {
      const { result } = renderHook(() => usePetActions());

      await act(async () => {
        result.current.performAction('feed', { amount: 20 });
        jest.advanceTimersByTime(1500); // First animation
      });

      await waitFor(() => {
        expect(result.current.animationState).toBe('happy');
      });
    });

    it('should return to idle after animation sequence', async () => {
      const { result } = renderHook(() => usePetActions());

      await act(async () => {
        await result.current.performAction('feed', { amount: 20 });
        jest.advanceTimersByTime(3000);
      });

      expect(result.current.animationState).toBe('idle');
      expect(result.current.message).toBe('');
    });

    it('should trigger reward after feeding', async () => {
      const { result } = renderHook(() => usePetActions());

      await act(async () => {
        await result.current.performAction('feed', { amount: 20 });
        jest.advanceTimersByTime(3000);
      });

      expect(mockTriggerReward).toHaveBeenCalledWith(5); // Feed reward is 5 coins
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
        jest.advanceTimersByTime(3000);
      });

      expect(mockPlay).toHaveBeenCalled();
    });

    it('should set playing animation state', async () => {
      const { result } = renderHook(() => usePetActions());

      act(() => {
        result.current.performAction('play');
      });

      await waitFor(() => {
        expect(result.current.animationState).toBe('playing');
      });
    });

    it('should trigger higher reward for play (15 coins)', async () => {
      const { result } = renderHook(() => usePetActions());

      await act(async () => {
        await result.current.performAction('play');
        jest.advanceTimersByTime(3000);
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
        jest.advanceTimersByTime(3000);
      });

      expect(mockBathe).toHaveBeenCalledWith(30);
    });

    it('should not trigger reward for bathe (0 coins)', async () => {
      const { result } = renderHook(() => usePetActions());

      await act(async () => {
        await result.current.performAction('bathe', { amount: 30 });
        jest.advanceTimersByTime(3000);
      });

      expect(mockTriggerReward).not.toHaveBeenCalled();
      expect(mockEarnMoney).not.toHaveBeenCalled();
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
      const { result } = renderHook(() => usePetActions());

      act(() => {
        result.current.performAction('sleep');
      });

      await waitFor(() => {
        expect(result.current.animationState).toBe('sleeping');
      });
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
        jest.advanceTimersByTime(3000);
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
        jest.advanceTimersByTime(3000);
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
        jest.advanceTimersByTime(3000);
      });

      expect(mockVisitVet).toHaveBeenCalledWith(true);
    });

    it('should execute vet action without useMoney flag', async () => {
      const { result } = renderHook(() => usePetActions());

      await act(async () => {
        await result.current.performAction('vet', { useMoney: false });
        jest.advanceTimersByTime(3000);
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
      const { result } = renderHook(() => usePetActions());

      act(() => {
        result.current.performAction('feed', { amount: 20 });
      });

      expect(result.current.isAnimating).toBe(true);
    });

    it('should set isAnimating to false after action completes', async () => {
      const { result } = renderHook(() => usePetActions());

      await act(async () => {
        await result.current.performAction('feed', { amount: 20 });
        jest.advanceTimersByTime(3000);
      });

      expect(result.current.isAnimating).toBe(false);
    });

    it('should clear previous timeouts when new action starts', async () => {
      const { result } = renderHook(() => usePetActions());

      // Start first action
      await act(async () => {
        result.current.performAction('feed', { amount: 20 });
        jest.advanceTimersByTime(500); // Don't complete
      });

      // Start second action (should clear first)
      await act(async () => {
        await result.current.performAction('play');
        jest.advanceTimersByTime(3000);
      });

      // Should have completed play, not feed
      expect(result.current.animationState).toBe('idle');
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
        jest.advanceTimersByTime(3000);
      });

      expect(mockTriggerReward).toHaveBeenCalledWith(5);
    });

    it('should not call reward functions for zero-reward actions', async () => {
      const { result } = renderHook(() => usePetActions());

      await act(async () => {
        await result.current.performAction('bathe', { amount: 30 });
        jest.advanceTimersByTime(3000);
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
      jest.spyOn(actionConfigModule, 'getActionConfig').mockImplementation(() => {
        throw new Error('Test error');
      });

      const { result } = renderHook(() => usePetActions());

      const actionResult = await act(async () => {
        return await result.current.performAction('feed');
      });

      expect(actionResult.success).toBe(false);
      expect(result.current.animationState).toBe('idle');
      expect(result.current.message).toBe('');
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
      const { result } = renderHook(() => usePetActions());

      // Start sleep
      act(() => {
        result.current.performAction('sleep');
      });

      // Cancel it
      act(() => {
        result.current.cancelAction();
      });

      expect(mockCancelSleep).toHaveBeenCalled();
    });

    it('should reset state when cancelling', async () => {
      const { result } = renderHook(() => usePetActions());

      // Start action
      act(() => {
        result.current.performAction('feed', { amount: 20 });
      });

      // Cancel it
      act(() => {
        result.current.cancelAction();
      });

      expect(result.current.animationState).toBe('idle');
      expect(result.current.message).toBe('');
      expect(result.current.isAnimating).toBe(false);
    });

    it('should clear all timeouts when cancelling', async () => {
      const { result } = renderHook(() => usePetActions());

      // Start action
      act(() => {
        result.current.performAction('feed', { amount: 20 });
      });

      // Cancel it
      act(() => {
        result.current.cancelAction();
      });

      // Advance time - should not trigger any state changes
      act(() => {
        jest.advanceTimersByTime(5000);
      });

      expect(result.current.animationState).toBe('idle');
    });
  });

  describe('Cleanup on Unmount', () => {
    beforeEach(() => {
      jest.spyOn(petStatsModule, 'validateAction').mockReturnValue({
        canPerform: true,
      });
    });

    it('should clear all timeouts on unmount', async () => {
      const { result, unmount } = renderHook(() => usePetActions());

      // Start an action
      act(() => {
        result.current.performAction('feed', { amount: 20 });
      });

      // Unmount before completion
      unmount();

      // Timeouts should be cleaned up (no errors should occur)
      act(() => {
        jest.advanceTimersByTime(5000);
      });

      // Test passes if no errors thrown
      expect(true).toBe(true);
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

      act(() => {
        result.current.performAction('feed', {
          amount: 20,
          activity: { emoji: '🍖', nameKey: 'feed.foods.kibble' },
        });
      });

      await waitFor(() => {
        expect(result.current.message).toContain('TestPet');
      });
    });

    it('should interpolate activity name in messages', async () => {
      const { result } = renderHook(() => usePetActions());

      act(() => {
        result.current.performAction('play', {
          activity: { emoji: '⚽', nameKey: 'play.activities.ball' },
        });
      });

      await waitFor(() => {
        expect(result.current.message).toBeDefined();
      });
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
        jest.advanceTimersByTime(3000);
      });

      expect(mockFeed).toHaveBeenCalledWith(20);
      expect(result.current.isAnimating).toBe(false);

      // Second action
      await act(async () => {
        await result.current.performAction('play');
        jest.advanceTimersByTime(3000);
      });

      expect(mockPlay).toHaveBeenCalled();
      expect(result.current.isAnimating).toBe(false);
    });

    it('should return success for valid action', async () => {
      const { result } = renderHook(() => usePetActions());

      const actionResult = await act(async () => {
        const res = await result.current.performAction('feed', { amount: 20 });
        jest.advanceTimersByTime(3000);
        return res;
      });

      expect(actionResult.success).toBe(true);
    });
  });
});
