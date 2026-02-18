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
import { BubblePopProvider } from './src/context/BubblePopContext';
import { BubblePopNavigator } from './src/screens/BubblePopNavigator';
import { PetDancePartyProvider } from './src/context/PetDancePartyContext';
import { PetDancePartyNavigator } from './src/screens/PetDancePartyNavigator';
import { TreasureDigProvider } from './src/context/TreasureDigContext';
import { TreasureDigNavigator } from './src/screens/TreasureDigNavigator';
import { BalloonFloatProvider } from './src/context/BalloonFloatContext';
import { BalloonFloatNavigator } from './src/screens/BalloonFloatNavigator';
import { PaintSplashProvider } from './src/context/PaintSplashContext';
import { PaintSplashNavigator } from './src/screens/PaintSplashNavigator';
import { SnackStackProvider } from './src/context/SnackStackContext';
import { SnackStackNavigator } from './src/screens/SnackStackNavigator';
import { LightningTapProvider } from './src/context/LightningTapContext';
import { LightningTapNavigator } from './src/screens/LightningTapNavigator';
import { PathFinderProvider } from './src/context/PathFinderContext';
import { PathFinderNavigator } from './src/screens/PathFinderNavigator';
import { ShapeSorterProvider } from './src/context/ShapeSorterContext';
import { ShapeSorterNavigator } from './src/screens/ShapeSorterNavigator';
import { MirrorMatchGameProvider } from './src/context/MirrorMatchContext';
import { MirrorMatchNavigator } from './src/screens/MirrorMatchNavigator';
import { WordBubblesProvider } from './src/context/WordBubblesContext';
import { WordBubblesNavigator } from './src/screens/WordBubblesNavigator';
import { JigsawPetsProvider } from './src/context/JigsawPetsContext';
import { JigsawPetsNavigator } from './src/screens/JigsawPetsNavigator';
import { ConnectDotsProvider } from './src/context/ConnectDotsContext';
import { ConnectDotsNavigator } from './src/screens/ConnectDotsNavigator';
import { PetExplorerProvider } from './src/context/PetExplorerContext';
import { PetExplorerNavigator } from './src/screens/PetExplorerNavigator';
import { WeatherWizardProvider } from './src/context/WeatherWizardContext';
import { WeatherWizardNavigator } from './src/screens/WeatherWizardNavigator';
import { PetTaxiProvider } from './src/context/PetTaxiContext';
import { PetTaxiNavigator } from './src/screens/PetTaxiNavigator';
import { PetChefProvider } from './src/context/PetChefContext';
import { PetChefNavigator } from './src/screens/PetChefNavigator';
import { MusicMakerProvider } from './src/context/MusicMakerContext';
import { MusicMakerNavigator } from './src/screens/MusicMakerNavigator';
import { GardenGrowProvider } from './src/context/GardenGrowContext';
import { GardenGrowNavigator } from './src/screens/GardenGrowNavigator';
import { PhotoStudioProvider } from './src/context/PhotoStudioContext';
import { PhotoStudioNavigator } from './src/screens/PhotoStudioNavigator';

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

// Register Bubble Pop Party
gameRegistry.register({ id: 'bubble-pop', nameKey: 'selectGame.bubblePop.name', descriptionKey: 'selectGame.bubblePop.description', emoji: '🫧', category: 'casual', navigator: BubblePopNavigator, providers: [BubblePopProvider], isEnabled: true });

// Register Pet Dance Party
gameRegistry.register({ id: 'pet-dance-party', nameKey: 'selectGame.petDanceParty.name', descriptionKey: 'selectGame.petDanceParty.description', emoji: '🪩', category: 'casual', navigator: PetDancePartyNavigator, providers: [PetDancePartyProvider], isEnabled: true });

// Register Treasure Dig
gameRegistry.register({ id: 'treasure-dig', nameKey: 'selectGame.treasureDig.name', descriptionKey: 'selectGame.treasureDig.description', emoji: '💎', category: 'casual', navigator: TreasureDigNavigator, providers: [TreasureDigProvider], isEnabled: true });

// Register Balloon Float
gameRegistry.register({ id: 'balloon-float', nameKey: 'selectGame.balloonFloat.name', descriptionKey: 'selectGame.balloonFloat.description', emoji: '🎈', category: 'casual', navigator: BalloonFloatNavigator, providers: [BalloonFloatProvider], isEnabled: true });

// Register Paint Splash
gameRegistry.register({ id: 'paint-splash', nameKey: 'selectGame.paintSplash.name', descriptionKey: 'selectGame.paintSplash.description', emoji: '🎨', category: 'casual', navigator: PaintSplashNavigator, providers: [PaintSplashProvider], isEnabled: true });

