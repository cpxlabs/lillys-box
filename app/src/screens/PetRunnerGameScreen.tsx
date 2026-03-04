import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { usePetRunner } from '../context/PetRunnerContext';
import { ScreenNavigationProp } from '../types/navigation';
import { EmojiIcon } from '../components/EmojiIcon';
import { useGameBack } from '../hooks/useGameBack';
import { useGameAdTrigger } from '../components/GameAdWrapper';

type Props = {
  navigation: ScreenNavigationProp<'PetRunnerGame'>;
};

// --- Constants ---
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const GROUND_HEIGHT = 80;
const GROUND_Y = SCREEN_HEIGHT - GROUND_HEIGHT;

const PET_SIZE = 40;
const PET_X = SCREEN_WIDTH * 0.15;

const GRAVITY = 0.8;
const JUMP_VELOCITY = -14;

const BASE_SPEED = 4;
const MAX_SPEED_MULTIPLIER = 2.5;
const SPEED_INCREASE_INTERVAL = 300; // frames (~5 seconds at 60fps)
const SPEED_INCREASE_FACTOR = 0.08;

const OBSTACLE_WIDTH = 36;
const OBSTACLE_HEIGHT = 36;
const MIN_OBSTACLE_GAP = 90; // minimum frames between obstacles
const MAX_OBSTACLE_GAP = 140;

const COIN_SIZE = 28;
const MIN_COIN_GAP = 60;
const MAX_COIN_GAP = 120;
const COIN_HEIGHTS = [0, 40, 80]; // offsets above ground

const OBSTACLE_EMOJIS = ['🪵', '🪨', '🧱'];
const PET_EMOJI = '🐱';
const COIN_EMOJI = '🪙';

// --- Types ---
interface Obstacle {
  x: number;
  emoji: string;
}

interface Coin {
  x: number;
  y: number;
  collected: boolean;
}

interface GameState {
  petY: number;
  petVelocity: number;
  isOnGround: boolean;
  obstacles: Obstacle[];
  coins: Coin[];
  distance: number;
  coinCount: number;
  speed: number;
  gameStatus: 'ready' | 'playing' | 'over';
  nextObstacleIn: number;
  nextCoinIn: number;
  frameCount: number;
}

function createInitialState(): GameState {
  return {
    petY: GROUND_Y - PET_SIZE,
    petVelocity: 0,
    isOnGround: true,
    obstacles: [],
    coins: [],
    distance: 0,
    coinCount: 0,
    speed: BASE_SPEED,
    gameStatus: 'ready',
    nextObstacleIn: 60,
    nextCoinIn: 30,
    frameCount: 0,
  };
}

