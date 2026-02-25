import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Animated, Modal, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSnackStack } from '../context/SnackStackContext';
import { ScreenNavigationProp } from '../types/navigation';
import { useGameBack } from '../hooks/useGameBack';

type Props = { navigation: ScreenNavigationProp<'SnackStackGame'> };
const { width: SW } = Dimensions.get('window');
const FOODS = ['🍔', '🍕', '🥪', '🥞', '🍩', '🍣', '🌮', '🧁', '🍎', '🥕'];
const PLATE_WIDTH = 80;
const ITEM_SIZE = 50;

interface StackItem { emoji: string; offset: number; }

export const SnackStackGameScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { updateBestScore } = useSnackStack();

  const [stack, setStack] = useState<StackItem[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [fallingX] = useState(new Animated.Value(0));
  const [currentFood, setCurrentFood] = useState(FOODS[0]);
  const [fallAnim] = useState(new Animated.Value(0));
  const swingAnim = useRef(new Animated.Value(0)).current;
  const swingDirection = useRef(1);
  const gameActiveRef = useRef(true);
  const stackRef = useRef<StackItem[]>([]);
  const fallingXRef = useRef(0);
  const swingLoop = useRef<any>(null);

  const startSwing = useCallback(() => {
    if (!gameActiveRef.current) return;
    const swing = () => {
      if (!gameActiveRef.current) return;
      swingDirection.current *= -1;
      Animated.timing(swingAnim, {
        toValue: swingDirection.current * (SW / 2 - 40),
        duration: 1000 + stack.length * 100,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished && gameActiveRef.current) swing();
      });
    };
    swing();
  }, [swingAnim, stack.length]);

  useEffect(() => {
    gameActiveRef.current = true;
    setCurrentFood(FOODS[Math.floor(Math.random() * FOODS.length)]);
    startSwing();
    const listener = swingAnim.addListener(({ value }) => { fallingXRef.current = value; });
    return () => { gameActiveRef.current = false; swingAnim.removeListener(listener); };
  }, [startSwing, swingAnim]);

  const drop = useCallback(() => {
    if (!gameActiveRef.current || gameOver) return;
    const xOffset = fallingXRef.current;
    const absOffset = Math.abs(xOffset);
    const isPerfect = absOffset < 15;
    const isGood = absOffset < 40;

    if (!isGood && stackRef.current.length === 0) {
      // Missed plate
      updateBestScore(score);
      setGameOver(true);
      return;
    }

    const pts = isPerfect ? 30 : isGood ? 10 : 5;
    const newItem: StackItem = { emoji: currentFood, offset: xOffset / 3 };
    const newStack = [...stackRef.current, newItem];
    stackRef.current = newStack;
    setStack(newStack);
    setScore(prev => prev + pts);

    if (newStack.length >= 10) {
      updateBestScore(score + pts);
      setGameOver(true);
      return;
    }

    // Check stability - topple if too uneven
    const totalOffset = newStack.reduce((sum, item) => sum + Math.abs(item.offset), 0);
    if (totalOffset > 120) {
      updateBestScore(score + pts);
      setGameOver(true);
      return;
    }

    setCurrentFood(FOODS[Math.floor(Math.random() * FOODS.length)]);
  }, [gameOver, currentFood, score, updateBestScore]);

  const restart = () => {
    setStack([]); stackRef.current = [];
    setScore(0); setGameOver(false);
    gameActiveRef.current = true;
    setCurrentFood(FOODS[Math.floor(Math.random() * FOODS.length)]);
    swingAnim.setValue(0);
  };

  const handleBack = useGameBack(navigation, { 
    cleanup: () => { gameActiveRef.current = false; }
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}><Text style={styles.backText}>← {t('common.back')}</Text></TouchableOpacity>
        <Text style={styles.scoreText}>{t('snackStack.game.score')}: {score}</Text>
        <Text style={styles.heightText}>{t('snackStack.game.height')}: {stack.length}</Text>
      </View>

      <View style={styles.gameArea}>
        {!gameOver && (
          <Animated.Text style={[styles.fallingFood, { transform: [{ translateX: swingAnim }] }]}>
            {currentFood}
          </Animated.Text>
        )}

        <TouchableOpacity style={styles.dropZone} onPress={drop} activeOpacity={1}>
          <View style={styles.stackArea}>
            {stack.map((item, i) => (
              <View key={i} style={[styles.stackItem, { marginLeft: item.offset + (SW / 2 - ITEM_SIZE / 2) }]}>
                <Text style={styles.stackEmoji}>{item.emoji}</Text>
              </View>
            ))}
            <View style={styles.plate}><Text style={styles.plateText}>🍽️</Text></View>
          </View>
          {!gameOver && <Text style={styles.tapHint}>{t('snackStack.game.tapToDrop')}</Text>}
        </TouchableOpacity>
      </View>

      <Modal visible={gameOver} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalEmoji}>{stack.length >= 10 ? '🏆' : '💥'}</Text>
            <Text style={styles.modalTitle}>{stack.length >= 10 ? t('snackStack.game.perfect') : t('snackStack.game.toppled')}</Text>
            <Text style={styles.modalScore}>{t('snackStack.game.height')}: {stack.length} | {score} pts</Text>
            <TouchableOpacity style={styles.modalButton} onPress={restart}><Text style={styles.modalButtonText}>{t('snackStack.game.playAgain')}</Text></TouchableOpacity>
            <TouchableOpacity style={styles.modalSecondaryButton} onPress={handleBack}><Text style={styles.modalSecondaryText}>{t('common.back')}</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff3e0' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#ffe0b2' },
  backText: { fontSize: 16, color: '#e65100', fontWeight: '600' },
  scoreText: { fontSize: 18, fontWeight: '700', color: '#e65100' },
  heightText: { fontSize: 16, color: '#666' },
  gameArea: { flex: 1, alignItems: 'center' },
  fallingFood: { fontSize: 48, marginTop: 40, alignSelf: 'center' },
  dropZone: { flex: 1, width: '100%', justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 20 },
  stackArea: { alignItems: 'flex-start', width: '100%' },
  stackItem: { position: 'relative' },
  stackEmoji: { fontSize: 44 },
  plate: { alignSelf: 'center', marginTop: 4 },
  plateText: { fontSize: 60 },
  tapHint: { fontSize: 16, color: '#888', marginTop: 16, marginBottom: 8 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', borderRadius: 24, padding: 32, alignItems: 'center', width: '80%' },
  modalEmoji: { fontSize: 64, marginBottom: 12 },
  modalTitle: { fontSize: 24, fontWeight: '800', color: '#333', marginBottom: 8 },
  modalScore: { fontSize: 16, color: '#ff9800', fontWeight: '700', marginBottom: 24 },
  modalButton: { backgroundColor: '#ff9800', paddingVertical: 14, paddingHorizontal: 40, borderRadius: 24, marginBottom: 12, width: '100%', alignItems: 'center' },
  modalButtonText: { fontSize: 18, fontWeight: '700', color: '#fff' },
  modalSecondaryButton: { paddingVertical: 10 },
  modalSecondaryText: { fontSize: 16, color: '#888' },
});
