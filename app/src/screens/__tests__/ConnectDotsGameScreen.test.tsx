import React from 'react';
import { render } from '@testing-library/react-native';
import { ConnectDotsGameScreen } from '../ConnectDotsGameScreen';
import { describeStandardBackNavigation } from '../../testUtils/backNavigation';

jest.mock('../../context/ConnectDotsContext', () => ({
  useConnectDots: () => ({ bestScore: 0, updateBestScore: jest.fn() }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describeStandardBackNavigation({
  screenName: 'ConnectDotsGameScreen',
  renderScreen: (navigation) => render(<ConnectDotsGameScreen navigation={navigation as any} />),
  getBackControl: ({ getByText }) => getByText(/common\.back/),
});
