import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Modal, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { usePetExplorer } from '../context/PetExplorerContext';
import { ScreenNavigationProp } from '../types/navigation';
import { useGameBack } from '../hooks/useGameBack';
import { useGameAdTrigger } from '../components/GameAdWrapper';

type Props = { navigation: ScreenNavigationProp<'PetExplorerGame'> };

type ZoneId = 'meadow' | 'forest' | 'cave' | 'lake';

type WildPet = {
  name: string;
  emoji: string;
  baseCatchRate: number;
  minLevel: number;
  zones: ZoneId[];
};

type EncounterState = {
  pet: WildPet;
  zone: ZoneId;
  catchBoost: number;
};

type BalancePreset = 'fast' | 'normal' | 'hard';

type BalanceConfig = {
  baseEncounterChance: number;
  zoneEncounterBonus: number;
  encounterPityPerStep: number;
  encounterPityCap: number;
  catchLevelPenaltyPerLevel: number;
  catchTrainerBonusPerLevel: number;
  catchTrainerBonusCap: number;
  catchPityPerFail: number;
  catchPityCap: number;
  minCatchRate: number;
  maxCatchRate: number;
  xpPerLevelMultiplier: number;
  snackCap: number;
  startingSnacks: number;
  snackGainOnLevelUp: number;
  snackBoost: number;
  snackBoostCap: number;
  catchDelayMs: number;
};

const WORLD_SIZE = 7;
const PARTY_LIMIT = 6;

const BALANCE_PRESETS: Record<BalancePreset, BalanceConfig> = {
  fast: {
    baseEncounterChance: 0.24,
    zoneEncounterBonus: 0.05,
    encounterPityPerStep: 0.03,
    encounterPityCap: 0.35,
    catchLevelPenaltyPerLevel: 0.04,
    catchTrainerBonusPerLevel: 0.03,
    catchTrainerBonusCap: 0.24,
    catchPityPerFail: 0.06,
    catchPityCap: 0.24,
    minCatchRate: 0.22,
    maxCatchRate: 0.96,
    xpPerLevelMultiplier: 3,
    snackCap: 8,
    startingSnacks: 5,
    snackGainOnLevelUp: 1,
    snackBoost: 0.2,
    snackBoostCap: 0.5,
    catchDelayMs: 800,
  },
  normal: {
    baseEncounterChance: 0.19,
    zoneEncounterBonus: 0.04,
    encounterPityPerStep: 0.025,
    encounterPityCap: 0.28,
    catchLevelPenaltyPerLevel: 0.05,
    catchTrainerBonusPerLevel: 0.025,
    catchTrainerBonusCap: 0.2,
    catchPityPerFail: 0.05,
    catchPityCap: 0.2,
    minCatchRate: 0.17,
    maxCatchRate: 0.94,
    xpPerLevelMultiplier: 4,
    snackCap: 6,
    startingSnacks: 4,
    snackGainOnLevelUp: 1,
    snackBoost: 0.15,
    snackBoostCap: 0.45,
    catchDelayMs: 1000,
  },
  hard: {
    baseEncounterChance: 0.15,
    zoneEncounterBonus: 0.03,
    encounterPityPerStep: 0.02,
    encounterPityCap: 0.2,
    catchLevelPenaltyPerLevel: 0.06,
    catchTrainerBonusPerLevel: 0.02,
    catchTrainerBonusCap: 0.14,
    catchPityPerFail: 0.04,
    catchPityCap: 0.16,
    minCatchRate: 0.12,
    maxCatchRate: 0.9,
    xpPerLevelMultiplier: 5,
    snackCap: 5,
    startingSnacks: 3,
    snackGainOnLevelUp: 1,
    snackBoost: 0.12,
    snackBoostCap: 0.35,
    catchDelayMs: 1200,
  },
};

const ACTIVE_BALANCE_PRESET: BalancePreset = 'fast';
const ACTIVE_BALANCE = BALANCE_PRESETS[ACTIVE_BALANCE_PRESET];

