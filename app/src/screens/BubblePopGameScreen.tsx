import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
  Dimensions, Animated, Modal,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useBubblePop } from '../context/BubblePopContext';
import { ScreenNavigationProp } from '../types/navigation';
import { useGameBack } from '../hooks/useGameBack';
import { useGameAdTrigger } from '../components/GameAdWrapper';

type Props = { navigation: ScreenNavigationProp<'BubblePopGame'> };

const { width: SW, height: SH } = Dimensions.get('window');

const COLORS = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#1dd1a1'];
const BUBBLE_RADIUS = 36;
const MAX_BUBBLES = 12;
const GAME_DURATION = 60;

interface Bubble {
  id: number;
  x: number;
  y: Animated.Value;
  color: string;
  isGolden: boolean;
  size: number;
  speed: number;
  colorIndex: number;
}

let bubbleIdCounter = 0;

function createBubble(level: number): Bubble {
  const colorIndex = Math.floor(Math.random() * COLORS.length);
  const isGolden = Math.random() < 0.08;
  const size = BUBBLE_RADIUS + Math.random() * 20;
  const speed = 3000 - level * 200 + Math.random() * 1000;
  const x = size + Math.random() * (SW - size * 2);
  const y = new Animated.Value(SH + size);
  return { id: bubbleIdCounter++, x, y, color: isGolden ? '#ffd700' : COLORS[colorIndex], isGolden, size, speed: Math.max(speed, 1200), colorIndex };
}

