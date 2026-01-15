import { Platform } from 'react-native';
import { AdsConfig } from '../config/ads.config';
import { logger } from '../utils/logger';

// Type definitions for AdMob (for TypeScript)
type MobileAdsType = any;
type MaxAdContentRatingType = any;
type RewardedAdType = any;
type RewardedAdEventTypeType = any;
type InterstitialAdType = any;
type AdEventTypeType = any;

// Lazy load AdMob module only on native platforms
let MobileAds: MobileAdsType;
let MaxAdContentRating: MaxAdContentRatingType;
let RewardedAd: RewardedAdType;
let RewardedAdEventType: RewardedAdEventTypeType;
let InterstitialAd: InterstitialAdType;
let AdEventType: AdEventTypeType;

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

/**
 * AdService - Centralized Ad Management Service
 * 
 * Handles initialization, loading, and displaying of AdMob ads
 * with COPPA compliance for child safety.
 * 
 * Note: Ads are only supported on native platforms (iOS/Android).
 * On web, all ad operations are no-ops.
 */
class AdService {
  private rewardedAd: any = null;
  private interstitialAd: any = null;
  private isRewardedAdLoaded = false;
  private isInterstitialAdLoaded = false;
  private isInitialized = false;

  /**
   * Initialize AdMob with COPPA compliance settings
   * Call this on app startup
   */
  async initializeAds(): Promise<void> {
    // Skip initialization on web
    if (Platform.OS === 'web' || !MobileAds) {
      logger.log('[AdService] Ads not supported on web platform');
      return;
    }

    if (this.isInitialized) {
      logger.log('[AdService] Already initialized');
      return;
    }

    try {
      logger.log('[AdService] Initializing AdMob...');
      
      await MobileAds().initialize();

      // Configure COPPA compliance settings
      await MobileAds().setRequestConfiguration({
        tagForChildDirectedTreatment: AdsConfig.coppa.childDirected,
        tagForUnderAgeOfConsent: AdsConfig.coppa.underAgeConsent,
        maxAdContentRating: MaxAdContentRating.G,
      });

      this.isInitialized = true;
      logger.log('[AdService] AdMob initialized successfully with COPPA compliance');

      // Preload ads
      this.loadRewardedAd();
      this.loadInterstitialAd();
    } catch (error) {
      logger.error('[AdService] Failed to initialize AdMob:', error);
      // Continue without ads - don't crash the app
    }
  }

  /**
   * Get the appropriate ad unit ID based on platform
   */
  private getAdUnitId(adType: 'rewarded' | 'interstitial' | 'banner'): string {
    const adUnit = AdsConfig.adUnits[adType];
    return Platform.OS === 'ios' ? adUnit.ios : adUnit.android;
  }

  /**
   * Load a rewarded video ad
   * Call this to preload an ad before showing it
   */
  loadRewardedAd(): void {
    if (Platform.OS === 'web' || !AdsConfig.enabled || !this.isInitialized || !RewardedAd) {
      return;
    }

    try {
      const adUnitId = this.getAdUnitId('rewarded');
      logger.log('[AdService] Loading rewarded ad:', adUnitId);

      this.rewardedAd = RewardedAd.createForAdRequest(adUnitId);

      // Set up event listeners
      this.rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
        this.isRewardedAdLoaded = true;
        logger.log('[AdService] Rewarded ad loaded');
      });

      this.rewardedAd.addAdEventListener(RewardedAdEventType.EARNED_REWARD, (reward: any) => {
        logger.log('[AdService] User earned reward:', reward);
      });

      this.rewardedAd.addAdEventListener(AdEventType.CLOSED, () => {
        logger.log('[AdService] Rewarded ad closed');
        this.isRewardedAdLoaded = false;
        // Preload next ad
        this.loadRewardedAd();
      });

      this.rewardedAd.addAdEventListener(AdEventType.ERROR, (error: any) => {
        logger.error('[AdService] Rewarded ad error:', error);
        this.isRewardedAdLoaded = false;
      });

