/**
 * Pet Care Game Module
 *
 * This module registers the Pet Care game with the application's game registry.
 * It is imported by the main App.tsx to ensure the game is available for selection.
 *
 * The pet care game is a complete, self-contained game module that includes:
 * - Navigation (PetGameNavigator)
 * - Context providers (PetProvider)
 * - All screens, components, utilities, and data
 * - Translations for multiple languages
 *
 * @module games/pet-care
 */

import { gameRegistry, Game } from '../../app/registry';
import { PetProvider } from './context/PetContext';
import enTranslations from './locales/en.json';
import ptBRTranslations from './locales/pt-BR.json';

/**
 * Create a simple Pet Game Navigator
 *
 * For now, we're reusing the existing navigation structure.
 * In the future, this could be extracted to its own PetGameNavigator.tsx file.
 */
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MenuScreen } from './screens/MenuScreen';
import { CreatePetScreen } from './screens/CreatePetScreen';
import { HomeScreen } from './screens/HomeScreen';
import { FeedScene } from './screens/FeedScene';
import { BathScene } from './screens/BathScene';
import { WardrobeScene } from './screens/WardrobeScene';
import { PlayScene } from './screens/PlayScene';
import { SleepScene } from './screens/SleepScene';
import { VetScene } from './screens/VetScene';

const Stack = createNativeStackNavigator();

/**
 * Pet Game Navigator Component
 *
 * Defines the internal navigation structure for the pet care game.
 * Routes:
 * - Menu: Main menu for pet selection
 * - CreatePet: Pet creation screen
 * - Home: Main game screen
 * - Feed: Feeding activity
 * - Bath: Bathing activity
 * - Wardrobe: Clothing customization
 * - Play: Playing activity
 * - Sleep: Sleeping activity
 * - Vet: Veterinary care
 */
const PetGameNavigator = () => (
  <Stack.Navigator
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
);

/**
 * Pet Care Game Definition
 *
 * Defines all the metadata and configuration for the pet care game.
 * This game:
 * - Is enabled and playable
 * - Not premium
 * - Not coming soon
 * - Requires the PetProvider context
 * - Has complete translations in English and Portuguese-BR
 */
const petCareGame: Game = {
  // ========== Identification ==========
  id: 'pet-care',
  name: 'Pet Care',
  description: 'Take care of your virtual pet! Feed, bathe, and play with your furry friend.',
  icon: require('../../../assets/favicon.png'),
  category: 'pet',

  // ========== Navigation ==========
  navigator: PetGameNavigator,
  initialRoute: 'Menu',

  // ========== Providers ==========
  providers: [PetProvider],

  // ========== Localization ==========
  translations: {
    en: enTranslations,
    'pt-BR': ptBRTranslations,
  },

  // ========== Metadata ==========
  version: '1.0.0',
  minAppVersion: '1.0.0',
  isEnabled: true,
  requiresAuth: false,
  isPremium: false,
  comingSoon: false,
};

/**
 * Register the pet care game
 *
 * This runs when the module is imported, which happens in App.tsx.
 * The game will then be available in the game registry for the selection screen.
 */
gameRegistry.register(petCareGame);

export default petCareGame;
