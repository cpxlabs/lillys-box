import React, { useState, useRef, useEffect } from 'react';
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
import { logger } from '../utils/logger';

type Props = {
  navigation: ScreenNavigationProp<'Feed'>;
};

const FOODS = [
  { id: 'kibble', emoji: '🍖', nameKey: 'feed.foods.kibble', value: 20 },
  { id: 'fish', emoji: '🐟', nameKey: 'feed.foods.fish', value: 25 },
  { id: 'treat', emoji: '🦴', nameKey: 'feed.foods.treat', value: 15 },
  { id: 'milk', emoji: '🥛', nameKey: 'feed.foods.milk', value: 10 },
];

export const FeedScene: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { pet, feed, earnMoney } = usePet();
  const { showToast } = useToast();
  const { triggerReward, DoubleRewardModal } = useDoubleReward({ earnMoney, showToast });
  const [animationState, setAnimationState] = useState<AnimationState>('idle');
  const [message, setMessage] = useState('');
  const BackButtonIcon = useBackButton();

  // Refs for timeout cleanup to prevent UI freezing
  const animationTimeout1 = useRef<NodeJS.Timeout | null>(null);
  const animationTimeout2 = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timeouts on unmount to prevent memory leaks and state updates on unmounted component
  useEffect(() => {
    return () => {
      if (animationTimeout1.current) {
        clearTimeout(animationTimeout1.current);
      }
      if (animationTimeout2.current) {
        clearTimeout(animationTimeout2.current);
      }
    };
  }, []);

  const {
    currentItem: currentFood,
    currentIndex,
    goToNext,
    goToPrevious,
    totalItems,
  } = useNavigationList(FOODS);

  if (!pet) return null;

  const petAge = calculatePetAge(pet.createdAt);
  const petNameDisplay = `${pet.type === 'cat' ? '🐱' : '🐶'} ${pet.name}`;
  const petAgeDisplay = `${petAge} ${petAge === 1 ? t('common.year') : t('common.years')}`;

  const handleFeed = (food: typeof FOODS[0]) => {
    try {
      // Clear any existing timeouts to prevent conflicts
      if (animationTimeout1.current) {
        clearTimeout(animationTimeout1.current);
      }
      if (animationTimeout2.current) {
        clearTimeout(animationTimeout2.current);
      }

      setAnimationState('eating');
      setMessage(t('feed.eating', { name: pet.name, food: t(food.nameKey) }));

      feed(food.value);

      // Base money earned for feeding
      const moneyEarned = AdsConfig.rewards.feedReward;

      animationTimeout1.current = setTimeout(() => {
        setAnimationState('happy');
        setMessage(t('feed.loved', { name: pet.name }));

        animationTimeout2.current = setTimeout(() => {
          setAnimationState('idle');
          setMessage('');

          // Offer double reward or give reward immediately
          triggerReward(moneyEarned);
        }, ANIMATION_DURATION.MEDIUM);
      }, ANIMATION_DURATION.MEDIUM);
    } catch (error) {
      // Reset state on error to prevent UI freeze
      logger.error('Feed error:', error);
      setAnimationState('idle');
      setMessage('');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title={t('feed.title')}
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
        <PetRenderer pet={pet} animationState={animationState} size={375} />
        {message ? <Text style={styles.message}>{message}</Text> : null}
      </View>

      <View style={styles.foodContainer}>
        <Text style={styles.foodTitle}>{t('feed.chooseFood')}</Text>
        
        {/* Navigation arrows and current food display */}
        <View style={styles.navigationContainer}>
          <TouchableOpacity
            style={styles.arrowButton}
            onPress={goToPrevious}
            disabled={animationState !== 'idle'}
          >
            <Text style={styles.arrowText}>←</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.currentFoodButton}
            onPress={() => handleFeed(currentFood)}
            disabled={animationState !== 'idle' || pet.hunger >= 100}
          >
            <Text style={styles.currentFoodEmoji}>{currentFood.emoji}</Text>
            <Text style={styles.currentFoodName}>{t(currentFood.nameKey)}</Text>
            <Text style={styles.currentFoodValue}>+{currentFood.value}%</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.arrowButton}
            onPress={goToNext}
            disabled={animationState !== 'idle'}
          >
            <Text style={styles.arrowText}>→</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.pageIndicator}>
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
    backgroundColor: '#fff8e1',
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
  hungerInfo: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  hungerText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ff9800',
  },
  foodContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  foodTitle: {
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
    backgroundColor: '#fff3e0',
    borderRadius: 30,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  arrowText: {
    fontSize: 28,
    color: '#ff9800',
    fontWeight: 'bold',
  },
  currentFoodButton: {
    backgroundColor: '#ffe0b2',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    minWidth: 140,
    borderWidth: 3,
    borderColor: '#ff9800',
  },
  currentFoodEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  currentFoodName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  currentFoodValue: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  pageIndicator: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '600',
  },
});