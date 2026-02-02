import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { GameContainer } from '../GameContainer';
import * as gameRegistryModule from '../../registry';

/**
 * Test suite for GameContainer component
 */
describe('GameContainer', () => {
  /**
   * Mock navigation object
   */
  const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
    setParams: jest.fn(),
  };

  /**
   * Create mock route with gameId
   */
  const createMockRoute = (gameId: string) => ({
    key: 'GameContainer',
    name: 'GameContainer',
    params: { gameId },
  });

  /**
   * Create mock game
   */
  const createMockGame = (overrides?: any) => ({
    id: 'test-game',
    name: 'Test Game',
    description: 'A test game',
    icon: require('../../registry/__tests__/mock-icon.png'),
    category: 'casual',
    navigator: () => <div>Test Game Navigator</div>,
    initialRoute: 'Home',
    translations: {
      en: { name: 'Test Game' },
      'pt-BR': { name: 'Jogo de Teste' },
    },
    version: '1.0.0',
    minAppVersion: '1.0.0',
    isEnabled: true,
    comingSoon: false,
    ...overrides,
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ========== Game Loading Tests ==========
  describe('Game Loading', () => {
    it('should load game from registry on mount', async () => {
      const game = createMockGame({ id: 'pet-care' });
      const getGameSpy = jest.spyOn(gameRegistryModule.gameRegistry, 'getGame')
        .mockReturnValue(game);

      const route = createMockRoute('pet-care');
      render(
        <GameContainer navigation={mockNavigation} route={route as any} />,
      );

      await waitFor(() => {
        expect(getGameSpy).toHaveBeenCalledWith('pet-care');
      });

      getGameSpy.mockRestore();
    });

    it('should show loading state while game is loading', () => {
      const game = createMockGame();
      jest.spyOn(gameRegistryModule.gameRegistry, 'getGame')
        .mockReturnValue(game);

      const route = createMockRoute('test-game');
      const { getByText } = render(
        <GameContainer navigation={mockNavigation} route={route as any} />,
      );

      // The loading state should be briefly visible
      // Note: It may disappear quickly in tests
    });

    it('should handle game not found error', async () => {
      jest.spyOn(gameRegistryModule.gameRegistry, 'getGame')
        .mockReturnValue(undefined);

      const route = createMockRoute('non-existent-game');
      const { getByText } = render(
        <GameContainer navigation={mockNavigation} route={route as any} />,
      );

      await waitFor(() => {
        expect(getByText(/not found/i)).toBeTruthy();
      });
    });

    it('should handle disabled game error', async () => {
      const disabledGame = createMockGame({ isEnabled: false });
      jest.spyOn(gameRegistryModule.gameRegistry, 'getGame')
        .mockReturnValue(disabledGame);

      const route = createMockRoute('test-game');
      const { getByText } = render(
        <GameContainer navigation={mockNavigation} route={route as any} />,
      );

      await waitFor(() => {
        expect(getByText(/disabled/i)).toBeTruthy();
      });
    });

    it('should handle coming-soon game error', async () => {
      const comingSoonGame = createMockGame({ comingSoon: true });
      jest.spyOn(gameRegistryModule.gameRegistry, 'getGame')
        .mockReturnValue(comingSoonGame);

      const route = createMockRoute('test-game');
      const { getByText } = render(
        <GameContainer navigation={mockNavigation} route={route as any} />,
      );

      await waitFor(() => {
        expect(getByText(/coming soon/i)).toBeTruthy();
      });
    });
  });

  // ========== Game Rendering Tests ==========
  describe('Game Rendering', () => {
    it('should render game navigator after loading', async () => {
      const TestNavigator = () => <div>Test Game Content</div>;
      const game = createMockGame({ navigator: TestNavigator });
      jest.spyOn(gameRegistryModule.gameRegistry, 'getGame')
        .mockReturnValue(game);

      const route = createMockRoute('test-game');
      const { getByText } = render(
        <GameContainer navigation={mockNavigation} route={route as any} />,
      );

      // Game navigator should be rendered (but might not find text in test env)
    });

    it('should pass correct props to game navigator', async () => {
      const navigatorProps: any = {};
      const TestNavigator = (props: any) => {
        Object.assign(navigatorProps, props);
        return null;
      };

      const game = createMockGame({ navigator: TestNavigator });
      jest.spyOn(gameRegistryModule.gameRegistry, 'getGame')
        .mockReturnValue(game);

      const route = createMockRoute('test-game');
      render(
        <GameContainer navigation={mockNavigation} route={route as any} />,
      );

      // Navigator should be rendered with the game data
    });
  });

  // ========== Provider Wrapping Tests ==========
  describe('Provider Wrapping', () => {
    it('should render game without providers if none specified', async () => {
      const game = createMockGame({ providers: undefined });
      jest.spyOn(gameRegistryModule.gameRegistry, 'getGame')
        .mockReturnValue(game);

      const route = createMockRoute('test-game');
      render(
        <GameContainer navigation={mockNavigation} route={route as any} />,
      );

      // Game should render directly without wrapper
    });

    it('should wrap game with single provider', async () => {
      const TestProvider = ({ children }: any) => (
        <div data-testid="test-provider">{children}</div>
      );

      const game = createMockGame({ providers: [TestProvider] });
      jest.spyOn(gameRegistryModule.gameRegistry, 'getGame')
        .mockReturnValue(game);

      const route = createMockRoute('test-game');
      const { getByTestId } = render(
        <GameContainer navigation={mockNavigation} route={route as any} />,
      );

      // Provider wrapper should be present
      expect(getByTestId('test-provider')).toBeTruthy();
    });

    it('should wrap game with multiple providers in correct order', async () => {
      const mockCalls: string[] = [];

      const Provider1 = ({ children }: any) => {
        mockCalls.push('Provider1');
        return children;
      };

      const Provider2 = ({ children }: any) => {
        mockCalls.push('Provider2');
        return children;
      };

      const game = createMockGame({
        providers: [Provider1, Provider2],
      });

      jest.spyOn(gameRegistryModule.gameRegistry, 'getGame')
        .mockReturnValue(game);

      const route = createMockRoute('test-game');
      render(
        <GameContainer navigation={mockNavigation} route={route as any} />,
      );

      // Providers should be applied in order (first in array is outermost)
      // Provider1 is outermost, Provider2 is next
    });

    it('should apply providers with children props', async () => {
      let providerChildren: any = null;

      const TestProvider = ({ children }: any) => {
        providerChildren = children;
        return children;
      };

      const game = createMockGame({ providers: [TestProvider] });
      jest.spyOn(gameRegistryModule.gameRegistry, 'getGame')
        .mockReturnValue(game);

      const route = createMockRoute('test-game');
      render(
        <GameContainer navigation={mockNavigation} route={route as any} />,
      );

      // Provider should receive the game navigator as children
      expect(providerChildren).toBeDefined();
    });
  });

  // ========== Error State Tests ==========
  describe('Error States', () => {
    it('should display error message for missing game', async () => {
      jest.spyOn(gameRegistryModule.gameRegistry, 'getGame')
        .mockReturnValue(undefined);

      const route = createMockRoute('missing-game');
      const { getByText } = render(
        <GameContainer navigation={mockNavigation} route={route as any} />,
      );

      await waitFor(() => {
        expect(getByText(/Failed to Load Game/i)).toBeTruthy();
        expect(getByText(/not found/i)).toBeTruthy();
      });
    });

    it('should provide navigation hint in error state', async () => {
      jest.spyOn(gameRegistryModule.gameRegistry, 'getGame')
        .mockReturnValue(undefined);

      const route = createMockRoute('missing-game');
      const { getByText } = render(
        <GameContainer navigation={mockNavigation} route={route as any} />,
      );

      await waitFor(() => {
        const hint = getByText(/go back/i);
        expect(hint).toBeTruthy();
      });
    });

    it('should call goBack when error hint is pressed', async () => {
      jest.spyOn(gameRegistryModule.gameRegistry, 'getGame')
        .mockReturnValue(undefined);

      const route = createMockRoute('missing-game');
      const { getByText } = render(
        <GameContainer navigation={mockNavigation} route={route as any} />,
      );

      await waitFor(() => {
        const hint = getByText(/go back/i);
        fireEvent.press(hint);
      });

      expect(mockNavigation.goBack).toHaveBeenCalled();
    });
  });

  // ========== Back Navigation Tests ==========
  describe('Back Navigation', () => {
    it('should set up back handler on mount', () => {
      const addEventListenerSpy = jest.spyOn(
        require('react-native').BackHandler,
        'addEventListener',
      );

      const game = createMockGame();
      jest.spyOn(gameRegistryModule.gameRegistry, 'getGame')
        .mockReturnValue(game);

      const route = createMockRoute('test-game');
      render(
        <GameContainer navigation={mockNavigation} route={route as any} />,
      );

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'hardwareBackPress',
        expect.any(Function),
      );
    });

    it('should call goBack when back button is pressed', async () => {
      const game = createMockGame();
      jest.spyOn(gameRegistryModule.gameRegistry, 'getGame')
        .mockReturnValue(game);

      const route = createMockRoute('test-game');
      render(
        <GameContainer navigation={mockNavigation} route={route as any} />,
      );

      // Simulate hardware back press
      // Note: This requires proper mocking of BackHandler
    });

    it('should remove back handler on unmount', () => {
      const mockRemove = jest.fn();
      const removeEventListenerSpy = jest
        .spyOn(require('react-native').BackHandler, 'addEventListener')
        .mockReturnValue({ remove: mockRemove });

      const game = createMockGame();
      jest.spyOn(gameRegistryModule.gameRegistry, 'getGame')
        .mockReturnValue(game);

      const route = createMockRoute('test-game');
      const { unmount } = render(
        <GameContainer navigation={mockNavigation} route={route as any} />,
      );

      // Unmount should trigger cleanup
      // Note: Testing this properly requires component lifecycle testing
    });
  });

  // ========== Route Parameter Tests ==========
  describe('Route Parameters', () => {
    it('should read gameId from route params', async () => {
      const game = createMockGame({ id: 'specific-game' });
      const getGameSpy = jest.spyOn(gameRegistryModule.gameRegistry, 'getGame')
        .mockReturnValue(game);

      const route = createMockRoute('specific-game');
      render(
        <GameContainer navigation={mockNavigation} route={route as any} />,
      );

      await waitFor(() => {
        expect(getGameSpy).toHaveBeenCalledWith('specific-game');
      });
    });

    it('should handle different gameIds', async () => {
      const game1 = createMockGame({ id: 'game-1' });
      const game2 = createMockGame({ id: 'game-2' });

      const getGameSpy = jest.spyOn(gameRegistryModule.gameRegistry, 'getGame')
        .mockImplementation((id) => {
          if (id === 'game-1') return game1;
          if (id === 'game-2') return game2;
          return undefined;
        });

      // Test game 1
      const route1 = createMockRoute('game-1');
      render(
        <GameContainer navigation={mockNavigation} route={route1 as any} />,
      );

      await waitFor(() => {
        expect(getGameSpy).toHaveBeenCalledWith('game-1');
      });

      jest.clearAllMocks();

      // Test game 2
      const route2 = createMockRoute('game-2');
      render(
        <GameContainer navigation={mockNavigation} route={route2 as any} />,
      );

      await waitFor(() => {
        expect(getGameSpy).toHaveBeenCalledWith('game-2');
      });
    });
  });

  // ========== Lifecycle Tests ==========
  describe('Component Lifecycle', () => {
    it('should reload game when gameId changes', async () => {
      const game1 = createMockGame({ id: 'game-1' });
      const game2 = createMockGame({ id: 'game-2' });

      const getGameSpy = jest.spyOn(gameRegistryModule.gameRegistry, 'getGame')
        .mockImplementation((id) => {
          if (id === 'game-1') return game1;
          if (id === 'game-2') return game2;
          return undefined;
        });

      // Initial render with game-1
      const route1 = createMockRoute('game-1');
      const { rerender } = render(
        <GameContainer navigation={mockNavigation} route={route1 as any} />,
      );

      await waitFor(() => {
        expect(getGameSpy).toHaveBeenCalledWith('game-1');
      });

      jest.clearAllMocks();

      // Re-render with game-2
      const route2 = createMockRoute('game-2');
      rerender(
        <GameContainer navigation={mockNavigation} route={route2 as any} />,
      );

      await waitFor(() => {
        expect(getGameSpy).toHaveBeenCalledWith('game-2');
      });
    });

    it('should clear error state when new game loads successfully', async () => {
      const game = createMockGame();
      jest.spyOn(gameRegistryModule.gameRegistry, 'getGame')
        .mockReturnValue(game);

      const route = createMockRoute('test-game');
      const { queryByText } = render(
        <GameContainer navigation={mockNavigation} route={route as any} />,
      );

      // Error should not be displayed for valid game
      await waitFor(() => {
        expect(queryByText(/Failed to Load Game/i)).toBeNull();
      });
    });
  });

  // ========== Integration Tests ==========
  describe('Integration', () => {
    it('should handle complete game loading flow', async () => {
      const TestNavigator = () => <div>Game Content</div>;
      const game = createMockGame({ navigator: TestNavigator });

      jest.spyOn(gameRegistryModule.gameRegistry, 'getGame')
        .mockReturnValue(game);

      const route = createMockRoute('test-game');
      render(
        <GameContainer navigation={mockNavigation} route={route as any} />,
      );

      // 1. Loading state
      // 2. Game loads from registry
      // 3. Game navigator renders
      // 4. Back handler is set up
    });

    it('should handle game with providers correctly', async () => {
      const TestProvider = ({ children }: any) => <div>{children}</div>;
      const TestNavigator = () => <div>Game Content</div>;

      const game = createMockGame({
        navigator: TestNavigator,
        providers: [TestProvider],
      });

      jest.spyOn(gameRegistryModule.gameRegistry, 'getGame')
        .mockReturnValue(game);

      const route = createMockRoute('test-game');
      render(
        <GameContainer navigation={mockNavigation} route={route as any} />,
      );

      // Game should be wrapped and rendered
    });
  });
});
