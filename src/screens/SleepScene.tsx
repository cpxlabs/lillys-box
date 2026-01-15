import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  SafeAreaView,
} from 'react-native';
import { usePet } from '../context/PetContext';
import { GAME_BALANCE } from '../config/gameBalance';
import { ScreenNavigationProp } from '../types/navigation';
import { StatusCard } from '../components/StatusCard';
import { ScreenHeader } from '../components/ScreenHeader';
import { calculatePetAge } from '../utils/age';
import { useBackButton } from '../hooks/useBackButton';

type Props = {
  navigation: ScreenNavigationProp<'Sleep'>;
};

export const SleepScene: React.FC<Props> = ({ navigation }) => {
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
        <Animated.View style={[styles.petContainer, { opacity: fadeAnim }]}>
          <Text style={styles.sleepText}>💤</Text>
          <Text style={styles.petName}>
            {isSleeping ? `${pet.name} is sleeping...` : `${pet.name} needs rest`}
          </Text>
          {!isSleeping && !canSleep && (
            <Text style={styles.notTiredText}>Not tired enough to sleep</Text>
          )}
        </Animated.View>

        {isSleeping ? (
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              Sleeping... {Math.round(sleepProgress)}%
            </Text>
            <View style={styles.progressBar}>
              <View
                style={[styles.progressFill, { width: `${sleepProgress}%` }]}
              />
            </View>
            <Text style={styles.durationText}>
              {Math.round((SLEEP_DURATION / 1000) * (1 - sleepProgress / 100))}s
              remaining
            </Text>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancelSleep}
            >
              <Text style={styles.cancelButtonText}>Wake Up Early</Text>
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
                  ? `💤 Sleep (${SLEEP_DURATION / 1000}s)`
                  : '⚡ Energy is high'}
              </Text>
            </TouchableOpacity>

            {canSleep && (
              <View style={styles.benefitsContainer}>
                <Text style={styles.benefitsTitle}>Sleep Benefits:</Text>
                <Text style={styles.benefitsText}>
                  ⚡ Energy +{GAME_BALANCE.activities.sleep.energy}
                </Text>
                <Text style={styles.benefitsText}>
                  😊 Happiness +{GAME_BALANCE.activities.sleep.happiness}
                </Text>
                <Text style={styles.benefitsText}>
                  🍖 Hunger {GAME_BALANCE.activities.sleep.hunger}
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backButtonText}>Back</Text>
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
  petContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  sleepText: {
    fontSize: 80,
    marginBottom: 20,
  },
  petName: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
  notTiredText: {
    fontSize: 16,
    color: '#FFA726',
    marginTop: 10,
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
  benefitsContainer: {
    marginTop: 30,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    width: '100%',
  },
  benefitsTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  benefitsText: {
    color: '#fff',
    fontSize: 16,
    marginVertical: 4,
    textAlign: 'center',
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
