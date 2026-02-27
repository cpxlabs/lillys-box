import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { VetScene } from '../VetScene';

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
      health: 60,
      money: 200,
      createdAt: Date.now(),
      clothes: { head: null, eyes: null, torso: null, paws: null },
    },
    visitVet: jest.fn(() => true),
  }),
}));

jest.mock('../../hooks/useRewardedAd', () => ({
  useRewardedAd: () => ({
    showRewardedAd: jest.fn(),
    isAdReady: false,
    isLoading: false,
  }),
}));

jest.mock('../../utils/petStats', () => ({
  needsVet: () => 'healthy',
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
  PET_SIZE_SMALL: { phone: 100 },
  SCENE_TEXT_SIZE: {
    phone: { titleSize: 20, messageSize: 14, labelSize: 12 },
  },
}));

jest.mock('../../config/gameBalance', () => ({
  GAME_BALANCE: {
    activities: {
      vet: {
        antibiotic: { cost: 50, healthRestore: 40 },
        antiInflammatory: { cost: 30, healthRestore: 20 },
      },
    },
  },
}));

jest.mock('../../utils/age', () => ({
  calculatePetAge: () => 1,
}));

jest.mock('../../utils/logger', () => ({
  logger: { error: jest.fn(), warn: jest.fn(), info: jest.fn() },
}));

jest.mock('../../components/ScreenHeader', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
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

jest.mock('../../components/PetRenderer', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as unknown as any;

describe('VetScene', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCanGoBack.mockReturnValue(true);
  });

  it('renders the title using the i18n key', () => {
    const { getByText } = render(<VetScene navigation={mockNavigation} />);
    // Title uses t('vet.title') - mock returns the key
    expect(getByText('vet.title')).toBeTruthy();
  });

  it('renders the back button using the i18n key', () => {
    const { getAllByText } = render(<VetScene navigation={mockNavigation} />);
    // Both the ScreenHeader mock and standalone back button use t('common.back')
    const backElements = getAllByText('common.back');
    expect(backElements.length).toBeGreaterThanOrEqual(1);
  });

  it('navigates back when ScreenHeader back button is pressed', () => {
    const { getByTestId } = render(<VetScene navigation={mockNavigation} />);
    fireEvent.press(getByTestId('screen-header-back'));
    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });

  it('navigates back when standalone back button is pressed', () => {
    const { getAllByText } = render(<VetScene navigation={mockNavigation} />);
    // Use the last 'common.back' element which is the standalone back button
    const backButtons = getAllByText('common.back');
    fireEvent.press(backButtons[backButtons.length - 1]);
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

    const { getByTestId } = render(<VetScene navigation={mockNavigation} />);
    fireEvent.press(getByTestId('screen-header-back'));
    expect(mockGoBack).not.toHaveBeenCalled();
    expect(mockParentGoBack).toHaveBeenCalledTimes(1);
  });
});
