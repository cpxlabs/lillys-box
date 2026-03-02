import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { GifPicker } from '../GifPicker';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('../../utils/logger', () => ({
  logger: { error: jest.fn(), warn: jest.fn(), log: jest.fn() },
}));

const baseProps = {
  visible: true,
  onSelect: jest.fn(),
  onClose: jest.fn(),
};

describe('GifPicker', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the picker title when visible', () => {
    const { getByText } = render(<GifPicker {...baseProps} />);
    expect(getByText('review.gifPickerTitle')).toBeTruthy();
  });

  it('shows no-api-key message when TENOR key is absent', () => {
    // EXPO_PUBLIC_TENOR_API_KEY is not set in tests → shows the no-key UI
    const { getByText } = render(<GifPicker {...baseProps} />);
    expect(getByText('review.gifNoApiKey')).toBeTruthy();
  });

  it('calls onClose when close button is pressed', () => {
    const onClose = jest.fn();
    const { getByText } = render(<GifPicker {...baseProps} onClose={onClose} />);
    fireEvent.press(getByText('✕'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders without crashing when not visible', () => {
    const { toJSON } = render(<GifPicker {...baseProps} visible={false} />);
    // Modal with visible=false still renders the component tree but hides it
    expect(toJSON()).not.toBeNull();
  });
});
