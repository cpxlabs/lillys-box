import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
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
import { ScreenNavigationProp } from '../types/navigation';
import { ANIMATION_DURATION } from '../config/constants';
import { FOOD_ITEMS } from '../data/foodItems';
import { calculatePetAge } from '../utils/age';
import { logger } from '../utils/logger';
import { useResponsive } from '../hooks/useResponsive';
import { ACTION_PET_SIZE, ACTION_BUTTON_SIZE, SCENE_TEXT_SIZE } from '../config/responsive';

type Props = {
  navigation: ScreenNavigationProp<'Feed'>;
};

export const FeedScene: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { pet, feed } = usePet();
  const { showToast } = useToast();
  const [animationState, setAnimationState] = useState<AnimationState>('idle');
  const [message, setMessage] = useState('');
  const BackButtonIcon = useBackButton();
  const { deviceType, spacing, fs } = useResponsive();

  const petSize = ACTION_PET_SIZE[deviceType];
  const buttonSizes = ACTION_BUTTON_SIZE[deviceType];
  const textSizes = SCENE_TEXT_SIZE[deviceType];

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
  } = useNavigationList(FOOD_ITEMS as any);

  if (!pet) return null;

  const petAge = calculatePetAge(pet.createdAt);
  const petNameDisplay = `${pet.type === 'cat' ? '🐱' : '🐶'} ${pet.name}`;
  const petAgeDisplay = `${petAge} ${petAge === 1 ? t('common.year') : t('common.years')}`;

  const handleFeed = (food: typeof FOOD_ITEMS[0]) => {
    try {
      // Check if pet has enough money
      if (pet.money < food.cost) {
        Alert.alert(
          '💰 Not Enough Money',
          `${food.nameKey} costs ${food.cost} coins. You have ${pet.money} coins.`,
          [{ text: 'OK' }]
        );
        return;
      }

      // Clear any existing timeouts to prevent conflicts
      if (animationTimeout1.current) {
        clearTimeout(animationTimeout1.current);
      }
      if (animationTimeout2.current) {
        clearTimeout(animationTimeout2.current);
      }

      setAnimationState('eating');
      setMessage(t('feed.eating', { name: pet.name, food: t(food.nameKey) }));

      // Feed pet and deduct cost
      const success = feed(food.hungerValue, food.cost);

      if (!success) {
        Alert.alert(
          '❌ Cannot Feed',
          'Unable to feed your pet. Please try again.',
          [{ text: 'OK' }]
        );
        setAnimationState('idle');
        setMessage('');
        return;
      }

      animationTimeout1.current = setTimeout(() => {
        setAnimationState('happy');
        setMessage(t('feed.loved', { name: pet.name }));

        animationTimeout2.current = setTimeout(() => {
          setAnimationState('idle');
          setMessage('');
        }, ANIMATION_DURATION.MEDIUM);
      }, ANIMATION_DURATION.MEDIUM);
    } catch (error) {
      // Reset state on error to prevent UI freeze
      logger.error('Feed error:', error);
      Alert.alert(
        '❌ Error',
        'An error occurred while feeding. Please try again.',
        [{ text: 'OK' }]
      );
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
        <PetRenderer pet={pet} animationState={animationState} size={petSize} />
        {message ? <Text style={[styles.message, { fontSize: textSizes.messageSize }]}>{message}</Text> : null}
      </View>

      <View style={[styles.foodContainer, { padding: spacing(16), borderTopLeftRadius: spacing(20), borderTopRightRadius: spacing(20) }]}>
        {/* Money display and title */}
        <View style={[styles.headerRow, { marginBottom: spacing(12) }]}>
          <Text style={[styles.foodTitle, { fontSize: textSizes.titleSize, flex: 1 }]}>{t('feed.chooseFood')}</Text>
          <View style={[styles.moneyBadge, { paddingHorizontal: spacing(12), paddingVertical: spacing(6), borderRadius: spacing(8) }]}>
            <Text style={[styles.moneyText, { fontSize: fs(13) }]}>💰 {pet.money}</Text>
          </View>
        </View>

        {/* Navigation arrows and current food display */}
        <View style={[styles.navigationContainer, { marginBottom: spacing(10) }]}>
          <TouchableOpacity
            style={[styles.arrowButton, { width: buttonSizes.arrowSize, height: buttonSizes.arrowSize, borderRadius: buttonSizes.arrowSize / 2, marginHorizontal: spacing(6) }]}
            onPress={goToPrevious}
            disabled={animationState !== 'idle'}
          >
            <Text style={[styles.arrowText, { fontSize: buttonSizes.arrowFontSize }]}>←</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.currentFoodButton,
              { minWidth: buttonSizes.itemWidth, padding: buttonSizes.itemPadding, borderRadius: spacing(16) },
              (animationState !== 'idle' || pet.hunger >= 100 || pet.money < currentFood.cost) && styles.currentFoodButtonDisabled,
            ]}
            onPress={() => handleFeed(currentFood)}
            disabled={animationState !== 'idle' || pet.hunger >= 100 || pet.money < currentFood.cost}
          >
            <Text style={[styles.currentFoodEmoji, { fontSize: buttonSizes.itemEmoji, marginBottom: spacing(6) }]}>{currentFood.emoji}</Text>
            <Text style={[styles.currentFoodName, { fontSize: buttonSizes.itemFont, marginBottom: spacing(3) }]}>{t(currentFood.nameKey)}</Text>
            <View style={[styles.foodValueRow, { marginTop: spacing(4) }]}>
              <Text style={[styles.currentFoodValue, { fontSize: buttonSizes.valueFont, flex: 1 }]}>+{currentFood.hungerValue}%</Text>
              <Text style={[styles.foodCost, { fontSize: buttonSizes.valueFont }]}>💰{currentFood.cost}</Text>
            </View>
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

        {pet.money < currentFood.cost && (
          <Text style={[styles.warningText, { fontSize: fs(12), marginBottom: spacing(8) }]}>
            ⚠️ Not enough coins! Need {currentFood.cost}, have {pet.money}
          </Text>
        )}
      </View>
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
  currentFoodButtonDisabled: {
    backgroundColor: '#f0f0f0',
    borderColor: '#ccc',
    opacity: 0.6,
  },
  foodValueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  foodCost: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: '600',
  },
  pageIndicator: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '600',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moneyBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  moneyText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
  },
  warningText: {
    fontSize: 12,
    color: '#ff6b6b',
    textAlign: 'center',
    fontWeight: '600',
    backgroundColor: '#ffe0e0',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
});