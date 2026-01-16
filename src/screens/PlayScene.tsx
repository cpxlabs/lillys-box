import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { usePet } from '../context/PetContext';
import { useToast } from '../context/ToastContext';
import { PetRenderer } from '../components/PetRenderer';
import { StatusCard } from '../components/StatusCard';
import { ScreenHeader } from '../components/ScreenHeader';
import { AnimationState } from '../types';
import { useNavigationList } from '../hooks/useNavigationList';
import { useBackButton } from '../hooks/useBackButton';
import { useDoubleReward } from '../hooks/useDoubleReward';
import { AdsConfig } from '../config/ads.config';
import { ScreenNavigationProp } from '../types/navigation';
import { ANIMATION_DURATION } from '../config/constants';
import { calculatePetAge } from '../utils/age';
import { useResponsive } from '../hooks/useResponsive';
import { ACTION_PET_SIZE, ACTION_BUTTON_SIZE, SCENE_TEXT_SIZE } from '../config/responsive';

type Props = {
  navigation: ScreenNavigationProp<'Play'>;
};

const PLAY_ACTIVITIES = [
  { id: 'yarn_ball', emoji: '🧶', name: 'Bola de lã' },
  { id: 'small_ball', emoji: '⚽', name: 'Bolinha' },
];

export const PlayScene: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { pet, play, earnMoney } = usePet();
  const { showToast } = useToast();
  const { triggerReward, DoubleRewardModal } = useDoubleReward({ earnMoney, showToast });
  const [animationState, setAnimationState] = useState<AnimationState>('idle');
  const [message, setMessage] = useState('');
  const BackButtonIcon = useBackButton();
  const { deviceType, spacing, fs } = useResponsive();

  const petSize = ACTION_PET_SIZE[deviceType];
  const buttonSizes = ACTION_BUTTON_SIZE[deviceType];
  const textSizes = SCENE_TEXT_SIZE[deviceType];

  const {
    currentItem: currentActivity,
    currentIndex,
    goToNext,
    goToPrevious,
    totalItems,
  } = useNavigationList(PLAY_ACTIVITIES);

  if (!pet) return null;

  const petAge = calculatePetAge(pet.createdAt);
  const petNameDisplay = `${pet.type === 'cat' ? '🐱' : '🐶'} ${pet.name}`;
  const petAgeDisplay = `${petAge} ${petAge === 1 ? t('common.year') : t('common.years')}`;

  const handlePlay = (activity: typeof PLAY_ACTIVITIES[0]) => {
    setAnimationState('happy');
    setMessage(`${pet.name} está brincando com ${activity.name}! 🎉`);

    play();

    // Base money earned for playing
    const moneyEarned = AdsConfig.rewards.playReward;

    setTimeout(() => {
      setMessage(`${pet.name} adorou brincar! 💕`);

      setTimeout(() => {
        setAnimationState('idle');
        setMessage('');

        // Offer double reward or give reward immediately
        triggerReward(moneyEarned);
      }, ANIMATION_DURATION.MEDIUM);
    }, ANIMATION_DURATION.MEDIUM);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title="🎮 Brincar"
        onBackPress={() => navigation.goBack()}
        BackButtonIcon={BackButtonIcon}
      />

      {/* Status Card */}
      <StatusCard
        pet={pet}
        petName={petNameDisplay}
        petAge={petAgeDisplay}
        compact
      />

      <View style={styles.petContainer}>
        <PetRenderer pet={pet} animationState={animationState} size={petSize} />
        {message ? <Text style={[styles.message, { fontSize: textSizes.messageSize }]}>{message}</Text> : null}
      </View>

      <View style={[styles.activitiesContainer, { padding: spacing(16), borderTopLeftRadius: spacing(20), borderTopRightRadius: spacing(20) }]}>
        <Text style={[styles.activitiesTitle, { fontSize: textSizes.titleSize, marginBottom: spacing(12) }]}>Escolha a atividade:</Text>

        {/* Navigation arrows and current activity display */}
        <View style={[styles.navigationContainer, { marginBottom: spacing(10) }]}>
          <TouchableOpacity
            style={[styles.arrowButton, { width: buttonSizes.arrowSize, height: buttonSizes.arrowSize, borderRadius: buttonSizes.arrowSize / 2, marginHorizontal: spacing(6) }]}
            onPress={goToPrevious}
            disabled={animationState !== 'idle'}
          >
            <Text style={[styles.arrowText, { fontSize: buttonSizes.arrowFontSize }]}>←</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.currentActivityButton, { minWidth: buttonSizes.itemWidth, padding: buttonSizes.itemPadding, borderRadius: spacing(16) }]}
            onPress={() => handlePlay(currentActivity)}
            disabled={animationState !== 'idle'}
          >
            <Text style={[styles.currentActivityEmoji, { fontSize: buttonSizes.itemEmoji, marginBottom: spacing(6) }]}>{currentActivity.emoji}</Text>
            <Text style={[styles.currentActivityName, { fontSize: buttonSizes.itemFont }]}>{currentActivity.name}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.arrowButton, { width: buttonSizes.arrowSize, height: buttonSizes.arrowSize, borderRadius: buttonSizes.arrowSize / 2, marginHorizontal: spacing(6) }]}
            onPress={goToNext}
            disabled={animationState !== 'idle'}
          >
            <Text style={[styles.arrowText, { fontSize: buttonSizes.arrowFontSize }]}>→</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.pageIndicator, { fontSize: fs(13), marginBottom: spacing(12) }]}>
          {currentIndex + 1} / {totalItems}
        </Text>
      </View>

      {/* Double Reward Modal */}
      {DoubleRewardModal}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e1f5fe',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  backButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    fontSize: 16,
    color: '#9b59b6',
    fontWeight: '600',
    marginLeft: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  petContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  activitiesContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  activitiesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  navigationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  arrowButton: {
    backgroundColor: '#b3e5fc',
    borderRadius: 30,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  arrowText: {
    fontSize: 28,
    color: '#0288d1',
    fontWeight: 'bold',
  },
  currentActivityButton: {
    backgroundColor: '#81d4fa',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    minWidth: 140,
    borderWidth: 3,
    borderColor: '#0288d1',
  },
  currentActivityEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  currentActivityName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  pageIndicator: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '600',
  },
});
