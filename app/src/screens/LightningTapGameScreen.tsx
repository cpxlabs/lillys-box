import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Modal } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useLightningTap } from '../context/LightningTapContext';
import { ScreenNavigationProp } from '../types/navigation';
import { useGameBack } from '../hooks/useGameBack';

type Props = { navigation: ScreenNavigationProp<'LightningTapGame'> };

const GRID_SIZE = 4;
const TOTAL = GRID_SIZE * GRID_SIZE;
const TILE_COLORS = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#1dd1a1', '#ff6348', '#2ed573', '#eccc68', '#a29bfe', '#fd79a8', '#00b894', '#0984e3', '#e17055'];
const GAME_DURATION = 30;

export const LightningTapGameScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { updateBestScore } = useLightningTap();

  const [litTiles, setLitTiles] = useState<Set<number>>(new Set());
  const [score, setScore] = useState(0);
  const [misses, setMisses] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [gameOver, setGameOver] = useState(false);
  const [reactionTime, setReactionTime] = useState(0);
  const [lastLit, setLastLit] = useState(0);

  const scoreRef = useRef(0);
  const gameActiveRef = useRef(true);
  const litRef = useRef<Set<number>>(new Set());
  const lastLitRef = useRef(Date.now());

  const lightUp = useCallback(() => {
    if (!gameActiveRef.current) return;
    const count = Math.min(1 + Math.floor((GAME_DURATION - timeLeft) / 10), 3);
    const newLit = new Set<number>();
    while (newLit.size < count) newLit.add(Math.floor(Math.random() * TOTAL));
    litRef.current = newLit;
    setLitTiles(new Set(newLit));
    lastLitRef.current = Date.now();
  }, [timeLeft]);

  useEffect(() => {
    gameActiveRef.current = true;
    const litI = setInterval(lightUp, 1200 - Math.min(score * 2, 800));
    const timerI = setInterval(() => {
      setTimeLeft(prev => {
        const next = prev - 1;
        if (next <= 0) {
          gameActiveRef.current = false;
          clearInterval(litI); clearInterval(timerI);
          updateBestScore(scoreRef.current);
          setGameOver(true);
        }
        return next;
      });
    }, 1000);
    return () => { gameActiveRef.current = false; clearInterval(litI); clearInterval(timerI); };
  }, [lightUp, updateBestScore, score]);

  const handleTap = useCallback((index: number) => {
    if (!gameActiveRef.current) return;
    if (litRef.current.has(index)) {
      const rt = Date.now() - lastLitRef.current;
      setReactionTime(rt);
      scoreRef.current += 10;
      setScore(scoreRef.current);
      litRef.current = new Set([...litRef.current].filter(i => i !== index));
      setLitTiles(new Set(litRef.current));
    } else {
      setMisses(m => m + 1);
    }
  }, []);

  const restart = () => { setScore(0); setMisses(0); setTimeLeft(GAME_DURATION); setGameOver(false); setLitTiles(new Set()); litRef.current = new Set(); scoreRef.current = 0; gameActiveRef.current = true; };
  const handleBack = useGameBack(navigation, { 
    cleanup: () => { gameActiveRef.current = false; }
  });

  const getRTLabel = (ms: number) => {
    if (ms < 200) return '⚡ Lightning fast!';
    if (ms < 350) return '🚀 Super quick!';
    if (ms < 500) return '👍 Good!';
    return '🐢 Keep trying!';
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}><Text style={styles.backText}>← {t('common.back')}</Text></TouchableOpacity>
        <Text style={styles.scoreText}>⚡ {score}</Text>
        <Text style={styles.timerText}>{timeLeft}s</Text>
      </View>
      {reactionTime > 0 && <Text style={styles.rtText}>{getRTLabel(reactionTime)} ({reactionTime}ms)</Text>}

      <View style={styles.grid}>
        {Array.from({ length: TOTAL }, (_, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.tile, { backgroundColor: litTiles.has(i) ? TILE_COLORS[i] : '#1a1a2e' }, litTiles.has(i) && styles.litTile]}
            onPress={() => handleTap(i)}
            activeOpacity={0.7}
          >
            {litTiles.has(i) && <Text style={styles.tileGlow}>⚡</Text>}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>{t('lightningTap.game.misses')}: {misses}</Text>
      </View>

      <Modal visible={gameOver} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalEmoji}>⚡</Text>
            <Text style={styles.modalTitle}>{t('lightningTap.game.gameOver')}</Text>
            <Text style={styles.modalScore}>{t('lightningTap.game.score')}: {score}</Text>
            <Text style={styles.modalMisses}>{t('lightningTap.game.misses')}: {misses}</Text>
            <TouchableOpacity style={styles.modalButton} onPress={restart}><Text style={styles.modalButtonText}>{t('lightningTap.game.playAgain')}</Text></TouchableOpacity>
            <TouchableOpacity style={styles.modalSecondaryButton} onPress={handleBack}><Text style={styles.modalSecondaryText}>{t('common.back')}</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a1a' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12 },
  backText: { fontSize: 16, color: '#ffc107', fontWeight: '600' },
  scoreText: { fontSize: 24, fontWeight: '800', color: '#ffd700' },
  timerText: { fontSize: 18, fontWeight: '700', color: '#fff' },
  rtText: { textAlign: 'center', fontSize: 16, color: '#ffc107', marginBottom: 8 },
  grid: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', padding: 16, gap: 8, alignContent: 'center', justifyContent: 'center' },
  tile: { width: '22%', aspectRatio: 1, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  litTile: { shadowColor: '#fff', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 12, elevation: 10 },
  tileGlow: { fontSize: 24 },
  footer: { padding: 16, alignItems: 'center' },
  footerText: { fontSize: 16, color: '#888' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', borderRadius: 24, padding: 32, alignItems: 'center', width: '80%' },
  modalEmoji: { fontSize: 64, marginBottom: 12 },
  modalTitle: { fontSize: 28, fontWeight: '800', color: '#333', marginBottom: 8 },
  modalScore: { fontSize: 20, color: '#ffc107', fontWeight: '700', marginBottom: 4 },
  modalMisses: { fontSize: 16, color: '#888', marginBottom: 20 },
  modalButton: { backgroundColor: '#ffc107', paddingVertical: 14, paddingHorizontal: 40, borderRadius: 24, marginBottom: 12, width: '100%', alignItems: 'center' },
  modalButtonText: { fontSize: 18, fontWeight: '700', color: '#fff' },
  modalSecondaryButton: { paddingVertical: 10 },
  modalSecondaryText: { fontSize: 16, color: '#888' },
});
