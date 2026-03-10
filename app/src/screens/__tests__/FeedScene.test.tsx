import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { FeedScene } from '../FeedScene';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('../../context/PetContext', () => ({
  usePet: () => ({
    pet: {
      id: 'pet-1',
      name: 'Buddy',
      type: 'dog',
      hunger: 50,
      energy: 80,
      happiness: 70,
      hygiene: 90,
      health: 100,
      money: 100,
      createdAt: Date.now(),
      clothes: { head: null, eyes: null, torso: null, paws: null },
    },
    feedPet: jest.fn(),
    earnMoney: jest.fn(),
  }),
}));

jest.mock('../../hooks/usePetActions', () => ({
  usePetActions: () => ({
    animationState: 'idle',
    message: '',
    isAnimating: false,
    performAction: jest.fn(),
    cancelAction: jest.fn(),
    DoubleRewardModal: () => null,
  }),
}));

jest.mock('../../hooks/useNavigationList', () => ({
  useNavigationList: (items: unknown[]) => ({
    currentItem: (items as { id: string }[])[0],
    currentIndex: 0,
    goToNext: jest.fn(),
    goToPrevious: jest.fn(),
    totalItems: (items as unknown[]).length,
    hasNext: true,
    hasPrevious: false,
    setIndex: jest.fn(),
  }),
}));

jest.mock('../../hooks/useBackButton', () => ({
  useBackButton: () => () => null,
}));

jest.mock('../../hooks/useResponsive', () => ({
  useResponsive: () => ({
    deviceType: 'phone',
    spacing: (val: number) => val,
    fs: (val: number) => val,
  }),
}));

jest.mock('../../config/responsive', () => ({
  ACTION_PET_SIZE: { phone: 120 },
  ACTION_BUTTON_SIZE: {
    phone: { buttonSize: 80, buttonEmoji: 36, buttonLabel: 12 },
  },
  SCENE_TEXT_SIZE: {
    phone: { titleSize: 20, messageSize: 14, labelSize: 12 },
  },
}));

jest.mock('../../utils/age', () => ({
  calculatePetAge: () => 2,
}));

jest.mock('../../components/ScreenHeader', () => {
   
  const { View, Text, TouchableOpacity } = require('react-native');
  return {
    ScreenHeader: ({
      title,
      onBackPress,
    }: {
      title: string;
      onBackPress?: () => void;
    }) => (
      <View>
        <Text>{title}</Text>
        {onBackPress && (
          <TouchableOpacity onPress={onBackPress} testID="screen-header-back">
            <Text>common.back</Text>
          </TouchableOpacity>
        )}
      </View>
    ),
  };
});

jest.mock('../../components/StatusCard', () => {
   
  const { View } = require('react-native');
  return { StatusCard: () => <View testID="status-card" /> };
});

jest.mock('../../components/PetRenderer', () => {
   
  const { View } = require('react-native');
  return { PetRenderer: () => <View testID="pet-renderer" /> };
});

const mockGoBack = jest.fn();
const mockCanGoBack = jest.fn(() => true);
const mockGetParent = jest.fn(() => ({
  goBack: jest.fn(),
  canGoBack: () => false,
  getParent: () => undefined,
}));

const mockNavigation = {
  goBack: mockGoBack,
  canGoBack: mockCanGoBack,
  getParent: mockGetParent,
   
} as unknown as any;

describe('FeedScene', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCanGoBack.mockReturnValue(true);
  });

  it('renders the title using the i18n key', () => {
    const { getByText } = render(<FeedScene navigation={mockNavigation} />);
    // Title uses t('feed.title') - mock returns the key
    expect(getByText('feed.title')).toBeTruthy();
  });

  it('navigates back when ScreenHeader back button is pressed', () => {
    const { getByTestId } = render(<FeedScene navigation={mockNavigation} />);
    fireEvent.press(getByTestId('screen-header-back'));
    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });

  it('uses parent navigation when canGoBack returns false', () => {
    const mockParentGoBack = jest.fn();
    mockCanGoBack.mockReturnValue(false);
    mockGetParent.mockReturnValue({
      goBack: mockParentGoBack,
      canGoBack: () => true,
      getParent: () => undefined,
    });

    const { getByTestId } = render(<FeedScene navigation={mockNavigation} />);
    fireEvent.press(getByTestId('screen-header-back'));
    expect(mockGoBack).not.toHaveBeenCalled();
    expect(mockParentGoBack).toHaveBeenCalledTimes(1);
  });
});
