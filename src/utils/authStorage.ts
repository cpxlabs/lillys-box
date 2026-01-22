import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from './logger';

const AUTH_STORAGE_KEY = '@pet_care_game:auth_state';

export interface AuthState {
  user: UserInfo | null;
  isGuest: boolean;
}

export interface UserInfo {
  id: string;
  name: string | null;
  email: string | null;
  photo: string | null;
  familyName: string | null;
  givenName: string | null;
}

export const saveAuthState = async (user: UserInfo | null, isGuest: boolean): Promise<void> => {
  try {
    const authState: AuthState = {
      user,
      isGuest,
    };
    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
  } catch (error) {
    logger.error('Error saving auth state:', error);
  }
};

export const loadAuthState = async (): Promise<AuthState | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
    if (jsonValue != null) {
      return JSON.parse(jsonValue);
    }
    return null;
  } catch (error) {
    logger.error('Error loading auth state:', error);
    return null;
  }
};

export const clearAuthState = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (error) {
    logger.error('Error clearing auth state:', error);
  }
};
