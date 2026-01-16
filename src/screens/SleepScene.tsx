import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  SafeAreaView,
} from 'react-native';
import ReanimatedView, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { usePet } from '../context/PetContext';
import { GAME_BALANCE } from '../config/gameBalance';
import { ScreenNavigationProp } from '../types/navigation';
import { StatusCard } from '../components/StatusCard';
import { ScreenHeader } from '../components/ScreenHeader';
import { PetRenderer } from '../components/PetRenderer';
import { calculatePetAge } from '../utils/age';
import { useBackButton } from '../hooks/useBackButton';

// Animated floating Z component for sleeping state
const FloatingZ: React.FC = () => {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(-30, { duration: 1500 }),
        withTiming(0, { duration: 1500 })
      ),
      -1,
      false
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.4, { duration: 1500 }),
        withTiming(1, { duration: 1500 })
      ),
      -1,
      false
    );
    scale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 1500 }),
        withTiming(1, { duration: 1500 })
      ),
      -1,
      false
    );
  }, [translateY, opacity, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <ReanimatedView.View style={[styles.floatingZContainer, animatedStyle]}>
      <Text style={styles.floatingZ}>Z</Text>
      <Text style={[styles.floatingZ, styles.floatingZSmall]}>z</Text>
      <Text style={[styles.floatingZ, styles.floatingZTiny]}>z</Text>
    </ReanimatedView.View>
  );
};

type Props = {
  navigation: ScreenNavigationProp<'Sleep'>;
};

export const SleepScene: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { pet, sleep, cancelSleep: cancelSleepContext } = usePet();
  const [isSleeping, setIsSleeping] = useState(false);
  const [sleepProgress, setSleepProgress] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(1));
  const progressIntervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const BackButtonIcon = useBackButton();

  const SLEEP_DURATION = GAME_BALANCE.activities.sleep.duration;

  const startSleep = async () => {
    if (!pet) return;

    setIsSleeping(true);
    setSleepProgress(0);

    // Fade out effect
    Animated.timing(fadeAnim, {
      toValue: 0.3,
      duration: 2000,
      useNativeDriver: true,
    }).start();

    // Progress bar update
    const updateInterval = 100; // Update every 100ms
    const progressIncrement = (100 / (SLEEP_DURATION / updateInterval));

    progressIntervalRef.current = setInterval(() => {
      setSleepProgress((prev) => {
        const newProgress = prev + progressIncrement;
        if (newProgress >= 100) {
          return 100;
        }
        return newProgress;
      });
    }, updateInterval);

    // Execute sleep
    const result = await sleep(SLEEP_DURATION);

    // Clean up interval
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }

    // Fade back in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();

    setIsSleeping(false);

    // Return to home after a brief pause
    setTimeout(() => {
      navigation.goBack();
    }, 500);
  };

  const handleCancelSleep = () => {
    // Call context's cancelSleep to actually cancel the operation
    cancelSleepContext();

    // Clean up interval
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }

    // UI state will be updated when sleep promise resolves
  };

  if (!pet) return null;

  const petAge = calculatePetAge(pet.createdAt);
  const petNameDisplay = `${pet.type === 'cat' ? '🐱' : '🐶'} ${pet.name}`;
  const petAgeDisplay = `${petAge} ${petAge === 1 ? 'ano' : 'anos'}`;

  const canSleep = pet.energy < GAME_BALANCE.thresholds.energyForSleep;

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title="💤 Dormir"
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

      <View style={styles.content}>
        {/* Main area with pet */}
        <View style={styles.mainArea}>
          <View style={styles.petWrapper}>
            {/* Pet with dark overlay when sleeping */}
            <Animated.View style={[styles.petDisplay, { opacity: fadeAnim }]}>
              <PetRenderer pet={pet} animationState="idle" size={280} />
            </Animated.View>
            {/* Floating Z animation when sleeping */}
            {isSleeping && <FloatingZ />}
          </View>

          <Text style={styles.petName}>
            {isSleeping ? t('sleep.sleeping', { name: pet.name }) : t('sleep.needsRest', { name: pet.name })}
          </Text>
          {!isSleeping && !canSleep && (
            <Text style={styles.notTiredText}>{t('sleep.notTired')}</Text>
          )}
        </View>

        {/* Benefits sidebar on the right */}
        {canSleep && !isSleeping && (
          <View style={styles.benefitsSidebar}>
            <Text style={styles.benefitsSidebarTitle}>{t('sleep.benefits')}</Text>
            <Text style={styles.benefitsSidebarText}>
              +{GAME_BALANCE.activities.sleep.energy} Energy
            </Text>
            <Text style={styles.benefitsSidebarText}>
              +{GAME_BALANCE.activities.sleep.happiness} Happiness
            </Text>
            <Text style={styles.benefitsSidebarText}>
              {GAME_BALANCE.activities.sleep.hunger} Hunger
            </Text>
          </View>
        )}

        {isSleeping ? (
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              {t('sleep.progress', { progress: Math.round(sleepProgress) })}
            </Text>
            <View style={styles.progressBar}>
              <View
                style={[styles.progressFill, { width: `${sleepProgress}%` }]}
              />
            </View>
            <Text style={styles.durationText}>
              {t('sleep.remaining', { seconds: Math.round((SLEEP_DURATION / 1000) * (1 - sleepProgress / 100)) })}
            </Text>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancelSleep}
            >
              <Text style={styles.cancelButtonText}>{t('sleep.wakeUpEarly')}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.sleepButton,
                !canSleep && styles.sleepButtonDisabled,
              ]}
              onPress={startSleep}
              disabled={!canSleep}
            >
              <Text style={styles.sleepButtonText}>
                {canSleep
                  ? t('sleep.sleepButton', { duration: SLEEP_DURATION / 1000 })
                  : t('sleep.energyHigh')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backButtonText}>{t('common.back')}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  mainArea: {
    alignItems: 'center',
    marginBottom: 20,
  },
  petWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  petDisplay: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingZContainer: {
    position: 'absolute',
    top: -20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  floatingZ: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFD54F',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  floatingZSmall: {
    fontSize: 36,
    marginLeft: 4,
    marginTop: 10,
  },
  floatingZTiny: {
    fontSize: 24,
    marginLeft: 4,
    marginTop: 18,
  },
  petName: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 16,
  },
  notTiredText: {
    fontSize: 16,
    color: '#FFA726',
    marginTop: 10,
    textAlign: 'center',
  },
  benefitsSidebar: {
    position: 'absolute',
    right: 8,
    top: '35%',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 12,
    maxWidth: 120,
  },
  benefitsSidebarTitle: {
    color: '#FFD54F',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  benefitsSidebarText: {
    color: '#fff',
    fontSize: 12,
    marginVertical: 3,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  sleepButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 12,
    minWidth: 200,
    alignItems: 'center',
  },
  sleepButtonDisabled: {
    backgroundColor: '#666',
    opacity: 0.5,
  },
  sleepButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  backButton: {
    marginTop: 20,
    padding: 12,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.7,
  },
  progressContainer: {
    alignItems: 'center',
    width: '100%',
  },
  progressText: {
    color: '#fff',
    fontSize: 20,
    marginBottom: 16,
    fontWeight: '600',
  },
  progressBar: {
    width: '100%',
    height: 24,
    backgroundColor: '#333',
    borderRadius: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFD54F',
    borderRadius: 12,
  },
  durationText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
    opacity: 0.8,
  },
  cancelButton: {
    marginTop: 30,
    padding: 12,
  },
  cancelButtonText: {
    color: '#FFA726',
    fontSize: 16,
    fontWeight: '600',
  },
});
