import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AdService from '../services/AdService';
import { AdsConfig } from '../config/ads.config';
import { AdState } from '../types/ads';
import { logger } from '../utils/logger';

const LAST_INTERSTITIAL_KEY = '@pet-care-game/last-interstitial';

type AdContextType = {
  isRewardedAdReady: boolean;
  isInterstitialAdReady: boolean;
  loadRewardedAd: () => void;
  showRewardedAd: (onReward: () => void) => Promise<boolean>;
  shouldShowInterstitial: () => boolean;
  incrementScreenCount: () => void;
  showInterstitialAd: () => Promise<void>;
  preloadAdsForGameSession: () => void;
  resetAdsAfterGameSession: () => void;
};

const AdContext = createContext<AdContextType | undefined>(undefined);

export const AdProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [adState, setAdState] = useState<AdState>({
    isRewardedAdReady: false,
    isInterstitialAdReady: false,
    lastInterstitialShown: 0,
    sessionScreenCount: 0,
  });

  // Load last interstitial timestamp from storage
  useEffect(() => {
    const loadLastInterstitialTime = async () => {
      try {
        const stored = await AsyncStorage.getItem(LAST_INTERSTITIAL_KEY);
        if (stored) {
          setAdState((prev) => ({
            ...prev,
            lastInterstitialShown: parseInt(stored, 10),
          }));
        }
      } catch (error) {
        logger.error('[AdContext] Failed to load last interstitial time:', error);
      }
    };
    loadLastInterstitialTime();
  }, []);

  // Check ad readiness periodically (every 3 seconds to reduce overhead)
  useEffect(() => {
    const interval = setInterval(() => {
      setAdState((prev) => ({
        ...prev,
        isRewardedAdReady: AdService.isRewardedAdReady(),
        isInterstitialAdReady: AdService.isInterstitialAdReady(),
      }));
    }, 3000); // Check every 3 seconds instead of 1 second

    return () => clearInterval(interval);
  }, []);

  /**
   * Request loading a rewarded ad
   */
  const loadRewardedAd = () => {
    AdService.loadRewardedAd();
  };

  /**
   * Show a rewarded ad and call the reward callback if user completes it
   */
  const showRewardedAd = async (onReward: () => void): Promise<boolean> => {
    const success = await AdService.showRewardedAd(onReward);

    // Update ready state after showing
    setAdState((prev) => ({
      ...prev,
      isRewardedAdReady: AdService.isRewardedAdReady(),
    }));

    return success;
  };

  /**
   * Check if an interstitial ad should be shown based on frequency rules
   * Rules:
   * - At least 5 minutes since last interstitial
   * - At least 4 screen transitions since last interstitial
   */
  const shouldShowInterstitial = (): boolean => {
    if (!AdsConfig.enabled) {
      return false;
    }

    const now = Date.now();
    const timeSinceLastAd = now - adState.lastInterstitialShown;
    const minTimeMs = AdsConfig.frequency.interstitialMinMinutes * 60 * 1000;

    // Check time requirement
    if (timeSinceLastAd < minTimeMs) {
      logger.log('[AdContext] Not enough time since last interstitial');
      return false;
    }

    // Check screen count requirement
    if (adState.sessionScreenCount < AdsConfig.frequency.interstitialScreenCount) {
      logger.log('[AdContext] Not enough screen transitions');
      return false;
    }

    // Check if ad is ready
    if (!adState.isInterstitialAdReady) {
      logger.log('[AdContext] Interstitial ad not ready');
      return false;
    }

    return true;
  };

  /**
   * Increment the screen transition counter
   */
  const incrementScreenCount = () => {
    setAdState((prev) => ({
      ...prev,
      sessionScreenCount: prev.sessionScreenCount + 1,
    }));
  };

  /**
   * Show an interstitial ad and reset counters
   */
  const showInterstitialAd = async (): Promise<void> => {
    await AdService.showInterstitialAd();

    const now = Date.now();

    // Update state and persist
    setAdState((prev) => ({
      ...prev,
      lastInterstitialShown: now,
      sessionScreenCount: 0,
      isInterstitialAdReady: AdService.isInterstitialAdReady(),
    }));

    // Persist to storage
    try {
      await AsyncStorage.setItem(LAST_INTERSTITIAL_KEY, now.toString());
    } catch (error) {
      logger.error('[AdContext] Failed to save last interstitial time:', error);
    }
  };

  /**
   * Preload ads for a game session
   */
  const preloadAdsForGameSession = () => {
    logger.log('[AdContext] Preloading ads for game session');
    AdService.preloadRewardedAdForGame();
    AdService.preloadInterstitialAdForGame();
  };

  /**
   * Reset ads after a game session ends
   */
  const resetAdsAfterGameSession = () => {
    logger.log('[AdContext] Resetting ads after game session');
    AdService.resetAdsAfterGameSession();
    
    // Also reset screen count for interstitial frequency
    setAdState((prev) => ({
      ...prev,
      sessionScreenCount: 0,
    }));
  };

  return (
    <AdContext.Provider
      value={{
        isRewardedAdReady: adState.isRewardedAdReady,
        isInterstitialAdReady: adState.isInterstitialAdReady,
        loadRewardedAd,
        showRewardedAd,
        shouldShowInterstitial,
        incrementScreenCount,
        showInterstitialAd,
        preloadAdsForGameSession,
        resetAdsAfterGameSession,
      }}
    >
      {children}
    </AdContext.Provider>
  );
};

export const useAd = (): AdContextType => {
  const context = useContext(AdContext);
  if (!context) {
    throw new Error('useAd must be used within AdProvider');
  }
  return context;
};
