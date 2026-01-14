// Mock module for react-native-google-mobile-ads on web platform
// This prevents build errors when bundling for web

const MaxAdContentRating = {
  G: 'G',
  PG: 'PG',
  T: 'T',
  MA: 'MA',
};

const AdEventType = {
  LOADED: 'loaded',
  ERROR: 'error',
  OPENED: 'opened',
  CLOSED: 'closed',
  CLICKED: 'clicked',
};

const RewardedAdEventType = {
  LOADED: 'loaded',
  EARNED_REWARD: 'earned_reward',
  ...AdEventType,
};

const BannerAdSize = {
  ANCHORED_ADAPTIVE_BANNER: 'ANCHORED_ADAPTIVE_BANNER',
  BANNER: 'BANNER',
  FULL_BANNER: 'FULL_BANNER',
  LARGE_BANNER: 'LARGE_BANNER',
  LEADERBOARD: 'LEADERBOARD',
  MEDIUM_RECTANGLE: 'MEDIUM_RECTANGLE',
};

// Mock classes
class RewardedAd {
  static createForAdRequest() {
    return new RewardedAd();
  }
  addAdEventListener() {
    return () => {}; // Return unsubscribe function
  }
  load() {}
  show() {
    return Promise.resolve();
  }
}

class InterstitialAd {
  static createForAdRequest() {
    return new InterstitialAd();
  }
  addAdEventListener() {
    return () => {}; // Return unsubscribe function
  }
  load() {}
  show() {
    return Promise.resolve();
  }
}

const BannerAd = () => null;

// Mock MobileAds singleton - should be a callable function that returns methods
const MobileAds = () => ({
  initialize: () => Promise.resolve(),
  setRequestConfiguration: () => Promise.resolve(),
});

export default MobileAds;
export {
  MaxAdContentRating,
  RewardedAd,
  RewardedAdEventType,
  InterstitialAd,
  AdEventType,
  BannerAd,
  BannerAdSize,
};
