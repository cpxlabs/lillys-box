/**
 * useGameAds Hook
 * Manages ad logic for individual games including tracking, frequency control, and reward calculation
 */

import { useCallback, useRef, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAd } from '../context/AdContext';
import {
  GameAdEvent,
  GameAdEventType,
  GameAdMetrics,
  AdPlacement,
} from '../types/gameAds';
import { getAdPlacementForEvent } from '../config/gameAdStrategies';
import { logger } from '../utils/logger';

const GAME_METRICS_KEY = (gameId: string) => `@lillys-box/game-ads-metrics/${gameId}`;

interface UseGameAdsOptions {
  gameId: string;
  maxAdsPerSession?: number;
}

export function useGameAds(options: UseGameAdsOptions) {
  const { gameId, maxAdsPerSession = 3 } = options;
  const { showRewardedAd, shouldShowInterstitial, showInterstitialAd } = useAd();

  // Metrics tracking
  const [metrics, setMetrics] = useState<GameAdMetrics>({
    gameId,
    totalAdsShown: 0,
    totalAdsCompleted: 0,
    completionRate: 0,
    totalRewardsFromAds: 0,
    lastAdShownTime: 0,
    sessionAdCount: 0,
  });

  // Session reference for current game session
  const sessionRef = useRef({
    adsShownInSession: 0,
    // eslint-disable-next-line react-hooks/purity -- Date.now() is intentional for session start time
    gameStart:  Date.now(),
  });

  /**
   * Load metrics from storage
   */
  const loadMetrics = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(GAME_METRICS_KEY(gameId));
      if (stored) {
        setMetrics(JSON.parse(stored));
      }
    } catch (error) {
      logger.error(`[useGameAds] Failed to load metrics for ${gameId}:`, error);
    }
  }, [gameId]);

  // Load metrics on mount
  useEffect(() => {
    loadMetrics();
  }, [gameId, loadMetrics]);

  /**
   * Save metrics to storage
   */
  const saveMetrics = useCallback(
    async (updatedMetrics: GameAdMetrics) => {
      try {
        await AsyncStorage.setItem(GAME_METRICS_KEY(gameId), JSON.stringify(updatedMetrics));
      } catch (error) {
        logger.error(`[useGameAds] Failed to save metrics for ${gameId}:`, error);
      }
    },
    [gameId]
  );

  /**
   * Update metrics with ad event
   */
  const logAdEvent = useCallback(
    (event: GameAdEvent) => {
      setMetrics((prev) => {
        const completed = event.userCompleted ? 1 : 0;
        const totalCompleted = prev.totalAdsCompleted + completed;
        const totalShown = prev.totalAdsShown + 1;

        const updated: GameAdMetrics = {
          ...prev,
          totalAdsShown: totalShown,
          totalAdsCompleted: totalCompleted,
          completionRate: totalShown > 0 ? totalCompleted / totalShown : 0,
          totalRewardsFromAds: prev.totalRewardsFromAds + (event.rewardAmount || 0),
          lastAdShownTime: event.timestamp,
        };

        saveMetrics(updated);
        return updated;
      });
    },
    [saveMetrics]
  );

  /**
   * Check if we should show an ad for the given event
   * Considers frequency limits, readiness, and optionality
   */
  const shouldShowAdForEvent = useCallback(
    (eventType: GameAdEventType): AdPlacement | null => {
      // Check session limit
      if (sessionRef.current.adsShownInSession >= maxAdsPerSession) {
        logger.log(
          `[useGameAds] Session ad limit reached (${maxAdsPerSession}) for ${gameId}`
        );
        return null;
      }

      // Get placement config for this event
      const placement = getAdPlacementForEvent(gameId, eventType);
      if (!placement) {
        return null; // No ad configured for this event
      }

      return placement;
    },
    [gameId, maxAdsPerSession]
  );

  /**
   * Show a rewarded ad for an event
   * Returns reward amount earned
   */
  const showRewardedAdForEvent = useCallback(
    async (
      eventType: GameAdEventType,
      baseRewardAmount: number = 0
    ): Promise<number> => {
      const placement = shouldShowAdForEvent(eventType);
      if (!placement || placement.adType !== 'rewarded') {
        return 0;
      }

      const rewardAmount = placement.rewardAmount || baseRewardAmount;

      logger.log(
        `[useGameAds] Showing rewarded ad for event: ${eventType} (reward: ${rewardAmount})`
      );

      const earnedReward = await showRewardedAd(() => {
        // Callback when user completes ad
        logger.log(`[useGameAds] User completed rewarded ad for ${eventType}`);
      });

      if (earnedReward) {
        sessionRef.current.adsShownInSession += 1;

        const event: GameAdEvent = {
          gameId,
          eventType,
          adType: 'rewarded',
          timestamp: Date.now(),
          userCompleted: true,
          rewardAmount,
          metadata: { placement: placement.id },
        };

        logAdEvent(event);
        return rewardAmount;
      }

      return 0;
    },
    [gameId, shouldShowAdForEvent, showRewardedAd, logAdEvent]
  );

  /**
   * Show an interstitial ad for an event
   */
  const showInterstitialAdForEvent = useCallback(
    async (eventType: GameAdEventType): Promise<boolean> => {
      const placement = shouldShowAdForEvent(eventType);
      if (!placement || placement.adType !== 'interstitial') {
        return false;
      }

      // Extra check for interstitial frequency
      if (!shouldShowInterstitial()) {
        logger.log(`[useGameAds] Interstitial frequency limit not met for ${eventType}`);
        return false;
      }

      logger.log(`[useGameAds] Showing interstitial ad for event: ${eventType}`);

      try {
        // Apply delay if configured
        if (placement.delayMs) {
          await new Promise((resolve) => setTimeout(resolve, placement.delayMs));
        }

        await showInterstitialAd();

        sessionRef.current.adsShownInSession += 1;

        const event: GameAdEvent = {
          gameId,
          eventType,
          adType: 'interstitial',
          timestamp: Date.now(),
          userCompleted: true,
          metadata: { placement: placement.id },
        };

        logAdEvent(event);
        return true;
      } catch (error) {
        logger.error(`[useGameAds] Error showing interstitial ad:`, error);
        return false;
      }
    },
    [gameId, shouldShowAdForEvent, shouldShowInterstitial, showInterstitialAd, logAdEvent]
  );

  /**
   * Reset session counters when starting a new game
   */
  const resetSession = useCallback(() => {
    sessionRef.current = {
      adsShownInSession: 0,
      gameStart: Date.now(),
    };
  }, []);

  /**
   * Get current session ad count
   */
  const getSessionAdCount = useCallback((): number => {
    return sessionRef.current.adsShownInSession;
  }, []);

  /**
   * Get metrics snapshot
   */
  const getMetrics = useCallback((): GameAdMetrics => {
    return {
      ...metrics,
      sessionAdCount: sessionRef.current.adsShownInSession,
    };
  }, [metrics]);

  return {
    // Event-based ad showing
    showRewardedAdForEvent,
    showInterstitialAdForEvent,
    shouldShowAdForEvent,

    // Session management
    resetSession,
    getSessionAdCount,

    // Metrics
    metrics: getMetrics(),
    logAdEvent,
  };
}
