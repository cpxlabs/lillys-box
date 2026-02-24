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
import { useMemoryMatch, Difficulty } from '../context/MemoryMatchContext';
import { RootStackParamList } from '../types/navigation';
import { EmojiIcon } from '../components/EmojiIcon';

type Props = NativeStackScreenProps<RootStackParamList, 'MemoryMatchGame'>;

const ALL_EMOJIS = [
  '🐱', '🐶', '🐰', '🐹', '🐦', '🐢', '🦋', '🐠',
  '🍎', '🍊', '🍋', '🍇', '🍓', '🍦', '🥕', '🍪',
];

interface GridConfig {
  cols: number;
  rows: number;
  pairs: number;
}

const GRID_CONFIG: Record<Difficulty, GridConfig> = {
  easy: { cols: 3, rows: 2, pairs: 3 },
  medium: { cols: 4, rows: 3, pairs: 6 },
  hard: { cols: 4, rows: 4, pairs: 8 },
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

  // Shuffle cards
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }

  return cards;
}

function calculateScore(moves: number, pairs: number, elapsedSeconds: number): number {
  const maxMoves = pairs * 3;
  const moveScore = Math.max(0, (maxMoves - moves) * 10);
  const timeLimit = pairs * 15;
  const timeBonus = Math.max(0, timeLimit - elapsedSeconds);
  return moveScore + timeBonus;
}

function calculateStars(moves: number, pairs: number): number {
  if (moves <= pairs + 1) return 3;
  if (moves <= pairs * 2) return 2;
  return 1;
}

export const MemoryMatchGameScreen: React.FC<Props> = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { updateBestScore } = useMemoryMatch();
  const difficulty = route.params.difficulty;
  const config = GRID_CONFIG[difficulty];

  const [cards, setCards] = useState<Card[]>(() => createDeck(config.pairs));
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const lockRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Card flip animations - one per card
  const flipAnims = useRef<Animated.Value[]>(
    cards.map(() => new Animated.Value(0))
  ).current;

  // Start timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Stop timer on game over
  useEffect(() => {
    if (gameOver && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [gameOver]);

  // Check for game completion
  useEffect(() => {
    if (matchedPairs === config.pairs && matchedPairs > 0) {
      const score = calculateScore(moves, config.pairs, elapsedTime);
      updateBestScore(difficulty, score);
      setGameOver(true);
    }
  }, [matchedPairs, config.pairs, moves, elapsedTime, difficulty, updateBestScore]);

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

      // Flip the card
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
          // Match found
          const matchedCards = [...newCards];
          matchedCards[first] = { ...matchedCards[first], isMatched: true };
          matchedCards[second] = { ...matchedCards[second], isMatched: true };
          setCards(matchedCards);
          setMatchedPairs((prev) => prev + 1);
          setSelectedIndices([]);
        } else {
          // No match - flip back after delay
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
    // Reset animations
    flipAnims.forEach((anim) => anim.setValue(0));
    setCards(newCards);
    setSelectedIndices([]);
    setMoves(0);
    setMatchedPairs(0);
    setGameOver(false);
    setElapsedTime(0);
    lockRef.current = false;
    timerRef.current = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
  }, [config.pairs, flipAnims]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const score = useMemo(
    () => calculateScore(moves, config.pairs, elapsedTime),
    [moves, config.pairs, elapsedTime]
  );

  const stars = useMemo(() => calculateStars(moves, config.pairs), [moves, config.pairs]);

  const screenWidth = Dimensions.get('window').width;
  const gridPadding = 20;
  const cardGap = 8;
  const availableWidth = screenWidth - gridPadding * 2 - cardGap * (config.cols - 1);
  const cardSize = Math.floor(availableWidth / config.cols);

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
          {
            width: cardSize,
            height: cardSize,
          },
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

  // Build rows from cards
  const rows: Card[][] = [];
  for (let r = 0; r < config.rows; r++) {
    rows.push(cards.slice(r * config.cols, (r + 1) * config.cols));
  }

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
          {t('memoryMatch.moves')}: {moves}
        </Text>
        <Text style={styles.headerStat}>{formatTime(elapsedTime)}</Text>
      </View>

      {/* Difficulty label */}
      <Text style={styles.difficultyLabel}>
        {t(`memoryMatch.difficulty.${difficulty}`)}
      </Text>

      {/* Card Grid */}
      <View style={styles.gridContainer}>
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.gridRow}>
            {row.map((card, colIndex) => renderCard(card, rowIndex * config.cols + colIndex))}
          </View>
        ))}
      </View>

      {/* Game Over Overlay */}
      {gameOver && (
        <View style={styles.overlay}>
          <View style={styles.overlayCard}>
            <Text style={styles.overlayTitle}>{t('memoryMatch.gameOver.title')}</Text>

            <Text style={styles.starsText}>
              {'★'.repeat(stars)}
              {'☆'.repeat(3 - stars)}
            </Text>

            <View style={styles.overlayStats}>
              <Text style={styles.overlayStat}>
                {t('memoryMatch.gameOver.moves')}: {moves}
              </Text>
              <Text style={styles.overlayStat}>
                {t('memoryMatch.gameOver.time')}: {formatTime(elapsedTime)}
              </Text>
              <Text style={styles.overlayScore}>
                {t('memoryMatch.gameOver.score')}: {score}
              </Text>
            </View>

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

            <TouchableOpacity
              style={styles.backToHomeButton}
              onPress={() => navigation.goBack()}
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
    fontSize: 14,
    fontWeight: '600',
    color: '#888',
    textAlign: 'center',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  gridContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#9b59b6',
    borderRadius: 12,
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
  cardEmoji: {
    textAlign: 'center',
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
