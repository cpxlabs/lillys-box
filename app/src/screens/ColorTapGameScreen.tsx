import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { ArtifactGameAdapter, ArtifactMessage } from '../components/ArtifactGameAdapter';
import { useColorTap } from '../context/ColorTapContext';
import { useGameBack } from '../hooks/useGameBack';

type Props = NativeStackScreenProps<RootStackParamList, 'ColorTapGame'>;

/**
 * HTML content generated from the Claude AI Artifact.
 * Original component name: ColorTapGame
 *
 * The artifact communicates with React Native via window.RNBridge:
 *   window.RNBridge.sendScore(score)   - report score updates
 *   window.RNBridge.gameOver(score)    - signal game over
 *   window.RNBridge.navigate('back')   - request navigation back
 */
const ARTIFACT_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>ColorTap</title>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"><\/script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"><\/script>
  <script crossorigin src="https://unpkg.com/@babel/standalone/babel.min.js"><\/script>
  <script src="https://cdn.tailwindcss.com"><\/script>
  <script>
    window.RNBridge = {
      send: function(message) {
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify(message));
        } else if (window.parent !== window) {
          window.parent.postMessage(JSON.stringify(message), '*');
        }
      },
      sendScore: function(score) { this.send({ type: 'scoreUpdate', payload: { score: score } }); },
      gameOver: function(finalScore) { this.send({ type: 'gameOver', payload: { finalScore: finalScore } }); },
      navigate: function(target) { this.send({ type: 'navigate', payload: { target: target || 'back' } }); }
    };
  <\/script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body, #root { width: 100%; height: 100%; overflow: hidden; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel" data-presets="react,typescript">
    const { useState, useEffect, useCallback, useRef } = React;

    interface ColorOption { name: string; hex: string; }

    /**
 * Color Tap - Example Claude AI Artifact
 *
 * A simple color-matching tap game. Tap the circle that matches the
 * color name displayed at the top. Score points for correct taps,
 * and the game speeds up as you progress.
 *
 * This artifact demonstrates the RNBridge integration:
 *   window.RNBridge.sendScore(score)
 *   window.RNBridge.gameOver(finalScore)
 */


