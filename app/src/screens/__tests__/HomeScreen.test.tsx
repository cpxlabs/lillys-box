import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { HomeScreen } from '../HomeScreen';
import { createMockNavigation } from '../../testUtils/backNavigation';

// ── Mocks ──────────────────────────────────────────────────────────────────

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const mockEarnMoney = jest.fn();
const mockUsePet = jest.fn();
jest.mock('../../context/PetContext', () => ({
  usePet: () => mockUsePet(),
}));

jest.mock('../../context/ToastContext', () => ({
  useToast: () => ({ showToast: jest.fn() }),
}));

jest.mock('../../context/BuddyContext', () => ({
  useBuddy: () => ({
    buddy: {
      species: 'duck',
      rarity: 'common',
      eye: '●',
      accessory: 'none',
      sparkle: false,
      stats: { KINDNESS: 50, BRAVERY: 50, CURIOSITY: 50, CREATIVITY: 50, SILLINESS: 50 },
      name: 'TestBuddy',
      personality: 'cheerful',
    },
    speechBubble: null,
    isPetting: false,
    petCount: 0,
    sendEvent: jest.fn(),
    petBuddy: jest.fn(),
    regenerate: jest.fn(),
  }),
}));

jest.mock('../../hooks/useResponsive', () => ({
  useResponsive: () => ({
    deviceType: 'phone',
    spacing: (v: number) => v,
    fs: (v: number) => v,
  }),
}));

jest.mock('../../config/responsive', () => ({
  PET_SIZE: { phone: 150, tablet: 200, desktop: 200 },
}));

jest.mock('../../config/ads.config', () => ({
  AdsConfig: {
    enabled: false,
    rewards: { videoWatchBonus: 50 },
  },
}));

jest.mock('../../config/gameBalance', () => ({
  GAME_BALANCE: {
    thresholds: { energyForSleep: 50 },
  },
}));

jest.mock('../../utils/age', () => ({
  calculatePetAge: () => 1,
}));

jest.mock('../../utils/petStats', () => ({
  needsVet: () => 'ok',
  hasWarningStats: () => false,
}));

jest.mock('../../components/PetRenderer', () => ({
  PetRenderer: () => null,
}));

jest.mock('../../components/StatusCard', () => ({
  StatusCard: ({ petName }: { petName: string }) => {
    const { Text } = require('react-native');
    return <Text testID="status-card">{petName}</Text>;
  },
}));

jest.mock('../../components/BannerAd', () => ({
  BannerAd: () => null,
}));

jest.mock('../../components/RewardedAdButton', () => ({
  RewardedAdButton: () => null,
}));

jest.mock('../../components/BuddyWidget', () => ({
  BuddyWidget: () => null,
}));

jest.mock('../../components/BuddyProfile', () => ({
  BuddyProfile: () => null,
}));

jest.mock('../../components/IconButton', () => ({
  IconButton: ({ label, onPress }: { label: string; onPress: () => void }) => {
    const { TouchableOpacity, Text } = require('react-native');
    return (
      <TouchableOpacity onPress={onPress} testID={`icon-btn-${label}`}>
        <Text>{label}</Text>
      </TouchableOpacity>
    );
  },
}));

jest.mock('../../components/ConfirmModal', () => ({
  ConfirmModal: ({
    visible,
    onConfirm,
    onCancel,
  }: {
    visible: boolean;
    onConfirm: () => void;
    onCancel: () => void;
  }) => {
    if (!visible) return null;
    const { TouchableOpacity, Text } = require('react-native');
    return (
      <>
        <TouchableOpacity onPress={onConfirm} testID="confirm-btn">
          <Text>Confirm</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onCancel} testID="cancel-btn">
          <Text>Cancel</Text>
        </TouchableOpacity>
      </>
    );
  },
}));

const mockNavigate = jest.fn();
const {
  navigation: mockNavigation,
  mockGoBack,
  mockCanGoBack,
  mockGetParent,
} = createMockNavigation({ navigate: mockNavigate });

