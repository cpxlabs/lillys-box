import { GameDefinition } from '../../registry/GameRegistry';
import { ScreenNavigationProp } from '../../types/navigation';

export type SortOption = 'default' | 'name' | 'category' | 'favorites';

export type GameSelectorAltProps = {
  navigation: ScreenNavigationProp<'GameSelection'>;
  games: GameDefinition[];
  sortedGames: GameDefinition[];
  categories: string[];
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
  sortBy: SortOption;
  setSortBy: (s: SortOption) => void;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
  handleGameSelect: (id: string) => void;
  t: (key: string) => string;
};
