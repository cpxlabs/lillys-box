import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { WardrobeScene } from '../WardrobeScene';
import { ClothingSlot } from '../../types';

// Mock dependencies
jest.mock('../../context/PetContext', () => ({
  usePet: () => ({
    pet: {
      id: 'pet-123',
      name: 'Fluffy',
      type: 'cat',
      clothes: {
        head: null,
        eyes: null,
        torso: null,
        paws: null,
      },
      createdAt: Date.now(),
      money: 100,
      hunger: 100,
      hygiene: 100,
      energy: 100,
      happiness: 100,
      health: 100,
    },
    setClothing: jest.fn(),
  }),
}));

jest.mock('../../hooks/useBackButton', () => ({
  useBackButton: () => () => null,
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

jest.mock('../../components/StatusCard', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');
  return {
    StatusCard: () => <View testID="status-card" />,
  };
});

jest.mock('../../components/PetRenderer', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');
  return {
    PetRenderer: () => <View testID="pet-renderer" />,
  };
});

jest.mock('../../hooks/useResponsive', () => ({
  useResponsive: () => ({
    deviceType: 'phone',
    spacing: (val: number) => val,
    fs: (val: number) => val,
  }),
}));

jest.mock('../../config/responsive', () => ({
  PET_SIZE_SMALL: { phone: 100 },
  WARDROBE_SIZES: {
    phone: {
      slotPadding: 10,
      slotEmoji: 20,
      slotLabel: 14,
      itemWidth: 100,
      itemPadding: 10,
      itemEmoji: 20,
      itemName: 14,
    },
  },
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('../../utils/age', () => ({
  calculatePetAge: () => 1,
}));

// Mock data
jest.mock('../../data/clothingItems', () => ({
  getItemsBySlot: (slot: ClothingSlot) => {
    if (slot === 'head') {
      return [
        { id: 'hat_red', name: 'Red Hat', slot: 'head', asset: null },
      ];
    }
    return [];
  },
}));

const mockGoBack = jest.fn();
const mockCanGoBack = jest.fn(() => true);
const mockGetParent = jest.fn(() => ({
  goBack: jest.fn(),
  canGoBack: () => false,
  getParent: () => undefined,
}));

// Mock navigation with full useGameBack support
const mockNavigation = {
  goBack: mockGoBack,
  canGoBack: mockCanGoBack,
  getParent: mockGetParent,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as unknown as any;

describe('WardrobeScene', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCanGoBack.mockReturnValue(true);
  });

  it('renders the title using i18n key', () => {
    const { getByText } = render(<WardrobeScene navigation={mockNavigation} />);
    // Title uses t('wardrobe.title') - mock returns the key
    expect(getByText('wardrobe.title')).toBeTruthy();
  });

  it('renders slot labels using i18n keys', () => {
    const { getByText } = render(<WardrobeScene navigation={mockNavigation} />);
    // Slot labels use i18n keys via t('wardrobe.slots.head') etc.
    expect(getByText('wardrobe.slots.head')).toBeTruthy();
    expect(getByText('🎩')).toBeTruthy();
  });

  it('renders "none" option using i18n key', () => {
    const { getByText } = render(<WardrobeScene navigation={mockNavigation} />);
    // "None" uses t('wardrobe.none') - mock returns the key
    expect(getByText('wardrobe.none')).toBeTruthy();
  });

  it('renders items for the selected slot', () => {
    const { getByText } = render(<WardrobeScene navigation={mockNavigation} />);
    expect(getByText('Red Hat')).toBeTruthy();
  });

  it('can switch between slots', () => {
    const { getByText, queryByText } = render(<WardrobeScene navigation={mockNavigation} />);

    // Initially on head slot, Red Hat is visible
    expect(getByText('Red Hat')).toBeTruthy();

    // Switch to eyes slot (no items mocked for eyes) using i18n key
    fireEvent.press(getByText('wardrobe.slots.eyes'));

    // Red Hat should no longer be visible since eyes slot has no items
    expect(queryByText('Red Hat')).toBeNull();
  });

  it('navigates back when back button is pressed', () => {
    const { getByTestId } = render(<WardrobeScene navigation={mockNavigation} />);
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

    const { getByTestId } = render(<WardrobeScene navigation={mockNavigation} />);
    fireEvent.press(getByTestId('screen-header-back'));
    expect(mockGoBack).not.toHaveBeenCalled();
    expect(mockParentGoBack).toHaveBeenCalledTimes(1);
  });
});
