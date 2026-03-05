import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useCatchTheBall } from '../context/CatchTheBallContext';
import { ScreenNavigationProp } from '../types/navigation';
import { useGameBack } from '../hooks/useGameBack';
import { useGameAdTrigger } from '../components/GameAdWrapper';

type Props = {
  navigation: ScreenNavigationProp<'CatchTheBallGame'>;
};

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// --- Constants ---
const NUM_LANES = 4;
const GAME_DURATION = 30; // seconds
const BALL_SIZE = 48;
const CATCHER_SIZE = 64;
const GAME_AREA_HEIGHT = SCREEN_HEIGHT * 0.58;
const CATCHER_Y = GAME_AREA_HEIGHT - CATCHER_SIZE - 8;
const LANE_WIDTH = Math.floor((SCREEN_WIDTH - 32) / NUM_LANES);
const INITIAL_BALL_SPEED = 3.5; // px per frame
const SPEED_INCREMENT = 0.015; // speed increase per frame
const SPAWN_INTERVAL_FRAMES = 45; // spawn a ball every N frames (at 60fps ~0.75s)
const CATCH_THRESHOLD = CATCHER_SIZE * 0.9;

// --- Ball types ---
interface BallType {
  emoji: string;
  points: number;
  label: string;
}

const BALL_TYPES: BallType[] = [
  { emoji: '🎾', points: 1, label: 'ball' },
  { emoji: '⭐', points: 3, label: 'star' },
  { emoji: '🦴', points: 2, label: 'bone' },
  { emoji: '💣', points: -2, label: 'bomb' },
];

const BALL_WEIGHTS = [0.5, 0.2, 0.2, 0.1]; // cumulative weights for random selection

function randomBallType(): BallType {
  const r = Math.random();
  let cumulative = 0;
  for (let i = 0; i < BALL_TYPES.length; i++) {
    cumulative += BALL_WEIGHTS[i];
    if (r < cumulative) return BALL_TYPES[i];
  }
  return BALL_TYPES[0];
}

// --- Ball ---
interface Ball {
  id: number;
  lane: number;
  y: number;
  type: BallType;
}

// --- Game State ---
interface GameState {
  balls: Ball[];
  catcherLane: number;
  score: number;
  timeRemaining: number;
  caught: number;
  missed: number;
  gameStatus: 'ready' | 'playing' | 'gameOver';
}

let ballIdCounter = 0;

function createInitialState(): GameState {
  return {
    balls: [],
    catcherLane: Math.floor(NUM_LANES / 2),
    score: 0,
    timeRemaining: GAME_DURATION,
    caught: 0,
    missed: 0,
    gameStatus: 'ready',
  };
}

