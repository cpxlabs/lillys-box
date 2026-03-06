import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
  Dimensions, Animated, Modal,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useStarCatcher } from '../context/StarCatcherContext';
import { ScreenNavigationProp } from '../types/navigation';
import { useGameBack } from '../hooks/useGameBack';
import { useGameAdTrigger } from '../components/GameAdWrapper';

type Props = { navigation: ScreenNavigationProp<'StarCatcherGame'> };

const { width: SW, height: SH } = Dimensions.get('window');

const STAR_COLORS = ['#ffd700', '#ff9f43', '#ee5a24', '#f368e0', '#48dbfb', '#0abde3', '#1dd1a1', '#c8d6e5'];
const STAR_EMOJIS = ['⭐', '🌟', '✨'];
const GAME_DURATION = 45;
const MAX_STARS = 10;

interface Star {
  id: number;
  x: number;
  y: Animated.Value;
  color: string;
  emoji: string;
  isShooting: boolean;
  size: number;
  speed: number;
  points: number;
}

let starIdCounter = 0;

function createStar(level: number): Star {
  const isShooting = Math.random() < 0.1;
  const size = isShooting ? 48 : 32 + Math.random() * 16;
  const speed = 3500 - level * 250 + Math.random() * 1000;
  const x = size + Math.random() * (SW - size * 2);
  const y = new Animated.Value(-size);
  const colorIndex = Math.floor(Math.random() * STAR_COLORS.length);
  const emoji = isShooting ? '💫' : STAR_EMOJIS[Math.floor(Math.random() * STAR_EMOJIS.length)];
  const points = isShooting ? 50 : 10;
  return { id: starIdCounter++, x, y, color: STAR_COLORS[colorIndex], emoji, isShooting, size, speed: Math.max(speed, 1200), points };
}

export const StarCatcherGameScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { updateBestScore } = useStarCatcher();
  const { triggerAd } = useGameAdTrigger('star-catcher');

  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [stars, setStars] = useState<Star[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [adRewardPending, setAdRewardPending] = useState(false);

  const scoreRef = useRef(0);
  const streakRef = useRef(0);
  const gameActiveRef = useRef(true);
  const starsRef = useRef<Star[]>([]);
  const levelRef = useRef(0);

  const resetGame = useCallback(() => {
    setScore(0);
    setStreak(0);
    setTimeLeft(GAME_DURATION);
    setGameOver(false);
    setStars([]);
    starsRef.current = [];
    scoreRef.current = 0;
    streakRef.current = 0;
    levelRef.current = 0;
    gameActiveRef.current = true;
  }, []);

  const removeStar = useCallback((id: number) => {
    setStars(prev => {
      const next = prev.filter(s => s.id !== id);
      starsRef.current = next;
      return next;
    });
  }, []);

  const spawnStar = useCallback(() => {
    if (!gameActiveRef.current) return;
    if (starsRef.current.length >= MAX_STARS) return;

    const star = createStar(levelRef.current);
    starsRef.current = [...starsRef.current, star];
    setStars(prev => [...prev, star]);

    Animated.timing(star.y, {
      toValue: SH + star.size * 2,
      duration: star.speed,
      useNativeDriver: true,
    }).start(() => {
      if (gameActiveRef.current) {
        streakRef.current = 0;
        setStreak(0);
      }
      removeStar(star.id);
    });
  }, [removeStar]);

  const handleCatch = useCallback((star: Star) => {
    if (!gameActiveRef.current) return;

    streakRef.current += 1;
    const streakBonus = Math.min(streakRef.current, 5);
    const points = star.points * streakBonus;
    scoreRef.current += points;

    setScore(scoreRef.current);
    setStreak(streakRef.current);
    removeStar(star.id);
  }, [removeStar]);

  useEffect(() => {
    gameActiveRef.current = true;
    const spawnInterval = setInterval(() => {
      if (gameActiveRef.current) spawnStar();
    }, 700);

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
  }, [spawnStar, updateBestScore]);

  const handleBack = useGameBack(navigation, {
    cleanup: () => { gameActiveRef.current = false; },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}><Text style={styles.backText}>← {t('common.back')}</Text></TouchableOpacity>
        <Text style={styles.scoreText}>{t('starCatcher.game.score')}: {score}</Text>
        <Text style={styles.timerText}>{timeLeft}s</Text>
      </View>
      {streak > 1 && <Text style={styles.streakText}>x{streak} {t('starCatcher.game.streak')}!</Text>}

      <View style={styles.gameArea}>
        {stars.map(star => (
          <Animated.View
            key={star.id}
            style={[styles.starContainer, {
              left: star.x - star.size,
              width: star.size * 2,
              height: star.size * 2,
              transform: [{ translateY: star.y }],
            }]}
          >
            <TouchableOpacity
              style={[styles.star, { width: star.size * 2, height: star.size * 2 }]}
              onPress={() => handleCatch(star)}
              activeOpacity={0.7}
            >
              <Text style={[styles.starEmoji, { fontSize: star.size }]}>{star.emoji}</Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>

      <Modal visible={gameOver} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalEmoji}>⭐</Text>
            <Text style={styles.modalTitle}>{t('starCatcher.game.gameOver')}</Text>
            <Text style={styles.modalScore}>{t('starCatcher.game.finalScore')}: {score}</Text>

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
                    {adRewardPending ? t('common.loading', { defaultValue: 'Loading...' }) : t('starCatcher.game.watchAd')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.modalButton} onPress={resetGame}>
                  <Text style={styles.modalButtonText}>{t('starCatcher.game.playAgain')}</Text>
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
  container: { flex: 1, backgroundColor: '#0b0d2e' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12 },
  backText: { fontSize: 16, color: '#ffd700', fontWeight: '600' },
  scoreText: { fontSize: 18, fontWeight: '700', color: '#fff' },
  timerText: { fontSize: 18, fontWeight: '700', color: '#ffd700' },
  streakText: { textAlign: 'center', fontSize: 22, fontWeight: '800', color: '#ffd700', marginBottom: 4 },
  gameArea: { flex: 1, position: 'relative', overflow: 'hidden' },
  starContainer: { position: 'absolute', top: 0 },
  star: { justifyContent: 'center', alignItems: 'center' },
  starEmoji: { textAlign: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#1a1a3e', borderRadius: 24, padding: 32, alignItems: 'center', width: '80%', borderWidth: 1, borderColor: 'rgba(255,215,0,0.3)' },
  modalEmoji: { fontSize: 64, marginBottom: 12 },
  modalTitle: { fontSize: 28, fontWeight: '800', color: '#ffd700', marginBottom: 8 },
  modalScore: { fontSize: 20, color: '#fff', fontWeight: '700', marginBottom: 24 },
  modalButton: { backgroundColor: '#ffd700', paddingVertical: 14, paddingHorizontal: 40, borderRadius: 24, marginBottom: 12, width: '100%', alignItems: 'center' },
  modalButtonText: { fontSize: 18, fontWeight: '700', color: '#1a1a3e' },
  modalSecondaryButton: { paddingVertical: 10 },
  modalSecondaryText: { fontSize: 16, color: '#8088a8' },
});
