import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { ArtifactGameAdapter } from '../components/ArtifactGameAdapter';
import { usePetGrooming } from '../context/PetGroomingContext';
import { useGameBack } from '../hooks/useGameBack';
import { useGameAdTrigger } from '../components/GameAdWrapper';

type Props = NativeStackScreenProps<RootStackParamList, 'PetGroomingGame'>;

function getArtifactHTML(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>Pet Grooming Salon</title>
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
    html, body, #root { width: 100%; height: 100%; overflow: hidden; background: #E3F2FD; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    @keyframes sparkle { 0%{opacity:1;transform:scale(0) rotate(0deg)} 50%{opacity:1;transform:scale(1.4) rotate(180deg)} 100%{opacity:0;transform:scale(0) rotate(360deg)} }
    @keyframes floatUp { 0%{opacity:1;transform:translateY(0)} 100%{opacity:0;transform:translateY(-70px)} }
    @keyframes petShine { 0%,100%{filter:brightness(1)} 50%{filter:brightness(1.3)} }
    @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
    @keyframes nail { 0%{transform:scale(1)} 50%{transform:scale(1.4)} 100%{transform:scale(1)} }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel" data-presets="react">
    const { useState, useCallback, useRef, useEffect } = React;

    const STEPS = [
      { id: 'brush', emoji: '🪮', label: 'Brush Fur', instruction: 'Tap the brush back and forth!', target: 10, pet: '🐱' },
      { id: 'nails', emoji: '✂️', label: 'Trim Nails', instruction: 'Tap all 4 nail buttons!', target: 4, pet: '🐱' },
      { id: 'ears', emoji: '🧹', label: 'Clean Ears', instruction: 'Tap the cotton swab 3 times!', target: 3, pet: '🐱' },
      { id: 'bath', emoji: '🛁', label: 'Give a Bath', instruction: 'Pop all the soap bubbles!', target: 6, pet: '🐱' },
      { id: 'accessory', emoji: '🎀', label: 'Add Accessory', instruction: 'Choose a cute accessory!', target: 1, pet: '🐱' },
    ];

    const ACCESSORIES = [
      { id: 'bow', emoji: '🎀', label: 'Bow' },
      { id: 'bandana', emoji: '🔵', label: 'Bandana' },
      { id: 'hat', emoji: '🎩', label: 'Top Hat' },
    ];

    function Particle({ x, y, emoji }) {
      return <div style={{ position:'absolute', left:x+'%', top:y+'%', fontSize:'18px', animation:'floatUp 0.8s ease-out forwards', pointerEvents:'none', zIndex:30 }}>{emoji}</div>;
    }

    function PetGroomingGame() {
      const [step, setStep] = useState(0);
      const [progress, setProgress] = useState(0);
      const [particles, setParticles] = useState([]);
      const [nailsDone, setNailsDone] = useState([false,false,false,false]);
      const [bubbles, setBubbles] = useState(() => Array.from({length:6}, (_,i) => ({ id:i, x: 10+i*13, y: 30+Math.random()*40, alive:true })));
      const [chosenAccessory, setChosenAccessory] = useState(null);
      const [done, setDone] = useState(false);
      const [score, setScore] = useState(0);
      const pId = useRef(0);

      const spawnParticles = useCallback((count=3) => {
        const emojis = ['✨','💫','⭐','🌟','💎','🌸'];
        setParticles(prev => {
          const newOnes = Array.from({length:count}, () => {
            const id = pId.current++;
            setTimeout(() => setParticles(p => p.filter(x => x.id !== id)), 900);
            return { id, x: 15+Math.random()*70, y: 20+Math.random()*60, emoji: emojis[Math.floor(Math.random()*emojis.length)] };
          });
          return [...prev, ...newOnes];
        });
      }, []);

      const advance = useCallback((earned=20) => {
        const newScore = score + earned;
        setScore(newScore);
        window.RNBridge.sendScore(newScore);
        spawnParticles(5);
        const nextStep = step + 1;
        if (nextStep >= STEPS.length) {
          setDone(true);
          setTimeout(() => window.RNBridge.gameOver(newScore), 1200);
        } else {
          setTimeout(() => { setStep(nextStep); setProgress(0); }, 600);
        }
      }, [score, step, spawnParticles]);

      const handleBrush = useCallback(() => {
        if (step !== 0) return;
        const next = progress + 1;
        setProgress(next);
        spawnParticles(1);
        if (next >= STEPS[0].target) advance();
      }, [step, progress, advance, spawnParticles]);

      const handleNail = useCallback((i) => {
        if (step !== 1) return;
        const next = [...nailsDone];
        if (next[i]) return;
        next[i] = true;
        setNailsDone(next);
        spawnParticles(2);
        if (next.every(Boolean)) advance();
      }, [step, nailsDone, advance, spawnParticles]);

      const handleEar = useCallback(() => {
        if (step !== 2) return;
        const next = progress + 1;
        setProgress(next);
        spawnParticles(2);
        if (next >= STEPS[2].target) advance();
      }, [step, progress, advance, spawnParticles]);

      const handleBubble = useCallback((id) => {
        if (step !== 3) return;
        setBubbles(prev => prev.map(b => b.id === id ? {...b, alive:false} : b));
        spawnParticles(2);
        const remaining = bubbles.filter(b => b.alive && b.id !== id).length;
        if (remaining === 0) advance();
      }, [step, bubbles, advance, spawnParticles]);

      const handleAccessory = useCallback((acc) => {
        if (step !== 4 || chosenAccessory) return;
        setChosenAccessory(acc);
        spawnParticles(6);
        setTimeout(() => advance(20), 400);
      }, [step, chosenAccessory, advance, spawnParticles]);

      const currentStep = STEPS[step];
      const petDisplay = done ? (chosenAccessory ? chosenAccessory.emoji + '😺' : '😺') : currentStep.pet;

      return (
        <div style={{ width:'100%', height:'100%', display:'flex', flexDirection:'column', background:'linear-gradient(180deg,#E3F2FD 0%,#BBDEFB 100%)', position:'relative', overflow:'hidden', padding:'12px' }}>
          {particles.map(p => <Particle key={p.id} x={p.x} y={p.y} emoji={p.emoji} />)}

          {/* Step indicators */}
          <div style={{ display:'flex', justifyContent:'center', gap:'6px', marginBottom:'8px' }}>
            {STEPS.map((s, i) => (
              <div key={s.id} style={{ width:'32px', height:'32px', borderRadius:'50%', background: i < step ? '#1565C0' : i === step ? '#42A5F5' : '#BBDEFB', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px', border: i===step ? '3px solid #0D47A1' : '2px solid #90CAF9', color:'#fff', fontWeight:'700' }}>
                {i < step ? '✓' : s.emoji}
              </div>
            ))}
          </div>

          {/* Score */}
          <div style={{ textAlign:'center', fontSize:'13px', color:'#1565C0', fontWeight:'700', marginBottom:'4px' }}>⭐ Score: {score} / 100</div>

          {/* Pet display */}
          <div style={{ textAlign:'center', fontSize:'80px', margin:'8px 0', animation: done ? 'bounce 0.8s ease infinite' : 'petShine 2s ease infinite' }}>
            {done ? '😺' : '🐱'}
            {chosenAccessory && <span style={{ fontSize:'40px', verticalAlign:'top' }}>{chosenAccessory.emoji}</span>}
          </div>

          {/* Step instruction */}
          <div style={{ textAlign:'center', background:'rgba(255,255,255,0.7)', borderRadius:'12px', padding:'8px 16px', marginBottom:'8px' }}>
            <div style={{ fontSize:'18px', fontWeight:'700', color:'#1565C0' }}>{currentStep.emoji} {currentStep.label}</div>
            <div style={{ fontSize:'13px', color:'#555' }}>{done ? 'Makeover Complete! 🎉' : currentStep.instruction}</div>
          </div>

          {/* Step-specific controls */}
          {!done && (
            <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'12px' }}>
              {step === 0 && (
                <>
                  <div style={{ background:'#BBDEFB', borderRadius:'12px', height:'14px', width:'80%', overflow:'hidden' }}>
                    <div style={{ background:'#1565C0', height:'100%', width: Math.round((progress/10)*100)+'%', transition:'width 0.1s' }} />
                  </div>
                  <button onClick={handleBrush} style={{ fontSize:'48px', padding:'20px 40px', background:'#fff', border:'4px solid #1565C0', borderRadius:'24px', cursor:'pointer', boxShadow:'0 4px 16px rgba(21,101,192,0.3)' }}>
                    🪮<br/><span style={{ fontSize:'14px', color:'#1565C0', fontWeight:'700' }}>Brush! ({progress}/{STEPS[0].target})</span>
                  </button>
                </>
              )}
              {step === 1 && (
                <div style={{ display:'flex', gap:'12px', flexWrap:'wrap', justifyContent:'center' }}>
                  {nailsDone.map((done, i) => (
                    <button key={i} onClick={() => handleNail(i)} disabled={done} style={{ fontSize:'32px', padding:'16px', background: done ? '#E3F2FD' : '#fff', border: done ? '3px solid #90CAF9' : '3px solid #1565C0', borderRadius:'16px', cursor: done ? 'not-allowed' : 'pointer', opacity: done ? 0.5 : 1, minWidth:'64px', animation: done ? '' : 'nail 0.5s ease infinite' }}>
                      {done ? '✅' : '💅'}
                    </button>
                  ))}
                </div>
              )}
              {step === 2 && (
                <>
                  <div style={{ background:'#BBDEFB', borderRadius:'12px', height:'14px', width:'80%', overflow:'hidden' }}>
                    <div style={{ background:'#1565C0', height:'100%', width: Math.round((progress/3)*100)+'%', transition:'width 0.1s' }} />
                  </div>
                  <button onClick={handleEar} style={{ fontSize:'48px', padding:'20px 40px', background:'#fff', border:'4px solid #1565C0', borderRadius:'24px', cursor:'pointer', boxShadow:'0 4px 16px rgba(21,101,192,0.3)' }}>
                    🧹<br/><span style={{ fontSize:'14px', color:'#1565C0', fontWeight:'700' }}>Clean! ({progress}/{STEPS[2].target})</span>
                  </button>
                </>
              )}
              {step === 3 && (
                <div style={{ display:'flex', flexWrap:'wrap', gap:'10px', justifyContent:'center', padding:'8px' }}>
                  {bubbles.map(b => b.alive && (
                    <button key={b.id} onClick={() => handleBubble(b.id)} style={{ fontSize:'36px', padding:'12px', background:'rgba(33,150,243,0.15)', border:'3px solid #42A5F5', borderRadius:'50%', cursor:'pointer', width:'64px', height:'64px', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      🫧
                    </button>
                  ))}
                </div>
              )}
              {step === 4 && (
                <div style={{ display:'flex', gap:'16px', justifyContent:'center' }}>
                  {ACCESSORIES.map(acc => (
                    <button key={acc.id} onClick={() => handleAccessory(acc)} style={{ fontSize:'36px', padding:'16px 20px', background: chosenAccessory?.id === acc.id ? '#E3F2FD' : '#fff', border: chosenAccessory?.id === acc.id ? '4px solid #0D47A1' : '3px solid #1565C0', borderRadius:'20px', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:'4px' }}>
                      {acc.emoji}
                      <span style={{ fontSize:'12px', color:'#1565C0', fontWeight:'600' }}>{acc.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {done && (
            <div style={{ textAlign:'center', marginTop:'8px' }}>
              <div style={{ fontSize:'24px', fontWeight:'800', color:'#0D47A1' }}>✨ Makeover Complete! ✨</div>
              <div style={{ fontSize:'14px', color:'#1565C0' }}>Your pet looks fabulous!</div>
            </div>
          )}
        </div>
      );
    }

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(React.createElement(PetGroomingGame));
  </script>
</body>
</html>`;
}

export const PetGroomingGameScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { updateBestScore } = usePetGrooming();
  const { triggerAd } = useGameAdTrigger('pet-grooming');
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [adRewardPending, setAdRewardPending] = useState(false);
  const artifactHtml = React.useMemo(() => getArtifactHTML(), []);

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
            <Text style={styles.overlayTitle}>✂️ {score} pts!</Text>
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
                <Text style={styles.playAgainText}>{t('petGrooming.gameOver.watchAd')}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.playAgainButton}
              onPress={() => { setGameOver(false); setScore(0); setAdRewardPending(false); navigation.replace('PetGroomingGame'); }}
              disabled={adRewardPending}
              accessibilityRole="button"
            >
              <Text style={styles.playAgainText}>{t('petGrooming.gameOver.playAgain')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E3F2FD' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8 },
  backText: { fontSize: 16, color: '#1565C0', fontWeight: '600' },
  scoreText: { fontSize: 18, fontWeight: 'bold', color: '#1565C0' },
  gameArea: { flex: 1 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  overlayCard: { backgroundColor: '#fff', borderRadius: 24, padding: 32, alignItems: 'center', minWidth: 260, gap: 12 },
  overlayTitle: { fontSize: 24, fontWeight: '800', color: '#1565C0', marginBottom: 8 },
  playAgainButton: { backgroundColor: '#1565C0', borderRadius: 16, paddingVertical: 12, paddingHorizontal: 32, width: '100%', alignItems: 'center' },
  playAgainText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
