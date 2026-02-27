import React, { useEffect } from 'react';
import { ActivityIndicator, Platform, View, StyleSheet } from 'react-native';
import { Stack, useRouter, useSegments, usePathname } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Sentry from '@sentry/react-native';
import { useNavigationContainerRef } from 'expo-router';

import '../src/i18n';
import { registerAllGames } from '../src/gameRegistrations';
import { ErrorBoundary } from '../src/components/ErrorBoundary';
import { LanguageProvider } from '../src/context/LanguageContext';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { ToastProvider } from '../src/context/ToastContext';
import { AdProvider, useAd } from '../src/context/AdContext';
import AdService from '../src/services/AdService';
import ErrorService from '../src/services/ErrorService';

registerAllGames();
ErrorService.init();

function AuthRedirect() {
  const { user, isGuest, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;

    const isAuthenticated = user !== null || isGuest;
    const onLoginPage = segments[0] === 'login';

    if (!isAuthenticated && !onLoginPage) {
      router.replace('/login');
    } else if (isAuthenticated && onLoginPage) {
      router.replace('/');
    }
  }, [user, isGuest, loading, segments, router]);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#9b59b6" />
      </View>
    );
  }

  return null;
}

function AdTracker() {
  const pathname = usePathname();
  const { user, isGuest } = useAuth();
  const { incrementScreenCount, shouldShowInterstitial, showInterstitialAd } = useAd();
  const isAuthenticated = user !== null || isGuest;

  useEffect(() => {
    if (isAuthenticated) {
      incrementScreenCount();
      if (shouldShowInterstitial()) {
        showInterstitialAd();
      }
    }
  }, [pathname]);

  return null;
}

function RootLayout() {
  const ref = useNavigationContainerRef();

  useEffect(() => {
    if (Platform.OS !== 'web' && ref?.current && Sentry.reactNavigationIntegration) {
      Sentry.reactNavigationIntegration.registerNavigationContainer(ref);
    }
  }, [ref]);

  useEffect(() => {
    AdService.initializeAds();
  }, []);

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <LanguageProvider>
          <AuthProvider>
            <AdProvider>
              <ToastProvider>
                <AuthRedirect />
                <AdTracker />
                <Stack
                  screenOptions={{
                    headerShown: false,
                    animation: 'slide_from_right',
                  }}
                >
                  <Stack.Screen name="index" />
                  <Stack.Screen name="login" />
                  <Stack.Screen name="game/[gameId]" />
                </Stack>
              </ToastProvider>
            </AdProvider>
          </AuthProvider>
        </LanguageProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}

export default Platform.OS === 'web' ? RootLayout : Sentry.wrap(RootLayout);

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f0ff',
  },
});