export const BubblePopGameScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { updateBestScore } = useBubblePop();
  const { triggerAd } = useGameAdTrigger('bubble-pop');

  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [lastColorIndex, setLastColorIndex] = useState<number | null>(null);
  const [adRewardPending, setAdRewardPending] = useState(false);

  const scoreRef = useRef(0);
  const comboRef = useRef(0);
  const lastColorRef = useRef<number | null>(null);
  const gameActiveRef = useRef(true);
  const bubblesRef = useRef<Bubble[]>([]);
  const levelRef = useRef(0);

  const removeBubble = useCallback((id: number) => {
    setBubbles(prev => {
      const next = prev.filter(b => b.id !== id);
      bubblesRef.current = next;
      return next;
    });
  }, []);

  const spawnBubble = useCallback(() => {
    if (!gameActiveRef.current) return;
    if (bubblesRef.current.length >= MAX_BUBBLES) return;

    const bubble = createBubble(levelRef.current);
    bubblesRef.current = [...bubblesRef.current, bubble];
    setBubbles(prev => [...prev, bubble]);

    Animated.timing(bubble.y, {
      toValue: -bubble.size * 2,
      duration: bubble.speed,
      useNativeDriver: true,
    }).start(() => {
      removeBubble(bubble.id);
    });
  }, [removeBubble]);

  const handlePop = useCallback((bubble: Bubble) => {
    if (!gameActiveRef.current) return;

    const isCombo = lastColorRef.current === bubble.colorIndex;
    const comboBonus = isCombo ? comboRef.current + 1 : 1;
    comboRef.current = isCombo ? comboRef.current + 1 : 1;
    lastColorRef.current = bubble.colorIndex;

    const points = bubble.isGolden ? 50 : 10 * comboBonus;
    scoreRef.current += points;
    setScore(scoreRef.current);
    setCombo(comboRef.current);
    setLastColorIndex(bubble.colorIndex);
    removeBubble(bubble.id);
  }, [removeBubble]);

  useEffect(() => {
    gameActiveRef.current = true;
    const spawnInterval = setInterval(() => {
      if (gameActiveRef.current) spawnBubble();
    }, 600);

    const timerInterval = setInterval(() => {
      setTimeLeft(prev => {
        const next = prev - 1;
        if (next <= 0) {
          gameActiveRef.current = false;
          clearInterval(spawnInterval);
          clearInterval(timerInterval);
          setGameOver(true);
          updateBestScore(scoreRef.current);
        }
        if (next % 10 === 0) levelRef.current = Math.min(5, levelRef.current + 1);
        return next;
      });
    }, 1000);

    return () => {
      gameActiveRef.current = false;
      clearInterval(spawnInterval);
      clearInterval(timerInterval);
    };
  }, [spawnBubble, updateBestScore]);

  const handleBack = useGameBack(navigation, { 
    cleanup: () => { gameActiveRef.current = false; }
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}><Text style={styles.backText}>← {t('common.back')}</Text></TouchableOpacity>
        <Text style={styles.scoreText}>{t('bubblePop.game.score')}: {score}</Text>
        <Text style={styles.timerText}>{timeLeft}s</Text>
      </View>
      {combo > 1 && <Text style={styles.comboText}>x{combo} {t('bubblePop.game.combo')}!</Text>}

      <View style={styles.gameArea}>
        {bubbles.map(bubble => (
          <Animated.View
            key={bubble.id}
            style={[styles.bubbleContainer, {
              left: bubble.x - bubble.size,
              width: bubble.size * 2,
              height: bubble.size * 2,
              borderRadius: bubble.size,
              transform: [{ translateY: bubble.y }],
            }]}
          >
            <TouchableOpacity
              style={[styles.bubble, { backgroundColor: bubble.color, borderRadius: bubble.size, width: bubble.size * 2, height: bubble.size * 2 }]}
              onPress={() => handlePop(bubble)}
              activeOpacity={0.7}
            >
              <Text style={styles.bubbleEmoji}>{bubble.isGolden ? '⭐' : '○'}</Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>

      <Modal visible={gameOver} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalEmoji}>🫧</Text>
            <Text style={styles.modalTitle}>{t('bubblePop.game.gameOver')}</Text>
            <Text style={styles.modalScore}>{t('bubblePop.game.finalScore')}: {score}</Text>
            
            {!adRewardPending && (
              <>
                <TouchableOpacity 
                  style={styles.modalButton} 
                  onPress={async () => {
                    setAdRewardPending(true);
                    const reward = await triggerAd('game_ended', score);
                    if (reward > 0) {
                      const newScore = score + reward;
                      setScore(newScore);
                      updateBestScore(newScore);
                    }
                    setAdRewardPending(false);
                  }}
                  disabled={adRewardPending}
                >
                  <Text style={styles.modalButtonText}>
                    {adRewardPending ? t('common.loading', { defaultValue: 'Loading...' }) : '🎬 Watch Ad to Double!'}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.modalButton} onPress={() => { setScore(0); setCombo(0); setTimeLeft(GAME_DURATION); setGameOver(false); setBubbles([]); bubblesRef.current = []; scoreRef.current = 0; comboRef.current = 0; levelRef.current = 0; lastColorRef.current = null; gameActiveRef.current = true; }}>
                  <Text style={styles.modalButtonText}>{t('bubblePop.game.playAgain')}</Text>
                </TouchableOpacity>
              </>
            )}
            
            <TouchableOpacity style={styles.modalSecondaryButton} onPress={handleBack}>
              <Text style={styles.modalSecondaryText}>{t('common.menu')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a1628' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12 },
  backText: { fontSize: 16, color: '#4a90d9', fontWeight: '600' },
  scoreText: { fontSize: 18, fontWeight: '700', color: '#fff' },
  timerText: { fontSize: 18, fontWeight: '700', color: '#ffd700' },
  comboText: { textAlign: 'center', fontSize: 22, fontWeight: '800', color: '#ffd700', marginBottom: 4 },
  gameArea: { flex: 1, position: 'relative', overflow: 'hidden' },
  bubbleContainer: { position: 'absolute', bottom: 0 },
  bubble: { justifyContent: 'center', alignItems: 'center', shadowColor: '#fff', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 8 },
  bubbleEmoji: { fontSize: 24 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', borderRadius: 24, padding: 32, alignItems: 'center', width: '80%' },
  modalEmoji: { fontSize: 64, marginBottom: 12 },
  modalTitle: { fontSize: 28, fontWeight: '800', color: '#333', marginBottom: 8 },
  modalScore: { fontSize: 20, color: '#4a90d9', fontWeight: '700', marginBottom: 24 },
  modalButton: { backgroundColor: '#4a90d9', paddingVertical: 14, paddingHorizontal: 40, borderRadius: 24, marginBottom: 12, width: '100%', alignItems: 'center' },
  modalButtonText: { fontSize: 18, fontWeight: '700', color: '#fff' },
  modalSecondaryButton: { paddingVertical: 10 },
  modalSecondaryText: { fontSize: 16, color: '#888' },
});
