import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { ArtifactGameAdapter } from '../components/ArtifactGameAdapter';
import { useTicTacToe } from '../context/TicTacToeContext';
import { useGameBack } from '../hooks/useGameBack';
import { useGameAdTrigger } from '../components/GameAdWrapper';

type Props = NativeStackScreenProps<RootStackParamList, 'TicTacToeGame'>;

function getArtifactHTML(difficulty: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>Tic-Tac-Toe Pets</title>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script>
    window.DIFFICULTY = '${difficulty}';
    window.RNBridge = {
      send: function(msg) {
        if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage(JSON.stringify(msg));
        else if (window.parent !== window) window.parent.postMessage(JSON.stringify(msg), '*');
      },
      sendScore: function(score) { this.send({ type: 'scoreUpdate', payload: { score: score } }); },
      gameOver: function(finalScore) { this.send({ type: 'gameOver', payload: { finalScore: finalScore } }); },
      navigate: function(target) { this.send({ type: 'navigate', payload: { target: target || 'back' } }); }
    };
  </script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; touch-action: manipulation; }
    html, body, #root { width: 100%; height: 100%; overflow: hidden; background: #fff5f0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel" data-presets="react,typescript">
    const { useState, useEffect, useCallback, useRef } = React;

    const DIFFICULTY = window.DIFFICULTY || 'puppy';
    const SCORE_MAP: Record<string, number> = { puppy: 50, kitten: 100, owl: 200 };
    const AI_EMOJIS: Record<string, string> = { puppy: '🐶', kitten: '🐱', owl: '🦉' };
    const AI_NAMES: Record<string, string> = { puppy: 'Puppy', kitten: 'Kitten', owl: 'Owl' };

    type Cell = 'X' | 'O' | null;
    type Board = Cell[];

    function checkWinner(board: Board): Cell | 'draw' | null {
      const lines = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
      ];
      for (const [a,b,c] of lines) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
      }
      if (board.every(c => c !== null)) return 'draw';
      return null;
    }

    function getWinLine(board: Board): number[] | null {
      const lines = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
      ];
      for (const line of lines) {
        const [a,b,c] = line;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) return line;
      }
      return null;
    }

    function minimax(board: Board, isMax: boolean, depth: number, maxDepth: number): number {
      const winner = checkWinner(board);
      if (winner === 'O') return 10 - depth;
      if (winner === 'X') return depth - 10;
      if (winner === 'draw') return 0;
      if (depth >= maxDepth) return 0;
      const moves = board.map((c, i) => c === null ? i : -1).filter(i => i >= 0);
      if (isMax) {
        let best = -Infinity;
        for (const i of moves) {
          board[i] = 'O';
          best = Math.max(best, minimax(board, false, depth + 1, maxDepth));
          board[i] = null;
        }
        return best;
      } else {
        let best = Infinity;
        for (const i of moves) {
          board[i] = 'X';
          best = Math.min(best, minimax(board, true, depth + 1, maxDepth));
          board[i] = null;
        }
        return best;
      }
    }

    function getBestMove(board: Board, diff: string): number {
      const empty = board.map((c, i) => c === null ? i : -1).filter(i => i >= 0);
      if (diff === 'puppy') return empty[Math.floor(Math.random() * empty.length)];
      const maxDepth = diff === 'kitten' ? 1 : 9;
      let bestScore = -Infinity;
      let bestMove = empty[0];
      for (const i of empty) {
        board[i] = 'O';
        const score = minimax(board, false, 0, maxDepth);
        board[i] = null;
        if (score > bestScore) { bestScore = score; bestMove = i; }
      }
      return bestMove;
    }

    function App() {
      const [board, setBoard] = useState<Board>(Array(9).fill(null));
      const [isPlayerTurn, setIsPlayerTurn] = useState(true);
      const [result, setResult] = useState<'player' | 'ai' | 'draw' | null>(null);
      const [winLine, setWinLine] = useState<number[] | null>(null);
      const [celebration, setCelebration] = useState(false);
      const [particles, setParticles] = useState<{id:number;x:number;y:number;emoji:string}[]>([]);
      const aiThinking = useRef(false);

      const handleResult = useCallback((newBoard: Board, winner: Cell | 'draw') => {
        const line = getWinLine(newBoard);
        setWinLine(line);
        if (winner === 'X') {
          setResult('player');
          setCelebration(true);
          const score = SCORE_MAP[DIFFICULTY] || 50;
          window.RNBridge.sendScore(score);
          window.RNBridge.gameOver(score);
          const parts = Array.from({length: 12}, (_, i) => ({
            id: i,
            x: 10 + Math.random() * 80,
            y: 10 + Math.random() * 80,
            emoji: ['🎉','⭐','🎊','✨','🐾'][Math.floor(Math.random()*5)]
          }));
          setParticles(parts);
        } else if (winner === 'O') {
          setResult('ai');
          window.RNBridge.gameOver(0);
        } else {
          setResult('draw');
          window.RNBridge.gameOver(0);
        }
      }, []);

      useEffect(() => {
        if (!isPlayerTurn && !result) {
          if (aiThinking.current) return;
          aiThinking.current = true;
          const timer = setTimeout(() => {
            setBoard(prev => {
              const newBoard = [...prev];
              const empty = newBoard.map((c, i) => c === null ? i : -1).filter(i => i >= 0);
              if (empty.length === 0) { aiThinking.current = false; return prev; }
              const move = getBestMove(newBoard, DIFFICULTY);
              newBoard[move] = 'O';
              const winner = checkWinner(newBoard);
              if (winner) handleResult(newBoard, winner);
              else setIsPlayerTurn(true);
              aiThinking.current = false;
              return newBoard;
            });
          }, 500);
          return () => clearTimeout(timer);
        }
      }, [isPlayerTurn, result, handleResult]);

      const handleCellPress = useCallback((idx: number) => {
        if (!isPlayerTurn || board[idx] || result) return;
        const newBoard = [...board];
        newBoard[idx] = 'X';
        setBoard(newBoard);
        const winner = checkWinner(newBoard);
        if (winner) { handleResult(newBoard, winner); }
        else { setIsPlayerTurn(false); }
      }, [board, isPlayerTurn, result, handleResult]);

      const resetGame = () => {
        setBoard(Array(9).fill(null));
        setIsPlayerTurn(true);
        setResult(null);
        setWinLine(null);
        setCelebration(false);
        setParticles([]);
      };

      const aiEmoji = AI_EMOJIS[DIFFICULTY];
      const aiName = AI_NAMES[DIFFICULTY];

      const statusText = result
        ? result === 'player' ? '🎉 You win!' : result === 'ai' ? \`\${aiEmoji} \${aiName} wins!\` : "🤝 It's a draw!"
        : isPlayerTurn ? '🐾 Your turn' : \`\${aiEmoji} \${aiName} is thinking...\`;

      return (
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'100%',padding:'16px',background:'#fff5f0',position:'relative',overflow:'hidden'}}>
          {particles.map(p => (
            <div key={p.id} style={{position:'absolute',left:\`\${p.x}%\`,top:\`\${p.y}%\`,fontSize:'24px',pointerEvents:'none',animation:'float 1.5s ease-out forwards'}}>
              {p.emoji}
            </div>
          ))}
          <style>{\`
            @keyframes float { 0%{opacity:1;transform:scale(1) translateY(0)} 100%{opacity:0;transform:scale(1.5) translateY(-40px)} }
            @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.05)} }
            @keyframes spin { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
          \`}</style>

          <div style={{fontSize:'14px',fontWeight:'700',color:'#888',marginBottom:'8px',letterSpacing:'2px',textTransform:'uppercase'}}>TIC-TAC-TOE PETS</div>

          <div style={{display:'flex',alignItems:'center',gap:'24px',marginBottom:'16px'}}>
            <div style={{textAlign:'center'}}>
              <div style={{fontSize:'28px'}}>🐾</div>
              <div style={{fontSize:'12px',fontWeight:'700',color:'#e05e2a'}}>You</div>
            </div>
            <div style={{fontSize:'20px',fontWeight:'800',color:'#ccc'}}>VS</div>
            <div style={{textAlign:'center'}}>
              <div style={{fontSize:'28px'}}>{aiEmoji}</div>
              <div style={{fontSize:'12px',fontWeight:'700',color:'#888'}}>{aiName}</div>
            </div>
          </div>

          <div style={{fontSize:'16px',fontWeight:'600',color:result ? (result==='player'?'#e05e2a':result==='ai'?'#888':'#555') : '#555',marginBottom:'16px',minHeight:'24px',animation:celebration?'pulse 0.5s infinite':'none'}}>
            {statusText}
          </div>

          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'8px',maxWidth:'280px',width:'100%',marginBottom:'24px'}}>
            {board.map((cell, idx) => {
              const isWin = winLine?.includes(idx);
              return (
                <button
                  key={idx}
                  onClick={() => handleCellPress(idx)}
                  style={{
                    width:'100%',aspectRatio:'1',borderRadius:'16px',border:'none',cursor:cell||result?'default':'pointer',
                    background: isWin ? (result==='player'?'#e05e2a':'#888') : cell ? '#fff' : '#fff',
                    boxShadow: isWin ? '0 4px 16px rgba(0,0,0,0.2)' : '0 2px 8px rgba(0,0,0,0.1)',
                    fontSize:'36px',display:'flex',alignItems:'center',justifyContent:'center',
                    transition:'all 0.15s',transform:isWin?'scale(1.05)':'scale(1)',
                    WebkitTapHighlightColor:'transparent'
                  }}
                >
                  {cell === 'X' ? '🐾' : cell === 'O' ? '🐟' : ''}
                </button>
              );
            })}
          </div>

          {result && (
            <button
              onClick={resetGame}
              style={{background:'#e05e2a',color:'#fff',border:'none',borderRadius:'16px',padding:'14px 40px',fontSize:'16px',fontWeight:'bold',cursor:'pointer',boxShadow:'0 4px 16px rgba(224,94,42,0.4)'}}
            >
              Play Again
            </button>
          )}

          <div style={{marginTop:'16px',fontSize:'12px',color:'#bbb'}}>You: 🐾  AI: 🐟</div>
        </div>
      );
    }

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<App />);
  </script>
</body>
</html>`;
}

