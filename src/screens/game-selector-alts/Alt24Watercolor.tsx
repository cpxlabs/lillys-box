/**
 * Alt 24: Watercolor
 * Soft watercolor-wash card backgrounds with white overlay.
 * Gentle, artistic, calm feel. Good for younger children.
 */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ScrollView,
} from 'react-native';
import { EmojiIcon } from '../../components/EmojiIcon';
import { LanguageSelector } from '../../components/LanguageSelector';
import { GameDefinition } from '../../registry/GameRegistry';
import { GameSelectorAltProps } from './types';

const WASH = [
  '#FFE0EC', '#E0F4FF', '#E8FFE0', '#FFF5E0',
  '#F0E0FF', '#E0FFFA', '#FFF0F5', '#E8F0FF',
  '#FFF8E0', '#F0FFE8', '#FFE8E8', '#E0E8FF',
];

export const Alt24Watercolor: React.FC<GameSelectorAltProps> = ({
  sortedGames,
  categories,
  selectedCategory,
  setSelectedCategory,
  isFavorite,
  toggleFavorite,
  handleGameSelect,
  t,
}) => {
  const renderCard = ({ item, index }: { item: GameDefinition; index: number }) => {
    const wash = WASH[index % WASH.length];
    const fav = isFavorite(item.id);

    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: wash }]}
        onPress={() => handleGameSelect(item.id)}
        activeOpacity={0.8}
      >
        <View style={styles.cardTop}>
          <EmojiIcon emoji={item.emoji} size={36} />
          <TouchableOpacity
            onPress={() => toggleFavorite(item.id)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={[styles.fav, fav && styles.favActive]}>
              {fav ? '★' : '☆'}
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.cardName} numberOfLines={1}>
          {t(item.nameKey)}
        </Text>
        <Text style={styles.cardDesc} numberOfLines={2}>
          {t(item.descriptionKey)}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{t('selectGame.title')}</Text>
      <Text style={styles.subtitle}>{t('selectGame.subtitle')}</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      style={{ flexGrow: 0 }}
      >
        <TouchableOpacity
          style={[styles.tab, !selectedCategory && styles.tabActive]}
          onPress={() => setSelectedCategory(null)}
        >
          <Text style={[styles.tabText, !selectedCategory && styles.tabTextActive]}>
            {t('selectGame.allGames')}
          </Text>
        </TouchableOpacity>
        {categories.map((cat) => {
          const active = selectedCategory === cat;
          return (
            <TouchableOpacity
              key={cat}
              style={[styles.tab, active && styles.tabActive]}
              onPress={() => setSelectedCategory(active ? null : cat)}
            >
              <Text style={[styles.tabText, active && styles.tabTextActive]}>
                {t(`selectGame.categories.${cat}`)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <FlatList
        data={sortedGames}
        renderItem={renderCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.gridRow}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.footer}>
        <LanguageSelector />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FEFEFE' },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#6B4C8A',
    textAlign: 'center',
    paddingTop: 32,
  },
  subtitle: {
    fontSize: 13,
    color: '#B8A0C8',
    textAlign: 'center',
    marginTop: 4,
    paddingBottom: 12,
  },
  filterRow: { paddingHorizontal: 14, gap: 8, paddingBottom: 14 },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 24,
    backgroundColor: '#F5F0FF',
  },
  tabActive: { backgroundColor: '#8B5CF6' },
  tabText: { fontSize: 13, fontWeight: '600', color: '#8B5CF6' },
  tabTextActive: { color: '#fff' },
  grid: { paddingHorizontal: 14, paddingBottom: 8 },
  gridRow: { justifyContent: 'space-between' },
  card: {
    width: '47%',
    borderRadius: 24,
    padding: 14,
    marginBottom: 14,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  fav: { fontSize: 18, color: '#E0D0E8' },
  favActive: { color: '#f0c040' },
  cardName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4A3060',
  },
  cardDesc: {
    fontSize: 11,
    color: '#A090B0',
    marginTop: 4,
    lineHeight: 15,
  },
  footer: { paddingVertical: 10, alignItems: 'center' },
});
