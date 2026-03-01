import { AdConfig } from '../types/ads';

// ── Google-provided test ad unit IDs ─────────────────────────────────────────
// These IDs are safe to ship in source control; never show real ads.
const TEST_IDS = {
  rewarded: {
    android: 'ca-app-pub-3940256099942544/5224354917',
    ios: 'ca-app-pub-3940256099942544/1712485313',
  },
  interstitial: {
    android: 'ca-app-pub-3940256099942544/1033173712',
    ios: 'ca-app-pub-3940256099942544/4411468910',
  },
  banner: {
    android: 'ca-app-pub-3940256099942544/6300978111',
    ios: 'ca-app-pub-3940256099942544/2934735716',
  },
} as const;

// Set EXPO_PUBLIC_ADS_TEST_MODE=false in production .env to enable real ads.
const testMode = process.env.EXPO_PUBLIC_ADS_TEST_MODE !== 'false';

const adUnits = {
  rewarded: {
    android: process.env.EXPO_PUBLIC_ADMOB_REWARDED_ANDROID_ID ?? TEST_IDS.rewarded.android,
    ios: process.env.EXPO_PUBLIC_ADMOB_REWARDED_IOS_ID ?? TEST_IDS.rewarded.ios,
  },
  interstitial: {
    android:
      process.env.EXPO_PUBLIC_ADMOB_INTERSTITIAL_ANDROID_ID ?? TEST_IDS.interstitial.android,
    ios: process.env.EXPO_PUBLIC_ADMOB_INTERSTITIAL_IOS_ID ?? TEST_IDS.interstitial.ios,
  },
  banner: {
    android: process.env.EXPO_PUBLIC_ADMOB_BANNER_ANDROID_ID ?? TEST_IDS.banner.android,
    ios: process.env.EXPO_PUBLIC_ADMOB_BANNER_IOS_ID ?? TEST_IDS.banner.ios,
  },
};

// ── Startup assertion ─────────────────────────────────────────────────────────
// Reject builds where testMode is disabled but Google test IDs are still in use.
if (!testMode) {
  const googleTestIdSet = new Set<string>([
    ...Object.values(TEST_IDS.rewarded),
    ...Object.values(TEST_IDS.interstitial),
    ...Object.values(TEST_IDS.banner),
  ]);
  const allConfiguredIds = [
    adUnits.rewarded.android,
    adUnits.rewarded.ios,
    adUnits.interstitial.android,
    adUnits.interstitial.ios,
    adUnits.banner.android,
    adUnits.banner.ios,
  ];
  const foundTestIds = allConfiguredIds.filter((id) => googleTestIdSet.has(id));
  if (foundTestIds.length > 0) {
    throw new Error(
      '[AdsConfig] Production build detected Google test AdMob IDs. ' +
        'Set EXPO_PUBLIC_ADMOB_* env vars with real ad unit IDs, ' +
        'or set EXPO_PUBLIC_ADS_TEST_MODE=true to suppress this error.',
    );
  }
}

/**
 * AdMob Configuration
 *
 * Ad unit IDs are read from environment variables so real IDs never appear in
 * source control.  Set the following in your .env.production file:
 *
 *   EXPO_PUBLIC_ADS_TEST_MODE=false
 *   EXPO_PUBLIC_ADMOB_REWARDED_ANDROID_ID=ca-app-pub-XXXX/YYYY
 *   EXPO_PUBLIC_ADMOB_REWARDED_IOS_ID=ca-app-pub-XXXX/YYYY
 *   EXPO_PUBLIC_ADMOB_INTERSTITIAL_ANDROID_ID=ca-app-pub-XXXX/YYYY
 *   EXPO_PUBLIC_ADMOB_INTERSTITIAL_IOS_ID=ca-app-pub-XXXX/YYYY
 *   EXPO_PUBLIC_ADMOB_BANNER_ANDROID_ID=ca-app-pub-XXXX/YYYY
 *   EXPO_PUBLIC_ADMOB_BANNER_IOS_ID=ca-app-pub-XXXX/YYYY
 */
export const AdsConfig: AdConfig = {
  enabled: true,
  testMode,

  adUnits,

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
