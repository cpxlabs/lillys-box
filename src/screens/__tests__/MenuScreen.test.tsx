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
    expect(getByText('Test User')).toBeTruthy();
    expect(getByText('test@example.com')).toBeTruthy();

    // Main Content
    expect(getByText('menu.title')).toBeTruthy();

    // Continue Button (Hero Card)
    expect(getByText('Fluffy')).toBeTruthy();
    expect(getByText('menu.continueHint')).toBeTruthy();

    // Secondary Actions
    expect(getByText('common.delete')).toBeTruthy();
  });

  it('renders correctly without a pet', () => {
    mockUsePet.mockReturnValue({
      pet: null,
      removePet: mockRemovePet,
    });

    const { getByText, queryByText } = render(<MenuScreen navigation={mockNavigation} />);

    // Create New Pet Button (Hero Card)
    expect(getByText('menu.createNewPet')).toBeTruthy();
    expect(getByText('Start a new adventure')).toBeTruthy();

    // Delete button should NOT be present
    expect(queryByText('common.delete')).toBeNull();
  });

  it('navigates to Home when continue is pressed', () => {
    const { getByText } = render(<MenuScreen navigation={mockNavigation} />);

    const continueBtn = getByText('Fluffy');
    fireEvent.press(continueBtn);

    expect(mockNavigation.navigate).toHaveBeenCalledWith('Home');
  });

  it('navigates to CreatePet when Create is pressed (no pet)', () => {
    mockUsePet.mockReturnValue({
        pet: null,
        removePet: mockRemovePet,
    });

    const { getByText } = render(<MenuScreen navigation={mockNavigation} />);

    const createBtn = getByText('menu.createNewPet');
    fireEvent.press(createBtn);

    expect(mockNavigation.navigate).toHaveBeenCalledWith('CreatePet');
  });

  it('shows delete confirmation modal', () => {
    const { getByText } = render(<MenuScreen navigation={mockNavigation} />);

    const deleteBtn = getByText('common.delete');
    fireEvent.press(deleteBtn);

    // Check if modal title appears
    expect(getByText('menu.deletePetModal.title')).toBeTruthy();
  });

  it('shows sign out confirmation', () => {
    const { getByLabelText, getByText } = render(<MenuScreen navigation={mockNavigation} />);

    const signOutBtn = getByLabelText('Sign Out');
    fireEvent.press(signOutBtn);

    // Check for modal message
    expect(getByText('Are you sure you want to sign out? Your pet data will be preserved.')).toBeTruthy();
  });
});
