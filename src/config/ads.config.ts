import { AdConfig } from '../types/ads';

/**
 * AdMob Configuration
 * 
 * IMPORTANT: These are TEST ad unit IDs. 
 * For production, replace with your real AdMob ad unit IDs from https://admob.google.com
 * and set testMode to false.
 */
export const AdsConfig: AdConfig = {
  enabled: true,
  testMode: true, // Set to false for production

  adUnits: {
    // Rewarded video ad unit IDs
    rewarded: {
      android: 'ca-app-pub-3940256099942544/5224354917', // TEST ID - Replace with production ID
      ios: 'ca-app-pub-3940256099942544/1712485313', // TEST ID - Replace with production ID
    },
    // Interstitial ad unit IDs
    interstitial: {
      android: 'ca-app-pub-3940256099942544/1033173712', // TEST ID - Replace with production ID
      ios: 'ca-app-pub-3940256099942544/4411468910', // TEST ID - Replace with production ID
    },
    // Banner ad unit IDs
    banner: {
      android: 'ca-app-pub-3940256099942544/6300978111', // TEST ID - Replace with production ID
      ios: 'ca-app-pub-3940256099942544/2934735716', // TEST ID - Replace with production ID
    },
  },

  // Frequency control for interstitial ads
  frequency: {
    interstitialMinMinutes: 5, // Minimum time between interstitials (in minutes)
    interstitialScreenCount: 4, // Show interstitial every N screen transitions
  },

  // Reward amounts
  rewards: {
    videoWatchBonus: 50, // Coins earned for watching a rewarded video ad
    activityDoubleReward: true, // Enable double rewards after activities
    feedReward: 5, // Base coins for feeding pet
    bathReward: 8, // Base coins for bathing pet
    playReward: 15, // Base coins for playing with pet (increased from 10, consolidated from dual system)
  },

  // COPPA compliance settings for child safety
  coppa: {
    childDirected: true, // Mark all ads as child-directed
    underAgeConsent: true, // User is under age of consent
    maxContentRating: 'G', // Only show G-rated content
    nonPersonalizedOnly: true, // Block personalized ads
  },
};
