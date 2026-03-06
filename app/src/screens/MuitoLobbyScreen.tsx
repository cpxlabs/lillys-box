import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useMultiPlayerMuito, MultiGamePhase } from '../context/MultiPlayerMuitoContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'MuitoLobby'>;

export const MuitoLobbyScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const {
    phase,
    connected,
    error,
    roomCode,
    players,
    isHost,
    opponentDisconnected,
    connect,
    createRoom,
    joinRoom,
    leaveRoom,
    startGame,
    clearError,
  } = useMultiPlayerMuito();

  const [joinCode, setJoinCode] = useState('');
  const [activeTab, setActiveTab] = useState<'host' | 'join'>('host');

  const normalizeRoomCode = (value: string) => value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();

  // Connect on mount; reset any leftover room state from a previous game
  useEffect(() => {
    leaveRoom(); // no-op if not in a room
    connect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Show server errors in the UI
  useEffect(() => {
    // error state is already exposed; nothing extra needed
  }, [error]);

  // Navigate to the game screen when the server starts the game
  useEffect(() => {
    if (phase === MultiGamePhase.PLAYING) {
      navigation.navigate('MuitoMultiGame');
    }
  }, [phase, navigation]);

  // If opponent disconnected while we were waiting, show a message
  // (opponentDisconnected resets roomCode via context, so the UI falls back to tabs)
  useEffect(() => {
    if (opponentDisconnected) {
      clearError();
    }
  }, [opponentDisconnected, clearError]);

  const handleCreateRoom = () => {
    clearError();
    createRoom();
  };

  const handleJoinRoom = () => {
    const normalizedCode = normalizeRoomCode(joinCode);
    if (!normalizedCode) {
      // inline validation — no server round-trip needed
      return;
    }
    clearError();
    joinRoom(normalizedCode);
  };

  const handleBack = () => {
    leaveRoom();
    navigation.goBack();
  };

  // ── waiting room (we have a code) ─────────────────────────────────
  if (roomCode) {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          accessibilityRole="button"
          accessibilityLabel={t('common.back')}
        >
          <Text style={styles.backText}>{t('common.back')}</Text>
        </TouchableOpacity>

        <View style={styles.content}>
          <Text style={styles.title}>{t('muito.multiplayer.lobby')}</Text>

          <View style={styles.codeCard}>
            <Text style={styles.codeLabel}>{t('muito.multiplayer.roomCode')}</Text>
            <Text style={styles.codeValue}>{roomCode}</Text>
          </View>

          <View style={styles.playersSection}>
            <Text style={styles.playersTitle}>{t('muito.multiplayer.players')}</Text>

            {players.map((p, i) => (
              <View key={p.userId} style={styles.playerRow}>
                <Text style={styles.playerName}>
                  {i === 0 && isHost
                    ? `${p.displayName} (${t('muito.multiplayer.host')})`
                    : p.displayName}
                </Text>
              </View>
            ))}

            {players.length < 2 && (
              <View style={styles.playerRow}>
                <ActivityIndicator size="small" color="#9b59b6" />
                <Text style={styles.waitingText}>
                  {t('muito.multiplayer.waitingForOpponent')}
                </Text>
              </View>
            )}
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}

          {isHost && players.length >= 2 && (
            <TouchableOpacity
              style={styles.startButton}
              onPress={startGame}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel={t('muito.multiplayer.start')}
            >
              <Text style={styles.startButtonText}>{t('muito.multiplayer.start')}</Text>
            </TouchableOpacity>
          )}

          {!isHost && players.length < 2 && (
            <Text style={styles.waitingText}>{t('muito.multiplayer.waitingForHost')}</Text>
          )}
        </View>
      </SafeAreaView>
    );
  }

  // ── create / join tabs ────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={handleBack}
        accessibilityRole="button"
        accessibilityLabel={t('common.back')}
      >
        <Text style={styles.backText}>{t('common.back')}</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>{t('muito.multiplayer.title')}</Text>

        {!connected && (
          <Text style={styles.connectingText}>{t('muito.multiplayer.connecting')}</Text>
        )}

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'host' && styles.tabActive]}
            onPress={() => setActiveTab('host')}
          >
            <Text style={[styles.tabText, activeTab === 'host' && styles.tabTextActive]}>
              {t('muito.multiplayer.host')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'join' && styles.tabActive]}
            onPress={() => setActiveTab('join')}
          >
            <Text style={[styles.tabText, activeTab === 'join' && styles.tabTextActive]}>
              {t('muito.multiplayer.join')}
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'host' ? (
          <View style={styles.tabContent}>
            <Text style={styles.description}>{t('muito.multiplayer.hostDescription')}</Text>
            <TouchableOpacity
              style={[styles.primaryButton, !connected && styles.primaryButtonDisabled]}
              onPress={handleCreateRoom}
              disabled={!connected}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel={t('muito.multiplayer.createRoom')}
            >
              <Text style={styles.primaryButtonText}>{t('muito.multiplayer.createRoom')}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.tabContent}>
            <Text style={styles.description}>{t('muito.multiplayer.joinDescription')}</Text>
            <TextInput
              style={styles.codeInput}
              value={joinCode}
              onChangeText={(value) => setJoinCode(normalizeRoomCode(value))}
              placeholder={t('muito.multiplayer.codePlaceholder')}
              autoCapitalize="characters"
              maxLength={6}
              accessibilityLabel={t('muito.multiplayer.codePlaceholder')}
            />
            <TouchableOpacity
              style={[styles.primaryButton, !connected && styles.primaryButtonDisabled]}
              onPress={handleJoinRoom}
              disabled={!connected}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel={t('muito.multiplayer.joinRoom')}
            >
              <Text style={styles.primaryButtonText}>{t('muito.multiplayer.joinRoom')}</Text>
            </TouchableOpacity>
          </View>
        )}

        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f0ff',
  },
  backButton: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  backText: {
    fontSize: 16,
    color: '#9b59b6',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    marginTop: -40,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#9b59b6',
    marginBottom: 24,
  },
  connectingText: {
    fontSize: 14,
    color: '#888',
    marginBottom: 12,
  },
  // ── tabs ──────────────────────────────────────────────────────────
  tabContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 24,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tabActive: {
    backgroundColor: '#9b59b6',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  tabTextActive: {
    color: '#fff',
  },
  // ── tab content ───────────────────────────────────────────────────
  tabContent: {
    alignItems: 'center',
    width: '100%',
  },
  description: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
    maxWidth: 280,
    lineHeight: 20,
  },
  primaryButton: {
    backgroundColor: '#9b59b6',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 32,
    shadowColor: '#9b59b6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryButtonDisabled: {
    backgroundColor: '#c9a8d8',
    shadowOpacity: 0,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  codeInput: {
    width: '100%',
    maxWidth: 240,
    height: 52,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 20,
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 4,
    color: '#333',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  // ── waiting room ──────────────────────────────────────────────────
  codeCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    alignItems: 'center',
  },
  codeLabel: {
    fontSize: 12,
    color: '#888',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  codeValue: {
    fontSize: 36,
    fontWeight: '800',
    color: '#9b59b6',
    letterSpacing: 6,
  },
  playersSection: {
    width: '100%',
    maxWidth: 300,
    marginBottom: 24,
  },
  playersTitle: {
    fontSize: 14,
    color: '#888',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  startButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 32,
    shadowColor: '#27ae60',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  startButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  waitingText: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
  },
  errorText: {
    fontSize: 14,
    color: '#e74c3c',
    textAlign: 'center',
    marginTop: 12,
    maxWidth: 280,
  },
});
