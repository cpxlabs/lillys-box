import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useWhackAMole } from '../context/WhackAMoleContext';
import { ScreenNavigationProp } from '../types/navigation';
import { getRandomPest, getRandomFriendly, getRandomPowerUp, PowerUpItem } from '../data/whackAMoleItems';
import { useGameBack } from '../hooks/useGameBack';
import { useGameAdTrigger } from '../components/GameAdWrapper';

type Props = {
  navigation: ScreenNavigationProp<'WhackAMoleGame'>;
};

// --- Constants ---
const SCREEN_WIDTH = Dimensions.get('window').width;
const ROUND_DURATION = 30; // seconds
const GRID_SIZE = 3;
const BASE_VISIBILITY = 1500; // ms
const MIN_VISIBILITY = 500; // ms
const BASE_SPAWN_INTERVAL = 800; // ms
const MIN_SPAWN_INTERVAL = 400; // ms
const FRIENDLY_CHANCE = 0.2; // 20% chance in bonus rounds
const POWER_UP_CHANCE = 0.1; // 10% chance

// --- Types ---
interface HoleContent {
  type: 'pest' | 'friendly' | 'powerup';
  emoji: string;
  points: number;
  spawnTime: number;
  visibleUntil: number;
  powerUpType?: 'freeze' | 'double';
}

interface Hole {
  id: number;
  row: number;
  col: number;
  content: HoleContent | null;
}

interface PowerUp {
  type: 'freeze' | 'double';
  expiresAt: number;
}

interface GameState {
  holes: Hole[];
  score: number;
  round: number;
  timeRemaining: number;
  combo: number;
  pestsBopped: number;
  totalPests: number;
  activePowerUp: PowerUp | null;
  gameStatus: 'ready' | 'playing' | 'gameOver';
}

function createInitialHoles(): Hole[] {
  const holes: Hole[] = [];
  let id = 0;
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      holes.push({
        id: id++,
        row,
        col,
        content: null,
      });
    }
  }
  return holes;
}

function createInitialState(): GameState {
  return {
    holes: createInitialHoles(),
    score: 0,
    round: 1,
    timeRemaining: ROUND_DURATION,
    combo: 0,
    pestsBopped: 0,
    totalPests: 0,
    activePowerUp: null,
    gameStatus: 'ready',
  };
}

