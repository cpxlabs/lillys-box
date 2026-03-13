import React from 'react';
import { render } from '@testing-library/react-native';
import { PetChefGameScreen } from '../PetChefGameScreen';
import { describeStandardBackNavigation } from '../../testUtils/backNavigation';

jest.mock('../../context/PetChefContext', () => ({
  usePetChef: () => ({ bestScore: 0, updateBestScore: jest.fn() }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describeStandardBackNavigation({
  screenName: 'PetChefGameScreen',
  renderScreen: (navigation) => render(<PetChefGameScreen navigation={navigation as any} />),
  getBackControl: ({ getByText }) => getByText(/common\.back/),
});
