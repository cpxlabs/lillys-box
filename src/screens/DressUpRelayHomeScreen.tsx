import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDressUpRelay } from '../context/DressUpRelayContext';
import { ScreenNavigationProp } from '../types/navigation';
import { EmojiIcon } from '../components/EmojiIcon';

type Props = {
  navigation: ScreenNavigationProp<'DressUpRelayHome'>;
};

export const DressUpRelayHomeScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { bestScore } = useDressUpRelay();

  const handlePlay = () => {
    navigation.navigate('DressUpRelayGame');
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
        <Text style={styles.backText}>← {t('common.back')}</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <EmojiIcon emoji="👗" size={72} style={styles.emoji} />
        <Text style={styles.title}>{t('dressUpRelay.title')}</Text>
        <Text style={styles.subtitle}>{t('dressUpRelay.subtitle')}</Text>

        {bestScore > 0 && (
          <View style={styles.bestScoreCard}>
            <Text style={styles.bestScoreLabel}>{t('dressUpRelay.bestScore')}</Text>
            <Text style={styles.bestScoreValue}>{bestScore}</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.playButton}
          onPress={handlePlay}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel={t('dressUpRelay.play')}
        >
          <Text style={styles.playButtonText}>{t('dressUpRelay.play')}</Text>
        </TouchableOpacity>

        <Text style={styles.instructions}>{t('dressUpRelay.instructions')}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fce4ec',
  },
  backButton: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  backText: {
    fontSize: 16,
    color: '#ec4899',
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
    color: '#ec4899',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
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
    color: '#ec4899',
  },
  playButton: {
    backgroundColor: '#ec4899',
    paddingVertical: 18,
    paddingHorizontal: 52,
    borderRadius: 32,
    shadowColor: '#ec4899',
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
    maxWidth: 280,
    lineHeight: 20,
  },
});
