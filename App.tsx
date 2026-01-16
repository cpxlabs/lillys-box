import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

import './src/i18n'; // Initialize i18n
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { LanguageProvider } from './src/context/LanguageContext';
import { PetProvider, usePet } from './src/context/PetContext';
import { ToastProvider } from './src/context/ToastContext';
import { AdProvider, useAd } from './src/context/AdContext';
import AdService from './src/services/AdService';
import { MenuScreen } from './src/screens/MenuScreen';
import { CreatePetScreen } from './src/screens/CreatePetScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { FeedScene } from './src/screens/FeedScene';
import { BathScene } from './src/screens/BathScene';
import { WardrobeScene } from './src/screens/WardrobeScene';
import { PlayScene } from './src/screens/PlayScene';
import { SleepScene } from './src/screens/SleepScene';
import { VetScene } from './src/screens/VetScene';

const Stack = createNativeStackNavigator();

const AppNavigator: React.FC = () => {
  const { isLoading } = usePet();
  const { incrementScreenCount, shouldShowInterstitial, showInterstitialAd } = useAd();

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#9b59b6" />
      </View>
    );
  }

  return (
    <NavigationContainer
      onStateChange={() => {
        // Track screen transitions for interstitial frequency
        incrementScreenCount();
        
        // Show interstitial if conditions are met
        if (shouldShowInterstitial()) {
          showInterstitialAd();
        }
      }}
    >
      <Stack.Navigator
        initialRouteName="Menu"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="Menu" component={MenuScreen} />
        <Stack.Screen name="CreatePet" component={CreatePetScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Feed" component={FeedScene} />
        <Stack.Screen name="Bath" component={BathScene} />
        <Stack.Screen name="Wardrobe" component={WardrobeScene} />
        <Stack.Screen name="Play" component={PlayScene} />
        <Stack.Screen name="Sleep" component={SleepScene} />
        <Stack.Screen name="Vet" component={VetScene} />
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
          <PetProvider>
            <AdProvider>
              <ToastProvider>
                <AppNavigator />
              </ToastProvider>
            </AdProvider>
          </PetProvider>
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