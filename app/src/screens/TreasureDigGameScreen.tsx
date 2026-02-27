import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Modal } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTreasureDig } from '../context/TreasureDigContext';
import { ScreenNavigationProp } from '../types/navigation';
import { useGameBack } from '../hooks/useGameBack';

type Props = { navigation: ScreenNavigationProp<'TreasureDigGame'> };

const GRID = 5;
const MAX_DIGS = 15;
const TREASURES = ['💎', '🪙', '🦴', '🧸', '⭐', '🏆'];

type TileState = 'hidden' | 'empty' | 'treasure';

interface Tile {
  state: TileState;
  content: string;
  treasureIndex: number;
  heatLevel: number; // 0-3 cold to hot
}

function initGrid(): Tile[] {
  const totalTiles = GRID * GRID;
  const treasurePositions = new Set<number>();
  while (treasurePositions.size < 6) treasurePositions.add(Math.floor(Math.random() * totalTiles));

  const treasureList = [...treasurePositions];
  return Array.from({ length: totalTiles }, (_, i) => {
    const isTreasure = treasurePositions.has(i);
    const content = isTreasure ? TREASURES[treasureList.indexOf(i) % TREASURES.length] : '';
    // compute min distance to nearest treasure
    const row = Math.floor(i / GRID), col = i % GRID;
    let minDist = Infinity;
    for (const tp of treasurePositions) {
      const tr = Math.floor(tp / GRID), tc = tp % GRID;
      const d = Math.abs(tr - row) + Math.abs(tc - col);
      minDist = Math.min(minDist, d);
    }
    const heatLevel = minDist === 0 ? 3 : minDist === 1 ? 2 : minDist <= 3 ? 1 : 0;
    return { state: 'hidden' as TileState, content, treasureIndex: isTreasure ? 1 : 0, heatLevel };
  });
}

const HEAT_COLORS = ['#4fc3f7', '#fff176', '#ff8a65', '#ef5350'];
const HEAT_LABELS = ['❄️ Cold', '🌡️ Warm', '🔥 Hot', '🔥🔥 Burning!'];

export const TreasureDigGameScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { updateBestScore } = useTreasureDig();

  const [tiles, setTiles] = useState<Tile[]>(initGrid);
  const [digsLeft, setDigsLeft] = useState(MAX_DIGS);
  const [score, setScore] = useState(0);
  const [found, setFound] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [lastHeat, setLastHeat] = useState(0);

  const dig = useCallback((index: number) => {
    if (digsLeft <= 0 || gameOver) return;
    setTiles(prev => {
      if (prev[index].state !== 'hidden') return prev;
      const next = [...prev];
      next[index] = { ...next[index], state: next[index].treasureIndex > 0 ? 'treasure' : 'empty' };
      return next;
    });
    setLastHeat(tiles[index].heatLevel);

    const newDigs = digsLeft - 1;
    setDigsLeft(newDigs);

    if (tiles[index].treasureIndex > 0) {
      const pts = 50;
      setScore(s => s + pts);
      const newFound = found + 1;
      setFound(newFound);
      if (newFound >= 6 || newDigs <= 0) {
        const finalScore = score + pts;
        updateBestScore(finalScore);
        setGameOver(true);
      }
    } else if (newDigs <= 0) {
      updateBestScore(score);
      setGameOver(true);
    }
  }, [digsLeft, gameOver, tiles, found, score, updateBestScore]);

  const restart = () => { setTiles(initGrid()); setDigsLeft(MAX_DIGS); setScore(0); setFound(0); setGameOver(false); setLastHeat(0); };
  const handleBack = useGameBack(navigation);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}><Text style={styles.backText}>← {t('common.back')}</Text></TouchableOpacity>
        <View style={styles.stats}>
          <Text style={styles.statText}>⛏️ {digsLeft}</Text>
          <Text style={styles.statText}>💎 {found}/6</Text>
          <Text style={styles.statText}>⭐ {score}</Text>
        </View>
      </View>

      <View style={[styles.heatBar, { backgroundColor: HEAT_COLORS[lastHeat] }]}>
        <Text style={styles.heatText}>{HEAT_LABELS[lastHeat]}</Text>
      </View>

      <View style={styles.grid}>
        {tiles.map((tile, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.tile, tile.state !== 'hidden' && styles.tileRevealed, tile.state === 'treasure' && styles.tileTreasure]}
            onPress={() => dig(i)}
            activeOpacity={0.7}
            disabled={tile.state !== 'hidden'}
          >
            {tile.state === 'hidden' && <Text style={styles.tileHidden}>🟫</Text>}
            {tile.state === 'empty' && <Text style={styles.tileEmpty}>·</Text>}
            {tile.state === 'treasure' && <Text style={styles.treasureEmoji}>{tile.content}</Text>}
          </TouchableOpacity>
        ))}
      </View>

      <Modal visible={gameOver} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalEmoji}>{found >= 6 ? '🏆' : '💎'}</Text>
            <Text style={styles.modalTitle}>{found >= 6 ? t('treasureDig.game.allFound') : t('treasureDig.game.gameOver')}</Text>
            <Text style={styles.modalScore}>{t('treasureDig.game.found')}: {found}/6 | {t('treasureDig.game.score')}: {score}</Text>
            <TouchableOpacity style={styles.modalButton} onPress={restart}>
              <Text style={styles.modalButtonText}>{t('treasureDig.game.playAgain')}</Text>
            </TouchableOpacity>
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
  container: { flex: 1, backgroundColor: '#3e2723' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  backText: { fontSize: 16, color: '#ffcc02', fontWeight: '600' },
  stats: { flexDirection: 'row', gap: 16 },
  statText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  heatBar: { marginHorizontal: 16, borderRadius: 12, paddingVertical: 8, alignItems: 'center', marginBottom: 8 },
  heatText: { fontSize: 16, fontWeight: '700', color: '#333' },
  grid: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, paddingBottom: 16, justifyContent: 'center', alignContent: 'center', gap: 6 },
  tile: { width: '18%', aspectRatio: 1, backgroundColor: '#5d4037', borderRadius: 10, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#795548' },
  tileRevealed: { backgroundColor: '#a1887f' },
  tileTreasure: { backgroundColor: '#fff8e1', borderColor: '#ffd700' },
  tileHidden: { fontSize: 24 },
  tileEmpty: { fontSize: 20, color: '#8d6e63' },
  treasureEmoji: { fontSize: 28 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', borderRadius: 24, padding: 32, alignItems: 'center', width: '80%' },
  modalEmoji: { fontSize: 64, marginBottom: 12 },
  modalTitle: { fontSize: 24, fontWeight: '800', color: '#333', marginBottom: 8 },
  modalScore: { fontSize: 16, color: '#f39c12', fontWeight: '700', marginBottom: 24, textAlign: 'center' },
  modalButton: { backgroundColor: '#f39c12', paddingVertical: 14, paddingHorizontal: 40, borderRadius: 24, marginBottom: 12, width: '100%', alignItems: 'center' },
  modalButtonText: { fontSize: 18, fontWeight: '700', color: '#fff' },
  modalSecondaryButton: { paddingVertical: 10 },
  modalSecondaryText: { fontSize: 16, color: '#888' },
});
