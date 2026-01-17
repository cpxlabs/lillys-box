import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ScrollView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { usePet } from '../context/PetContext';
import { useRewardedAd } from '../hooks/useRewardedAd';
import { needsVet } from '../utils/petStats';
import { ScreenHeader } from '../components/ScreenHeader';
import { PetRenderer } from '../components/PetRenderer';
import { GAME_BALANCE } from '../config/gameBalance';
import { COLORS } from '../config/constants';
import { logger } from '../utils/logger';
import { ScreenNavigationProp } from '../types/navigation';
import { TreatmentType } from '../types';
import { calculatePetAge } from '../utils/age';
import { useBackButton } from '../hooks/useBackButton';
import { useResponsive } from '../hooks/useResponsive';
import { PET_SIZE_SMALL, SCENE_TEXT_SIZE } from '../config/responsive';

type Props = {
  navigation: ScreenNavigationProp<'Vet'>;
};

export const VetScene: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { pet, visitVet } = usePet();
  const { showRewardedAd, isAdReady } = useRewardedAd();
  const [isProcessing, setIsProcessing] = useState(false);
  const BackButtonIcon = useBackButton();
  const { deviceType, spacing, fs } = useResponsive();

  const petSize = PET_SIZE_SMALL[deviceType];
  const textSizes = SCENE_TEXT_SIZE[deviceType];

  if (!pet) return null;

  const petAge = calculatePetAge(pet.createdAt);
  const petNameDisplay = `${pet.type === 'cat' ? '🐱' : '🐶'} ${pet.name}`;
  const petAgeDisplay = `${petAge} ${petAge === 1 ? t('common.year') : t('common.years')}`;

  const vetStatus = needsVet(pet.health);
  const canAffordAntibiotic = pet.money >= GAME_BALANCE.activities.vet.antibiotic.cost;
  const canAffordAntiInflammatory = pet.money >= GAME_BALANCE.activities.vet.antiInflammatory.cost;

  const performTreatment = (treatment: TreatmentType, useMoney: boolean) => {
    const treatmentConfig = GAME_BALANCE.activities.vet[treatment];
    const treatmentName = treatment === 'antibiotic' ? 'Antibiotic' : 'Anti-inflammatory';
    const suffix = treatment === 'antibiotic' ? ' (Budget)' : ' (Premium)';

    const success = visitVet(treatment, useMoney);

    if (!success) {
      const reason = useMoney
        ? `You need ${treatmentConfig.cost} coins. You have ${pet.money} coins.`
        : `${treatmentName} treatment doesn't support ad viewing.`;
      Alert.alert(
        '❌ Treatment Failed',
        reason,
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      '✅ Treatment Complete!',
      `${pet.name} received ${treatmentName} treatment and is feeling much better! (Health guaranteed to ${treatmentConfig.healthTarget}%)`,
      [
        {
          text: 'Great!',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  const handleTreatmentWithMoney = (treatment: TreatmentType) => {
    const treatmentConfig = GAME_BALANCE.activities.vet[treatment];
    const treatmentName = treatment === 'antibiotic' ? 'Antibiotic' : 'Anti-inflammatory';
    const canAfford = pet.money >= treatmentConfig.cost;

    if (!canAfford) {
      Alert.alert(
        '💰 Not Enough Money',
        `${treatmentName} costs ${treatmentConfig.cost} coins. You have ${pet.money} coins.`,
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      `${treatmentName} Treatment?`,
      `Cost: ${treatmentConfig.cost} coins\nHealth guaranteed to: ${treatmentConfig.healthTarget}%`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Get Treatment',
          onPress: () => performTreatment(treatment, true),
        },
      ]
    );
  };

  const handleTreatmentWithAd = async (treatment: TreatmentType) => {
    if (!isAdReady) {
      Alert.alert(
        '📺 Ad Not Ready',
        'Please wait a moment for the ad to load.',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      setIsProcessing(true);
      await showRewardedAd(() => {
        performTreatment(treatment, false);
      });
    } catch (error) {
      logger.error('Error showing rewarded ad:', error);
      Alert.alert(
        '❌ Error',
        'Something went wrong with the ad. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const getUrgencyColor = () => {
    if (vetStatus === 'urgent') return COLORS.URGENCY.URGENT;
    if (vetStatus === 'suggested') return COLORS.URGENCY.SUGGESTED;
    return COLORS.URGENCY.NORMAL;
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
      <ScreenHeader
        title="🏥 Veterinário"
        onBackPress={() => navigation.goBack()}
        BackButtonIcon={BackButtonIcon}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.content, { paddingHorizontal: spacing(12), paddingTop: spacing(10) }]}>
          {/* Pet info header - simplified without energy/happiness */}
          <View style={[styles.petInfoHeader, { borderRadius: spacing(10), padding: spacing(10), marginBottom: spacing(10) }]}>
            <View style={styles.petInfoLeft}>
              <Text style={[styles.petInfoName, { fontSize: textSizes.titleSize }]}>{petNameDisplay}</Text>
              <Text style={[styles.petInfoAge, { fontSize: fs(13), marginTop: spacing(2) }]}>{petAgeDisplay}</Text>
              <View style={[styles.moneyBadge, { paddingVertical: spacing(3), paddingHorizontal: spacing(8), borderRadius: spacing(6), marginTop: spacing(4) }]}>
                <Text style={[styles.moneyText, { fontSize: fs(13) }]}>💰 {pet.money}</Text>
              </View>
            </View>
            <View style={[styles.healthBadge, { padding: spacing(8), borderRadius: spacing(8) }]}>
              <Text style={[styles.healthBadgeLabel, { fontSize: fs(11), marginBottom: spacing(2) }]}>Health</Text>
              <Text style={[styles.healthBadgeValue, { fontSize: textSizes.titleSize, color: getUrgencyColor() }]}>
                {Math.round(pet.health)}%
              </Text>
            </View>
          </View>

          {/* Main area with pet display */}
          <View style={[styles.mainArea, { marginBottom: spacing(10) }]}>
            {/* Pet display */}
            <View style={[styles.petDisplay, { marginBottom: spacing(10) }]}>
              <PetRenderer pet={pet} animationState="idle" size={petSize} />
            </View>

            {/* Health status card below pet */}
            <View
              style={[
                styles.statusCard,
                { borderColor: getUrgencyColor(), borderWidth: 2, borderRadius: spacing(10), padding: spacing(12), width: '70%' },
              ]}
            >
              <View style={styles.healthContainer}>
                <Text style={[styles.healthEmoji, { fontSize: fs(28), marginRight: spacing(6) }]}>
                  {vetStatus === 'urgent' ? '🚨' : vetStatus === 'suggested' ? '⚠️' : '✅'}
                </Text>
                <Text
                  style={[styles.healthValue, { fontSize: fs(28), color: getUrgencyColor() }]}
                >
                  {Math.round(pet.health)}%
                </Text>
              </View>
              <Text style={[styles.urgencyMessage, { fontSize: fs(12), marginTop: spacing(6) }]}>{getUrgencyMessage()}</Text>
            </View>

            </View>

          {/* Treatment Options */}
          <View style={[styles.treatmentOptions, { marginBottom: spacing(12) }]}>
            <Text style={[styles.treatmentTitle, { fontSize: textSizes.buttonText, marginBottom: spacing(8) }]}>Choose Treatment</Text>

            {/* Antibiotic Treatment */}
            <View style={[styles.treatmentCard, { borderRadius: spacing(10), marginBottom: spacing(8), padding: spacing(12) }]}>
              <View style={styles.treatmentHeader}>
                <View>
                  <Text style={[styles.treatmentName, { fontSize: fs(16), marginBottom: spacing(2) }]}>💊 Antibiotic</Text>
                  <Text style={[styles.treatmentSubtext, { fontSize: fs(11) }]}>Budget-friendly option</Text>
                </View>
                <View style={[styles.healthTargetBadge, { paddingVertical: spacing(4), paddingHorizontal: spacing(8), borderRadius: spacing(6) }]}>
                  <Text style={[styles.healthTargetText, { fontSize: fs(12) }]}>Min: {GAME_BALANCE.activities.vet.antibiotic.healthTarget}%</Text>
                </View>
              </View>

              <View style={[styles.treatmentButtonGroup, { marginTop: spacing(8) }]}>
                <TouchableOpacity
                  style={[
                    styles.treatmentPayButton,
                    { paddingVertical: spacing(8), paddingHorizontal: spacing(12), borderRadius: spacing(8), flex: 1, marginRight: spacing(6) },
                    !canAffordAntibiotic && styles.treatmentButtonDisabled,
                  ]}
                  onPress={() => handleTreatmentWithMoney('antibiotic')}
                  disabled={!canAffordAntibiotic || isProcessing}
                >
                  <Text style={[styles.treatmentButtonText, { fontSize: fs(12) }]}>
                    💰 {GAME_BALANCE.activities.vet.antibiotic.cost}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.treatmentAdButton,
                    { paddingVertical: spacing(8), paddingHorizontal: spacing(12), borderRadius: spacing(8), flex: 1 },
                    (!isAdReady || isProcessing) && styles.treatmentButtonDisabled,
                  ]}
                  onPress={() => handleTreatmentWithAd('antibiotic')}
                  disabled={!isAdReady || isProcessing}
                >
                  <Text style={[styles.treatmentButtonText, { fontSize: fs(12) }]}>
                    {isProcessing ? '⏳' : '📺'} Free
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Anti-inflammatory Treatment */}
            <View style={[styles.treatmentCardPremium, { borderRadius: spacing(10), padding: spacing(12) }]}>
              <View style={styles.treatmentHeader}>
                <View>
                  <Text style={[styles.treatmentName, { fontSize: fs(16), marginBottom: spacing(2) }]}>💊 Anti-inflammatory</Text>
                  <Text style={[styles.treatmentSubtext, { fontSize: fs(11) }]}>Premium option</Text>
                </View>
                <View style={[styles.healthTargetBadgePremium, { paddingVertical: spacing(4), paddingHorizontal: spacing(8), borderRadius: spacing(6) }]}>
                  <Text style={[styles.healthTargetTextPremium, { fontSize: fs(12) }]}>Min: {GAME_BALANCE.activities.vet.antiInflammatory.healthTarget}%</Text>
                </View>
              </View>

              <View style={[styles.treatmentButtonGroup, { marginTop: spacing(8) }]}>
                <TouchableOpacity
                  style={[
                    styles.treatmentPayButtonPremium,
                    { paddingVertical: spacing(8), paddingHorizontal: spacing(12), borderRadius: spacing(8) },
                    !canAffordAntiInflammatory && styles.treatmentButtonDisabled,
                  ]}
                  onPress={() => handleTreatmentWithMoney('antiInflammatory')}
                  disabled={!canAffordAntiInflammatory || isProcessing}
                >
                  <Text style={[styles.treatmentButtonTextPremium, { fontSize: fs(12) }]}>
                    💰 {GAME_BALANCE.activities.vet.antiInflammatory.cost} (Money Only)
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.backButton, { padding: spacing(8) }]}
            onPress={() => navigation.goBack()}
            disabled={isProcessing}
          >
            <Text style={[styles.backButtonText, { fontSize: fs(14) }]}>Back</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  petInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  petInfoLeft: {
    flex: 1,
  },
  petInfoName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  petInfoAge: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  moneyBadge: {
    backgroundColor: '#FFD700',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  moneyText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  healthBadge: {
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 10,
  },
  healthBadgeLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  healthBadgeValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  mainArea: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 12,
  },
  petDisplay: {
    alignItems: 'center',
    marginBottom: 12,
  },
  statusCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '70%',
  },
  healthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  healthEmoji: {
    fontSize: 32,
    marginRight: 8,
  },
  healthValue: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  urgencyMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  treatmentOptions: {
    marginBottom: 16,
  },
  treatmentTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  treatmentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  treatmentCardPremium: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  treatmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  treatmentName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 2,
  },
  treatmentSubtext: {
    fontSize: 11,
    color: '#999',
  },
  healthTargetBadge: {
    backgroundColor: '#E8F5E9',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  healthTargetText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2E7D32',
  },
  healthTargetBadgePremium: {
    backgroundColor: '#E3F2FD',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  healthTargetTextPremium: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1565C0',
  },
  treatmentButtonGroup: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  treatmentPayButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  treatmentPayButtonPremium: {
    backgroundColor: '#2196F3',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  treatmentAdButton: {
    backgroundColor: '#FF9800',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  treatmentButtonDisabled: {
    backgroundColor: '#ccc',
    opacity: 0.6,
  },
  treatmentButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  treatmentButtonTextPremium: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  backButton: {
    padding: 10,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#666',
    fontSize: 15,
  },
});
