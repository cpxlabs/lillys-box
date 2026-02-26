import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useMuito } from '../context/MuitoContext';
import { ScreenNavigationProp } from '../types/navigation';
import { EmojiIcon } from '../components/EmojiIcon';
import { useGameBack } from '../hooks/useGameBack';

type Props = {
  navigation: ScreenNavigationProp<'MuitoGame'>;
};

const EMOJIS = ['🍎', '🍊', '🍋', '🍇', '🍓', '🐱', '🐶', '🐰', '🌟', '🦋', '🌸', '🍦'];

interface Puzzle {
  emoji: string;
  count: number;
  options: number[];
}

function generatePuzzle(round: number): Puzzle {
  const minCount = round < 4 ? 2 : round < 8 ? 3 : 4;
  const maxCount = round < 4 ? 4 : round < 8 ? 6 : 9;
  const count = minCount + Math.floor(Math.random() * (maxCount - minCount + 1));
  const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];

  // Build a pool of wrong answers near the correct value
  const pool: number[] = [];
  for (let i = Math.max(1, count - 3); i <= count + 3; i++) {
    if (i !== count) pool.push(i);
  }
  // Fisher-Yates shuffle the pool
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  // Combine correct answer with 3 wrong answers, then shuffle
  const options = [count, ...pool.slice(0, 3)];
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }

  return { emoji, count, options };
}

export const MuitoGameScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { score, addScore } = useMuito();
  const handleBack = useGameBack(navigation);
  const roundRef = useRef(1);
  const [puzzle, setPuzzle] = useState<Puzzle>(() => generatePuzzle(1));
  const [selected, setSelected] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const advanceRound = useCallback(() => {
    roundRef.current += 1;
    setPuzzle(generatePuzzle(roundRef.current));
    setSelected(null);
    setIsCorrect(null);
  }, []);

  const handleSelect = useCallback(
    (option: number) => {
      if (selected !== null) return;
      setSelected(option);
      if (option === puzzle.count) {
        setIsCorrect(true);
        addScore(10);
      } else {
        setIsCorrect(false);
      }
    },
    [selected, puzzle.count, addScore]
  );

  useEffect(() => {
    if (isCorrect !== null) {
      const timeout = setTimeout(advanceRound, 1500);
      return () => clearTimeout(timeout);
    }
  }, [isCorrect, advanceRound]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => handleBack()}
          accessibilityRole="button"
          accessibilityLabel={t('common.back')}
        >
          <Text style={styles.backText}>{t('common.back')}</Text>
        </TouchableOpacity>
        <Text style={styles.scoreText}>
          {t('muito.score')}: {score}
        </Text>
      </View>

      <Text style={styles.question}>{t('muito.question', { emoji: puzzle.emoji })}</Text>

      <View style={styles.objectsCard}>
        <View style={styles.objectsGrid}>
          {Array.from({ length: puzzle.count }, (_, i) => (
            <EmojiIcon key={i} emoji={puzzle.emoji} size={36} style={styles.object} />
          ))}
        </View>
      </View>

      <View style={styles.feedbackContainer}>
        {isCorrect !== null && (
          <Text style={[styles.feedback, isCorrect ? styles.feedbackCorrect : styles.feedbackWrong]}>
            {isCorrect ? t('muito.correct') : t('muito.wrong')}
          </Text>
        )}
      </View>

      <View style={styles.optionsContainer}>
        {puzzle.options.map((option, idx) => (
          <TouchableOpacity
            key={idx}
            style={[
              styles.optionButton,
              selected !== null && option !== selected && styles.optionDimmed,
              selected !== null && option === selected && isCorrect && styles.optionCorrect,
              selected !== null && option === selected && !isCorrect && styles.optionWrong,
            ]}
            onPress={() => handleSelect(option)}
            activeOpacity={selected !== null ? 1 : 0.85}
            disabled={selected !== null}
            accessibilityRole="button"
            accessibilityLabel={`${t('muito.answerLabel')}: ${option}`}
          >
            <Text
              style={[
                styles.optionText,
                selected !== null && option === selected && styles.optionTextSelected,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
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
  scoreText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#9b59b6',
  },
  question: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginTop: 12,
    marginBottom: 16,
  },
  objectsCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginHorizontal: 20,
    padding: 24,
    minHeight: 160,
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
    gap: 16,
    alignContent: 'center',
  },
  object: {
    fontSize: 40,
  },
  feedbackContainer: {
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  feedback: {
    fontSize: 20,
    fontWeight: '700',
  },
  feedbackCorrect: {
    color: '#27ae60',
  },
  feedbackWrong: {
    color: '#e74c3c',
  },
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
