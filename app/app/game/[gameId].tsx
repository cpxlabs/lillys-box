import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { gameRegistry } from '../../src/registry/GameRegistry';
import { ErrorBoundary } from '../../src/components/ErrorBoundary';

export default function GameRoute() {
  const { gameId } = useLocalSearchParams<{ gameId: string }>();
  const router = useRouter();
  const game = gameId ? gameRegistry.getGame(gameId) : undefined;

  if (!game) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Game not found</Text>
      </View>
    );
  }

  const GameNavigator = game.navigator;

  let content: React.ReactElement = <GameNavigator />;
  for (let i = game.providers.length - 1; i >= 0; i--) {
    const Provider = game.providers[i];
    content = <Provider>{content}</Provider>;
  }

  return (
    <ErrorBoundary
      fallback={(_error, _errorInfo, retry) => (
        <View style={styles.errorContainer}>
          <Text style={styles.crashEmoji}>😿</Text>
          <Text style={styles.crashTitle}>This game crashed</Text>
          <Text style={styles.crashMessage}>
            Something went wrong in {game.name || 'this game'}.
          </Text>
          <View style={styles.buttonRow}>
            <Text style={styles.retryButton} onPress={retry}>
              Try Again
            </Text>
            <Text
              style={styles.backButton}
              onPress={() => router.back()}
            >
              Go Back
            </Text>
          </View>
        </View>
      )}
    >
      {content}
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f0ff',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#333',
  },
  crashEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  crashTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  crashMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  retryButton: {
    backgroundColor: '#9b59b6',
    color: '#fff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    fontWeight: '600',
    overflow: 'hidden',
  },
  backButton: {
    backgroundColor: '#95a5a6',
    color: '#fff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    fontWeight: '600',
    overflow: 'hidden',
  },
});
