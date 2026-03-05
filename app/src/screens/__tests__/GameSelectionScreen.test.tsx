import React from 'react';
import { render, waitFor, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameSelectionScreen } from '../GameSelectionScreen';

// ── Mocks ──────────────────────────────────────────────────────────────────

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn() }),
}));

const mockGames = [
  {
    id: 'game-1',
    nameKey: 'game.name1',
    descriptionKey: 'game.desc1',
    emoji: '🐾',
    category: 'pet',
    screenName: 'Game1Screen',
  },
  {
    id: 'game-2',
    nameKey: 'game.name2',
    descriptionKey: 'game.desc2',
    emoji: '🧩',
    category: 'puzzle',
    screenName: 'Game2Screen',
  },
];

jest.mock('../../registry/GameRegistry', () => ({
  gameRegistry: {
    getAllGames: jest.fn(() => mockGames),
  },
}));

jest.mock('../../components/EmojiIcon', () => ({
  EmojiIcon: ({ size }: { size?: number }) => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const React = require('react');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Text } = require('react-native');
    return React.createElement(Text, null, `emoji-size-${size ?? 0}`);
  },
}));

jest.mock('../../hooks/useFavoriteGames', () => ({
  useFavoriteGames: () => ({
    toggleFavorite: jest.fn(),
    isFavorite: jest.fn(() => false),
  }),
}));

// Capture SettingsModal props so we can invoke callbacks from tests
let capturedSettingsProps: { uiIndex: number; onUiIndexChange: (i: number) => void } | null = null;

jest.mock('../../components/SettingsModal', () => ({
  SettingsModal: (props: any) => {
    capturedSettingsProps = props;
    return null;
  },
}));

jest.mock('../GameReviewsScreen', () => ({
  GameReviewsScreen: () => null,
}));

jest.mock('../../components/ReviewModal', () => ({
  ReviewModal: () => null,
}));

jest.mock('../../services/ReviewService', () => ({
  ReviewService: {
    getSummary: jest.fn(() =>
      Promise.resolve({ averageRating: 0, totalReviews: 0 }),
    ),
  },
}));

// Stable mock for all Alt UI components
const AltStub = () => null;

jest.mock('../game-selector-alts', () => ({
  Alt1CompactList: AltStub,
  Alt2MinimalGrid: AltStub,
  Alt3DarkMode: AltStub,
  Alt4Carousel: AltStub,
  Alt5BubbleLayout: AltStub,
  Alt6Magazine: AltStub,
  Alt7AppStore: AltStub,
  Alt8RetroArcade: AltStub,
  Alt9FlatMaterial: AltStub,
  Alt10SidebarCategories: AltStub,
  Alt11ToyBox: AltStub,
  Alt12StickerBook: AltStub,
  Alt13CandyLand: AltStub,
  Alt14Crayon: AltStub,
  Alt15BigButtons: AltStub,
  Alt16RainbowRows: AltStub,
  Alt17Treehouse: AltStub,
  Alt18LunchboxGrid: AltStub,
  Alt19Storybook: AltStub,
  Alt20Playground: AltStub,
  Alt21CloudFloat: AltStub,
  Alt22IceCream: AltStub,
  Alt23AlphabetBlocks: AltStub,
  Alt24Watercolor: AltStub,
  Alt25Pocket: AltStub,
}));

const mockNavigation = {} as any;

// ── Tests ──────────────────────────────────────────────────────────────────

describe('GameSelectionScreen — uiIndex persistence', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    capturedSettingsProps = null;
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
  });

  it('reads ui_index from AsyncStorage on mount', async () => {
    render(<GameSelectionScreen navigation={mockNavigation} />);

    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('ui_index');
    });
  });

  it('defaults to uiIndex 0 when AsyncStorage has no stored value', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    render(<GameSelectionScreen navigation={mockNavigation} />);

    await waitFor(() => {
      expect(capturedSettingsProps).not.toBeNull();
      expect(capturedSettingsProps!.uiIndex).toBe(0);
    });
  });

  it('loads a valid uiIndex from AsyncStorage', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('2');

    render(<GameSelectionScreen navigation={mockNavigation} />);

    await waitFor(() => {
      expect(capturedSettingsProps).not.toBeNull();
      expect(capturedSettingsProps!.uiIndex).toBe(2);
    });
  });

  it('ignores an out-of-range value from AsyncStorage', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('999');

    render(<GameSelectionScreen navigation={mockNavigation} />);

    await waitFor(() => {
      expect(capturedSettingsProps).not.toBeNull();
    });

    expect(capturedSettingsProps!.uiIndex).toBe(0);
  });

  it('ignores a non-numeric value from AsyncStorage', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('not-a-number');

    render(<GameSelectionScreen navigation={mockNavigation} />);

    await waitFor(() => {
      expect(capturedSettingsProps).not.toBeNull();
    });

    expect(capturedSettingsProps!.uiIndex).toBe(0);
  });

  it('saves uiIndex to AsyncStorage when onUiIndexChange is called', async () => {
    render(<GameSelectionScreen navigation={mockNavigation} />);

    await waitFor(() => {
      expect(capturedSettingsProps).not.toBeNull();
    });

    await act(async () => {
      capturedSettingsProps!.onUiIndexChange(4);
    });

    expect(AsyncStorage.setItem).toHaveBeenCalledWith('ui_index', '4');
  });

  it('renders the original game grid when uiIndex is 0', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('0');

    const { getByText } = render(<GameSelectionScreen navigation={mockNavigation} />);

    await waitFor(() => {
      expect(getByText('selectGame.title')).toBeTruthy();
    });
  });

  it('uses larger emoji size for game cards', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('0');

    const { getAllByText } = render(<GameSelectionScreen navigation={mockNavigation} />);

    await waitFor(() => {
      expect(getAllByText('emoji-size-56').length).toBeGreaterThan(0);
    });
  });
});
