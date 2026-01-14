import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { usePet } from '../context/PetContext';
import { useToast } from '../context/ToastContext';
import { PetRenderer } from '../components/PetRenderer';
import { ConfirmModal } from '../components/ConfirmModal';
import { AnimationState } from '../types';
import { useNavigationList } from '../hooks/useNavigationList';
import { useBackButton } from '../hooks/useBackButton';
import { useRewardedAd } from '../hooks/useRewardedAd';
import { AdsConfig } from '../config/ads.config';

type Props = {
  navigation: NativeStackNavigationProp<any>;
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
  const { showRewardedAd, isAdReady } = useRewardedAd();
  const [animationState, setAnimationState] = useState<AnimationState>('idle');
  const [message, setMessage] = useState('');
  const [showDoubleRewardModal, setShowDoubleRewardModal] = useState(false);
  const [pendingReward, setPendingReward] = useState(0);
  const BackButtonIcon = useBackButton();
  
  const {
    currentItem: currentFood,
    currentIndex,
    goToNext,
    goToPrevious,
    totalItems,
  } = useNavigationList(FOODS);

  if (!pet) return null;

  const handleFeed = (food: typeof FOODS[0]) => {
    setAnimationState('eating');
    setMessage(`${pet.name} está comendo ${food.name}! 😋`);

    feed(food.value);
    
    // Base money earned for feeding
    const moneyEarned = 5;

    setTimeout(() => {
      setAnimationState('happy');
      setMessage(`${pet.name} adorou! 💕`);

      setTimeout(() => {
        setAnimationState('idle');
        setMessage('');

        // Offer double reward if ads are enabled and available
        if (AdsConfig.enabled && AdsConfig.rewards.activityDoubleReward && isAdReady) {
          setPendingReward(moneyEarned);
          setShowDoubleRewardModal(true);
        } else {
          // Just give normal reward
          earnMoney(moneyEarned);
          showToast(`💰 +${moneyEarned} moedas ganhas!`, 'success');
        }
      }, 1500);
    }, 1500);
  };

  const handleWatchAd = async () => {
    setShowDoubleRewardModal(false);
    
    await showRewardedAd(() => {
      // Double the reward
      const doubleReward = pendingReward * 2;
      earnMoney(doubleReward);
      showToast(`🎉 Recompensa em dobro! +${doubleReward} moedas!`, 'success');
      setPendingReward(0);
    });
  };

  const handleDeclineAd = () => {
    setShowDoubleRewardModal(false);
    // Give normal reward
    earnMoney(pendingReward);
    showToast(`💰 +${pendingReward} moedas ganhas!`, 'success');
    setPendingReward(0);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonContainer}>
          <BackButtonIcon />
          <Text style={styles.backButton}>Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>🍖 Alimentar</Text>
        <View style={{ width: 80 }} />
      </View>

      <View style={styles.petContainer}>
        <PetRenderer pet={pet} animationState={animationState} size={375} />
        {message ? <Text style={styles.message}>{message}</Text> : null}
      </View>

      <View style={styles.hungerInfo}>
        <Text style={styles.hungerText}>
          Fome: {Math.round(pet.hunger)}%
        </Text>
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
      <ConfirmModal
        visible={showDoubleRewardModal}
        title="🎉 Ganhe o Dobro!"
        message={`Ótimo trabalho! Assista a um anúncio para ganhar ${pendingReward * 2} moedas em vez de ${pendingReward}?`}
        confirmText="Assistir Anúncio"
        cancelText="Não, Obrigado"
        onConfirm={handleWatchAd}
        onCancel={handleDeclineAd}
      />
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