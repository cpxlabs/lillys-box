/**
 * Game Registry Module
 *
 * This module provides the game registration system that allows games
 * to register themselves with the application at startup.
 *
 * @example
 * ```typescript
 * import { gameRegistry, Game } from '@/app/registry';
 *
 * const myGame: Game = {
 *   id: 'my-game',
 *   name: 'My Game',
 *   // ... other fields
 * };
 *
 * gameRegistry.register(myGame);
 * const games = gameRegistry.getEnabledGames();
 * ```
 */

export { gameRegistry, default } from './GameRegistry';
export type {
  Game,
  GameCategory,
  GameTranslations,
  GameRegistryInterface,
} from './types';