const COLORS: ColorOption[] = [
  { name: 'Red', hex: '#ef4444' },
  { name: 'Blue', hex: '#3b82f6' },
  { name: 'Green', hex: '#22c55e' },
  { name: 'Yellow', hex: '#eab308' },
  { name: 'Purple', hex: '#a855f7' },
  { name: 'Orange', hex: '#f97316' },
];

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const ColorTapGame = () => {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [targetColor, setTargetColor] = useState<ColorOption>(COLORS[0]);
  const [options, setOptions] = useState<ColorOption[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(100);

  const scoreRef = useRef(0);
  const livesRef = useRef(3);
  const gameOverRef = useRef(false);

  const pickNewRound = useCallback(() => {
    const target = COLORS[Math.floor(Math.random() * COLORS.length)];
    const others = COLORS.filter((c) => c.name !== target.name);
    const picked = shuffleArray(others).slice(0, 3);
    const allOptions = shuffleArray([target, ...picked]);
    setTargetColor(target);
    setOptions(allOptions);
    setTimeLeft(100);
  }, []);

  const endGame = useCallback(() => {
    if (gameOverRef.current) return;
    gameOverRef.current = true;
    setGameOver(true);
    if (window.RNBridge) window.RNBridge.gameOver(scoreRef.current);
  }, []);

  const startGame = () => {
    scoreRef.current = 0;
    livesRef.current = 3;
    gameOverRef.current = false;
    setScore(0);
    setLives(3);
    setGameOver(false);
    setGameStarted(true);
    setFeedback(null);
    pickNewRound();
  };

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          const newLives = livesRef.current - 1;
          livesRef.current = newLives;
          setLives(newLives);
          if (newLives <= 0) {
            endGame();
          } else {
            pickNewRound();
          }
          return 100;
        }
        // Speed increases every 50 points (max 5x faster)
        const decrement = Math.min(10, 2 + Math.floor(scoreRef.current / 50));
        return Math.max(0, prev - decrement);
      });
    }, 100);

    return () => clearInterval(timer);
  }, [gameStarted, gameOver, pickNewRound, endGame]);

  const handleTap = (color: ColorOption) => {
    if (gameOverRef.current) return;

    if (color.name === targetColor.name) {
      const newScore = scoreRef.current + 10;
      scoreRef.current = newScore;
      setScore(newScore);
      setFeedback('Correct!');
      if (window.RNBridge) window.RNBridge.sendScore(newScore);
    } else {
      const newLives = livesRef.current - 1;
      livesRef.current = newLives;
      setLives(newLives);
      setFeedback('Wrong!');
      if (newLives <= 0) {
        endGame();
        return;
      }
    }

    setTimeout(() => setFeedback(null), 400);
    pickNewRound();
  };

  if (!gameStarted || gameOver) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-indigo-900 to-purple-900 text-white">
        <h1 className="text-4xl font-bold mb-4">Color Tap</h1>
        {gameOver && (
          <div className="text-center mb-6">
            <p className="text-xl mb-2">Game Over!</p>
            <p className="text-3xl font-bold text-yellow-300">Score: {score}</p>
          </div>
        )}
        {!gameOver && (
          <p className="text-lg text-gray-300 mb-6 text-center px-8">
            Tap the circle that matches the color name!
          </p>
        )}
        <button
          onClick={startGame}
          className="px-8 py-4 bg-white text-purple-900 rounded-2xl text-xl font-bold hover:bg-gray-100 transition-colors"
        >
          {gameOver ? 'Play Again' : 'Start Game'}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-indigo-900 to-purple-900 text-white p-4">
      <div className="flex justify-between w-full max-w-md mb-4">
        <span className="text-lg">Score: {score}</span>
        <span className="text-lg">{'❤️'.repeat(lives)}</span>
      </div>

      <div className="w-full max-w-md bg-gray-800 rounded-full h-2 mb-6">
        <div
          className="h-2 rounded-full transition-all duration-100"
          style={{ width: \`\${timeLeft}%\`, backgroundColor: timeLeft > 30 ? '#22c55e' : '#ef4444' }}
        />
      </div>

      <div className="text-center mb-8">
        <p className="text-sm text-gray-400 mb-1">Tap the color:</p>
        <p className="text-3xl font-bold" style={{ color: targetColor.hex }}>
          {targetColor.name}
        </p>
      </div>

      {feedback && (
        <p className={\`text-xl font-bold mb-4 \${feedback === 'Correct!' ? 'text-green-400' : 'text-red-400'}\`}>
          {feedback}
        </p>
      )}

      <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
        {options.map((color, i) => (
          <button
            key={\`\${color.name}-\${i}\`}
            onClick={() => handleTap(color)}
            className="w-full aspect-square rounded-full border-4 border-white/20 hover:scale-105 transition-transform active:scale-95"
            style={{ backgroundColor: color.hex }}
          />
        ))}
      </div>
    </div>
  );
};


    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(React.createElement(ColorTapGame));
  <\/script>
</body>
</html>`;

export const ColorTapGameScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { updateBestScore } = useColorTap();
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const handleScoreUpdate = useCallback(
    (newScore: number) => {
      setScore(newScore);
    },
    [],
  );

  const handleGameOver = useCallback(
    (finalScore: number) => {
      setScore(finalScore);
      setGameOver(true);
      updateBestScore(finalScore);
    },
    [updateBestScore],
  );

  const handleBack = useGameBack(navigation);

  const handleNavigate = useCallback(
    (target: string) => {
      if (target === 'back') {
        handleBack();
      }
    },
    [handleBack],
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} accessibilityRole="button">
          <Text style={styles.backText}>{t('common.back')}</Text>
        </TouchableOpacity>
        {score > 0 && <Text style={styles.scoreText}>{score}</Text>}
      </View>

      <View style={styles.gameArea}>
        <ArtifactGameAdapter
          htmlContent={ARTIFACT_HTML}
          onScoreUpdate={handleScoreUpdate}
          onGameOver={handleGameOver}
          onNavigate={handleNavigate}
        />
      </View>

      {gameOver && (
        <View style={styles.overlay}>
          <View style={styles.overlayCard}>
            <Text style={styles.overlayTitle}>{t('colorTap.gameOver.title')}</Text>
            <Text style={styles.overlayScore}>{score}</Text>
            <TouchableOpacity
              style={styles.playAgainButton}
              onPress={() => {
                setGameOver(false);
                setScore(0);
                // Force re-mount the WebView by navigating away and back
                navigation.replace('ColorTapGame');
              }}
              accessibilityRole="button"
            >
              <Text style={styles.playAgainText}>{t('colorTap.gameOver.playAgain')}</Text>
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
    backgroundColor: '#f5f0ff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  backText: {
    fontSize: 16,
    color: '#9b59b6',
    fontWeight: '600',
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  gameArea: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    minWidth: 260,
  },
  overlayTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  overlayScore: {
    fontSize: 40,
    fontWeight: '800',
    color: '#9b59b6',
    marginBottom: 24,
  },
  playAgainButton: {
    backgroundColor: '#9b59b6',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  playAgainText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
