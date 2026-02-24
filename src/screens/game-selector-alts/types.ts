import { GameDefinition } from '../../registry/GameRegistry';
import { ScreenNavigationProp } from '../../types/navigation';

export type GameSelectorAltProps = {
  navigation: ScreenNavigationProp<'GameSelection'>;
  games: GameDefinition[];
  sortedGames: GameDefinition[];
  categories: string[];
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
  sortBy: string;
  setSortBy: (s: any) => void;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
  handleGameSelect: (id: string) => void;
  t: (key: string) => string;
};
