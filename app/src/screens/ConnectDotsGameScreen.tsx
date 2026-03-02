import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Modal, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useConnectDots } from '../context/ConnectDotsContext';
import { ScreenNavigationProp } from '../types/navigation';
import { useGameBack } from '../hooks/useGameBack';

type Props = { navigation: ScreenNavigationProp<'ConnectDotsGame'> };
const { width: SW } = Dimensions.get('window');

const PICTURES = [
  {
    name: '🐱 Cat',
    dots: [
      { x: 0.5, y: 0.2 }, { x: 0.7, y: 0.15 }, { x: 0.85, y: 0.25 },
      { x: 0.8, y: 0.5 }, { x: 0.6, y: 0.7 }, { x: 0.4, y: 0.7 },
      { x: 0.2, y: 0.5 }, { x: 0.15, y: 0.25 }, { x: 0.3, y: 0.15 },
      { x: 0.5, y: 0.2 },
    ],
  },
  {
    name: '⭐ Star',
    dots: [
      { x: 0.5, y: 0.1 }, { x: 0.63, y: 0.38 }, { x: 0.93, y: 0.38 },
      { x: 0.7, y: 0.57 }, { x: 0.81, y: 0.87 }, { x: 0.5, y: 0.68 },
      { x: 0.19, y: 0.87 }, { x: 0.3, y: 0.57 }, { x: 0.07, y: 0.38 },
      { x: 0.37, y: 0.38 }, { x: 0.5, y: 0.1 },
    ],
  },
];

export const ConnectDotsGameScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { updateBestScore } = useConnectDots();
  const [picIndex, setPicIndex] = useState(0);
  const [nextDot, setNextDot] = useState(0);
  const [connected, setConnected] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showReveal, setShowReveal] = useState(false);

  const pic = PICTURES[picIndex];
  const CANVAS_W = SW - 40;
  const CANVAS_H = CANVAS_W;

  const tapDot = useCallback((index: number) => {
    if (index !== nextDot) {
      // Wrong dot - shake effect handled by state
      return;
    }
    const newConnected = [...connected, index];
    setConnected(newConnected);
    const newNext = nextDot + 1;
    setNextDot(newNext);
    setScore(s => s + 10);

    if (newNext >= pic.dots.length) {
      setShowReveal(true);
      setTimeout(() => {
        const ns = score + 10;
        updateBestScore(ns);
        if (picIndex + 1 >= PICTURES.length) {
          setGameOver(true);
        } else {
          setPicIndex(p => p + 1);
          setNextDot(0);
          setConnected([]);
          setShowReveal(false);
        }
      }, 1500);
    }
  }, [nextDot, connected, score, pic.dots.length, picIndex, updateBestScore]);

  const restart = () => { setPicIndex(0); setNextDot(0); setConnected([]); setScore(0); setGameOver(false); setShowReveal(false); };
  const handleBack = useGameBack(navigation);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}><Text style={styles.backText}>← {t('common.back')}</Text></TouchableOpacity>
        <Text style={styles.title}>{pic.name}</Text>
        <Text style={styles.scoreText}>{score} pts</Text>
      </View>

      <Text style={styles.hint}>{t('connectDots.game.tapNext')}: {nextDot + 1}</Text>

      <View style={[styles.canvas, { width: CANVAS_W, height: CANVAS_H }]}>
        {connected.length > 0 && connected.map((ci, lineIdx) => {
          if (lineIdx + 1 >= connected.length) return null;
          const a = pic.dots[connected[lineIdx]];
          const b = pic.dots[connected[lineIdx + 1]];
          // Just show dots connected - simplified line rendering
          return null;
        })}

        {pic.dots.map((dot, i) => {
          const x = dot.x * CANVAS_W - 20;
          const y = dot.y * CANVAS_H - 20;
          const isConnected = connected.includes(i);
          const isNext = i === nextDot;
          return (
            <TouchableOpacity
              key={`dot-${i}-${dot.x}-${dot.y}`}
              style={[styles.dot, { left: x, top: y }, isConnected && styles.dotConnected, isNext && styles.dotNext]}
              onPress={() => tapDot(i)}
            >
              <Text style={styles.dotNumber}>{i + 1}</Text>
            </TouchableOpacity>
          );
        })}

        {showReveal && (
          <View style={styles.revealOverlay}>
            <Text style={styles.revealEmoji}>{pic.name.split(' ')[0]}</Text>
            <Text style={styles.revealText}>{t('connectDots.game.revealed')}!</Text>
          </View>
        )}
      </View>

      <Modal visible={gameOver} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalEmoji}>✨</Text>
            <Text style={styles.modalTitle}>{t('connectDots.game.complete')}</Text>
            <Text style={styles.modalScore}>{score} pts</Text>
            <TouchableOpacity style={styles.modalButton} onPress={restart}><Text style={styles.modalButtonText}>{t('connectDots.game.playAgain')}</Text></TouchableOpacity>
            <TouchableOpacity style={styles.modalSecondaryButton} onPress={handleBack}><Text style={styles.modalSecondaryText}>{t('common.back')}</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#e8eaf6', width: '100%' },
  backText: { fontSize: 16, color: '#3f51b5', fontWeight: '600' },
  title: { fontSize: 18, fontWeight: '700', color: '#3f51b5' },
  scoreText: { fontSize: 16, fontWeight: '700', color: '#3f51b5' },
  hint: { fontSize: 16, color: '#555', paddingVertical: 12 },
  canvas: { position: 'relative', backgroundColor: '#f5f5f5', borderRadius: 16, margin: 20 },
  dot: { position: 'absolute', width: 40, height: 40, borderRadius: 20, backgroundColor: '#e8eaf6', borderWidth: 2, borderColor: '#9fa8da', justifyContent: 'center', alignItems: 'center' },
  dotConnected: { backgroundColor: '#3f51b5', borderColor: '#283593' },
  dotNext: { backgroundColor: '#ffd740', borderColor: '#ff6f00', transform: [{ scale: 1.2 }] },
  dotNumber: { fontSize: 14, fontWeight: '700', color: '#fff' },
  revealOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.85)', borderRadius: 16 },
  revealEmoji: { fontSize: 80 },
  revealText: { fontSize: 20, fontWeight: '800', color: '#3f51b5', marginTop: 8 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', borderRadius: 24, padding: 32, alignItems: 'center', width: '80%' },
  modalEmoji: { fontSize: 64, marginBottom: 12 },
  modalTitle: { fontSize: 28, fontWeight: '800', color: '#333', marginBottom: 8 },
  modalScore: { fontSize: 20, color: '#3f51b5', fontWeight: '700', marginBottom: 24 },
  modalButton: { backgroundColor: '#3f51b5', paddingVertical: 14, paddingHorizontal: 40, borderRadius: 24, marginBottom: 12, width: '100%', alignItems: 'center' },
  modalButtonText: { fontSize: 18, fontWeight: '700', color: '#fff' },
  modalSecondaryButton: { paddingVertical: 10 },
  modalSecondaryText: { fontSize: 16, color: '#888' },
});
