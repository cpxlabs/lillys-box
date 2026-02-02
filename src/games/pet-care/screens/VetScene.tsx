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
import { useRewardedAd } from '../../../app/hooks/useRewardedAd';
import { needsVet } from '../utils/petStats';
import { ScreenHeader } from '../components/ScreenHeader';
import { PetRenderer } from '../components/PetRenderer';
import { GAME_BALANCE } from '../config/gameBalance';
import { logger } from '../../../shared/utils/logger';
import { ScreenNavigationProp } from '../../../app/types/navigation';
import { calculatePetAge } from '../utils/age';
import { useBackButton } from '../../../shared/hooks/useBackButton';
import { useResponsive } from '../../../app/hooks/useResponsive';
import { PET_SIZE_SMALL, SCENE_TEXT_SIZE } from '../../../app/config/responsive';

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
  const antibioticCost = GAME_BALANCE.activities.vet.antibiotic.cost;
  const antiInflamCost = GAME_BALANCE.activities.vet.antiInflammatory.cost;
  const canAffordAntibiotic = pet.money >= antibioticCost;
  const canAffordAntiInflam = pet.money >= antiInflamCost;

  const handleTreatmentWithMoney = (treatmentType: 'antibiotic' | 'antiInflammatory') => {
    const cost = treatmentType === 'antibiotic' ? antibioticCost : antiInflamCost;
    const canAfford = treatmentType === 'antibiotic' ? canAffordAntibiotic : canAffordAntiInflam;
    const treatmentName = treatmentType === 'antibiotic' ? 'Antibiotic' : 'Anti-inflammatory';

    if (!canAfford) {
      Alert.alert(
        'Not Enough Money',
        `You need ${cost} coins for ${treatmentName}. You have ${pet.money} coins.`,
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      `Use ${treatmentName}?`,
      `This will cost ${cost} coins. Your pet will receive treatment.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Use',
          onPress: () => {
            performVetVisit(treatmentType, true);
          },
        },
      ]
    );
  };

  const handleTreatmentWithAd = async (treatmentType: 'antibiotic' | 'antiInflammatory') => {
    if (!isAdReady) {
      Alert.alert('Ad Not Ready', 'Please wait a moment for the ad to load.', [{ text: 'OK' }]);
      return;
    }

    try {
      setIsProcessing(true);
      // Pass callback that will be executed when ad is completed successfully
      await showRewardedAd(() => {
        performVetVisit(treatmentType, false);
      });
    } catch (error) {
      logger.error('Error showing rewarded ad:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.', [{ text: 'OK' }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const performVetVisit = (treatmentType: 'antibiotic' | 'antiInflammatory', useMoney: boolean) => {
    const success = visitVet(treatmentType, useMoney);
    const treatmentName = treatmentType === 'antibiotic' ? 'Antibiotic' : 'Anti-inflammatory';
    const cost = treatmentType === 'antibiotic' ? antibioticCost : antiInflamCost;

    if (!success) {
      Alert.alert(
        'Visit Failed',
        useMoney
          ? `You need ${cost} coins for ${treatmentName}. You have ${pet.money} coins.`
          : 'Unable to complete vet visit. Please try again.',
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      '✅ Treatment Complete!',
      `${pet.name} received ${treatmentName} treatment and is feeling better!`,
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
    if (vetStatus === 'urgent') return `${pet.name} needs urgent medical attention!`;
    if (vetStatus === 'suggested') return `${pet.name} could use a checkup.`;
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
          <View
            style={[
              styles.petInfoHeader,
              { borderRadius: spacing(10), padding: spacing(10), marginBottom: spacing(10) },
            ]}
          >
            <View style={styles.petInfoLeft}>
              <Text style={[styles.petInfoName, { fontSize: textSizes.titleSize }]}>
                {petNameDisplay}
              </Text>
              <Text style={[styles.petInfoAge, { fontSize: fs(13), marginTop: spacing(2) }]}>
                {petAgeDisplay}
              </Text>
              <View
                style={[
                  styles.moneyBadge,
                  {
                    paddingVertical: spacing(3),
                    paddingHorizontal: spacing(8),
                    borderRadius: spacing(6),
                    marginTop: spacing(4),
                  },
                ]}
              >
                <Text style={[styles.moneyText, { fontSize: fs(13) }]}>💰 {pet.money}</Text>
              </View>
            </View>
            <View style={[styles.healthBadge, { padding: spacing(8), borderRadius: spacing(8) }]}>
              <Text
                style={[styles.healthBadgeLabel, { fontSize: fs(11), marginBottom: spacing(2) }]}
              >
                Health
              </Text>
              <Text
                style={[
                  styles.healthBadgeValue,
                  { fontSize: textSizes.titleSize, color: getUrgencyColor() },
                ]}
              >
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
                {
                  borderColor: getUrgencyColor(),
                  borderWidth: 2,
                  borderRadius: spacing(10),
                  padding: spacing(12),
                  width: '70%',
                },
              ]}
            >
              <View style={styles.healthContainer}>
                <Text style={[styles.healthEmoji, { fontSize: fs(28), marginRight: spacing(6) }]}>
                  {vetStatus === 'urgent' ? '🚨' : vetStatus === 'suggested' ? '⚠️' : '✅'}
                </Text>
                <Text style={[styles.healthValue, { fontSize: fs(28), color: getUrgencyColor() }]}>
                  {Math.round(pet.health)}%
                </Text>
              </View>
              <Text style={[styles.urgencyMessage, { fontSize: fs(12), marginTop: spacing(6) }]}>
                {getUrgencyMessage()}
              </Text>
            </View>

            {/* Benefits sidebar on the right - shows treatment options */}
            <View
              style={[
                styles.benefitsSidebar,
                { borderRadius: spacing(10), padding: spacing(8), maxWidth: spacing(110) },
              ]}
            >
              <Text
                style={[
                  styles.benefitsSidebarTitle,
                  { fontSize: textSizes.sidebarTitle, marginBottom: spacing(4) },
                ]}
              >
                Treatments
              </Text>

              {/* Antibiotic info */}
              <Text
                style={[
                  styles.benefitsSidebarText,
                  {
                    fontSize: textSizes.sidebarText,
                    marginVertical: spacing(2),
                    fontWeight: '600',
                  },
                ]}
              >
                Antibiotic
              </Text>
              <Text
                style={[
                  styles.benefitsSidebarText,
                  { fontSize: fs(10), marginVertical: spacing(1) },
                ]}
              >
                💰 {antibioticCost} coins
              </Text>
              <Text
                style={[
                  styles.benefitsSidebarText,
                  { fontSize: fs(10), marginVertical: spacing(1) },
                ]}
              >
                ❤️ Health to 50%
              </Text>

              {/* Anti-inflammatory info */}
              <Text
                style={[
                  styles.benefitsSidebarText,
                  {
                    fontSize: textSizes.sidebarText,
                    marginVertical: spacing(3),
                    fontWeight: '600',
                    marginTop: spacing(6),
                  },
                ]}
              >
                Anti-inflam
              </Text>
              <Text
                style={[
                  styles.benefitsSidebarText,
                  { fontSize: fs(10), marginVertical: spacing(1) },
                ]}
              >
                💰 {antiInflamCost} coins
              </Text>
              <Text
                style={[
                  styles.benefitsSidebarText,
                  { fontSize: fs(10), marginVertical: spacing(1) },
                ]}
              >
                ❤️ Health to 80%
              </Text>
            </View>
          </View>

          {/* Treatment options */}
          <View style={[styles.paymentOptions, { marginBottom: spacing(12) }]}>
            {/* Antibiotic treatment */}
            <View>
              <TouchableOpacity
                style={[
                  styles.payButton,
                  {
                    paddingVertical: spacing(12),
                    paddingHorizontal: spacing(16),
                    borderRadius: spacing(10),
                    marginBottom: spacing(6),
                  },
                  !canAffordAntibiotic && styles.payButtonDisabled,
                ]}
                onPress={() => handleTreatmentWithMoney('antibiotic')}
                disabled={!canAffordAntibiotic || isProcessing}
              >
                <Text style={[styles.payButtonText, { fontSize: textSizes.buttonText }]}>
                  💊 Antibiotic - {antibioticCost} Coins
                </Text>
                <Text
                  style={[styles.payButtonSubtext, { fontSize: fs(12), marginTop: spacing(2) }]}
                >
                  Health guarantee: 50% • You have: {pet.money} coins
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.adButton,
                  {
                    paddingVertical: spacing(12),
                    paddingHorizontal: spacing(16),
                    borderRadius: spacing(10),
                    marginBottom: spacing(8),
                  },
                  (!isAdReady || isProcessing) && styles.adButtonDisabled,
                ]}
                onPress={() => handleTreatmentWithAd('antibiotic')}
                disabled={!isAdReady || isProcessing}
              >
                <Text style={[styles.adButtonText, { fontSize: textSizes.buttonText }]}>
                  {isProcessing ? '⏳ Loading...' : '📺 Watch Ad (Free Antibiotic)'}
                </Text>
                {!isAdReady && !isProcessing && (
                  <Text
                    style={[styles.adButtonSubtext, { fontSize: fs(12), marginTop: spacing(2) }]}
                  >
                    Ad loading...
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            <Text style={[styles.orText, { fontSize: fs(13), marginVertical: spacing(6) }]}>
              OR
            </Text>

            {/* Anti-inflammatory treatment */}
            <TouchableOpacity
              style={[
                styles.payButton,
                {
                  paddingVertical: spacing(12),
                  paddingHorizontal: spacing(16),
                  borderRadius: spacing(10),
                },
                !canAffordAntiInflam && styles.payButtonDisabled,
              ]}
              onPress={() => handleTreatmentWithMoney('antiInflammatory')}
              disabled={!canAffordAntiInflam || isProcessing}
            >
              <Text style={[styles.payButtonText, { fontSize: textSizes.buttonText }]}>
                💉 Anti-inflammatory - {antiInflamCost} Coins
              </Text>
              <Text style={[styles.payButtonSubtext, { fontSize: fs(12), marginTop: spacing(2) }]}>
                Health guarantee: 80% • You have: {pet.money} coins
              </Text>
            </TouchableOpacity>
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
  benefitsSidebar: {
    position: 'absolute',
    right: 0,
    top: '25%',
    backgroundColor: 'rgba(46, 125, 50, 0.9)',
    borderRadius: 12,
    padding: 10,
    maxWidth: 110,
  },
  benefitsSidebarTitle: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
    textAlign: 'center',
  },
  benefitsSidebarText: {
    color: '#fff',
    fontSize: 11,
    marginVertical: 2,
  },
  paymentOptions: {
    marginBottom: 16,
  },
  payButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  payButtonDisabled: {
    backgroundColor: '#ccc',
    opacity: 0.6,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  payButtonSubtext: {
    color: '#fff',
    fontSize: 13,
    marginTop: 3,
    opacity: 0.9,
  },
  orText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
    marginVertical: 8,
    fontWeight: '600',
  },
  adButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  adButtonDisabled: {
    backgroundColor: '#ccc',
    opacity: 0.6,
  },
  adButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  adButtonSubtext: {
    color: '#fff',
    fontSize: 13,
    marginTop: 3,
    opacity: 0.9,
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
