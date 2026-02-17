import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSlidingPuzzle } from '../context/SlidingPuzzleContext';
import { ScreenNavigationProp } from '../types/navigation';

type Props = {
  navigation: ScreenNavigationProp<'SlidingPuzzleGame'>;
  route: { params: { difficulty: 'easy' | 'hard' } };
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// --- Constants ---
const EASY_SIZE = 3;
const HARD_SIZE = 4;
const GRID_PADDING = 40;

const EASY_EMOJIS = ['🐱', '🐶', '🐹', '🐰', '🦊', '🐼', '🐨', '🐯'];
const HARD_EMOJIS = [
  '🐱', '🐶', '🐹', '🐰',
  '🦊', '🐼', '🐨', '🐯',
  '🦁', '🐮', '🐷', '🐸',
  '🐙', '🦋', '🐢',
];

// --- Helpers ---
function getGridSize(difficulty: 'easy' | 'hard'): number {
  return difficulty === 'easy' ? EASY_SIZE : HARD_SIZE;
}

function getTileEmoji(tileValue: number, difficulty: 'easy' | 'hard'): string {
  if (tileValue === 0) return '';
  const emojis = difficulty === 'easy' ? EASY_EMOJIS : HARD_EMOJIS;
  return emojis[tileValue - 1] ?? `${tileValue}`;
}

function createSolvedBoard(size: number): number[] {
  const total = size * size;
  return Array.from({ length: total }, (_, i) => (i < total - 1 ? i + 1 : 0));
}

function isAdjacent(emptyIdx: number, tileIdx: number, size: number): boolean {
  const emptyRow = Math.floor(emptyIdx / size);
  const emptyCol = emptyIdx % size;
  const tileRow = Math.floor(tileIdx / size);
  const tileCol = tileIdx % size;
  return (
    (emptyRow === tileRow && Math.abs(emptyCol - tileCol) === 1) ||
    (emptyCol === tileCol && Math.abs(emptyRow - tileRow) === 1)
  );
}

function shuffleBoard(board: number[], size: number, shuffleMoves: number): number[] {
  const b = [...board];
  let emptyIdx = b.indexOf(0);
  let prevEmpty = -1;

  for (let i = 0; i < shuffleMoves; i++) {
    const neighbors: number[] = [];
    const row = Math.floor(emptyIdx / size);
    const col = emptyIdx % size;

    if (row > 0) neighbors.push(emptyIdx - size);
    if (row < size - 1) neighbors.push(emptyIdx + size);
    if (col > 0) neighbors.push(emptyIdx - 1);
    if (col < size - 1) neighbors.push(emptyIdx + 1);

    // Avoid going back to previous position for more effective shuffling
    const candidates = neighbors.filter((n) => n !== prevEmpty);
    const chosen = candidates.length > 0 ? candidates[Math.floor(Math.random() * candidates.length)] : neighbors[0];

    prevEmpty = emptyIdx;
    b[emptyIdx] = b[chosen];
    b[chosen] = 0;
    emptyIdx = chosen;
  }

  return b;
}

function isSolved(board: number[], size: number): boolean {
  const total = size * size;
  for (let i = 0; i < total - 1; i++) {
    if (board[i] !== i + 1) return false;
  }
  return board[total - 1] === 0;
}

// --- Component ---
interface PuzzleGameState {
  board: number[];
  moves: number;
  gameStatus: 'playing' | 'won';
  startTime: number;
}

export const SlidingPuzzleGameScreen: React.FC<Props> = ({ navigation, route }) => {
  const { difficulty } = route.params;
  const { t } = useTranslation();
  const { bestMoves, updateBestMoves } = useSlidingPuzzle();

  const gridSize = getGridSize(difficulty);
  const cellSize = Math.floor((SCREEN_WIDTH - GRID_PADDING * 2) / gridSize);
  const shuffleMoves = difficulty === 'easy' ? 80 : 150;

  const createFreshPuzzle = useCallback((): PuzzleGameState => {
    const solved = createSolvedBoard(gridSize);
    const shuffled = shuffleBoard(solved, gridSize, shuffleMoves);
    return {
      board: shuffled,
      moves: 0,
      gameStatus: 'playing',
      startTime: Date.now(),
    };
  }, [gridSize, shuffleMoves]);

  const [gameState, setGameState] = useState<PuzzleGameState>(createFreshPuzzle);
  const [isNewBest, setIsNewBest] = useState(false);

  const handleTile = useCallback(
    (tileIdx: number) => {
      if (gameState.gameStatus !== 'playing') return;

      const emptyIdx = gameState.board.indexOf(0);
      if (!isAdjacent(emptyIdx, tileIdx, gridSize)) return;

      const newBoard = [...gameState.board];
      newBoard[emptyIdx] = newBoard[tileIdx];
      newBoard[tileIdx] = 0;

      const newMoves = gameState.moves + 1;
      const won = isSolved(newBoard, gridSize);

      if (won) {
        const prev = bestMoves[difficulty];
        const isNew = prev === null || newMoves < prev;
        setIsNewBest(isNew);
        if (isNew) updateBestMoves(difficulty, newMoves);
      }

      setGameState((prev) => ({
        ...prev,
        board: newBoard,
        moves: newMoves,
        gameStatus: won ? 'won' : 'playing',
      }));
    },
    [gameState, gridSize, bestMoves, difficulty, updateBestMoves],
  );

  const handleRestart = useCallback(() => {
    setIsNewBest(false);
    setGameState(createFreshPuzzle());
  }, [createFreshPuzzle]);

  const handleBack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.getParent()?.goBack();
    }
  }, [navigation]);

  const { board, moves, gameStatus } = gameState;
  const coinsEarned = gameStatus === 'won' ? Math.max(5, 20 - Math.floor(moves / 5)) : 0;
  const difficultyLabel = difficulty === 'easy' ? t('slidingPuzzle.game.easy') : t('slidingPuzzle.game.hard');

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBack}
          accessibilityRole="button"
          accessibilityLabel={t('slidingPuzzle.game.back')}
        >
          <Text style={styles.backText}>← {t('slidingPuzzle.game.back')}</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          {difficultyLabel}
        </Text>

        <Text style={styles.movesText}>
          {t('slidingPuzzle.game.moves')}: {moves}
        </Text>
      </View>

      {/* Puzzle Grid */}
      <View style={styles.gridContainer}>
        <View style={[styles.grid, { width: cellSize * gridSize, height: cellSize * gridSize }]}>
          {board.map((tileValue, index) => {
            const row = Math.floor(index / gridSize);
            const col = index % gridSize;
            const isEmpty = tileValue === 0;

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.tile,
                  {
                    width: cellSize - 4,
                    height: cellSize - 4,
                    left: col * cellSize + 2,
                    top: row * cellSize + 2,
                  },
                  isEmpty && styles.emptyTile,
                ]}
                onPress={() => handleTile(index)}
                disabled={isEmpty}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={isEmpty ? '' : `${t('slidingPuzzle.game.tile')} ${tileValue}`}
              >
                {!isEmpty && (
                  <>
                    <Text style={[styles.tileEmoji, { fontSize: cellSize * 0.42 }]}>
                      {getTileEmoji(tileValue, difficulty)}
                    </Text>
                    <Text style={[styles.tileNumber, { fontSize: cellSize * 0.2 }]}>
                      {tileValue}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* New Game Button */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.newGameButton}
          onPress={handleRestart}
          accessibilityRole="button"
          accessibilityLabel={t('slidingPuzzle.game.newGame')}
        >
          <Text style={styles.newGameText}>{t('slidingPuzzle.game.newGame')}</Text>
        </TouchableOpacity>
      </View>

      {/* Best moves hint */}
      {bestMoves[difficulty] !== null && (
        <Text style={styles.bestHint}>
          {t('slidingPuzzle.home.best')}: {bestMoves[difficulty]} {t('slidingPuzzle.home.moves')}
        </Text>
      )}

      {/* Win overlay */}
      {gameStatus === 'won' && (
        <View style={styles.winBackdrop}>
          <View style={styles.winCard}>
            <Text style={styles.winEmoji}>🎉</Text>
            <Text style={styles.winTitle}>{t('slidingPuzzle.game.youWon')}</Text>
            <Text style={styles.winMoves}>
              {moves} {t('slidingPuzzle.home.moves')}
            </Text>
            <Text style={styles.winCoins}>
              {t('slidingPuzzle.game.coinsEarned')}: {coinsEarned} 🪙
            </Text>
            {isNewBest && (
              <Text style={styles.newBestText}>{t('slidingPuzzle.game.newBest')}</Text>
            )}
            <TouchableOpacity
              style={styles.playAgainButton}
              onPress={handleRestart}
              accessibilityRole="button"
              accessibilityLabel={t('slidingPuzzle.game.playAgain')}
            >
              <Text style={styles.playAgainText}>{t('slidingPuzzle.game.playAgain')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleBack} style={styles.backButtonOverlay}>
              <Text style={styles.backTextOverlay}>{t('slidingPuzzle.game.back')}</Text>
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
    backgroundColor: '#f3e5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  backText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7b1fa2',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4a148c',
  },
  movesText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#7b1fa2',
  },
  gridContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: {
    position: 'relative',
    backgroundColor: '#ce93d8',
    borderRadius: 12,
    padding: 2,
  },
  tile: {
    position: 'absolute',
    backgroundColor: '#7b1fa2',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyTile: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  tileEmoji: {
    textAlign: 'center',
  },
  tileNumber: {
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '700',
    textAlign: 'center',
    marginTop: -2,
  },
  actions: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  newGameButton: {
    backgroundColor: '#7b1fa2',
    paddingVertical: 12,
    paddingHorizontal: 36,
    borderRadius: 24,
    shadowColor: '#7b1fa2',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  newGameText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  bestHint: {
    textAlign: 'center',
    color: '#888',
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 16,
  },
  winBackdrop: {
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
  winCard: {
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
  winEmoji: {
    fontSize: 52,
    marginBottom: 8,
  },
  winTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#7b1fa2',
    marginBottom: 12,
  },
  winMoves: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4a148c',
    marginBottom: 8,
  },
  winCoins: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    marginBottom: 6,
  },
  newBestText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#f1c40f',
    marginTop: 6,
    marginBottom: 6,
  },
  playAgainButton: {
    backgroundColor: '#7b1fa2',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 28,
    marginTop: 16,
    shadowColor: '#7b1fa2',
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
    color: '#7b1fa2',
  },
});