const mockPet = {
  id: 'pet-1',
  name: 'Buddy',
  type: 'dog',
  hunger: 50,
  energy: 30,
  happiness: 70,
  hygiene: 90,
  health: 100,
  money: 200,
  createdAt: Date.now() - 1000 * 60 * 60 * 24 * 365,
  clothes: { head: null, eyes: null, torso: null, paws: null },
  color: 'brown',
};

// ── Tests ──────────────────────────────────────────────────────────────────

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePet.mockReturnValue({ pet: mockPet, earnMoney: mockEarnMoney });
    mockCanGoBack.mockReturnValue(true);
  });

  it('renders null when pet is not loaded', () => {
    mockUsePet.mockReturnValue({ pet: null, earnMoney: jest.fn() });
    const { toJSON } = render(<HomeScreen navigation={mockNavigation} />);
    expect(toJSON()).toBeNull();
  });

  it('renders the pet name in the status card', () => {
    const { getByTestId } = render(<HomeScreen navigation={mockNavigation} />);
    expect(getByTestId('status-card').props.children).toContain('Buddy');
  });

  it('renders all main action buttons', () => {
    const { getByText } = render(<HomeScreen navigation={mockNavigation} />);
    expect(getByText('home.actions.feed')).toBeTruthy();
    expect(getByText('home.actions.bath')).toBeTruthy();
    expect(getByText('home.actions.sleep')).toBeTruthy();
    expect(getByText('home.actions.play')).toBeTruthy();
    expect(getByText('home.actions.clothes')).toBeTruthy();
    expect(getByText('home.actions.menu')).toBeTruthy();
  });

  it('navigates to Feed screen when feed button is pressed', () => {
    const { getByText } = render(<HomeScreen navigation={mockNavigation} />);
    fireEvent.press(getByText('home.actions.feed'));
    expect(mockNavigate).toHaveBeenCalledWith('Feed');
  });

  it('navigates to Bath screen when bath button is pressed', () => {
    const { getByText } = render(<HomeScreen navigation={mockNavigation} />);
    fireEvent.press(getByText('home.actions.bath'));
    expect(mockNavigate).toHaveBeenCalledWith('Bath');
  });

  it('navigates to Play screen when play button is pressed', () => {
    const { getByText } = render(<HomeScreen navigation={mockNavigation} />);
    fireEvent.press(getByText('home.actions.play'));
    expect(mockNavigate).toHaveBeenCalledWith('Play');
  });

  it('shows confirm modal when menu button is pressed', () => {
    const { getByText, getByTestId } = render(<HomeScreen navigation={mockNavigation} />);
    fireEvent.press(getByText('home.actions.menu'));
    expect(getByTestId('confirm-btn')).toBeTruthy();
  });

  it('dismisses confirm modal when cancel is pressed', () => {
    const { getByText, queryByTestId } = render(<HomeScreen navigation={mockNavigation} />);
    fireEvent.press(getByText('home.actions.menu'));
    fireEvent.press(getByText('Cancel'));
    expect(queryByTestId('confirm-btn')).toBeNull();
  });

  it('uses the real back handler after confirming the menu action', () => {
    const { getByText } = render(<HomeScreen navigation={mockNavigation} />);

    fireEvent.press(getByText('home.actions.menu'));
    fireEvent.press(getByText('Confirm'));

    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });

  it('falls back to parent navigation after confirming the menu action', () => {
    const parentGoBack = jest.fn();

    mockCanGoBack.mockReturnValue(false);
    mockGetParent.mockReturnValue({
      goBack: parentGoBack,
      canGoBack: () => true,
      getParent: () => undefined,
    });

    const { getByText } = render(<HomeScreen navigation={mockNavigation} />);

    fireEvent.press(getByText('home.actions.menu'));
    fireEvent.press(getByText('Confirm'));

    expect(parentGoBack).toHaveBeenCalledTimes(1);
  });
});
