import React from 'react';
import { render } from '@testing-library/react-native';
import { BalloonFloatGameScreen } from '../BalloonFloatGameScreen';
import { describeStandardBackNavigation } from '../../testUtils/backNavigation';

jest.mock('../../context/BalloonFloatContext', () => ({
  useBalloonFloat: () => ({ bestScore: 0, updateBestScore: jest.fn() }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describeStandardBackNavigation({
  screenName: 'BalloonFloatGameScreen',
  renderScreen: (navigation) => render(<BalloonFloatGameScreen navigation={navigation as any} />),
  getBackControl: ({ getByText }) => getByText(/common\.back/),
});
