import React from 'react';
import { render } from '@testing-library/react-native';
import { StatusCard } from '../StatusCard';
import { Pet } from '../../types';

// Mock dependencies
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key === 'common.coins' ? 'coins' : key }),
  initReactI18next: { type: '3rdParty', init: jest.fn() },
}));

jest.mock('../../hooks/useResponsive', () => ({
  useResponsive: () => ({
    deviceType: 'phone',
    fs: (v: number) => v,
    spacing: (v: number) => v,
  }),
}));

// Mock EnhancedStatusBar to avoid rendering children and simplify test
jest.mock('../EnhancedStatusBar', () => ({
  EnhancedStatusBar: () => null,
}));

describe('StatusCard', () => {
  const mockPet: Pet = {
    id: '1',
    name: 'Fluffy',
    type: 'cat',
    color: 'base',
    gender: 'male',
    money: 100,
    health: 100,
    hunger: 100,
    happiness: 100,
    energy: 100,
    hygiene: 100,
    clothes: { head: null, eyes: null, torso: null, paws: null },
    createdAt: Date.now(),
    lastUpdated: Date.now(),
  };

  it('renders correctly with accessibility attributes for money', () => {
    const { getByLabelText, getByText } = render(
      <StatusCard
        pet={mockPet}
        petName="Fluffy"
        petAge="1 year"
      />
    );

    // Verify visual elements
    expect(getByText('Fluffy')).toBeTruthy();
    expect(getByText('1 year')).toBeTruthy();
    expect(getByText('100')).toBeTruthy(); // The value

    // Verify accessibility grouping
    // The label should be "100 coins" based on our mock translation
    const moneyContainer = getByLabelText('100 coins');
    expect(moneyContainer).toBeTruthy();
    expect(moneyContainer.props.accessibilityRole).toBe('text');
  });

  it('handles zero money correctly in accessibility label', () => {
    const poorPet = { ...mockPet, money: 0 };
    const { getByLabelText } = render(
      <StatusCard
        pet={poorPet}
        petName="Fluffy"
        petAge="1 year"
      />
    );

    const moneyContainer = getByLabelText('0 coins');
    expect(moneyContainer).toBeTruthy();
  });
});