// Register Snack Stack
gameRegistry.register({ id: 'snack-stack', nameKey: 'selectGame.snackStack.name', descriptionKey: 'selectGame.snackStack.description', emoji: '🥞', category: 'casual', navigator: SnackStackNavigator, providers: [SnackStackProvider], isEnabled: true });

// Register Lightning Tap
gameRegistry.register({ id: 'lightning-tap', nameKey: 'selectGame.lightningTap.name', descriptionKey: 'selectGame.lightningTap.description', emoji: '⚡', category: 'casual', navigator: LightningTapNavigator, providers: [LightningTapProvider], isEnabled: true });

// Register Path Finder
gameRegistry.register({ id: 'path-finder', nameKey: 'selectGame.pathFinder.name', descriptionKey: 'selectGame.pathFinder.description', emoji: '🐾', category: 'puzzle', navigator: PathFinderNavigator, providers: [PathFinderProvider], isEnabled: true });

// Register Shape Sorter
gameRegistry.register({ id: 'shape-sorter', nameKey: 'selectGame.shapeSorter.name', descriptionKey: 'selectGame.shapeSorter.description', emoji: '🧩', category: 'puzzle', navigator: ShapeSorterNavigator, providers: [ShapeSorterProvider], isEnabled: true });

// Register Mirror Match (new)
gameRegistry.register({ id: 'mirror-match-new', nameKey: 'selectGame.mirrorMatch.name', descriptionKey: 'selectGame.mirrorMatch.description', emoji: '🪞', category: 'puzzle', navigator: MirrorMatchNavigator, providers: [MirrorMatchGameProvider], isEnabled: true });

// Register Word Bubbles
gameRegistry.register({ id: 'word-bubbles', nameKey: 'selectGame.wordBubbles.name', descriptionKey: 'selectGame.wordBubbles.description', emoji: '🔤', category: 'puzzle', navigator: WordBubblesNavigator, providers: [WordBubblesProvider], isEnabled: true });

// Register Jigsaw Pets
gameRegistry.register({ id: 'jigsaw-pets', nameKey: 'selectGame.jigsawPets.name', descriptionKey: 'selectGame.jigsawPets.description', emoji: '🖼️', category: 'puzzle', navigator: JigsawPetsNavigator, providers: [JigsawPetsProvider], isEnabled: true });

// Register Connect the Dots
gameRegistry.register({ id: 'connect-dots', nameKey: 'selectGame.connectDots.name', descriptionKey: 'selectGame.connectDots.description', emoji: '✨', category: 'puzzle', navigator: ConnectDotsNavigator, providers: [ConnectDotsProvider], isEnabled: true });

// Register Pet Explorer
gameRegistry.register({ id: 'pet-explorer', nameKey: 'selectGame.petExplorer.name', descriptionKey: 'selectGame.petExplorer.description', emoji: '🧭', category: 'adventure', navigator: PetExplorerNavigator, providers: [PetExplorerProvider], isEnabled: true });

// Register Weather Wizard
gameRegistry.register({ id: 'weather-wizard', nameKey: 'selectGame.weatherWizard.name', descriptionKey: 'selectGame.weatherWizard.description', emoji: '🌈', category: 'adventure', navigator: WeatherWizardNavigator, providers: [WeatherWizardProvider], isEnabled: true });

// Register Pet Taxi
gameRegistry.register({ id: 'pet-taxi', nameKey: 'selectGame.petTaxi.name', descriptionKey: 'selectGame.petTaxi.description', emoji: '🚕', category: 'adventure', navigator: PetTaxiNavigator, providers: [PetTaxiProvider], isEnabled: true });

// Register Pet Chef
gameRegistry.register({ id: 'pet-chef', nameKey: 'selectGame.petChef.name', descriptionKey: 'selectGame.petChef.description', emoji: '👨‍🍳', category: 'casual', navigator: PetChefNavigator, providers: [PetChefProvider], isEnabled: true });

// Register Music Maker
gameRegistry.register({ id: 'music-maker', nameKey: 'selectGame.musicMaker.name', descriptionKey: 'selectGame.musicMaker.description', emoji: '🎵', category: 'casual', navigator: MusicMakerNavigator, providers: [MusicMakerProvider], isEnabled: true });

// Register Garden Grow
gameRegistry.register({ id: 'garden-grow', nameKey: 'selectGame.gardenGrow.name', descriptionKey: 'selectGame.gardenGrow.description', emoji: '🌻', category: 'casual', navigator: GardenGrowNavigator, providers: [GardenGrowProvider], isEnabled: true });

// Register Photo Studio
gameRegistry.register({ id: 'photo-studio', nameKey: 'selectGame.photoStudio.name', descriptionKey: 'selectGame.photoStudio.description', emoji: '📸', category: 'casual', navigator: PhotoStudioNavigator, providers: [PhotoStudioProvider], isEnabled: true });

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
