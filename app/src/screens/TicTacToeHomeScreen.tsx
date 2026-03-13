import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { ScreenNavigationProp } from '../types/navigation';
import { useTicTacToe } from '../context/TicTacToeContext';
import { useGameBack } from '../hooks/useGameBack';

type Difficulty = 'puppy' | 'kitten' | 'owl';

type Props = {
  navigation: ScreenNavigationProp<'TicTacToeHome'>;
};

const DIFFICULTIES: { id: Difficulty; emoji: string; nameKey: string; descKey: string }[] = [
  { id: 'puppy', emoji: '🐶', nameKey: 'ticTacToe.difficulty.puppy', descKey: 'ticTacToe.difficulty.puppyDesc' },
  { id: 'kitten', emoji: '🐱', nameKey: 'ticTacToe.difficulty.kitten', descKey: 'ticTacToe.difficulty.kittenDesc' },
  { id: 'owl', emoji: '🦉', nameKey: 'ticTacToe.difficulty.owl', descKey: 'ticTacToe.difficulty.owlDesc' },
];

export const TicTacToeHomeScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { bestScore } = useTicTacToe();
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('puppy');

  const handleBack = useGameBack(navigation);

  const handlePlay = () => {
    navigation.navigate('TicTacToeGame', { difficulty: selectedDifficulty });
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleBack} accessibilityRole="button">
        <Text style={styles.backText}>{t('common.back')}</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{t('ticTacToe.title')}</Text>
        <Text style={styles.subtitle}>{t('ticTacToe.subtitle')}</Text>
        <Text style={styles.instructions}>{t('ticTacToe.instructions')}</Text>

        {bestScore > 0 && (
          <View style={styles.scoreCard}>
            <Text style={styles.scoreLabel}>{t('ticTacToe.bestScore')}</Text>
            <Text style={styles.scoreValue}>{bestScore}</Text>
          </View>
        )}

        <Text style={styles.difficultyLabel}>{t('ticTacToe.chooseDifficulty')}</Text>

        {DIFFICULTIES.map(({ id, emoji, nameKey, descKey }) => (
          <TouchableOpacity
            key={id}
            style={[
              styles.difficultyButton,
              selectedDifficulty === id && styles.difficultyButtonSelected,
            ]}
            onPress={() => setSelectedDifficulty(id)}
            accessibilityRole="button"
          >
            <Text style={styles.difficultyEmoji}>{emoji}</Text>
            <View style={styles.difficultyTextGroup}>
              <Text
                style={[
                  styles.difficultyName,
                  selectedDifficulty === id && styles.difficultyNameSelected,
                ]}
              >
                {t(nameKey)}
              </Text>
              <Text style={styles.difficultyDesc}>{t(descKey)}</Text>
            </View>
            {selectedDifficulty === id && <Text style={styles.checkmark}>✓</Text>}
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.playButton} onPress={handlePlay} accessibilityRole="button">
          <Text style={styles.playText}>{t('ticTacToe.play')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff5f0',
  },
  backButton: {
    padding: 16,
    alignSelf: 'flex-start',
  },
  backText: {
    fontSize: 16,
    color: '#e05e2a',
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#e05e2a',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  instructions: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  scoreCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    minWidth: 160,
  },
  scoreLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#e05e2a',
  },
  difficultyLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#444',
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  difficultyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    width: '100%',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  difficultyButtonSelected: {
    borderColor: '#e05e2a',
    backgroundColor: '#fff5f0',
  },
  difficultyEmoji: {
    fontSize: 28,
    marginRight: 14,
  },
  difficultyTextGroup: {
    flex: 1,
  },
  difficultyName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  difficultyNameSelected: {
    color: '#e05e2a',
  },
  difficultyDesc: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  checkmark: {
    fontSize: 18,
    color: '#e05e2a',
    fontWeight: '800',
  },
  playButton: {
    backgroundColor: '#e05e2a',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 56,
    marginTop: 24,
  },
  playText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