      // Start loading the ad
      this.rewardedAd.load();
    } catch (error) {
      logger.error('[AdService] Error loading rewarded ad:', error);
      this.isRewardedAdLoaded = false;
    }
  }

  /**
   * Show a rewarded video ad
   * @param onRewarded - Callback function to call when user earns the reward
   * @returns Promise that resolves to true if reward was earned, false otherwise
   */
  async showRewardedAd(onRewarded: () => void): Promise<boolean> {
    if (Platform.OS === 'web' || !AdsConfig.enabled || !this.isInitialized) {
      logger.log('[AdService] Ads not available on this platform');
      return false;
    }

    if (!this.isRewardedAdLoaded || !this.rewardedAd) {
      logger.log('[AdService] Rewarded ad not ready yet');
      return false;
    }

    try {
      logger.log('[AdService] Showing rewarded ad');
      
      return new Promise((resolve) => {
        let rewardEarned = false;

        // Set up one-time reward listener
        const earnedRewardListener = this.rewardedAd!.addAdEventListener(
          RewardedAdEventType.EARNED_REWARD,
          () => {
            rewardEarned = true;
            onRewarded();
          }
        );

        // Set up one-time close listener
        const closedListener = this.rewardedAd!.addAdEventListener(
          AdEventType.CLOSED,
          () => {
            earnedRewardListener();
            closedListener();
            resolve(rewardEarned);
          }
        );

        this.rewardedAd!.show();
      });
    } catch (error) {
      logger.error('[AdService] Error showing rewarded ad:', error);
      return false;
    }
  }

  /**
   * Check if a rewarded ad is ready to be shown
   */
  isRewardedAdReady(): boolean {
    if (Platform.OS === 'web') return false;
    return this.isRewardedAdLoaded && this.rewardedAd !== null;
  }

  /**
   * Load an interstitial ad
   * Call this to preload an ad before showing it
   */
  loadInterstitialAd(): void {
    if (Platform.OS === 'web' || !AdsConfig.enabled || !this.isInitialized || !InterstitialAd) {
      return;
    }

    try {
      const adUnitId = this.getAdUnitId('interstitial');
      logger.log('[AdService] Loading interstitial ad:', adUnitId);

      this.interstitialAd = InterstitialAd.createForAdRequest(adUnitId);

      // Set up event listeners
      this.interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
        this.isInterstitialAdLoaded = true;
        logger.log('[AdService] Interstitial ad loaded');
      });

      this.interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
        logger.log('[AdService] Interstitial ad closed');
        this.isInterstitialAdLoaded = false;
        // Preload next ad
        this.loadInterstitialAd();
      });

      this.interstitialAd.addAdEventListener(AdEventType.ERROR, (error: any) => {
        logger.error('[AdService] Interstitial ad error:', error);
        this.isInterstitialAdLoaded = false;
      });

      // Start loading the ad
      this.interstitialAd.load();
    } catch (error) {
      logger.error('[AdService] Error loading interstitial ad:', error);
      this.isInterstitialAdLoaded = false;
    }
  }

  /**
   * Show an interstitial ad
   * @returns Promise that resolves when ad is shown or fails
   */
  async showInterstitialAd(): Promise<void> {
    if (Platform.OS === 'web' || !AdsConfig.enabled || !this.isInitialized) {
      return;
    }

    if (!this.isInterstitialAdLoaded || !this.interstitialAd) {
      logger.log('[AdService] Interstitial ad not ready yet');
      return;
    }

    try {
      logger.log('[AdService] Showing interstitial ad');
      await this.interstitialAd.show();
    } catch (error) {
      logger.error('[AdService] Error showing interstitial ad:', error);
    }
  }

  /**
   * Check if an interstitial ad is ready to be shown
   */
  isInterstitialAdReady(): boolean {
    if (Platform.OS === 'web') return false;
    return this.isInterstitialAdLoaded && this.interstitialAd !== null;
  }

  /**
   * Get banner ad unit ID for the current platform
   */
  getBannerAdUnitId(): string {
    return this.getAdUnitId('banner');
  }
}

// Export a singleton instance
export default new AdService();
