import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorMixer } from '../context/ColorMixerContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { LEVELS, rgbToString } from '../data/colorMixerLevels';
import { useGameBack } from '../hooks/useGameBack';

type Props = NativeStackScreenProps<RootStackParamList, 'ColorMixerLevels'>;

const { width } = Dimensions.get('window');
const COLUMNS = 4;
const BUTTON_MARGIN = 8;
const CONTAINER_PADDING = 24;
const BUTTON_SIZE = (width - CONTAINER_PADDING * 2 - BUTTON_MARGIN * (COLUMNS + 1)) / COLUMNS;

export const ColorMixerLevelScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { getLevelProgress } = useColorMixer();

  const handleLevelPress = (levelId: number) => {
    const progress = getLevelProgress(levelId);
    if (progress.unlocked) {
      navigation.navigate('ColorMixerGame', { level: levelId });
    }
  };

  const handleBack = useGameBack(navigation);

  const renderStars = (stars: number) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3].map((star) => (
          <Text key={star} style={styles.star}>
            {star <= stars ? '⭐' : '☆'}
          </Text>
        ))}
      </View>
    );
  };

  return (
    <LinearGradient colors={['#fef3c7', '#dbeafe']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            accessibilityRole="button"
            accessibilityLabel={t('common.back')}
          >
            <Text style={styles.backText}>{t('common.back')}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('colorMixer.title')}</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.levelsGrid}>
            {LEVELS.map((level) => {
              const progress = getLevelProgress(level.id);
              const isLocked = !progress.unlocked;

              return (
                <TouchableOpacity
                  key={level.id}
                  style={[
                    styles.levelButton,
                    isLocked && styles.levelButtonLocked,
                    { width: BUTTON_SIZE, height: BUTTON_SIZE },
                  ]}
                  onPress={() => handleLevelPress(level.id)}
                  disabled={isLocked}
                  accessibilityRole="button"
                  accessibilityLabel={`${t('colorMixer.level')} ${level.id}`}
                  accessibilityState={{ disabled: isLocked }}
                >
                  {isLocked ? (
                    <View style={styles.lockContainer}>
                      <Text style={styles.lockIcon}>🔒</Text>
                    </View>
                  ) : (
                    <>
                      <View
                        style={[
                          styles.colorPreview,
                          { backgroundColor: rgbToString(level.targetColor) },
                        ]}
                      />
                      <Text style={styles.levelNumber}>{level.id}</Text>
                      {progress.completed && renderStars(progress.stars)}
                    </>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  backButton: {
    paddingVertical: 4,
  },
  backText: {
    fontSize: 16,
    color: '#ff6b6b',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  headerSpacer: {
    width: 50,
  },
  scrollContent: {
    paddingHorizontal: CONTAINER_PADDING,
    paddingTop: 16,
    paddingBottom: 32,
  },
  levelsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: BUTTON_MARGIN,
  },
  levelButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    padding: 8,
    margin: BUTTON_MARGIN / 2,
  },
  levelButtonLocked: {
    backgroundColor: '#f0f0f0',
    opacity: 0.6,
  },
  lockContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockIcon: {
    fontSize: 32,
  },
  colorPreview: {
    width: '100%',
    height: '50%',
    borderRadius: 8,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  levelNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 2,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  star: {
    fontSize: 10,
  },
});
