import React from 'react';
import { render } from '@testing-library/react-native';
import { StatusCard } from '../StatusCard';
import { Pet } from '../../types';

// Mock translations
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key === 'common.coins' ? 'coins' : key,
  }),
}));

// Mock EnhancedStatusBar to avoid rendering child components
jest.mock('../EnhancedStatusBar', () => ({
  EnhancedStatusBar: () => 'EnhancedStatusBar',
}));

describe('StatusCard', () => {
  const mockPet: Pet = {
    id: 'test-id',
    name: 'Test Pet',
    type: 'cat',
    color: 'base',
    gender: 'male',
    hunger: 50,
    hygiene: 50,
    money: 100,
    energy: 50,
    happiness: 50,
    health: 50,
    clothes: { head: null, eyes: null, torso: null, paws: null },
    createdAt: Date.now(),
    lastUpdated: Date.now(),
  };

  it('renders correctly with pet info', () => {
    const { getByText } = render(
      <StatusCard
        pet={mockPet}
        petName="Test Pet"
        petAge="1 year"
      />
    );

    expect(getByText('Test Pet')).toBeTruthy();
    expect(getByText('1 year')).toBeTruthy();
    expect(getByText('100')).toBeTruthy();
  });

  it('renders money container AS accessible text', () => {
    const { getByText, getByLabelText } = render(
      <StatusCard
        pet={mockPet}
        petName="Test Pet"
        petAge="1 year"
      />
    );

    // Should find the text '100'
    expect(getByText('100')).toBeTruthy();

    // Should find accessible label "100 coins"
    expect(getByLabelText('100 coins')).toBeTruthy();
  });
});
