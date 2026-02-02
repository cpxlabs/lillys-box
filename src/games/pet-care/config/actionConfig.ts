/**
 * Action Configuration
 *
 * Centralized configuration for all pet actions including:
 * - Animation sequences
 * - Message keys for i18n
 * - Reward amounts
 * - Double reward settings
 *
 * This configuration is used by the usePetActions hook to provide
 * consistent behavior across all action scenes.
 */

import { ANIMATION_DURATION } from './constants';
import { AnimationState } from '../types/types';

export type ActionType = 'feed' | 'play' | 'bathe' | 'sleep' | 'exercise' | 'cuddle' | 'vet';

/**
 * Single step in an animation sequence
 */
export type AnimationStep = {
  /** The animation state to display */
  state: AnimationState;
  /** How long to display this state (0 = instant) */
  duration: number;
  /** i18n key for the message to display (empty = no message) */
  messageKey: string;
  /** Variables needed for message interpolation */
  messageVars?: string[]; // e.g., ['name', 'activity']
};

/**
 * Complete animation sequence for an action
 */
export type ActionAnimationSequence = {
  /** Ordered list of animation steps */
  states: AnimationStep[];
  /** Base reward amount in coins */
  rewardAmount: number;
  /** Whether this action offers double rewards via ads */
  requiresDoubleReward: boolean;
  /** Whether to execute the context action on the first frame */
  executeOnStart: boolean;
};

/**
 * Centralized action animation configurations
 *
 * Each action defines:
 * 1. Animation sequence (states, durations, messages)
 * 2. Reward configuration
 * 3. Execution timing
 */
export const ACTION_ANIMATIONS: Record<ActionType, ActionAnimationSequence> = {
  /**
   * Feed Action
   * Sequence: eating (1.5s) → happy (1.5s) → idle
   * Reward: 5 coins (10 with ad)
   */
  feed: {
    states: [
      {
        state: 'eating',
        duration: ANIMATION_DURATION.MEDIUM,
        messageKey: 'feed.eating',
        messageVars: ['name', 'food'],
      },
      {
        state: 'happy',
        duration: ANIMATION_DURATION.MEDIUM,
        messageKey: 'feed.loved',
        messageVars: ['name'],
      },
      {
        state: 'idle',
        duration: 0,
        messageKey: '',
      },
    ],
    rewardAmount: 5,
    requiresDoubleReward: true,
    executeOnStart: true, // Execute feed() when animation starts
  },

  /**
   * Play Action
   * Sequence: playing (1.5s) → happy (1.5s) → idle
   * Reward: 15 coins (30 with ad)
   */
  play: {
    states: [
      {
        state: 'playing',
        duration: ANIMATION_DURATION.MEDIUM,
        messageKey: 'play.playing',
        messageVars: ['name', 'activity'],
      },
      {
        state: 'happy',
        duration: ANIMATION_DURATION.MEDIUM,
        messageKey: 'play.loved',
        messageVars: ['name'],
      },
      {
        state: 'idle',
        duration: 0,
        messageKey: '',
      },
    ],
    rewardAmount: 15,
    requiresDoubleReward: true,
    executeOnStart: true,
  },

  /**
   * Bathe Action
   * Sequence: bathing (1.5s) → happy (1.5s) → idle
   * Reward: 8 coins (16 with ad)
   */
  bathe: {
    states: [
      {
        state: 'bathing',
        duration: ANIMATION_DURATION.MEDIUM,
        messageKey: 'bathe.bathing',
        messageVars: ['name'],
      },
      {
        state: 'happy',
        duration: ANIMATION_DURATION.MEDIUM,
        messageKey: 'bathe.clean',
        messageVars: ['name'],
      },
      {
        state: 'idle',
        duration: 0,
        messageKey: '',
      },
    ],
    rewardAmount: 8,
    requiresDoubleReward: true,
    executeOnStart: true,
  },

  /**
   * Sleep Action
   * Special: Async operation with cancellation support
   * Sequence: sleeping (variable duration) → idle
   * Reward: None
   */
  sleep: {
    states: [
      {
        state: 'sleeping',
        duration: 0, // Duration handled by sleep() function
        messageKey: 'sleep.sleeping',
        messageVars: ['name'],
      },
      {
        state: 'idle',
        duration: 0,
        messageKey: '',
      },
    ],
    rewardAmount: 0,
    requiresDoubleReward: false,
    executeOnStart: false, // Sleep is handled specially
  },

  /**
   * Exercise Action
   * Sequence: playing (1.5s) → happy (1.5s) → idle
   * Note: Reuses 'playing' animation state
   * Reward: 10 coins (20 with ad)
   */
  exercise: {
    states: [
      {
        state: 'playing',
        duration: ANIMATION_DURATION.MEDIUM,
        messageKey: 'exercise.exercising',
        messageVars: ['name'],
      },
      {
        state: 'happy',
        duration: ANIMATION_DURATION.MEDIUM,
        messageKey: 'exercise.energized',
        messageVars: ['name'],
      },
      {
        state: 'idle',
        duration: 0,
        messageKey: '',
      },
    ],
    rewardAmount: 10,
    requiresDoubleReward: true,
    executeOnStart: true,
  },

  /**
   * Cuddle Action
   * Sequence: happy (1.5s) → idle
   * Reward: None (small happiness boost)
   */
  cuddle: {
    states: [
      {
        state: 'happy',
        duration: ANIMATION_DURATION.MEDIUM,
        messageKey: 'cuddle.cuddling',
        messageVars: ['name'],
      },
      {
        state: 'idle',
        duration: 0,
        messageKey: '',
      },
    ],
    rewardAmount: 0,
    requiresDoubleReward: false,
    executeOnStart: true,
  },

  /**
   * Vet Action
   * Sequence: sick (1s) → idle
   * Reward: None (costs money instead)
   */
  vet: {
    states: [
      {
        state: 'sick',
        duration: ANIMATION_DURATION.SHORT,
        messageKey: 'vet.treating',
        messageVars: ['name'],
      },
      {
        state: 'idle',
        duration: 0,
        messageKey: '',
      },
    ],
    rewardAmount: 0,
    requiresDoubleReward: false,
    executeOnStart: true,
  },
};

/**
 * Helper function to get animation config for an action
 *
 * @param actionType - The type of action
 * @returns Animation configuration or undefined if not found
 */
export function getActionConfig(actionType: ActionType): ActionAnimationSequence | undefined {
  return ACTION_ANIMATIONS[actionType];
}

/**
 * Helper function to get all action types
 *
 * @returns Array of all valid action types
 */
export function getAllActionTypes(): ActionType[] {
  return Object.keys(ACTION_ANIMATIONS) as ActionType[];
}

/**
 * Helper function to check if an action requires double reward
 *
 * @param actionType - The type of action
 * @returns Whether the action offers double rewards
 */
export function requiresDoubleReward(actionType: ActionType): boolean {
  const config = ACTION_ANIMATIONS[actionType];
  return config?.requiresDoubleReward ?? false;
}

/**
 * Helper function to get reward amount for an action
 *
 * @param actionType - The type of action
 * @returns Base reward amount in coins
 */
export function getRewardAmount(actionType: ActionType): number {
  const config = ACTION_ANIMATIONS[actionType];
  return config?.rewardAmount ?? 0;
}
