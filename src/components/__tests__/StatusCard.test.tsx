import React from 'react';
import { render } from '@testing-library/react-native';
import { StatusCard } from '../StatusCard';
import { Pet } from '../../types';

// Mock dependencies
jest.mock('../../hooks/useResponsive', () => ({
  useResponsive: () => ({
    fs: (v: number) => v,
    spacing: (v: number) => v,
  }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      if (key === 'common.coins') return 'coins';
      return key;
    },
  }),
}));

jest.mock('../EnhancedStatusBar', () => ({
  EnhancedStatusBar: 'EnhancedStatusBar',
}));

describe('StatusCard', () => {
  const mockPet: Pet = {
    id: '1',
    name: 'Fluffy',
    type: 'cat',
    gender: 'female',
    coatColor: 'white',
    createdAt: new Date().toISOString(),
    health: 100,
    hunger: 100,
    hygiene: 100,
    energy: 100,
    happiness: 100,
    experience: 0,
    level: 1,
    money: 150,
    lastInteractionDate: new Date().toISOString(),
    isGuest: true,
    userId: 'guest',
  };

  it('renders pet name and age correctly', () => {
    const { getByText } = render(
      <StatusCard pet={mockPet} petName="🐱 Fluffy" petAge="1 year" />
    );
    expect(getByText('🐱 Fluffy')).toBeTruthy();
    expect(getByText('1 year')).toBeTruthy();
  });

  it('renders money with correct accessibility attributes', () => {
    const { getByLabelText } = render(
      <StatusCard pet={mockPet} petName="🐱 Fluffy" petAge="1 year" />
    );

    // This looks for the element with the accessibility label "150 coins"
    const moneyDisplay = getByLabelText('150 coins');

    expect(moneyDisplay).toBeTruthy();
    expect(moneyDisplay.props.accessibilityRole).toBe('text');
  });

  it('handles zero money correctly', () => {
    const poorPet = { ...mockPet, money: 0 };
    const { getByLabelText } = render(
      <StatusCard pet={poorPet} petName="🐱 Fluffy" petAge="1 year" />
    );

    const moneyDisplay = getByLabelText('0 coins');
    expect(moneyDisplay).toBeTruthy();
  });
});