const ZONE_LABELS: Record<ZoneId, string> = {
  meadow: 'petExplorer.game.zones.meadow',
  forest: 'petExplorer.game.zones.forest',
  cave: 'petExplorer.game.zones.cave',
  lake: 'petExplorer.game.zones.lake',
};

const WILD_PETS: WildPet[] = [
  { name: 'Leaf Cat', emoji: '🐱', baseCatchRate: 0.72, minLevel: 1, zones: ['meadow', 'forest'] },
  { name: 'Puddle Pup', emoji: '🐶', baseCatchRate: 0.64, minLevel: 1, zones: ['meadow', 'lake'] },
  { name: 'Bunny Bolt', emoji: '🐰', baseCatchRate: 0.6, minLevel: 2, zones: ['forest'] },
  { name: 'Stone Turtle', emoji: '🐢', baseCatchRate: 0.5, minLevel: 2, zones: ['cave', 'lake'] },
  { name: 'Echo Bat', emoji: '🦇', baseCatchRate: 0.42, minLevel: 3, zones: ['cave'] },
  { name: 'Spark Mouse', emoji: '🐭', baseCatchRate: 0.45, minLevel: 3, zones: ['forest', 'cave'] },
  { name: 'River Finch', emoji: '🐦', baseCatchRate: 0.52, minLevel: 2, zones: ['lake'] },
  { name: 'Moon Fox', emoji: '🦊', baseCatchRate: 0.34, minLevel: 4, zones: ['forest', 'cave'] },
  { name: 'Aqua Draco', emoji: '🐉', baseCatchRate: 0.24, minLevel: 5, zones: ['lake'] },
];

const getZoneByPosition = (x: number, y: number): ZoneId => {
  if (x <= 2 && y <= 2) return 'meadow';
  if (x >= 4 && y <= 2) return 'forest';
  if (x <= 2 && y >= 4) return 'cave';
  return 'lake';
};

const getTileEmoji = (zone: ZoneId): string => {
  switch (zone) {
    case 'meadow':
      return '🌿';
    case 'forest':
      return '🌲';
    case 'cave':
      return '🪨';
    case 'lake':
      return '💧';
    default:
      return '▫️';
  }
};

const clamp = (value: number, min: number, max: number): number => Math.max(min, Math.min(max, value));

const getCatchRate = (encounter: EncounterState, playerLevel: number, failedCatchStreak: number, balance: BalanceConfig): number => {
  const levelPenalty = Math.max(0, encounter.pet.minLevel - playerLevel) * balance.catchLevelPenaltyPerLevel;
  const trainerBonus = Math.min(balance.catchTrainerBonusCap, Math.max(0, playerLevel - 1) * balance.catchTrainerBonusPerLevel);
  const pityBonus = Math.min(balance.catchPityCap, failedCatchStreak * balance.catchPityPerFail);

  return clamp(
    encounter.pet.baseCatchRate + encounter.catchBoost + trainerBonus + pityBonus - levelPenalty,
    balance.minCatchRate,
    balance.maxCatchRate
  );
};

