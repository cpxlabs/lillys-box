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
  /** Main menu screen (pet game) */
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
  /** Menu design picker */
  MenuDesignPicker: undefined;
  /** Menu design option 1 - Glassmorphism */
  MenuDesign1: undefined;
  /** Menu design option 2 - Neomorphism */
  MenuDesign2: undefined;
  /** Menu design option 3 - Vibrant Gradients */
  MenuDesign3: undefined;
  /** Menu design option 4 - Minimal Clean */
  MenuDesign4: undefined;
  /** Menu design option 5 - Dark Mode Neon */
  MenuDesign5: undefined;
  /** Menu design option 6 - Playful Bubbly */
  MenuDesign6: undefined;
  /** Menu design option 7 - Card Stack */
  MenuDesign7: undefined;
  /** Menu design option 8 - Dashboard */
  MenuDesign8: undefined;
  /** Menu design option 9 - Retro Pixel */
  MenuDesign9: undefined;
  /** Menu design option 10 - Nature Garden */
  MenuDesign10: undefined;
  /** Menu design option 11 - Candy Land */
  MenuDesign11: undefined;
  /** Menu design option 12 - Ocean Adventure */
  MenuDesign12: undefined;
  /** Menu design option 13 - Space Pets */
  MenuDesign13: undefined;
  /** Menu design option 14 - Rainbow Joy */
  MenuDesign14: undefined;
  /** Menu design option 15 - Jungle Safari */
  MenuDesign15: undefined;
  /** Menu design option 16 - Fairy Tale */
  MenuDesign16: undefined;
  /** Menu design option 17 - Toy Box */
  MenuDesign17: undefined;
  /** Menu design option 18 - Ice Cream Party */
  MenuDesign18: undefined;
  /** Menu design option 19 - Dino World */
  MenuDesign19: undefined;
  /** Menu design option 20 - Circus Fun */
  MenuDesign20: undefined;
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
