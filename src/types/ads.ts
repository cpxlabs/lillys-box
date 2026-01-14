export interface AdReward {
  type: string;
  amount: number;
}

export interface PlatformAdUnit {
  android: string;
  ios: string;
}

export interface AdConfig {
  enabled: boolean;
  testMode: boolean;
  adUnits: {
    rewarded: PlatformAdUnit;
    interstitial: PlatformAdUnit;
    banner: PlatformAdUnit;
  };
  frequency: {
    interstitialMinMinutes: number;
    interstitialScreenCount: number;
  };
  rewards: {
    videoWatchBonus: number;
    activityDoubleReward: boolean;
    feedReward: number;
    bathReward: number;
    playReward: number;
  };
  coppa: {
    childDirected: boolean;
    underAgeConsent: boolean;
    maxContentRating: 'G' | 'PG' | 'T' | 'MA';
    nonPersonalizedOnly: boolean;
  };
}

export interface AdState {
  isRewardedAdReady: boolean;
  isInterstitialAdReady: boolean;
  lastInterstitialShown: number;
  sessionScreenCount: number;
}
