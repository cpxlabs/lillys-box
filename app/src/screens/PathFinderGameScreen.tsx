import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Modal } from 'react-native';
import { useTranslation } from 'react-i18next';
import { usePathFinder } from '../context/PathFinderContext';
import { ScreenNavigationProp } from '../types/navigation';
import { useGameBack } from '../hooks/useGameBack';
import { useGameAdTrigger } from '../components/GameAdWrapper';

type Props = { navigation: ScreenNavigationProp<'PathFinderGame'> };

const GRID = 6;
const OBSTACLES = new Set([7, 8, 13, 20, 22, 27, 33, 34]);
const START = 0;
const END = GRID * GRID - 1;

function isAdjacent(a: number, b: number): boolean {
  const ar = Math.floor(a / GRID), ac = a % GRID;
  const br = Math.floor(b / GRID), bc = b % GRID;
  return (Math.abs(ar - br) + Math.abs(ac - bc)) === 1;
}

function getShortestPath(): number {
  const visited = new Set<number>();
  const queue: [number, number][] = [[START, 0]];
  while (queue.length) {
    const [cur, dist] = queue.shift()!;
    if (cur === END) return dist;
    if (visited.has(cur)) continue;
    visited.add(cur);
    const r = Math.floor(cur / GRID), c = cur % GRID;
    [[r-1,c],[r+1,c],[r,c-1],[r,c+1]].forEach(([nr,nc]) => {
      const ni = nr * GRID + nc;
      if (nr >= 0 && nr < GRID && nc >= 0 && nc < GRID && !OBSTACLES.has(ni) && !visited.has(ni)) queue.push([ni, dist+1]);
    });
  }
  return Infinity;
}

const SHORTEST = getShortestPath();