export const CatchTheBallGameScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { bestScore, updateBestScore } = useCatchTheBall();
  const { triggerAd } = useGameAdTrigger('catch-the-ball');

  const [renderState, setRenderState] = useState<GameState>(createInitialState);
  const [adRewardPending, setAdRewardPending] = useState(false);
  const stateRef = useRef<GameState>(createInitialState());
  const animFrameRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const frameCountRef = useRef(0);
  const isNewBestRef = useRef(false);
  const ballSpeedRef = useRef(INITIAL_BALL_SPEED);

  const getLaneX = (lane: number) => 16 + lane * LANE_WIDTH + (LANE_WIDTH - BALL_SIZE) / 2;

  const stopGame = useCallback(() => {
    if (animFrameRef.current != null) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const gameLoop = useCallback(() => {
    const s = stateRef.current;
    if (s.gameStatus !== 'playing') return;

    frameCountRef.current += 1;
    ballSpeedRef.current += SPEED_INCREMENT;

    const currentSpeed = ballSpeedRef.current;
    const newBalls: Ball[] = [];

    // Spawn new ball
    if (frameCountRef.current % SPAWN_INTERVAL_FRAMES === 0) {
      const lane = Math.floor(Math.random() * NUM_LANES);
      const type = randomBallType();
      newBalls.push({ id: ballIdCounter++, lane, y: -BALL_SIZE, type });
    }

    // Update existing balls
    let scoreDelta = 0;
    let caughtDelta = 0;
    let missedDelta = 0;

    const survivingBalls: Ball[] = [];
    for (const ball of s.balls) {
      const newY = ball.y + currentSpeed;

      if (newY >= CATCHER_Y) {
        // Ball reached catcher zone - check catch
        const ballX = getLaneX(ball.lane) + BALL_SIZE / 2;
        const catcherX = getLaneX(s.catcherLane) + CATCHER_SIZE / 2;

        if (Math.abs(ballX - catcherX) < CATCH_THRESHOLD) {
          // Caught!
          scoreDelta += ball.type.points;
          if (ball.type.points > 0) caughtDelta += 1;
          // Don't add to survivingBalls (remove ball)
        } else if (newY > GAME_AREA_HEIGHT) {
          // Missed - only count non-bomb as missed
          if (ball.type.points > 0) missedDelta += 1;
          // Don't add to survivingBalls
        } else {
          survivingBalls.push({ ...ball, y: newY });
        }
      } else {
        survivingBalls.push({ ...ball, y: newY });
      }
    }

    s.balls = [...survivingBalls, ...newBalls];
    s.score = Math.max(0, s.score + scoreDelta);
    s.caught += caughtDelta;
    s.missed += missedDelta;

    setRenderState({ ...s });

    animFrameRef.current = requestAnimationFrame(gameLoop);
  }, []);

  const handleStart = useCallback(() => {
    stopGame();

    const newState = createInitialState();
    newState.gameStatus = 'playing';
    ballIdCounter = 0;
    frameCountRef.current = 0;
    ballSpeedRef.current = INITIAL_BALL_SPEED;
    isNewBestRef.current = false;

    stateRef.current = newState;
    setRenderState({ ...newState });

    // Countdown timer
    timerRef.current = setInterval(() => {
      const s = stateRef.current;
      if (s.gameStatus !== 'playing') return;

      s.timeRemaining -= 1;

      if (s.timeRemaining <= 0) {
        s.gameStatus = 'gameOver';
        s.balls = [];
        const finalScore = s.score;
        const isNewBest = finalScore > bestScore;
        isNewBestRef.current = isNewBest;
        if (isNewBest) updateBestScore(finalScore);

        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        if (animFrameRef.current != null) {
          cancelAnimationFrame(animFrameRef.current);
          animFrameRef.current = null;
        }
        setRenderState({ ...s });
        return;
      }

      setRenderState({ ...s });
    }, 1000);

    // Start animation loop
    animFrameRef.current = requestAnimationFrame(gameLoop);
  }, [bestScore, updateBestScore, stopGame, gameLoop]);

  const handleMoveCatcher = useCallback((lane: number) => {
    const s = stateRef.current;
    if (s.gameStatus !== 'playing') return;
    s.catcherLane = lane;
    setRenderState({ ...s });
  }, []);

  const handleBack = useGameBack(navigation, { cleanup: stopGame });

  useEffect(() => {
    return () => {
      stopGame();
    };
  }, [stopGame]);

  const { gameStatus, balls, catcherLane, score, timeRemaining, caught, missed } = renderState;
  const coinsEarned = Math.floor(score / 5);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBack}
          accessibilityRole="button"
          accessibilityLabel={t('common.back')}
        >
          <Text style={styles.backText}>← {t('common.back')}</Text>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.timeText}>
            ⏱ {timeRemaining}s
          </Text>
        </View>

        <Text style={styles.scoreText}>
          {t('catchTheBall.game.score')}: {score}
        </Text>
      </View>

      {/* Game Area */}
      <View style={styles.gameArea}>
        {/* Start overlay */}
        {gameStatus === 'ready' && (
          <View style={styles.overlay}>
            <Text style={styles.overlayTitle}>{t('catchTheBall.game.ready')}</Text>
            <TouchableOpacity style={styles.startButton} onPress={handleStart}>
              <Text style={styles.startButtonText}>{t('catchTheBall.game.tapToStart')}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Lane dividers */}
        {Array.from({ length: NUM_LANES - 1 }, (_, i) => (
          <View
            key={`divider-${i}`}
            style={[styles.laneDivider, { left: 16 + (i + 1) * LANE_WIDTH }]}
          />
        ))}

        {/* Falling balls */}
        {balls.map((ball) => (
          <Text
            key={ball.id}
            style={[
              styles.ball,
              {
                left: getLaneX(ball.lane),
                top: ball.y,
              },
            ]}
          >
            {ball.type.emoji}
          </Text>
        ))}

        {/* Catcher */}
        {gameStatus !== 'ready' && (
          <Text
            style={[
              styles.catcher,
              {
                left: getLaneX(catcherLane) - (CATCHER_SIZE - BALL_SIZE) / 2,
                top: CATCHER_Y,
              },
            ]}
          >
            🧺
          </Text>
        )}
      </View>

      {/* Lane tap buttons */}
      {gameStatus === 'playing' && (
        <View style={styles.laneButtons}>
          {Array.from({ length: NUM_LANES }, (_, i) => (
            <TouchableOpacity
              key={`lane-${i}`}
              style={[
                styles.laneButton,
                catcherLane === i && styles.laneButtonActive,
              ]}
              onPress={() => handleMoveCatcher(i)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={`${t('catchTheBall.game.lane')} ${i + 1}`}
            >
              <Text style={[styles.laneButtonText, catcherLane === i && styles.laneButtonActiveText]}>
                {i + 1}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Legend */}
      {gameStatus === 'playing' && (
        <View style={styles.legend}>
          <Text style={styles.legendText}>🎾+1  🦴+2  ⭐+3  💣-2</Text>
        </View>
      )}

      {/* Game Over Overlay */}
      {gameStatus === 'gameOver' && (
        <View style={styles.gameOverBackdrop}>
          <View style={styles.gameOverCard}>
            <Text style={styles.gameOverTitle}>{t('catchTheBall.game.gameOver')}</Text>
            <Text style={styles.finalScoreText}>
              {t('catchTheBall.game.finalScore')}: {score}
            </Text>
            <Text style={styles.statsText}>
              {t('catchTheBall.game.caught')}: {caught}
            </Text>
            <Text style={styles.statsText}>
              {t('catchTheBall.game.missed')}: {missed}
            </Text>
            <Text style={styles.statsText}>
              {t('catchTheBall.game.coinsEarned')}: {coinsEarned} 🪙
            </Text>
            {isNewBestRef.current && (
              <Text style={styles.newBestText}>{t('catchTheBall.game.newBest')}</Text>
            )}
            {!adRewardPending && (
              <>
                <TouchableOpacity
                  style={styles.playAgainButton}
                  onPress={async () => {
                    setAdRewardPending(true);
                    const reward = await triggerAd('game_ended', coinsEarned);
                    if (reward > 0) {
                      // Ad completed successfully
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
                  onPress={handleStart}
                  accessibilityRole="button"
                  accessibilityLabel={t('catchTheBall.game.playAgain')}
                >
                  <Text style={styles.playAgainText}>{t('catchTheBall.game.playAgain')}</Text>
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
    backgroundColor: '#e1f5fe',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0288d1',
  },
  headerCenter: {
    alignItems: 'center',
  },
  timeText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  scoreText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0288d1',
  },
  gameArea: {
    height: GAME_AREA_HEIGHT,
    marginHorizontal: 16,
    backgroundColor: '#b3e5fc',
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  laneDivider: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  ball: {
    position: 'absolute',
    fontSize: BALL_SIZE - 8,
    width: BALL_SIZE,
    height: BALL_SIZE,
    textAlign: 'center',
  },
  catcher: {
    position: 'absolute',
    fontSize: CATCHER_SIZE - 8,
    width: CATCHER_SIZE,
    height: CATCHER_SIZE,
    textAlign: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(225, 245, 254, 0.95)',
    zIndex: 10,
  },
  overlayTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0288d1',
    marginBottom: 24,
    textAlign: 'center',
  },
  startButton: {
    backgroundColor: '#0288d1',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 28,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  laneButtons: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 12,
    gap: 8,
  },
  laneButton: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#b3e5fc',
  },
  laneButtonActive: {
    backgroundColor: '#0288d1',
    borderColor: '#0288d1',
  },
  laneButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0288d1',
  },
  laneButtonActiveText: {
    color: '#fff',
  },
  legend: {
    alignItems: 'center',
    marginTop: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },
  gameOverBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  gameOverCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 32,
    maxWidth: 340,
    width: '85%',
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
    color: '#0288d1',
    marginBottom: 16,
  },
  finalScoreText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0288d1',
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
    marginBottom: 8,
  },
  playAgainButton: {
    backgroundColor: '#0288d1',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 28,
    marginTop: 16,
    shadowColor: '#0288d1',
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
    color: '#0288d1',
  },
});
