import React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import { GameContainer } from '../GameContainer';

const mockGetGame = jest.fn();

jest.mock('../../registry/GameRegistry', () => ({
  gameRegistry: {
    getGame: (...args: unknown[]) => mockGetGame(...args),
  },
}));

describe('GameContainer', () => {
  const route = { params: { gameId: 'test-game' } } as React.ComponentProps<typeof GameContainer>['route'];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders fallback when game is not found', () => {
    mockGetGame.mockReturnValue(undefined);

    const { getByText } = render(<GameContainer route={route} />);

    expect(getByText('Game not available')).toBeTruthy();
  });

  it('renders fallback when navigator is missing', () => {
    mockGetGame.mockReturnValue({
      id: 'broken-game',
      providers: [],
      navigator: undefined,
    });

    const { getByText } = render(<GameContainer route={route} />);

    expect(getByText('Game not available')).toBeTruthy();
  });

  it('renders registered game navigator', () => {
    const TestNavigator = () => <Text>Navigator OK</Text>;

    mockGetGame.mockReturnValue({
      id: 'working-game',
      navigator: TestNavigator,
      providers: [],
    });

    const { getByText } = render(<GameContainer route={route} />);

    expect(getByText('Navigator OK')).toBeTruthy();
  });
});
