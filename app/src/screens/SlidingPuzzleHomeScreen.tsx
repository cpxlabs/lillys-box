import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSlidingPuzzle } from '../context/SlidingPuzzleContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { EmojiIcon } from '../components/EmojiIcon';
import { useGameBack } from '../hooks/useGameBack';

type Props = NativeStackScreenProps<RootStackParamList, 'SlidingPuzzleHome'>;

export const SlidingPuzzleHomeScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { bestMoves } = useSlidingPuzzle();

  const handleBack = useGameBack(navigation);

  const handlePlay = (difficulty: 'easy' | 'hard') => {
    navigation.navigate('SlidingPuzzleGame', { difficulty });
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={handleBack}
        accessibilityRole="button"
        accessibilityLabel={t('common.back')}
      >
        <Text style={styles.backText}>← {t('common.back')}</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <EmojiIcon emoji="🧩" size={72} style={styles.emoji} />
        <Text style={styles.title}>{t('slidingPuzzle.home.title')}</Text>
        <Text style={styles.subtitle}>{t('slidingPuzzle.home.subtitle')}</Text>

        <View style={styles.difficultySection}>
          <Text style={styles.difficultyLabel}>{t('slidingPuzzle.home.chooseDifficulty')}</Text>

          <TouchableOpacity
            style={[styles.difficultyButton, styles.easyButton]}
            onPress={() => handlePlay('easy')}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel={t('slidingPuzzle.home.easy')}
          >
            <Text style={styles.difficultyButtonText}>{t('slidingPuzzle.home.easy')}</Text>
            <Text style={styles.difficultyDesc}>{t('slidingPuzzle.home.easyDesc')}</Text>
            {bestMoves.easy !== null && (
              <Text style={styles.bestMovesText}>
                {t('slidingPuzzle.home.best')}: {bestMoves.easy} {t('slidingPuzzle.home.moves')}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.difficultyButton, styles.hardButton]}
            onPress={() => handlePlay('hard')}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel={t('slidingPuzzle.home.hard')}
          >
            <Text style={styles.difficultyButtonText}>{t('slidingPuzzle.home.hard')}</Text>
            <Text style={styles.difficultyDesc}>{t('slidingPuzzle.home.hardDesc')}</Text>
            {bestMoves.hard !== null && (
              <Text style={styles.bestMovesText}>
                {t('slidingPuzzle.home.best')}: {bestMoves.hard} {t('slidingPuzzle.home.moves')}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.instructions}>{t('slidingPuzzle.home.instructions')}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3e5f5',
  },
  backButton: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  backText: {
    fontSize: 16,
    color: '#7b1fa2',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    marginTop: -20,
  },
  emoji: {
    fontSize: 72,
    marginBottom: 12,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#7b1fa2',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 17,
    color: '#666',
    textAlign: 'center',
    marginBottom: 28,
  },
  difficultySection: {
    width: '100%',
    marginBottom: 24,
    gap: 12,
  },
  difficultyLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    textAlign: 'center',
    marginBottom: 8,
  },
  difficultyButton: {
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  easyButton: {
    backgroundColor: '#7b1fa2',
  },
  hardButton: {
    backgroundColor: '#4a148c',
  },
  difficultyButtonText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
  },
  difficultyDesc: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },
  bestMovesText: {
    fontSize: 13,
    color: '#f3e5f5',
    marginTop: 4,
    fontWeight: '600',
  },
  instructions: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    maxWidth: 300,
    lineHeight: 20,
  },
});
