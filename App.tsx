import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

import './src/i18n'; // Initialize i18n
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { LanguageProvider } from './src/context/LanguageContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { ToastProvider } from './src/context/ToastContext';
import { AdProvider, useAd } from './src/context/AdContext';
import AdService from './src/services/AdService';
import { LoginScreen } from './src/screens/LoginScreen';
import { GameSelectionScreen } from './src/screens/GameSelectionScreen';
import { GameContainer } from './src/screens/GameContainer';
import { gameRegistry } from './src/registry/GameRegistry';
import { PetProvider } from './src/context/PetContext';
import { PetGameNavigator } from './src/screens/PetGameNavigator';
import { MuitoProvider } from './src/context/MuitoContext';
import { MuitoNavigator } from './src/screens/MuitoNavigator';
import { ColorTapProvider } from './src/context/ColorTapContext';
import { ColorTapNavigator } from './src/screens/ColorTapNavigator';
import { MemoryMatchProvider } from './src/context/MemoryMatchContext';
import { MemoryMatchNavigator } from './src/screens/MemoryMatchNavigator';
import { PetRunnerProvider } from './src/context/PetRunnerContext';
import { PetRunnerNavigator } from './src/screens/PetRunnerNavigator';
import { SimonSaysProvider } from './src/context/SimonSaysContext';
import { SimonSaysNavigator } from './src/screens/SimonSaysNavigator';
import { DressUpRelayProvider } from './src/context/DressUpRelayContext';
import { DressUpRelayNavigator } from './src/screens/DressUpRelayNavigator';
import { ColorMixerProvider } from './src/context/ColorMixerContext';
import { ColorMixerNavigator } from './src/screens/ColorMixerNavigator';
import { FeedThePetProvider } from './src/context/FeedThePetContext';
import { FeedThePetNavigator } from './src/screens/FeedThePetNavigator';
import { WhackAMoleProvider } from './src/context/WhackAMoleContext';
import { WhackAMoleNavigator } from './src/screens/WhackAMoleNavigator';
import { CatchTheBallProvider } from './src/context/CatchTheBallContext';
import { CatchTheBallNavigator } from './src/screens/CatchTheBallNavigator';
import { SlidingPuzzleProvider } from './src/context/SlidingPuzzleContext';
import { SlidingPuzzleNavigator } from './src/screens/SlidingPuzzleNavigator';

// Register the pet-care game
gameRegistry.register({
  id: 'pet-care',
  nameKey: 'selectGame.petCare.name',
  descriptionKey: 'selectGame.petCare.description',
  emoji: '🐾',
  category: 'pet',
  navigator: PetGameNavigator,
  providers: [PetProvider],
  isEnabled: true,
});

// Register the muito counting game
gameRegistry.register({
  id: 'muito',
  nameKey: 'selectGame.muito.name',
  descriptionKey: 'selectGame.muito.description',
  emoji: '🔢',
  category: 'casual',
  navigator: MuitoNavigator,
  providers: [MuitoProvider],
  isEnabled: true,
});

// Register the color tap game
gameRegistry.register({
  id: 'color-tap',
  nameKey: 'selectGame.colorTap.name',
  descriptionKey: 'selectGame.colorTap.description',
  emoji: '🎨',
  category: 'casual',
  navigator: ColorTapNavigator,
  providers: [ColorTapProvider],
  isEnabled: true,
});

// Register the memory match game
gameRegistry.register({
  id: 'memory-match',
  nameKey: 'selectGame.memoryMatch.name',
  descriptionKey: 'selectGame.memoryMatch.description',
  emoji: '🧠',
  category: 'puzzle',
  navigator: MemoryMatchNavigator,
  providers: [MemoryMatchProvider],
  isEnabled: true,
});

// Register the pet runner game
gameRegistry.register({
  id: 'pet-runner',
  nameKey: 'selectGame.petRunner.name',
  descriptionKey: 'selectGame.petRunner.description',
  emoji: '🏃',
  category: 'adventure',
  navigator: PetRunnerNavigator,
  providers: [PetRunnerProvider],
  isEnabled: true,
});

// Register the simon says game
gameRegistry.register({
  id: 'simon-says',
  nameKey: 'selectGame.simonSays.name',
  descriptionKey: 'selectGame.simonSays.description',
  emoji: '🎮',
  category: 'puzzle',
  navigator: SimonSaysNavigator,
  providers: [SimonSaysProvider],
  isEnabled: true,
});

// Register the dress-up relay game
gameRegistry.register({
  id: 'dress-up-relay',
  nameKey: 'selectGame.dressUpRelay.name',
  descriptionKey: 'selectGame.dressUpRelay.description',
  emoji: '👗',
  category: 'casual',
  navigator: DressUpRelayNavigator,
  providers: [DressUpRelayProvider],
  isEnabled: true,
});

// Register the color mixer lab game
gameRegistry.register({
  id: 'color-mixer',
  nameKey: 'selectGame.colorMixer.name',
  descriptionKey: 'selectGame.colorMixer.description',
  emoji: '🎨',
  category: 'puzzle',
  navigator: ColorMixerNavigator,
  providers: [ColorMixerProvider],
  isEnabled: true,
});

// Register the feed the pet game
gameRegistry.register({
  id: 'feed-the-pet',
  nameKey: 'selectGame.feedThePet.name',
  descriptionKey: 'selectGame.feedThePet.description',
  emoji: '🍽️',
  category: 'casual',
  navigator: FeedThePetNavigator,
  providers: [FeedThePetProvider],
  isEnabled: true,
});

// Register the whack-a-mole game
gameRegistry.register({
  id: 'whack-a-mole',
  nameKey: 'selectGame.whackAMole.name',
  descriptionKey: 'selectGame.whackAMole.description',
  emoji: '🔨',
  category: 'casual',
  navigator: WhackAMoleNavigator,
  providers: [WhackAMoleProvider],
  isEnabled: true,
});

// Register the catch the ball game
gameRegistry.register({
  id: 'catch-the-ball',
  nameKey: 'selectGame.catchTheBall.name',
  descriptionKey: 'selectGame.catchTheBall.description',
  emoji: '🎾',
  category: 'casual',
  navigator: CatchTheBallNavigator,
  providers: [CatchTheBallProvider],
  isEnabled: true,
});

// Register the sliding puzzle game
gameRegistry.register({
  id: 'sliding-puzzle',
  nameKey: 'selectGame.slidingPuzzle.name',
  descriptionKey: 'selectGame.slidingPuzzle.description',
  emoji: '🧩',
  category: 'puzzle',
  navigator: SlidingPuzzleNavigator,
  providers: [SlidingPuzzleProvider],
  isEnabled: true,
});

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
            <Stack.Screen name="GameSelection" component={GameSelectionScreen} />
            <Stack.Screen name="GameContainer" component={GameContainer} />
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
