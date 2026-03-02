import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { useTranslation } from 'react-i18next';
import { useFeedThePet } from '../context/FeedThePetContext';
import { ScreenNavigationProp } from '../types/navigation';
import { EmojiIcon } from '../components/EmojiIcon';
import { getRandomItem, FeedThePetItem } from '../data/feedThePetItems';
import { useGameBack } from '../hooks/useGameBack';

type Props = {
  navigation: ScreenNavigationProp<'FeedThePetGame'>;
};

// --- Constants ---
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const BOWL_SIZE = 50;
const BOWL_Y = SCREEN_HEIGHT - 120; // Fixed Y position near bottom

const ITEM_SIZE = 36;
const FALL_SPEED_INITIAL = 3;
const FALL_SPEED_MAX = 8;
const SPAWN_INTERVAL_INITIAL = 1500; // ms
const SPAWN_INTERVAL_MIN = 800; // ms

const COLLISION_RADIUS = 40;
const INITIAL_LIVES = 3;

// Combo multipliers
const getComboMultiplier = (combo: number): number => {
  if (combo >= 5) return 3;
  if (combo >= 3) return 2;
  if (combo >= 2) return 1.5;
  return 1;
};

// --- Types ---
interface FallingItem extends FeedThePetItem {
  id: string;
  x: number;
  y: number;
}

interface GameState {
  bowlX: number;
  fallingItems: FallingItem[];
  score: number;
  lives: number;
  combo: number;
  fallSpeed: number;
  spawnInterval: number;
  gameStatus: 'ready' | 'playing' | 'over';
  frames: number;
  lastSpawnTime: number;
}

function createInitialState(): GameState {
  return {
    bowlX: SCREEN_WIDTH / 2 - BOWL_SIZE / 2,
    fallingItems: [],
    score: 0,
    lives: INITIAL_LIVES,
    combo: 0,
    fallSpeed: FALL_SPEED_INITIAL,
    spawnInterval: SPAWN_INTERVAL_INITIAL,
    gameStatus: 'ready',
    frames: 0,
    lastSpawnTime: 0,
  };
}

function checkCollision(itemX: number, itemY: number, bowlX: number, bowlY: number): boolean {
  const itemCenterX = itemX + ITEM_SIZE / 2;
  const itemCenterY = itemY + ITEM_SIZE / 2;
  const bowlCenterX = bowlX + BOWL_SIZE / 2;
  const bowlCenterY = bowlY + BOWL_SIZE / 2;

  const distance = Math.sqrt(
    Math.pow(itemCenterX - bowlCenterX, 2) +
    Math.pow(itemCenterY - bowlCenterY, 2)
  );

  return distance < COLLISION_RADIUS;
}

