import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
  Animated,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSimonSays } from '../context/SimonSaysContext';
import { ScreenNavigationProp } from '../types/navigation';
import * as Haptics from 'expo-haptics';

type Props = {
  navigation: ScreenNavigationProp<'SimonSaysGame'>;
};

type ColorId = 0 | 1 | 2 | 3;

const COLORS = [
  { id: 0, name: 'red', color: '#e74c3c', lightColor: '#ff6b6b' },
  { id: 1, name: 'blue', color: '#3498db', lightColor: '#74b9ff' },
  { id: 2, name: 'green', color: '#27ae60', lightColor: '#55efc4' },
  { id: 3, name: 'yellow', color: '#f1c40f', lightColor: '#ffeaa7' },
];

type GamePhase = 'ready' | 'showing' | 'playing' | 'correct' | 'wrong' | 'gameOver';

export const SimonSaysGameScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { bestScore, updateBestScore } = useSimonSays();

  const [sequence, setSequence] = useState<ColorId[]>([]);
  const [playerSequence, setPlayerSequence] = useState<ColorId[]>([]);
  const [currentRound, setCurrentRound] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [phase, setPhase] = useState<GamePhase>('ready');
  const [activeButton, setActiveButton] = useState<ColorId | null>(null);
  const [showGameOver, setShowGameOver] = useState(false);
  const [isNewRecord, setIsNewRecord] = useState(false);

  // Use refs to avoid stale closures in setTimeout callbacks
  const sequenceRef = useRef<ColorId[]>([]);
  const currentRoundRef = useRef<number>(0);
  const bestScoreRef = useRef<number>(bestScore);

  const scaleAnims = useRef(COLORS.map(() => new Animated.Value(1))).current;

  // Keep bestScoreRef in sync
  useEffect(() => {
    bestScoreRef.current = bestScore;
  }, [bestScore]);

  const animateButton = useCallback((colorId: ColorId) => {
    Animated.sequence([
      Animated.spring(scaleAnims[colorId], {
        toValue: 1.05,
        useNativeDriver: true,
        speed: 50,
      }),
      Animated.spring(scaleAnims[colorId], {
        toValue: 1,
        useNativeDriver: true,
        speed: 50,
      }),
    ]).start();
  }, [scaleAnims]);

  const activateButton = useCallback(async (colorId: ColorId, duration: number) => {
    setActiveButton(colorId);
    animateButton(colorId);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    return new Promise((resolve) => {
      setTimeout(() => {
        setActiveButton(null);
        resolve(true);
      }, duration);
    });
  }, [animateButton]);

  const playSequence = useCallback(async (seq: ColorId[], round: number) => {
    const delay = round >= 10 ? 600 : 1000;

    for (let i = 0; i < seq.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, delay));
      await activateButton(seq[i], 300);
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
    setPhase('playing');
  }, [activateButton]);

  const startNewRound = useCallback(() => {
    const newColor = Math.floor(Math.random() * 4) as ColorId;
    const newSequence = [...sequenceRef.current, newColor];
    const newRound = currentRoundRef.current + 1;

    sequenceRef.current = newSequence;
    currentRoundRef.current = newRound;

    setSequence(newSequence);
    setPlayerSequence([]);
    setCurrentRound(newRound);
    setPhase('showing');

    setTimeout(() => {
      playSequence(newSequence, newRound);
    }, 1000);
  }, [playSequence]);

  const endGame = useCallback(() => {
    // currentRound is the round where the player failed, so completed = currentRound - 1
    const roundsCompleted = currentRoundRef.current - 1;
    const finalScore = Math.max(0, roundsCompleted);
    const newRecord = finalScore > bestScoreRef.current;

    setScore(finalScore);
    setIsNewRecord(newRecord);
    updateBestScore(finalScore);
    setPhase('gameOver');
    setShowGameOver(true);
  }, [updateBestScore]);

  const handleButtonPress = useCallback(async (colorId: ColorId) => {
    if (phase !== 'playing') return;

    const newPlayerSequence = [...playerSequence, colorId];
    setPlayerSequence(newPlayerSequence);

    await activateButton(colorId, 200);

    // Check if the input is correct
    if (colorId !== sequenceRef.current[newPlayerSequence.length - 1]) {
      // Wrong!
      setPhase('wrong');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setTimeout(() => {
        endGame();
      }, 1000);
      return;
    }

    // Check if sequence is complete
    if (newPlayerSequence.length === sequenceRef.current.length) {
      // Correct! Move to next round
      setPhase('correct');
      const newScore = currentRoundRef.current;
      setScore(newScore);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      setTimeout(() => {
        startNewRound();
      }, 1500);
    }
  }, [phase, playerSequence, activateButton, endGame, startNewRound]);

  useEffect(() => {
    startNewRound();
  }, []);

  const handlePlayAgain = useCallback(() => {
    sequenceRef.current = [];
    currentRoundRef.current = 0;

    setSequence([]);
    setPlayerSequence([]);
    setCurrentRound(0);
    setScore(0);
    setIsNewRecord(false);
    setPhase('ready');
    setShowGameOver(false);
    setTimeout(() => {
      startNewRound();
    }, 500);
  }, [startNewRound]);

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const getStatusMessage = () => {
    switch (phase) {
      case 'ready':
        return t('simonSays.getReady');
      case 'showing':
        return t('simonSays.watch');
      case 'playing':
        return t('simonSays.yourTurn');
      case 'correct':
        return t('simonSays.correct');
      case 'wrong':
        return t('simonSays.wrong');
      default:
        return '';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} accessibilityRole="button">
          <Text style={styles.backText}>← {t('common.back')}</Text>
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <Text style={styles.headerText}>
            {t('simonSays.round')}: {currentRound}
          </Text>
          <Text style={styles.headerText}>
            {t('simonSays.score')}: {score}
          </Text>
        </View>
      </View>

      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>{getStatusMessage()}</Text>
      </View>

      <View style={styles.buttonGrid}>
        {COLORS.map((colorData) => (
          <Animated.View
            key={colorData.id}
            style={[
              styles.buttonWrapper,
              { transform: [{ scale: scaleAnims[colorData.id] }] },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.colorButton,
                {
                  backgroundColor:
                    activeButton === colorData.id
                      ? colorData.lightColor
                      : colorData.color,
                },
              ]}
              onPress={() => handleButtonPress(colorData.id as ColorId)}
              disabled={phase !== 'playing'}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={`${colorData.name} button`}
            />
          </Animated.View>
        ))}
      </View>

      {/* Game Over Modal */}
      <Modal
        visible={showGameOver}
        transparent
        animationType="fade"
        onRequestClose={handleBack}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{t('simonSays.gameOver.title')}</Text>

            <View style={styles.scoreSection}>
              <Text style={styles.scoreLabel}>
                {t('simonSays.gameOver.roundsCompleted')}
              </Text>
              <Text style={styles.scoreValue}>{score}</Text>
            </View>

            {isNewRecord && (
              <Text style={styles.newRecord}>🎉 {t('simonSays.gameOver.newRecord')}</Text>
            )}

            <TouchableOpacity
              style={styles.playAgainButton}
              onPress={handlePlayAgain}
              activeOpacity={0.85}
            >
              <Text style={styles.playAgainButtonText}>
                {t('simonSays.gameOver.playAgain')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleBack} style={styles.backButtonModal}>
              <Text style={styles.backButtonModalText}>{t('common.back')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f0ff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  backText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e74c3c',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 16,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#e74c3c',
  },
  statusContainer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
  },
  buttonGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    gap: 16,
    maxWidth: 400,
    alignSelf: 'center',
  },
  buttonWrapper: {
    width: '45%',
    aspectRatio: 1,
  },
  colorButton: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 32,
    width: '100%',
    maxWidth: 340,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#e74c3c',
    marginBottom: 24,
  },
  scoreSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  scoreLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: '800',
    color: '#e74c3c',
  },
  newRecord: {
    fontSize: 16,
    fontWeight: '600',
    color: '#27ae60',
    marginBottom: 16,
  },
  playAgainButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 28,
    shadowColor: '#e74c3c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    marginTop: 8,
  },
  playAgainButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  backButtonModal: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    marginTop: 12,
  },
  backButtonModalText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e74c3c',
  },
});
