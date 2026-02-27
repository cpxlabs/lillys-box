import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { usePet } from '../context/PetContext';
import { PetRenderer } from '../components/PetRenderer';
import { StatusCard } from '../components/StatusCard';
import { ScreenHeader } from '../components/ScreenHeader';
import { useNavigationList } from '../hooks/useNavigationList';
import { useBackButton } from '../hooks/useBackButton';
import { useGameBack } from '../hooks/useGameBack';
import { usePetActions } from '../hooks/usePetActions';
import { ScreenNavigationProp } from '../types/navigation';
import { calculatePetAge } from '../utils/age';
import { useResponsive } from '../hooks/useResponsive';
import { ACTION_PET_SIZE, ACTION_BUTTON_SIZE, SCENE_TEXT_SIZE } from '../config/responsive';

type Props = {
  navigation: ScreenNavigationProp<'Feed'>;
};

const FOODS = [
  { id: 'kibble', emoji: '🍖', nameKey: 'feed.foods.kibble', value: 30, cost: 15 },
  { id: 'fish', emoji: '🐟', nameKey: 'feed.foods.fish', value: 35, cost: 20 },
  { id: 'treat', emoji: '🦴', nameKey: 'feed.foods.treat', value: 25, cost: 18 },
  { id: 'milk', emoji: '🥛', nameKey: 'feed.foods.milk', value: 20, cost: 15 },
];

export const FeedScene: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { pet } = usePet();
  const { animationState, message, isAnimating, performAction, DoubleRewardModal } =
    usePetActions();
  const BackButtonIcon = useBackButton();
  const handleBack = useGameBack(navigation);
  const { deviceType, spacing, fs } = useResponsive();

  const petSize = ACTION_PET_SIZE[deviceType];
  const buttonSizes = ACTION_BUTTON_SIZE[deviceType];
  const textSizes = SCENE_TEXT_SIZE[deviceType];

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

  const handleFeed = async (food: (typeof FOODS)[0]) => {
    // Check if pet has enough money
    if (pet.money < food.cost) {
      Alert.alert(
        'Not Enough Money',
        `${food.nameKey === 'feed.foods.kibble' ? 'Kibble' : food.nameKey === 'feed.foods.fish' ? 'Fish' : food.nameKey === 'feed.foods.treat' ? 'Treat' : 'Milk'} costs ${food.cost} coins. You have ${pet.money} coins.`,
        [{ text: 'OK' }]
      );
      return;
    }

    await performAction('feed', {
      amount: food.value,
      cost: food.cost,
      activity: {
        emoji: food.emoji,
        nameKey: food.nameKey,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title={t('feed.title')}
        onBackPress={handleBack}
        BackButtonIcon={BackButtonIcon}
      />

      {/* Status Card */}
      <StatusCard pet={pet} petName={petNameDisplay} petAge={petAgeDisplay} compact />

      <View style={styles.petContainer}>
        <PetRenderer pet={pet} animationState={animationState} size={petSize} />
        {message ? (
          <Text style={[styles.message, { fontSize: textSizes.messageSize }]}>{message}</Text>
        ) : null}
      </View>

      <View
        style={[
          styles.foodContainer,
          {
            padding: spacing(16),
            borderTopLeftRadius: spacing(20),
            borderTopRightRadius: spacing(20),
          },
        ]}
      >
        <Text
          style={[styles.foodTitle, { fontSize: textSizes.titleSize, marginBottom: spacing(12) }]}
        >
          {t('feed.chooseFood')}
        </Text>

        {/* Navigation arrows and current food display */}
        <View style={[styles.navigationContainer, { marginBottom: spacing(10) }]}>
          <TouchableOpacity
            style={[
              styles.arrowButton,
              {
                width: buttonSizes.arrowSize,
                height: buttonSizes.arrowSize,
                borderRadius: buttonSizes.arrowSize / 2,
                marginHorizontal: spacing(6),
              },
            ]}
            onPress={goToPrevious}
            disabled={isAnimating}
            accessibilityRole="button"
            accessibilityLabel="Previous food"
            accessibilityHint="Show previous food option"
            accessibilityState={{ disabled: isAnimating }}
          >
            <Text style={[styles.arrowText, { fontSize: buttonSizes.arrowFontSize }]}>←</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.currentFoodButton,
              {
                minWidth: buttonSizes.itemWidth,
                padding: buttonSizes.itemPadding,
                borderRadius: spacing(16),
                opacity: pet.money < currentFood.cost ? 0.5 : 1,
              },
            ]}
            onPress={() => handleFeed(currentFood)}
            disabled={isAnimating || pet.hunger >= 100 || pet.money < currentFood.cost}
            accessibilityRole="button"
            accessibilityLabel={`${t(currentFood.nameKey)}, ${currentFood.value} percent hunger, costs ${currentFood.cost} coins`}
            accessibilityHint={pet.money < currentFood.cost ? "Not enough money" : "Feed this food to your pet"}
            accessibilityState={{ disabled: isAnimating || pet.hunger >= 100 || pet.money < currentFood.cost }}
          >
            <Text
              style={[
                styles.currentFoodEmoji,
                { fontSize: buttonSizes.itemEmoji, marginBottom: spacing(6) },
              ]}
            >
              {currentFood.emoji}
            </Text>
            <Text
              style={[
                styles.currentFoodName,
                { fontSize: buttonSizes.itemFont, marginBottom: spacing(3) },
              ]}
            >
              {t(currentFood.nameKey)}
            </Text>
            <Text style={[styles.currentFoodValue, { fontSize: buttonSizes.valueFont }]}>
              +{currentFood.value}%
            </Text>
            <Text style={[styles.foodCost, { fontSize: fs(10), marginTop: spacing(2) }]}>
              💰 {currentFood.cost} coins
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.arrowButton,
              {
                width: buttonSizes.arrowSize,
                height: buttonSizes.arrowSize,
                borderRadius: buttonSizes.arrowSize / 2,
                marginHorizontal: spacing(6),
              },
            ]}
            onPress={goToNext}
            disabled={isAnimating}
            accessibilityRole="button"
            accessibilityLabel="Next food"
            accessibilityHint="Show next food option"
            accessibilityState={{ disabled: isAnimating }}
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
  foodCost: {
    fontSize: 12,
    color: '#ff9800',
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