export const WhackAMoleGameScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { bestScore, updateBestScore } = useWhackAMole();
  const { triggerAd } = useGameAdTrigger('whack-a-mole');

  const [renderState, setRenderState] = useState<GameState>(createInitialState);
  const [adRewardPending, setAdRewardPending] = useState(false);
  const stateRef = useRef<GameState>(createInitialState());
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const spawnRef = useRef<NodeJS.Timeout | null>(null);
  const [isNewBest, setIsNewBest] = useState(false);
  const [hammerHoleId, setHammerHoleId] = useState<number | null>(null);

  // Calculate difficulty-based values
  const getVisibilityDuration = useCallback((round: number) => {
    return Math.max(MIN_VISIBILITY, BASE_VISIBILITY - (round - 1) * 100);
  }, []);

  const getSpawnInterval = useCallback((round: number) => {
    return Math.max(MIN_SPAWN_INTERVAL, BASE_SPAWN_INTERVAL - (round - 1) * 50);
  }, []);

  const isBonusRound = useCallback((round: number) => {
    return round % 3 === 0;
  }, []);

  const spawnItem = useCallback(() => {
    const s = stateRef.current;
    if (s.gameStatus !== 'playing') return;

    // Find empty holes
    const emptyHoles = s.holes.filter((h) => !h.content);
    if (emptyHoles.length === 0) return;

    // Select random empty hole
    const hole = emptyHoles[Math.floor(Math.random() * emptyHoles.length)];

    const currentTime = Date.now();
    const visibilityDuration = getVisibilityDuration(s.round);

    // Determine what to spawn
    const powerUpRoll = Math.random();
    const bonusRound = isBonusRound(s.round);
    const friendlyRoll = Math.random();

    if (powerUpRoll < POWER_UP_CHANCE) {
      // Spawn power-up
      const powerUp = getRandomPowerUp();
      hole.content = {
        type: 'powerup',
        emoji: powerUp.emoji,
        points: 0,
        spawnTime: currentTime,
        visibleUntil: currentTime + visibilityDuration,
        powerUpType: powerUp.type,
      };
    } else if (bonusRound && friendlyRoll < FRIENDLY_CHANCE) {
      // Spawn friendly animal
      const friendly = getRandomFriendly();
      hole.content = {
        type: 'friendly',
        emoji: friendly.emoji,
        points: friendly.points,
        spawnTime: currentTime,
        visibleUntil: currentTime + visibilityDuration,
      };
    } else {
      // Spawn pest
      const pest = getRandomPest();
      hole.content = {
        type: 'pest',
        emoji: pest.emoji,
        points: pest.points,
        spawnTime: currentTime,
        visibleUntil: currentTime + visibilityDuration,
      };
      s.totalPests += 1;
    }

    setRenderState({ ...s });
  }, [getVisibilityDuration, isBonusRound]);

  const checkExpiredHoles = useCallback(() => {
    const s = stateRef.current;
    if (s.gameStatus !== 'playing') return;

    const currentTime = Date.now();
    let changed = false;

    s.holes.forEach((hole) => {
      if (hole.content && currentTime >= hole.content.visibleUntil) {
        // Missed a pest (combo resets)
        if (hole.content.type === 'pest') {
          s.combo = 0;
        }
        hole.content = null;
        changed = true;
      }
    });

    // Check power-up expiration
    if (s.activePowerUp && currentTime >= s.activePowerUp.expiresAt) {
      s.activePowerUp = null;
      changed = true;
    }

    if (changed) {
      setRenderState({ ...s });
    }
  }, []);

  const handleHoleTap = useCallback(
    (hole: Hole) => {
      if (!hole.content || stateRef.current.gameStatus !== 'playing') return;

      const s = stateRef.current;
      const currentTime = Date.now();
      const reactionTime = currentTime - hole.content.spawnTime;

      if (hole.content.type === 'powerup') {
        // Activate power-up
        const powerUpType = hole.content.powerUpType!;
        const duration = powerUpType === 'freeze' ? 3000 : 5000;
        s.activePowerUp = {
          type: powerUpType,
          expiresAt: currentTime + duration,
        };

        // If freeze, extend all current items
        if (powerUpType === 'freeze') {
          s.holes.forEach((h) => {
            if (h.content) {
              h.content.visibleUntil += 3000;
            }
          });
        }

        hole.content = null;
        setRenderState({ ...s });
        return;
      }

      if (hole.content.type === 'friendly') {
        // Penalty for tapping friendly
        s.score = Math.max(0, s.score + hole.content.points); // points is negative
        s.combo = 0;
        hole.content = null;
        setRenderState({ ...s });
        return;
      }

      // Tapped a pest!
      let points = hole.content.points;

      // Speed bonus
      if (reactionTime < 300) {
        points += 5;
      } else if (reactionTime < 500) {
        points += 3;
      }

      // Power-up multiplier
      if (s.activePowerUp?.type === 'double') {
        points *= 2;
      }

      s.score += points;
      s.combo += 1;
      s.pestsBopped += 1;
      hole.content = null;

      setRenderState({ ...s });
    },
    []
  );

  const handleStart = useCallback(() => {
    // Clear any existing intervals first
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (spawnRef.current) {
      clearInterval(spawnRef.current);
      spawnRef.current = null;
    }

    const newState = createInitialState();
    newState.gameStatus = 'playing';
    stateRef.current = newState;
    setRenderState(newState);
    setIsNewBest(false);

    // Start timer (1 second intervals)
    timerRef.current = setInterval(() => {
      const s = stateRef.current;
      if (s.gameStatus !== 'playing') return;

      s.timeRemaining -= 1;

      if (s.timeRemaining <= 0) {
        // Round/game over
        s.gameStatus = 'gameOver';
        const finalScore = s.score;
        const isNewBestScore = finalScore > bestScore;
        setIsNewBest(isNewBestScore);
        if (isNewBestScore) {
          updateBestScore(finalScore);
        }

        if (timerRef.current) clearInterval(timerRef.current);
        if (spawnRef.current) clearInterval(spawnRef.current);
        timerRef.current = null;
        spawnRef.current = null;
      }

      setRenderState({ ...s });
    }, 1000);

    // Start spawning (interval-based)
    const spawnInterval = getSpawnInterval(newState.round);
    spawnRef.current = setInterval(() => {
      spawnItem();
      checkExpiredHoles();
    }, spawnInterval);
  }, [bestScore, updateBestScore, getSpawnInterval, spawnItem, checkExpiredHoles]);

  const handlePlayAgain = useCallback(() => {
    handleStart();
  }, [handleStart]);

  const cleanupTimers = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (spawnRef.current) {
      clearInterval(spawnRef.current);
      spawnRef.current = null;
    }
  }, []);

  const handleBack = useGameBack(navigation, { cleanup: cleanupTimers });

  // Cleanup on unmount
  useEffect(() => {
    return () => cleanupTimers();
  }, [cleanupTimers]);

  const { gameStatus, holes, score, round, timeRemaining, combo, pestsBopped, totalPests, activePowerUp } =
    renderState;

  const accuracy = totalPests > 0 ? Math.round((pestsBopped / totalPests) * 100) : 0;
  const coinsEarned = Math.floor(score / 15);

  const holeSize = Math.min((SCREEN_WIDTH - 60) / GRID_SIZE, 100);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} accessibilityRole="button" accessibilityLabel={t('common.back')}>
          <Text style={styles.backText}>← {t('common.back')}</Text>
        </TouchableOpacity>

        <Text style={styles.roundText}>
          {t('whackAMole.game.round')}: {round}
        </Text>

        <Text style={styles.scoreText}>
          {t('whackAMole.game.score')}: {score}
        </Text>
      </View>

      {/* Status Bar */}
      <View style={styles.statusBar}>
        <Text style={styles.statusText}>
          {t('whackAMole.game.time')}: {timeRemaining}s
        </Text>
        {combo > 1 && (
          <Text style={styles.comboText}>
            {t('whackAMole.game.combo')}: {combo}x
          </Text>
        )}
      </View>

      {/* Game Area */}
      <View style={styles.gameArea}>
        {gameStatus === 'ready' && (
          <View style={styles.startOverlay}>
            <Text style={styles.startTitle}>{t('whackAMole.home.subtitle')}</Text>
            <TouchableOpacity style={styles.startButton} onPress={handleStart}>
              <Text style={styles.startButtonText}>Tap to Start</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Grid */}
        <View style={styles.grid}>
          {holes.map((hole) => (
            <Pressable
              key={hole.id}
              style={[styles.hole, { width: holeSize, height: holeSize }]}
              testID={`hole-${hole.id}`}
              onPress={() => {
                setHammerHoleId(hole.id);
                handleHoleTap(hole);
              }}
            >
              <View style={styles.holeInner}>
                {hole.content && <Text style={styles.emoji}>{hole.content.emoji}</Text>}
                {hammerHoleId === hole.id && <Text style={styles.hammer}>🔨</Text>}
              </View>
            </Pressable>
          ))}
        </View>

        {/* Power-up indicator */}
        {activePowerUp && (
          <View style={styles.powerUpIndicator}>
            <Text style={styles.powerUpText}>
              {activePowerUp.type === 'freeze' ? '❄️ ' : '⭐ '}
              {t(`whackAMole.game.powerUps.${activePowerUp.type}`)}
            </Text>
          </View>
        )}
      </View>

      {/* Game Over Overlay */}
      {gameStatus === 'gameOver' && (
        <View style={styles.gameOverBackdrop}>
          <View style={styles.gameOverCard}>
            <Text style={styles.gameOverTitle}>{t('whackAMole.game.gameOver')}</Text>

            <Text style={styles.finalScoreText}>
              {t('whackAMole.game.finalScore')}: {score}
            </Text>
            <Text style={styles.statsText}>
              {t('whackAMole.game.pestsBopped')}: {pestsBopped}
            </Text>
            <Text style={styles.statsText}>
              {t('whackAMole.game.accuracy')}: {accuracy}%
            </Text>
            <Text style={styles.statsText}>
              {t('whackAMole.game.coinsEarned')}: {coinsEarned} 🪙
            </Text>

            {isNewBest && <Text style={styles.newBestText}>{t('whackAMole.game.newBest')}</Text>}

            {!adRewardPending && (
              <>
                <TouchableOpacity
                  style={styles.playAgainButton}
                  onPress={async () => {
                    setAdRewardPending(true);
                    const reward = await triggerAd('game_ended', coinsEarned);
                    if (reward > 0) {
                      // Ad was successful - coins doubled in ad event
                    }
                    setAdRewardPending(false);
                  }}
                  accessibilityRole="button"
                  accessibilityLabel="Watch ad to double coins"
                >
                  <Text style={styles.playAgainText}>🎬 {t('common.watchAdToDouble', { defaultValue: 'Watch Ad to Double!' })}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.playAgainButton}
                  onPress={handlePlayAgain}
                  accessibilityRole="button"
                  accessibilityLabel={t('whackAMole.game.playAgain')}
                >
                  <Text style={styles.playAgainText}>{t('whackAMole.game.playAgain')}</Text>
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity onPress={handleBack} style={styles.backButtonOverlay}>
              <Text style={styles.backTextOverlay}>{t('common.menu')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8f5e8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4caf50',
  },
  roundText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  scoreText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4caf50',
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 16,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  comboText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#27ae60',
  },
  gameArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  startOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    backgroundColor: 'rgba(232, 245, 232, 0.95)',
  },
  startTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#4caf50',
    marginBottom: 24,
    textAlign: 'center',
  },
  startButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 28,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: SCREEN_WIDTH - 40,
    maxWidth: 320,
  },
  hole: {
    margin: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  holeInner: {
    width: '100%',
    height: '100%',
    backgroundColor: '#8d6e63',
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#6d4c41',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  emoji: {
    fontSize: 40,
  },
  hammer: {
    position: 'absolute',
    top: 4,
    right: 4,
    fontSize: 22,
  },
  powerUpIndicator: {
    position: 'absolute',
    bottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  powerUpText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4caf50',
  },
  gameOverBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  gameOverCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 32,
    maxWidth: 340,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  gameOverTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#e74c3c',
    marginBottom: 16,
  },
  finalScoreText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#4caf50',
    marginBottom: 12,
  },
  statsText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    marginBottom: 6,
  },
  newBestText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#f1c40f',
    marginTop: 8,
    marginBottom: 16,
  },
  playAgainButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 28,
    marginTop: 16,
    shadowColor: '#4caf50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  playAgainText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  backButtonOverlay: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    marginTop: 8,
  },
  backTextOverlay: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4caf50',
  },
});
