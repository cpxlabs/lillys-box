import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useMultiPlayerMuito, MultiGamePhase } from '../context/MultiPlayerMuitoContext';
import { useAuth } from '../context/AuthContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { EmojiIcon } from '../components/EmojiIcon';
import { useGameBack } from '../hooks/useGameBack';
import { useGameAdTrigger } from '../components/GameAdWrapper';

type Props = NativeStackScreenProps<RootStackParamList, 'MuitoMultiGame'>;

export const MuitoMultiGameScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { user, isGuest } = useAuth();
  const {
    phase,
    puzzle,
    currentRound,
    totalRounds,
    scores,
    selectedAnswer,
    lastRoundResult,
    roundStartedAt,
    opponentDisconnected,
    submitAnswer,
    leaveRoom,
  } = useMultiPlayerMuito();
  const goBack = useGameBack(navigation);
  const { triggerAd } = useGameAdTrigger('muito-multi');
  const handleBack = () => {
    leaveRoom();
    goBack();
  };

  const myUserId = user?.id || (isGuest ? 'guest' : 'guest');
  const myScore = scores[myUserId] || 0;
  const opponentScore =
    Object.entries(scores).find(([id]) => id !== myUserId)?.[1] ?? 0;

  // ── navigate on phase change ─────────────────────────────────────
  useEffect(() => {
    if (phase === MultiGamePhase.RESULTS) {
      // Trigger ad before navigating to results
      (async () => {
        const reward = await triggerAd('game_ended', myScore);
        if (reward > 0) {
          // Reward will be processed on results screen
        }
        navigation.navigate('MuitoResults');
      })();
    }
  }, [phase, navigation, triggerAd, myScore]);

  useEffect(() => {
    if (opponentDisconnected) {
      navigation.navigate('MuitoLobby');
    }
  }, [opponentDisconnected, navigation]);

  // ── countdown timer synced to server's roundStartedAt ────────────
  const [timeLeft, setTimeLeft] = useState(10);

  useEffect(() => {
    if (!roundStartedAt) return;

    const ROUND_TIMEOUT = 10_000;
    const endTime = roundStartedAt + ROUND_TIMEOUT;

    const update = () => {
      const remaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
      setTimeLeft(remaining);
    };
    update(); // immediate first tick

    const interval = setInterval(() => {
      update();
      if (endTime - Date.now() <= 0) clearInterval(interval);
    }, 200);

    return () => clearInterval(interval);
  }, [roundStartedAt]);

  // ── answer handler ───────────────────────────────────────────────
  const handleSelect = useCallback(
    (option: number) => {
      if (selectedAnswer !== null) return;
      if (lastRoundResult) return; // round already resolved
      submitAnswer(option);
    },
    [selectedAnswer, lastRoundResult, submitAnswer]
  );

  // ── loading / waiting ────────────────────────────────────────────
  if (!puzzle) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.waitingHeader}>
          <TouchableOpacity
            onPress={handleBack}
            accessibilityRole="button"
            accessibilityLabel={t('common.back')}
          >
            <Text style={styles.backText}>{t('common.back')}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.centerContent}>
          <Text style={styles.waitingText}>{t('muito.multiplayer.waitingForRound')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ── derive button states ─────────────────────────────────────────
  const roundResolved = lastRoundResult !== null;
  const correctAnswer = lastRoundResult?.correctAnswer;

  return (
    <SafeAreaView style={styles.container}>
      {/* header: back button + round counter + timer */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBack}
          accessibilityRole="button"
          accessibilityLabel={t('common.back')}
        >
          <Text style={styles.backText}>{t('common.back')}</Text>
        </TouchableOpacity>
        <Text style={styles.roundText}>
          {t('muito.multiplayer.round', { current: currentRound, total: totalRounds })}
        </Text>
        <Text style={[styles.timerText, timeLeft <= 3 && styles.timerUrgent]}>
          {timeLeft}s
        </Text>
      </View>

      {/* live scores */}
      <View style={styles.scoresBar}>
        <Text style={styles.scoreMy}>
          {t('muito.multiplayer.you')}: {myScore}
        </Text>
        <Text style={styles.scoreDivider}>vs</Text>
        <Text style={styles.scoreOpponent}>
          {t('muito.multiplayer.opponent')}: {opponentScore}
        </Text>
      </View>

      {/* question */}
      <Text style={styles.question}>
        {t('muito.question', { emoji: puzzle.emoji })}
      </Text>

      {/* emoji grid */}
      <View style={styles.objectsCard}>
        <View style={styles.objectsGrid}>
          {Array.from({ length: puzzle.count }, (_, i) => (
            <EmojiIcon key={`emoji-${i}`} emoji={puzzle.emoji} size={36} style={styles.object} />
          ))}
        </View>
      </View>

      {/* round result feedback */}
      <View style={styles.feedbackContainer}>
        {roundResolved && (
          <Text
            style={[
              styles.feedback,
              lastRoundResult?.winnerId === myUserId
                ? styles.feedbackCorrect
                : lastRoundResult?.isTie
                  ? styles.feedbackTie
                  : styles.feedbackWrong,
            ]}
          >
            {lastRoundResult?.winnerId === myUserId
              ? t('muito.multiplayer.youWonRound')
              : lastRoundResult?.isTie
                ? t('muito.multiplayer.tieRound')
                : t('muito.multiplayer.opponentWonRound')}
          </Text>
        )}
      </View>

      {/* answer options */}
      <View style={styles.optionsContainer}>
        {puzzle.options.map((option, _idx) => {
          const buttonStyles: object[] = [styles.optionButton];
          const textStyles: object[] = [styles.optionText];

          if (roundResolved) {
            if (option === correctAnswer) {
              buttonStyles.push(styles.optionCorrect);
              textStyles.push(styles.optionTextSelected);
            } else if (option === selectedAnswer) {
              buttonStyles.push(styles.optionWrong);
              textStyles.push(styles.optionTextSelected);
            } else {
              buttonStyles.push(styles.optionDimmed);
            }
          } else if (selectedAnswer !== null) {
            if (option === selectedAnswer) {
              buttonStyles.push(styles.optionSelected);
              textStyles.push(styles.optionTextSelected);
            } else {
              buttonStyles.push(styles.optionDimmed);
            }
          }

          return (
            <TouchableOpacity
              key={option}
              style={buttonStyles}
              onPress={() => handleSelect(option)}
              activeOpacity={selectedAnswer !== null || roundResolved ? 1 : 0.85}
              disabled={selectedAnswer !== null || roundResolved}
              accessibilityRole="button"
              accessibilityLabel={`${t('muito.answerLabel')}: ${option}`}
            >
              <Text style={textStyles}>{option}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f0ff',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  waitingHeader: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  backText: {
    fontSize: 16,
    color: '#9b59b6',
    fontWeight: '600',
  },
  waitingText: {
    fontSize: 18,
    color: '#888',
    fontStyle: 'italic',
  },
  // ── header ────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 4,
  },
  roundText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#9b59b6',
  },
  timerText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#333',
  },
  timerUrgent: {
    color: '#e74c3c',
  },
  // ── scores ────────────────────────────────────────────────────────
  scoresBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  scoreMy: {
    fontSize: 18,
    fontWeight: '700',
    color: '#9b59b6',
  },
  scoreDivider: {
    fontSize: 14,
    color: '#aaa',
    fontWeight: '600',
  },
  scoreOpponent: {
    fontSize: 18,
    fontWeight: '700',
    color: '#e67e22',
  },
  // ── question & objects ────────────────────────────────────────────
  question: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  objectsCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginHorizontal: 20,
    padding: 20,
    minHeight: 140,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  objectsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 14,
    alignContent: 'center',
  },
  object: {
    fontSize: 38,
  },
  // ── feedback ──────────────────────────────────────────────────────
  feedbackContainer: {
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  feedback: {
    fontSize: 18,
    fontWeight: '700',
  },
  feedbackCorrect: {
    color: '#27ae60',
  },
  feedbackWrong: {
    color: '#e74c3c',
  },
  feedbackTie: {
    color: '#f39c12',
  },
  // ── answer buttons ────────────────────────────────────────────────
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 20,
    marginTop: 8,
  },
  optionButton: {
    width: '45%',
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  optionDimmed: {
    opacity: 0.4,
  },
  optionSelected: {
    backgroundColor: '#9b59b6',
  },
  optionCorrect: {
    backgroundColor: '#27ae60',
  },
  optionWrong: {
    backgroundColor: '#e74c3c',
  },
  optionText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
  },
  optionTextSelected: {
    color: '#fff',
  },
});
