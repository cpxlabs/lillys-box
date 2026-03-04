/**
 * GameAdWrapper Component
 * Wraps game screens to manage ad display and timing
 */

import React, { ReactNode, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { GameAdEventType } from '../types/gameAds';
import { useGameAds } from '../hooks/useGameAds';
import { logger } from '../utils/logger';

interface GameAdWrapperProps {
  gameId: string;
  children: ReactNode;
  onGameStart?: () => void;
  onGameEnd?: () => void;
  maxAdsPerSession?: number;
  showLoadingOnAdStart?: boolean;
}

/**
 * GameAdWrapper provides:
 * 1. Game lifecycle tracking (start/end)
 * 2. Event hooks for ad placement
 * 3. Ad state management
 */
export const GameAdWrapper: React.FC<GameAdWrapperProps> = ({
  gameId,
  children,
  onGameStart,
  onGameEnd,
  maxAdsPerSession = 3,
  showLoadingOnAdStart = false,
}) => {
  const { resetSession } = useGameAds({ gameId, maxAdsPerSession });

  // Reset session metrics when game wrapper mounts
  useEffect(() => {
    logger.log(`[GameAdWrapper] Game session started for ${gameId}`);
    resetSession();

    onGameStart?.();

    return () => {
      logger.log(`[GameAdWrapper] Game session ended for ${gameId}`);
      onGameEnd?.();
    };
  }, [gameId, resetSession, onGameStart, onGameEnd]);

  return (
    <View style={{ flex: 1 }}>
      {children}
    </View>
  );
};

/**
 * Hook to trigger ads from within game components
 * Usage:
 *   const { triggerAd, adRewards } = useGameAdTrigger(gameId);
 *   // In game component:
 *   const reward = await triggerAd('game_ended', 100);
 */
export function useGameAdTrigger(gameId: string) {
  const { showRewardedAdForEvent, showInterstitialAdForEvent } = useGameAds({
    gameId,
  });

  const triggerAd = async (eventType: GameAdEventType, baseReward: number = 0) => {
    if (eventType === 'game_ended' || eventType === 'activity_completed') {
      // For high-value events, prefer rewarded ads
      const rewardEarned = await showRewardedAdForEvent(eventType, baseReward);
      return rewardEarned;
    } else if (
      eventType === 'level_complete' ||
      eventType === 'checkpoint_reached' ||
      eventType === 'game_started'
    ) {
      // For transition events, try interstitial
      await showInterstitialAdForEvent(eventType);
      return 0;
    } else {
      // Other events might use rewarded
      try {
        const rewardEarned = await showRewardedAdForEvent(eventType, baseReward);
        return rewardEarned;
      } catch {
        return 0;
      }
    }
  };

  const triggerRewardedAd = (eventType: GameAdEventType, baseReward: number = 0) =>
    showRewardedAdForEvent(eventType, baseReward);

  const triggerInterstitialAd = (eventType: GameAdEventType) =>
    showInterstitialAdForEvent(eventType);

  return {
    triggerAd,
    triggerRewardedAd,
    triggerInterstitialAd,
  };
}

/**
 * Loading overlay shown while ad is loading
 */
export const AdLoadingOverlay: React.FC<{ visible: boolean }> = ({ visible }) => {
  if (!visible) return null;

  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        zIndex: 1000,
      }}
    >
      <ActivityIndicator size="large" color="#fff" />
    </View>
  );
};
