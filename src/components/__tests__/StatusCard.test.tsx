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

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) => {
      if (options) {
        return `${key}:${JSON.stringify(options)}`;
      }
      return key;
    },
  }),
}));

// Mock EnhancedStatusBar to simplify testing
jest.mock('../EnhancedStatusBar', () => ({
  EnhancedStatusBar: 'EnhancedStatusBar',
}));

describe('StatusCard', () => {
  const mockPet: Pet = {
    id: 'test-pet-id',
    name: 'Fluffy',
    type: 'cat',
    gender: 'female',
    color: 'base',
    hunger: 80,
    hygiene: 80,
    energy: 80,
    happiness: 80,
    health: 100,
    money: 100,
    createdAt: Date.now(),
    lastInteraction: Date.now(),
    isSleeping: false,
    statsHistory: [],
    unlockedItems: [],
    clothing: {},
  };

  it('renders pet name and age', () => {
    const { getByText } = render(
      <StatusCard
        pet={mockPet}
        petName="🐱 Fluffy"
        petAge="1 year"
      />
    );
    expect(getByText('🐱 Fluffy')).toBeTruthy();
    expect(getByText('1 year')).toBeTruthy();
  });

  it('renders money with accessible label', () => {
    const { getByLabelText } = render(
      <StatusCard
        pet={mockPet}
        petName="🐱 Fluffy"
        petAge="1 year"
      />
    );

    // This should fail initially because the money display is split into two Texts
    // and doesn't have an accessibilityLabel on the container.
    // The label we expect after fix is: t('home.money', { amount: 100 })
    const label = `home.money:${JSON.stringify({ amount: 100 })}`;
    expect(getByLabelText(label)).toBeTruthy();
  });
});
