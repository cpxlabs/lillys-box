import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { ArtifactGameAdapter } from '../components/ArtifactGameAdapter';
import { usePetDiary } from '../context/PetDiaryContext';
import { useGameBack } from '../hooks/useGameBack';
import { useGameAdTrigger } from '../components/GameAdWrapper';

type Props = NativeStackScreenProps<RootStackParamList, 'PetDiaryGame'>;

function getArtifactHTML(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>Pet Diary</title>
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
    html, body, #root { width: 100%; height: 100%; overflow: hidden; background: #FFF8E1; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    @keyframes stampIn { 0%{opacity:0;transform:scale(2) rotate(-10deg)} 60%{transform:scale(0.9) rotate(2deg)} 100%{opacity:1;transform:scale(1) rotate(0deg)} }
    @keyframes floatStar { 0%{opacity:1;transform:translateY(0) scale(1)} 100%{opacity:0;transform:translateY(-80px) scale(1.4)} }
    @keyframes petBounce { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-16px) scale(1.1)} }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel" data-presets="react">
    const { useState, useCallback, useRef, useEffect } = React;

    const ALL_STICKERS = [
      { id: 'fed', emoji: '🍖', label: 'Fed' },
      { id: 'bathed', emoji: '🛁', label: 'Bathed' },
      { id: 'napped', emoji: '😴', label: 'Napped' },
      { id: 'played', emoji: '🎮', label: 'Played' },
      { id: 'vet', emoji: '🏥', label: 'Vet Visit' },
      { id: 'outside', emoji: '🌳', label: 'Outside' },
    ];

    function PetDiaryGame() {
      const [placed, setPlaced] = useState([]);
      const [saved, setSaved] = useState(false);
      const [stars, setStars] = useState([]);
      const [usedIds, setUsedIds] = useState(new Set());
      const starId = useRef(0);

      const score = placed.length * 10;
      const canSave = placed.length >= 3;

      const spawnStar = useCallback(() => {
        const id = starId.current++;
        const x = 10 + Math.random() * 80;
        const y = 20 + Math.random() * 60;
        setStars(prev => [...prev, { id, x, y }]);
        setTimeout(() => setStars(prev => prev.filter(s => s.id !== id)), 1200);
      }, []);

      const handleStickerTap = useCallback((sticker) => {
        if (saved || usedIds.has(sticker.id) || placed.length >= 6) return;
        const newPlaced = [...placed, { ...sticker, key: Date.now() }];
        setPlaced(newPlaced);
        setUsedIds(prev => new Set([...prev, sticker.id]));
        const newScore = newPlaced.length * 10;
        window.RNBridge.sendScore(newScore);
        spawnStar();
      }, [saved, usedIds, placed, spawnStar]);

      const handleSave = useCallback(() => {
        if (!canSave || saved) return;
        setSaved(true);
        for (let i = 0; i < 12; i++) setTimeout(spawnStar, i * 100);
        window.RNBridge.sendScore(score);
        setTimeout(() => window.RNBridge.gameOver(score), 2000);
      }, [canSave, saved, score, spawnStar]);

      const today = new Date().toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' });

      return (
        <div style={{ width:'100%', height:'100%', display:'flex', flexDirection:'column', background:'linear-gradient(180deg,#FFF8E1 0%,#FFF3CD 100%)', position:'relative', overflow:'hidden', padding:'12px' }}>
          {/* Floating stars */}
          {stars.map(s => (
            <div key={s.id} style={{ position:'absolute', left:s.x+'%', top:s.y+'%', fontSize:'22px', animation:'floatStar 1.2s ease-out forwards', pointerEvents:'none', zIndex:20 }}>⭐</div>
          ))}

          {/* Header */}
          <div style={{ textAlign:'center', marginBottom:'8px' }}>
            <div style={{ fontSize:'20px', fontWeight:'800', color:'#E65100' }}>📔 Pet Diary</div>
            <div style={{ fontSize:'12px', color:'#BF360C' }}>{today}</div>
            <div style={{ fontSize:'13px', color:'#F57F17', fontWeight:'600' }}>Score: {score} pts</div>
          </div>

          {/* Journal page */}
          <div style={{ flex:1, background:'#FFFDE7', borderRadius:'16px', border:'2px solid #FFCC02', padding:'12px', position:'relative', overflow:'hidden', marginBottom:'8px', boxShadow:'0 4px 16px rgba(255,193,7,0.2)' }}>
            {/* Ruled lines */}
            {[0,1,2,3,4,5,6].map(i => (
              <div key={i} style={{ position:'absolute', left:'12px', right:'12px', top: (40 + i*34)+'px', height:'1px', background:'#FFECB3' }} />
            ))}
            <div style={{ fontSize:'13px', color:'#BF360C', fontWeight:'700', marginBottom:'8px' }}>Today's Activities:</div>
            {/* Placed stickers */}
            <div style={{ display:'flex', flexWrap:'wrap', gap:'8px', padding:'4px' }}>
              {placed.map((s, i) => (
                <div key={s.key} style={{ display:'flex', flexDirection:'column', alignItems:'center', animation:'stampIn 0.4s ease-out', background:'#FFF9C4', borderRadius:'12px', padding:'8px 12px', border:'2px solid #FFD54F', minWidth:'60px' }}>
                  <span style={{ fontSize:'28px' }}>{s.emoji}</span>
                  <span style={{ fontSize:'10px', color:'#E65100', fontWeight:'600', marginTop:'2px' }}>{s.label}</span>
                </div>
              ))}
              {placed.length === 0 && (
                <div style={{ color:'#FFCC02', fontSize:'13px', fontStyle:'italic', padding:'8px' }}>Tap stickers below to fill your diary!</div>
              )}
            </div>

            {/* Saved state: happy pet */}
            {saved && (
              <div style={{ position:'absolute', right:'16px', bottom:'8px', fontSize:'56px', animation:'petBounce 0.8s ease infinite' }}>😺</div>
            )}
          </div>

          {/* Save button */}
          {canSave && !saved && (
            <button onClick={handleSave} style={{ background:'#F57F17', color:'#fff', border:'none', borderRadius:'16px', padding:'12px', fontSize:'16px', fontWeight:'700', marginBottom:'8px', cursor:'pointer', boxShadow:'0 4px 12px rgba(245,127,23,0.4)' }}>
              💾 Save Diary! ({placed.length}/6 stickers)
            </button>
          )}
          {!canSave && (
            <div style={{ textAlign:'center', fontSize:'12px', color:'#F57F17', marginBottom:'8px' }}>Add {3 - placed.length} more sticker{3 - placed.length !== 1 ? 's' : ''} to unlock Save!</div>
          )}

          {/* Sticker tray */}
          <div style={{ background:'#FFF3E0', borderRadius:'16px', padding:'10px', border:'2px solid #FFCC02' }}>
            <div style={{ fontSize:'11px', color:'#BF360C', fontWeight:'700', marginBottom:'6px', textAlign:'center' }}>Sticker Tray - Tap to stamp!</div>
            <div style={{ display:'flex', justifyContent:'space-around', flexWrap:'wrap', gap:'4px' }}>
              {ALL_STICKERS.map(s => {
                const used = usedIds.has(s.id);
                return (
                  <button key={s.id} onClick={() => handleStickerTap(s)} disabled={used || saved} style={{ display:'flex', flexDirection:'column', alignItems:'center', background: used ? '#E0E0E0' : '#FFF', border: used ? '2px solid #CCC' : '2px solid #FFD54F', borderRadius:'12px', padding:'6px 10px', cursor: used ? 'not-allowed' : 'pointer', opacity: used ? 0.5 : 1, minWidth:'52px' }}>
                    <span style={{ fontSize:'24px' }}>{s.emoji}</span>
                    <span style={{ fontSize:'9px', color:'#E65100', marginTop:'2px' }}>{s.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(React.createElement(PetDiaryGame));
  </script>
</body>
</html>`;
}

export const PetDiaryGameScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { updateBestScore } = usePetDiary();
  const { triggerAd } = useGameAdTrigger('pet-diary');
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
            <Text style={styles.overlayTitle}>📔 {score} pts!</Text>
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
                <Text style={styles.playAgainText}>{t('petDiary.gameOver.watchAd')}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.playAgainButton}
              onPress={() => { setGameOver(false); setScore(0); setAdRewardPending(false); navigation.replace('PetDiaryGame'); }}
              disabled={adRewardPending}
              accessibilityRole="button"
            >
              <Text style={styles.playAgainText}>{t('petDiary.gameOver.playAgain')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF8E1' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8 },
  backText: { fontSize: 16, color: '#F57F17', fontWeight: '600' },
  scoreText: { fontSize: 18, fontWeight: 'bold', color: '#F57F17' },
  gameArea: { flex: 1 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  overlayCard: { backgroundColor: '#fff', borderRadius: 24, padding: 32, alignItems: 'center', minWidth: 260, gap: 12 },
  overlayTitle: { fontSize: 24, fontWeight: '800', color: '#F57F17', marginBottom: 8 },
  playAgainButton: { backgroundColor: '#F57F17', borderRadius: 16, paddingVertical: 12, paddingHorizontal: 32, width: '100%', alignItems: 'center' },
  playAgainText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
