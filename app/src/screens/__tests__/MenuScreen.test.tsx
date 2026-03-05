import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { MenuScreen } from '../MenuScreen';

// Mock dependencies
const mockRemovePet = jest.fn();
const mockSignOut = jest.fn();
const mockUsePet = jest.fn();

jest.mock('../../context/PetContext', () => ({
  usePet: () => mockUsePet(),
}));

jest.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    user: { name: 'Test User', email: 'test@example.com', photo: 'http://test.com/photo.jpg' },
    isGuest: false,
    signOut: mockSignOut,
  }),
}));

jest.mock('../../context/LanguageContext', () => ({
  useLanguage: () => ({
    language: 'en',
    setLanguage: jest.fn(),
  }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, params: any) => {
      if (key === 'menu.continueWith') return `Continue with ${params.name} ${params.emoji}`;
      if (key === 'menu.welcomeUser') return `Welcome, ${params.name}`;
      if (key === 'menu.signOut') return 'Sign Out';
      if (key === 'menu.signOutModal.confirmText') return 'Sign Out';
      if (key === 'menu.signOutModal.message') return 'Are you sure you want to sign out? Your pet data will be preserved.';
      return key;
    },
  }),
}));

jest.mock('@expo/vector-icons', () => ({
  Feather: 'Feather',
}));

jest.mock('../../components/WebSafeIcon', () => ({
  WebSafeIcon: 'WebSafeIcon',
}));

jest.mock('../../components/LanguageSelector', () => ({
  LanguageSelector: () => 'LanguageSelector',
}));

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
} as unknown as any;

describe('MenuScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default: Pet exists
    mockUsePet.mockReturnValue({
      pet: { name: 'Fluffy', type: 'cat' },
      removePet: mockRemovePet,
    });
  });

  it('renders correctly with a pet', () => {
    const { getByText } = render(<MenuScreen navigation={mockNavigation} />);

    // Header
    expect(getByText('Welcome, Test User')).toBeTruthy();
    expect(getByText('test@example.com')).toBeTruthy();

    // Main Content
    expect(getByText('menu.title')).toBeTruthy();

    // Continue Button with pet name
    expect(getByText('Continue with Fluffy 🐱')).toBeTruthy();

    // Delete button
    expect(getByText('menu.deletePet')).toBeTruthy();
  });

  it('renders correctly without a pet', () => {
    mockUsePet.mockReturnValue({
      pet: null,
      removePet: mockRemovePet,
    });

    const { getByText, queryByText } = render(<MenuScreen navigation={mockNavigation} />);

    // Create New Pet Button
    expect(getByText('menu.createNewPet')).toBeTruthy();

    // Delete button should NOT be present
    expect(queryByText('menu.deletePet')).toBeNull();
  });

  it('navigates to Home when continue is pressed', () => {
    const { getByText } = render(<MenuScreen navigation={mockNavigation} />);

    fireEvent.press(getByText('Continue with Fluffy 🐱'));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('Home');
  });

  it('navigates to CreatePet when Create is pressed (no pet)', () => {
    mockUsePet.mockReturnValue({
        pet: null,
        removePet: mockRemovePet,
    });

    const { getByText } = render(<MenuScreen navigation={mockNavigation} />);

    fireEvent.press(getByText('menu.createNewPet'));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('CreatePet');
  });

  it('shows delete confirmation modal', () => {
    const { getByText } = render(<MenuScreen navigation={mockNavigation} />);

    fireEvent.press(getByText('menu.deletePet'));

    // Check if modal title appears
    expect(getByText('menu.deletePetModal.title')).toBeTruthy();
  });

  it('shows sign out confirmation', () => {
    const { getAllByText, getByText } = render(<MenuScreen navigation={mockNavigation} />);

    // Sign out button uses plain text; press the first "Sign Out" (the button, not the modal confirm)
    const signOutElements = getAllByText('Sign Out');
    fireEvent.press(signOutElements[0]);

    // Check for modal message
    expect(getByText('Are you sure you want to sign out? Your pet data will be preserved.')).toBeTruthy();
  });
});
