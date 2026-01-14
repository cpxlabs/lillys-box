import { Platform } from 'react-native';
import MobileAds, {
  MaxAdContentRating,
  RewardedAd,
  RewardedAdEventType,
  InterstitialAd,
  AdEventType,
} from 'react-native-google-mobile-ads';
import { AdsConfig } from '../config/ads.config';

/**
 * AdService - Centralized Ad Management Service
 * 
 * Handles initialization, loading, and displaying of AdMob ads
 * with COPPA compliance for child safety.
 */
class AdService {
  private rewardedAd: RewardedAd | null = null;
  private interstitialAd: InterstitialAd | null = null;
  private isRewardedAdLoaded = false;
  private isInterstitialAdLoaded = false;
  private isInitialized = false;

  /**
   * Initialize AdMob with COPPA compliance settings
   * Call this on app startup
   */
  async initializeAds(): Promise<void> {
    if (this.isInitialized) {
      console.log('[AdService] Already initialized');
      return;
    }

    try {
      console.log('[AdService] Initializing AdMob...');
      
      await MobileAds().initialize();

      // Configure COPPA compliance settings
      await MobileAds().setRequestConfiguration({
        tagForChildDirectedTreatment: AdsConfig.coppa.childDirected,
        tagForUnderAgeOfConsent: AdsConfig.coppa.underAgeConsent,
        maxAdContentRating: MaxAdContentRating.G,
      });

      this.isInitialized = true;
      console.log('[AdService] AdMob initialized successfully with COPPA compliance');

      // Preload ads
      this.loadRewardedAd();
      this.loadInterstitialAd();
    } catch (error) {
      console.error('[AdService] Failed to initialize AdMob:', error);
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
    if (!AdsConfig.enabled || !this.isInitialized) {
      console.log('[AdService] Ads disabled or not initialized');
      return;
    }

    try {
      const adUnitId = this.getAdUnitId('rewarded');
      console.log('[AdService] Loading rewarded ad:', adUnitId);

      this.rewardedAd = RewardedAd.createForAdRequest(adUnitId);

      // Set up event listeners
      this.rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
        this.isRewardedAdLoaded = true;
        console.log('[AdService] Rewarded ad loaded');
      });

      this.rewardedAd.addAdEventListener(RewardedAdEventType.EARNED_REWARD, (reward) => {
        console.log('[AdService] User earned reward:', reward);
      });

      this.rewardedAd.addAdEventListener(AdEventType.CLOSED, () => {
        console.log('[AdService] Rewarded ad closed');
        this.isRewardedAdLoaded = false;
        // Preload next ad
        this.loadRewardedAd();
      });

      this.rewardedAd.addAdEventListener(AdEventType.ERROR, (error) => {
        console.error('[AdService] Rewarded ad error:', error);
        this.isRewardedAdLoaded = false;
      });

      // Start loading the ad
      this.rewardedAd.load();
    } catch (error) {
      console.error('[AdService] Error loading rewarded ad:', error);
      this.isRewardedAdLoaded = false;
    }
  }

  /**
   * Show a rewarded video ad
   * @param onRewarded - Callback function to call when user earns the reward
   * @returns Promise that resolves to true if reward was earned, false otherwise
   */
  async showRewardedAd(onRewarded: () => void): Promise<boolean> {
    if (!AdsConfig.enabled || !this.isInitialized) {
      console.log('[AdService] Ads disabled or not initialized');
      return false;
    }

    if (!this.isRewardedAdLoaded || !this.rewardedAd) {
      console.log('[AdService] Rewarded ad not ready yet');
      return false;
    }

    try {
      console.log('[AdService] Showing rewarded ad');
      
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
      console.error('[AdService] Error showing rewarded ad:', error);
      return false;
    }
  }

  /**
   * Check if a rewarded ad is ready to be shown
   */
  isRewardedAdReady(): boolean {
    return this.isRewardedAdLoaded && this.rewardedAd !== null;
  }

  /**
   * Load an interstitial ad
   * Call this to preload an ad before showing it
   */
  loadInterstitialAd(): void {
    if (!AdsConfig.enabled || !this.isInitialized) {
      console.log('[AdService] Ads disabled or not initialized');
      return;
    }

    try {
      const adUnitId = this.getAdUnitId('interstitial');
      console.log('[AdService] Loading interstitial ad:', adUnitId);

      this.interstitialAd = InterstitialAd.createForAdRequest(adUnitId);

      // Set up event listeners
      this.interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
        this.isInterstitialAdLoaded = true;
        console.log('[AdService] Interstitial ad loaded');
      });

      this.interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
        console.log('[AdService] Interstitial ad closed');
        this.isInterstitialAdLoaded = false;
        // Preload next ad
        this.loadInterstitialAd();
      });

      this.interstitialAd.addAdEventListener(AdEventType.ERROR, (error) => {
        console.error('[AdService] Interstitial ad error:', error);
        this.isInterstitialAdLoaded = false;
      });

      // Start loading the ad
      this.interstitialAd.load();
    } catch (error) {
      console.error('[AdService] Error loading interstitial ad:', error);
      this.isInterstitialAdLoaded = false;
    }
  }

  /**
   * Show an interstitial ad
   * @returns Promise that resolves when ad is shown or fails
   */
  async showInterstitialAd(): Promise<void> {
    if (!AdsConfig.enabled || !this.isInitialized) {
      console.log('[AdService] Ads disabled or not initialized');
      return;
    }

    if (!this.isInterstitialAdLoaded || !this.interstitialAd) {
      console.log('[AdService] Interstitial ad not ready yet');
      return;
    }

    try {
      console.log('[AdService] Showing interstitial ad');
      await this.interstitialAd.show();
    } catch (error) {
      console.error('[AdService] Error showing interstitial ad:', error);
    }
  }

  /**
   * Check if an interstitial ad is ready to be shown
   */
  isInterstitialAdReady(): boolean {
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