export const FeedThePetGameScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { bestScore, updateBestScore } = useFeedThePet();

  const [renderState, setRenderState] = useState<GameState>(createInitialState);
  const stateRef = useRef<GameState>(createInitialState());
  const rafRef = useRef<number | null>(null);
  const isNewBestRef = useRef(false);
  const itemIdCounter = useRef(0);

  const gameLoop = useCallback(() => {
    const s = stateRef.current;
    if (s.gameStatus !== 'playing') {
      // Stop the loop if game is not playing
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      return;
    }

    s.frames += 1;
    const currentTime = Date.now();

    // Difficulty scaling every 30 seconds (1800 frames at 60fps)
    if (s.frames % 1800 === 0 && s.fallSpeed < FALL_SPEED_MAX) {
      s.fallSpeed += 0.5;
      s.spawnInterval = Math.max(s.spawnInterval - 100, SPAWN_INTERVAL_MIN);
    }

    // Spawn new items
    if (currentTime - s.lastSpawnTime >= s.spawnInterval) {
      const item = getRandomItem();
      const newItem: FallingItem = {
        ...item,
        id: `item-${itemIdCounter.current++}`,
        x: Math.random() * (SCREEN_WIDTH * 0.8 - ITEM_SIZE) + SCREEN_WIDTH * 0.1,
        y: -ITEM_SIZE,
      };
      s.fallingItems.push(newItem);
      s.lastSpawnTime = currentTime;
    }

    // Update falling items
    const itemsToRemove: string[] = [];
    s.fallingItems.forEach((item) => {
      item.y += s.fallSpeed;

      // Check collision with bowl
      if (checkCollision(item.x, item.y, s.bowlX, BOWL_Y)) {
        itemsToRemove.push(item.id);

        if (item.type === 'good') {
          // Good item caught
          const multiplier = getComboMultiplier(s.combo + 1);
          s.score += Math.floor(item.points * multiplier);
          s.combo += 1;
        } else {
          // Bad item caught
          s.score = Math.max(0, s.score + item.points); // item.points is negative
          s.lives -= 1;
          s.combo = 0; // Reset combo

          if (s.lives <= 0) {
            s.gameStatus = 'over';
            const finalScore = s.score;
            const isNewBest = finalScore > bestScore;
            isNewBestRef.current = isNewBest;
            if (isNewBest) {
              updateBestScore(finalScore);
            }
            // Don't continue loop after game over
            setRenderState({ ...s });
            return;
          }
        }
      }

      // Remove off-screen items
      if (item.y > SCREEN_HEIGHT) {
        itemsToRemove.push(item.id);
        // Reset combo if a good item was missed
        if (item.type === 'good') {
          s.combo = 0;
        }
      }
    });

    // Remove collected/off-screen items
    s.fallingItems = s.fallingItems.filter((item) => !itemsToRemove.includes(item.id));

    // Update render
    setRenderState({ ...s });

    // Continue loop only if still playing
    if (s.gameStatus === 'playing') {
      rafRef.current = requestAnimationFrame(gameLoop);
    }
  }, [bestScore, updateBestScore]);

  useEffect(() => {
    if (stateRef.current.gameStatus === 'playing') {
      rafRef.current = requestAnimationFrame(gameLoop);
      return () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
    }
  }, [gameLoop, renderState.gameStatus]);

  const handleStart = useCallback(() => {
    // Clean up any existing animation frame
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    const newState = createInitialState();
    newState.gameStatus = 'playing';
    newState.lastSpawnTime = Date.now();
    stateRef.current = newState;
    setRenderState(newState);
    isNewBestRef.current = false;
    itemIdCounter.current = 0; // Reset item counter
  }, []);

  const handlePlayAgain = useCallback(() => {
    handleStart();
  }, [handleStart]);

  const cleanupRaf = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const handleBack = useGameBack(navigation, { cleanup: cleanupRaf });

  // Pan gesture for bowl
  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (stateRef.current.gameStatus === 'playing') {
        const newX = Math.max(
          0,
          Math.min(SCREEN_WIDTH - BOWL_SIZE, e.absoluteX - BOWL_SIZE / 2)
        );
        stateRef.current.bowlX = newX;
        setRenderState((prev) => ({ ...prev, bowlX: newX }));
      }
    });

  const { gameStatus, bowlX, fallingItems, score, lives, combo } = renderState;
  const coinsEarned = Math.floor(score / 10);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBack}
          accessibilityRole="button"
          accessibilityLabel={t('feedThePet.game.back')}
        >
          <Text style={styles.backText}>← {t('feedThePet.game.back')}</Text>
        </TouchableOpacity>

        <View style={styles.livesContainer}>
          {Array.from({ length: INITIAL_LIVES }).map((_, i) => (
            <Text key={`life-${i}`} style={styles.heartEmoji}>
              {i < lives ? '❤️' : '🖤'}
            </Text>
          ))}
        </View>

        <Text style={styles.scoreText}>
          {t('feedThePet.game.score')}: {score}
        </Text>
      </View>

      {/* Combo Display */}
      {combo > 1 && gameStatus === 'playing' && (
        <View style={styles.comboContainer}>
          <Text style={styles.comboText}>
            {t('feedThePet.game.combo')}: {combo}x!
          </Text>
        </View>
      )}

      {/* Game Area */}
      <GestureDetector gesture={panGesture}>
        <View style={styles.gameArea}>
          {/* Start Overlay */}
          {gameStatus === 'ready' && (
            <View style={styles.startOverlay}>
              <EmojiIcon emoji="🍽️" size={48} style={styles.startEmoji} />
              <Text style={styles.startText}>{t('feedThePet.home.subtitle')}</Text>
              <TouchableOpacity style={styles.startButton} onPress={handleStart}>
                <Text style={styles.startButtonText}>Tap to Start</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Falling Items */}
          {fallingItems.map((item) => (
            <View
              key={item.id}
              style={[
                styles.fallingItem,
                { left: item.x, top: item.y },
              ]}
            >
              <Text style={styles.itemEmoji}>{item.emoji}</Text>
            </View>
          ))}

          {/* Bowl */}
          {gameStatus !== 'ready' && (
            <View style={[styles.bowl, { left: bowlX, top: BOWL_Y }]}>
              <Text style={styles.bowlEmoji}>🥣</Text>
            </View>
          )}

          {/* Ground Line */}
          <View style={styles.groundLine} />
        </View>
      </GestureDetector>

      {/* Game Over Overlay */}
      {gameStatus === 'over' && (
        <View style={styles.gameOverBackdrop}>
          <View style={styles.gameOverCard}>
            <Text style={styles.gameOverTitle}>{t('feedThePet.game.gameOver')}</Text>

            <Text style={styles.finalScoreText}>
              {t('feedThePet.game.finalScore')}: {score}
            </Text>
            <Text style={styles.coinsText}>
              {t('feedThePet.game.coinsEarned')}: {coinsEarned} 🪙
            </Text>

            {isNewBestRef.current && (
              <Text style={styles.newBestText}>{t('feedThePet.game.newBest')}</Text>
            )}

            <TouchableOpacity
              style={styles.playAgainButton}
              onPress={handlePlayAgain}
              accessibilityRole="button"
              accessibilityLabel={t('feedThePet.game.playAgain')}
            >
              <Text style={styles.playAgainText}>{t('feedThePet.game.playAgain')}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleBack} style={styles.backButtonOverlay}>
              <Text style={styles.backTextOverlay}>{t('feedThePet.game.back')}</Text>
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
    backgroundColor: '#fff8e1',
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
    fontWeight: '600',
    color: '#ff9800',
  },
  livesContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  heartEmoji: {
    fontSize: 20,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ff9800',
  },
  comboContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  comboText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#27ae60',
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
    backgroundColor: 'rgba(255, 248, 225, 0.95)',
  },
  startEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  startText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ff9800',
    marginBottom: 24,
    textAlign: 'center',
  },
  startButton: {
    backgroundColor: '#ff9800',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 28,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  fallingItem: {
    position: 'absolute',
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemEmoji: {
    fontSize: ITEM_SIZE,
  },
  bowl: {
    position: 'absolute',
    width: BOWL_SIZE,
    height: BOWL_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bowlEmoji: {
    fontSize: BOWL_SIZE,
  },
  groundLine: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: 'rgba(255, 152, 0, 0.5)',
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
    color: '#ff9800',
    marginBottom: 8,
  },
  coinsText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    marginBottom: 16,
  },
  newBestText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#f1c40f',
    marginBottom: 16,
  },
  playAgainButton: {
    backgroundColor: '#ff9800',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 28,
    shadowColor: '#ff9800',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 12,
  },
  playAgainText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  backButtonOverlay: {
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  backTextOverlay: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ff9800',
  },
});
