import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { gameRegistry } from '../registry';
import { Game } from '../registry/types';
import { GameCard } from '../components/GameCard';
import { useResponsive } from '../hooks/useResponsive';

/**
 * Props for GameSelectionScreen
 */
type Props = NativeStackScreenProps<any, 'GameSelection'>;

/**
 * GameSelectionScreen Component
 *
 * Main screen that displays all available games for the user to choose from.
 * Features:
 * - Displays all enabled games in a scrollable list
 * - Shows game icons, names, descriptions
 * - Shows badges for coming-soon and premium games
 * - Navigates to selected game
 * - Handles loading states and errors
 * - Responsive design for different screen sizes
 *
 * @component
 * @example
 * ```tsx
 * <Stack.Screen
 *   name="GameSelection"
 *   component={GameSelectionScreen}
 * />
 * ```
 */
export const GameSelectionScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { spacing, fs } = useResponsive();
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load games from registry when component mounts
   */
  useEffect(() => {
    try {
      setIsLoading(true);
      const enabledGames = gameRegistry.getEnabledGames();
      setGames(enabledGames);
      setError(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load games';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Handle game selection
   * Navigate to GameContainer with the selected game ID
   */
  const handleGamePress = (game: Game) => {
    try {
      navigation.navigate('GameContainer', { gameId: game.id });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to open game';
      Alert.alert(t('gameSelection.error') || 'Error', errorMessage);
    }
  };

  /**
   * Render loading state
   */
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#9b59b6" />
          <Text style={styles.loadingText}>
            {t('gameSelection.loading') || 'Loading games...'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  /**
   * Render error state
   */
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorTitle}>
            {t('gameSelection.error') || 'Error'}
          </Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  /**
   * Render empty state
   */
  if (games.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.emptyTitle}>
            {t('gameSelection.noGames') || 'No Games Available'}
          </Text>
          <Text style={styles.emptyText}>
            {t('gameSelection.noGamesDescription') ||
              'Please check back later for new games.'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  /**
   * Render main game selection screen
   */
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        {/* Header */}
        <View style={[styles.header, { paddingHorizontal: spacing(2) }]}>
          <Text style={[styles.title, { fontSize: fs(24) }]}>
            {t('gameSelection.title') || 'Choose Your Game'}
          </Text>
          <Text style={[styles.subtitle, { fontSize: fs(14) }]}>
            {t('gameSelection.subtitle') || 'Select a game to start playing'}
          </Text>
        </View>

        {/* Games List */}
        <View style={styles.gamesList}>
          {games.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              onPress={() => handleGamePress(game)}
            />
          ))}
        </View>

        {/* Footer Spacing */}
        <View style={styles.footer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f0ff',
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
  },

  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },

  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#c0392b',
    marginBottom: 12,
    textAlign: 'center',
  },

  errorText: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    lineHeight: 20,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },

  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },

  header: {
    paddingVertical: 24,
    backgroundColor: '#f5f0ff',
  },

  title: {
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },

  subtitle: {
    color: '#666',
    lineHeight: 20,
  },

  gamesList: {
    flexDirection: 'column',
    paddingTop: 8,
  },

  footer: {
    height: 24,
  },
});
