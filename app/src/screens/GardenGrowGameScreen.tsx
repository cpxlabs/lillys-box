import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Modal, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useGardenGrow } from '../context/GardenGrowContext';
import { ScreenNavigationProp } from '../types/navigation';
import { useGameBack } from '../hooks/useGameBack';
import { useGameAdTrigger } from '../components/GameAdWrapper';

type Props = { navigation: ScreenNavigationProp<'GardenGrowGame'> };

type PlotState = 'empty' | 'seeded' | 'sprout' | 'growing' | 'bloom' | 'harvest';

interface Plot {
  state: PlotState;
  plant: string;
  watered: boolean;
  sunned: boolean;
  weeded: boolean;
  growth: number; // 0-100
}

const PLANTS = [
  { seed: '🌱', sprout: '🌿', growing: '🌻', bloom: '🌸', harvest: '💐', name: 'Flower' },
  { seed: '🌱', sprout: '🥦', growing: '🥦', bloom: '🥦', harvest: '🥦', name: 'Veggie' },
  { seed: '🌱', sprout: '🍓', growing: '🍓', bloom: '🍓', harvest: '🍓', name: 'Berry' },
  { seed: '🌱', sprout: '🌵', growing: '🌵', bloom: '🌵', harvest: '🌵', name: 'Cactus' },
];

const GRID_SIZE = 4;

function emptyPlot(): Plot {
  return { state: 'empty', plant: '', watered: false, sunned: false, weeded: false, growth: 0 };
}

