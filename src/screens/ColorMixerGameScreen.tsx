import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
  Dimensions,
  Animated,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { PanGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler';
import { useColorMixer } from '../context/ColorMixerContext';
import { ScreenNavigationProp } from '../types/navigation';
import {
  LEVELS,
  RGB,
  rgbToString,
  mixColors,
  calculateColorDistance,
  getStarsForAccuracy,
  getAccuracyPercentage,
} from '../data/colorMixerLevels';

type Props = {
  navigation: ScreenNavigationProp<'ColorMixerGame'>;
  route: { params: { level: number } };
};

const { width, height } = Dimensions.get('window');
const BOWL_SIZE = 180;
const BLOB_SIZE = 80;
const DROP_ZONE_Y_START = height * 0.35;
const DROP_ZONE_Y_END = height * 0.55;

export const ColorMixerGameScreen: React.FC<Props> = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { updateLevelProgress } = useColorMixer();
  const levelId = route.params.level;
  const level = LEVELS.find((l) => l.id === levelId);

  if (!level) {
    navigation.goBack();
    return null;
  }

  const [mixedColors, setMixedColors] = useState<RGB[]>([]);
  const [showResultModal, setShowResultModal] = useState(false);
  const [stars, setStars] = useState(0);
  const [accuracy, setAccuracy] = useState(0);

  const currentMix = mixedColors.length > 0 ? mixColors(mixedColors) : { r: 255, g: 255, b: 255 };

  const handleReset = () => {
    setMixedColors([]);
  };

  const handleCheck = () => {
    const distance = calculateColorDistance(currentMix, level.targetColor);
    const earnedStars = getStarsForAccuracy(distance);
    const accuracyPercent = getAccuracyPercentage(distance);

    setStars(earnedStars);
    setAccuracy(accuracyPercent);
    updateLevelProgress(levelId, earnedStars);
    setShowResultModal(true);
  };

  const handleNextLevel = () => {
    setShowResultModal(false);
    const nextLevel = levelId + 1;
    if (nextLevel <= LEVELS.length) {
      navigation.replace('ColorMixerGame', { level: nextLevel });
    } else {
      navigation.navigate('ColorMixerLevels');
    }
  };

  const handleTryAgain = () => {
    setShowResultModal(false);
    handleReset();
  };

  const handleBackToLevels = () => {
    setShowResultModal(false);
    navigation.navigate('ColorMixerLevels');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <GestureHandlerRootView style={styles.gestureRoot}>
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
            <Text style={styles.levelText}>
              {t('colorMixer.level')} {levelId}
            </Text>
            <View style={styles.headerSpacer} />
          </View>

          <View style={styles.content}>
            {/* Target Color Section */}
            <View style={styles.targetSection}>
              <Text style={styles.sectionLabel}>{t('colorMixer.target')}</Text>
              <View
                style={[
                  styles.targetSwatch,
                  { backgroundColor: rgbToString(level.targetColor) },
                ]}
              />
              {level.hint && <Text style={styles.hintText}>{level.hint}</Text>}
            </View>

            {/* Mixing Bowl Section */}
            <View style={styles.bowlSection}>
              <Text style={styles.sectionLabel}>{t('colorMixer.mixingBowl')}</Text>
              <View style={[styles.bowl, { backgroundColor: rgbToString(currentMix) }]}>
                {mixedColors.length === 0 && (
                  <Text style={styles.emptyBowlText}>Drag colors here</Text>
                )}
              </View>
              <TouchableOpacity
                style={styles.resetButton}
                onPress={handleReset}
                disabled={mixedColors.length === 0}
                accessibilityRole="button"
                accessibilityLabel={t('colorMixer.reset')}
              >
                <Text
                  style={[styles.resetButtonText, mixedColors.length === 0 && styles.buttonDisabled]}
                >
                  {t('colorMixer.reset')}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Paint Colors Section */}
            <View style={styles.paintsSection}>
              {level.availableColors.map((paint, index) => (
                <DraggablePaintBlob
                  key={index}
                  paint={paint}
                  onDrop={(color) => {
                    setMixedColors([...mixedColors, color]);
                  }}
                />
              ))}
            </View>

            {/* Check Button */}
            <TouchableOpacity
              style={[styles.checkButton, mixedColors.length === 0 && styles.checkButtonDisabled]}
              onPress={handleCheck}
              disabled={mixedColors.length === 0}
              accessibilityRole="button"
              accessibilityLabel={t('colorMixer.check')}
            >
              <LinearGradient
                colors={mixedColors.length > 0 ? ['#ff6b6b', '#4ecdc4'] : ['#ccc', '#ccc']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.checkButtonGradient}
              >
                <Text style={styles.checkButtonText}>{t('colorMixer.check')}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Result Modal */}
          <Modal
            visible={showResultModal}
            transparent
            animationType="fade"
            onRequestClose={() => setShowResultModal(false)}
          >
            <View style={styles.modalBackdrop}>
              <View style={styles.modalCard}>
                <Text style={styles.modalTitle}>{t('colorMixer.levelComplete')}</Text>

                <View style={styles.comparisonRow}>
                  <View style={styles.comparisonItem}>
                    <Text style={styles.comparisonLabel}>{t('colorMixer.target')}</Text>
                    <View
                      style={[
                        styles.comparisonSwatch,
                        { backgroundColor: rgbToString(level.targetColor) },
                      ]}
                    />
                  </View>
                  <View style={styles.comparisonItem}>
                    <Text style={styles.comparisonLabel}>Your Mix</Text>
                    <View
                      style={[
                        styles.comparisonSwatch,
                        { backgroundColor: rgbToString(currentMix) },
                      ]}
                    />
                  </View>
                </View>

                <View style={styles.starsRow}>
                  {[1, 2, 3].map((star) => (
                    <Text key={star} style={styles.modalStar}>
                      {star <= stars ? '⭐' : '☆'}
                    </Text>
                  ))}
                </View>

                <Text style={styles.accuracyText}>
                  {t('colorMixer.accuracy')}: {accuracy}%
                </Text>

                <View style={styles.modalButtons}>
                  {stars < 2 ? (
                    <TouchableOpacity
                      style={styles.modalButton}
                      onPress={handleTryAgain}
                      accessibilityRole="button"
                      accessibilityLabel={t('colorMixer.tryAgain')}
                    >
                      <Text style={styles.modalButtonText}>{t('colorMixer.tryAgain')}</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={styles.modalButton}
                      onPress={handleNextLevel}
                      accessibilityRole="button"
                      accessibilityLabel={t('colorMixer.nextLevel')}
                    >
                      <Text style={styles.modalButtonText}>{t('colorMixer.nextLevel')}</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={[styles.modalButton, styles.modalButtonSecondary]}
                    onPress={handleBackToLevels}
                    accessibilityRole="button"
                    accessibilityLabel={t('colorMixer.backToLevels')}
                  >
                    <Text style={styles.modalButtonTextSecondary}>
                      {t('colorMixer.backToLevels')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </SafeAreaView>
      </LinearGradient>
    </GestureHandlerRootView>
  );
};

// Draggable Paint Blob Component
interface DraggablePaintBlobProps {
  paint: { name: string; color: RGB };
  onDrop: (color: RGB) => void;
}

const DraggablePaintBlob: React.FC<DraggablePaintBlobProps> = ({ paint, onDrop }) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  const onGestureEvent = Animated.event(
    [
      {
        nativeEvent: {
          translationX: translateX,
          translationY: translateY,
        },
      },
    ],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === 5) {
      // ENDED
      const { absoluteY } = event.nativeEvent;

      // Check if dropped in the bowl area
      if (absoluteY >= DROP_ZONE_Y_START && absoluteY <= DROP_ZONE_Y_END) {
        onDrop(paint.color);
      }

      // Reset position and scale
      Animated.parallel([
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (event.nativeEvent.state === 2) {
      // BEGAN
      Animated.spring(scale, {
        toValue: 1.1,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <PanGestureHandler
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onHandlerStateChange}
    >
      <Animated.View
        style={[
          styles.paintBlob,
          {
            backgroundColor: rgbToString(paint.color),
            transform: [{ translateX }, { translateY }, { scale }],
          },
        ]}
      >
        <Text style={styles.paintName}>{paint.name}</Text>
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  gestureRoot: {
    flex: 1,
  },
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
    paddingBottom: 8,
  },
  backButton: {
    paddingVertical: 4,
  },
  backText: {
    fontSize: 16,
    color: '#ff6b6b',
    fontWeight: '600',
  },
  levelText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  headerSpacer: {
    width: 50,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-around',
  },
  targetSection: {
    alignItems: 'center',
    marginTop: 8,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  targetSwatch: {
    width: 120,
    height: 120,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  hintText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#888',
    marginTop: 8,
  },
  bowlSection: {
    alignItems: 'center',
  },
  bowl: {
    width: BOWL_SIZE,
    height: BOWL_SIZE,
    borderRadius: BOWL_SIZE / 2,
    borderWidth: 4,
    borderColor: '#94a3b8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyBowlText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  resetButton: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ff6b6b',
  },
  buttonDisabled: {
    color: '#ccc',
  },
  paintsSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    flexWrap: 'wrap',
  },
  paintBlob: {
    width: BLOB_SIZE,
    height: BLOB_SIZE,
    borderRadius: BLOB_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  paintName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  checkButton: {
    alignSelf: 'center',
    borderRadius: 32,
    shadowColor: '#ff6b6b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 16,
  },
  checkButtonDisabled: {
    opacity: 0.5,
    shadowOpacity: 0.1,
  },
  checkButtonGradient: {
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 32,
  },
  checkButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 32,
    width: width * 0.85,
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#333',
    marginBottom: 24,
  },
  comparisonRow: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 20,
  },
  comparisonItem: {
    alignItems: 'center',
  },
  comparisonLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
    marginBottom: 8,
  },
  comparisonSwatch: {
    width: 80,
    height: 80,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  modalStar: {
    fontSize: 36,
  },
  accuracyText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ff6b6b',
    marginBottom: 24,
  },
  modalButtons: {
    width: '100%',
    gap: 12,
  },
  modalButton: {
    backgroundColor: '#ff6b6b',
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
  },
  modalButtonSecondary: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#ff6b6b',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  modalButtonTextSecondary: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ff6b6b',
  },
});
