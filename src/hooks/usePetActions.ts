/**
 * usePetActions Hook
 *
 * Unified hook for all pet actions that encapsulates:
 * - Animation state management
 * - Action validation
 * - Toast notifications
 * - Reward triggering
 * - Timeout cleanup
 *
 * This hook provides a consistent interface for all action scenes,
 * reducing code duplication and ensuring consistent behavior.
 *
 * @example
 * ```tsx
 * const { animationState, message, performAction } = usePetActions();
 *
 * const handleFeed = async (food: FoodItem) => {
 *   await performAction('feed', {
 *     amount: food.value,
 *     activity: { emoji: food.emoji, nameKey: food.nameKey }
 *   });
 * };
 * ```
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { usePet } from '../context/PetContext';
import { useToast } from '../context/ToastContext';
import { useDoubleReward } from './useDoubleReward';
import { AdsConfig } from '../config/ads.config';
import { AnimationState } from '../types';
import {
  ActionType,
  ActionAnimationSequence,
  getActionConfig,
  getRewardAmount,
  requiresDoubleReward as checkRequiresDoubleReward,
} from '../config/actionConfig';
import { validateAction } from '../utils/petStats';
import { logger } from '../utils/logger';

/**
 * Options that can be passed to performAction
 */
export type ActionOptions = {
  /** Custom amount for feed/bathe actions */
  amount?: number;
  /** Cost for feed action (coins deducted) */
  cost?: number;
  /** Activity details for feed/play (emoji, name for messages) */
  activity?: {
    emoji: string;
    nameKey: string;
  };
  /** Payment method for vet action */
  useMoney?: boolean;
  /** Custom duration for sleep action */
  duration?: number;
};

/**
 * Result returned by performAction
 */
export type ActionResult = {
  /** Whether the action was successful */
  success: boolean;
  /** For sleep: whether sleep completed (not cancelled) */
  completed?: boolean;
};

/**
 * Return type of usePetActions hook
 */
export type UsePetActionsReturn = {
  /** Current animation state */
  animationState: AnimationState;
  /** Current message to display */
  message: string;
  /** Whether an animation is currently playing */
  isAnimating: boolean;
  /** Perform an action with the given type and options */
  performAction: (type: ActionType, options?: ActionOptions) => Promise<ActionResult>;
  /** Cancel current action (mainly for sleep) */
  cancelAction: () => void;
  /** Double reward modal component (must be rendered in scene) */
  DoubleRewardModal: JSX.Element;
};

/**
 * usePetActions Hook
 *
 * @returns Object with animation state and action functions
 */
