import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSpotDifference } from '../context/SpotDifferenceContext';
import { ScreenNavigationProp } from '../types/navigation';
import { useGameBack } from '../hooks/useGameBack';

type Props = { navigation: ScreenNavigationProp<'SpotDifferenceHome'> };

export const SpotDifferenceHomeScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { bestScore } = useSpotDifference();
  const handleBack = useGameBack(navigation);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleBack} accessibilityRole="button">
        <Text style={styles.backText}>← {t('common.back')}</Text>
      </TouchableOpacity>
      <View style={styles.content}>
        <Text style={styles.emoji}>🔍</Text>
        <Text style={styles.title}>{t('spotDifference.home.title')}</Text>
        <Text style={styles.subtitle}>{t('spotDifference.home.subtitle')}</Text>
        {bestScore > 0 && (
          <View style={styles.bestScoreCard}>
            <Text style={styles.bestScoreLabel}>{t('spotDifference.home.bestScore')}</Text>
            <Text style={styles.bestScoreValue}>{bestScore}</Text>
          </View>
        )}
        <TouchableOpacity
          style={styles.playButton}
          onPress={() => navigation.navigate('SpotDifferenceGame')}
          activeOpacity={0.85}
          accessibilityRole="button"
        >
          <Text style={styles.playButtonText}>{t('spotDifference.home.play')}</Text>
        </TouchableOpacity>
        <Text style={styles.instructions}>{t('spotDifference.home.instructions')}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafafa' },
  backButton: { paddingHorizontal: 20, paddingTop: 16 },
  backText: { fontSize: 16, color: '#1565c0', fontWeight: '600' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, marginTop: -40 },
  emoji: { fontSize: 80, marginBottom: 12 },
  title: { fontSize: 34, fontWeight: '800', color: '#1565c0', marginBottom: 8, textAlign: 'center' },
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
  bestScoreValue: { fontSize: 32, fontWeight: '800', color: '#1565c0' },
  playButton: {
    backgroundColor: '#1976d2',
    paddingVertical: 18,
    paddingHorizontal: 52,
    borderRadius: 32,
    shadowColor: '#1976d2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  playButtonText: { fontSize: 22, fontWeight: '700', color: '#fff' },
  instructions: { fontSize: 14, color: '#777', textAlign: 'center', marginTop: 28, maxWidth: 300, lineHeight: 20 },
});
