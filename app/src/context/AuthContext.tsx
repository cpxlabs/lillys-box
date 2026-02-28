import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { logger } from '../utils/logger';

// Import Google Sign-In only for mobile (not web)
let GoogleSignin: any = null;
let statusCodes: any = null;

if (Platform.OS !== 'web') {
  const googleSignInModule = require('@react-native-google-signin/google-signin');
  GoogleSignin = googleSignInModule.GoogleSignin;
  statusCodes = googleSignInModule.statusCodes;
}

export interface UserInfo {
  id: string;
  email: string;
  name: string;
  photo?: string;
}

export interface AuthContextType {
  user: UserInfo | null;
  isGuest: boolean;
  loading: boolean;
  error: string | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  playAsGuest: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = '@pet_care_game:auth_state';

/**
 * AuthProvider component that manages authentication state globally
 * Supports Google Sign-In and guest mode
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Initialize Google Sign-In (mobile) or fallback (web) and restore auth state on app launch
   */
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Initialize Google Sign-In (mobile only)
        if (Platform.OS !== 'web' && GoogleSignin) {
          await GoogleSignin.configure({
            webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? '',
            offlineAccess: true,
            forceCodeForRefreshToken: true,
          });
        } else if (Platform.OS === 'web') {
          logger.info('Web platform detected - using fallback auth mode (no OAuth)');
        }

        // Restore auth state from AsyncStorage
        const savedAuthState = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
        if (savedAuthState) {
          const { user: savedUser, isGuest: savedIsGuest } = JSON.parse(savedAuthState);
          if (savedIsGuest) {
            setIsGuest(true);
          } else if (savedUser) {
            setUser(savedUser);
          }
        }

        setLoading(false);
      } catch (err) {
        // On web, initialization errors are expected (GoogleSignin not available)
        if (Platform.OS === 'web') {
          logger.info('Web platform - auth initialized in fallback mode');
        } else {
          logger.error('Error initializing auth:', err);
          setError('Failed to initialize authentication');
        }
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /**
   * Sign in with Google (mobile) or use web fallback (local-only demo user)
   */
  const signIn = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      if (Platform.OS === 'web') {
        // Web fallback: Create a demo user for testing
        const demoUser: UserInfo = {
          id: 'web-demo-user-' + Date.now(),
          email: 'demo@petcaregame.local',
          name: 'Demo User (Web)',
          photo: undefined,
        };
        setUser(demoUser);
        setIsGuest(false);
        // Save auth state
        await AsyncStorage.setItem(
          AUTH_STORAGE_KEY,
          JSON.stringify({ user: demoUser, isGuest: false })
        );
        logger.info('Web: Demo user created for local testing');
      } else if (GoogleSignin) {
        // Mobile: Use actual Google Sign-In
        // Check if device is online and has Google Play Services
        const isSignedIn = await GoogleSignin.isSignedIn();
        if (isSignedIn) {
          // Already signed in, get current user
          const userInfo = await GoogleSignin.signInSilently();
          const userInfoParsed = {
            id: userInfo.user.id,
            email: userInfo.user.email,
            name: userInfo.user.name || 'User',
            photo: userInfo.user.photo || undefined,
          };
          setUser(userInfoParsed);
          setIsGuest(false);
          // Save auth state
          await AsyncStorage.setItem(
            AUTH_STORAGE_KEY,
            JSON.stringify({ user: userInfoParsed, isGuest: false })
          );
        } else {
          // Trigger sign-in flow
          const userInfo = await GoogleSignin.signIn();
          const userInfoParsed = {
            id: userInfo.user.id,
            email: userInfo.user.email,
            name: userInfo.user.name || 'User',
            photo: userInfo.user.photo || undefined,
          };
          setUser(userInfoParsed);
          setIsGuest(false);
          // Save auth state
          await AsyncStorage.setItem(
            AUTH_STORAGE_KEY,
            JSON.stringify({ user: userInfoParsed, isGuest: false })
          );
        }
      }
    } catch (err: unknown) {
      const error = err as Record<string, unknown>;

      // Handle specific error cases (mobile only)
      if (Platform.OS !== 'web') {
        if (error.code === statusCodes?.SIGN_IN_CANCELLED) {
          logger.warn('Sign in cancelled');
          setError('Sign in was cancelled');
        } else if (error.code === statusCodes?.IN_PROGRESS) {
          logger.warn('Sign in already in progress');
          setError('Sign in already in progress');
        } else if (error.code === statusCodes?.PLAY_SERVICES_NOT_AVAILABLE) {
          logger.warn('Google Play Services not available');
          setError('Google Play Services is not available');
        } else {
          logger.error('Sign in error:', err);
          setError('Failed to sign in. Please try again.');
        }
      } else {
        logger.error('Web sign in error:', err);
        setError('Failed to sign in on web. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sign out from Google (mobile) or clear local session (web)
   */
  const signOut = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // Sign out from Google (mobile only)
      if (Platform.OS !== 'web' && GoogleSignin) {
        await GoogleSignin.signOut();
      } else if (Platform.OS === 'web') {
        logger.info('Web: Demo user session cleared');
      }

      setUser(null);
      setIsGuest(false);

      // Clear auth state from AsyncStorage
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (err) {
      logger.error('Sign out error:', err);
      setError('Failed to sign out. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Enable guest mode
   */
  const playAsGuest = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      setUser(null);
      setIsGuest(true);

      // Save guest mode state
      await AsyncStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({ user: null, isGuest: true })
      );
    } catch (err) {
      logger.error('Guest mode error:', err);
      setError('Failed to enable guest mode');
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isGuest,
    loading,
    error,
    signIn,
    signOut,
    playAsGuest,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook to use AuthContext in components
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
