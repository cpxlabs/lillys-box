import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
  Dimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemoryMatch, Difficulty, Mode } from '../context/MemoryMatchContext';
import { RootStackParamList } from '../types/navigation';
import { EmojiIcon } from '../components/EmojiIcon';
import { useGameBack } from '../hooks/useGameBack';
import { useGameAdTrigger } from '../components/GameAdWrapper';

type Props = NativeStackScreenProps<RootStackParamList, 'MemoryMatchGame'>;

const ALL_EMOJIS = [
  '🐱', '🐶', '🐰', '🐹', '🐦', '🐢', '🦋', '🐠',
  '🦊', '🐸', '🦁', '🐨', '🐧', '🦄', '🐯', '🦉',
  '🍎', '🍊', '🍋', '🍇', '🍓', '🍦', '🥕', '🍪',
];

const TIME_ATTACK_SECONDS = 60;

interface GridConfig {
  cols: number;
  rows: number;
  pairs: number;
}

const GRID_CONFIG: Record<Difficulty, GridConfig> = {
  easy:   { cols: 3, rows: 2, pairs: 3 },
  medium: { cols: 4, rows: 3, pairs: 6 },
  hard:   { cols: 4, rows: 4, pairs: 8 },
  expert: { cols: 5, rows: 4, pairs: 10 },
};

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

function createDeck(pairs: number): Card[] {
  const shuffled = [...ALL_EMOJIS];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const selected = shuffled.slice(0, pairs);
  const cards: Card[] = [];

  selected.forEach((emoji, index) => {
    cards.push({ id: index * 2, emoji, isFlipped: false, isMatched: false });
    cards.push({ id: index * 2 + 1, emoji, isFlipped: false, isMatched: false });
  });

  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }

  return cards;
}

function calculateClassicScore(moves: number, pairs: number, elapsedSeconds: number): number {
  const maxMoves = pairs * 3;
  const moveScore = Math.max(0, (maxMoves - moves) * 10);
  const timeLimit = pairs * 15;
  const timeBonus = Math.max(0, timeLimit - elapsedSeconds);
  return moveScore + timeBonus;
}

function calculateTimeAttackScore(matchedPairs: number, remainingSeconds: number): number {
  return matchedPairs * 20 + remainingSeconds;
}

function calculateStars(moves: number, pairs: number): number {
  if (moves <= pairs + 1) return 3;
  if (moves <= pairs * 2) return 2;
  return 1;
}

function calculateTimeAttackStars(matchedPairs: number, pairs: number): number {
  if (matchedPairs === pairs) return 3;
  if (matchedPairs >= Math.ceil(pairs * 0.6)) return 2;
  return 1;
}

