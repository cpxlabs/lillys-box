import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
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

type Props = {
  navigation: ScreenNavigationProp<'Feed'>;
};

const FOODS = [
  { id: 'kibble', emoji: '🍖', name: 'Ração', value: 20 },
  { id: 'fish', emoji: '🐟', name: 'Peixe', value: 25 },
  { id: 'treat', emoji: '🦴', name: 'Petisco', value: 15 },
  { id: 'milk', emoji: '🥛', name: 'Leite', value: 10 },
];

export const FeedScene: React.FC<Props> = ({ navigation }) => {
  const { pet, feed, earnMoney } = usePet();
  const { showToast } = useToast();
  const { triggerReward, DoubleRewardModal } = useDoubleReward({ earnMoney, showToast });
  const [animationState, setAnimationState] = useState<AnimationState>('idle');
  const [message, setMessage] = useState('');
  const BackButtonIcon = useBackButton();
  
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
  const petAgeDisplay = `${petAge} ${petAge === 1 ? 'ano' : 'anos'}`;

  const handleFeed = (food: typeof FOODS[0]) => {
    setAnimationState('eating');
    setMessage(`${pet.name} está comendo ${food.name}! 😋`);

    feed(food.value);

    // Base money earned for feeding
    const moneyEarned = AdsConfig.rewards.feedReward;

    setTimeout(() => {
      setAnimationState('happy');
      setMessage(`${pet.name} adorou! 💕`);

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
        title="🍖 Alimentar"
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
        <Text style={styles.foodTitle}>Escolha a comida:</Text>
        
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
            <Text style={styles.currentFoodName}>{currentFood.name}</Text>
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