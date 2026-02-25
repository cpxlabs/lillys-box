import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useMultiPlayerMuito } from '../context/MultiPlayerMuitoContext';
import { useAuth } from '../context/AuthContext';
import { ScreenNavigationProp } from '../types/navigation';

type Props = {
  navigation: ScreenNavigationProp<'MuitoResults'>;
};

export const MuitoResultsScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { user, isGuest } = useAuth();
  const { gameResult, scores, leaveRoom } = useMultiPlayerMuito();

  const myUserId = user?.id || (isGuest ? 'guest' : 'guest');
  const myScore = scores[myUserId] || 0;
  const opponentScore =
    Object.entries(scores).find(([id]) => id !== myUserId)?.[1] ?? 0;

  const iWon = gameResult?.winnerId === myUserId;
  const isTie = gameResult?.isTie ?? false;

  const handleRematch = () => {
    // Navigate back to lobby; it will call leaveRoom + connect on mount
    navigation.navigate('MuitoLobby');
  };

  const handleHome = () => {
    leaveRoom();
    navigation.navigate('MuitoHome');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* result icon */}
        <Text style={styles.resultEmoji}>{isTie ? '🤝' : iWon ? '🏆' : '😅'}</Text>

        {/* headline */}
        <Text
          style={[
            styles.resultTitle,
            iWon ? styles.resultWin : isTie ? styles.resultTie : styles.resultLose,
          ]}
        >
          {isTie
            ? t('muito.multiplayer.resultTie')
            : iWon
              ? t('muito.multiplayer.resultWin')
              : t('muito.multiplayer.resultLose')}
        </Text>

        {/* score card */}
        <View style={styles.scoresCard}>
          <View style={styles.scoreColumn}>
            <Text style={styles.scoreLabel}>{t('muito.multiplayer.you')}</Text>
            <Text style={[styles.scoreValue, iWon && styles.scoreValueHighlight]}>
              {myScore}
            </Text>
          </View>

          <Text style={styles.vsText}>vs</Text>

          <View style={styles.scoreColumn}>
            <Text style={styles.scoreLabel}>{t('muito.multiplayer.opponent')}</Text>
            <Text style={[styles.scoreValue, !iWon && !isTie && styles.scoreValueHighlight]}>
              {opponentScore}
            </Text>
          </View>
        </View>

        {/* actions */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleRematch}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel={t('muito.multiplayer.playAgain')}
        >
          <Text style={styles.primaryButtonText}>{t('muito.multiplayer.playAgain')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleHome}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel={t('muito.multiplayer.backToMenu')}
        >
          <Text style={styles.secondaryButtonText}>
            {t('muito.multiplayer.backToMenu')}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f0ff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  // ── result headline ──────────────────────────────────────────────
  resultEmoji: {
    fontSize: 80,
    marginBottom: 12,
  },
  resultTitle: {
    fontSize: 36,
    fontWeight: '800',
    marginBottom: 28,
  },
  resultWin: {
    color: '#27ae60',
  },
  resultLose: {
    color: '#e74c3c',
  },
  resultTie: {
    color: '#f39c12',
  },
  // ── scores ────────────────────────────────────────────────────────
  scoresCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 32,
    gap: 24,
    marginBottom: 36,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  scoreColumn: {
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 14,
    color: '#888',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 40,
    fontWeight: '800',
    color: '#333',
  },
  scoreValueHighlight: {
    color: '#9b59b6',
  },
  vsText: {
    fontSize: 18,
    color: '#aaa',
    fontWeight: '700',
  },
  // ── buttons ───────────────────────────────────────────────────────
  primaryButton: {
    backgroundColor: '#9b59b6',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 32,
    shadowColor: '#9b59b6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 12,
  },
  primaryButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  secondaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  secondaryButtonText: {
    fontSize: 16,
    color: '#888',
    fontWeight: '600',
  },
});
