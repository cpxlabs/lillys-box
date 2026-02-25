import React, { useState, useEffect, useCallback } from 'react';

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

interface ColorOption {
  name: string;
  hex: string;
}

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

const ColorTapGame: React.FC = () => {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [targetColor, setTargetColor] = useState<ColorOption>(COLORS[0]);
  const [options, setOptions] = useState<ColorOption[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(100);

  const pickNewRound = useCallback(() => {
    const target = COLORS[Math.floor(Math.random() * COLORS.length)];
    const others = COLORS.filter((c) => c.name !== target.name);
    const picked = shuffleArray(others).slice(0, 3);
    const allOptions = shuffleArray([target, ...picked]);
    setTargetColor(target);
    setOptions(allOptions);
    setTimeLeft(100);
  }, []);

  const startGame = () => {
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
          setLives((l) => {
            const newLives = l - 1;
            if (newLives <= 0) {
              setGameOver(true);
              if (window.RNBridge) window.RNBridge.gameOver(score);
            }
            return newLives;
          });
          pickNewRound();
          return 100;
        }
        return prev - 2;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [gameStarted, gameOver, pickNewRound, score]);

  const handleTap = (color: ColorOption) => {
    if (gameOver) return;

    if (color.name === targetColor.name) {
      const newScore = score + 10;
      setScore(newScore);
      setFeedback('Correct!');
      if (window.RNBridge) window.RNBridge.sendScore(newScore);
    } else {
      setFeedback('Wrong!');
      const newLives = lives - 1;
      setLives(newLives);
      if (newLives <= 0) {
        setGameOver(true);
        if (window.RNBridge) window.RNBridge.gameOver(score);
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
          style={{ width: `${timeLeft}%`, backgroundColor: timeLeft > 30 ? '#22c55e' : '#ef4444' }}
        />
      </div>

      <div className="text-center mb-8">
        <p className="text-sm text-gray-400 mb-1">Tap the color:</p>
        <p className="text-3xl font-bold" style={{ color: targetColor.hex }}>
          {targetColor.name}
        </p>
      </div>

      {feedback && (
        <p className={`text-xl font-bold mb-4 ${feedback === 'Correct!' ? 'text-green-400' : 'text-red-400'}`}>
          {feedback}
        </p>
      )}

      <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
        {options.map((color, i) => (
          <button
            key={`${color.name}-${i}`}
            onClick={() => handleTap(color)}
            className="w-full aspect-square rounded-full border-4 border-white/20 hover:scale-105 transition-transform active:scale-95"
            style={{ backgroundColor: color.hex }}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorTapGame;
