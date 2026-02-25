import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Animated, Modal, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { usePetDanceParty } from '../context/PetDancePartyContext';
import { ScreenNavigationProp } from '../types/navigation';
import { useGameBack } from '../hooks/useGameBack';

type Props = { navigation: ScreenNavigationProp<'PetDancePartyGame'> };

const { height: SH } = Dimensions.get('window');
const DIRECTIONS = ['⬆️', '⬇️', '⬅️', '➡️'] as const;
type Direction = typeof DIRECTIONS[number];
const HIT_ZONE_Y = SH * 0.75;
const ARROW_TRAVEL = SH * 0.8;
const ARROW_SPEED = 2000;
const GAME_DURATION = 60;

interface Arrow {
  id: number;
  direction: Direction;
  y: Animated.Value;
  column: number;
  scored: boolean;
}

let arrowId = 0;

export const PetDancePartyGameScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { updateBestScore } = usePetDanceParty();

  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [arrows, setArrows] = useState<Arrow[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [petEmotion, setPetEmotion] = useState('🐾');
  const [feedback, setFeedback] = useState('');

  const scoreRef = useRef(0);
  const streakRef = useRef(0);
  const gameActiveRef = useRef(true);
  const arrowsRef = useRef<Arrow[]>([]);

  const removeArrow = useCallback((id: number) => {
    setArrows(prev => { const next = prev.filter(a => a.id !== id); arrowsRef.current = next; return next; });
  }, []);

  const spawnArrow = useCallback(() => {
    if (!gameActiveRef.current) return;
    const direction = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
    const column = Math.floor(Math.random() * 4);
    const y = new Animated.Value(-60);
    const arrow: Arrow = { id: arrowId++, direction, y, column, scored: false };
    arrowsRef.current = [...arrowsRef.current, arrow];
    setArrows(prev => [...prev, arrow]);

    Animated.timing(y, { toValue: ARROW_TRAVEL, duration: ARROW_SPEED, useNativeDriver: true }).start(() => {
      // Arrow missed
      streakRef.current = 0;
      setStreak(0);
      setPetEmotion('😵');
      setTimeout(() => setPetEmotion('🐾'), 500);
      removeArrow(arrow.id);
    });
  }, [removeArrow]);

  const handleTap = useCallback((direction: Direction) => {
    if (!gameActiveRef.current) return;
    const now = arrowsRef.current.find(a => {
      if (a.scored) return false;
      return a.direction === direction;
    });
    if (now) {
      now.scored = true;
      streakRef.current += 1;
      setStreak(streakRef.current);
      const pts = 10 * Math.min(streakRef.current, 5);
      scoreRef.current += pts;
      setScore(scoreRef.current);
      setFeedback(`+${pts}!`);
      setPetEmotion('🕺');
      setTimeout(() => { setPetEmotion('🐾'); setFeedback(''); }, 400);
      removeArrow(now.id);
    } else {
      streakRef.current = 0;
      setStreak(0);
      setFeedback('Miss!');
      setPetEmotion('😅');
      setTimeout(() => { setPetEmotion('🐾'); setFeedback(''); }, 400);
    }
  }, [removeArrow]);

  useEffect(() => {
    gameActiveRef.current = true;
    const spawnI = setInterval(spawnArrow, 900);
    const timerI = setInterval(() => {
      setTimeLeft(prev => {
        const next = prev - 1;
        if (next <= 0) {
          gameActiveRef.current = false;
          clearInterval(spawnI);
          clearInterval(timerI);
          updateBestScore(scoreRef.current);
          setGameOver(true);
        }
        return next;
      });
    }, 1000);
    return () => { gameActiveRef.current = false; clearInterval(spawnI); clearInterval(timerI); };
  }, [spawnArrow, updateBestScore]);

  const handleBack = useGameBack(navigation, { 
    cleanup: () => { gameActiveRef.current = false; }
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}><Text style={styles.backText}>← {t('common.back')}</Text></TouchableOpacity>
        <Text style={styles.scoreText}>{score}</Text>
        <Text style={styles.timerText}>{timeLeft}s</Text>
      </View>

      <View style={styles.laneContainer}>
        {[0, 1, 2, 3].map(col => (
          <View key={col} style={styles.lane}>
            {arrows.filter(a => a.column === col).map(arrow => (
              <Animated.Text key={arrow.id} style={[styles.arrow, { transform: [{ translateY: arrow.y }] }]}>
                {arrow.direction}
              </Animated.Text>
            ))}
            <View style={styles.hitZone} />
          </View>
        ))}
      </View>

      <View style={styles.petArea}>
        <Text style={styles.petEmoji}>{petEmotion}</Text>
        {feedback ? <Text style={styles.feedback}>{feedback}</Text> : null}
        {streak > 1 && <Text style={styles.streakText}>🔥 x{streak}</Text>}
      </View>

      <View style={styles.tapButtons}>
        {(['⬆️', '⬇️', '⬅️', '➡️'] as Direction[]).map((dir, i) => (
          <TouchableOpacity key={i} style={styles.tapBtn} onPress={() => handleTap(dir)} activeOpacity={0.7}>
            <Text style={styles.tapBtnText}>{dir}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Modal visible={gameOver} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalEmoji}>🪩</Text>
            <Text style={styles.modalTitle}>{t('petDanceParty.game.gameOver')}</Text>
            <Text style={styles.modalScore}>{t('petDanceParty.game.finalScore')}: {score}</Text>
            <TouchableOpacity style={styles.modalButton} onPress={() => { setScore(0); setStreak(0); setTimeLeft(GAME_DURATION); setGameOver(false); setArrows([]); arrowsRef.current = []; scoreRef.current = 0; streakRef.current = 0; gameActiveRef.current = true; }}>
              <Text style={styles.modalButtonText}>{t('petDanceParty.game.playAgain')}</Text>
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
  container: { flex: 1, backgroundColor: '#1a0533' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12 },
  backText: { fontSize: 16, color: '#ce93d8', fontWeight: '600' },
  scoreText: { fontSize: 24, fontWeight: '800', color: '#fff' },
  timerText: { fontSize: 18, fontWeight: '700', color: '#ffd700' },
  laneContainer: { flexDirection: 'row', flex: 1 },
  lane: { flex: 1, borderRightWidth: 1, borderRightColor: 'rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden' },
  arrow: { position: 'absolute', fontSize: 36, alignSelf: 'center', left: 0, right: 0, textAlign: 'center', top: 0 },
  hitZone: { position: 'absolute', bottom: 20, left: 8, right: 8, height: 4, backgroundColor: 'rgba(206,147,216,0.5)', borderRadius: 2 },
  petArea: { alignItems: 'center', paddingVertical: 12 },
  petEmoji: { fontSize: 48 },
  feedback: { fontSize: 20, fontWeight: '800', color: '#ffd700', position: 'absolute', top: 0 },
  streakText: { fontSize: 16, fontWeight: '700', color: '#ff9ff3' },
  tapButtons: { flexDirection: 'row', paddingHorizontal: 16, paddingBottom: 16, gap: 8 },
  tapBtn: { flex: 1, backgroundColor: 'rgba(156,39,176,0.5)', borderRadius: 16, paddingVertical: 20, alignItems: 'center', borderWidth: 2, borderColor: '#9b59b6' },
  tapBtnText: { fontSize: 28 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', borderRadius: 24, padding: 32, alignItems: 'center', width: '80%' },
  modalEmoji: { fontSize: 64, marginBottom: 12 },
  modalTitle: { fontSize: 28, fontWeight: '800', color: '#333', marginBottom: 8 },
  modalScore: { fontSize: 20, color: '#9b59b6', fontWeight: '700', marginBottom: 24 },
  modalButton: { backgroundColor: '#9b59b6', paddingVertical: 14, paddingHorizontal: 40, borderRadius: 24, marginBottom: 12, width: '100%', alignItems: 'center' },
  modalButtonText: { fontSize: 18, fontWeight: '700', color: '#fff' },
  modalSecondaryButton: { paddingVertical: 10 },
  modalSecondaryText: { fontSize: 16, color: '#888' },
});
