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
import { usePillowFight } from '../context/PillowFightContext';
import { useGameBack } from '../hooks/useGameBack';

type Props = {
  navigation: ScreenNavigationProp<'PillowFightHome'>;
};

export const PillowFightHomeScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { bestScore } = usePillowFight();
  const handleBack = useGameBack(navigation);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleBack} accessibilityRole="button">
        <Text style={styles.backText}>{t('common.back')}</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.emoji}>🛏️</Text>
        <Text style={styles.title}>{t('pillowFight.title')}</Text>
        <Text style={styles.subtitle}>{t('pillowFight.subtitle')}</Text>
        <Text style={styles.instructions}>{t('pillowFight.instructions')}</Text>

        {bestScore > 0 && (
          <View style={styles.scoreCard}>
            <Text style={styles.scoreLabel}>{t('pillowFight.bestScore')}</Text>
            <Text style={styles.scoreValue}>{bestScore}</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.playButton}
          onPress={() => navigation.navigate('PillowFightGame')}
          accessibilityRole="button"
        >
          <Text style={styles.playText}>{t('pillowFight.play')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF0F5',
  },
  backButton: {
    padding: 16,
    alignSelf: 'flex-start',
  },
  backText: {
    fontSize: 16,
    color: '#c2185b',
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    alignItems: 'center',
  },
  emoji: {
    fontSize: 64,
    marginBottom: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#c2185b',
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
    lineHeight: 22,
    paddingHorizontal: 8,
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
    color: '#c2185b',
  },
  playButton: {
    backgroundColor: '#c2185b',
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
