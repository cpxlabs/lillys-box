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
import { useKidsCheckers } from '../context/KidsCheckersContext';
import { useGameBack } from '../hooks/useGameBack';

type Difficulty = 'puppy' | 'kitten' | 'bunny' | 'fox' | 'owl';

type Props = {
  navigation: ScreenNavigationProp<'KidsCheckersHome'>;
};

const DIFFICULTIES: { id: Difficulty; emoji: string; nameKey: string; descKey: string }[] = [
  { id: 'puppy', emoji: '🐶', nameKey: 'kidsCheckers.difficulty.puppy', descKey: 'kidsCheckers.difficulty.puppyDesc' },
  { id: 'kitten', emoji: '🐱', nameKey: 'kidsCheckers.difficulty.kitten', descKey: 'kidsCheckers.difficulty.kittenDesc' },
  { id: 'bunny', emoji: '🐰', nameKey: 'kidsCheckers.difficulty.bunny', descKey: 'kidsCheckers.difficulty.bunnyDesc' },
  { id: 'fox', emoji: '🦊', nameKey: 'kidsCheckers.difficulty.fox', descKey: 'kidsCheckers.difficulty.foxDesc' },
  { id: 'owl', emoji: '🦉', nameKey: 'kidsCheckers.difficulty.owl', descKey: 'kidsCheckers.difficulty.owlDesc' },
];

export const KidsCheckersHomeScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { bestScore } = useKidsCheckers();
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('puppy');

  const handleBack = useGameBack(navigation);

  const handlePlay = () => {
    navigation.navigate('KidsCheckersGame', { difficulty: selectedDifficulty });
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleBack} accessibilityRole="button">
        <Text style={styles.backText}>{t('common.back')}</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{t('kidsCheckers.title')}</Text>
        <Text style={styles.subtitle}>{t('kidsCheckers.subtitle')}</Text>
        <Text style={styles.instructions}>{t('kidsCheckers.instructions')}</Text>

        {bestScore > 0 && (
          <View style={styles.scoreCard}>
            <Text style={styles.scoreLabel}>{t('kidsCheckers.bestScore')}</Text>
            <Text style={styles.scoreValue}>{bestScore}</Text>
          </View>
        )}

        <Text style={styles.difficultyLabel}>{t('kidsCheckers.chooseDifficulty')}</Text>

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
          <Text style={styles.playText}>{t('kidsCheckers.play')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0fff4',
  },
  backButton: {
    padding: 16,
    alignSelf: 'flex-start',
  },
  backText: {
    fontSize: 16,
    color: '#2d8a4e',
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
    color: '#2d8a4e',
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
    color: '#2d8a4e',
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
    borderColor: '#2d8a4e',
    backgroundColor: '#f0fff4',
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
    color: '#2d8a4e',
  },
  difficultyDesc: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  checkmark: {
    fontSize: 18,
    color: '#2d8a4e',
    fontWeight: '800',
  },
  playButton: {
    backgroundColor: '#2d8a4e',
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
