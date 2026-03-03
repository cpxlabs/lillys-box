import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { HelpScreen } from '../HelpScreen';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

// minimal mocks for components used inside HelpScreen
jest.mock('../../components/ScreenHeader', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View, Text, TouchableOpacity } = require('react-native');
  return {
    ScreenHeader: ({ title, onBackPress }: { title: string; onBackPress?: () => void }) => (
      <View>
        <Text>{title}</Text>
        {onBackPress && (
          <TouchableOpacity onPress={onBackPress} testID="screen-header-back">
            <Text>back</Text>
          </TouchableOpacity>
        )}
      </View>
    ),
  };
});

const mockGoBack = jest.fn();
const mockCanGoBack = jest.fn(() => true);
const mockGetParent = jest.fn(() => undefined);
const navigation = { goBack: mockGoBack, canGoBack: mockCanGoBack, getParent: mockGetParent } as any;

describe('HelpScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCanGoBack.mockReturnValue(true);
  });

  it('renders title key', () => {
    const { getByText } = render(<HelpScreen navigation={navigation} />);
    expect(getByText('help.title')).toBeTruthy();
  });

  it('navigates back when header back pressed', () => {
    const { getByTestId } = render(<HelpScreen navigation={navigation} />);
    fireEvent.press(getByTestId('screen-header-back'));
    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });

  it('falls back to parent navigation if necessary', () => {
    const parentBack = jest.fn();
    mockCanGoBack.mockReturnValue(false);
    mockGetParent.mockReturnValue({ goBack: parentBack, canGoBack: () => true, getParent: () => undefined });

    const { getByTestId } = render(<HelpScreen navigation={navigation} />);
    fireEvent.press(getByTestId('screen-header-back'));
    expect(parentBack).toHaveBeenCalledTimes(1);
  });
});
