import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { usePatternPaws } from '../context/PatternPawsContext';
import { ScreenNavigationProp } from '../types/navigation';
import { useGameBack } from '../hooks/useGameBack';

type Props = { navigation: ScreenNavigationProp<'PatternPawsHome'> };

export const PatternPawsHomeScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { bestScore } = usePatternPaws();
  const handleBack = useGameBack(navigation);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleBack} accessibilityRole="button">
        <Text style={styles.backText}>← {t('common.back')}</Text>
      </TouchableOpacity>
      <View style={styles.content}>
        <Text style={styles.emoji}>🐾</Text>
        <Text style={styles.title}>{t('patternPaws.home.title')}</Text>
        <Text style={styles.subtitle}>{t('patternPaws.home.subtitle')}</Text>
        {bestScore > 0 && (
          <View style={styles.bestScoreCard}>
            <Text style={styles.bestScoreLabel}>{t('patternPaws.home.bestScore')}</Text>
            <Text style={styles.bestScoreValue}>{bestScore}</Text>
          </View>
        )}
        <TouchableOpacity
          style={styles.playButton}
          onPress={() => navigation.navigate('PatternPawsGame')}
          activeOpacity={0.85}
          accessibilityRole="button"
        >
          <Text style={styles.playButtonText}>{t('patternPaws.home.play')}</Text>
        </TouchableOpacity>
        <Text style={styles.instructions}>{t('patternPaws.home.instructions')}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E8F5E9' },
  backButton: { paddingHorizontal: 20, paddingTop: 16 },
  backText: { fontSize: 16, color: '#388e3c', fontWeight: '600' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, marginTop: 0 },
  emoji: { fontSize: 80, marginBottom: 12 },
  title: { fontSize: 34, fontWeight: '800', color: '#2e7d32', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 17, color: '#555', textAlign: 'center', marginBottom: 28 },
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
  bestScoreLabel: { fontSize: 13, color: '#888', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },
  bestScoreValue: { fontSize: 32, fontWeight: '800', color: '#2e7d32' },
  playButton: {
    backgroundColor: '#43a047',
    paddingVertical: 18,
    paddingHorizontal: 52,
    borderRadius: 32,
    shadowColor: '#43a047',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  playButtonText: { fontSize: 22, fontWeight: '700', color: '#fff' },
  instructions: { fontSize: 14, color: '#777', textAlign: 'center', marginTop: 28, maxWidth: 300, lineHeight: 20 },
});
