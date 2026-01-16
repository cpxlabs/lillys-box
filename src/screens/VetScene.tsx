import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { usePet } from '../context/PetContext';
import { useRewardedAd } from '../hooks/useRewardedAd';
import { needsVet } from '../utils/petStats';
import { GAME_BALANCE } from '../config/gameBalance';
import { logger } from '../utils/logger';
import { ScreenNavigationProp } from '../types/navigation';

type Props = {
  navigation: ScreenNavigationProp<'Vet'>;
};

export const VetScene: React.FC<Props> = ({ navigation }) => {
  const { pet, visitVet } = usePet();
  const { showRewardedAd, isAdReady } = useRewardedAd();
  const [isProcessing, setIsProcessing] = useState(false);

  if (!pet) return null;

  const vetStatus = needsVet(pet.health);
  const canAfford = pet.money >= GAME_BALANCE.activities.vet.cost;

  const handlePayWithMoney = () => {
    if (!canAfford) {
      Alert.alert(
        'Not Enough Money',
        `You need ${GAME_BALANCE.activities.vet.cost} coins for a vet visit. You have ${pet.money} coins.`,
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      'Visit Vet?',
      `This will cost ${GAME_BALANCE.activities.vet.cost} coins. Your pet will be examined and treated.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Visit',
          onPress: () => {
            performVetVisit(true);
          },
        },
      ]
    );
  };

  const handleWatchAd = async () => {
    if (!isAdReady) {
      Alert.alert(
        'Ad Not Ready',
        'Please wait a moment for the ad to load.',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      setIsProcessing(true);
      const success = await showRewardedAd('vet_visit');

      if (success) {
        performVetVisit(false);
      } else {
        Alert.alert(
          'Ad Failed',
          'Unable to show ad. Please try again.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      logger.error('Error showing rewarded ad:', error);
      Alert.alert(
        'Error',
        'Something went wrong. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const performVetVisit = (useMoney: boolean) => {
    const success = visitVet(useMoney);

    if (!success) {
      Alert.alert(
        'Visit Failed',
        useMoney
          ? `You need ${GAME_BALANCE.activities.vet.cost} coins for a vet visit. You have ${pet.money} coins.`
          : 'Unable to complete vet visit. Please try again.',
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      '✅ Checkup Complete!',
      `${pet.name} has been examined and is feeling much better!`,
      [
        {
          text: 'Great!',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  const getUrgencyColor = () => {
    if (vetStatus === 'urgent') return '#EF5350';
    if (vetStatus === 'suggested') return '#FFA726';
    return '#4CAF50';
  };

  const getUrgencyMessage = () => {
    if (vetStatus === 'urgent')
      return `${pet.name} needs urgent medical attention!`;
    if (vetStatus === 'suggested')
      return `${pet.name} could use a checkup.`;
    return `${pet.name} is healthy but can still visit for a boost!`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>🏥 Veterinary Clinic</Text>

        <View
          style={[
            styles.statusCard,
            { borderColor: getUrgencyColor(), borderWidth: 2 },
          ]}
        >
          <Text style={styles.petName}>{pet.name}'s Health</Text>
          <View style={styles.healthContainer}>
            <Text style={styles.healthEmoji}>
              {vetStatus === 'urgent' ? '🚨' : vetStatus === 'suggested' ? '⚠️' : '✅'}
            </Text>
            <Text
              style={[styles.healthValue, { color: getUrgencyColor() }]}
            >
              {Math.round(pet.health)}%
            </Text>
          </View>
          <Text style={styles.urgencyMessage}>{getUrgencyMessage()}</Text>
        </View>

        <View style={styles.benefitsCard}>
          <Text style={styles.benefitsTitle}>Vet Visit Benefits:</Text>
          <Text style={styles.benefitText}>
            ❤️ Health restored to minimum {GAME_BALANCE.activities.vet.healthTarget}%
          </Text>
          <Text style={styles.benefitText}>
            📈 All stats +{GAME_BALANCE.activities.vet.statBoost}
          </Text>
          <Text style={styles.benefitText}>
            ⚡ Energy {GAME_BALANCE.activities.vet.energy} (checkup is stressful)
          </Text>
          <Text style={styles.benefitText}>
            😊 Happiness {GAME_BALANCE.activities.vet.happiness} (temporary discomfort)
          </Text>
        </View>

        <View style={styles.paymentOptions}>
          <TouchableOpacity
            style={[
              styles.payButton,
              !canAfford && styles.payButtonDisabled,
            ]}
            onPress={handlePayWithMoney}
            disabled={!canAfford || isProcessing}
          >
            <Text style={styles.payButtonText}>
              💰 Pay {GAME_BALANCE.activities.vet.cost} Coins
            </Text>
            <Text style={styles.payButtonSubtext}>
              You have: {pet.money} coins
            </Text>
          </TouchableOpacity>

          <Text style={styles.orText}>OR</Text>

          <TouchableOpacity
            style={[
              styles.adButton,
              (!isAdReady || isProcessing) && styles.adButtonDisabled,
            ]}
            onPress={handleWatchAd}
            disabled={!isAdReady || isProcessing}
          >
            <Text style={styles.adButtonText}>
              {isProcessing ? '⏳ Loading...' : '📺 Watch Ad (Free)'}
            </Text>
            {!isAdReady && !isProcessing && (
              <Text style={styles.adButtonSubtext}>Ad loading...</Text>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          disabled={isProcessing}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
    marginBottom: 20,
  },
  statusCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  petName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  healthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  healthEmoji: {
    fontSize: 40,
    marginRight: 10,
  },
  healthValue: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  urgencyMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
  benefitsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  benefitText: {
    fontSize: 14,
    color: '#666',
    marginVertical: 4,
  },
  paymentOptions: {
    marginBottom: 20,
  },
  payButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  payButtonDisabled: {
    backgroundColor: '#ccc',
    opacity: 0.6,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  payButtonSubtext: {
    color: '#fff',
    fontSize: 14,
    marginTop: 4,
    opacity: 0.9,
  },
  orText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginVertical: 10,
    fontWeight: '600',
  },
  adButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  adButtonDisabled: {
    backgroundColor: '#ccc',
    opacity: 0.6,
  },
  adButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  adButtonSubtext: {
    color: '#fff',
    fontSize: 14,
    marginTop: 4,
    opacity: 0.9,
  },
  backButton: {
    padding: 12,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#666',
    fontSize: 16,
  },
});
