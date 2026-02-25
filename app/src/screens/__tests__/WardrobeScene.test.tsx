import React from 'react';
import { render } from '@testing-library/react-native';
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
  const { View, Text } = require('react-native');
  return {
    ScreenHeader: ({ title }: { title: string }) => <View><Text>{title}</Text></View>,
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

// Mock navigation
const mockNavigation = {
  goBack: jest.fn(),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as unknown as any;

describe('WardrobeScene', () => {
  it('renders correctly', () => {
    const { getByText } = render(<WardrobeScene navigation={mockNavigation} />);
    // Check for title (mocked t returns key)
    expect(getByText('wardrobe.title')).toBeTruthy();
  });

  it('renders slots with correct accessibility roles', () => {
    const { getByLabelText, getByText } = render(<WardrobeScene navigation={mockNavigation} />);

    // I expect 'wardrobe.slots.head' to be rendered
    expect(getByText('wardrobe.slots.head')).toBeTruthy();

    const headSlot = getByLabelText('wardrobe.slots.head');
    expect(headSlot.props.accessibilityRole).toBe('radio');
    expect(headSlot.props.accessibilityState.selected).toBe(true); // Default selected
  });

  it('renders items with correct accessibility roles', () => {
    const { getByLabelText, getByText } = render(<WardrobeScene navigation={mockNavigation} />);

    // Check for "None" option
    expect(getByText('wardrobe.none')).toBeTruthy();
    const noneButton = getByLabelText('wardrobe.none');
    expect(noneButton.props.accessibilityRole).toBe('button');

    // Check for item
    expect(getByText('Red Hat')).toBeTruthy();
    const itemButton = getByLabelText('Red Hat');
    expect(itemButton.props.accessibilityRole).toBe('button');
  });
});
