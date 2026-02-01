import { useState } from 'react';
import { useAd } from '../context/AdContext';
import { logger } from '../utils/logger';

/**
 * Custom hook to simplify rewarded ad usage in screens
 *
 * @returns Object with showRewardedAd function, isAdReady state, and isLoading state
 */
export const useRewardedAd = () => {
  const { isRewardedAdReady, showRewardedAd: showAd, loadRewardedAd } = useAd();
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Show a rewarded ad and execute the reward callback if successful
   * @param onReward - Callback to execute when user completes the ad
   */
  const showRewardedAd = async (onReward: () => void): Promise<void> => {
    setIsLoading(true);

    try {
      const success = await showAd(onReward);

      if (!success) {
        logger.log('[useRewardedAd] Ad was not completed or failed');
      }
    } catch (error) {
      logger.error('[useRewardedAd] Error showing rewarded ad:', error);
    } finally {
      setIsLoading(false);
      // Request to load next ad
      loadRewardedAd();
    }
  };

  return {
    showRewardedAd,
    isAdReady: isRewardedAdReady,
    isLoading,
  };
};