export const PetExplorerGameScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { updateBestScore } = usePetExplorer();
  const { triggerAd } = useGameAdTrigger('pet-explorer');

  const [adRewardPending, setAdRewardPending] = useState(false);
  const [playerPos, setPlayerPos] = useState({ x: 3, y: 3 });
  const [caughtPets, setCaughtPets] = useState<Set<string>>(new Set());
  const [currentEncounter, setCurrentEncounter] = useState<EncounterState | null>(null);
  const [isCatching, setIsCatching] = useState(false);
  const [steps, setSteps] = useState(0);
  const [playerLevel, setPlayerLevel] = useState(1);
  const [playerXp, setPlayerXp] = useState(0);
  const [snacks, setSnacks] = useState(ACTIVE_BALANCE.startingSnacks);
  const [failedCatchStreak, setFailedCatchStreak] = useState(0);
  const [stepsWithoutEncounter, setStepsWithoutEncounter] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const currentZone = useMemo(() => getZoneByPosition(playerPos.x, playerPos.y), [playerPos.x, playerPos.y]);

  const gainXp = useCallback((amount: number) => {
    let level = playerLevel;
    let xp = playerXp + amount;

    while (xp >= level * ACTIVE_BALANCE.xpPerLevelMultiplier) {
      xp -= level * ACTIVE_BALANCE.xpPerLevelMultiplier;
      level += 1;
    }

    setPlayerXp(xp);
    if (level !== playerLevel) {
      setPlayerLevel(level);
      setSnacks((prev) => Math.min(ACTIVE_BALANCE.snackCap, prev + ACTIVE_BALANCE.snackGainOnLevelUp));
      Alert.alert(t('petExplorer.game.levelUp', { level }));
    }
  }, [playerLevel, playerXp, t]);

  const trySpawnEncounter = useCallback((zone: ZoneId) => {
    const zoneBonus = zone === 'cave' || zone === 'lake' ? ACTIVE_BALANCE.zoneEncounterBonus : 0;
    const pityBonus = Math.min(ACTIVE_BALANCE.encounterPityCap, stepsWithoutEncounter * ACTIVE_BALANCE.encounterPityPerStep);
    const chance = clamp(ACTIVE_BALANCE.baseEncounterChance + zoneBonus + pityBonus, 0.05, 0.75);

    if (Math.random() > chance) return;

    const options = WILD_PETS.filter((pet) => pet.minLevel <= playerLevel + 1 && pet.zones.includes(zone));
    if (options.length === 0) return;

    const pet = options[Math.floor(Math.random() * options.length)];
    setCurrentEncounter({ pet, zone, catchBoost: 0 });
    setStepsWithoutEncounter(0);
  }, [playerLevel, stepsWithoutEncounter]);

  const movePlayer = useCallback((dx: number, dy: number) => {
    if (currentEncounter || gameOver) return;

    const newX = Math.max(0, Math.min(WORLD_SIZE - 1, playerPos.x + dx));
    const newY = Math.max(0, Math.min(WORLD_SIZE - 1, playerPos.y + dy));

    if (newX === playerPos.x && newY === playerPos.y) return; // No movement

    setPlayerPos({ x: newX, y: newY });
    setSteps((s) => s + 1);
    gainXp(1);
    setStepsWithoutEncounter((s) => s + 1);
    trySpawnEncounter(getZoneByPosition(newX, newY));
  }, [playerPos, currentEncounter, gameOver, gainXp, trySpawnEncounter]);

  const tryCatch = useCallback(async () => {
    if (!currentEncounter || isCatching) return;
    if (caughtPets.size >= PARTY_LIMIT) {
      Alert.alert(t('petExplorer.game.fullTeam'));
      return;
    }

    setIsCatching(true);

    // Simulate catching animation/delay
    await new Promise((resolve) => setTimeout(resolve, ACTIVE_BALANCE.catchDelayMs));

    const catchRate = getCatchRate(currentEncounter, playerLevel, failedCatchStreak, ACTIVE_BALANCE);
    const success = Math.random() < catchRate;

    if (success) {
      setFailedCatchStreak(0);
      const alreadyOwned = caughtPets.has(currentEncounter.pet.name);

      if (!alreadyOwned) {
        setCaughtPets((prev) => new Set([...prev, currentEncounter.pet.name]));
        gainXp(2);
        Alert.alert(t('petExplorer.game.caught', { pet: currentEncounter.pet.name }));
      } else {
        gainXp(1);
        Alert.alert(t('petExplorer.game.alreadyOwned', { pet: currentEncounter.pet.name }));
      }
    } else {
      setFailedCatchStreak((s) => s + 1);
      Alert.alert(t('petExplorer.game.escaped', { pet: currentEncounter.pet.name }));
    }

    setCurrentEncounter(null);
    setIsCatching(false);

    const finalTeamSize = caughtPets.size + (success && !caughtPets.has(currentEncounter.pet.name) ? 1 : 0);
    if (finalTeamSize >= PARTY_LIMIT) {
      setGameOver(true);
      updateBestScore(finalTeamSize);
    }
  }, [currentEncounter, isCatching, caughtPets, playerLevel, failedCatchStreak, gainXp, updateBestScore, t]);

  const useSnack = useCallback(() => {
    if (!currentEncounter) return;
    if (snacks <= 0) {
      Alert.alert(t('petExplorer.game.noSnacks'));
      return;
    }

    setSnacks((prev) => prev - 1);
    setCurrentEncounter((prev) => (
      prev
        ? { ...prev, catchBoost: clamp(prev.catchBoost + ACTIVE_BALANCE.snackBoost, 0, ACTIVE_BALANCE.snackBoostCap) }
        : prev
    ));
    Alert.alert(t('petExplorer.game.snackUsed'));
  }, [currentEncounter, snacks, t]);

  const runAway = useCallback(() => {
    setCurrentEncounter(null);
  }, []);

  const restart = () => {
    setPlayerPos({ x: 3, y: 3 });
    setCaughtPets(new Set());
    setCurrentEncounter(null);
    setIsCatching(false);
    setSteps(0);
    setPlayerLevel(1);
    setPlayerXp(0);
    setSnacks(ACTIVE_BALANCE.startingSnacks);
    setFailedCatchStreak(0);
    setStepsWithoutEncounter(0);
    setGameOver(false);
  };

  const handleBack = useGameBack(navigation);

  const renderWorld = () => {
    const tiles = [];
    for (let y = 0; y < WORLD_SIZE; y++) {
      for (let x = 0; x < WORLD_SIZE; x++) {
        const isPlayer = x === playerPos.x && y === playerPos.y;
        const tileZone = getZoneByPosition(x, y);
        tiles.push(
          <View key={`${x}-${y}`} style={[styles.tile, isPlayer && styles.playerTile]}>
            {isPlayer ? <Text style={styles.player}>🧭</Text> : <Text style={styles.tileEmoji}>{getTileEmoji(tileZone)}</Text>}
          </View>
        );
      }
    }
    return tiles;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}><Text style={styles.backText}>← {t('common.back')}</Text></TouchableOpacity>
        <Text style={styles.scoreText}>{t('petExplorer.game.team')}: {caughtPets.size}/{PARTY_LIMIT}</Text>
        <Text style={styles.stepsText}>{t('petExplorer.game.level')}: {playerLevel}</Text>
        <Text style={styles.stepsText}>👣 {steps}</Text>
      </View>

      <View style={styles.metaBar}>
        <Text style={styles.metaText}>{t('petExplorer.game.zone')}: {t(ZONE_LABELS[currentZone])}</Text>
        <Text style={styles.metaText}>{t('petExplorer.game.xp')}: {playerXp}/{playerLevel * ACTIVE_BALANCE.xpPerLevelMultiplier}</Text>
        <Text style={styles.metaText}>🍪 {snacks}</Text>
      </View>

      <View style={styles.world}>
        {renderWorld()}
      </View>

      <View style={styles.controls}>
        <View style={styles.controlRow}>
          <TouchableOpacity style={styles.controlBtn} onPress={() => movePlayer(0, -1)}>
            <Text style={styles.controlText}>↑</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.controlRow}>
          <TouchableOpacity style={styles.controlBtn} onPress={() => movePlayer(-1, 0)}>
            <Text style={styles.controlText}>←</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlBtn} onPress={() => movePlayer(1, 0)}>
            <Text style={styles.controlText}>→</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.controlRow}>
          <TouchableOpacity style={styles.controlBtn} onPress={() => movePlayer(0, 1)}>
            <Text style={styles.controlText}>↓</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.caughtPets}>
        <Text style={styles.caughtTitle}>{t('petExplorer.home.bestScore')}:</Text>
        <View style={styles.petList}>
          {WILD_PETS.slice(0, PARTY_LIMIT + 2).map((pet) => (
            <Text key={pet.name} style={[styles.petItem, caughtPets.has(pet.name) && styles.petCaught]}>
              {pet.emoji}
            </Text>
          ))}
        </View>
      </View>

      {/* Encounter Modal */}
      <Modal visible={!!currentEncounter} transparent animationType="fade">
        <View style={styles.encounterOverlay}>
          <View style={styles.encounterModal}>
            <Text style={styles.encounterTitle}>
              {t('petExplorer.game.encounter', { pet: currentEncounter?.pet.name })}
            </Text>
            <Text style={styles.encounterPet}>{currentEncounter?.pet.emoji}</Text>
            <Text style={styles.encounterMeta}>
              {t('petExplorer.game.zone')}: {currentEncounter ? t(ZONE_LABELS[currentEncounter.zone]) : ''}
            </Text>
            <Text style={styles.encounterMeta}>
              {t('petExplorer.game.odds')}: {currentEncounter ? Math.round(getCatchRate(currentEncounter, playerLevel, failedCatchStreak, ACTIVE_BALANCE) * 100) : 0}%
            </Text>
            
            {!isCatching ? (
              <View style={styles.encounterActions}>
                <TouchableOpacity style={styles.encounterBtn} onPress={tryCatch}>
                  <Text style={styles.encounterBtnText}>{t('petExplorer.game.catch')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.encounterBtnSnack} onPress={useSnack}>
                  <Text style={styles.encounterBtnText}>{t('petExplorer.game.snack')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.encounterBtnSecondary} onPress={runAway}>
                  <Text style={styles.encounterBtnSecondaryText}>{t('petExplorer.game.run')}</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.catching}>
                <Text style={styles.catchingText}>{t('petExplorer.game.catchAttempt')}</Text>
                <Text style={styles.catchingAnimation}>🎯⚾</Text>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* Game Over Modal */}
      <Modal visible={gameOver} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalEmoji}>🏆</Text>
            <Text style={styles.modalTitle}>{t('petExplorer.game.complete')}</Text>
            <Text style={styles.modalScore}>{t('petExplorer.game.score')}: {caughtPets.size}</Text>
            
            {!adRewardPending && (
              <>
                <TouchableOpacity 
                  style={styles.modalButton} 
                  onPress={async () => {
                    setAdRewardPending(true);
                    const reward = await triggerAd('game_ended', caughtPets.size);
                    if (reward > 0) {
                      // Could add bonus pets or something
                    }
                    setAdRewardPending(false);
                  }}
                  disabled={adRewardPending}
                >
                  <Text style={styles.modalButtonText}>🎬 Watch Ad for Bonus!</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.modalButton} onPress={restart}>
                  <Text style={styles.modalButtonText}>{t('petExplorer.game.playAgain')}</Text>
                </TouchableOpacity>
              </>
            )}
            
            <TouchableOpacity style={styles.modalSecondaryButton} onPress={handleBack}>
              <Text style={styles.modalSecondaryText}>{t('common.back')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#0f0f23', borderBottomWidth: 3, borderBottomColor: '#ffd700' },
  backText: { fontSize: 13, color: '#78c850', fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 },
  scoreText: { fontSize: 13, fontWeight: '800', color: '#ffd700', textTransform: 'uppercase', letterSpacing: 1 },
  stepsText: { fontSize: 12, fontWeight: '700', color: '#8899aa', letterSpacing: 0.5 },
  metaBar: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: '#16213e', paddingVertical: 8, borderBottomWidth: 2, borderBottomColor: '#2a3f5f' },
  metaText: { color: '#78c850', fontWeight: '700', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 },
  world: { flexDirection: 'row', flexWrap: 'wrap', alignSelf: 'center', width: 350, height: 350, marginTop: 16, borderRadius: 4, overflow: 'hidden', borderWidth: 3, borderColor: '#ffd700' },
  tile: { width: `${100 / WORLD_SIZE}%`, height: `${100 / WORLD_SIZE}%`, justifyContent: 'center', alignItems: 'center', backgroundColor: '#16213e', borderWidth: 1, borderColor: '#0f0f23' },
  tileEmoji: { fontSize: 16, opacity: 0.7 },
  playerTile: { backgroundColor: '#ee1515' },
  player: { fontSize: 18 },
  controls: { marginTop: 16, alignItems: 'center' },
  controlRow: { flexDirection: 'row', gap: 12, marginBottom: 8 },
  controlBtn: { width: 56, height: 44, backgroundColor: '#2a2a4a', borderRadius: 4, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#4a4a7a' },
  controlText: { color: '#ffd700', fontSize: 20, fontWeight: '900' },
  caughtPets: { marginTop: 10, paddingHorizontal: 16, paddingBottom: 12 },
  caughtTitle: { color: '#78c850', fontWeight: '800', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1, fontSize: 12 },
  petList: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  petItem: { fontSize: 24, opacity: 0.28 },
  petCaught: { opacity: 1 },
  encounterOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'center', alignItems: 'center' },
  encounterModal: { width: '82%', backgroundColor: '#16213e', borderRadius: 4, borderWidth: 3, borderColor: '#ffd700', padding: 20, alignItems: 'center' },
  encounterTitle: { fontSize: 20, color: '#ffd700', fontWeight: '900', textAlign: 'center', textTransform: 'uppercase', letterSpacing: 1 },
  encounterPet: { fontSize: 64, marginVertical: 8 },
  encounterMeta: { fontSize: 12, fontWeight: '700', color: '#78c850', textTransform: 'uppercase', letterSpacing: 0.5 },
  encounterActions: { width: '100%', marginTop: 14, gap: 8 },
  encounterBtn: { backgroundColor: '#ee1515', borderRadius: 4, borderWidth: 2, borderColor: '#ff4444', paddingVertical: 12, alignItems: 'center' },
  encounterBtnSnack: { backgroundColor: '#f57c00', borderRadius: 4, borderWidth: 2, borderColor: '#ffa040', paddingVertical: 12, alignItems: 'center' },
  encounterBtnText: { color: '#fff', fontWeight: '900', fontSize: 14, textTransform: 'uppercase', letterSpacing: 1 },
  encounterBtnSecondary: { backgroundColor: '#2a2a4a', borderRadius: 4, borderWidth: 2, borderColor: '#4a4a7a', paddingVertical: 12, alignItems: 'center' },
  encounterBtnSecondaryText: { color: '#8899aa', fontWeight: '800', fontSize: 14, textTransform: 'uppercase', letterSpacing: 1 },
  catching: { marginTop: 12, alignItems: 'center' },
  catchingText: { fontSize: 14, color: '#ffd700', marginBottom: 8, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 },
  catchingAnimation: { fontSize: 28 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#16213e', borderRadius: 4, borderWidth: 3, borderColor: '#ffd700', padding: 32, alignItems: 'center', width: '80%' },
  modalEmoji: { fontSize: 64, marginBottom: 12 },
  modalTitle: { fontSize: 24, fontWeight: '900', color: '#ffd700', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 2 },
  modalScore: { fontSize: 20, color: '#78c850', fontWeight: '800', marginBottom: 24, textTransform: 'uppercase', letterSpacing: 1 },
  modalButton: { backgroundColor: '#ee1515', paddingVertical: 14, paddingHorizontal: 40, borderRadius: 4, borderWidth: 2, borderColor: '#ff4444', marginBottom: 12, width: '100%', alignItems: 'center' },
  modalButtonText: { fontSize: 16, fontWeight: '900', color: '#fff', textTransform: 'uppercase', letterSpacing: 1 },
  modalSecondaryButton: { paddingVertical: 10 },
  modalSecondaryText: { fontSize: 14, color: '#5a6a7a', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
});
