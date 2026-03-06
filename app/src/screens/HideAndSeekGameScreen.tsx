import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Modal } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useHideAndSeek } from '../context/HideAndSeekContext';
import { ScreenNavigationProp } from '../types/navigation';
import { useGameBack } from '../hooks/useGameBack';
import { useGameAdTrigger } from '../components/GameAdWrapper';

type Props = { navigation: ScreenNavigationProp<'HideAndSeekGame'> };

const GRID_COLS = 3;
const GRID_ROWS = 3;
const TOTAL_SPOTS = GRID_COLS * GRID_ROWS;
const GAME_DURATION = 30;
const PETS_PER_ROUND = 3;

const HIDING_SPOTS = ['🌳', '🌲', '🪨', '🌻', '🪣', '📦', '🏠', '🌾', '🪴'];
const PET_EMOJIS = ['🐱', '🐶', '🐰', '🐹', '🐻'];

type SpotState = {
  hidingEmoji: string;
  petEmoji: string | null;
  revealed: boolean;
  found: boolean;
};

function generateRound(): SpotState[] {
  const spots: SpotState[] = HIDING_SPOTS.map((emoji) => ({
    hidingEmoji: emoji,
    petEmoji: null,
    revealed: false,
    found: false,
  }));

  const petIndices = new Set<number>();
  while (petIndices.size < PETS_PER_ROUND) {
    petIndices.add(Math.floor(Math.random() * TOTAL_SPOTS));
  }

  petIndices.forEach((index) => {
    spots[index].petEmoji = PET_EMOJIS[Math.floor(Math.random() * PET_EMOJIS.length)];
  });

  return spots;
}

