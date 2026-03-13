import React from 'react';
import { render } from '@testing-library/react-native';
import { PaintSplashGameScreen } from '../PaintSplashGameScreen';
import { describeStandardBackNavigation } from '../../testUtils/backNavigation';

jest.mock('../../context/PaintSplashContext', () => ({
  usePaintSplash: () => ({ bestScore: 0, updateBestScore: jest.fn() }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describeStandardBackNavigation({
  screenName: 'PaintSplashGameScreen',
  renderScreen: (navigation) => render(<PaintSplashGameScreen navigation={navigation as any} />),
  getBackControl: ({ getByText }) => getByText(/common\.back/),
});
