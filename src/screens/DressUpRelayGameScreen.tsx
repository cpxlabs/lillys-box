import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useDressUpRelay } from '../context/DressUpRelayContext';
import { RootStackParamList } from '../types/navigation';
import { PetRenderer } from '../components/PetRenderer';
import { Pet, ClothingSlot } from '../types';
import { CLOTHING_ITEMS, getItemsBySlot } from '../data/clothingItems';
import * as Haptics from 'expo-haptics';

type Props = NativeStackScreenProps<RootStackParamList, 'DressUpRelayGame'>;

type GamePhase = 'preview' | 'countdown' | 'play' | 'result' | 'gameOver';

interface TargetOutfit {
  head: string | null;
  eyes: string | null;
  torso: string | null;
  paws: string | null;
}

interface ClothingItemDisplay {
  id: string;
  slot: ClothingSlot;
  name: string;
}

const TOTAL_ROUNDS = 5;
const PREVIEW_DURATION = 3000; // 3 seconds
const COUNTDOWN_DURATION = 3000; // 3 seconds (3, 2, 1)
const PLAY_DURATION = 20000; // 20 seconds for round 1

// Dummy pet for rendering outfits
const createDummyPet = (outfit: TargetOutfit): Pet => ({
  id: 'dummy',
  name: 'Dummy',
  type: 'cat',
  color: 'base',
  gender: 'other',
  hunger: 100,
  hygiene: 100,
  energy: 100,
  happiness: 100,
  health: 100,
  money: 0,
  clothes: { ...outfit },
  createdAt: Date.now(),
  lastUpdated: Date.now(),
});

// Generate a random target outfit
const generateTargetOutfit = (round: number): TargetOutfit => {
  const slots: ClothingSlot[] = ['head', 'eyes', 'torso', 'paws'];
  const outfit: TargetOutfit = { head: null, eyes: null, torso: null, paws: null };

  slots.forEach((slot) => {
    const items = getItemsBySlot(slot);
    if (items.length > 0) {
      const randomItem = items[Math.floor(Math.random() * items.length)];
      outfit[slot] = randomItem.id;
    }
  });

  return outfit;
};

// Generate clothing items for selection (target items + distractors)
const generateClothingItems = (target: TargetOutfit, round: number): ClothingItemDisplay[] => {
  const items: ClothingItemDisplay[] = [];
  const slots: ClothingSlot[] = ['head', 'eyes', 'torso', 'paws'];

  // Add all target items
  slots.forEach((slot) => {
    if (target[slot]) {
      const item = CLOTHING_ITEMS.find((i) => i.id === target[slot]);
      if (item) {
        items.push({ id: item.id, slot: item.slot, name: item.name || item.id });
      }
    }
  });

  // Add distractors (2-3 per slot, increasing with rounds)
  const distractorsPerSlot = Math.min(2 + Math.floor(round / 2), 3);
  slots.forEach((slot) => {
    const slotItems = getItemsBySlot(slot);
    const targetId = target[slot];
    const available = slotItems.filter((i) => i.id !== targetId);

    // Shuffle and pick distractors
    const shuffled = [...available].sort(() => Math.random() - 0.5);
    const distractors = shuffled.slice(0, distractorsPerSlot);

    distractors.forEach((item) => {
      items.push({ id: item.id, slot: item.slot, name: item.name || item.id });
    });
  });

  // Shuffle all items
  return items.sort(() => Math.random() - 0.5);
};

// Calculate score for a round
const calculateRoundScore = (
  playerOutfit: TargetOutfit,
  targetOutfit: TargetOutfit,
  timeRemaining: number
): { score: number; correctSlots: number } => {
  const slots: ClothingSlot[] = ['head', 'eyes', 'torso', 'paws'];
  let correctSlots = 0;

  slots.forEach((slot) => {
    if (playerOutfit[slot] === targetOutfit[slot]) {
      correctSlots++;
    }
  });

  let score = correctSlots * 25; // 25 points per correct slot
  const timeBonus = Math.floor(timeRemaining / 1000) * 2; // 2 points per second remaining
  score += timeBonus;

  // Perfect bonus
  if (correctSlots === 4) {
    score += 50;
  }

  return { score, correctSlots };
};

