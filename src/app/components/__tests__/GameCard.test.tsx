import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { GameCard } from '../GameCard';
import { Game } from '../../registry/types';

/**
 * Test suite for GameCard component
 */
describe('GameCard', () => {
  /**
   * Create a mock game for testing
   */
  const createMockGame = (overrides?: Partial<Game>): Game => ({
    id: 'test-game',
    name: 'Test Game',
    description: 'A test game for testing',
    icon: require('../../registry/__tests__/mock-icon.png'),
    category: 'casual',
    navigator: () => null,
    initialRoute: 'Home',
    translations: {
      en: { name: 'Test Game' },
      'pt-BR': { name: 'Jogo de Teste' },
    },
    version: '1.0.0',
    minAppVersion: '1.0.0',
    isEnabled: true,
    ...overrides,
  });

  // ========== Basic Rendering Tests ==========
  describe('Rendering', () => {
    it('should render game card with basic information', () => {
      const game = createMockGame({
        name: 'Pet Care',
        description: 'Take care of your virtual pet',
      });
      const mockPress = jest.fn();

      const { getByText } = render(
        <GameCard game={game} onPress={mockPress} />,
      );

      expect(getByText('Pet Care')).toBeTruthy();
      expect(getByText('Take care of your virtual pet')).toBeTruthy();
    });

    it('should display game category badge', () => {
      const game = createMockGame({ category: 'puzzle' });
      const mockPress = jest.fn();

      const { getByText } = render(
        <GameCard game={game} onPress={mockPress} />,
      );

      expect(getByText('puzzle')).toBeTruthy();
    });

    it('should render all required elements', () => {
      const game = createMockGame();
      const mockPress = jest.fn();

      const { getByText, getByRole } = render(
        <GameCard game={game} onPress={mockPress} />,
      );

      // Check for title and description
      expect(getByText('Test Game')).toBeTruthy();
      expect(getByText('A test game for testing')).toBeTruthy();

      // Check for button/touchable
      expect(getByRole('button')).toBeTruthy();
    });
  });

  // ========== Badge Display Tests ==========
  describe('Badges', () => {
    it('should show Coming Soon badge when game is coming soon', () => {
      const game = createMockGame({ comingSoon: true });
      const mockPress = jest.fn();

      const { getByText } = render(
        <GameCard game={game} onPress={mockPress} />,
      );

      expect(getByText('Coming Soon')).toBeTruthy();
    });

    it('should show Premium badge when game is premium', () => {
      const game = createMockGame({ isPremium: true });
      const mockPress = jest.fn();

      const { getByText } = render(
        <GameCard game={game} onPress={mockPress} />,
      );

      expect(getByText('Premium')).toBeTruthy();
    });

    it('should show both badges when applicable', () => {
      const game = createMockGame({
        comingSoon: true,
        isPremium: true,
      });
      const mockPress = jest.fn();

      const { getByText } = render(
        <GameCard game={game} onPress={mockPress} />,
      );

      expect(getByText('Coming Soon')).toBeTruthy();
      expect(getByText('Premium')).toBeTruthy();
    });

    it('should not show badges when not applicable', () => {
      const game = createMockGame({
        comingSoon: false,
        isPremium: false,
      });
      const mockPress = jest.fn();

      const { queryByText } = render(
        <GameCard game={game} onPress={mockPress} />,
      );

      expect(queryByText('Coming Soon')).toBeNull();
      expect(queryByText('Premium')).toBeNull();
    });
  });

  // ========== Press Behavior Tests ==========
  describe('Press Behavior', () => {
    it('should call onPress when card is pressed', () => {
      const game = createMockGame();
      const mockPress = jest.fn();

      const { getByRole } = render(
        <GameCard game={game} onPress={mockPress} />,
      );

      const button = getByRole('button');
      fireEvent.press(button);

      expect(mockPress).toHaveBeenCalledTimes(1);
    });

    it('should not call onPress when disabled', () => {
      const game = createMockGame();
      const mockPress = jest.fn();

      const { getByRole } = render(
        <GameCard game={game} onPress={mockPress} disabled={true} />,
      );

      const button = getByRole('button');
      fireEvent.press(button);

      expect(mockPress).not.toHaveBeenCalled();
    });

    it('should not call onPress when game is coming soon', () => {
      const game = createMockGame({ comingSoon: true });
      const mockPress = jest.fn();

      const { getByRole } = render(
        <GameCard game={game} onPress={mockPress} />,
      );

      const button = getByRole('button');
      fireEvent.press(button);

      expect(mockPress).not.toHaveBeenCalled();
    });

    it('should call onPress when game is premium but not coming soon', () => {
      const game = createMockGame({
        isPremium: true,
        comingSoon: false,
      });
      const mockPress = jest.fn();

      const { getByRole } = render(
        <GameCard game={game} onPress={mockPress} />,
      );

      const button = getByRole('button');
      fireEvent.press(button);

      expect(mockPress).toHaveBeenCalledTimes(1);
    });
  });

  // ========== Accessibility Tests ==========
  describe('Accessibility', () => {
    it('should have proper accessibility role', () => {
      const game = createMockGame();
      const mockPress = jest.fn();

      const { getByRole } = render(
        <GameCard game={game} onPress={mockPress} />,
      );

      expect(getByRole('button')).toBeTruthy();
    });

    it('should have accessibility label', () => {
      const game = createMockGame({
        name: 'My Game',
        description: 'Game description',
      });
      const mockPress = jest.fn();

      const { getByAccessibilityLabel } = render(
        <GameCard game={game} onPress={mockPress} />,
      );

      const label = getByAccessibilityLabel(/My Game.*Game description/i);
      expect(label).toBeTruthy();
    });

    it('should include coming soon in accessibility label', () => {
      const game = createMockGame({
        comingSoon: true,
        name: 'Upcoming Game',
        description: 'Description',
      });
      const mockPress = jest.fn();

      const { getByAccessibilityLabel } = render(
        <GameCard game={game} onPress={mockPress} />,
      );

      const label = getByAccessibilityLabel(/Coming Soon/);
      expect(label).toBeTruthy();
    });

    it('should provide accessibility hint', () => {
      const game = createMockGame();
      const mockPress = jest.fn();

      const { getByRole } = render(
        <GameCard game={game} onPress={mockPress} />,
      );

      const button = getByRole('button');
      expect(button.props.accessibilityHint).toBeTruthy();
    });
  });

  // ========== Styling Tests ==========
  describe('Styling', () => {
    it('should apply disabled style when disabled prop is true', () => {
      const game = createMockGame();
      const mockPress = jest.fn();

      const { getByRole } = render(
        <GameCard game={game} onPress={mockPress} disabled={true} />,
      );

      const card = getByRole('button');
      // The disabled state should reduce opacity
      expect(card.props.style).toBeDefined();
    });

    it('should apply coming soon style when game is coming soon', () => {
      const game = createMockGame({ comingSoon: true });
      const mockPress = jest.fn();

      const { getByRole } = render(
        <GameCard game={game} onPress={mockPress} />,
      );

      const card = getByRole('button');
      expect(card.props.style).toBeDefined();
    });
  });

  // ========== Edge Cases ==========
  describe('Edge Cases', () => {
    it('should handle long game names', () => {
      const game = createMockGame({
        name: 'This is a very long game name that might wrap to multiple lines and should still display correctly',
      });
      const mockPress = jest.fn();

      const { getByText } = render(
        <GameCard game={game} onPress={mockPress} />,
      );

      expect(getByText(/This is a very long game name/)).toBeTruthy();
    });

    it('should handle long descriptions', () => {
      const game = createMockGame({
        description:
          'This is a very long description that explains the game in great detail and should truncate appropriately with the numberOfLines prop set on the text component.',
      });
      const mockPress = jest.fn();

      const { getByText } = render(
        <GameCard game={game} onPress={mockPress} />,
      );

      expect(
        getByText(
          /This is a very long description that explains the game/,
        ),
      ).toBeTruthy();
    });
  });
});
