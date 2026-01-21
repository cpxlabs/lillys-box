import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { View, Text, TouchableOpacity } from 'react-native';
import { AuthProvider, useAuth } from '../AuthContext';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock GoogleSignin
jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: {
    configure: jest.fn(),
    hasPlayServices: jest.fn(() => Promise.resolve(true)),
    signIn: jest.fn(() => Promise.resolve({
      user: {
        id: 'google-user-id',
        name: 'Google User',
        email: 'google@example.com',
        photo: 'https://example.com/photo.jpg',
        familyName: 'User',
        givenName: 'Google',
      }
    })),
    signOut: jest.fn(() => Promise.resolve()),
    isSignedIn: jest.fn(() => Promise.resolve(false)),
  },
  statusCodes: {
    SIGN_IN_CANCELLED: 'SIGN_IN_CANCELLED',
    IN_PROGRESS: 'IN_PROGRESS',
    PLAY_SERVICES_NOT_AVAILABLE: 'PLAY_SERVICES_NOT_AVAILABLE',
  },
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
}));

// Test component to consume context
const TestComponent = () => {
  const { user, isGuest, signIn, signOut, playAsGuest } = useAuth();

  return (
    <View>
      {user ? <Text>User: {user.name}</Text> : null}
      {isGuest ? <Text>Guest Mode</Text> : null}
      <TouchableOpacity onPress={signIn} testID="signInBtn">
        <Text>Sign In</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={signOut} testID="signOutBtn">
        <Text>Sign Out</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={playAsGuest} testID="guestBtn">
        <Text>Guest</Text>
      </TouchableOpacity>
    </View>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('provides initial state', async () => {
    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(getByTestId('signInBtn')).toBeTruthy();
  });

  it('calls GoogleSignin.signIn when signIn is called', async () => {
    const { getByTestId } = render(
        <AuthProvider>
            <TestComponent />
        </AuthProvider>
    );

    fireEvent.press(getByTestId('signInBtn'));

    await waitFor(() => {
        expect(GoogleSignin.signIn).toHaveBeenCalled();
    });
  });

   it('sets guest mode when playAsGuest is called', async () => {
      const { getByTestId } = render(
          <AuthProvider>
              <TestComponent />
          </AuthProvider>
      );

      fireEvent.press(getByTestId('guestBtn'));

      await waitFor(() => {
          expect(AsyncStorage.setItem).toHaveBeenCalledWith(
              '@pet_care_game:auth_state',
              expect.stringContaining('"isGuest":true')
          );
      });
    });
});
