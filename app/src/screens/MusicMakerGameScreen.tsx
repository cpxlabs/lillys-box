import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useMusicMaker } from '../context/MusicMakerContext';
import { ScreenNavigationProp } from '../types/navigation';
import { useGameBack } from '../hooks/useGameBack';
import { useGameAdTrigger } from '../components/GameAdWrapper';

type Props = { navigation: ScreenNavigationProp<'MusicMakerGame'> };

const ROWS = 5;
const COLS = 8;
const INSTRUMENTS = ['🥁', '🔔', '🎵', '👏', '🐾'];
const INSTRUMENT_NAMES = ['Drum', 'Bell', 'Note', 'Clap', 'Meow'];
const BPM_OPTIONS = [60, 90, 120];
const BPM_LABELS = ['Slow', 'Medium', 'Fast'];

const ROW_COLORS = ['#f44336', '#ff9800', '#4caf50', '#2196f3', '#9c27b0'];

export const MusicMakerGameScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { updateBestScore } = useMusicMaker();
  const { triggerAd } = useGameAdTrigger('music-maker');
  const [adRewardPending, setAdRewardPending] = useState(false);

  const [grid, setGrid] = useState<boolean[][]>(Array.from({ length: ROWS }, () => Array(COLS).fill(false)));
  const [playing, setPlaying] = useState(false);
  const [currentCol, setCurrentCol] = useState(-1);
  const [bpmIndex, setBpmIndex] = useState(1);
  const [petBobbing, setPetBobbing] = useState(false);
  const [savedCount, setSavedCount] = useState(0);

  const playingRef = useRef(false);
  const colRef = useRef(-1);
  const gridRef = useRef(grid);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const bpmRef = useRef(BPM_OPTIONS[1]);

  const toggleCell = useCallback((row: number, col: number) => {
    setGrid(prev => {
      const next = prev.map(r => [...r]);
      next[row][col] = !next[row][col];
      gridRef.current = next;
      return next;
    });
  }, []);

  const tick = useCallback(() => {
    if (!playingRef.current) return;
    colRef.current = (colRef.current + 1) % COLS;
    setCurrentCol(colRef.current);

    const hasActive = gridRef.current.some(row => row[colRef.current]);
    if (hasActive) setPetBobbing(b => !b);
  }, []);

  const startPlay = () => {
    playingRef.current = true;
    setPlaying(true);
    const interval = Math.round(60000 / bpmRef.current / 2);
    timerRef.current = setInterval(tick, interval);
  };

  const stopPlay = () => {
    playingRef.current = false;
    setPlaying(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setCurrentCol(-1);
    colRef.current = -1;
  };

  const clearGrid = () => {
    const empty = Array.from({ length: ROWS }, () => Array(COLS).fill(false));
    setGrid(empty);
    gridRef.current = empty;
  };

  const save = () => {
    const activeCount = grid.flat().filter(Boolean).length;
    if (activeCount > 0) {
      setSavedCount(s => s + 1);
      updateBestScore(activeCount * 10);
    }
  };

  useEffect(() => {
    bpmRef.current = BPM_OPTIONS[bpmIndex];
    if (playing) { stopPlay(); setTimeout(startPlay, 50); }
  }, [bpmIndex]);

  useEffect(() => { return () => { if (timerRef.current) clearInterval(timerRef.current); }; }, []);

  const handleBack = useGameBack(navigation, { 
    cleanup: () => { stopPlay(); }
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}><Text style={styles.backText}>← {t('common.back')}</Text></TouchableOpacity>
        <Text style={styles.title}>{t('musicMaker.game.title')}</Text>
        <Text style={styles.savedText}>💾 {savedCount}</Text>
      </View>

      <View style={styles.petArea}>
        <Text style={[styles.petEmoji, petBobbing && playing && styles.petBob]}>🎵🐾🎵</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.gridContainer}>
          <View style={styles.instrumentLabels}>
            {INSTRUMENTS.map((inst, r) => (
              <View key={r} style={[styles.instrLabel, { borderRightColor: ROW_COLORS[r] }]}>
                <Text style={styles.instrEmoji}>{inst}</Text>
                <Text style={styles.instrName}>{INSTRUMENT_NAMES[r]}</Text>
              </View>
            ))}
          </View>
          <View style={styles.grid}>
            {Array.from({ length: ROWS }, (_, r) => (
              <View key={r} style={styles.row}>
                {Array.from({ length: COLS }, (_, c) => (
                  <TouchableOpacity
                    key={c}
                    style={[
                      styles.cell,
                      grid[r][c] && { backgroundColor: ROW_COLORS[r] },
                      currentCol === c && styles.activeBeat,
                      currentCol === c && grid[r][c] && styles.activeBeatOn,
                    ]}
                    onPress={() => toggleCell(r, c)}
                  />
                ))}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.controls}>
        <TouchableOpacity style={[styles.controlBtn, playing && styles.stopBtn]} onPress={playing ? stopPlay : startPlay}>
          <Text style={styles.controlText}>{playing ? '⏹ Stop' : '▶ Play'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.bpmBtn} onPress={() => setBpmIndex(i => (i + 1) % BPM_OPTIONS.length)}>
          <Text style={styles.bpmText}>{BPM_LABELS[bpmIndex]}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveBtn} onPress={save}>
          <Text style={styles.saveText}>{t('musicMaker.game.save')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.clearBtn} onPress={clearGrid}>
          <Text style={styles.clearText}>{t('musicMaker.game.clear')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a0533' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#2d0050' },
  backText: { fontSize: 16, color: '#ce93d8', fontWeight: '600' },
  title: { fontSize: 18, fontWeight: '700', color: '#fff' },
  savedText: { fontSize: 16, color: '#ce93d8' },
  petArea: { alignItems: 'center', paddingVertical: 12 },
  petEmoji: { fontSize: 32 },
  petBob: { transform: [{ translateY: -4 }] },
  gridContainer: { flexDirection: 'row', paddingHorizontal: 8 },
  instrumentLabels: { justifyContent: 'space-around', paddingRight: 4 },
  instrLabel: { height: 40, borderRightWidth: 3, paddingRight: 4, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 4 },
  instrEmoji: { fontSize: 16 },
  instrName: { fontSize: 10, color: '#aaa', width: 30 },
  grid: { flexDirection: 'column', gap: 4 },
  row: { flexDirection: 'row', gap: 4 },
  cell: { width: 36, height: 36, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  activeBeat: { borderColor: 'rgba(255,255,255,0.4)' },
  activeBeatOn: { opacity: 0.7 },
  controls: { flexDirection: 'row', gap: 8, padding: 12, justifyContent: 'center', flexWrap: 'wrap' },
  controlBtn: { backgroundColor: '#4caf50', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 20 },
  stopBtn: { backgroundColor: '#f44336' },
  controlText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  bpmBtn: { backgroundColor: '#9c27b0', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 20 },
  bpmText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  saveBtn: { backgroundColor: '#2196f3', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 20 },
  saveText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  clearBtn: { backgroundColor: '#607d8b', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 20 },
  clearText: { fontSize: 14, fontWeight: '700', color: '#fff' },
});
