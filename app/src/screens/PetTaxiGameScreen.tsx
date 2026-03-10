import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Animated, Modal, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { usePetTaxi } from '../context/PetTaxiContext';
import { ScreenNavigationProp } from '../types/navigation';
import { useGameBack } from '../hooks/useGameBack';

type Props = { navigation: ScreenNavigationProp<'PetTaxiGame'> };
const { width: SW } = Dimensions.get('window');
const LANES = 3;
const LANE_WIDTH = SW / LANES;
const PASSENGER_EMOJIS = ['🐱', '🐶', '🐰', '🦊', '🐻'];
const DESTINATION_EMOJIS = ['🏫', '🏥', '🏡', '🌳', '🛒'];
const GAME_DURATION = 60;

interface Passenger { emoji: string; destEmoji: string; destName: string; lane: number; y: Animated.Value; id: number; }

let passId = 0;

export const PetTaxiGameScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { updateBestScore } = usePetTaxi();

  const [carLane, setCarLane] = useState(1);
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [currentPassenger, setCurrentPassenger] = useState<Passenger | null>(null);
  const [score, setScore] = useState(0);
  const [delivered, setDelivered] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [gameOver, setGameOver] = useState(false);
  const [_coins, setCoins] = useState(0);
  const [gameKey, setGameKey] = useState(0);

  const scoreRef = useRef(0);
  const gameActiveRef = useRef(true);
  const carLaneRef = useRef(1);
  const currentPassRef = useRef<Passenger | null>(null);

  const spawnPassenger = useCallback(() => {
    if (!gameActiveRef.current) return;
    const lane = Math.floor(Math.random() * LANES);
    const emojiIdx = Math.floor(Math.random() * PASSENGER_EMOJIS.length);
    const destIdx = Math.floor(Math.random() * DESTINATION_EMOJIS.length);
    const y = new Animated.Value(-60);
    const p: Passenger = { emoji: PASSENGER_EMOJIS[emojiIdx], destEmoji: DESTINATION_EMOJIS[destIdx], destName: ['School', 'Hospital', 'Home', 'Park', 'Shop'][destIdx], lane, y, id: passId++ };
    setPassengers(prev => [...prev, p]);

    Animated.timing(y, { toValue: 300, duration: 3000, useNativeDriver: true }).start(() => {
      setPassengers(prev => prev.filter(pp => pp.id !== p.id));
    });
  }, []);

  const pickupPassenger = useCallback((p: Passenger) => {
    if (carLaneRef.current !== p.lane || currentPassRef.current) return;
    currentPassRef.current = p;
    setCurrentPassenger(p);
    setPassengers(prev => prev.filter(pp => pp.id !== p.id));
  }, []);

  const deliver = useCallback((destIndex: number) => {
    if (!currentPassRef.current) return;
    if (DESTINATION_EMOJIS[destIndex] !== currentPassRef.current.destEmoji) return;
    const pts = 50;
    scoreRef.current += pts;
    setScore(scoreRef.current);
    setCoins(c => c + 10);
    setDelivered(d => d + 1);
    currentPassRef.current = null;
    setCurrentPassenger(null);
  }, []);

  const moveLeft = () => { const nl = Math.max(0, carLaneRef.current - 1); carLaneRef.current = nl; setCarLane(nl); };
  const moveRight = () => { const nl = Math.min(LANES - 1, carLaneRef.current + 1); carLaneRef.current = nl; setCarLane(nl); };

  useEffect(() => {
    gameActiveRef.current = true;
    const spawnI = setInterval(spawnPassenger, 2000);
    const timerI = setInterval(() => {
      setTimeLeft(prev => {
        const next = prev - 1;
        if (next <= 0) { gameActiveRef.current = false; clearInterval(spawnI); clearInterval(timerI); updateBestScore(scoreRef.current); setGameOver(true); }
        return next;
      });
    }, 1000);
    return () => { gameActiveRef.current = false; clearInterval(spawnI); clearInterval(timerI); };
  }, [gameKey, spawnPassenger, updateBestScore]);

  const restart = () => { setCarLane(1); carLaneRef.current = 1; setPassengers([]); setCurrentPassenger(null); currentPassRef.current = null; setScore(0); setDelivered(0); setTimeLeft(GAME_DURATION); setGameOver(false); setCoins(0); scoreRef.current = 0; gameActiveRef.current = true; setGameKey(k => k + 1); };
  const handleBack = useGameBack(navigation, { 
    cleanup: () => { gameActiveRef.current = false; }
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}><Text style={styles.backText}>← {t('common.back')}</Text></TouchableOpacity>
        <Text style={styles.scoreText}>🚕 {score}</Text>
        <Text style={styles.timerText}>{timeLeft}s</Text>
      </View>

      {currentPassenger && (
        <View style={styles.passengerBar}>
          <Text style={styles.passengerText}>{currentPassenger.emoji} → {currentPassenger.destEmoji} {currentPassenger.destName}</Text>
        </View>
      )}

      <View style={styles.road}>
        {[0, 1, 2].map(lane => (
          <View key={lane} style={styles.lane}>
            <View style={styles.laneLines} />
          </View>
        ))}
        {passengers.map(p => (
          <Animated.View key={p.id} style={[styles.passengerOnRoad, { left: p.lane * LANE_WIDTH + LANE_WIDTH / 2 - 20, transform: [{ translateY: p.y }] }]}>
            <TouchableOpacity onPress={() => pickupPassenger(p)}>
              <Text style={styles.passEmoji}>{p.emoji}</Text>
              <Text style={styles.passDestEmoji}>{p.destEmoji}</Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
        <View style={[styles.car, { left: carLane * LANE_WIDTH + LANE_WIDTH / 2 - 30 }]}>
          <Text style={styles.carEmoji}>🚕</Text>
          {currentPassenger && <Text style={styles.inCarEmoji}>{currentPassenger.emoji}</Text>}
        </View>
      </View>

      {currentPassenger && (
        <View style={styles.destinations}>
          <Text style={styles.destLabel}>{t('petTaxi.game.deliver')}:</Text>
          <View style={styles.destRow}>
            {DESTINATION_EMOJIS.map((d, i) => (
              <TouchableOpacity key={d} style={[styles.destBtn, currentPassenger.destEmoji === d && styles.destBtnTarget]} onPress={() => deliver(i)}>
                <Text style={styles.destEmoji}>{d}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlBtn} onPress={moveLeft}><Text style={styles.controlText}>◀</Text></TouchableOpacity>
        <Text style={styles.laneIndicator}>Lane {carLane + 1}/3</Text>
        <TouchableOpacity style={styles.controlBtn} onPress={moveRight}><Text style={styles.controlText}>▶</Text></TouchableOpacity>
      </View>

      <Modal visible={gameOver} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalEmoji}>🚕</Text>
            <Text style={styles.modalTitle}>{t('petTaxi.game.gameOver')}</Text>
            <Text style={styles.modalScore}>{delivered} {t('petTaxi.game.delivered')} | {score} pts</Text>
            <TouchableOpacity style={styles.modalButton} onPress={restart}><Text style={styles.modalButtonText}>{t('petTaxi.game.playAgain')}</Text></TouchableOpacity>
            <TouchableOpacity style={styles.modalSecondaryButton} onPress={handleBack}><Text style={styles.modalSecondaryText}>{t('common.back')}</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#37474f' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#263238' },
  backText: { fontSize: 16, color: '#ffca28', fontWeight: '600' },
  scoreText: { fontSize: 18, fontWeight: '700', color: '#fff' },
  timerText: { fontSize: 16, fontWeight: '700', color: '#ffca28' },
  passengerBar: { backgroundColor: '#ffca28', paddingVertical: 8, paddingHorizontal: 16 },
  passengerText: { fontSize: 16, fontWeight: '700', color: '#333', textAlign: 'center' },
  road: { flex: 1, flexDirection: 'row', position: 'relative', overflow: 'hidden' },
  lane: { flex: 1, borderRightWidth: 2, borderRightColor: 'rgba(255,255,255,0.3)', position: 'relative' },
  laneLines: { flex: 1 },
  passengerOnRoad: { position: 'absolute', top: 0, alignItems: 'center' },
  passEmoji: { fontSize: 28 },
  passDestEmoji: { fontSize: 16 },
  car: { position: 'absolute', bottom: 20, width: 60, alignItems: 'center' },
  carEmoji: { fontSize: 48 },
  inCarEmoji: { fontSize: 20, position: 'absolute', top: 0, right: -10 },
  destinations: { padding: 12, backgroundColor: '#263238' },
  destLabel: { fontSize: 14, color: '#fff', marginBottom: 8, textAlign: 'center' },
  destRow: { flexDirection: 'row', gap: 8, justifyContent: 'center' },
  destBtn: { width: 56, height: 56, borderRadius: 12, backgroundColor: '#37474f', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#546e7a' },
  destBtnTarget: { backgroundColor: '#ffca28', borderColor: '#f57f17' },
  destEmoji: { fontSize: 28 },
  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, backgroundColor: '#263238', gap: 24 },
  controlBtn: { backgroundColor: '#ffca28', borderRadius: 12, paddingVertical: 12, paddingHorizontal: 24 },
  controlText: { fontSize: 24, fontWeight: '800', color: '#333' },
  laneIndicator: { fontSize: 16, color: '#fff', fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', borderRadius: 24, padding: 32, alignItems: 'center', width: '80%' },
  modalEmoji: { fontSize: 64, marginBottom: 12 },
  modalTitle: { fontSize: 28, fontWeight: '800', color: '#333', marginBottom: 8 },
  modalScore: { fontSize: 18, color: '#ffca28', fontWeight: '700', marginBottom: 24 },
  modalButton: { backgroundColor: '#ffca28', paddingVertical: 14, paddingHorizontal: 40, borderRadius: 24, marginBottom: 12, width: '100%', alignItems: 'center' },
  modalButtonText: { fontSize: 18, fontWeight: '700', color: '#333' },
  modalSecondaryButton: { paddingVertical: 10 },
  modalSecondaryText: { fontSize: 16, color: '#888' },
});
