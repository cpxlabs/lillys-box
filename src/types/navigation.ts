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
