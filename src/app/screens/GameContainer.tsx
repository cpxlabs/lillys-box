import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  BackHandler,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { gameRegistry, Game } from '../registry';
import { logger } from '../../shared/utils/logger';
import { useResponsive } from '../hooks/useResponsive';

/**
 * Props for GameContainer component
 */
type Props = NativeStackScreenProps<any, 'GameContainer'>;

/**
 * GameContainer Component
 *
 * This is the wrapper component that loads and displays a selected game.
 * Responsibilities:
 * 1. Retrieve the game from the registry using gameId
 * 2. Validate the game exists and is accessible
 * 3. Apply game-specific providers (context wrappers)
 * 4. Render the game's navigator
 * 5. Handle loading and error states
 * 6. Manage back navigation
 *
 * @component
 * @example
 * ```tsx
 * <Stack.Screen
 *   name="GameContainer"
 *   component={GameContainer}
 *   options={{ gestureEnabled: false }}
 * />
 * ```
 */
export const GameContainer: React.FC<Props> = ({ navigation, route }) => {
  // ========== State Management ==========
  const { gameId } = route.params;
  const [game, setGame] = useState<Game | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { spacing, fs } = useResponsive();

  // ========== Load Game from Registry ==========
  useEffect(() => {
    try {
      setIsLoading(true);
      setError(null);

      logger.log(`GameContainer: Loading game "${gameId}"`);

      // Retrieve game from registry
      const loadedGame = gameRegistry.getGame(gameId);

      // Validate game exists
      if (!loadedGame) {
        throw new Error(`Game "${gameId}" not found in registry`);
      }

      // Validate game is enabled
      if (!loadedGame.isEnabled) {
        throw new Error(`Game "${gameId}" is disabled and cannot be played`);
      }

      // Validate game is not coming soon
      if (loadedGame.comingSoon) {
        throw new Error(`Game "${gameId}" is coming soon and not yet available`);
      }

      logger.log(`✓ Game loaded: ${loadedGame.name}`);
      setGame(loadedGame);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load game';
      logger.error(`GameContainer Error: ${errorMessage}`);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [gameId]);

  // ========== Handle Back Button ==========
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      // Return to game selection
      navigation.goBack();
      return true;
    });

    return () => backHandler.remove();
  }, [navigation]);

  // ========== Wrap Game with Providers ==========
  const GameWithProviders = useMemo(() => {
    if (!game) return null;

    const GameNavigator = game.navigator;

    // If no providers, return game navigator directly
    if (!game.providers || game.providers.length === 0) {
      return <GameNavigator />;
    }

    // Wrap navigator with providers (innermost first)
    // Providers are applied in reverse order so the first provider
    // in the array is the outermost wrapper
    return game.providers.reduceRight(
      (wrappedComponent, Provider) => (
        <Provider>{wrappedComponent}</Provider>
      ),
      <GameNavigator />,
    );
  }, [game]);

  // ========== Render Loading State ==========
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#9b59b6" />
          <Text style={[styles.loadingText, { fontSize: fs(16) }]}>
            Loading game...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // ========== Render Error State ==========
  if (error || !game) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={[styles.errorTitle, { fontSize: fs(20) }]}>
            Failed to Load Game
          </Text>
          <Text style={[styles.errorText, { fontSize: fs(14) }]}>
            {error || 'An unknown error occurred'}
          </Text>
          <Text
            style={[styles.errorHint, { fontSize: fs(12) }]}
            onPress={() => navigation.goBack()}
          >
            Tap here to go back
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // ========== Render Game ==========
  return (
    <View style={styles.container}>
      {GameWithProviders}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  loadingText: {
    marginTop: 12,
    color: '#666',
    textAlign: 'center',
  },

  errorTitle: {
    fontWeight: '700',
    color: '#c0392b',
    marginBottom: 12,
    textAlign: 'center',
  },

  errorText: {
    color: '#555',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },

  errorHint: {
    color: '#3498db',
    textAlign: 'center',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
