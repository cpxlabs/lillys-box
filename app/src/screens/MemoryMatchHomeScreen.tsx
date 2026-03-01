import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useMemoryMatch, Difficulty, Mode } from '../context/MemoryMatchContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { EmojiIcon } from '../components/EmojiIcon';
import { useGameBack } from '../hooks/useGameBack';

type Props = NativeStackScreenProps<RootStackParamList, 'MemoryMatchHome'>;

const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard', 'expert'];
const MODES: Mode[] = ['classic', 'timeAttack'];

export const MemoryMatchHomeScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { bestScores } = useMemoryMatch();
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('easy');
  const [selectedMode, setSelectedMode] = useState<Mode>('classic');

  const handleBack = useGameBack(navigation);

  const handlePlay = () => {
    navigation.navigate('MemoryMatchGame', {
      difficulty: selectedDifficulty,
      mode: selectedMode,
    });
  };

  const currentBest = bestScores[selectedMode][selectedDifficulty];

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

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <EmojiIcon emoji="🧠" size={72} style={styles.emoji} />
        <Text style={styles.title}>{t('memoryMatch.title')}</Text>
        <Text style={styles.subtitle}>{t('memoryMatch.subtitle')}</Text>

        {/* Mode Selection */}
        <Text style={styles.sectionLabel}>{t('memoryMatch.selectMode')}</Text>
        <View style={styles.modeContainer}>
          {MODES.map((m) => (
            <TouchableOpacity
              key={m}
              style={[
                styles.modeButton,
                selectedMode === m && styles.modeButtonSelected,
              ]}
              onPress={() => setSelectedMode(m)}
              accessibilityRole="button"
              accessibilityLabel={t(`memoryMatch.mode.${m}`)}
              accessibilityState={{ selected: selectedMode === m }}
            >
              <Text style={[styles.modeEmoji]}>
                {m === 'classic' ? '🃏' : '⏱'}
              </Text>
              <Text
                style={[
                  styles.modeText,
                  selectedMode === m && styles.modeTextSelected,
                ]}
              >
                {t(`memoryMatch.mode.${m}`)}
              </Text>
              <Text
                style={[
                  styles.modeDesc,
                  selectedMode === m && styles.modeDescSelected,
                ]}
              >
                {t(`memoryMatch.mode.${m}Desc`)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Difficulty Selection */}
        <Text style={styles.sectionLabel}>{t('memoryMatch.selectDifficulty')}</Text>
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
      </ScrollView>
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
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 8,
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
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  modeContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
    width: '100%',
  },
  modeButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e0d4f0',
    alignItems: 'center',
  },
  modeButtonSelected: {
    backgroundColor: '#9b59b6',
    borderColor: '#9b59b6',
  },
  modeEmoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  modeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#9b59b6',
    marginBottom: 2,
  },
  modeTextSelected: {
    color: '#fff',
  },
  modeDesc: {
    fontSize: 11,
    color: '#aaa',
    textAlign: 'center',
  },
  modeDescSelected: {
    color: 'rgba(255,255,255,0.75)',
  },
  difficultyContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
    justifyContent: 'center',
  },
  difficultyButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
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
    marginBottom: 20,
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
    marginBottom: 8,
  },
  playButtonText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },
  instructions: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
    maxWidth: 280,
    lineHeight: 18,
  },
});
