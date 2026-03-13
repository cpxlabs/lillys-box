import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { ArtifactGameAdapter } from '../components/ArtifactGameAdapter';
import { useCountingKennel } from '../context/CountingKennelContext';
import { useGameBack } from '../hooks/useGameBack';
import { useGameAdTrigger } from '../components/GameAdWrapper';

type Props = NativeStackScreenProps<RootStackParamList, 'CountingKennelGame'>;

function getArtifactHTML(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>Counting Kennel</title>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script>
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
    html, body, #root { width: 100%; height: 100%; overflow: hidden; background: #FFF8DC; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    @keyframes peekIn { 0% { transform: translateY(100%) scale(0.5); opacity: 0; } 60% { transform: translateY(-10%) scale(1.1); opacity: 1; } 100% { transform: translateY(0%) scale(1); opacity: 1; } }
    @keyframes peekOut { 0% { transform: translateY(0%) scale(1); opacity: 1; } 100% { transform: translateY(100%) scale(0.5); opacity: 0; } }
    @keyframes bounce { 0%,100% { transform: scale(1); } 50% { transform: scale(1.3); } }
    @keyframes shake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-8px); } 75% { transform: translateX(8px); } }
    @keyframes celebrate { 0%,100% { transform: scale(1) rotate(0deg); } 25% { transform: scale(1.2) rotate(-5deg); } 75% { transform: scale(1.2) rotate(5deg); } }
    .peek-in { animation: peekIn 0.4s ease-out forwards; }
    .peek-out { animation: peekOut 0.3s ease-in forwards; }
    .bounce { animation: bounce 0.5s ease-in-out; }
    .shake { animation: shake 0.4s ease-in-out; }
    .celebrate { animation: celebrate 0.6s ease-in-out infinite; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel" data-presets="react,typescript">
    const { useState, useEffect, useCallback, useRef } = React;

    const PETS = ['🐶','🐱','🐰','🐹','🐸','🐼','🦊','🐨'];
    const TOTAL_ROUNDS = 10;

    function getRoundConfig(round: number): { maxCount: number; showMs: number; intervalMs: number } {
      if (round <= 3) return { maxCount: 5, showMs: 900, intervalMs: 400 };
      if (round <= 6) return { maxCount: 7, showMs: 700, intervalMs: 350 };
      return { maxCount: 10, showMs: 550, intervalMs: 280 };
    }

    function generateRound(round: number): { pets: string[]; answer: number } {
      const cfg = getRoundConfig(round);
      const count = Math.floor(Math.random() * cfg.maxCount) + 1;
      const pets = Array.from({ length: count }, () => PETS[Math.floor(Math.random() * PETS.length)]);
      return { pets, answer: count };
    }

    const CountingKennelGame = () => {
      const [round, setRound] = useState(1);
      const [score, setScore] = useState(0);
      const [phase, setPhase] = useState<'intro' | 'show' | 'guess' | 'feedback' | 'gameover'>('intro');
      const [currentPets, setCurrentPets] = useState<string[]>([]);
      const [answer, setAnswer] = useState(0);
      const [visiblePet, setVisiblePet] = useState<string | null>(null);
      const [petClass, setPetClass] = useState('');
      const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
      const [correctAnswer, setCorrectAnswer] = useState(0);
      const [peekIndex, setPeekIndex] = useState(0);
      const timerRef = useRef<any>(null);

      const startRound = useCallback((r: number) => {
        const cfg = getRoundConfig(r);
        const { pets, answer: ans } = generateRound(r);
        setCurrentPets(pets);
        setAnswer(ans);
        setVisiblePet(null);
        setPetClass('');
        setFeedback(null);
        setPeekIndex(0);
        setPhase('show');

        let idx = 0;
        const showNext = () => {
          if (idx >= pets.length) {
            setVisiblePet(null);
            setPetClass('');
            setTimeout(() => setPhase('guess'), 500);
            return;
          }
          setVisiblePet(pets[idx]);
          setPetClass('peek-in');
          idx++;
          setTimeout(() => {
            setPetClass('peek-out');
            setTimeout(showNext, cfg.intervalMs);
          }, cfg.showMs);
        };
        setTimeout(showNext, 600);
      }, []);

      useEffect(() => {
        if (phase === 'intro') {
          timerRef.current = setTimeout(() => startRound(1), 1000);
        }
        return () => { if (timerRef.current) clearTimeout(timerRef.current); };
      }, [phase, startRound]);

      const handleGuess = (guess: number) => {
        if (phase !== 'guess') return;
        const isCorrect = guess === answer;
        setCorrectAnswer(answer);
        if (isCorrect) {
          const pts = score + 10;
          setScore(pts);
          setFeedback('correct');
          window.RNBridge.sendScore(pts);
        } else {
          setFeedback('wrong');
        }
        setPhase('feedback');
        setTimeout(() => {
          const nextRound = round + 1;
          if (nextRound > TOTAL_ROUNDS) {
            setPhase('gameover');
            window.RNBridge.gameOver(isCorrect ? score + 10 : score);
          } else {
            setRound(nextRound);
            startRound(nextRound);
          }
        }, 1500);
      };

      const restart = () => {
        setRound(1);
        setScore(0);
        setPhase('intro');
        setFeedback(null);
        setVisiblePet(null);
        setTimeout(() => startRound(1), 100);
      };

      const cfg = getRoundConfig(round);
      const maxButtons = cfg.maxCount;
      const buttons = Array.from({ length: maxButtons }, (_, i) => i + 1);

      return (
        <div style={{ display:'flex', flexDirection:'column', height:'100%', background:'#FFF8DC', fontFamily:'sans-serif', overflow:'hidden', userSelect:'none' }}>
          {/* Header */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 16px', background:'#e07b39', color:'#fff' }}>
            <div style={{ fontSize:15, fontWeight:700 }}>Round {round}/{TOTAL_ROUNDS}</div>
            <div style={{ fontSize:15, fontWeight:700 }}>⭐ {score}</div>
          </div>

          {/* Kennel area */}
          <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:8 }}>
            <div style={{ fontSize:16, fontWeight:600, color:'#8B4513', marginBottom:4 }}>
              {phase === 'show' ? '👀 Watch the pets!' : phase === 'guess' ? '🤔 How many pets did you see?' : phase === 'feedback' ? (feedback === 'correct' ? '🎉 Correct!' : \`❌ It was \${correctAnswer}!\`) : phase === 'intro' ? 'Get ready!' : '🎊 Game Over!'}
            </div>

            {/* Kennel */}
            <div style={{ position:'relative', width:200, height:180 }}>
              <div style={{ fontSize:140, lineHeight:1, textAlign:'center', filter:'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' }}>🏠</div>
              {/* Pet peek window */}
              <div style={{ position:'absolute', bottom:20, left:'50%', transform:'translateX(-50%)', width:80, height:60, overflow:'hidden', display:'flex', alignItems:'flex-end', justifyContent:'center' }}>
                {visiblePet && (
                  <div className={petClass} style={{ fontSize:40, lineHeight:1 }}>{visiblePet}</div>
                )}
              </div>
            </div>

            {/* Feedback indicator */}
            {phase === 'feedback' && (
              <div style={{ fontSize:48, animation: feedback === 'correct' ? 'bounce 0.5s ease' : 'shake 0.4s ease' }}>
                {feedback === 'correct' ? '✅' : '❌'}
              </div>
            )}
          </div>

          {/* Number buttons */}
          {(phase === 'guess' || phase === 'feedback') && (
            <div style={{ padding:'8px 12px 16px' }}>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap:8 }}>
                {buttons.map(n => {
                  let bg = '#fff';
                  let border = '2px solid #e07b39';
                  let color = '#8B4513';
                  if (phase === 'feedback') {
                    if (n === correctAnswer) { bg = '#4caf50'; border = '2px solid #388e3c'; color = '#fff'; }
                    else if (n !== correctAnswer && feedback === 'wrong') { bg = '#fff'; border = '2px solid #ddd'; color = '#ccc'; }
                  }
                  return (
                    <button
                      key={n}
                      onClick={() => handleGuess(n)}
                      disabled={phase === 'feedback'}
                      style={{ padding:'14px 0', borderRadius:16, border, background:bg, color, fontSize:22, fontWeight:800, cursor: phase === 'guess' ? 'pointer' : 'default', transition:'all 0.2s', boxShadow: phase === 'guess' ? '0 3px 8px rgba(0,0,0,0.15)' : 'none' }}
                    >
                      {n}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {phase === 'gameover' && (
            <div style={{ position:'fixed', inset:0, background:'#00000099', display:'flex', alignItems:'center', justifyContent:'center', zIndex:10 }}>
              <div style={{ background:'#fff', borderRadius:24, padding:32, textAlign:'center', maxWidth:280, width:'90%', boxShadow:'0 8px 32px rgba(0,0,0,0.3)' }}>
                <div style={{ fontSize:56, marginBottom:8 }}>🏆</div>
                <div style={{ fontSize:22, fontWeight:800, color:'#8B4513', marginBottom:4 }}>Well done!</div>
                <div style={{ fontSize:32, fontWeight:800, color:'#e07b39', marginBottom:20 }}>⭐ {score} pts</div>
                <button onClick={restart} style={{ display:'block', width:'100%', padding:'14px', borderRadius:16, border:'none', background:'#e07b39', color:'#fff', fontSize:18, fontWeight:700, cursor:'pointer', marginBottom:10 }}>
                  🔄 Play Again
                </button>
                <button onClick={() => window.RNBridge.navigate('back')} style={{ display:'block', width:'100%', padding:'10px', borderRadius:12, border:'2px solid #ccc', background:'transparent', color:'#888', fontSize:14, fontWeight:600, cursor:'pointer' }}>
                  ← Back
                </button>
              </div>
            </div>
          )}
        </div>
      );
    };

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(React.createElement(CountingKennelGame));
  </script>
</body>
</html>`;
}

export const CountingKennelGameScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { updateBestScore } = useCountingKennel();
  const { triggerAd } = useGameAdTrigger('counting-kennel');
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [adRewardPending, setAdRewardPending] = useState(false);

  const artifactHtml = React.useMemo(() => getArtifactHTML(), []);

  const handleScoreUpdate = useCallback((newScore: number) => {
    setScore(newScore);
  }, []);

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
      if (target === 'back') handleBack();
    },
    [handleBack],
  );

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
                <Text style={styles.playAgainText}>🎬 {t('countingKennel.gameOver.watchAd')}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.playAgainButton}
              onPress={() => {
                setGameOver(false);
                setScore(0);
                setAdRewardPending(false);
                navigation.replace('CountingKennelGame');
              }}
              disabled={adRewardPending}
              accessibilityRole="button"
            >
              <Text style={styles.playAgainText}>{t('countingKennel.gameOver.playAgain')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF8DC' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8 },
  backText: { fontSize: 16, color: '#8B4513', fontWeight: '600' },
  scoreText: { fontSize: 18, fontWeight: 'bold', color: '#8B4513' },
  gameArea: { flex: 1 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  overlayCard: { backgroundColor: '#fff', borderRadius: 24, padding: 32, alignItems: 'center', minWidth: 260, gap: 12 },
  playAgainButton: { backgroundColor: '#e07b39', borderRadius: 16, paddingVertical: 12, paddingHorizontal: 32, width: '100%', alignItems: 'center' },
  playAgainText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
