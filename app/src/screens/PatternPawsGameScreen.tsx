import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { ArtifactGameAdapter } from '../components/ArtifactGameAdapter';
import { usePatternPaws } from '../context/PatternPawsContext';
import { useGameBack } from '../hooks/useGameBack';
import { useGameAdTrigger } from '../components/GameAdWrapper';

type Props = NativeStackScreenProps<RootStackParamList, 'PatternPawsGame'>;

function getArtifactHTML(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>Pattern Paws</title>
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
    html, body, #root { width: 100%; height: 100%; overflow: hidden; background: #E8F5E9; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    @keyframes popIn { 0% { transform: scale(0.5); opacity: 0; } 70% { transform: scale(1.15); } 100% { transform: scale(1); opacity: 1; } }
    @keyframes correct { 0%,100% { transform: scale(1); } 50% { transform: scale(1.25); background: #c8e6c9; } }
    @keyframes wrongShake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-6px); } 75% { transform: translateX(6px); } }
    .pop-in { animation: popIn 0.35s ease-out forwards; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel" data-presets="react,typescript">
    const { useState, useCallback, useEffect } = React;

    // Paw colors and shapes
    type Paw = { color: string; emoji: string; label: string };
    const PAWS: Paw[] = [
      { color: '#e53935', emoji: '🔴', label: 'red' },
      { color: '#1e88e5', emoji: '🔵', label: 'blue' },
      { color: '#43a047', emoji: '🟢', label: 'green' },
      { color: '#fdd835', emoji: '🟡', label: 'yellow' },
      { color: '#8e24aa', emoji: '🟣', label: 'purple' },
      { color: '#fb8c00', emoji: '🟠', label: 'orange' },
    ];

    const TOTAL_ROUNDS = 10;

    function generatePattern(round: number): { sequence: Paw[]; answer: Paw; choices: Paw[] } {
      // Early rounds: simple alternation 2-color
      // Later rounds: 3-color cycles or color+size patterns
      let sequence: Paw[];
      let answer: Paw;

      if (round <= 3) {
        // AB alternation
        const a = PAWS[Math.floor(Math.random() * PAWS.length)];
        let b = PAWS[Math.floor(Math.random() * PAWS.length)];
        while (b.label === a.label) b = PAWS[Math.floor(Math.random() * PAWS.length)];
        const len = 4 + (round % 2); // 4 or 5 visible
        sequence = [];
        for (let i = 0; i < len; i++) sequence.push(i % 2 === 0 ? a : b);
        answer = len % 2 === 0 ? a : b;
      } else if (round <= 7) {
        // ABC cycle
        const pool = [...PAWS].sort(() => Math.random() - 0.5).slice(0, 3);
        const len = 5 + (round % 3);
        sequence = [];
        for (let i = 0; i < len; i++) sequence.push(pool[i % 3]);
        answer = pool[len % 3];
      } else {
        // ABBA or AABB
        const pool = [...PAWS].sort(() => Math.random() - 0.5).slice(0, 2);
        const patterns = [
          [0,1,1,0, 0], [0,0,1,1, 0], [0,1,0,1, 0], [0,1,0,1,0,1, 0]
        ];
        const pat = patterns[Math.floor(Math.random() * patterns.length)];
        sequence = pat.slice(0, -1).map(i => pool[i]);
        answer = pool[pat[pat.length - 1]];
      }

      // Generate 4 choices including the answer
      const wrong = PAWS.filter(p => p.label !== answer.label).sort(() => Math.random() - 0.5).slice(0, 3);
      const choices = [...wrong, answer].sort(() => Math.random() - 0.5);

      return { sequence, answer, choices };
    }

    const PawCircle = ({ paw, size = 48, dimmed = false, animate = false }: { paw: Paw; size?: number; dimmed?: boolean; animate?: boolean }) => (
      <div className={animate ? 'pop-in' : ''} style={{
        width: size, height: size, borderRadius: '50%',
        background: dimmed ? '#ddd' : paw.color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: size * 0.45, boxShadow: dimmed ? 'none' : '0 3px 8px rgba(0,0,0,0.2)',
        border: dimmed ? '2px dashed #bbb' : '2px solid rgba(255,255,255,0.4)',
        transition: 'all 0.2s',
        flexShrink: 0,
      }}>
        {dimmed ? '?' : '🐾'}
      </div>
    );

    const PatternPawsGame = () => {
      const [round, setRound] = useState(1);
      const [score, setScore] = useState(0);
      const [roundData, setRoundData] = useState(() => generatePattern(1));
      const [phase, setPhase] = useState<'play' | 'feedback' | 'gameover'>('play');
      const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
      const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

      const handleChoice = (paw: Paw) => {
        if (phase !== 'play') return;
        const isCorrect = paw.label === roundData.answer.label;
        setSelectedChoice(paw.label);
        setFeedback(isCorrect ? 'correct' : 'wrong');
        setPhase('feedback');

        const newScore = isCorrect ? score + 10 : score;
        if (isCorrect) {
          setScore(newScore);
          window.RNBridge.sendScore(newScore);
        }

        setTimeout(() => {
          const nextRound = round + 1;
          if (nextRound > TOTAL_ROUNDS) {
            setPhase('gameover');
            window.RNBridge.gameOver(newScore);
          } else {
            setRound(nextRound);
            setRoundData(generatePattern(nextRound));
            setPhase('play');
            setFeedback(null);
            setSelectedChoice(null);
          }
        }, 1200);
      };

      const restart = () => {
        setRound(1);
        setScore(0);
        setRoundData(generatePattern(1));
        setPhase('play');
        setFeedback(null);
        setSelectedChoice(null);
      };

      const pawSize = Math.min(52, Math.floor((window.innerWidth - 40) / (roundData.sequence.length + 1.5)));

      return (
        <div style={{ display:'flex', flexDirection:'column', height:'100%', background:'#E8F5E9', fontFamily:'sans-serif', overflow:'hidden' }}>
          {/* Header */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 16px', background:'#43a047', color:'#fff' }}>
            <div style={{ fontSize:14, fontWeight:700 }}>Round {round}/{TOTAL_ROUNDS}</div>
            <div style={{ fontSize:18, fontWeight:800 }}>🐾 Pattern Paws</div>
            <div style={{ fontSize:14, fontWeight:700 }}>⭐ {score}</div>
          </div>

          {/* Progress bar */}
          <div style={{ height:6, background:'#c8e6c9' }}>
            <div style={{ height:'100%', width: \`\${(round - 1) / TOTAL_ROUNDS * 100}%\`, background:'#2e7d32', transition:'width 0.5s' }} />
          </div>

          <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'space-around', padding:'16px 12px' }}>

            {/* Instruction */}
            <div style={{ fontSize:16, fontWeight:700, color:'#2e7d32', textAlign:'center' }}>
              {phase === 'feedback' ? (feedback === 'correct' ? '🎉 Correct!' : \`❌ It was \${roundData.answer.emoji}!\`) : "What comes next? 🤔"}
            </div>

            {/* Sequence */}
            <div style={{ display:'flex', alignItems:'center', gap:10, padding:'16px 12px', background:'#fff', borderRadius:20, boxShadow:'0 3px 12px rgba(0,0,0,0.1)', flexWrap:'wrap', justifyContent:'center', maxWidth:'100%' }}>
              {roundData.sequence.map((paw, i) => (
                <PawCircle key={i} paw={paw} size={pawSize} animate={false} />
              ))}
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <div style={{ fontSize:18, color:'#2e7d32', fontWeight:700 }}>→</div>
                <PawCircle paw={roundData.answer} size={pawSize} dimmed={phase === 'play'} />
              </div>
            </div>

            {/* Choices */}
            <div>
              <div style={{ fontSize:14, fontWeight:600, color:'#555', textAlign:'center', marginBottom:10 }}>Tap the correct paw:</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, maxWidth:300, margin:'0 auto' }}>
                {roundData.choices.map((paw) => {
                  const isSelected = selectedChoice === paw.label;
                  const isAnswer = paw.label === roundData.answer.label;
                  let border = '3px solid transparent';
                  let bg = '#fff';
                  if (phase === 'feedback') {
                    if (isAnswer) { border = '3px solid #43a047'; bg = '#e8f5e9'; }
                    else if (isSelected && !isAnswer) { border = '3px solid #e53935'; bg = '#ffebee'; }
                  }
                  return (
                    <button
                      key={paw.label}
                      onClick={() => handleChoice(paw)}
                      disabled={phase === 'feedback'}
                      style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6, padding:'14px 12px', borderRadius:16, border, background:bg, cursor: phase === 'play' ? 'pointer' : 'default', boxShadow:'0 2px 8px rgba(0,0,0,0.1)', transition:'all 0.2s' }}
                    >
                      <div style={{ width:48, height:48, borderRadius:'50%', background:paw.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, boxShadow:'0 2px 6px rgba(0,0,0,0.2)' }}>🐾</div>
                      <span style={{ fontSize:12, fontWeight:700, color:'#555', textTransform:'capitalize' }}>{paw.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {phase === 'gameover' && (
            <div style={{ position:'fixed', inset:0, background:'#00000099', display:'flex', alignItems:'center', justifyContent:'center', zIndex:10 }}>
              <div style={{ background:'#fff', borderRadius:24, padding:32, textAlign:'center', maxWidth:280, width:'90%', boxShadow:'0 8px 32px rgba(0,0,0,0.3)' }}>
                <div style={{ fontSize:56, marginBottom:8 }}>🏆</div>
                <div style={{ fontSize:22, fontWeight:800, color:'#2e7d32', marginBottom:4 }}>All patterns found!</div>
                <div style={{ fontSize:32, fontWeight:800, color:'#43a047', marginBottom:20 }}>⭐ {score} pts</div>
                <button onClick={restart} style={{ display:'block', width:'100%', padding:'14px', borderRadius:16, border:'none', background:'#43a047', color:'#fff', fontSize:18, fontWeight:700, cursor:'pointer', marginBottom:10 }}>
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
    root.render(React.createElement(PatternPawsGame));
  </script>
</body>
</html>`;
}

export const PatternPawsGameScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { updateBestScore } = usePatternPaws();
  const { triggerAd } = useGameAdTrigger('pattern-paws');
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
                <Text style={styles.playAgainText}>🎬 {t('patternPaws.gameOver.watchAd')}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.playAgainButton}
              onPress={() => {
                setGameOver(false);
                setScore(0);
                setAdRewardPending(false);
                navigation.replace('PatternPawsGame');
              }}
              disabled={adRewardPending}
              accessibilityRole="button"
            >
              <Text style={styles.playAgainText}>{t('patternPaws.gameOver.playAgain')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E8F5E9' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8 },
  backText: { fontSize: 16, color: '#2e7d32', fontWeight: '600' },
  scoreText: { fontSize: 18, fontWeight: 'bold', color: '#2e7d32' },
  gameArea: { flex: 1 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  overlayCard: { backgroundColor: '#fff', borderRadius: 24, padding: 32, alignItems: 'center', minWidth: 260, gap: 12 },
  playAgainButton: { backgroundColor: '#43a047', borderRadius: 16, paddingVertical: 12, paddingHorizontal: 32, width: '100%', alignItems: 'center' },
  playAgainText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
