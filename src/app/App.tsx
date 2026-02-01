import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

import './i18n'; // Initialize i18n
import { ErrorBoundary } from './components/ErrorBoundary';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { PetProvider, usePet } from '../games/pet-care/context/PetContext';
import { ToastProvider } from './context/ToastContext';
import { AdProvider, useAd } from './context/AdContext';
import AdService from './services/AdService';
import { useAuth } from './context/AuthContext';
import { MenuScreen } from '../games/pet-care/screens/MenuScreen';
import { LoginScreen } from './screens/LoginScreen';
import { CreatePetScreen } from '../games/pet-care/screens/CreatePetScreen';
import { HomeScreen } from '../games/pet-care/screens/HomeScreen';
import { FeedScene } from '../games/pet-care/screens/FeedScene';
import { BathScene } from '../games/pet-care/screens/BathScene';
import { WardrobeScene } from '../games/pet-care/screens/WardrobeScene';
import { PlayScene } from '../games/pet-care/screens/PlayScene';
import { SleepScene } from '../games/pet-care/screens/SleepScene';
import { VetScene } from '../games/pet-care/screens/VetScene';

const Stack = createNativeStackNavigator();

const AppNavigator: React.FC = () => {
  const { isLoading: petLoading } = usePet();
  const { user, isGuest, loading: authLoading } = useAuth();
  const { incrementScreenCount, shouldShowInterstitial, showInterstitialAd } = useAd();

  const isLoading = authLoading || petLoading;

  if (isLoading) {
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
        initialRouteName={isAuthenticated ? 'Menu' : 'Login'}
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        {!isAuthenticated ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name="Menu" component={MenuScreen} />
            <Stack.Screen name="CreatePet" component={CreatePetScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Feed" component={FeedScene} />
            <Stack.Screen name="Bath" component={BathScene} />
            <Stack.Screen name="Wardrobe" component={WardrobeScene} />
            <Stack.Screen name="Play" component={PlayScene} />
            <Stack.Screen name="Sleep" component={SleepScene} />
            <Stack.Screen name="Vet" component={VetScene} />
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
            <PetProvider>
              <AdProvider>
                <ToastProvider>
                  <AppNavigator />
                </ToastProvider>
              </AdProvider>
            </PetProvider>
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