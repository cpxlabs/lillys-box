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
    t: (key: string) => {
      if (key === 'common.year') return 'year';
      if (key === 'common.years') return 'years';
      return key;
    },
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

// Mock navigation
const mockNavigation = {
  goBack: jest.fn(),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as unknown as any;

describe('WardrobeScene', () => {
  it('renders the title correctly', () => {
    const { getByText } = render(<WardrobeScene navigation={mockNavigation} />);
    // The hardcoded title passed to ScreenHeader
    expect(getByText('👕 Armário')).toBeTruthy();
  });

  it('renders slot labels', () => {
    const { getByText } = render(<WardrobeScene navigation={mockNavigation} />);

    // Slots use hardcoded Portuguese labels
    expect(getByText('Cabeça')).toBeTruthy();
    expect(getByText('🎩')).toBeTruthy();
  });

  it('renders items for the selected slot', () => {
    const { getByText } = render(<WardrobeScene navigation={mockNavigation} />);

    // "None" option uses hardcoded Portuguese text
    expect(getByText('Nenhum')).toBeTruthy();

    // Check for the mocked item
    expect(getByText('Red Hat')).toBeTruthy();
  });

  it('can switch between slots', () => {
    const { getByText, queryByText } = render(<WardrobeScene navigation={mockNavigation} />);

    // Initially on head slot, Red Hat is visible
    expect(getByText('Red Hat')).toBeTruthy();

    // Switch to eyes slot (no items mocked for eyes)
    fireEvent.press(getByText('Olhos'));

    // Red Hat should no longer be visible since eyes slot has no items
    expect(queryByText('Red Hat')).toBeNull();
  });
});
