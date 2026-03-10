import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Modal } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useShapeSorter } from '../context/ShapeSorterContext';
import { ScreenNavigationProp } from '../types/navigation';
import { useGameBack } from '../hooks/useGameBack';
import { useGameAdTrigger } from '../components/GameAdWrapper';

type Props = { navigation: ScreenNavigationProp<'ShapeSorterGame'> };

const SHAPES = [
  { id: 'circle', emoji: '⭕', name: 'Circle' },
  { id: 'square', emoji: '🟥', name: 'Square' },
  { id: 'triangle', emoji: '🔺', name: 'Triangle' },
  { id: 'star', emoji: '⭐', name: 'Star' },
  { id: 'heart', emoji: '❤️', name: 'Heart' },
  { id: 'diamond', emoji: '💎', name: 'Diamond' },
];

const ROUND_SHAPES = 6;

function generateRound(): Array<{ shape: typeof SHAPES[0]; solved: boolean }> {
  const shuffled = [...SHAPES].sort(() => Math.random() - 0.5).slice(0, ROUND_SHAPES);
  return shuffled.map(shape => ({ shape, solved: false }));
}

export const ShapeSorterGameScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { updateBestScore } = useShapeSorter();
  const { triggerAd } = useGameAdTrigger('shape-sorter');
  const [adRewardPending, setAdRewardPending] = useState(false);

  const [targets, setTargets] = useState(() => generateRound());
  const [fallingShapes, setFallingShapes] = useState(() => generateRound().map(t => t.shape));
  const [selectedShape, setSelectedShape] = useState<typeof SHAPES[0] | null>(null);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState('');

  const selectShape = useCallback((shape: typeof SHAPES[0]) => {
    setSelectedShape(shape);
  }, []);

  const dropInHole = useCallback((targetShape: typeof SHAPES[0]) => {
    if (!selectedShape) return;
    if (selectedShape.id === targetShape.id) {
      setScore(prev => prev + 50);
      setFeedback('✓ Perfect!');
      setTargets(prev => prev.map(t => t.shape.id === targetShape.id ? { ...t, solved: true } : t));
      setFallingShapes(prev => prev.filter(s => s.id !== selectedShape.id));
      setSelectedShape(null);

      const allSolved = targets.every(t => t.shape.id === targetShape.id || t.solved);
      if (allSolved) {
        const newRound = round + 1;
        setRound(newRound);
        if (newRound > 3) {
          const finalScore = score + 50;
          updateBestScore(finalScore);
          setTimeout(() => setGameOver(true), 500);
        } else {
          setTimeout(() => {
            setTargets(generateRound());
            setFallingShapes(generateRound().map(t => t.shape));
          }, 500);
        }
      }
    } else {
      setScore(prev => Math.max(0, prev - 10));
      setFeedback('✗ Try again!');
    }
    setTimeout(() => setFeedback(''), 600);
  }, [selectedShape, targets, round, score, updateBestScore]);

  const restart = () => { setTargets(generateRound()); setFallingShapes(generateRound().map(t => t.shape)); setSelectedShape(null); setScore(0); setRound(1); setGameOver(false); };
  const handleBack = useGameBack(navigation);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}><Text style={styles.backText}>← {t('common.back')}</Text></TouchableOpacity>
        <Text style={styles.scoreText}>{score} pts</Text>
        <Text style={styles.roundText}>{t('shapeSorter.game.round')} {round}/3</Text>
      </View>
      {feedback ? <Text style={styles.feedback}>{feedback}</Text> : null}

      <Text style={styles.sectionTitle}>{t('shapeSorter.game.holes')}</Text>
      <View style={styles.holesRow}>
        {targets.map((target, _i) => (
          <TouchableOpacity
            key={target.shape.id}
            style={[styles.hole, target.solved && styles.holeSolved]}
            onPress={() => dropInHole(target.shape)}
            disabled={target.solved}
          >
            {target.solved ? <Text style={styles.holeEmoji}>{target.shape.emoji}</Text> : <Text style={styles.holeOutline}>{target.shape.emoji}</Text>}
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>{t('shapeSorter.game.shapes')}</Text>
      <View style={styles.shapesRow}>
        {fallingShapes.map((shape, _i) => (
          <TouchableOpacity
            key={shape.id}
            style={[styles.shapeItem, selectedShape?.id === shape.id && styles.selectedShape]}
            onPress={() => selectShape(shape)}
          >
            <Text style={styles.shapeEmoji}>{shape.emoji}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {selectedShape && (
        <View style={styles.selectedInfo}>
          <Text style={styles.selectedText}>{t('shapeSorter.game.selected')}: {selectedShape.emoji} {selectedShape.name}</Text>
          <Text style={styles.selectedHint}>{t('shapeSorter.game.tapHole')}</Text>
        </View>
      )}

      <Modal visible={gameOver} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalEmoji}>🧩</Text>
            <Text style={styles.modalTitle}>{t('shapeSorter.game.complete')}</Text>
            <Text style={styles.modalScore}>{t('shapeSorter.game.score')}: {score}</Text>
            {!adRewardPending && (
              <TouchableOpacity style={styles.modalButton} onPress={async () => {
                setAdRewardPending(true);
                const _reward = await triggerAd('game_ended', score);
                setAdRewardPending(false);
              }}><Text style={styles.modalButtonText}>🎬 {t('shapeSorter.game.playAgain')}</Text></TouchableOpacity>
            )}
            <TouchableOpacity style={styles.modalButton} onPress={restart} disabled={adRewardPending}><Text style={styles.modalButtonText}>{t('shapeSorter.game.playAgain')}</Text></TouchableOpacity>
            <TouchableOpacity style={styles.modalSecondaryButton} onPress={handleBack} disabled={adRewardPending}><Text style={styles.modalSecondaryText}>{t('common.back')}</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3e5f5' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#ce93d8' },
  backText: { fontSize: 16, color: '#fff', fontWeight: '600' },
  scoreText: { fontSize: 20, fontWeight: '800', color: '#fff' },
  roundText: { fontSize: 16, color: '#fff' },
  feedback: { textAlign: 'center', fontSize: 22, fontWeight: '800', color: '#9c27b0', paddingVertical: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#666', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  holesRow: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 12, justifyContent: 'center' },
  hole: { width: 80, height: 80, borderRadius: 16, backgroundColor: '#e1bee7', borderWidth: 3, borderStyle: 'dashed', borderColor: '#9c27b0', justifyContent: 'center', alignItems: 'center' },
  holeSolved: { backgroundColor: '#ce93d8', borderStyle: 'solid', borderColor: '#4caf50' },
  holeEmoji: { fontSize: 40 },
  holeOutline: { fontSize: 40, opacity: 0.3 },
  shapesRow: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 12, justifyContent: 'center', marginTop: 8 },
  shapeItem: { width: 80, height: 80, borderRadius: 16, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  selectedShape: { backgroundColor: '#ce93d8', transform: [{ scale: 1.1 }] },
  shapeEmoji: { fontSize: 40 },
  selectedInfo: { alignItems: 'center', paddingVertical: 16 },
  selectedText: { fontSize: 18, fontWeight: '700', color: '#9c27b0' },
  selectedHint: { fontSize: 14, color: '#888', marginTop: 4 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', borderRadius: 24, padding: 32, alignItems: 'center', width: '80%' },
  modalEmoji: { fontSize: 64, marginBottom: 12 },
  modalTitle: { fontSize: 28, fontWeight: '800', color: '#333', marginBottom: 8 },
  modalScore: { fontSize: 20, color: '#9c27b0', fontWeight: '700', marginBottom: 24 },
  modalButton: { backgroundColor: '#9c27b0', paddingVertical: 14, paddingHorizontal: 40, borderRadius: 24, marginBottom: 12, width: '100%', alignItems: 'center' },
  modalButtonText: { fontSize: 18, fontWeight: '700', color: '#fff' },
  modalSecondaryButton: { paddingVertical: 10 },
  modalSecondaryText: { fontSize: 16, color: '#888' },
});
