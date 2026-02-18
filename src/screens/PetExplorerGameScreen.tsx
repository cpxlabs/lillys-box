import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Modal } from 'react-native';
import { useTranslation } from 'react-i18next';
import { usePetExplorer } from '../context/PetExplorerContext';
import { ScreenNavigationProp } from '../types/navigation';

type Props = { navigation: ScreenNavigationProp<'PetExplorerGame'> };

const ZONES = [
  {
    name: 'Forest', emoji: '🌳', bg: '#2d5a27',
    objects: [
      { emoji: '🍄', name: 'Mushroom', collected: false, points: 20 },
      { emoji: '🌺', name: 'Flower', collected: false, points: 15 },
      { emoji: '🐿️', name: 'Squirrel', collected: false, points: 30 },
      { emoji: '🍂', name: 'Leaf', collected: false, points: 10 },
      { emoji: '🦋', name: 'Butterfly', collected: false, points: 25 },
    ],
    quest: { text: 'Find 3 treasures', goal: 3 },
  },
  {
    name: 'Beach', emoji: '🏖️', bg: '#1a6b8a',
    objects: [
      { emoji: '🐚', name: 'Shell', collected: false, points: 20 },
      { emoji: '🦀', name: 'Crab', collected: false, points: 30 },
      { emoji: '⭐', name: 'Starfish', collected: false, points: 25 },
      { emoji: '🐠', name: 'Fish', collected: false, points: 20 },
      { emoji: '🪸', name: 'Coral', collected: false, points: 35 },
    ],
    quest: { text: 'Collect 3 beach items', goal: 3 },
  },
  {
    name: 'City', emoji: '🏙️', bg: '#374151',
    objects: [
      { emoji: '🎈', name: 'Balloon', collected: false, points: 15 },
      { emoji: '🍦', name: 'Ice Cream', collected: false, points: 20 },
      { emoji: '📦', name: 'Package', collected: false, points: 25 },
      { emoji: '🐱', name: 'Lost Cat', collected: false, points: 50 },
      { emoji: '🌻', name: 'Sunflower', collected: false, points: 20 },
    ],
    quest: { text: 'Help 3 city friends', goal: 3 },
  },
];

