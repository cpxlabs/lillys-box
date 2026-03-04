/**
 * useDoubleReward Hook
 *
 * Consolidates the double reward flow used across multiple activity screens.
 * Handles ad watching, reward distribution, and modal display for offering
 * users the option to watch an ad for double rewards.
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfirmModal } from '../components/ConfirmModal';
import { useGameAdTrigger } from '../components/GameAdWrapper';
import { AdsConfig } from '../config/ads.config';
import { REWARD_MULTIPLIER } from '../config/constants';

type UseDoubleRewardParams = {
  /** Function to add money to the user's balance */
  earnMoney: (amount: number) => void;
  /** Function to display a toast message */
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
};

type UseDoubleRewardReturn = {
  /** Trigger the reward flow - either shows modal or gives reward immediately */
  triggerReward: (amount: number) => void;
  /** Render the double reward modal */
  DoubleRewardModal: JSX.Element;
};

/**
 * Custom hook for managing double reward flow
 *
 * @example
 * ```tsx
 * const { triggerReward, DoubleRewardModal } = useDoubleReward({
 *   earnMoney,
 *   showToast,
 * });
 *
 * // After activity completion
 * triggerReward(10); // Offer double reward or give reward immediately
 *
 * // In JSX
 * return (
 *   <View>
 *     {DoubleRewardModal}
 *   </View>
 * );
 * ```
 */
export const useDoubleReward = ({
  earnMoney,
  showToast,
}: UseDoubleRewardParams): UseDoubleRewardReturn => {
  const { triggerAd } = useGameAdTrigger('pet-care-activity');
  const { t } = useTranslation();
  const [showDoubleRewardModal, setShowDoubleRewardModal] = useState(false);
  const [pendingReward, setPendingReward] = useState(0);

  /**
   * Trigger the reward flow
   * - If ads are enabled and ready, show the double reward modal
   * - Otherwise, give the reward immediately
   */
  const triggerReward = (amount: number) => {
    if (AdsConfig.enabled && AdsConfig.rewards.activityDoubleReward) {
      setPendingReward(amount);
      setShowDoubleRewardModal(true);
    } else {
      // Just give normal reward
      earnMoney(amount);
      showToast(t('rewards.earned', { amount }), 'success');
    }
  };

  /**
   * Handle user choosing to watch an ad for double reward
   */
  const handleWatchAd = async () => {
    setShowDoubleRewardModal(false);

    const reward = await triggerAd('activity_reward', pendingReward);
    if (reward > 0) {
      // Double the reward
      const doubleReward = pendingReward * REWARD_MULTIPLIER.DOUBLE;
      earnMoney(doubleReward);
      showToast(t('rewards.doubleEarned', { amount: doubleReward }), 'success');
    } else {
      // Ad was not watched or failed, give normal reward
      earnMoney(pendingReward);
      showToast(t('rewards.earned', { amount: pendingReward }), 'success');
    }
    setPendingReward(0);
  };

  /**
   * Handle user declining to watch an ad
   */
  const handleDeclineAd = () => {
    setShowDoubleRewardModal(false);
    // Give normal reward
    earnMoney(pendingReward);
    showToast(t('rewards.earned', { amount: pendingReward }), 'success');
    setPendingReward(0);
  };

  const DoubleRewardModal = (
    <ConfirmModal
      visible={showDoubleRewardModal}
      title={t('rewards.doubleReward.title')}
      message={t('rewards.doubleReward.message', {
        double: pendingReward * REWARD_MULTIPLIER.DOUBLE,
        normal: pendingReward,
      })}
      confirmText={t('rewards.doubleReward.watchAd')}
      cancelText={t('rewards.doubleReward.noThanks')}
      onConfirm={handleWatchAd}
      onCancel={handleDeclineAd}
    />
  );

  return {
    triggerReward,
    DoubleRewardModal,
  };
};
