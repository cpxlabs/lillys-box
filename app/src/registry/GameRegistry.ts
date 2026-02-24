import React from 'react';

export interface GameDefinition {
  id: string;
  /** i18n key for the game name */
  nameKey: string;
  /** i18n key for the game description */
  descriptionKey: string;
  emoji: string;
  category: 'pet' | 'puzzle' | 'adventure' | 'casual';
  /** Root navigator component for this game */
  navigator: React.ComponentType;
  /** Game-level context providers, outermost first */
  providers: Array<React.ComponentType<{ children: React.ReactNode }>>;
  isEnabled: boolean;
}

class GameRegistry {
  private games: Map<string, GameDefinition> = new Map();

  register(game: GameDefinition): void {
    if (this.games.has(game.id)) {
      throw new Error(`Game ${game.id} already registered`);
    }
    this.games.set(game.id, game);
  }

  getGame(id: string): GameDefinition | undefined {
    return this.games.get(id);
  }

  getAllGames(): GameDefinition[] {
    return Array.from(this.games.values()).filter((game) => game.isEnabled);
  }
}

export const gameRegistry = new GameRegistry();