function randomInt(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function checkCollision(
  petX: number,
  petY: number,
  obsX: number,
  obsY: number
): boolean {
  const padding = 6;
  return (
    petX + PET_SIZE - padding > obsX + padding &&
    petX + padding < obsX + OBSTACLE_WIDTH - padding &&
    petY + PET_SIZE - padding > obsY + padding &&
    petY + padding < obsY + OBSTACLE_HEIGHT - padding
  );
}

function checkCoinCollision(
  petX: number,
  petY: number,
  coinX: number,
  coinY: number
): boolean {
  const padding = 2;
  return (
    petX + PET_SIZE - padding > coinX + padding &&
    petX + padding < coinX + COIN_SIZE - padding &&
    petY + PET_SIZE - padding > coinY + padding &&
    petY + padding < coinY + COIN_SIZE - padding
  );
}

export const PetRunnerGameScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { bestScore, updateBestScore } = usePetRunner();
  const { triggerAd } = useGameAdTrigger('pet-runner');
  const [adRewardPending, setAdRewardPending] = useState(false);
  const handleBack = useGameBack(navigation, {
    cleanup: () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    },
  });

  const [renderState, setRenderState] = useState<GameState>(createInitialState);
  const stateRef = useRef<GameState>(createInitialState());
  const rafRef = useRef<number | null>(null);
  const isNewBestRef = useRef(false);

  const gameLoop = useCallback(() => {
    const s = stateRef.current;
    if (s.gameStatus !== 'playing') return;

    s.frameCount += 1;

    // Speed progression
    if (s.frameCount % SPEED_INCREASE_INTERVAL === 0) {
      s.speed = Math.min(
        BASE_SPEED * MAX_SPEED_MULTIPLIER,
        s.speed * (1 + SPEED_INCREASE_FACTOR)
      );
    }

    // Pet physics
    if (!s.isOnGround) {
      s.petVelocity += GRAVITY;
      s.petY += s.petVelocity;

      if (s.petY >= GROUND_Y - PET_SIZE) {
        s.petY = GROUND_Y - PET_SIZE;
        s.petVelocity = 0;
        s.isOnGround = true;
      }
    }

    // Move obstacles
    for (let i = s.obstacles.length - 1; i >= 0; i--) {
      s.obstacles[i].x -= s.speed;
      if (s.obstacles[i].x < -OBSTACLE_WIDTH) {
        s.obstacles.splice(i, 1);
      }
    }

    // Move coins
    for (let i = s.coins.length - 1; i >= 0; i--) {
      s.coins[i].x -= s.speed;
      if (s.coins[i].x < -COIN_SIZE) {
        s.coins.splice(i, 1);
      }
    }

    // Spawn obstacles
    s.nextObstacleIn -= 1;
    if (s.nextObstacleIn <= 0) {
      s.obstacles.push({
        x: SCREEN_WIDTH + 20,
        emoji: OBSTACLE_EMOJIS[Math.floor(Math.random() * OBSTACLE_EMOJIS.length)],
      });
      s.nextObstacleIn = randomInt(MIN_OBSTACLE_GAP, MAX_OBSTACLE_GAP);
    }

    // Spawn coins
    s.nextCoinIn -= 1;
    if (s.nextCoinIn <= 0) {
      const heightOffset = COIN_HEIGHTS[Math.floor(Math.random() * COIN_HEIGHTS.length)];
      s.coins.push({
        x: SCREEN_WIDTH + 20,
        y: GROUND_Y - COIN_SIZE - heightOffset,
        collected: false,
      });
      s.nextCoinIn = randomInt(MIN_COIN_GAP, MAX_COIN_GAP);
    }

    // Collision detection — obstacles
    for (const obs of s.obstacles) {
      const obsY = GROUND_Y - OBSTACLE_HEIGHT;
      if (checkCollision(PET_X, s.petY, obs.x, obsY)) {
        s.gameStatus = 'over';
        const finalScore = Math.floor(s.distance) + s.coinCount * 10;
        isNewBestRef.current = finalScore > bestScore;
        updateBestScore(finalScore);
        setRenderState({ ...s, obstacles: [...s.obstacles], coins: [...s.coins] });
        return;
      }
    }

    // Collision detection — coins
    for (const coin of s.coins) {
      if (!coin.collected && checkCoinCollision(PET_X, s.petY, coin.x, coin.y)) {
        coin.collected = true;
        s.coinCount += 1;
      }
    }

    // Update distance
    s.distance += s.speed / 60;

    // Update render every 2 frames for performance
    if (s.frameCount % 2 === 0) {
      setRenderState({
        ...s,
        obstacles: [...s.obstacles],
        coins: s.coins.filter((c) => !c.collected),
      });
    }

    rafRef.current = requestAnimationFrame(gameLoop);
  }, [bestScore, updateBestScore]);

  const startGame = useCallback(() => {
    const fresh = createInitialState();
    fresh.gameStatus = 'playing';
    stateRef.current = fresh;
    isNewBestRef.current = false;
    setRenderState({ ...fresh });
    rafRef.current = requestAnimationFrame(gameLoop);
  }, [gameLoop]);

  const handleTap = useCallback(() => {
    const s = stateRef.current;
    if (s.gameStatus === 'ready') {
      startGame();
      return;
    }
    if (s.gameStatus === 'playing' && s.isOnGround) {
      s.petVelocity = JUMP_VELOCITY;
      s.isOnGround = false;
    }
  }, [startGame]);

  const handlePlayAgain = useCallback(() => {
    startGame();
  }, [startGame]);

  // Cleanup RAF on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const distanceDisplay = Math.floor(renderState.distance);
  const finalScore = Math.floor(renderState.distance) + renderState.coinCount * 10;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            handleBack();
          }}
          accessibilityRole="button"
          accessibilityLabel={t('common.back')}
        >
          <Text style={styles.backText}>{t('common.back')}</Text>
        </TouchableOpacity>
        <Text style={styles.headerStat}>
          <EmojiIcon emoji={COIN_EMOJI} size={16} /> {renderState.coinCount}
        </Text>
        <Text style={styles.headerStat}>{distanceDisplay}m</Text>
      </View>

      {/* Game Area */}
      <Pressable onPress={handleTap} accessibilityRole="button" style={styles.gameArea}>
          {/* Tap to start message */}
          {renderState.gameStatus === 'ready' && (
            <View style={styles.startOverlay}>
              <EmojiIcon emoji={PET_EMOJI} size={48} style={styles.startEmoji} />
              <Text style={styles.startText}>{t('petRunner.tapToStart')}</Text>
            </View>
          )}

          {/* Pet */}
          <EmojiIcon
            emoji={PET_EMOJI}
            size={PET_SIZE}
            style={{
              position: 'absolute',
              left: PET_X,
              top: renderState.petY,
            }}
          />

          {/* Obstacles */}
          {renderState.obstacles.map((obs, i) => (
            <EmojiIcon
              key={`obs-${i}`}
              emoji={obs.emoji}
              size={OBSTACLE_HEIGHT}
              style={{
                position: 'absolute',
                left: obs.x,
                top: GROUND_Y - OBSTACLE_HEIGHT,
              }}
            />
          ))}

          {/* Coins */}
          {renderState.coins
            .filter((c) => !c.collected)
            .map((coin, i) => (
              <EmojiIcon
                key={`coin-${i}`}
                emoji={COIN_EMOJI}
                size={COIN_SIZE}
                style={{
                  position: 'absolute',
                  left: coin.x,
                  top: coin.y,
                }}
              />
            ))}

          {/* Ground */}
          <View style={[styles.ground, { top: GROUND_Y }]} />
      </Pressable>

      {/* Game Over Overlay */}
      {renderState.gameStatus === 'over' && (
        <View style={styles.overlay}>
          <View style={styles.overlayCard}>
            <Text style={styles.overlayTitle}>{t('petRunner.gameOver.title')}</Text>

            <View style={styles.overlayStats}>
              <Text style={styles.overlayStat}>
                {t('petRunner.gameOver.distance')}: {distanceDisplay}m
              </Text>
              <Text style={styles.overlayStat}>
                {t('petRunner.gameOver.coins')}: {renderState.coinCount}
              </Text>
              <Text style={styles.overlayScore}>
                {t('petRunner.gameOver.score')}: {finalScore}
              </Text>
              {isNewBestRef.current && (
                <Text style={styles.newBestText}>{t('petRunner.gameOver.newBest')}</Text>
              )}
            </View>

            {!adRewardPending && (
              <>
                <TouchableOpacity
                  style={styles.playAgainButton}
                  onPress={async () => {
                    setAdRewardPending(true);
                    const reward = await triggerAd('game_ended', finalScore);
                    if (reward > 0) {
                      const newScore = finalScore + reward;
                      updateBestScore(newScore);
                    }
                    setAdRewardPending(false);
                  }}
                  activeOpacity={0.85}
                  accessibilityRole="button"
                >
                  <Text style={styles.playAgainText}>🎬 Watch Ad to Double!</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.playAgainButton}
                  onPress={handlePlayAgain}
                  activeOpacity={0.85}
                  accessibilityRole="button"
                  accessibilityLabel={t('petRunner.gameOver.playAgain')}
                >
                  <Text style={styles.playAgainText}>{t('petRunner.gameOver.playAgain')}</Text>
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity
              style={styles.backToHomeButton}
              onPress={() => handleBack()}
              disabled={adRewardPending}
              accessibilityRole="button"
              accessibilityLabel={t('common.back')}
            >
              <Text style={styles.backToHomeText}>{t('common.back')}</Text>
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
    backgroundColor: '#87CEEB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    zIndex: 10,
  },
  backText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  headerStat: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  gameArea: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  startOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  startEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  startText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  pet: {
    position: 'absolute',
    fontSize: PET_SIZE,
    lineHeight: PET_SIZE + 4,
  },
  obstacle: {
    position: 'absolute',
    fontSize: OBSTACLE_HEIGHT,
    lineHeight: OBSTACLE_HEIGHT + 4,
  },
  coin: {
    position: 'absolute',
    fontSize: COIN_SIZE,
    lineHeight: COIN_SIZE + 4,
  },
  ground: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: GROUND_HEIGHT,
    backgroundColor: '#8B4513',
    borderTopWidth: 4,
    borderTopColor: '#228B22',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    zIndex: 20,
  },
  overlayCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 32,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  overlayTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#e74c3c',
    marginBottom: 16,
  },
  overlayStats: {
    alignItems: 'center',
    marginBottom: 24,
    gap: 6,
  },
  overlayStat: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  overlayScore: {
    fontSize: 22,
    color: '#27ae60',
    fontWeight: '800',
    marginTop: 4,
  },
  newBestText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#f1c40f',
    marginTop: 4,
  },
  playAgainButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 28,
    marginBottom: 12,
    shadowColor: '#27ae60',
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
  backToHomeButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  backToHomeText: {
    fontSize: 16,
    color: '#27ae60',
    fontWeight: '600',
  },
});