export const TicTacToeGameScreen: React.FC<Props> = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { updateBestScore } = useTicTacToe();
  const { triggerAd } = useGameAdTrigger('tic-tac-toe');
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [adRewardPending, setAdRewardPending] = useState(false);
  const difficulty = route.params?.difficulty ?? 'puppy';
  const artifactHtml = React.useMemo(() => getArtifactHTML(difficulty), [difficulty]);

  const handleScoreUpdate = useCallback((newScore: number) => { setScore(newScore); }, []);
  const handleGameOver = useCallback((finalScore: number) => {
    setScore(finalScore);
    setGameOver(true);
    updateBestScore(finalScore);
  }, [updateBestScore]);
  const handleBack = useGameBack(navigation);
  const handleNavigate = useCallback((target: string) => { if (target === 'back') handleBack(); }, [handleBack]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} accessibilityRole="button">
          <Text style={styles.backText}>{t('common.back')}</Text>
        </TouchableOpacity>
        {score > 0 && <Text style={styles.scoreText}>⭐ {score}</Text>}
      </View>
      <View style={styles.gameArea}>
        <ArtifactGameAdapter
          htmlContent={artifactHtml}
          onScoreUpdate={handleScoreUpdate}
          onGameOver={handleGameOver}
          onNavigate={handleNavigate}
        />
      </View>
      {gameOver && (
        <View style={styles.overlay}>
          <View style={styles.overlayCard}>
            {!adRewardPending && (
              <TouchableOpacity
                style={styles.playAgainButton}
                onPress={async () => {
                  setAdRewardPending(true);
                  await triggerAd('game_ended', score);
                  setAdRewardPending(false);
                }}
                accessibilityRole="button"
              >
                <Text style={styles.playAgainText}>🎬 {t('ticTacToe.gameOver.watchAd')}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.playAgainButton}
              onPress={() => {
                setGameOver(false);
                setScore(0);
                setAdRewardPending(false);
                navigation.replace('TicTacToeGame', { difficulty });
              }}
              disabled={adRewardPending}
              accessibilityRole="button"
            >
              <Text style={styles.playAgainText}>{t('ticTacToe.gameOver.playAgain')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff5f0' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8 },
  backText: { fontSize: 16, color: '#e05e2a', fontWeight: '600' },
  scoreText: { fontSize: 18, fontWeight: 'bold', color: '#e05e2a' },
  gameArea: { flex: 1 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  overlayCard: { backgroundColor: '#fff', borderRadius: 24, padding: 32, alignItems: 'center', minWidth: 260, gap: 12 },
  playAgainButton: { backgroundColor: '#e05e2a', borderRadius: 16, paddingVertical: 12, paddingHorizontal: 32, width: '100%', alignItems: 'center' },
  playAgainText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
