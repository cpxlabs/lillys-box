import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Animated, PanResponder, Modal, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useBalloonFloat } from '../context/BalloonFloatContext';
import { ScreenNavigationProp } from '../types/navigation';
import { useGameBack } from '../hooks/useGameBack';
import { useGameAdTrigger } from '../components/GameAdWrapper';

type Props = { navigation: ScreenNavigationProp<'BalloonFloatGame'> };

const { width: SW, height: SH } = Dimensions.get('window');
const GAME_DURATION = 60;
const PET_SIZE = 60;

interface Obstacle {
  id: number;
  x: Animated.Value;
  y: number;
  emoji: string;
  width: number;
}

interface Star { id: number; x: number; y: number; collected: boolean; }

let obsId = 0, starId = 0;

export const BalloonFloatGameScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { updateBestScore } = useBalloonFloat();
  const { triggerAd } = useGameAdTrigger('balloon-float');

  const [score, setScore] = useState(0);
  const [balloons, setBalloons] = useState(5);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [gameOver, setGameOver] = useState(false);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [stars, setStars] = useState<Star[]>([]);
  const [adRewardPending, setAdRewardPending] = useState(false);
  const petX = useRef(new Animated.Value(SW / 2 - PET_SIZE / 2)).current;
  const petXVal = useRef(SW / 2 - PET_SIZE / 2);

  const scoreRef = useRef(0);
  const balloonsRef = useRef(5);
  const gameActiveRef = useRef(true);

  const OBSTACLE_EMOJIS = ['🐦', '☁️', '✈️', '🦅', '🌪️'];

  const spawnObstacle = useCallback(() => {
    if (!gameActiveRef.current) return;
    const x = new Animated.Value(SW + 60);
    const obs: Obstacle = { id: obsId++, x, y: Math.random() * (SH * 0.5) + SH * 0.1, emoji: OBSTACLE_EMOJIS[Math.floor(Math.random() * OBSTACLE_EMOJIS.length)], width: 50 };
    setObstacles(prev => [...prev, obs]);
    Animated.timing(x, { toValue: -100, duration: 2500 + Math.random() * 1500, useNativeDriver: true }).start(() => {
      setObstacles(prev => prev.filter(o => o.id !== obs.id));
    });
  }, []);

  const spawnStar = useCallback(() => {
    if (!gameActiveRef.current) return;
    const star: Star = { id: starId++, x: Math.random() * (SW - 40), y: Math.random() * (SH * 0.6) + 50, collected: false };
    setStars(prev => [...prev, star]);
    setTimeout(() => setStars(prev => prev.filter(s => s.id !== star.id)), 3000);
  }, []);

  const panResponder = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gs) => {
      const newX = Math.max(0, Math.min(SW - PET_SIZE, petXVal.current + gs.dx));
      petX.setValue(newX);
    },
    onPanResponderRelease: (_, gs) => {
      petXVal.current = Math.max(0, Math.min(SW - PET_SIZE, petXVal.current + gs.dx));
    },
  })).current;

  useEffect(() => {
    gameActiveRef.current = true;
    const spawnObsI = setInterval(spawnObstacle, 1800);
    const spawnStarI = setInterval(spawnStar, 2500);
    const scoreI = setInterval(() => {
      if (!gameActiveRef.current) return;
      scoreRef.current += 1;
      setScore(scoreRef.current);
    }, 500);

    const timerI = setInterval(() => {
      setTimeLeft(prev => {
        const next = prev - 1;
        if (next <= 0) {
          gameActiveRef.current = false;
          clearInterval(spawnObsI); clearInterval(spawnStarI); clearInterval(scoreI); clearInterval(timerI);
          updateBestScore(scoreRef.current);
          setGameOver(true);
        }
        return next;
      });
    }, 1000);

    return () => { gameActiveRef.current = false; clearInterval(spawnObsI); clearInterval(spawnStarI); clearInterval(scoreI); clearInterval(timerI); };
  }, [spawnObstacle, spawnStar, updateBestScore]);

  const collectStar = (starId: number) => {
    scoreRef.current += 10;
    setScore(scoreRef.current);
    setStars(prev => prev.filter(s => s.id !== starId));
  };

  const handleBack = useGameBack(navigation, { 
    cleanup: () => { gameActiveRef.current = false; }
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}><Text style={styles.backText}>← {t('common.back')}</Text></TouchableOpacity>
        <Text style={styles.scoreText}>⭐ {score}</Text>
        <Text style={styles.timerText}>{timeLeft}s  {'🎈'.repeat(Math.max(0, balloons))}</Text>
      </View>
      <View style={styles.gameArea} {...panResponder.panHandlers}>
        {stars.map(star => (
          <TouchableOpacity key={star.id} style={[styles.star, { left: star.x, top: star.y }]} onPress={() => collectStar(star.id)}>
            <Text style={styles.starEmoji}>⭐</Text>
          </TouchableOpacity>
        ))}
        {obstacles.map(obs => (
          <Animated.Text key={obs.id} style={[styles.obstacle, { top: obs.y, transform: [{ translateX: obs.x }] }]}>
            {obs.emoji}
          </Animated.Text>
        ))}
        <Animated.View style={[styles.pet, { transform: [{ translateX: petX }] }]}>
          <Text style={styles.petEmoji}>🎈🐾🎈</Text>
        </Animated.View>
      </View>
      <Modal visible={gameOver} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalEmoji}>🎈</Text>
            <Text style={styles.modalTitle}>{t('balloonFloat.game.gameOver')}</Text>
            <Text style={styles.modalScore}>{t('balloonFloat.game.score')}: {score}</Text>
            {!adRewardPending && (
              <>
                <TouchableOpacity 
                  style={styles.modalButton} 
                  onPress={async () => {
                    setAdRewardPending(true);
                    const reward = await triggerAd('game_ended', score);
                    if (reward > 0) {
                      // Ad successful
                    }
                    setAdRewardPending(false);
                  }}
                >
                  <Text style={styles.modalButtonText}>🎬 {t('common.watchAdToDouble', { defaultValue: 'Watch Ad to Double!' })}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButton} onPress={() => { setScore(0); setBalloons(5); balloonsRef.current = 5; setTimeLeft(GAME_DURATION); setGameOver(false); setObstacles([]); setStars([]); scoreRef.current = 0; gameActiveRef.current = true; petXVal.current = SW/2-PET_SIZE/2; petX.setValue(SW/2-PET_SIZE/2); }}>
                  <Text style={styles.modalButtonText}>{t('balloonFloat.game.playAgain')}</Text>
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity style={styles.modalSecondaryButton} onPress={handleBack}><Text style={styles.modalSecondaryText}>{t('common.back')}</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#87CEEB' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: 'rgba(0,0,0,0.2)' },
  backText: { fontSize: 16, color: '#fff', fontWeight: '600' },
  scoreText: { fontSize: 18, fontWeight: '700', color: '#fff' },
  timerText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  gameArea: { flex: 1, position: 'relative' },
  star: { position: 'absolute', padding: 8 },
  starEmoji: { fontSize: 28 },
  obstacle: { position: 'absolute', fontSize: 40 },
  pet: { position: 'absolute', bottom: 60 },
  petEmoji: { fontSize: 36 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', borderRadius: 24, padding: 32, alignItems: 'center', width: '80%' },
  modalEmoji: { fontSize: 64, marginBottom: 12 },
  modalTitle: { fontSize: 28, fontWeight: '800', color: '#333', marginBottom: 8 },
  modalScore: { fontSize: 20, color: '#2196f3', fontWeight: '700', marginBottom: 24 },
  modalButton: { backgroundColor: '#2196f3', paddingVertical: 14, paddingHorizontal: 40, borderRadius: 24, marginBottom: 12, width: '100%', alignItems: 'center' },
  modalButtonText: { fontSize: 18, fontWeight: '700', color: '#fff' },
  modalSecondaryButton: { paddingVertical: 10 },
  modalSecondaryText: { fontSize: 16, color: '#888' },
});
