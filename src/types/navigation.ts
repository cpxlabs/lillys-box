/**
 * Navigation type definitions
 *
 * Defines the navigation structure for the entire application.
 * This provides type safety for navigation params and prevents
 * runtime errors from incorrect navigation calls.
 */

import { NativeStackNavigationProp } from '@react-navigation/native-stack';

/**
 * Root stack navigation parameter list
 *
 * Defines all routes in the application and their parameters.
 * - `undefined` means the route doesn't accept any parameters
 * - Use object types for routes that accept parameters
 */
export type RootStackParamList = {
  /** Game selection screen */
  GameSelection: undefined;
  /** Game container — mounts the selected game's providers and navigator */
  GameContainer: { gameId: string };
  /** Main menu screen (pet game) — Patchwork Quilt theme */
  Menu: undefined;
  /** Pet creation screen */
  CreatePet: undefined;
  /** Home screen with pet display */
  Home: undefined;
  /** Feeding scene */
  Feed: undefined;
  /** Bathing scene */
  Bath: undefined;
  /** Playing scene */
  Play: undefined;
  /** Sleeping scene */
  Sleep: undefined;
  /** Veterinary scene */
  Vet: undefined;
  /** Wardrobe customization scene */
  Wardrobe: undefined;
  /** Muito game home screen */
  MuitoHome: undefined;
  /** Muito counting game screen */
  MuitoGame: undefined;
  /** Muito multiplayer lobby */
  MuitoLobby: undefined;
  /** Muito multiplayer game screen */
  MuitoMultiGame: undefined;
  /** Muito multiplayer results screen */
  MuitoResults: undefined;
  /** Memory Match home screen */
  MemoryMatchHome: undefined;
  /** Memory Match game screen */
  MemoryMatchGame: { difficulty: 'easy' | 'medium' | 'hard' };
  /** Pet Runner home screen */
  PetRunnerHome: undefined;
  /** Pet Runner game screen */
  PetRunnerGame: undefined;
  /** ColorTap home screen */
  ColorTapHome: undefined;
  /** ColorTap game screen */
  ColorTapGame: undefined;
  /** Simon Says home screen */
  SimonSaysHome: undefined;
  /** Simon Says game screen */
  SimonSaysGame: undefined;
  /** Dress-Up Relay home screen */
  DressUpRelayHome: undefined;
  /** Dress-Up Relay game screen */
  DressUpRelayGame: undefined;
  /** Color Mixer home screen */
  ColorMixerHome: undefined;
  /** Color Mixer level selection screen */
  ColorMixerLevels: undefined;
  /** Color Mixer game screen */
  ColorMixerGame: { level: number };
  /** Feed the Pet home screen */
  FeedThePetHome: undefined;
  /** Feed the Pet game screen */
  FeedThePetGame: undefined;
  /** Whack-a-Mole home screen */
  WhackAMoleHome: undefined;
  /** Whack-a-Mole game screen */
  WhackAMoleGame: undefined;
  /** Catch the Ball home screen */
  CatchTheBallHome: undefined;
  /** Catch the Ball game screen */
  CatchTheBallGame: undefined;
  /** Sliding Puzzle home screen */
  SlidingPuzzleHome: undefined;
  /** Sliding Puzzle game screen */
  SlidingPuzzleGame: { difficulty: 'easy' | 'hard' };
  /** Bubble Pop Party home screen */
  BubblePopHome: undefined;
  /** Bubble Pop Party game screen */
  BubblePopGame: undefined;
  /** Pet Dance Party home screen */
  PetDancePartyHome: undefined;
  /** Pet Dance Party game screen */
  PetDancePartyGame: undefined;
  /** Treasure Dig home screen */
  TreasureDigHome: undefined;
  /** Treasure Dig game screen */
  TreasureDigGame: undefined;
  /** Balloon Float home screen */
  BalloonFloatHome: undefined;
  /** Balloon Float game screen */
  BalloonFloatGame: undefined;
  /** Paint Splash home screen */
  PaintSplashHome: undefined;
  /** Paint Splash game screen */
  PaintSplashGame: undefined;
  /** Snack Stack home screen */
  SnackStackHome: undefined;
  /** Snack Stack game screen */
  SnackStackGame: undefined;
  /** Lightning Tap home screen */
  LightningTapHome: undefined;
  /** Lightning Tap game screen */
  LightningTapGame: undefined;
  /** Path Finder home screen */
  PathFinderHome: undefined;
  /** Path Finder game screen */
  PathFinderGame: undefined;
  /** Shape Sorter home screen */
  ShapeSorterHome: undefined;
  /** Shape Sorter game screen */
  ShapeSorterGame: undefined;
  /** Mirror Match (new) home screen */
  MirrorMatchHome: undefined;
  /** Mirror Match (new) game screen */
  MirrorMatchGame: undefined;
  /** Word Bubbles home screen */
  WordBubblesHome: undefined;
  /** Word Bubbles game screen */
  WordBubblesGame: undefined;
  /** Jigsaw Pets home screen */
  JigsawPetsHome: undefined;
  /** Jigsaw Pets game screen */
  JigsawPetsGame: undefined;
  /** Connect the Dots home screen */
  ConnectDotsHome: undefined;
  /** Connect the Dots game screen */
  ConnectDotsGame: undefined;
  /** Pet Explorer home screen */
  PetExplorerHome: undefined;
  /** Pet Explorer game screen */
  PetExplorerGame: undefined;
  /** Weather Wizard home screen */
  WeatherWizardHome: undefined;
  /** Weather Wizard game screen */
  WeatherWizardGame: undefined;
  /** Pet Taxi home screen */
  PetTaxiHome: undefined;
  /** Pet Taxi game screen */
  PetTaxiGame: undefined;
  /** Pet Chef home screen */
  PetChefHome: undefined;
  /** Pet Chef game screen */
  PetChefGame: undefined;
  /** Music Maker home screen */
  MusicMakerHome: undefined;
  /** Music Maker game screen */
  MusicMakerGame: undefined;
  /** Garden Grow home screen */
  GardenGrowHome: undefined;
  /** Garden Grow game screen */
  GardenGrowGame: undefined;
  /** Photo Studio home screen */
  PhotoStudioHome: undefined;
  /** Photo Studio game screen */
  PhotoStudioGame: undefined;
};

/**
 * Type-safe navigation prop for any screen
 *
 * Usage:
 * ```typescript
 * const navigation = useNavigation<RootNavigationProp>();
 * navigation.navigate('Home'); // ✓ Type-safe
 * navigation.navigate('InvalidRoute'); // ✗ TypeScript error
 * ```
 */
export type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * Type-safe navigation prop for a specific screen
 *
 * Usage:
 * ```typescript
 * type Props = {
 *   navigation: ScreenNavigationProp<'Home'>;
 * };
 * ```
 */
export type ScreenNavigationProp<T extends keyof RootStackParamList> = NativeStackNavigationProp<
  RootStackParamList,
  T
>;
