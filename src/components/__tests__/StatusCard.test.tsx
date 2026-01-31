import React from 'react';
import { render } from '@testing-library/react-native';
import { StatusCard } from '../StatusCard';
import { Pet } from '../../types';

// Mock useTranslation
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      if (key === 'common.coins') return 'coins';
      return key;
    },
  }),
}));

// Mock useResponsive
jest.mock('../../hooks/useResponsive', () => ({
  useResponsive: () => ({
    fs: (size: number) => size,
    spacing: (size: number) => size,
    deviceType: 'phone',
  }),
}));

// Mock EnhancedStatusBar to avoid rendering child components
jest.mock('../EnhancedStatusBar', () => ({
  EnhancedStatusBar: () => null,
}));

describe('StatusCard', () => {
  const mockPet: Pet = {
    id: '123',
    name: 'Fluffy',
    type: 'cat',
    color: 'base',
    gender: 'female',
    hunger: 50,
    hygiene: 50,
    energy: 50,
    happiness: 50,
    health: 50,
    money: 100,
    clothes: { head: null, eyes: null, torso: null, paws: null },
    createdAt: Date.now(),
    lastUpdated: Date.now(),
  };

  it('renders pet name and age', () => {
    const { getByText } = render(
      <StatusCard pet={mockPet} petName="🐱 Fluffy" petAge="1 year" />
    );

    expect(getByText('🐱 Fluffy')).toBeTruthy();
    expect(getByText('1 year')).toBeTruthy();
  });

  it('displays money with accessible label', () => {
    const { getByLabelText } = render(
      <StatusCard pet={mockPet} petName="🐱 Fluffy" petAge="1 year" />
    );

    // This expects the container to have accessibilityLabel="100 coins"
    const moneyContainer = getByLabelText('100 coins');
    expect(moneyContainer).toBeTruthy();
    expect(moneyContainer.props.accessibilityRole).toBe('text');
  });
});
