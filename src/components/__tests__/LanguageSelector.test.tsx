import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { LanguageSelector } from '../LanguageSelector';
import { useLanguage } from '../../context/LanguageContext';

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      if (key === 'languages.en') return 'English';
      if (key === 'languages.pt-BR') return 'Portuguese (Brazil)';
      return key;
    },
  }),
  initReactI18next: {
    type: '3rdParty',
    init: jest.fn(),
  },
}));

// Mock context
jest.mock('../../context/LanguageContext', () => ({
  useLanguage: jest.fn(),
}));

describe('LanguageSelector', () => {
  const mockSetLanguage = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useLanguage as jest.Mock).mockReturnValue({
      language: 'en',
      setLanguage: mockSetLanguage,
    });
  });

  it('renders language options with correct accessibility props', () => {
    const { getByLabelText } = render(<LanguageSelector />);

    // Check if English option is rendered and selected
    const enButton = getByLabelText('English');
    expect(enButton.props.accessibilityRole).toBe('radio');
    expect(enButton.props.accessibilityState).toEqual({ selected: true });

    // Check if Portuguese option is rendered and not selected
    const ptButton = getByLabelText('Portuguese (Brazil)');
    expect(ptButton.props.accessibilityRole).toBe('radio');
    expect(ptButton.props.accessibilityState).toEqual({ selected: false });
  });

  it('calls setLanguage when an option is pressed', () => {
    const { getByLabelText } = render(<LanguageSelector />);

    const ptButton = getByLabelText('Portuguese (Brazil)');
    fireEvent.press(ptButton);

    expect(mockSetLanguage).toHaveBeenCalledWith('pt-BR');
  });

  it('updates selection state when language changes', () => {
    (useLanguage as jest.Mock).mockReturnValue({
      language: 'pt-BR',
      setLanguage: mockSetLanguage,
    });

    const { getByLabelText } = render(<LanguageSelector />);

    const enButton = getByLabelText('English');
    expect(enButton.props.accessibilityState).toEqual({ selected: false });

    const ptButton = getByLabelText('Portuguese (Brazil)');
    expect(ptButton.props.accessibilityState).toEqual({ selected: true });
  });
});
