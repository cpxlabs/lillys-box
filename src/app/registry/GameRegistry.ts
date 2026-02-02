import { Game, GameCategory, GameRegistryInterface } from './types';
import { logger } from '../../shared/utils/logger';
import i18n from '../i18n';

/**
 * GameRegistry - Singleton class for managing game registration
 *
 * This registry maintains a collection of games that are available
 * in the application. Games register themselves when the app starts,
 * and the registry provides access to game information for the UI
 * and navigation systems.
 *
 * @example
 * ```typescript
 * // Register a game
 * const gameRegistry = GameRegistry.getInstance();
 * gameRegistry.register(myGame);
 *
 * // Get all enabled games for UI
 * const games = gameRegistry.getEnabledGames();
 * games.forEach(game => console.log(game.name));
 * ```
 */
class GameRegistry implements GameRegistryInterface {
  /**
   * Map of game ID to game object
   * Using a Map for O(1) lookups
   */
  private games: Map<string, Game> = new Map();

  /**
   * Singleton instance
   * There should only ever be one registry in the application
   */
  private static instance: GameRegistry;

  /**
   * Private constructor for singleton pattern
   * Prevents direct instantiation; use getInstance() instead
   */
  private constructor() {
    logger.log('GameRegistry initialized');
  }

  /**
   * Get or create the singleton instance
   * @returns The GameRegistry singleton instance
   */
  public static getInstance(): GameRegistry {
    if (!GameRegistry.instance) {
      GameRegistry.instance = new GameRegistry();
    }
    return GameRegistry.instance;
  }

  /**
   * Register a new game with the platform
   *
   * @param game - The game object to register
   * @throws Error if the game is invalid or already registered
   *
   * @example
   * ```typescript
   * registry.register({
   *   id: 'pet-care',
   *   name: 'Pet Care',
   *   // ... other required fields
   * });
   * ```
   */
  public register(game: Game): void {
    // Check if already registered
    if (this.games.has(game.id)) {
      logger.warn(
        `Game with id "${game.id}" is already registered. Skipping.`,
      );
      return;
    }

    // Validate the game object
    this.validateGame(game);

    // Register game translations with i18n
    this.registerGameTranslations(game);

    // Add to registry
    this.games.set(game.id, game);
    logger.log(`✓ Game registered: ${game.name} (${game.id})`);
  }

  /**
   * Unregister a game from the platform
   *
   * @param gameId - The ID of the game to unregister
   *
   * @example
   * ```typescript
   * registry.unregister('pet-care');
   * ```
   */
  public unregister(gameId: string): void {
    if (this.games.has(gameId)) {
      const game = this.games.get(gameId);
      this.games.delete(gameId);
      logger.log(`✓ Game unregistered: ${game?.name} (${gameId})`);
    }
  }

  /**
   * Get a game by its ID
   *
   * @param gameId - The ID of the game
   * @returns The game object, or undefined if not found
   *
   * @example
   * ```typescript
   * const game = registry.getGame('pet-care');
   * if (game) {
   *   console.log(game.name); // "Pet Care"
   * }
   * ```
   */
  public getGame(gameId: string): Game | undefined {
    return this.games.get(gameId);
  }

