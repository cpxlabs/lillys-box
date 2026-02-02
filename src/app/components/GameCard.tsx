import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
  AccessibilityInfo,
} from 'react-native';
import { Game } from '../registry/types';

/**
 * Props for GameCard component
 */
interface GameCardProps {
  /** The game to display */
  game: Game;

  /** Callback when the card is pressed */
  onPress: () => void;

  /** Whether the card is disabled (optional) */
  disabled?: boolean;
}

/**
 * GameCard Component
 *
 * Displays a single game as an interactive card in the game selection screen.
 * Shows:
 * - Game icon
 * - Game name and description
 * - Coming Soon or Premium badges if applicable
 * - Disabled state if needed
 *
 * @component
 * @example
 * ```tsx
 * <GameCard
 *   game={myGame}
 *   onPress={() => navigation.navigate('GameContainer', { gameId: myGame.id })}
 * />
 * ```
 */
export const GameCard: React.FC<GameCardProps> = ({
  game,
  onPress,
  disabled = false,
}) => {
  const isComingSoon = game.comingSoon ?? false;
  const isPremium = game.isPremium ?? false;

  const handlePress = () => {
    if (!disabled && !isComingSoon) {
      onPress();
    }
  };

  const accessibilityLabel = `${game.name}, ${game.description}${
    isComingSoon ? ', Coming Soon' : ''
  }${isPremium ? ', Premium' : ''}`;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        disabled && styles.cardDisabled,
        isComingSoon && styles.cardComingSoon,
      ]}
      onPress={handlePress}
      disabled={disabled || isComingSoon}
      activeOpacity={0.7}
      accessible
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityHint={
        isComingSoon ? 'This game is coming soon' : 'Open this game'
      }
    >
      {/* Game Icon */}
      <View style={styles.iconContainer}>
        <Image source={game.icon} style={styles.icon} />
      </View>

      {/* Badges Container */}
      <View style={styles.badgesContainer}>
        {isComingSoon && (
          <View style={styles.badge} accessible={false}>
            <Text style={styles.badgeText}>Coming Soon</Text>
          </View>
        )}
        {isPremium && (
          <View style={[styles.badge, styles.premiumBadge]} accessible={false}>
            <Text style={styles.badgeText}>Premium</Text>
          </View>
        )}
      </View>

      {/* Content Container */}
      <View style={styles.content}>
        <Text
          style={styles.title}
          numberOfLines={2}
          accessibilityRole="header"
        >
          {game.name}
        </Text>
        <Text
          style={styles.description}
          numberOfLines={3}
          accessible={false}
        >
          {game.description}
        </Text>
      </View>

      {/* Category Badge */}
      <View style={styles.categoryBadge} accessible={false}>
        <Text style={styles.categoryText}>{game.category}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
    minHeight: 140,
    justifyContent: 'space-between',
  },

  cardDisabled: {
    opacity: 0.6,
  },

  cardComingSoon: {
    opacity: 0.8,
  },

  iconContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },

  icon: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },

  badgesContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    flexWrap: 'wrap',
  },

  badge: {
    backgroundColor: '#FFB84D',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },

  premiumBadge: {
    backgroundColor: '#D4AF37',
  },

  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },

  content: {
    flex: 1,
    marginBottom: 12,
  },

  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 6,
  },

  description: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },

  categoryBadge: {
    backgroundColor: '#E8E8E8',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },

  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#555',
    textTransform: 'capitalize',
  },
});
