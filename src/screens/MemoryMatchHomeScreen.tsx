import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useMemoryMatch, Difficulty } from '../context/MemoryMatchContext';
import { ScreenNavigationProp } from '../types/navigation';
import { EmojiIcon } from '../components/EmojiIcon';

type Props = {
  navigation: ScreenNavigationProp<'MemoryMatchHome'>;
};

const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];

export const MemoryMatchHomeScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { bestScores } = useMemoryMatch();
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('easy');

  const handlePlay = () => {
    navigation.navigate('MemoryMatchGame', { difficulty: selectedDifficulty });
  };

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.getParent()?.goBack();
    }
  };

  const currentBest = bestScores[selectedDifficulty];

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={handleBack}
        accessibilityRole="button"
        accessibilityLabel={t('common.back')}
      >
        <Text style={styles.backText}>{t('common.back')}</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <EmojiIcon emoji="🧠" size={72} style={styles.emoji} />
        <Text style={styles.title}>{t('memoryMatch.title')}</Text>
        <Text style={styles.subtitle}>{t('memoryMatch.subtitle')}</Text>

        <View style={styles.difficultyContainer}>
          {DIFFICULTIES.map((diff) => (
            <TouchableOpacity
              key={diff}
              style={[
                styles.difficultyButton,
                selectedDifficulty === diff && styles.difficultyButtonSelected,
              ]}
              onPress={() => setSelectedDifficulty(diff)}
              accessibilityRole="button"
              accessibilityLabel={t(`memoryMatch.difficulty.${diff}`)}
              accessibilityState={{ selected: selectedDifficulty === diff }}
            >
              <Text
                style={[
                  styles.difficultyText,
                  selectedDifficulty === diff && styles.difficultyTextSelected,
                ]}
              >
                {t(`memoryMatch.difficulty.${diff}`)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {currentBest > 0 && (
          <View style={styles.bestScoreCard}>
            <Text style={styles.bestScoreLabel}>{t('memoryMatch.bestScore')}</Text>
            <Text style={styles.bestScoreValue}>{currentBest}</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.playButton}
          onPress={handlePlay}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel={t('memoryMatch.play')}
        >
          <Text style={styles.playButtonText}>{t('memoryMatch.play')}</Text>
        </TouchableOpacity>

        <Text style={styles.instructions}>{t('memoryMatch.instructions')}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f0ff',
  },
  backButton: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  backText: {
    fontSize: 16,
    color: '#9b59b6',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    marginTop: -40,
  },
  emoji: {
    fontSize: 72,
    marginBottom: 12,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#9b59b6',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  difficultyContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  difficultyButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e0d4f0',
  },
  difficultyButtonSelected: {
    backgroundColor: '#9b59b6',
    borderColor: '#9b59b6',
  },
  difficultyText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#9b59b6',
  },
  difficultyTextSelected: {
    color: '#fff',
  },
  bestScoreCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 28,
    marginBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    alignItems: 'center',
  },
  bestScoreLabel: {
    fontSize: 14,
    color: '#888',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  bestScoreValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#9b59b6',
  },
  playButton: {
    backgroundColor: '#9b59b6',
    paddingVertical: 18,
    paddingHorizontal: 52,
    borderRadius: 32,
    shadowColor: '#9b59b6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  playButtonText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },
  instructions: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginTop: 28,
    maxWidth: 260,
    lineHeight: 20,
  },
});
