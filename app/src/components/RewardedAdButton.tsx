import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRewardedAd } from '../hooks/useRewardedAd';

type Props = {
  rewardText: string;
  onRewardEarned: () => void;
  disabled?: boolean;
  style?: ViewStyle;
};

/**
 * RewardedAdButton Component
 *
 * Displays an attractive button for watching rewarded video ads.
 * Shows loading state and disables when no ad is available.
 *
 * Props:
 * - rewardText: Display text (e.g., "Watch for +50 coins!")
 * - onRewardEarned: Callback when user completes the ad
 * - disabled: Optional disable state
 * - style: Optional custom styling
 */
export const RewardedAdButton: React.FC<Props> = ({
  rewardText,
  onRewardEarned,
  disabled = false,
  style,
}) => {
  const { showRewardedAd, isAdReady, isLoading } = useRewardedAd();
  const { t } = useTranslation();

  const handlePress = async () => {
    await showRewardedAd(onRewardEarned);
  };

  const isDisabled = disabled || !isAdReady || isLoading;

  return (
    <TouchableOpacity
      style={[styles.button, isDisabled && styles.buttonDisabled, style]}
      onPress={handlePress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <Text style={styles.icon}>📺</Text>
        <View style={styles.textContainer}>
          <Text style={[styles.text, isDisabled && styles.textDisabled]}>
            {isLoading ? t('common.loading') : rewardText}
          </Text>
          {!isAdReady && !isLoading && <Text style={styles.subtitle}>{t('ads.notAvailable')}</Text>}
        </View>
        {isLoading && <ActivityIndicator color="#fff" style={styles.loader} />}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FF6B6B',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    minHeight: 70,
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#CCCCCC',
    shadowColor: '#999',
    shadowOpacity: 0.2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 32,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  text: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  textDisabled: {
    color: '#888',
  },
  subtitle: {
    color: '#fff',
    fontSize: 12,
    marginTop: 2,
    opacity: 0.8,
  },
  loader: {
    marginLeft: 8,
  },
});
