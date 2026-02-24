import React, { useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ScrollView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { gameRegistry, GameDefinition } from '../registry/GameRegistry';
import { LanguageSelector } from '../components/LanguageSelector';
import { EmojiIcon } from '../components/EmojiIcon';
import { useFavoriteGames } from '../hooks/useFavoriteGames';

type SortOption = 'default' | 'name' | 'category' | 'favorites';

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  pet: { bg: '#e8f5e9', text: '#2e7d32' },
  puzzle: { bg: '#e3f2fd', text: '#1565c0' },
  adventure: { bg: '#fff3e0', text: '#e65100' },
  casual: { bg: '#fce4ec', text: '#c62828' },
};

const CATEGORY_EMOJI: Record<string, string> = {
  pet: '🐾',
  puzzle: '🧩',
  adventure: '🗺️',
  casual: '🎲',
};

export const GameSelectionScreen: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const games = gameRegistry.getAllGames();
  const { toggleFavorite, isFavorite } = useFavoriteGames();
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    const cats = new Set(games.map((g) => g.category));
    return Array.from(cats);
  }, [games]);

  const sortedGames = useMemo(() => {
    let filtered = selectedCategory
      ? games.filter((g) => g.category === selectedCategory)
      : games;

    const sorted = [...filtered];

    switch (sortBy) {
      case 'name':
        sorted.sort((a, b) => t(a.nameKey).localeCompare(t(b.nameKey)));
        break;
      case 'category':
        sorted.sort((a, b) => a.category.localeCompare(b.category));
        break;
      case 'favorites':
        sorted.sort((a, b) => {
          const aFav = isFavorite(a.id) ? 0 : 1;
          const bFav = isFavorite(b.id) ? 0 : 1;
          return aFav - bFav;
        });
        break;
      default:
        break;
    }

    return sorted;
  }, [games, sortBy, selectedCategory, isFavorite, t]);

  const handleGameSelect = useCallback(
    (gameId: string) => {
      router.push(`/game/${gameId}`);
    },
    [router],
  );

  const handleToggleFavorite = useCallback(
    (gameId: string) => {
      toggleFavorite(gameId);
    },
    [toggleFavorite],
  );

  const renderSortChip = (option: SortOption, labelKey: string) => {
    const active = sortBy === option;
    return (
      <TouchableOpacity
        key={option}
        style={[styles.sortChip, active && styles.sortChipActive]}
        onPress={() => setSortBy(option)}
        activeOpacity={0.7}
      >
        <Text style={[styles.sortChipText, active && styles.sortChipTextActive]}>
          {t(labelKey)}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderCategoryFilter = (category: string) => {
    const active = selectedCategory === category;
    const colors = CATEGORY_COLORS[category] || CATEGORY_COLORS.casual;
    const emoji = CATEGORY_EMOJI[category] || '🎮';
    return (
      <TouchableOpacity
        key={category}
        style={[
          styles.categoryChip,
          { backgroundColor: active ? colors.text : colors.bg },
        ]}
        onPress={() => setSelectedCategory(active ? null : category)}
        activeOpacity={0.7}
      >
        <Text style={styles.categoryChipEmoji}>{emoji}</Text>
        <Text
          style={[
            styles.categoryChipText,
            { color: active ? '#fff' : colors.text },
          ]}
        >
          {t(`selectGame.categories.${category}`)}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderGameCard = ({ item }: { item: GameDefinition }) => {
    const fav = isFavorite(item.id);
    const colors = CATEGORY_COLORS[item.category] || CATEGORY_COLORS.casual;

    return (
      <TouchableOpacity
        style={[styles.gameCard, fav && styles.gameCardFavorite]}
        onPress={() => handleGameSelect(item.id)}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel={`${t(item.nameKey)}: ${t(item.descriptionKey)}`}
      >
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => handleToggleFavorite(item.id)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityRole="button"
          accessibilityLabel={
            fav
              ? t('selectGame.removeFavorite')
              : t('selectGame.addFavorite')
          }
        >
          <Text style={[styles.favoriteIcon, fav && styles.favoriteIconActive]}>
            {fav ? '★' : '☆'}
          </Text>
        </TouchableOpacity>

        <View style={styles.emojiContainer}>
          <EmojiIcon emoji={item.emoji} size={44} style={styles.gameEmoji} />
        </View>

        <Text style={styles.gameName} numberOfLines={1}>
          {t(item.nameKey)}
        </Text>
        <Text style={styles.gameDescription} numberOfLines={2}>
          {t(item.descriptionKey)}
        </Text>

        <View style={[styles.categoryBadge, { backgroundColor: colors.bg }]}>
          <Text style={[styles.categoryBadgeText, { color: colors.text }]}>
            {t(`selectGame.categories.${item.category}`)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('selectGame.title')}</Text>
        <Text style={styles.subtitle}>{t('selectGame.subtitle')}</Text>
      </View>

      {/* Category filters */}
      <View style={styles.filtersSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryRow}
        >
          <TouchableOpacity
            style={[
              styles.categoryChip,
              {
                backgroundColor: selectedCategory === null ? '#9b59b6' : '#f0e6f6',
              },
            ]}
            onPress={() => setSelectedCategory(null)}
            activeOpacity={0.7}
          >
            <Text style={styles.categoryChipEmoji}>{'🎮'}</Text>
            <Text
              style={[
                styles.categoryChipText,
                { color: selectedCategory === null ? '#fff' : '#9b59b6' },
              ]}
            >
              {t('selectGame.allGames')}
            </Text>
          </TouchableOpacity>
          {categories.map(renderCategoryFilter)}
        </ScrollView>
      </View>

      {/* Sort controls */}
      <View style={styles.sortSection}>
        <Text style={styles.sortLabel}>{t('selectGame.sortBy')}</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.sortRow}
        >
          {renderSortChip('default', 'selectGame.sort.default')}
          {renderSortChip('name', 'selectGame.sort.name')}
          {renderSortChip('category', 'selectGame.sort.category')}
          {renderSortChip('favorites', 'selectGame.sort.favorites')}
        </ScrollView>
      </View>

      <FlatList
        data={sortedGames}
        renderItem={renderGameCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.footer}>
        <LanguageSelector />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f0ff',
  },
  header: {
    alignItems: 'center',
    paddingTop: 36,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#7b2d8e',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: '#888',
    fontWeight: '500',
  },
  filtersSection: {
    paddingBottom: 8,
  },
  categoryRow: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  categoryChipEmoji: {
    fontSize: 14,
    marginRight: 5,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  sortSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
    paddingTop: 4,
  },
  sortLabel: {
    fontSize: 13,
    color: '#999',
    fontWeight: '600',
    marginRight: 8,
  },
  sortRow: {
    gap: 6,
  },
  sortChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: '#ede4f5',
  },
  sortChipActive: {
    backgroundColor: '#9b59b6',
  },
  sortChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9b59b6',
  },
  sortChipTextActive: {
    color: '#fff',
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  gameCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    paddingTop: 20,
    width: '48%',
    marginBottom: 14,
    alignItems: 'center',
    shadowColor: '#9b59b6',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  gameCardFavorite: {
    borderColor: '#f0c040',
    backgroundColor: '#fffef5',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 1,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteIcon: {
    fontSize: 20,
    color: '#ccc',
  },
  favoriteIconActive: {
    color: '#f0c040',
  },
  emojiContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f5f0ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  gameEmoji: {
    textAlign: 'center',
  },
  gameName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  gameDescription: {
    fontSize: 11,
    color: '#888',
    textAlign: 'center',
    lineHeight: 15,
    marginBottom: 8,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  footer: {
    paddingVertical: 12,
    alignItems: 'center',
  },
});