export const PathFinderGameScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { updateBestScore } = usePathFinder();
  const { triggerAd } = useGameAdTrigger('path-finder');
  const [adRewardPending, setAdRewardPending] = useState(false);
  const [path, setPath] = useState<number[]>([START]);
  const [gameOver, setGameOver] = useState(false);
  const [stars, setStars] = useState(0);
  const [score, setScore] = useState(0);

  const toggleTile = useCallback((index: number) => {
    if (gameOver || index === START || OBSTACLES.has(index)) return;
    setPath(prev => {
      const last = prev[prev.length - 1];
      if (prev.includes(index)) {
        // Remove from path (trim back to this index)
        const idx = prev.indexOf(index);
        return prev.slice(0, idx + 1);
      }
      if (!isAdjacent(last, index)) return prev;
      const newPath = [...prev, index];
      if (index === END) {
        const pathLen = newPath.length - 1;
        const s = pathLen <= SHORTEST + 1 ? 3 : pathLen <= SHORTEST + 3 ? 2 : 1;
        const pts = s * 100 - pathLen * 5;
        setStars(s);
        setScore(Math.max(pts, 10));
        updateBestScore(Math.max(pts, 10));
        setTimeout(() => setGameOver(true), 300);
      }
      return newPath;
    });
  }, [gameOver, updateBestScore]);

  const restart = () => { setPath([START]); setGameOver(false); setStars(0); setScore(0); };
  const handleBack = useGameBack(navigation);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}><Text style={styles.backText}>← {t('common.back')}</Text></TouchableOpacity>
        <Text style={styles.title}>{t('pathFinder.game.title')}</Text>
        <Text style={styles.pathLen}>{t('pathFinder.game.steps')}: {path.length - 1}</Text>
      </View>
      <Text style={styles.hint}>{t('pathFinder.game.hint')}</Text>

      <View style={styles.grid}>
        {Array.from({ length: GRID * GRID }, (_, i) => {
          const isStart = i === START, isEnd = i === END;
          const isObs = OBSTACLES.has(i);
          const inPath = path.includes(i);
          return (
            <TouchableOpacity
              key={`cell-${i}`}
              style={[styles.cell, isObs && styles.obstacle, isStart && styles.startCell, isEnd && styles.endCell, inPath && !isStart && !isEnd && styles.pathCell]}
              onPress={() => toggleTile(i)}
              disabled={isObs}
              activeOpacity={0.7}
            >
              {isStart && <Text style={styles.cellEmoji}>🐾</Text>}
              {isEnd && <Text style={styles.cellEmoji}>🍖</Text>}
              {isObs && <Text style={styles.cellEmoji}>🧱</Text>}
              {inPath && !isStart && !isEnd && !isObs && <Text style={styles.pathDot}>·</Text>}
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.resetBtn} onPress={restart}>
          <Text style={styles.resetText}>{t('pathFinder.game.reset')}</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={gameOver} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalStars}>{'⭐'.repeat(stars)}</Text>
            <Text style={styles.modalTitle}>{t('pathFinder.game.pathFound')}</Text>
            <Text style={styles.modalScore}>{t('pathFinder.game.score')}: {score}</Text>
            <Text style={styles.modalSteps}>{t('pathFinder.game.steps')}: {path.length - 1} (best: {SHORTEST})</Text>
            {!adRewardPending && (
              <TouchableOpacity style={styles.modalButton} onPress={async () => {
                setAdRewardPending(true);
                const reward = await triggerAd('game_ended', score);
                setAdRewardPending(false);
              }}><Text style={styles.modalButtonText}>🎬 {t('pathFinder.game.playAgain')}</Text></TouchableOpacity>
            )}
            <TouchableOpacity style={styles.modalButton} onPress={restart} disabled={adRewardPending}><Text style={styles.modalButtonText}>{t('pathFinder.game.playAgain')}</Text></TouchableOpacity>
            <TouchableOpacity style={styles.modalSecondaryButton} onPress={handleBack} disabled={adRewardPending}><Text style={styles.modalSecondaryText}>{t('common.back')}</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e0f7fa' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#b2ebf2' },
  backText: { fontSize: 16, color: '#00796b', fontWeight: '600' },
  title: { fontSize: 18, fontWeight: '700', color: '#00796b' },
  pathLen: { fontSize: 16, color: '#555' },
  hint: { textAlign: 'center', fontSize: 14, color: '#555', paddingVertical: 8 },
  grid: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', padding: 16, gap: 4, alignContent: 'center', justifyContent: 'center' },
  cell: { width: '14%', aspectRatio: 1, backgroundColor: '#fff', borderRadius: 8, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)' },
  obstacle: { backgroundColor: '#5d4037' },
  startCell: { backgroundColor: '#4caf50' },
  endCell: { backgroundColor: '#f44336' },
  pathCell: { backgroundColor: '#00bcd4' },
  cellEmoji: { fontSize: 20 },
  pathDot: { fontSize: 24, color: '#fff', fontWeight: '800' },
  actions: { padding: 16, alignItems: 'center' },
  resetBtn: { backgroundColor: '#00bcd4', paddingVertical: 12, paddingHorizontal: 32, borderRadius: 24 },
  resetText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', borderRadius: 24, padding: 32, alignItems: 'center', width: '80%' },
  modalStars: { fontSize: 40, marginBottom: 12 },
  modalTitle: { fontSize: 24, fontWeight: '800', color: '#333', marginBottom: 8 },
  modalScore: { fontSize: 20, color: '#00bcd4', fontWeight: '700', marginBottom: 4 },
  modalSteps: { fontSize: 14, color: '#888', marginBottom: 20 },
  modalButton: { backgroundColor: '#00bcd4', paddingVertical: 14, paddingHorizontal: 40, borderRadius: 24, marginBottom: 12, width: '100%', alignItems: 'center' },
  modalButtonText: { fontSize: 18, fontWeight: '700', color: '#fff' },
  modalSecondaryButton: { paddingVertical: 10 },
  modalSecondaryText: { fontSize: 16, color: '#888' },
});