export const PetExplorerGameScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { updateBestScore } = usePetExplorer();
  const [zoneIndex, setZoneIndex] = useState(0);
  const [objects, setObjects] = useState(ZONES.map(z => [...z.objects]));
  const [score, setScore] = useState(0);
  const [collected, setCollected] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [petPos, setPetPos] = useState(0);

  const zone = ZONES[zoneIndex];
  const zoneObjects = objects[zoneIndex];
  const questProgress = zoneObjects.filter(o => o.collected).length;

  const interact = useCallback((objIndex: number) => {
    const obj = zoneObjects[objIndex];
    if (obj.collected) return;
    const newObjects = objects.map((zo, zi) => {
      if (zi !== zoneIndex) return zo;
      return zo.map((o, oi) => oi === objIndex ? { ...o, collected: true } : o);
    });
    setObjects(newObjects);
    const newScore = score + obj.points;
    setScore(newScore);
    const newCollected = collected + 1;
    setCollected(newCollected);
    updateBestScore(newScore);
  }, [zoneObjects, objects, zoneIndex, score, collected, updateBestScore]);

  const nextZone = useCallback(() => {
    if (zoneIndex + 1 >= ZONES.length) { setGameOver(true); } else { setZoneIndex(zi => zi + 1); }
  }, [zoneIndex]);

  const restart = () => { setZoneIndex(0); setObjects(ZONES.map(z => [...z.objects])); setScore(0); setCollected(0); setGameOver(false); setPetPos(0); };
  const handleBack = () => { if (navigation.canGoBack()) navigation.goBack(); else navigation.getParent()?.goBack(); };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: zone.bg }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}><Text style={styles.backText}>← {t('common.back')}</Text></TouchableOpacity>
        <Text style={styles.zoneText}>{zone.emoji} {zone.name}</Text>
        <Text style={styles.scoreText}>⭐ {score}</Text>
      </View>

      <View style={styles.questBar}>
        <Text style={styles.questText}>📋 {zone.quest.text}: {questProgress}/{zone.quest.goal}</Text>
      </View>

      <View style={styles.petArea}>
        <Text style={styles.petEmoji}>🐾</Text>
        <Text style={styles.petLabel}>{t('petExplorer.game.exploring')}</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.worldScroll}>
        {zoneObjects.map((obj, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.object, obj.collected && styles.objectCollected]}
            onPress={() => interact(i)}
          >
            <Text style={[styles.objectEmoji, obj.collected && styles.objectDim]}>{obj.emoji}</Text>
            <Text style={styles.objectName}>{obj.name}</Text>
            {obj.collected && <Text style={styles.checkmark}>✓</Text>}
            {!obj.collected && <Text style={styles.sparkle}>✨</Text>}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {questProgress >= zone.quest.goal && (
        <TouchableOpacity style={styles.nextBtn} onPress={nextZone}>
          <Text style={styles.nextBtnText}>{zoneIndex + 1 < ZONES.length ? `Next: ${ZONES[zoneIndex + 1].name} ${ZONES[zoneIndex + 1].emoji}` : t('petExplorer.game.finish')}</Text>
        </TouchableOpacity>
      )}

      <Modal visible={gameOver} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalEmoji}>🧭</Text>
            <Text style={styles.modalTitle}>{t('petExplorer.game.complete')}</Text>
            <Text style={styles.modalScore}>{t('petExplorer.game.score')}: {score}</Text>
            <TouchableOpacity style={styles.modalButton} onPress={restart}><Text style={styles.modalButtonText}>{t('petExplorer.game.playAgain')}</Text></TouchableOpacity>
            <TouchableOpacity style={styles.modalSecondaryButton} onPress={handleBack}><Text style={styles.modalSecondaryText}>{t('common.back')}</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: 'rgba(0,0,0,0.3)' },
  backText: { fontSize: 16, color: '#fff', fontWeight: '600' },
  zoneText: { fontSize: 18, fontWeight: '700', color: '#fff' },
  scoreText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  questBar: { backgroundColor: 'rgba(0,0,0,0.3)', paddingHorizontal: 16, paddingVertical: 8 },
  questText: { fontSize: 14, color: '#fff', fontWeight: '600' },
  petArea: { alignItems: 'center', paddingVertical: 20 },
  petEmoji: { fontSize: 60 },
  petLabel: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  worldScroll: { paddingHorizontal: 16, paddingVertical: 20, gap: 16 },
  object: { width: 100, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 16, padding: 12, alignItems: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)' },
  objectCollected: { backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' },
  objectEmoji: { fontSize: 40 },
  objectDim: { opacity: 0.5 },
  objectName: { fontSize: 12, color: '#fff', fontWeight: '600', marginTop: 4, textAlign: 'center' },
  checkmark: { fontSize: 18, color: '#4caf50', marginTop: 4 },
  sparkle: { fontSize: 16, marginTop: 4 },
  nextBtn: { margin: 16, backgroundColor: '#4caf50', borderRadius: 24, paddingVertical: 14, alignItems: 'center' },
  nextBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', borderRadius: 24, padding: 32, alignItems: 'center', width: '80%' },
  modalEmoji: { fontSize: 64, marginBottom: 12 },
  modalTitle: { fontSize: 28, fontWeight: '800', color: '#333', marginBottom: 8 },
  modalScore: { fontSize: 20, color: '#009688', fontWeight: '700', marginBottom: 24 },
  modalButton: { backgroundColor: '#009688', paddingVertical: 14, paddingHorizontal: 40, borderRadius: 24, marginBottom: 12, width: '100%', alignItems: 'center' },
  modalButtonText: { fontSize: 18, fontWeight: '700', color: '#fff' },
  modalSecondaryButton: { paddingVertical: 10 },
  modalSecondaryText: { fontSize: 16, color: '#888' },
});
