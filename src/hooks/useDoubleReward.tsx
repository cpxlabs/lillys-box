/**
 * useDoubleReward Hook
 *
 * Consolidates the double reward flow used across multiple activity screens.
 * Handles ad watching, reward distribution, and modal display for offering
 * users the option to watch an ad for double rewards.
 */

import { useState } from 'react';
import { ConfirmModal } from '../components/ConfirmModal';
import { useRewardedAd } from './useRewardedAd';
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
  const { showRewardedAd, isAdReady } = useRewardedAd();
  const [showDoubleRewardModal, setShowDoubleRewardModal] = useState(false);
  const [pendingReward, setPendingReward] = useState(0);

  /**
   * Trigger the reward flow
   * - If ads are enabled and ready, show the double reward modal
   * - Otherwise, give the reward immediately
   */
  const triggerReward = (amount: number) => {
    if (AdsConfig.enabled && AdsConfig.rewards.activityDoubleReward && isAdReady) {
      setPendingReward(amount);
      setShowDoubleRewardModal(true);
    } else {
      // Just give normal reward
      earnMoney(amount);
      showToast(`💰 +${amount} moedas ganhas!`, 'success');
    }
  };

  /**
   * Handle user choosing to watch an ad for double reward
   */
  const handleWatchAd = async () => {
    setShowDoubleRewardModal(false);

    await showRewardedAd(() => {
      // Double the reward
      const doubleReward = pendingReward * REWARD_MULTIPLIER.DOUBLE;
      earnMoney(doubleReward);
      showToast(`🎉 Recompensa em dobro! +${doubleReward} moedas!`, 'success');
      setPendingReward(0);
    });
  };

  /**
   * Handle user declining to watch an ad
   */
  const handleDeclineAd = () => {
    setShowDoubleRewardModal(false);
    // Give normal reward
    earnMoney(pendingReward);
    showToast(`💰 +${pendingReward} moedas ganhas!`, 'success');
    setPendingReward(0);
  };

  const DoubleRewardModal = (
    <ConfirmModal
      visible={showDoubleRewardModal}
      title="🎉 Ganhe o Dobro!"
      message={`Ótimo trabalho! Assista a um anúncio para ganhar ${
        pendingReward * REWARD_MULTIPLIER.DOUBLE
      } moedas em vez de ${pendingReward}?`}
      confirmText="Assistir Anúncio"
      cancelText="Não, Obrigado"
      onConfirm={handleWatchAd}
      onCancel={handleDeclineAd}
    />
  );

  return {
    triggerReward,
    DoubleRewardModal,
  };
};
