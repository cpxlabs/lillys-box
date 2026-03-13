import React from 'react';
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
import { usePetLullaby } from '../context/PetLullabyContext';
import { useGameBack } from '../hooks/useGameBack';

type Props = {
  navigation: ScreenNavigationProp<'PetLullabyHome'>;
};

export const PetLullabyHomeScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { bestScore } = usePetLullaby();
  const handleBack = useGameBack(navigation);

  const handlePlay = () => {
    navigation.navigate('PetLullabyGame', undefined);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleBack} accessibilityRole="button">
        <Text style={styles.backText}>{t('common.back')}</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.emoji}>🌙</Text>
        <Text style={styles.title}>{t('petLullaby.title')}</Text>
        <Text style={styles.subtitle}>{t('petLullaby.subtitle')}</Text>
        <Text style={styles.instructions}>{t('petLullaby.instructions')}</Text>

        {bestScore > 0 && (
          <View style={styles.scoreCard}>
            <Text style={styles.scoreLabel}>{t('petLullaby.bestScore')}</Text>
            <Text style={styles.scoreValue}>{bestScore}</Text>
          </View>
        )}

        <TouchableOpacity style={styles.playButton} onPress={handlePlay} accessibilityRole="button">
          <Text style={styles.playText}>{t('petLullaby.play')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  backButton: {
    padding: 16,
    alignSelf: 'flex-start',
  },
  backText: {
    fontSize: 16,
    color: '#a78bfa',
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    alignItems: 'center',
  },
  emoji: {
    fontSize: 72,
    marginBottom: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#e2d9f3',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#a78bfa',
    marginBottom: 8,
    textAlign: 'center',
  },
  instructions: {
    fontSize: 14,
    color: '#8b8baa',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  scoreCard: {
    backgroundColor: '#16213e',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
    minWidth: 160,
    borderWidth: 1,
    borderColor: '#a78bfa44',
  },
  scoreLabel: {
    fontSize: 14,
    color: '#a78bfa',
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#e2d9f3',
  },
  playButton: {
    backgroundColor: '#7c3aed',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 56,
    marginTop: 8,
  },
  playText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
