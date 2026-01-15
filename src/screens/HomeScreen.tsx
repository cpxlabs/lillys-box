import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { usePet } from '../context/PetContext';
import { useToast } from '../context/ToastContext';
import { PetRenderer } from '../components/PetRenderer';
import { StatusCard } from '../components/StatusCard';
import { IconButton } from '../components/IconButton';
import { ConfirmModal } from '../components/ConfirmModal';
import { BannerAd } from '../components/BannerAd';
import { RewardedAdButton } from '../components/RewardedAdButton';
import { calculatePetAge } from '../utils/age';
import { AdsConfig } from '../config/ads.config';
import { needsVet, hasWarningStats } from '../utils/petStats';
import { GAME_BALANCE } from '../config/gameBalance';
import { ScreenNavigationProp } from '../types/navigation';

type Props = {
  navigation: ScreenNavigationProp<'Home'>;
};

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { pet, earnMoney } = usePet();
  const { showToast } = useToast();
  const { t } = useTranslation();
  const [showMenuConfirm, setShowMenuConfirm] = useState(false);

  if (!pet) {
    return null;
  }

  const petAge = calculatePetAge(pet.createdAt);
  const vetStatus = needsVet(pet.health);
  const hasWarnings = hasWarningStats(pet);
  const canSleep = pet.energy < GAME_BALANCE.thresholds.energyForSleep;

  const petNameDisplay = `${pet.type === 'cat' ? '🐱' : '🐶'} ${pet.name}`;
  const petAgeDisplay = `${petAge} ${petAge === 1 ? t('common.year') : t('common.years')}`;

  const handleMenuPress = () => {
    setShowMenuConfirm(true);
  };

  const handleConfirmMenu = () => {
    setShowMenuConfirm(false);
    navigation.goBack();
  };

  const handleRewardedAdCompleted = () => {
    const bonusCoins = AdsConfig.rewards.videoWatchBonus;
    earnMoney(bonusCoins);
    showToast(t('home.bonusEarned', { amount: bonusCoins }), 'success');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Unified Status Card with Pet Name, Age, Money and Status Bars */}
      <StatusCard
        pet={pet}
        petName={petNameDisplay}
        petAge={petAgeDisplay}
      />
      {hasWarnings && (
        <Text style={styles.warningText}>
          {t('home.warningAttention')}
        </Text>
      )}

      {/* Rewarded Ad Button for Bonus Coins */}
      <View style={styles.rewardedAdContainer}>
        <RewardedAdButton
          rewardText={t('home.watchAndEarn', { amount: AdsConfig.rewards.videoWatchBonus })}
          onRewardEarned={handleRewardedAdCompleted}
        />
      </View>

      <View style={styles.petContainer}>
        <PetRenderer pet={pet} size={420} />
      </View>

      <View style={styles.actionsContainer}>
        <IconButton
          emoji="🍖"
          label={t('home.actions.feed')}
          onPress={() => navigation.navigate('Feed')}
        />
        <IconButton
          emoji="🛁"
          label={t('home.actions.bath')}
          onPress={() => navigation.navigate('Bath')}
        />
        <IconButton
          emoji="💤"
          label={t('home.actions.sleep')}
          onPress={() => navigation.navigate('Sleep')}
          disabled={!canSleep}
        />
        <IconButton
          emoji={vetStatus === 'urgent' ? '🚨' : '🏥'}
          label={vetStatus === 'urgent' ? t('home.actions.vet') : t('home.actions.veterinarian')}
          onPress={() => navigation.navigate('Vet')}
        />
        <IconButton
          emoji="👕"
          label={t('home.actions.clothes')}
          onPress={() => navigation.navigate('Wardrobe')}
        />
        <IconButton
          emoji="🎮"
          label={t('home.actions.play')}
          onPress={() => navigation.navigate('Play')}
        />
        <IconButton
          emoji="🖼️"
          label={t('home.actions.background')}
          onPress={() => navigation.navigate('Background')}
        />
        <IconButton
          emoji="🏠"
          label={t('home.actions.menu')}
          onPress={handleMenuPress}
        />
      </View>

      <ConfirmModal
        visible={showMenuConfirm}
        title={t('home.menuModal.title')}
        message={t('home.menuModal.message')}
        confirmText={t('home.menuModal.confirmText')}
        cancelText={t('home.menuModal.cancelText')}
        onConfirm={handleConfirmMenu}
        onCancel={() => setShowMenuConfirm(false)}
      />

      {/* Banner Ad at the Bottom */}
      <BannerAd />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8f5e9',
  },
  warningText: {
    textAlign: 'center',
    color: '#F44336',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    paddingHorizontal: 16,
  },
  rewardedAdContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  petContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    gap: 12,
    padding: 16,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
});
