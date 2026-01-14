import React, { useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import AdService from '../services/AdService';
import { AdsConfig } from '../config/ads.config';

// Conditionally import AdMob components only on native platforms
let GoogleBannerAd: any;
let BannerAdSize: any;

if (Platform.OS !== 'web') {
  try {
    const AdMobModule = require('react-native-google-mobile-ads');
    GoogleBannerAd = AdMobModule.BannerAd;
    BannerAdSize = AdMobModule.BannerAdSize;
  } catch (error) {
    console.warn('[BannerAd] AdMob module not available:', error);
  }
}

/**
 * BannerAd Component
 * 
 * Displays an adaptive banner ad at the bottom of the screen
 * with child-safe COPPA-compliant settings.
 * 
 * Automatically hides if the ad fails to load.
 * Not supported on web platform.
 */
export const BannerAd: React.FC = () => {
  const [isAdLoaded, setIsAdLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Don't render if ads are disabled or on web
  if (!AdsConfig.enabled || Platform.OS === 'web' || !GoogleBannerAd) {
    return null;
  }

  // Don't render if there was an error loading the ad
  if (hasError) {
    return null;
  }

  const adUnitId = AdService.getBannerAdUnitId();

  return (
    <View style={[styles.container, !isAdLoaded && styles.hidden]}>
      <GoogleBannerAd
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        onAdLoaded={() => {
          console.log('[BannerAd] Ad loaded successfully');
          setIsAdLoaded(true);
          setHasError(false);
        }}
        onAdFailedToLoad={(error: any) => {
          console.error('[BannerAd] Ad failed to load:', error);
          setHasError(true);
          setIsAdLoaded(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  hidden: {
    display: 'none',
  },
});