export const DressUpRelayGameScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { updateBestScore } = useDressUpRelay();

  const [phase, setPhase] = useState<GamePhase>('preview');
  const [round, setRound] = useState(1);
  const [totalScore, setTotalScore] = useState(0);
  const [targetOutfit, setTargetOutfit] = useState<TargetOutfit>(() => generateTargetOutfit(1));
  const [playerOutfit, setPlayerOutfit] = useState<TargetOutfit>({
    head: null,
    eyes: null,
    torso: null,
    paws: null,
  });
  const [clothingItems, setClothingItems] = useState<ClothingItemDisplay[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(PLAY_DURATION);
  const [countdownNumber, setCountdownNumber] = useState(3);
  const [roundScore, setRoundScore] = useState(0);
  const [correctSlots, setCorrectSlots] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const previewTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleSubmitRef = useRef<() => void>(() => {});

  const countdownAnim = useRef(new Animated.Value(1)).current;

  // Start preview phase
  useEffect(() => {
    if (phase === 'preview') {
      previewTimerRef.current = setTimeout(() => {
        setPhase('countdown');
      }, PREVIEW_DURATION);
    }

    return () => {
      if (previewTimerRef.current) clearTimeout(previewTimerRef.current);
    };
  }, [phase, round]);

  // Countdown phase
  useEffect(() => {
    if (phase === 'countdown') {
      setCountdownNumber(3);

      const interval = setInterval(() => {
        setCountdownNumber((prev) => {
          if (prev === 1) {
            clearInterval(interval);
            // Start play phase
            setTimeout(() => {
              setPhase('play');
              const items = generateClothingItems(targetOutfit, round);
              setClothingItems(items);
              setTimeRemaining(PLAY_DURATION - (round - 1) * 1000); // Reduce time by 1s per round
            }, 100);
            return 0;
          }
          // Haptic feedback
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          // Animate number
          countdownAnim.setValue(0);
          Animated.spring(countdownAnim, {
            toValue: 1,
            useNativeDriver: true,
            friction: 4,
          }).start();
          return prev - 1;
        });
      }, 1000);

      countdownTimerRef.current = interval;

      return () => {
        clearInterval(interval);
      };
    }
  }, [phase, targetOutfit, round, countdownAnim]);

  // Play phase timer
  useEffect(() => {
    if (phase === 'play') {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 100) {
            clearInterval(timerRef.current!);
            // Time's up - use ref to avoid stale closure
            handleSubmitRef.current();
            return 0;
          }
          // Haptic at 5 seconds
          if (prev === 5000) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          }
          return prev - 100;
        });
      }, 100);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase]);

  const handleEquipItem = useCallback((itemId: string, slot: ClothingSlot) => {
    setPlayerOutfit((prev) => ({
      ...prev,
      [slot]: prev[slot] === itemId ? null : itemId, // Toggle if same item
    }));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const handleSubmit = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    const { score, correctSlots: correct } = calculateRoundScore(
      playerOutfit,
      targetOutfit,
      timeRemaining
    );

    setRoundScore(score);
    setCorrectSlots(correct);
    setTotalScore((prev) => prev + score);
    setPhase('result');

    // Haptic feedback
    if (correct === 4) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else if (correct >= 2) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  }, [playerOutfit, targetOutfit, timeRemaining]);

  // Keep ref in sync so the timer interval always calls the latest handleSubmit
  handleSubmitRef.current = handleSubmit;

  const handleNextRound = useCallback(() => {
    if (round >= TOTAL_ROUNDS) {
      // Game over
      updateBestScore(totalScore + roundScore);
      setPhase('gameOver');
    } else {
      // Next round
      const nextRound = round + 1;
      const newTarget = generateTargetOutfit(nextRound);
      setRound(nextRound);
      setTargetOutfit(newTarget);
      setPlayerOutfit({ head: null, eyes: null, torso: null, paws: null });
      setPhase('preview');
    }
  }, [round, totalScore, roundScore, updateBestScore]);

  const handlePlayAgain = useCallback(() => {
    const newTarget = generateTargetOutfit(1);
    setPhase('preview');
    setRound(1);
    setTotalScore(0);
    setTargetOutfit(newTarget);
    setPlayerOutfit({ head: null, eyes: null, torso: null, paws: null });
    setClothingItems([]);
    setTimeRemaining(PLAY_DURATION);
    setRoundScore(0);
    setCorrectSlots(0);
  }, []);

  const targetPet = useMemo(() => createDummyPet(targetOutfit), [targetOutfit]);
  const playerPet = useMemo(() => createDummyPet(playerOutfit), [playerOutfit]);

  const filledSlots = useMemo(() => {
    const slots: ClothingSlot[] = ['head', 'eyes', 'torso', 'paws'];
    return slots.filter((slot) => playerOutfit[slot] !== null).length;
  }, [playerOutfit]);

  const canSubmit = filledSlots === 4;

  const timerColor = useMemo(() => {
    if (timeRemaining > 10000) return '#27ae60';
    if (timeRemaining > 5000) return '#f39c12';
    return '#e74c3c';
  }, [timeRemaining]);

  const screenWidth = Dimensions.get('window').width;
  const itemSize = (screenWidth - 60) / 4; // 4 items per row with padding

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel={t('common.back')}
        >
          <Text style={styles.backText}>{t('common.back')}</Text>
        </TouchableOpacity>
        <Text style={styles.headerStat}>
          {t('dressUpRelay.round')}: {round}/{TOTAL_ROUNDS}
        </Text>
        <Text style={styles.headerStat}>{totalScore}</Text>
      </View>

      {/* Preview Phase */}
      {phase === 'preview' && (
        <View style={styles.phaseContainer}>
          <Text style={styles.phaseTitle}>{t('dressUpRelay.memorize')}</Text>
          <View style={styles.petPreview}>
            <PetRenderer pet={targetPet} size={300} animationState="idle" />
          </View>
        </View>
      )}

      {/* Countdown Phase */}
      {phase === 'countdown' && (
        <View style={styles.phaseContainer}>
          {countdownNumber > 0 && (
            <Animated.Text
              style={[
                styles.countdownText,
                {
                  transform: [{ scale: countdownAnim }],
                  opacity: countdownAnim,
                },
              ]}
            >
              {countdownNumber}
            </Animated.Text>
          )}
        </View>
      )}

      {/* Play Phase */}
      {phase === 'play' && (
        <>
          {/* Timer Bar */}
          <View style={styles.timerContainer}>
            <View
              style={[
                styles.timerBar,
                {
                  width: `${(timeRemaining / (PLAY_DURATION - (round - 1) * 1000)) * 100}%`,
                  backgroundColor: timerColor,
                },
              ]}
            />
          </View>

          <Text style={styles.phaseTitle}>{t('dressUpRelay.dressYourPet')}</Text>
          <Text style={styles.timerText}>
            {t('dressUpRelay.timeLeft')}: {Math.ceil(timeRemaining / 1000)}s
          </Text>

          {/* Current outfit preview */}
          <View style={styles.currentOutfitPreview}>
            <PetRenderer pet={playerPet} size={180} animationState="idle" />
          </View>

          {/* Slot indicators */}
          <View style={styles.slotsContainer}>
            {(['head', 'eyes', 'torso', 'paws'] as ClothingSlot[]).map((slot) => (
              <View key={slot} style={styles.slotIndicator}>
                <Text style={styles.slotEmoji}>
                  {slot === 'head' ? '🎩' : slot === 'eyes' ? '👓' : slot === 'torso' ? '👕' : '👞'}
                </Text>
                <View
                  style={[
                    styles.slotDot,
                    playerOutfit[slot] && styles.slotDotFilled,
                  ]}
                />
              </View>
            ))}
          </View>

          {/* Clothing items grid */}
          <ScrollView style={styles.itemsScrollView} contentContainerStyle={styles.itemsContainer}>
            {clothingItems.map((item) => {
              const isSelected = playerOutfit[item.slot] === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.itemCard,
                    { width: itemSize, height: itemSize },
                    isSelected && styles.itemCardSelected,
                  ]}
                  onPress={() => handleEquipItem(item.id, item.slot)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.itemSlotBadge}>
                    {item.slot === 'head'
                      ? '🎩'
                      : item.slot === 'eyes'
                      ? '👓'
                      : item.slot === 'torso'
                      ? '👕'
                      : '👞'}
                  </Text>
                  <Text style={styles.itemName} numberOfLines={2}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Submit button */}
          {canSubmit && (
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              activeOpacity={0.85}
            >
              <Text style={styles.submitButtonText}>{t('colorMixer.check')}</Text>
            </TouchableOpacity>
          )}
        </>
      )}

      {/* Result Phase */}
      {phase === 'result' && (
        <View style={styles.phaseContainer}>
          <Text style={styles.resultTitle}>
            {correctSlots === 4 ? t('dressUpRelay.perfect') : t('dressUpRelay.correct')}
          </Text>

          <View style={styles.resultComparison}>
            <View style={styles.resultColumn}>
              <Text style={styles.resultLabel}>{t('dressUpRelay.target')}</Text>
              <PetRenderer pet={targetPet} size={140} animationState="idle" />
            </View>
            <View style={styles.resultColumn}>
              <Text style={styles.resultLabel}>{t('dressUpRelay.yourOutfit')}</Text>
              <PetRenderer pet={playerPet} size={140} animationState="idle" />
            </View>
          </View>

          {/* Slot results */}
          <View style={styles.slotResults}>
            {(['head', 'eyes', 'torso', 'paws'] as ClothingSlot[]).map((slot) => {
              const isCorrect = playerOutfit[slot] === targetOutfit[slot];
              return (
                <View key={slot} style={styles.slotResult}>
                  <Text style={styles.slotResultEmoji}>
                    {slot === 'head' ? '🎩' : slot === 'eyes' ? '👓' : slot === 'torso' ? '👕' : '👞'}
                  </Text>
                  <Text style={[styles.slotResultText, isCorrect && styles.slotResultCorrect]}>
                    {isCorrect ? '✓' : '✗'}
                  </Text>
                </View>
              );
            })}
          </View>

          <Text style={styles.resultScore}>+{roundScore}</Text>

          <TouchableOpacity style={styles.nextButton} onPress={handleNextRound} activeOpacity={0.85}>
            <Text style={styles.nextButtonText}>
              {round >= TOTAL_ROUNDS ? t('dressUpRelay.gameOver.title') : t('dressUpRelay.nextRound')}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Game Over Phase */}
      {phase === 'gameOver' && (
        <View style={styles.overlay}>
          <View style={styles.overlayCard}>
            <Text style={styles.overlayTitle}>{t('dressUpRelay.gameOver.title')}</Text>

            <View style={styles.overlayStats}>
              <Text style={styles.overlayStat}>
                {t('dressUpRelay.gameOver.roundsCompleted')}: {TOTAL_ROUNDS}/{TOTAL_ROUNDS}
              </Text>
              <Text style={styles.overlayScore}>
                {t('dressUpRelay.gameOver.totalScore')}: {totalScore + roundScore}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.playAgainButton}
              onPress={handlePlayAgain}
              activeOpacity={0.85}
            >
              <Text style={styles.playAgainText}>{t('dressUpRelay.gameOver.playAgain')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.backToHomeButton} onPress={() => navigation.goBack()}>
              <Text style={styles.backToHomeText}>{t('common.back')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fce4ec',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backText: {
    fontSize: 16,
    color: '#ec4899',
    fontWeight: '600',
  },
  headerStat: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ec4899',
  },
  phaseContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  phaseTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ec4899',
    marginBottom: 16,
    textAlign: 'center',
  },
  petPreview: {
    marginTop: 20,
  },
  countdownText: {
    fontSize: 72,
    fontWeight: '900',
    color: '#ec4899',
  },
  timerContainer: {
    height: 8,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 20,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  timerBar: {
    height: '100%',
    borderRadius: 4,
  },
  timerText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ec4899',
    textAlign: 'center',
    marginBottom: 12,
  },
  currentOutfitPreview: {
    alignItems: 'center',
    marginBottom: 12,
  },
  slotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  slotIndicator: {
    alignItems: 'center',
    gap: 4,
  },
  slotEmoji: {
    fontSize: 20,
  },
  slotDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ddd',
  },
  slotDotFilled: {
    backgroundColor: '#27ae60',
  },
  itemsScrollView: {
    flex: 1,
  },
  itemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  itemCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  itemCardSelected: {
    borderColor: '#ec4899',
    backgroundColor: '#ffe4f0',
  },
  itemSlotBadge: {
    fontSize: 24,
    marginBottom: 4,
  },
  itemName: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
    fontWeight: '600',
  },
  submitButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#ec4899',
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: 'center',
    shadowColor: '#ec4899',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ec4899',
    marginBottom: 24,
    textAlign: 'center',
  },
  resultComparison: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 24,
  },
  resultColumn: {
    alignItems: 'center',
  },
  resultLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  slotResults: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 24,
  },
  slotResult: {
    alignItems: 'center',
  },
  slotResultEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  slotResultText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#e74c3c',
  },
  slotResultCorrect: {
    color: '#27ae60',
  },
  resultScore: {
    fontSize: 36,
    fontWeight: '800',
    color: '#ec4899',
    marginBottom: 24,
  },
  nextButton: {
    backgroundColor: '#ec4899',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 28,
    shadowColor: '#ec4899',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  overlayCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 32,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  overlayTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ec4899',
    marginBottom: 20,
  },
  overlayStats: {
    alignItems: 'center',
    marginBottom: 24,
    gap: 8,
  },
  overlayStat: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  overlayScore: {
    fontSize: 24,
    color: '#ec4899',
    fontWeight: '800',
    marginTop: 8,
  },
  playAgainButton: {
    backgroundColor: '#ec4899',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 28,
    marginBottom: 12,
    shadowColor: '#ec4899',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  playAgainText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  backToHomeButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  backToHomeText: {
    fontSize: 16,
    color: '#ec4899',
    fontWeight: '600',
  },
});
