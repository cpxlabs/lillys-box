import GameRegistry, { gameRegistry } from '../GameRegistry';
import { Game } from '../types';

/**
 * Test suite for GameRegistry
 *
 * Tests the game registration system including:
 * - Game registration and validation
 * - Game retrieval and filtering
 * - Registry singleton pattern
 * - Error handling for invalid games
 */
describe('GameRegistry', () => {
  let registry: InstanceType<typeof GameRegistry>;

  /**
   * Mock game for testing
   */
  const createMockGame = (overrides?: Partial<Game>): Game => ({
    id: 'test-game',
    name: 'Test Game',
    description: 'A test game',
    icon: { uri: 'test.png' },
    category: 'casual',
    navigator: () => null,
    initialRoute: 'Home',
    providers: [],
    translations: {
      en: { name: 'Test Game' },
      'pt-BR': { name: 'Jogo de Teste' },
    },
    version: '1.0.0',
    minAppVersion: '1.0.0',
    isEnabled: true,
    ...overrides,
  });

  beforeEach(() => {
    // Get fresh instance
    registry = GameRegistry.getInstance();
    // Clear any existing games
    // Note: In a real scenario, we might need to reset the singleton
    // For now, we'll just unregister test games
    registry.unregister('test-game');
    registry.unregister('pet-care');
    registry.unregister('puzzle-game');
  });

  // ========== Singleton Pattern Tests ==========
  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      const instance1 = GameRegistry.getInstance();
      const instance2 = GameRegistry.getInstance();
      expect(instance1).toBe(instance2);
    });

    it('should export the singleton instance', () => {
      expect(gameRegistry).toBeDefined();
      expect(gameRegistry).toBe(GameRegistry.getInstance());
    });
  });

  // ========== Game Registration Tests ==========
  describe('Game Registration', () => {
    it('should register a valid game', () => {
      const game = createMockGame();
      registry.register(game);
      expect(registry.hasGame('test-game')).toBe(true);
    });

    it('should store the game with correct properties', () => {
      const game = createMockGame({
        id: 'pet-care',
        name: 'Pet Care',
      });
      registry.register(game);
      const retrieved = registry.getGame('pet-care');
      expect(retrieved).toBeDefined();
      expect(retrieved?.name).toBe('Pet Care');
      expect(retrieved?.category).toBe('casual');
    });

    it('should prevent duplicate registration', () => {
      const game = createMockGame();
      registry.register(game);
      registry.register(game); // Should log a warning, not throw
      expect(registry.hasGame('test-game')).toBe(true);
    });

    it('should register multiple games', () => {
      const game1 = createMockGame({ id: 'game1', name: 'Game 1' });
      const game2 = createMockGame({ id: 'game2', name: 'Game 2' });
      registry.register(game1);
      registry.register(game2);
      expect(registry.getAllGames().length).toBeGreaterThanOrEqual(2);
    });
  });

  // ========== Game Validation Tests ==========
  describe('Game Validation', () => {
    it('should throw error for missing id', () => {
      const game = createMockGame({ id: '' });
      expect(() => registry.register(game)).toThrow('id must be a non-empty string');
    });

    it('should throw error for missing name', () => {
      const game = createMockGame({ name: '' });
      expect(() => registry.register(game)).toThrow('name must be a non-empty string');
    });

    it('should throw error for missing description', () => {
      const game = createMockGame({ description: '' });
      expect(() => registry.register(game)).toThrow(
        'description must be a non-empty string',
      );
    });

    it('should throw error for invalid category', () => {
      const game = createMockGame({ category: 'invalid' as any });
      expect(() => registry.register(game)).toThrow('invalid category');
    });

    it('should throw error for missing navigator', () => {
      const game = createMockGame({ navigator: undefined as any });
      expect(() => registry.register(game)).toThrow('navigator must be a React component');
    });

    it('should throw error for missing initialRoute', () => {
      const game = createMockGame({ initialRoute: '' });
      expect(() => registry.register(game)).toThrow(
        'initialRoute must be a non-empty string',
      );
    });

    it('should throw error for missing translations', () => {
      const game = createMockGame({ translations: {} as any });
      expect(() => registry.register(game)).toThrow(
        'translations must include both "en" and "pt-BR"',
      );
    });

    it('should throw error for missing version', () => {
      const game = createMockGame({ version: '' });
      expect(() => registry.register(game)).toThrow('version must be a non-empty string');
    });

    it('should throw error for non-boolean isEnabled', () => {
      const game = createMockGame({ isEnabled: 'true' as any });
      expect(() => registry.register(game)).toThrow('isEnabled must be a boolean');
    });

    it('should accept all valid categories', () => {
      const categories: Array<'pet' | 'puzzle' | 'adventure' | 'casual' | 'arcade'> = [
        'pet',
        'puzzle',
        'adventure',
        'casual',
        'arcade',
      ];
      categories.forEach((category) => {
        const gameId = `game-${category}`;
        const game = createMockGame({ id: gameId, category });
        expect(() => registry.register(game)).not.toThrow();
        registry.unregister(gameId);
      });
    });
  });

  // ========== Game Retrieval Tests ==========
  describe('Game Retrieval', () => {
    beforeEach(() => {
      registry.register(createMockGame({ id: 'game1', name: 'Alpha Game' }));
      registry.register(
        createMockGame({ id: 'game2', name: 'Beta Game', isEnabled: false }),
      );
      registry.register(
        createMockGame({ id: 'game3', name: 'Gamma Game', comingSoon: true }),
      );
    });

    it('should retrieve game by id', () => {
      const game = registry.getGame('game1');
      expect(game).toBeDefined();
      expect(game?.name).toBe('Alpha Game');
    });

    it('should return undefined for non-existent game', () => {
      const game = registry.getGame('non-existent');
      expect(game).toBeUndefined();
    });

    it('should get all games sorted by name', () => {
      const games = registry.getAllGames();
      const names = games.map((g) => g.name);
      const sorted = [...names].sort();
      expect(names).toEqual(sorted);
    });

    it('should get only enabled games', () => {
      const enabledGames = registry.getEnabledGames();
      expect(enabledGames.every((g) => g.isEnabled && !g.comingSoon)).toBe(true);
      expect(
        enabledGames.find((g) => g.id === 'game2' || g.id === 'game3'),
      ).toBeUndefined();
    });

    it('should filter games by category', () => {
      registry.register(
        createMockGame({ id: 'pet-game', category: 'pet', name: 'Pet Game' }),
      );
      registry.register(
        createMockGame({ id: 'puzzle-game', category: 'puzzle', name: 'Puzzle Game' }),
      );

      const petGames = registry.getGamesByCategory('pet');
      expect(petGames.every((g) => g.category === 'pet')).toBe(true);

      const puzzleGames = registry.getGamesByCategory('puzzle');
      expect(puzzleGames.every((g) => g.category === 'puzzle')).toBe(true);
    });

    it('should return empty array for empty category', () => {
      const arcadeGames = registry.getGamesByCategory('arcade');
      expect(arcadeGames.length).toBe(0);
    });
  });

  // ========== Game Unregistration Tests ==========
  describe('Game Unregistration', () => {
    it('should unregister a game', () => {
      registry.register(createMockGame());
      expect(registry.hasGame('test-game')).toBe(true);
      registry.unregister('test-game');
      expect(registry.hasGame('test-game')).toBe(false);
    });

    it('should handle unregistering non-existent game gracefully', () => {
      expect(() => registry.unregister('non-existent')).not.toThrow();
    });
  });

  // ========== Game Existence Check Tests ==========
  describe('Game Existence Check', () => {
    it('should return true for registered game', () => {
      registry.register(createMockGame());
      expect(registry.hasGame('test-game')).toBe(true);
    });

    it('should return false for non-existent game', () => {
      expect(registry.hasGame('non-existent')).toBe(false);
    });
  });

  // ========== Multiple Game Management Tests ==========
  describe('Multiple Game Management', () => {
    it('should handle multiple games correctly', () => {
      const games = [
        createMockGame({ id: 'game1', name: 'Game 1', category: 'pet' }),
        createMockGame({ id: 'game2', name: 'Game 2', category: 'puzzle' }),
        createMockGame({ id: 'game3', name: 'Game 3', category: 'pet' }),
      ];

      games.forEach((game) => registry.register(game));

      expect(registry.getAllGames().length).toBeGreaterThanOrEqual(3);
      expect(registry.getGamesByCategory('pet').length).toBeGreaterThanOrEqual(2);
      expect(registry.getGamesByCategory('puzzle').length).toBeGreaterThanOrEqual(1);
    });

    it('should maintain consistency across operations', () => {
      const game1 = createMockGame({ id: 'game1' });
      const game2 = createMockGame({ id: 'game2' });

      registry.register(game1);
      registry.register(game2);

      const allGames = registry.getAllGames();
      expect(allGames.find((g) => g.id === 'game1')).toBeDefined();
      expect(allGames.find((g) => g.id === 'game2')).toBeDefined();

      registry.unregister('game1');
      const afterUnregister = registry.getAllGames();
      expect(afterUnregister.find((g) => g.id === 'game1')).toBeUndefined();
      expect(afterUnregister.find((g) => g.id === 'game2')).toBeDefined();
    });
  });
});
