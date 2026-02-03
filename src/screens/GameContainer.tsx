import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { gameRegistry } from '../registry/GameRegistry';

type Props = {
  route: { params: { gameId: string } };
};

export const GameContainer: React.FC<Props> = ({ route }) => {
  const { gameId } = route.params;
  const game = gameRegistry.getGame(gameId);

  if (!game) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Game not found</Text>
      </View>
    );
  }

  const GameNavigator = game.navigator;

  // Wrap navigator with game-specific providers (outermost first)
  let content: React.ReactElement = <GameNavigator />;
  for (let i = game.providers.length - 1; i >= 0; i--) {
    const Provider = game.providers[i];
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
