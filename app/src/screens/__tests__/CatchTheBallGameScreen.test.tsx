import React from 'react';
import { render } from '@testing-library/react-native';
import { CatchTheBallGameScreen } from '../CatchTheBallGameScreen';
import { describeStandardBackNavigation } from '../../testUtils/backNavigation';

jest.mock('../../context/CatchTheBallContext', () => ({
  useCatchTheBall: () => ({ bestScore: 0, updateBestScore: jest.fn() }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describeStandardBackNavigation({
  screenName: 'CatchTheBallGameScreen',
  renderScreen: (navigation) => render(<CatchTheBallGameScreen navigation={navigation as any} />),
  getBackControl: ({ getByText }) => getByText(/common\.back/),
});