export const HideAndSeekGameScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { updateBestScore } = useHideAndSeek();
  const { triggerAd } = useGameAdTrigger('hide-and-seek');

  const [spots, setSpots] = useState<SpotState[]>(generateRound);
  const [score, setScore] = useState(0);
  const [petsFound, setPetsFound] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [gameOver, setGameOver] = useState(false);
  const [roundPetsTotal, setRoundPetsTotal] = useState(PETS_PER_ROUND);
  const [roundPetsFound, setRoundPetsFound] = useState(0);
  const [adRewardPending, setAdRewardPending] = useState(false);

  const scoreRef = useRef(0);
  const gameActiveRef = useRef(true);

  const startNewRound = useCallback(() => {
    const newSpots = generateRound();
    setSpots(newSpots);
    setRoundPetsFound(0);
    setRoundPetsTotal(newSpots.filter((s) => s.petEmoji !== null).length);
  }, []);

  useEffect(() => {
    gameActiveRef.current = true;
    const timerI = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          gameActiveRef.current = false;
          clearInterval(timerI);
          updateBestScore(scoreRef.current);
          setGameOver(true);
        }
        return next;
      });
    }, 1000);
    return () => {
      gameActiveRef.current = false;
      clearInterval(timerI);
    };
  }, [updateBestScore]);

  const handleTap = useCallback(
    (index: number) => {
      if (!gameActiveRef.current) return;

      setSpots((prev) => {
        if (prev[index].revealed) return prev;

        const next = [...prev];
        next[index] = { ...next[index], revealed: true };

        if (next[index].petEmoji) {
          next[index].found = true;
          scoreRef.current += 10;
          setScore(scoreRef.current);
          setPetsFound((p) => p + 1);
          setRoundPetsFound((r) => {
            const newRoundFound = r + 1;
            const totalPetsInRound = next.filter((s) => s.petEmoji !== null).length;
            if (newRoundFound >= totalPetsInRound) {
              // Bonus for finding all pets in a round
              scoreRef.current += 5;
              setScore(scoreRef.current);
              // Start new round after short delay
              setTimeout(() => {
                if (gameActiveRef.current) startNewRound();
              }, 800);
            }
            return newRoundFound;
          });
        }

        return next;
      });
    },
    [startNewRound],
  );

  const restart = () => {
    setScore(0);
    setPetsFound(0);
    setTimeLeft(GAME_DURATION);
    setGameOver(false);
    setAdRewardPending(false);
    scoreRef.current = 0;
    gameActiveRef.current = true;
    startNewRound();
  };

  const handleBack = useGameBack(navigation, {
    cleanup: () => {
      gameActiveRef.current = false;
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Text style={styles.backText}>← {t('common.back')}</Text>
        </TouchableOpacity>
        <Text style={styles.scoreText}>🐾 {score}</Text>
        <Text style={styles.timerText}>{timeLeft}s</Text>
      </View>

      <View style={styles.roundInfo}>
        <Text style={styles.roundInfoText}>
          {t('hideAndSeek.game.found')}: {roundPetsFound}/{roundPetsTotal}
        </Text>
      </View>

      <View style={styles.grid}>
        {spots.map((spot, i) => (
          <TouchableOpacity
            key={`spot-${i}`}
            style={[styles.spot, spot.revealed && (spot.found ? styles.foundSpot : styles.emptySpot)]}
            onPress={() => handleTap(i)}
            activeOpacity={0.7}
            disabled={spot.revealed}
          >
            <Text style={styles.spotEmoji}>
              {spot.revealed ? (spot.petEmoji ? spot.petEmoji : '💨') : spot.hidingEmoji}
            </Text>
            {spot.found && <Text style={styles.foundLabel}>+10</Text>}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {t('hideAndSeek.game.totalFound')}: {petsFound}
        </Text>
      </View>

      <Modal visible={gameOver} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalEmoji}>🫣</Text>
            <Text style={styles.modalTitle}>{t('hideAndSeek.game.gameOver')}</Text>
            <Text style={styles.modalScore}>
              {t('hideAndSeek.game.score')}: {score}
            </Text>
            <Text style={styles.modalPets}>
              {t('hideAndSeek.game.petsFound')}: {petsFound}
            </Text>

            {!adRewardPending && (
              <>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={async () => {
                    setAdRewardPending(true);
                    const reward = await triggerAd('game_ended', score);
                    if (reward > 0) {
                      const newScore = score + reward;
                      setScore(newScore);
                      updateBestScore(newScore);
                    }
                    setAdRewardPending(false);
                  }}
                  disabled={adRewardPending}
                >
                  <Text style={styles.modalButtonText}>
                    {adRewardPending
                      ? t('common.loading', { defaultValue: 'Loading...' })
                      : '🎬 Watch Ad to Double!'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.modalButton} onPress={restart}>
                  <Text style={styles.modalButtonText}>{t('hideAndSeek.game.playAgain')}</Text>
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
  container: { flex: 1, backgroundColor: '#e8f5e9' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backText: { fontSize: 16, color: '#4caf50', fontWeight: '600' },
  scoreText: { fontSize: 24, fontWeight: '800', color: '#2e7d32' },
  timerText: { fontSize: 18, fontWeight: '700', color: '#333' },
  roundInfo: { alignItems: 'center', paddingBottom: 8 },
  roundInfoText: { fontSize: 16, color: '#666', fontWeight: '600' },
  grid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
    alignContent: 'center',
    justifyContent: 'center',
  },
  spot: {
    width: '28%',
    aspectRatio: 1,
    borderRadius: 16,
    backgroundColor: '#a5d6a7',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#66bb6a',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  foundSpot: {
    backgroundColor: '#fff9c4',
    borderColor: '#ffd54f',
  },
  emptySpot: {
    backgroundColor: '#e0e0e0',
    borderColor: '#bdbdbd',
  },
  spotEmoji: { fontSize: 40 },
  foundLabel: {
    position: 'absolute',
    top: 4,
    right: 8,
    fontSize: 14,
    fontWeight: '800',
    color: '#4caf50',
  },
  footer: { padding: 16, alignItems: 'center' },
  footerText: { fontSize: 16, color: '#666' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    width: '80%',
  },
  modalEmoji: { fontSize: 64, marginBottom: 12 },
  modalTitle: { fontSize: 28, fontWeight: '800', color: '#333', marginBottom: 8 },
  modalScore: { fontSize: 20, color: '#4caf50', fontWeight: '700', marginBottom: 4 },
  modalPets: { fontSize: 16, color: '#888', marginBottom: 20 },
  modalButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 24,
    marginBottom: 12,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: { fontSize: 18, fontWeight: '700', color: '#fff' },
  modalSecondaryButton: { paddingVertical: 10 },
  modalSecondaryText: { fontSize: 16, color: '#888' },
});