export const GardenGrowGameScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { updateBestScore } = useGardenGrow();
  const { triggerAd } = useGameAdTrigger('garden-grow');
  const [adRewardPending, setAdRewardPending] = useState(false);
  const [plots, setPlots] = useState<Plot[]>(Array(GRID_SIZE * GRID_SIZE).fill(null).map(emptyPlot));
  const [selectedPlant, setSelectedPlant] = useState(0);
  const [selectedTool, setSelectedTool] = useState<'plant' | 'water' | 'sun' | 'weed'>('plant');
  const [score, setScore] = useState(0);
  const [harvested, setHarvested] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const actOnPlot = useCallback((index: number) => {
    setPlots(prev => {
      const next = [...prev.map(p => ({ ...p }))];
      const plot = next[index];

      if (selectedTool === 'plant' && plot.state === 'empty') {
        plot.state = 'seeded';
        plot.plant = PLANTS[selectedPlant].seed;
        plot.growth = 10;
        return next;
      }
      if (selectedTool === 'water' && plot.state !== 'empty') {
        if (!plot.watered) { plot.watered = true; plot.growth = Math.min(100, plot.growth + 25); }
      }
      if (selectedTool === 'sun' && plot.state !== 'empty') {
        if (!plot.sunned) { plot.sunned = true; plot.growth = Math.min(100, plot.growth + 25); }
      }
      if (selectedTool === 'weed' && plot.state !== 'empty') {
        if (!plot.weeded) { plot.weeded = true; plot.growth = Math.min(100, plot.growth + 25); }
      }

      // Update growth state
      const p = PLANTS[selectedPlant];
      if (plot.growth >= 25 && plot.state === 'seeded') plot.state = 'sprout';
      if (plot.growth >= 50 && plot.state === 'sprout') plot.state = 'growing';
      if (plot.growth >= 75 && plot.state === 'growing') plot.state = 'bloom';
      if (plot.growth >= 100 && plot.state === 'bloom') {
        plot.state = 'harvest';
        const newScore = score + 50;
        setScore(newScore);
        setHarvested(h => {
          const nh = h + 1;
          updateBestScore(newScore);
          if (nh >= 6) setTimeout(() => setGameOver(true), 300);
          return nh;
        });
      }

      // Set emoji
      if (plot.state === 'seeded') plot.plant = p.seed;
      else if (plot.state === 'sprout') plot.plant = p.sprout;
      else if (plot.state === 'growing') plot.plant = p.growing;
      else if (plot.state === 'bloom') plot.plant = p.bloom;
      else if (plot.state === 'harvest') plot.plant = p.harvest;

      return next;
    });
  }, [selectedTool, selectedPlant, score, updateBestScore]);

  const harvest = useCallback((index: number) => {
    setPlots(prev => {
      const next = [...prev.map(p => ({ ...p }))];
      if (next[index].state === 'harvest') {
        next[index] = emptyPlot();
      }
      return next;
    });
  }, []);

  const restart = () => { setPlots(Array(GRID_SIZE * GRID_SIZE).fill(null).map(emptyPlot)); setScore(0); setHarvested(0); setGameOver(false); };
  const handleBack = useGameBack(navigation);

  const TOOLS = [
    { id: 'plant' as const, emoji: '🌱', label: 'Plant' },
    { id: 'water' as const, emoji: '💧', label: 'Water' },
    { id: 'sun' as const, emoji: '☀️', label: 'Sun' },
    { id: 'weed' as const, emoji: '✂️', label: 'Weed' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}><Text style={styles.backText}>← {t('common.back')}</Text></TouchableOpacity>
        <Text style={styles.title}>{t('gardenGrow.game.title')}</Text>
        <Text style={styles.scoreText}>🌻 {harvested} | ⭐ {score}</Text>
      </View>

      <View style={styles.garden}>
        {plots.map((plot, i) => (
          <TouchableOpacity
            key={`plot-${i}-${plot.plant}`}
            style={[styles.plot, plot.state !== 'empty' && styles.plotActive, plot.state === 'harvest' && styles.plotHarvest]}
            onPress={() => plot.state === 'harvest' ? harvest(i) : actOnPlot(i)}
          >
            {plot.state === 'empty' ? (
              <Text style={styles.emptyPlot}>🟫</Text>
            ) : (
              <>
                <Text style={styles.plantEmoji}>{plot.plant}</Text>
                <View style={styles.growthBar}>
                  <View style={[styles.growthFill, { width: `${plot.growth}%` as any }]} />
                </View>
                <Text style={styles.indicators}>
                  {plot.watered ? '💧' : ''}{plot.sunned ? '☀️' : ''}{plot.weeded ? '✂️' : ''}
                </Text>
              </>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.controls}>
        <View style={styles.tools}>
          {TOOLS.map(tool => (
            <TouchableOpacity key={tool.id} style={[styles.toolBtn, selectedTool === tool.id && styles.toolSelected]} onPress={() => setSelectedTool(tool.id)}>
              <Text style={styles.toolEmoji}>{tool.emoji}</Text>
              <Text style={styles.toolLabel}>{tool.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {selectedTool === 'plant' && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.plantSelector}>
            {PLANTS.map((p, i) => (
              <TouchableOpacity key={p.name} style={[styles.plantBtn, selectedPlant === i && styles.plantSelected]} onPress={() => setSelectedPlant(i)}>
                <Text style={styles.plantBtnEmoji}>{p.harvest}</Text>
                <Text style={styles.plantBtnName}>{p.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      <Modal visible={gameOver} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalEmoji}>🌻</Text>
            {!adRewardPending && (
              <TouchableOpacity style={styles.modalButton} onPress={async () => {
                setAdRewardPending(true);
                const reward = await triggerAd('game_ended', score);
                setAdRewardPending(false);
              }}><Text style={styles.modalButtonText}>🎬 {t('gardenGrow.game.playAgain')}</Text></TouchableOpacity>
            )}
            <TouchableOpacity style={styles.modalButton} onPress={restart} disabled={adRewardPending}><Text style={styles.modalButtonText}>{t('gardenGrow.game.playAgain')}</Text></TouchableOpacity>
            <TouchableOpacity style={styles.modalSecondaryButton} onPress={handleBack} disabled={adRewardPending}><Text style={styles.modalSecondaryText}>{t('common.back')}</Text></TouchableOpacity>
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
  title: { fontSize: 18, fontWeight: '700', color: '#1b5e20' },
  scoreText: { fontSize: 14, fontWeight: '700', color: '#1b5e20' },
  garden: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', padding: 16, gap: 8, justifyContent: 'center', alignContent: 'center' },
  plot: { width: '22%', aspectRatio: 1, borderRadius: 12, backgroundColor: '#795548', justifyContent: 'center', alignItems: 'center', padding: 4 },
  plotActive: { backgroundColor: '#a5d6a7' },
  plotHarvest: { backgroundColor: '#ffe082', borderWidth: 2, borderColor: '#ffd600' },
  emptyPlot: { fontSize: 30 },
  plantEmoji: { fontSize: 28 },
  growthBar: { height: 4, width: '100%', backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 2, marginTop: 2 },
  growthFill: { height: '100%', backgroundColor: '#4caf50', borderRadius: 2 },
  indicators: { fontSize: 10, marginTop: 2 },
  controls: { backgroundColor: '#c8e6c9', padding: 12 },
  tools: { flexDirection: 'row', gap: 8, justifyContent: 'center', marginBottom: 8 },
  toolBtn: { flex: 1, backgroundColor: '#fff', borderRadius: 12, paddingVertical: 8, alignItems: 'center' },
  toolSelected: { backgroundColor: '#4caf50' },
  toolEmoji: { fontSize: 24 },
  toolLabel: { fontSize: 10, color: '#555', fontWeight: '600' },
  plantSelector: { flexDirection: 'row', gap: 8, paddingTop: 4 },
  plantBtn: { backgroundColor: '#fff', borderRadius: 12, padding: 10, alignItems: 'center', width: 72 },
  plantSelected: { backgroundColor: '#4caf50' },
  plantBtnEmoji: { fontSize: 28 },
  plantBtnName: { fontSize: 10, color: '#555', marginTop: 2 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', borderRadius: 24, padding: 32, alignItems: 'center', width: '80%' },
  modalEmoji: { fontSize: 64, marginBottom: 12 },
  modalTitle: { fontSize: 28, fontWeight: '800', color: '#333', marginBottom: 8 },
  modalScore: { fontSize: 18, color: '#4caf50', fontWeight: '700', marginBottom: 24 },
  modalButton: { backgroundColor: '#4caf50', paddingVertical: 14, paddingHorizontal: 40, borderRadius: 24, marginBottom: 12, width: '100%', alignItems: 'center' },
  modalButtonText: { fontSize: 18, fontWeight: '700', color: '#fff' },
  modalSecondaryButton: { paddingVertical: 10 },
  modalSecondaryText: { fontSize: 16, color: '#888' },
});
