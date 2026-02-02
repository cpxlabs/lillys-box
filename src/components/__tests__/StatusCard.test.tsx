import React from 'react';
import { render } from '@testing-library/react-native';
import { StatusCard } from '../StatusCard';
import { Pet } from '../../types';

// Mock react-i18next
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
    fs: (val: number) => val,
    spacing: (val: number) => val,
    deviceType: 'mobile',
  }),
}));

// Mock EnhancedStatusBar since we are testing StatusCard, not its children
jest.mock('../EnhancedStatusBar', () => ({
  EnhancedStatusBar: 'EnhancedStatusBar',
}));

describe('StatusCard', () => {
  const mockPet: Pet = {
    id: '1',
    name: 'Fluffy',
    type: 'cat',
    gender: 'female',
    color: 'base',
    hunger: 100,
    hygiene: 100,
    energy: 100,
    happiness: 100,
    health: 100,
    money: 100,
    clothes: {
      head: null,
      eyes: null,
      torso: null,
      paws: null
    },
    createdAt: Date.now(),
    lastUpdated: Date.now(),
    isSleeping: false,
  };

  it('renders money with accessible label', () => {
    const { getByLabelText } = render(
      <StatusCard pet={mockPet} petName="Fluffy" petAge="1 year" />
    );

    // This checks if there is an element with the expected accessibility label
    expect(getByLabelText('100 coins')).toBeTruthy();
  });
});
