import React from 'react';
import { render } from '@testing-library/react-native';
import { StarCatcherGameScreen } from '../StarCatcherGameScreen';
import { describeStandardBackNavigation } from '../../testUtils/backNavigation';

jest.mock('../../context/StarCatcherContext', () => ({
  useStarCatcher: () => ({ bestScore: 0, updateBestScore: jest.fn() }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describeStandardBackNavigation({
  screenName: 'StarCatcherGameScreen',
  renderScreen: (navigation) => render(<StarCatcherGameScreen navigation={navigation as any} />),
  getBackControl: ({ getByText }) => getByText(/common\.back/),
});
