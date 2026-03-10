import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Modal } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useWordBubbles } from '../context/WordBubblesContext';
import { ScreenNavigationProp } from '../types/navigation';
import { useGameBack } from '../hooks/useGameBack';
import { useGameAdTrigger } from '../components/GameAdWrapper';

type Props = { navigation: ScreenNavigationProp<'WordBubblesGame'> };

const WORDS = [
  { word: 'CAT', emoji: '🐱', hint: 'A furry pet that meows' },
  { word: 'DOG', emoji: '🐶', hint: 'A loyal pet that barks' },
  { word: 'SUN', emoji: '☀️', hint: 'Bright star in the sky' },
  { word: 'STAR', emoji: '⭐', hint: 'Twinkles at night' },
  { word: 'FISH', emoji: '🐟', hint: 'Swims in water' },
  { word: 'BIRD', emoji: '🐦', hint: 'Flies in the sky' },
  { word: 'TREE', emoji: '🌳', hint: 'Has leaves and trunk' },
  { word: 'RAIN', emoji: '🌧️', hint: 'Falls from clouds' },
  { word: 'MOON', emoji: '🌙', hint: 'Glows at night' },
  { word: 'FROG', emoji: '🐸', hint: 'Jumps and croaks' },
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export const WordBubblesGameScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { updateBestScore } = useWordBubbles();
  const { triggerAd } = useGameAdTrigger('word-bubbles');
  const [adRewardPending, setAdRewardPending] = useState(false);

  const [wordIndex, setWordIndex] = useState(0);
  const [letters, setLetters] = useState(() => shuffle(WORDS[0].word.split('')));
  const [tapped, setTapped] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [shake, setShake] = useState(false);

  const currentWord = WORDS[wordIndex];
  const _answer = tapped.map(i => letters[i]).join('');

  const tapLetter = useCallback((index: number) => {
    if (tapped.includes(index)) return;
    const newTapped = [...tapped, index];
    const newAnswer = newTapped.map(i => letters[i]).join('');
    setTapped(newTapped);

    if (newAnswer.length === currentWord.word.length) {
      if (newAnswer === currentWord.word) {
        const pts = 100;
        const newScore = score + pts;
        setScore(newScore);
        setCorrect(true);
        setTimeout(() => {
          setCorrect(false);
          if (wordIndex + 1 >= WORDS.length) {
            updateBestScore(newScore);
            setGameOver(true);
          } else {
            const nextIndex = wordIndex + 1;
            setWordIndex(nextIndex);
            setLetters(shuffle(WORDS[nextIndex].word.split('')));
            setTapped([]);
          }
        }, 800);
      } else {
        setShake(true);
        setTimeout(() => { setShake(false); setTapped([]); }, 600);
      }
    }
  }, [tapped, letters, currentWord, score, wordIndex, updateBestScore]);

  const handleBack = useGameBack(navigation);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}><Text style={styles.backText}>← {t('common.back')}</Text></TouchableOpacity>
        <Text style={styles.progress}>{wordIndex + 1}/{WORDS.length}</Text>
        <Text style={styles.scoreText}>{score} pts</Text>
      </View>

      <View style={styles.wordCard}>
        <Text style={styles.wordEmoji}>{currentWord.emoji}</Text>
        <Text style={styles.wordHint}>{currentWord.hint}</Text>
      </View>

      <View style={[styles.answerSlots, shake && styles.shake]}>
        {currentWord.word.split('').map((_, i) => (
          <View key={`slot-${i}`} style={[styles.slot, tapped[i] !== undefined && styles.slotFilled, correct && styles.slotCorrect]}>
            <Text style={styles.slotLetter}>{tapped[i] !== undefined ? letters[tapped[i]] : ''}</Text>
          </View>
        ))}
      </View>

      {correct && <Text style={styles.correctText}>✓ {t('wordBubbles.game.correct')}!</Text>}

      <View style={styles.bubbles}>
        {letters.map((letter, i) => (
          <TouchableOpacity
            key={`bubble-${letter}-${i}`}
            style={[styles.bubble, tapped.includes(i) && styles.bubbleTapped]}
            onPress={() => tapLetter(i)}
            disabled={tapped.includes(i)}
          >
            <Text style={styles.bubbleLetter}>{letter}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.clearBtn} onPress={() => setTapped([])}>
        <Text style={styles.clearText}>{t('wordBubbles.game.clear')}</Text>
      </TouchableOpacity>

      <Modal visible={gameOver} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalEmoji}>🔤</Text>
            <Text style={styles.modalTitle}>{t('wordBubbles.game.complete')}</Text>
            <Text style={styles.modalScore}>{t('wordBubbles.game.score')}: {score}</Text>
            {!adRewardPending && (
              <TouchableOpacity style={styles.modalButton} onPress={async () => {
                setAdRewardPending(true);
                const _reward = await triggerAd('game_ended', score);
                setAdRewardPending(false);
              }}><Text style={styles.modalButtonText}>🎬 {t('common.watchAdForReward')}</Text></TouchableOpacity>
            )}
            <TouchableOpacity style={styles.modalButton} onPress={handleBack} disabled={adRewardPending}><Text style={styles.modalButtonText}>{t('common.menu')}</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e8f5e9' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#a5d6a7' },
  backText: { fontSize: 16, color: '#1b5e20', fontWeight: '600' },
  progress: { fontSize: 16, fontWeight: '700', color: '#1b5e20' },
  scoreText: { fontSize: 16, fontWeight: '700', color: '#1b5e20' },
  wordCard: { alignItems: 'center', padding: 24 },
  wordEmoji: { fontSize: 80, marginBottom: 8 },
  wordHint: { fontSize: 16, color: '#555', textAlign: 'center' },
  answerSlots: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginVertical: 20, paddingHorizontal: 16 },
  shake: { opacity: 0.8 },
  slot: { width: 52, height: 52, borderRadius: 10, borderWidth: 3, borderColor: '#4caf50', justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  slotFilled: { backgroundColor: '#c8e6c9' },
  slotCorrect: { backgroundColor: '#4caf50', borderColor: '#2e7d32' },
  slotLetter: { fontSize: 28, fontWeight: '800', color: '#1b5e20' },
  correctText: { textAlign: 'center', fontSize: 22, fontWeight: '800', color: '#4caf50', marginBottom: 8 },
  bubbles: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12, paddingHorizontal: 20 },
  bubble: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#4caf50', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 4 },
  bubbleTapped: { backgroundColor: '#a5d6a7', opacity: 0.4 },
  bubbleLetter: { fontSize: 28, fontWeight: '800', color: '#fff' },
  clearBtn: { marginTop: 16, alignSelf: 'center', paddingVertical: 10, paddingHorizontal: 24, backgroundColor: '#ef9a9a', borderRadius: 20 },
  clearText: { fontSize: 16, fontWeight: '700', color: '#b71c1c' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', borderRadius: 24, padding: 32, alignItems: 'center', width: '80%' },
  modalEmoji: { fontSize: 64, marginBottom: 12 },
  modalTitle: { fontSize: 28, fontWeight: '800', color: '#333', marginBottom: 8 },
  modalScore: { fontSize: 20, color: '#4caf50', fontWeight: '700', marginBottom: 24 },
  modalButton: { backgroundColor: '#4caf50', paddingVertical: 14, paddingHorizontal: 40, borderRadius: 24, width: '100%', alignItems: 'center' },
  modalButtonText: { fontSize: 18, fontWeight: '700', color: '#fff' },
});