  /**
   * Get all registered games, sorted by name
   *
   * @returns Array of all games in alphabetical order by name
   *
   * @example
   * ```typescript
   * const allGames = registry.getAllGames();
   * console.log(allGames.length); // Total number of games
   * ```
   */
  public getAllGames(): Game[] {
    return Array.from(this.games.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }

  /**
   * Get only enabled games (excludes disabled and coming-soon games)
   *
   * This is typically used to populate the game selection screen
   * for the user to choose from available games.
   *
   * @returns Array of enabled games sorted by name
   *
   * @example
   * ```typescript
   * const availableGames = registry.getEnabledGames();
   * // These are ready to play and should be shown to the user
   * ```
   */
  public getEnabledGames(): Game[] {
    return this.getAllGames().filter(
      (game) => game.isEnabled && !game.comingSoon,
    );
  }

  /**
   * Get games filtered by category
   *
   * @param category - The category to filter by
   * @returns Array of games in the specified category
   *
   * @example
   * ```typescript
   * const petGames = registry.getGamesByCategory('pet');
   * const puzzleGames = registry.getGamesByCategory('puzzle');
   * ```
   */
  public getGamesByCategory(category: GameCategory): Game[] {
    return this.getAllGames().filter((game) => game.category === category);
  }

  /**
   * Check if a game is registered
   *
   * @param gameId - The ID to check
   * @returns True if the game is registered, false otherwise
   *
   * @example
   * ```typescript
   * if (registry.hasGame('pet-care')) {
   *   console.log('Pet Care game is available');
   * }
   * ```
   */
  public hasGame(gameId: string): boolean {
    return this.games.has(gameId);
  }

  /**
   * Validate a game object before registration
   *
   * Checks that all required fields are present and have valid types.
   * Throws an error if validation fails.
   *
   * @param game - The game to validate
   * @throws Error if the game is invalid
   *
   * @private
   */
  private validateGame(game: Game): void {
    // List of required fields that must be present
    const requiredFields = [
      'id',
      'name',
      'description',
      'icon',
      'category',
      'navigator',
      'initialRoute',
      'translations',
      'version',
    ];

    // Check each required field
    for (const field of requiredFields) {
      if (!(field in game)) {
        throw new Error(
          `Game registration failed: missing required field "${field}"`,
        );
      }
    }

    // Validate specific field types and values
    if (typeof game.id !== 'string' || game.id.trim() === '') {
      throw new Error(
        'Game registration failed: id must be a non-empty string',
      );
    }

    if (typeof game.name !== 'string' || game.name.trim() === '') {
      throw new Error(
        'Game registration failed: name must be a non-empty string',
      );
    }

    if (typeof game.description !== 'string' || game.description.trim() === '') {
      throw new Error(
        'Game registration failed: description must be a non-empty string',
      );
    }

    if (typeof game.category !== 'string') {
      throw new Error('Game registration failed: category must be a string');
    }

    const validCategories: GameCategory[] = [
      'pet',
      'puzzle',
      'adventure',
      'casual',
      'arcade',
    ];
    if (!validCategories.includes(game.category as GameCategory)) {
      throw new Error(
        `Game registration failed: invalid category "${game.category}"`,
      );
    }

    if (typeof game.navigator !== 'function') {
      throw new Error(
        'Game registration failed: navigator must be a React component',
      );
    }

    if (typeof game.initialRoute !== 'string' || game.initialRoute.trim() === '') {
      throw new Error(
        'Game registration failed: initialRoute must be a non-empty string',
      );
    }

    if (!game.translations || typeof game.translations !== 'object') {
      throw new Error(
        'Game registration failed: translations must be an object',
      );
    }

    if (!game.translations.en || !game.translations['pt-BR']) {
      throw new Error(
        'Game registration failed: translations must include both "en" and "pt-BR"',
      );
    }

    if (typeof game.version !== 'string' || game.version.trim() === '') {
      throw new Error(
        'Game registration failed: version must be a non-empty string',
      );
    }

    if (typeof game.isEnabled !== 'boolean') {
      throw new Error(
        'Game registration failed: isEnabled must be a boolean',
      );
    }

    logger.log(`✓ Game validation passed: ${game.id}`);
  }

  /**
   * Register game translations with i18n
   *
   * Adds the game's translations to i18n as a namespace using the game ID.
   * This allows game-specific translations to be accessed via the game's ID.
   *
   * @param game - The game with translations to register
   *
   * @private
   */
  private registerGameTranslations(game: Game): void {
    try {
      // Register English translations
      if (game.translations.en) {
        i18n.addResourceBundle('en', game.id, game.translations.en, true, true);
      }

      // Register Portuguese-BR translations
      if (game.translations['pt-BR']) {
        i18n.addResourceBundle('pt-BR', game.id, game.translations['pt-BR'], true, true);
      }

      logger.log(`✓ Translations registered for game: ${game.id}`);
    } catch (error) {
      logger.error(`Failed to register translations for game ${game.id}:`, error);
    }
  }
}

/**
 * Export singleton instance for convenient access
 * Most code should use this instead of calling getInstance()
 *
 * @example
 * ```typescript
 * import { gameRegistry } from './registry';
 * gameRegistry.register(myGame);
 * ```
 */
export const gameRegistry = GameRegistry.getInstance();

export default gameRegistry;