export const MemoryMatchGameScreen: React.FC<Props> = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { updateBestScore } = useMemoryMatch();
  const handleBack = useGameBack(navigation);
  const { triggerAd } = useGameAdTrigger('memory-match');
  const difficulty = route.params.difficulty as Difficulty;
  const mode = route.params.mode as Mode;
  const config = GRID_CONFIG[difficulty];
  const isTimeAttack = mode === 'timeAttack';

  const [cards, setCards] = useState<Card[]>(() => createDeck(config.pairs));
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [remainingTime, setRemainingTime] = useState(TIME_ATTACK_SECONDS);
  const [adRewardPending, setAdRewardPending] = useState(false);
  const lockRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const matchedPairsRef = useRef(0);

  const flipAnims = useRef<Animated.Value[]>(
    cards.map(() => new Animated.Value(0))
  ).current;

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (isTimeAttack) {
        setRemainingTime((prev) => Math.max(0, prev - 1));
      } else {
        setElapsedTime((prev) => prev + 1);
      }
    }, 1000);
  }, [isTimeAttack]);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTimer]);

  useEffect(() => {
    if (gameOver && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [gameOver]);

  useEffect(() => {
    matchedPairsRef.current = matchedPairs;
  }, [matchedPairs]);

  // Time attack: timer ran out
  useEffect(() => {
    if (isTimeAttack && remainingTime === 0 && !gameOver) {
      if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
      const score = calculateTimeAttackScore(matchedPairsRef.current, 0);
      updateBestScore(difficulty, mode, score);
      setGameOver(true);
    }
  }, [remainingTime, isTimeAttack, gameOver, difficulty, mode, updateBestScore]);

  // Classic mode completion
  useEffect(() => {
    if (!isTimeAttack && matchedPairs === config.pairs && matchedPairs > 0) {
      const score = calculateClassicScore(moves, config.pairs, elapsedTime);
      updateBestScore(difficulty, mode, score);
      setGameOver(true);
    }
  }, [matchedPairs, config.pairs, moves, elapsedTime, difficulty, mode, isTimeAttack, updateBestScore]);

  // Time attack all pairs matched
  useEffect(() => {
    if (isTimeAttack && matchedPairs === config.pairs && matchedPairs > 0 && !gameOver) {
      const score = calculateTimeAttackScore(matchedPairs, remainingTime);
      updateBestScore(difficulty, mode, score);
      setGameOver(true);
    }
  }, [matchedPairs, config.pairs, remainingTime, isTimeAttack, difficulty, mode, gameOver, updateBestScore]);

  const flipCard = useCallback(
    (index: number, toFaceUp: boolean) => {
      Animated.timing(flipAnims[index], {
        toValue: toFaceUp ? 1 : 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    },
    [flipAnims]
  );

  const handleCardPress = useCallback(
    (index: number) => {
      if (lockRef.current) return;
      if (cards[index].isFlipped || cards[index].isMatched) return;
      if (selectedIndices.length >= 2) return;

      const newCards = [...cards];
      newCards[index] = { ...newCards[index], isFlipped: true };
      setCards(newCards);
      flipCard(index, true);

      const newSelected = [...selectedIndices, index];
      setSelectedIndices(newSelected);

      if (newSelected.length === 2) {
        setMoves((prev) => prev + 1);
        const [first, second] = newSelected;

        if (newCards[first].emoji === newCards[second].emoji) {
          const matchedCards = [...newCards];
          matchedCards[first] = { ...matchedCards[first], isMatched: true };
          matchedCards[second] = { ...matchedCards[second], isMatched: true };
          setCards(matchedCards);
          setMatchedPairs((prev) => prev + 1);
          setSelectedIndices([]);
        } else {
          lockRef.current = true;
          setTimeout(() => {
            const resetCards = [...newCards];
            resetCards[first] = { ...resetCards[first], isFlipped: false };
            resetCards[second] = { ...resetCards[second], isFlipped: false };
            setCards(resetCards);
            flipCard(first, false);
            flipCard(second, false);
            setSelectedIndices([]);
            lockRef.current = false;
          }, 800);
        }
      }
    },
    [cards, selectedIndices, flipCard]
  );

  const handlePlayAgain = useCallback(() => {
    const newCards = createDeck(config.pairs);
    flipAnims.forEach((anim) => anim.setValue(0));
    setCards(newCards);
    setSelectedIndices([]);
    setMoves(0);
    setMatchedPairs(0);
    matchedPairsRef.current = 0;
    setGameOver(false);
    setElapsedTime(0);
    setRemainingTime(TIME_ATTACK_SECONDS);
    lockRef.current = false;
    startTimer();
  }, [config.pairs, flipAnims, startTimer]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const screenWidth = Dimensions.get('window').width;
  const gridPadding = 16;
  const cardGap = 6;
  const availableWidth = screenWidth - gridPadding * 2 - cardGap * (config.cols - 1);
  const cardSize = Math.floor(availableWidth / config.cols);

  const timerColor = isTimeAttack && remainingTime <= 10 ? '#e74c3c' : '#9b59b6';

  const renderCard = (card: Card, index: number) => {
    const frontInterpolate = flipAnims[index].interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: ['0deg', '90deg', '0deg'],
    });

    const isRevealed = card.isFlipped || card.isMatched;

    return (
      <TouchableOpacity
        key={card.id}
        style={[
          styles.card,
          { width: cardSize, height: cardSize },
          card.isMatched && styles.cardMatched,
        ]}
        onPress={() => handleCardPress(index)}
        activeOpacity={isRevealed ? 1 : 0.7}
        disabled={isRevealed || lockRef.current}
        accessibilityRole="button"
        accessibilityLabel={
          isRevealed
            ? `${card.emoji} ${card.isMatched ? t('memoryMatch.matched') : ''}`
            : t('memoryMatch.cardFaceDown')
        }
      >
        <Animated.View
          style={[
            styles.cardInner,
            { transform: [{ rotateY: frontInterpolate }] },
          ]}
        >
          {isRevealed ? (
            <EmojiIcon emoji={card.emoji} size={cardSize * 0.45} />
          ) : (
            <Text style={[styles.cardBack, { fontSize: cardSize * 0.35 }]}>?</Text>
          )}
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const rows: Card[][] = [];
  for (let r = 0; r < config.rows; r++) {
    rows.push(cards.slice(r * config.cols, (r + 1) * config.cols));
  }

  const finalScore = useMemo(() => {
    if (isTimeAttack) return calculateTimeAttackScore(matchedPairs, remainingTime);
    return calculateClassicScore(moves, config.pairs, elapsedTime);
  }, [isTimeAttack, matchedPairs, remainingTime, moves, config.pairs, elapsedTime]);

  const finalStars = useMemo(() => {
    if (isTimeAttack) return calculateTimeAttackStars(matchedPairs, config.pairs);
    return calculateStars(moves, config.pairs);
  }, [isTimeAttack, matchedPairs, config.pairs, moves]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => handleBack()}
          accessibilityRole="button"
          accessibilityLabel={t('common.back')}
        >
          <Text style={styles.backText}>{t('common.back')}</Text>
        </TouchableOpacity>
        <View style={styles.headerStats}>
          {isTimeAttack ? (
            <>
              <Text style={[styles.headerStat, { color: timerColor }]}>
                ⏱ {formatTime(remainingTime)}
              </Text>
              <Text style={styles.headerStat}>
                {matchedPairs}/{config.pairs}
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.headerStat}>
                {t('memoryMatch.moves')}: {moves}
              </Text>
              <Text style={styles.headerStat}>{formatTime(elapsedTime)}</Text>
            </>
          )}
        </View>
      </View>

      {/* Mode + Difficulty label */}
      <Text style={styles.difficultyLabel}>
        {t(`memoryMatch.difficulty.${difficulty}`)} · {t(`memoryMatch.mode.${mode}`)}
      </Text>

      {/* Card Grid */}
      <View style={styles.gridContainer}>
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={[styles.gridRow, { gap: cardGap }]}>
            {row.map((card, colIndex) => renderCard(card, rowIndex * config.cols + colIndex))}
          </View>
        ))}
      </View>

      {/* Game Over Overlay */}
      {gameOver && (
        <View style={styles.overlay}>
          <View style={styles.overlayCard}>
            <Text style={styles.overlayTitle}>
              {isTimeAttack && matchedPairs < config.pairs
                ? t('memoryMatch.gameOver.timeUp')
                : t('memoryMatch.gameOver.title')}
            </Text>

            <Text style={styles.starsText}>
              {'★'.repeat(finalStars)}
              {'☆'.repeat(3 - finalStars)}
            </Text>

            <View style={styles.overlayStats}>
              {isTimeAttack ? (
                <>
                  <Text style={styles.overlayStat}>
                    {t('memoryMatch.gameOver.pairs')}: {matchedPairs}/{config.pairs}
                  </Text>
                  <Text style={styles.overlayStat}>
                    {t('memoryMatch.gameOver.moves')}: {moves}
                  </Text>
                </>
              ) : (
                <>
                  <Text style={styles.overlayStat}>
                    {t('memoryMatch.gameOver.moves')}: {moves}
                  </Text>
                  <Text style={styles.overlayStat}>
                    {t('memoryMatch.gameOver.time')}: {formatTime(elapsedTime)}
                  </Text>
                </>
              )}
              <Text style={styles.overlayScore}>
                {t('memoryMatch.gameOver.score')}: {finalScore}
              </Text>
            </View>

            {!adRewardPending && (
              <>
                <TouchableOpacity
                  style={styles.playAgainButton}
                  onPress={async () => {
                    setAdRewardPending(true);
                    const reward = await triggerAd('game_ended', finalScore);
                    if (reward > 0) {
                      // Ad was successful
                    }
                    setAdRewardPending(false);
                  }}
                  activeOpacity={0.85}
                  accessibilityRole="button"
                  accessibilityLabel="Watch ad for bonus score"
                >
                  <Text style={styles.playAgainText}>
                    🎬 {t('common.watchAdToDouble', { defaultValue: 'Watch Ad to Double!' })}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.playAgainButton}
                  onPress={handlePlayAgain}
                  activeOpacity={0.85}
                  accessibilityRole="button"
                  accessibilityLabel={t('memoryMatch.gameOver.playAgain')}
                >
                  <Text style={styles.playAgainText}>
                    {t('memoryMatch.gameOver.playAgain')}
                  </Text>
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity
              style={styles.backToHomeButton}
              onPress={() => handleBack()}
              accessibilityRole="button"
              accessibilityLabel={t('common.back')}
            >
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
    backgroundColor: '#f5f0ff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerStats: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  backText: {
    fontSize: 16,
    color: '#9b59b6',
    fontWeight: '600',
  },
  headerStat: {
    fontSize: 16,
    fontWeight: '700',
    color: '#9b59b6',
  },
  difficultyLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#888',
    textAlign: 'center',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  gridContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  gridRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  card: {
    backgroundColor: '#9b59b6',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  cardMatched: {
    backgroundColor: '#e8f5e9',
    borderWidth: 2,
    borderColor: '#27ae60',
  },
  cardInner: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBack: {
    color: '#fff',
    fontWeight: '800',
    textAlign: 'center',
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
    color: '#9b59b6',
    marginBottom: 12,
    textAlign: 'center',
  },
  starsText: {
    fontSize: 40,
    color: '#f1c40f',
    marginBottom: 16,
  },
  overlayStats: {
    alignItems: 'center',
    marginBottom: 24,
    gap: 6,
  },
  overlayStat: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  overlayScore: {
    fontSize: 22,
    color: '#9b59b6',
    fontWeight: '800',
    marginTop: 4,
  },
  playAgainButton: {
    backgroundColor: '#9b59b6',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 28,
    marginBottom: 12,
    shadowColor: '#9b59b6',
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
    color: '#9b59b6',
    fontWeight: '600',
  },
});