export function usePetActions(): UsePetActionsReturn {
  const { t } = useTranslation();
  const { pet, feed, play, bathe, sleep, cancelSleep, exercise, petCuddle, visitVet, earnMoney } = usePet();
  const { showToast } = useToast();
  const { triggerReward, DoubleRewardModal } = useDoubleReward({ earnMoney, showToast });

  // Animation state
  const [animationState, setAnimationState] = useState<AnimationState>('idle');
  const [message, setMessage] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  // Timeout management - store all active timeouts
  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);
  const currentActionRef = useRef<ActionType | null>(null);

  /**
   * Cleanup all active timeouts
   */
  const clearAllTimeouts = useCallback(() => {
    timeoutRefs.current.forEach(timeout => clearTimeout(timeout));
    timeoutRefs.current = [];
  }, []);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      clearAllTimeouts();
    };
  }, [clearAllTimeouts]);

  /**
   * Execute the context action based on type
   */
  const executeContextAction = useCallback((
    type: ActionType,
    options: ActionOptions
  ): void | Promise<{ completed: boolean }> => {
    switch (type) {
      case 'feed':
        feed(options.amount, options.cost);
        break;
      case 'play':
        play();
        break;
      case 'bathe':
        bathe(options.amount);
        break;
      case 'sleep':
        // Sleep returns a promise - handle specially
        return sleep(options.duration);
      case 'exercise':
        exercise();
        break;
      case 'cuddle':
        petCuddle();
        break;
      case 'vet':
        visitVet(options.useMoney);
        break;
      default:
        logger.error(`Unknown action type: ${type}`);
    }
  }, [feed, play, bathe, sleep, exercise, petCuddle, visitVet]);

  /**
   * Build message with variable interpolation
   */
  const buildMessage = useCallback((
    messageKey: string,
    messageVars: string[] | undefined,
    options: ActionOptions
  ): string => {
    if (!messageKey || !pet) return '';

    const vars: Record<string, string> = {
      name: pet.name,
    };

    // Add activity-specific variables
    if (messageVars?.includes('activity') && options.activity) {
      vars.activity = t(options.activity.nameKey);
    }

    // For feed, 'food' is same as 'activity'
    if (messageVars?.includes('food') && options.activity) {
      vars.food = t(options.activity.nameKey);
    }

    return t(messageKey, vars);
  }, [pet, t]);

  /**
   * Execute animation sequence
   */
  const executeAnimationSequence = useCallback(async (
    config: ActionAnimationSequence,
    options: ActionOptions,
    type: ActionType
  ): Promise<void> => {
    for (let i = 0; i < config.states.length; i++) {
      const step = config.states[i];

      // Set animation state
      setAnimationState(step.state);

      // Set message
      const msg = buildMessage(step.messageKey, step.messageVars, options);
      setMessage(msg);

      // Execute context action on first step (if configured)
      if (i === 0 && config.executeOnStart) {
        executeContextAction(type, options);
      }

      // Wait for animation duration
      if (step.duration > 0) {
        await new Promise<void>((resolve) => {
          const timeout = setTimeout(resolve, step.duration);
          timeoutRefs.current.push(timeout);
        });
      }
    }
  }, [buildMessage, executeContextAction]);

  /**
   * Handle reward triggering
   */
  const handleReward = useCallback((type: ActionType) => {
    const amount = getRewardAmount(type);

    if (amount <= 0) {
      return; // No reward for this action
    }

    const needsDoubleReward = checkRequiresDoubleReward(type);

    if (needsDoubleReward && AdsConfig.enabled && AdsConfig.rewards.activityDoubleReward) {
      // Show double reward modal
      triggerReward(amount);
    } else {
      // Give reward immediately
      earnMoney(amount);
      showToast(t('rewards.earned', { amount }), 'success');
    }
  }, [triggerReward, earnMoney, showToast, t]);

  /**
   * Perform an action
   *
   * @param type - Type of action to perform
   * @param options - Options for the action
   * @returns Promise with action result
   */
  const performAction = useCallback(async (
    type: ActionType,
    options: ActionOptions = {}
  ): Promise<ActionResult> => {
    if (!pet) {
      logger.warn('performAction: No pet exists');
      return { success: false };
    }

    // 1. Validate action
    const validation = validateAction(pet, type);
    if (!validation.canPerform) {
      if (validation.reason) {
        showToast(t(validation.reason, { name: pet.name }), 'info');
      }
      return { success: false };
    }

    // 2. Get animation config
    const config = getActionConfig(type);
    if (!config) {
      logger.error(`No animation config for action: ${type}`);
      return { success: false };
    }

    try {
      // 3. Clear existing timeouts
      clearAllTimeouts();
      currentActionRef.current = type;
      setIsAnimating(true);

      // 4. Handle sleep specially (async with cancellation)
      if (type === 'sleep') {
        setAnimationState('sleeping');
        setMessage(buildMessage('sleep.sleeping', ['name'], options));

        const result = await sleep(options.duration);

        setAnimationState('idle');
        setMessage('');
        setIsAnimating(false);
        currentActionRef.current = null;

        return { success: true, completed: result.completed };
      }

      // 5. Execute animation sequence
      await executeAnimationSequence(config, options, type);

      // 6. Trigger reward
      handleReward(type);

      // 7. Reset state
      setIsAnimating(false);
      currentActionRef.current = null;

      return { success: true };

    } catch (error) {
      logger.error(`Error performing action ${type}:`, error);

      // Reset state on error
      setAnimationState('idle');
      setMessage('');
      setIsAnimating(false);
      currentActionRef.current = null;

      return { success: false };
    }
  }, [
    pet,
    t,
    showToast,
    clearAllTimeouts,
    executeAnimationSequence,
    handleReward,
    sleep,
    buildMessage,
  ]);

  /**
   * Cancel current action (mainly for sleep)
   */
  const cancelAction = useCallback(() => {
    if (currentActionRef.current === 'sleep') {
      cancelSleep();
    }

    // Clear all timeouts
    clearAllTimeouts();

    // Reset state
    setAnimationState('idle');
    setMessage('');
    setIsAnimating(false);
    currentActionRef.current = null;
  }, [cancelSleep, clearAllTimeouts]);

  return {
    animationState,
    message,
    isAnimating,
    performAction,
    cancelAction,
    DoubleRewardModal,
  };
}
