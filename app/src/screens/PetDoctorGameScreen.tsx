import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { ArtifactGameAdapter } from '../components/ArtifactGameAdapter';
import { usePetDoctor } from '../context/PetDoctorContext';
import { useGameBack } from '../hooks/useGameBack';
import { useGameAdTrigger } from '../components/GameAdWrapper';

type Props = NativeStackScreenProps<RootStackParamList, 'PetDoctorGame'>;

function getArtifactHTML(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>Pet Doctor</title>
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
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel" data-presets="react">
    const { useState, useEffect, useCallback, useRef } = React;

    const TOOLS = [
      { id: 'thermometer', emoji: '🌡️', label: 'Check Temperature', tapCount: 8, instruction: 'Tap rapidly to take temperature!' },
      { id: 'stethoscope', emoji: '🔊', label: 'Listen to Heart', tapCount: 6, instruction: 'Tap to listen to the heartbeat!' },
      { id: 'medicine', emoji: '💊', label: 'Give Medicine', tapCount: 5, instruction: 'Tap to give the medicine!' },
      { id: 'bandage', emoji: '🩹', label: 'Apply Bandage', tapCount: 7, instruction: 'Tap to apply the bandage!' },
    ];

    function PetDoctorGame() {
      const [step, setStep] = useState(0);
      const [taps, setTaps] = useState(0);
      const [done, setDone] = useState(false);
      const [particles, setParticles] = useState([]);
      const [shake, setShake] = useState(false);
      const particleId = useRef(0);

      const currentTool = TOOLS[step];
      const progress = step / TOOLS.length;
      const petEmoji = done ? '😸' : step === 0 && taps === 0 ? '😿' : step < 2 ? '😾' : '🙀';
      const healthPct = Math.min(100, Math.round((step / TOOLS.length) * 100 + (taps / (currentTool?.tapCount || 1)) * (100 / TOOLS.length)));

      const spawnParticle = useCallback((emoji) => {
        const id = particleId.current++;
        const x = 20 + Math.random() * 60;
        const y = 20 + Math.random() * 60;
        setParticles(prev => [...prev, { id, emoji, x, y }]);
        setTimeout(() => setParticles(prev => prev.filter(p => p.id !== id)), 900);
      }, []);

      const handleTap = useCallback(() => {
        if (done) return;
        const tool = TOOLS[step];
        const nextTaps = taps + 1;
        setTaps(nextTaps);
        spawnParticle(['✨','💫','⭐','🌟'][Math.floor(Math.random()*4)]);
        setShake(true);
        setTimeout(() => setShake(false), 200);

        if (nextTaps >= tool.tapCount) {
          setTaps(0);
          const nextStep = step + 1;
          if (nextStep >= TOOLS.length) {
            setDone(true);
            window.RNBridge.sendScore(100);
            setTimeout(() => window.RNBridge.gameOver(100), 1200);
          } else {
            setStep(nextStep);
          }
        }
      }, [done, step, taps, spawnParticle]);

      const tapProgress = currentTool ? Math.min(100, Math.round((taps / currentTool.tapCount) * 100)) : 100;

      return (
        <div style={{ width:'100%', height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'space-between', padding:'16px', background:'linear-gradient(180deg, #E8F5E9 0%, #C8E6C9 100%)', position:'relative', overflow:'hidden' }}>
          {/* Particles */}
          {particles.map(p => (
            <div key={p.id} style={{ position:'absolute', left: p.x+'%', top: p.y+'%', fontSize:'24px', animation:'floatUp 0.9s ease-out forwards', pointerEvents:'none', zIndex:10 }}>
              {p.emoji}
            </div>
          ))}

          <style>{\`
            @keyframes floatUp { 0%{opacity:1;transform:translateY(0) scale(1)} 100%{opacity:0;transform:translateY(-60px) scale(1.5)} }
            @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }
            @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.08)} }
            @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
          \`}</style>

          {/* Header */}
          <div style={{ width:'100%', textAlign:'center' }}>
            <div style={{ fontSize:'14px', fontWeight:'700', color:'#2E7D32', marginBottom:'8px' }}>
              {done ? 'All Done! Pet is Healthy! 🎉' : 'Step ' + (step+1) + ' of ' + TOOLS.length}
            </div>
            {/* Health bar */}
            <div style={{ background:'#A5D6A7', borderRadius:'12px', height:'18px', width:'100%', overflow:'hidden', border:'2px solid #2E7D32' }}>
              <div style={{ background:'linear-gradient(90deg,#43A047,#66BB6A)', height:'100%', width: healthPct+'%', borderRadius:'10px', transition:'width 0.5s ease' }} />
            </div>
            <div style={{ fontSize:'12px', color:'#388E3C', marginTop:'4px' }}>Health: {healthPct}%</div>
          </div>

          {/* Pet */}
          <div style={{ fontSize:'96px', animation: done ? 'bounce 1s ease infinite' : shake ? 'shake 0.2s ease' : 'pulse 2s ease infinite', display:'flex', alignItems:'center', justifyContent:'center' }}>
            {petEmoji}
          </div>

          {/* Tool area */}
          {!done ? (
            <div style={{ width:'100%', display:'flex', flexDirection:'column', alignItems:'center', gap:'12px' }}>
              {/* Step indicators */}
              <div style={{ display:'flex', gap:'8px' }}>
                {TOOLS.map((t, i) => (
                  <div key={t.id} style={{ width:'36px', height:'36px', borderRadius:'50%', background: i < step ? '#2E7D32' : i === step ? '#66BB6A' : '#A5D6A7', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px', border: i === step ? '3px solid #1B5E20' : '2px solid #A5D6A7' }}>
                    {i < step ? '✓' : t.emoji}
                  </div>
                ))}
              </div>

              <div style={{ fontSize:'14px', color:'#388E3C', fontWeight:'600' }}>{currentTool.instruction}</div>

              {/* Tap progress */}
              <div style={{ background:'#C8E6C9', borderRadius:'10px', height:'12px', width:'80%', overflow:'hidden' }}>
                <div style={{ background:'#43A047', height:'100%', width: tapProgress+'%', transition:'width 0.1s' }} />
              </div>

              {/* Big tool button */}
              <button
                onClick={handleTap}
                style={{ fontSize:'52px', padding:'20px 40px', background:'#fff', border:'4px solid #2E7D32', borderRadius:'24px', cursor:'pointer', boxShadow:'0 4px 16px rgba(46,125,50,0.2)', display:'flex', flexDirection:'column', alignItems:'center', gap:'8px', width:'80%' }}
              >
                <span>{currentTool.emoji}</span>
                <span style={{ fontSize:'16px', fontWeight:'700', color:'#2E7D32' }}>{currentTool.label}</span>
                <span style={{ fontSize:'13px', color:'#888' }}>{taps}/{currentTool.tapCount} taps</span>
              </button>
            </div>
          ) : (
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:'28px', fontWeight:'800', color:'#1B5E20', marginBottom:'8px' }}>🎉 100 Points!</div>
              <div style={{ fontSize:'16px', color:'#2E7D32' }}>Your pet is happy and healthy!</div>
            </div>
          )}
        </div>
      );
    }

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(React.createElement(PetDoctorGame));
  </script>
</body>
</html>`;
}

export const PetDoctorGameScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { updateBestScore } = usePetDoctor();
  const { triggerAd } = useGameAdTrigger('pet-doctor');
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
            <Text style={styles.overlayTitle}>🏥 {score} pts!</Text>
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
                <Text style={styles.playAgainText}>{t('petDoctor.gameOver.watchAd')}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.playAgainButton}
              onPress={() => { setGameOver(false); setScore(0); setAdRewardPending(false); navigation.replace('PetDoctorGame'); }}
              disabled={adRewardPending}
              accessibilityRole="button"
            >
              <Text style={styles.playAgainText}>{t('petDoctor.gameOver.playAgain')}</Text>
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
  backText: { fontSize: 16, color: '#2E7D32', fontWeight: '600' },
  scoreText: { fontSize: 18, fontWeight: 'bold', color: '#2E7D32' },
  gameArea: { flex: 1 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  overlayCard: { backgroundColor: '#fff', borderRadius: 24, padding: 32, alignItems: 'center', minWidth: 260, gap: 12 },
  overlayTitle: { fontSize: 24, fontWeight: '800', color: '#2E7D32', marginBottom: 8 },
  playAgainButton: { backgroundColor: '#2E7D32', borderRadius: 16, paddingVertical: 12, paddingHorizontal: 32, width: '100%', alignItems: 'center' },
  playAgainText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
