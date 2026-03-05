import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Modal, ScrollView, DimensionValue } from 'react-native';
import { useTranslation } from 'react-i18next';
import { usePaintSplash } from '../context/PaintSplashContext';
import { ScreenNavigationProp } from '../types/navigation';
import { useGameBack } from '../hooks/useGameBack';
import { useGameAdTrigger } from '../components/GameAdWrapper';

type Props = { navigation: ScreenNavigationProp<'PaintSplashGame'> };

const COLORS = ['#f44336', '#ff9800', '#ffeb3b', '#4caf50', '#2196f3', '#9c27b0', '#ff69b4', '#ffffff'];
const SECTIONS = ['sky', 'sun', 'tree', 'flower', 'grass', 'cloud', 'bird', 'ground'];
const TARGET_COLORS: Record<string, string> = {
  sky: '#2196f3', sun: '#ffeb3b', tree: '#4caf50', flower: '#f44336',
  grass: '#4caf50', cloud: '#ffffff', bird: '#9c27b0', ground: '#ff9800',
};
const SECTION_EMOJIS: Record<string, string> = {
  sky: '🌌', sun: '☀️', tree: '🌳', flower: '🌸',
  grass: '🌿', cloud: '☁️', bird: '🐦', ground: '🟤',
};

export const PaintSplashGameScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { updateBestScore } = usePaintSplash();
  const { triggerAd } = useGameAdTrigger('paint-splash');

  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [painted, setPainted] = useState<Record<string, string>>({});
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [adRewardPending, setAdRewardPending] = useState(false);

  const paint = useCallback((section: string) => {
    const correct = TARGET_COLORS[section] === selectedColor;
    const pts = correct ? 25 : 5;
    setPainted(prev => ({ ...prev, [section]: selectedColor }));
    setScore(prev => {
      const newScore = prev + pts;
      const allPainted = Object.keys(TARGET_COLORS).every(s => painted[s] || s === section);
      if (allPainted) {
        updateBestScore(newScore);
        setTimeout(() => setGameOver(true), 300);
      }
      return newScore;
    });
  }, [selectedColor, painted, updateBestScore]);

  const restart = () => { setPainted({}); setScore(0); setGameOver(false); };
  const handleBack = useGameBack(navigation);

  const progress = (Object.keys(painted).length / SECTIONS.length) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}><Text style={styles.backText}>← {t('common.back')}</Text></TouchableOpacity>
        <Text style={styles.scoreText}>{score} pts</Text>
        <Text style={styles.progressText}>{Math.round(progress)}%</Text>
      </View>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%` as DimensionValue }]} />
      </View>

      <ScrollView contentContainerStyle={styles.canvas}>
        <Text style={styles.canvasTitle}>{t('paintSplash.game.title')}</Text>
        <View style={styles.sectionsGrid}>
          {SECTIONS.map(section => {
            const color = painted[section] || '#ddd';
            const correct = painted[section] === TARGET_COLORS[section];
            return (
              <TouchableOpacity
                key={section}
                style={[styles.section, { backgroundColor: color, borderColor: correct ? '#4caf50' : '#ccc' }]}
                onPress={() => paint(section)}
                activeOpacity={0.7}
              >
                <Text style={styles.sectionEmoji}>{SECTION_EMOJIS[section]}</Text>
                <Text style={styles.sectionLabel}>{section}</Text>
                {correct && <Text style={styles.checkMark}>✓</Text>}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.colorPalette}>
        <Text style={styles.paletteLabel}>{t('paintSplash.game.selectColor')}:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.colorsRow}>
          {COLORS.map(color => (
            <TouchableOpacity
              key={color}
              style={[styles.colorSwatch, { backgroundColor: color }, selectedColor === color && styles.selectedSwatch]}
              onPress={() => setSelectedColor(color)}
            />
          ))}
        </ScrollView>
      </View>

      <Modal visible={gameOver} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalEmoji}>🎨</Text>
            <Text style={styles.modalTitle}>{t('paintSplash.game.complete')}</Text>
            <Text style={styles.modalScore}>{t('paintSplash.game.score')}: {score}</Text>
            {!adRewardPending && (
              <>
                <TouchableOpacity 
                  style={styles.modalButton} 
                  onPress={async () => {
                    setAdRewardPending(true);
                    const reward = await triggerAd('game_ended', score);
                    if (reward > 0) {
                      // Ad was successful - coins doubled
                    }
                    setAdRewardPending(false);
                  }}
                  disabled={adRewardPending}
                >
                  <Text style={styles.modalButtonText}>
                    {adRewardPending ? t('common.loading', { defaultValue: 'Loading...' }) : '🎬 Watch Ad to Double!'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButton} onPress={restart}>
                  <Text style={styles.modalButtonText}>{t('paintSplash.game.playAgain')}</Text>
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity style={styles.modalSecondaryButton} onPress={handleBack}>
              <Text style={styles.modalSecondaryText}>{t('common.back')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fce4ec' },
  backText: { fontSize: 16, color: '#e91e63', fontWeight: '600' },
  scoreText: { fontSize: 18, fontWeight: '700', color: '#e91e63' },
  progressText: { fontSize: 16, color: '#666' },
  progressBar: { height: 6, backgroundColor: '#eee', marginHorizontal: 16, borderRadius: 3, marginBottom: 8 },
  progressFill: { height: '100%', backgroundColor: '#e91e63', borderRadius: 3 },
  canvas: { padding: 16 },
  canvasTitle: { fontSize: 20, fontWeight: '700', color: '#333', marginBottom: 16, textAlign: 'center' },
  sectionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center' },
  section: { width: '44%', aspectRatio: 1, borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 3 },
  sectionEmoji: { fontSize: 40 },
  sectionLabel: { fontSize: 12, fontWeight: '600', color: 'rgba(0,0,0,0.6)', marginTop: 4 },
  checkMark: { fontSize: 20, color: '#4caf50', position: 'absolute', top: 8, right: 8 },
  colorPalette: { backgroundColor: '#f5f5f5', paddingHorizontal: 16, paddingVertical: 12 },
  paletteLabel: { fontSize: 14, color: '#666', marginBottom: 8 },
  colorsRow: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  colorSwatch: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: 'rgba(0,0,0,0.1)' },
  selectedSwatch: { borderWidth: 4, borderColor: '#333', transform: [{ scale: 1.2 }] },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', borderRadius: 24, padding: 32, alignItems: 'center', width: '80%' },
  modalEmoji: { fontSize: 64, marginBottom: 12 },
  modalTitle: { fontSize: 28, fontWeight: '800', color: '#333', marginBottom: 8 },
  modalScore: { fontSize: 20, color: '#e91e63', fontWeight: '700', marginBottom: 24 },
  modalButton: { backgroundColor: '#e91e63', paddingVertical: 14, paddingHorizontal: 40, borderRadius: 24, marginBottom: 12, width: '100%', alignItems: 'center' },
  modalButtonText: { fontSize: 18, fontWeight: '700', color: '#fff' },
  modalSecondaryButton: { paddingVertical: 10 },
  modalSecondaryText: { fontSize: 16, color: '#888' },
});
