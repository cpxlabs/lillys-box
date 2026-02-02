import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

import './i18n'; // Initialize i18n
import { ErrorBoundary } from './components/ErrorBoundary';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { AdProvider, useAd } from './context/AdContext';
import AdService from './services/AdService';
import { useAuth } from './context/AuthContext';
import { LoginScreen } from './screens/LoginScreen';
import { GameSelectionScreen } from './screens/GameSelectionScreen';
import { GameContainer } from './screens/GameContainer';

// Register games (each game module registers itself)
import '../games/pet-care';

const Stack = createNativeStackNavigator();

const AppNavigator: React.FC = () => {
  const { user, isGuest, loading: authLoading } = useAuth();
  const { incrementScreenCount, shouldShowInterstitial, showInterstitialAd } = useAd();

  if (authLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#9b59b6" />
      </View>
    );
  }

  const isAuthenticated = user !== null || isGuest;

  return (
    <NavigationContainer
      onStateChange={() => {
        // Only track and show ads if user is authenticated
        if (isAuthenticated) {
          incrementScreenCount();

          if (shouldShowInterstitial()) {
            showInterstitialAd();
          }
        }
      }}
    >
      <Stack.Navigator
        initialRouteName={isAuthenticated ? 'GameSelection' : 'Login'}
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        {!isAuthenticated ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen
              name="GameSelection"
              component={GameSelectionScreen}
              options={{ animationEnabled: false }}
            />
            <Stack.Screen
              name="GameContainer"
              component={GameContainer}
              options={{ gestureEnabled: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  useEffect(() => {
    // Initialize AdMob on app startup
    AdService.initializeAds();
  }, []);

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <LanguageProvider>
          <AuthProvider>
            <AdProvider>
              <ToastProvider>
                <AppNavigator />
              </ToastProvider>
            </AdProvider>
          </AuthProvider>
        </LanguageProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f0ff',
  },
});