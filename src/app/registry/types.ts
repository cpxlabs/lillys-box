import { ComponentType } from 'react';
import { ImageSourcePropType } from 'react-native';

/**
 * Game category classifications
 * Helps organize games by type in the UI
 */
export type GameCategory = 'pet' | 'puzzle' | 'adventure' | 'casual' | 'arcade';

/**
 * Game translations for internationalization
 * Each game can provide translations for all supported languages
 */
export interface GameTranslations {
  en: Record<string, any>;
  'pt-BR': Record<string, any>;
}

/**
 * Game definition interface
 * Every game must implement this interface to register with the platform
 *
 * @example
 * ```typescript
 * const petCareGame: Game = {
 *   id: 'pet-care',
 *   name: 'Pet Care',
 *   description: 'Take care of your virtual pet',
 *   icon: require('./assets/icon.png'),
 *   category: 'pet',
 *   navigator: PetGameNavigator,
 *   initialRoute: 'Menu',
 *   providers: [PetProvider],
 *   translations: { en: {...}, 'pt-BR': {...} },
 *   version: '1.0.0',
 *   minAppVersion: '1.0.0',
 *   isEnabled: true,
 * };
 * ```
 */
export interface Game {
  // ========== Identification ==========
  /** Unique identifier for the game (used in URLs, storage, etc.) */
  id: string;

  /** Display name of the game */
  name: string;

  /** Short description of the game */
  description: string;

  /** Game icon for display in UI */
  icon: ImageSourcePropType;

  /** Category for organizing games */
  category: GameCategory;

  // ========== Navigation ==========
  /** React component that handles game navigation */
  navigator: ComponentType<any>;

  /** Initial route/screen name when game starts */
  initialRoute: string;

  // ========== Providers (optional) ==========
  /**
   * Optional game-specific context providers
   * These will wrap the game navigator with additional state management
   * Example: [PetProvider] for the pet care game
   */
  providers?: ComponentType<{ children: React.ReactNode }>[];

  // ========== Localization ==========
  /** Translations for all supported languages */
  translations: GameTranslations;

  // ========== Metadata ==========
  /** Game version (semantic versioning) */
  version: string;

  /** Minimum app version required to run this game */
  minAppVersion: string;

  /** Whether the game is enabled and should appear in game selection */
  isEnabled: boolean;

  // ========== Optional Features ==========
  /** Whether the game requires user authentication */
  requiresAuth?: boolean;

  /** Whether the game is premium/paid */
  isPremium?: boolean;

  /** Whether the game is still in development (shows as "Coming Soon") */
  comingSoon?: boolean;
}

/**
 * Game Registry Interface
 * Defines the contract for the game registry service
 */
export interface GameRegistryInterface {
  /**
   * Register a new game with the platform
   * @param game - The game to register
   * @throws Error if game is invalid or already registered
   */
  register(game: Game): void;

  /**
   * Unregister a game from the platform
   * @param gameId - The ID of the game to unregister
   */
  unregister(gameId: string): void;

  /**
   * Get a game by ID
   * @param gameId - The ID of the game to retrieve
   * @returns The game object, or undefined if not found
   */
  getGame(gameId: string): Game | undefined;

  /**
   * Get all registered games
   * @returns Array of all games, sorted by name
   */
  getAllGames(): Game[];

  /**
   * Get all enabled games (excluding disabled/coming soon games)
   * @returns Array of enabled games
   */
  getEnabledGames(): Game[];

  /**
   * Get games filtered by category
   * @param category - The category to filter by
   * @returns Array of games in the specified category
   */
  getGamesByCategory(category: GameCategory): Game[];

  /**
   * Check if a game is registered
   * @param gameId - The ID to check
   * @returns True if the game is registered
   */
  hasGame(gameId: string): boolean;
}
