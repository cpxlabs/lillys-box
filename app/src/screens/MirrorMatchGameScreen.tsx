import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Modal } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useMirrorMatchGame } from '../context/MirrorMatchContext';
import { ScreenNavigationProp } from '../types/navigation';

type Props = { navigation: ScreenNavigationProp<'MirrorMatchGame'> };

const GRID = 4;
const COLORS = ['#f44336', '#2196f3', '#4caf50', '#ffeb3b', '#9c27b0', '#ff9800'];

function generatePattern(): (string | null)[] {
  return Array.from({ length: GRID * GRID }, () =>
    Math.random() > 0.4 ? COLORS[Math.floor(Math.random() * COLORS.length)] : null
  );
}

function mirrorOf(pattern: (string | null)[]): (string | null)[] {
  const result: (string | null)[] = Array(GRID * GRID).fill(null);
  for (let r = 0; r < GRID; r++) {
    for (let c = 0; c < GRID; c++) {
      result[r * GRID + (GRID - 1 - c)] = pattern[r * GRID + c];
    }
  }
  return result;
}

export const MirrorMatchGameScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { updateBestScore } = useMirrorMatchGame();

  const [pattern] = useState(generatePattern);
  const target = mirrorOf(pattern);
  const [userGrid, setUserGrid] = useState<(string | null)[]>(Array(GRID * GRID).fill(null));
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const toggleCell = useCallback((index: number) => {
    setUserGrid(prev => {
      const next = [...prev];
      next[index] = prev[index] === selectedColor ? null : selectedColor;
      return next;
    });
  }, [selectedColor]);

  const checkAnswer = useCallback(() => {
    let correct = 0;
    for (let i = 0; i < GRID * GRID; i++) {
      if (userGrid[i] === target[i]) correct++;
    }
    const pts = Math.round((correct / (GRID * GRID)) * 100);
    const newScore = score + pts;
    setScore(newScore);
    if (pts === 100) {
      updateBestScore(newScore);
      setGameOver(true);
    }
  }, [userGrid, target, score, updateBestScore]);

  const handleBack = () => { if (navigation.canGoBack()) navigation.goBack(); else navigation.getParent()?.goBack(); };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}><Text style={styles.backText}>← {t('common.back')}</Text></TouchableOpacity>
        <Text style={styles.title}>{t('mirrorMatch.game.title')}</Text>
        <Text style={styles.scoreText}>{score} pts</Text>
      </View>

      <View style={styles.gridsContainer}>
        <View style={styles.gridSection}>
          <Text style={styles.gridLabel}>{t('mirrorMatch.game.pattern')}</Text>
          <View style={styles.grid}>
            {pattern.map((color, i) => (
              <View key={i} style={[styles.cell, { backgroundColor: color || '#eee' }]} />
            ))}
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.gridSection}>
          <Text style={styles.gridLabel}>{t('mirrorMatch.game.mirror')}</Text>
          <View style={styles.grid}>
            {userGrid.map((color, i) => (
              <TouchableOpacity key={i} style={[styles.cell, { backgroundColor: color || '#eee' }]} onPress={() => toggleCell(i)} />
            ))}
          </View>
        </View>
      </View>

      <View style={styles.palette}>
        <Text style={styles.paletteLabel}>{t('mirrorMatch.game.color')}:</Text>
        <View style={styles.colorsRow}>
          {COLORS.map(c => (
            <TouchableOpacity key={c} style={[styles.swatch, { backgroundColor: c }, selectedColor === c && styles.selectedSwatch]} onPress={() => setSelectedColor(c)} />
          ))}
          <TouchableOpacity style={[styles.swatch, { backgroundColor: '#eee' }, selectedColor === 'erase' as any && styles.selectedSwatch]} onPress={() => setSelectedColor(null as any)}>
            <Text style={{ fontSize: 12 }}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.checkBtn} onPress={checkAnswer}>
        <Text style={styles.checkBtnText}>{t('mirrorMatch.game.check')}</Text>
      </TouchableOpacity>

      <Modal visible={gameOver} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalEmoji}>🪞</Text>
            <Text style={styles.modalTitle}>{t('mirrorMatch.game.perfect')}</Text>
            <Text style={styles.modalScore}>{t('mirrorMatch.game.score')}: {score}</Text>
            <TouchableOpacity style={styles.modalButton} onPress={handleBack}><Text style={styles.modalButtonText}>{t('common.back')}</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#eceff1' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#b0bec5' },
  backText: { fontSize: 16, color: '#fff', fontWeight: '600' },
  title: { fontSize: 18, fontWeight: '700', color: '#fff' },
  scoreText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  gridsContainer: { flex: 1, flexDirection: 'row', padding: 16, gap: 8 },
  gridSection: { flex: 1, alignItems: 'center' },
  gridLabel: { fontSize: 14, fontWeight: '700', color: '#555', marginBottom: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 3 },
  cell: { width: '22%', aspectRatio: 1, borderRadius: 6, borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)' },
  divider: { width: 2, backgroundColor: '#9e9e9e', alignSelf: 'stretch', margin: 8, borderRadius: 1 },
  palette: { padding: 16, backgroundColor: '#f5f5f5' },
  paletteLabel: { fontSize: 14, color: '#555', marginBottom: 8 },
  colorsRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  swatch: { width: 36, height: 36, borderRadius: 18, borderWidth: 2, borderColor: 'rgba(0,0,0,0.1)', justifyContent: 'center', alignItems: 'center' },
  selectedSwatch: { borderWidth: 3, borderColor: '#333', transform: [{ scale: 1.2 }] },
  checkBtn: { margin: 16, backgroundColor: '#607d8b', borderRadius: 24, paddingVertical: 14, alignItems: 'center' },
  checkBtnText: { fontSize: 18, fontWeight: '700', color: '#fff' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', borderRadius: 24, padding: 32, alignItems: 'center', width: '80%' },
  modalEmoji: { fontSize: 64, marginBottom: 12 },
  modalTitle: { fontSize: 28, fontWeight: '800', color: '#333', marginBottom: 8 },
  modalScore: { fontSize: 20, color: '#607d8b', fontWeight: '700', marginBottom: 24 },
  modalButton: { backgroundColor: '#607d8b', paddingVertical: 14, paddingHorizontal: 40, borderRadius: 24, width: '100%', alignItems: 'center' },
  modalButtonText: { fontSize: 18, fontWeight: '700', color: '#fff' },
});
