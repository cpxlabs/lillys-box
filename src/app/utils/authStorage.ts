import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserInfo } from '../context/AuthContext';
import { logger } from '../../shared/utils/logger';

const AUTH_STATE_KEY = '@pet_care_game:auth_state';

export interface AuthState {
  user: UserInfo | null;
  isGuest: boolean;
}

/**
 * Save authentication state to AsyncStorage
 */
export const saveAuthState = async (
  user: UserInfo | null,
  isGuest: boolean
): Promise<void> => {
  try {
    const authState: AuthState = { user, isGuest };
    const jsonValue = JSON.stringify(authState);
    await AsyncStorage.setItem(AUTH_STATE_KEY, jsonValue);
  } catch (error) {
    logger.error('Error saving auth state:', error);
    throw error;
  }
};

/**
 * Load authentication state from AsyncStorage
 */
export const loadAuthState = async (): Promise<AuthState | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(AUTH_STATE_KEY);
    if (jsonValue != null) {
      return JSON.parse(jsonValue) as AuthState;
    }
    return null;
  } catch (error) {
    logger.error('Error loading auth state:', error);
    return null;
  }
};

/**
 * Clear authentication state from AsyncStorage
 */
export const clearAuthState = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(AUTH_STATE_KEY);
  } catch (error) {
    logger.error('Error clearing auth state:', error);
    throw error;
  }
};
