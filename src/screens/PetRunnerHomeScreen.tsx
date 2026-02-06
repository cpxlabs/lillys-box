import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { usePetRunner } from '../context/PetRunnerContext';
import { ScreenNavigationProp } from '../types/navigation';

type Props = {
  navigation: ScreenNavigationProp<'PetRunnerHome'>;
};

export const PetRunnerHomeScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { bestScore } = usePetRunner();

  const handlePlay = () => {
    navigation.navigate('PetRunnerGame');
  };

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.getParent()?.goBack();
    }
  };

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
        <Text style={styles.emoji}>🏃</Text>
        <Text style={styles.title}>{t('petRunner.title')}</Text>
        <Text style={styles.subtitle}>{t('petRunner.subtitle')}</Text>

        {bestScore > 0 && (
          <View style={styles.bestScoreCard}>
            <Text style={styles.bestScoreLabel}>{t('petRunner.bestScore')}</Text>
            <Text style={styles.bestScoreValue}>{bestScore}</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.playButton}
          onPress={handlePlay}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel={t('petRunner.play')}
        >
          <Text style={styles.playButtonText}>{t('petRunner.play')}</Text>
        </TouchableOpacity>

        <Text style={styles.instructions}>{t('petRunner.instructions')}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8f8e8',
  },
  backButton: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  backText: {
    fontSize: 16,
    color: '#27ae60',
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
    fontSize: 40,
    fontWeight: '800',
    color: '#27ae60',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 28,
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
    color: '#27ae60',
  },
  playButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 18,
    paddingHorizontal: 52,
    borderRadius: 32,
    shadowColor: '#27ae60',
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
