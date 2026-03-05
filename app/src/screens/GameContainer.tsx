import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { gameRegistry } from '../registry/GameRegistry';
import { logger } from '../utils/logger';

type Props = {
  route: { params: { gameId: string } };
};

export const GameContainer: React.FC<Props> = ({ route }) => {
  const { gameId } = route.params;
  const game = gameRegistry.getGame(gameId);

  if (!game || !game.navigator) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Game not available</Text>
      </View>
    );
  }

  const GameNavigator = game.navigator;
  const hasValidProviders = Array.isArray(game.providers);
  if (!hasValidProviders) {
    logger.warn('[GameContainer] Invalid providers (not an array) for game', game.id);
  }
  const providers = hasValidProviders ? game.providers : [];

  // Wrap navigator with game-specific providers (outermost first)
  let content: React.ReactElement = <GameNavigator />;
  for (let i = providers.length - 1; i >= 0; i--) {
    const Provider = providers[i];
    if (!Provider) {
      logger.warn('[GameContainer] Skipping null/undefined provider at index', i, 'for game', game.id);
      continue;
    }
    content = <Provider>{content}</Provider>;
  }

  return content;
};

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f0ff',
  },
  errorText: {
    fontSize: 18,
    color: '#333',
  },
});
