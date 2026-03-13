import React from 'react';
import { render } from '@testing-library/react-native';
import { SnackStackGameScreen } from '../SnackStackGameScreen';
import { describeStandardBackNavigation } from '../../testUtils/backNavigation';

jest.mock('../../context/SnackStackContext', () => ({
  useSnackStack: () => ({ bestScore: 0, updateBestScore: jest.fn() }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describeStandardBackNavigation({
  screenName: 'SnackStackGameScreen',
  renderScreen: (navigation) => render(<SnackStackGameScreen navigation={navigation as any} />),
  getBackControl: ({ getByText }) => getByText(/common\.back/),
});
