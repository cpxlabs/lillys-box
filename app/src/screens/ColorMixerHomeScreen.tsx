import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorMixer } from '../context/ColorMixerContext';
import { ScreenNavigationProp } from '../types/navigation';
import { EmojiIcon } from '../components/EmojiIcon';
import { TOTAL_LEVELS } from '../data/colorMixerLevels';
import { useGameBack } from '../hooks/useGameBack';

type Props = {
  navigation: ScreenNavigationProp<'ColorMixerHome'>;
};

export const ColorMixerHomeScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { getTotalStars, getCompletedLevelsCount } = useColorMixer();

  const totalStars = getTotalStars();
  const completedLevels = getCompletedLevelsCount();
  const maxStars = TOTAL_LEVELS * 3;

  const handleBack = useGameBack(navigation);

  const handlePlay = () => {
    navigation.navigate('ColorMixerLevels');
  };

  return (
    <LinearGradient colors={['#fef3c7', '#dbeafe']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          accessibilityRole="button"
          accessibilityLabel={t('common.back')}
        >
          <Text style={styles.backText}>{t('common.back')}</Text>
        </TouchableOpacity>

        <View style={styles.content}>
          <EmojiIcon emoji="🎨" size={72} style={styles.emoji} />

          <LinearGradient
            colors={['#ff6b6b', '#4ecdc4']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.titleGradient}
          >
            <Text style={styles.title}>{t('colorMixer.title')}</Text>
          </LinearGradient>

          <Text style={styles.subtitle}>{t('colorMixer.subtitle')}</Text>

          <View style={styles.progressCard}>
            <View style={styles.progressRow}>
              <Text style={styles.progressLabel}>{t('colorMixer.levelsCompleted')}</Text>
              <Text style={styles.progressValue}>
                {completedLevels}/{TOTAL_LEVELS}
              </Text>
            </View>
            <View style={styles.progressRow}>
              <Text style={styles.progressLabel}>{t('colorMixer.totalStars')}</Text>
              <Text style={styles.progressValue}>
                {totalStars}/{maxStars}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.playButtonContainer}
            onPress={handlePlay}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel={t('colorMixer.play')}
          >
            <LinearGradient
              colors={['#ff6b6b', '#4ecdc4']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.playButton}
            >
              <Text style={styles.playButtonText}>{t('colorMixer.play')}</Text>
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.instructions}>{t('colorMixer.instructions')}</Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  backButton: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  backText: {
    fontSize: 16,
    color: '#ff6b6b',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    marginTop: 0,
  },
  emoji: {
    fontSize: 72,
    marginBottom: 12,
  },
  titleGradient: {
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  progressCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 32,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    width: '100%',
    maxWidth: 300,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  progressLabel: {
    fontSize: 15,
    color: '#666',
    fontWeight: '600',
  },
  progressValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ff6b6b',
  },
  playButtonContainer: {
    borderRadius: 32,
    shadowColor: '#ff6b6b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  playButton: {
    paddingVertical: 18,
    paddingHorizontal: 52,
    borderRadius: 32,
  },
  playButtonText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },
  instructions: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 28,
    maxWidth: 280,
    lineHeight: 20,
  },
});
