import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { GoogleSignin, User, statusCodes } from '@react-native-google-signin/google-signin';
import { saveAuthState, loadAuthState, clearAuthState, UserInfo } from '../utils/authStorage';
import { logger } from '../utils/logger';

// Re-export UserInfo type
export type { UserInfo } from '../utils/authStorage';

interface AuthContextType {
  user: UserInfo | null;
  loading: boolean;
  isGuest: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  playAsGuest: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isGuest, setIsGuest] = useState<boolean>(false);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Initialize Google Sign In
        GoogleSignin.configure({
          // scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
          webClientId: 'PLACEHOLDER_WEB_CLIENT_ID', // client ID of type WEB for your server. Required to get the idToken on the user object, and for offline access.
          offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
        });

        // Restore auth state
        const savedState = await loadAuthState();
        if (savedState) {
          setUser(savedState.user);
          setIsGuest(savedState.isGuest);
        } else {
            // Check if user is signed in with Google already (silent login)
            const isSignedIn = await GoogleSignin.isSignedIn();
            if (isSignedIn) {
              const currentUser = await GoogleSignin.getCurrentUser();
              if (currentUser) {
                setUser(currentUser.user);
                setIsGuest(false);
                await saveAuthState(currentUser.user, false);
              }
            }
        }
      } catch (error) {
        logger.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const signIn = async () => {
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      setUser(userInfo.user);
      setIsGuest(false);
      await saveAuthState(userInfo.user, false);
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        logger.info('User cancelled the login flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        logger.info('Operation (e.g. sign in) is in progress already');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        logger.error('Play services not available or outdated');
      } else {
        logger.error('Some other error happened during sign in', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      if (!isGuest) {
        await GoogleSignin.signOut();
      }
      setUser(null);
      setIsGuest(false);
      await clearAuthState();
    } catch (error) {
      logger.error('Sign out error:', error);
    } finally {
      setLoading(false);
    }
  };

  const playAsGuest = async () => {
    setLoading(true);
    try {
      setUser(null);
      setIsGuest(true);
      await saveAuthState(null, true);
    } catch (error) {
      logger.error('Play as guest error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isGuest, signIn, signOut, playAsGuest }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
