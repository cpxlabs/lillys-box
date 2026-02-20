/**
 * Alt 17: Treehouse
 * Nature/woodland theme — earthy greens, warm browns, leaf-shaped accents.
 * Organic rounded cards on a soft green background.
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

const LEAF_COLORS = ['#D1FAE5', '#FEF3C7', '#FFE4E6', '#DBEAFE', '#E0E7FF', '#FCE7F3'];

export const Alt17Treehouse: React.FC<GameSelectorAltProps> = ({
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
    const bg = LEAF_COLORS[index % LEAF_COLORS.length];
    const fav = isFavorite(item.id);
    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: bg }]}
        onPress={() => handleGameSelect(item.id)}
        activeOpacity={0.8}
      >
        <TouchableOpacity
          style={styles.favBtn}
          onPress={() => toggleFavorite(item.id)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={[styles.fav, fav && styles.favActive]}>
            {fav ? '★' : '☆'}
          </Text>
        </TouchableOpacity>
        <EmojiIcon emoji={item.emoji} size={38} />
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
      <View style={styles.header}>
        <Text style={styles.headerEmoji}>🌳</Text>
        <Text style={styles.title}>{t('selectGame.title')}</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        <TouchableOpacity
          style={[styles.leaf, !selectedCategory && styles.leafActive]}
          onPress={() => setSelectedCategory(null)}
        >
          <Text style={[styles.leafText, !selectedCategory && styles.leafTextActive]}>
            {t('selectGame.allGames')}
          </Text>
        </TouchableOpacity>
        {categories.map((cat) => {
          const active = selectedCategory === cat;
          return (
            <TouchableOpacity
              key={cat}
              style={[styles.leaf, active && styles.leafActive]}
              onPress={() => setSelectedCategory(active ? null : cat)}
            >
              <Text style={[styles.leafText, active && styles.leafTextActive]}>
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
  container: { flex: 1, backgroundColor: '#ECFDF5' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 32,
    paddingBottom: 12,
    gap: 8,
  },
  headerEmoji: { fontSize: 28 },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#065F46',
  },
  filterRow: { paddingHorizontal: 14, gap: 8, paddingBottom: 14 },
  leaf: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: '#A7F3D0',
  },
  leafActive: { backgroundColor: '#065F46' },
  leafText: { fontSize: 14, fontWeight: '700', color: '#065F46' },
  leafTextActive: { color: '#fff' },
  grid: { paddingHorizontal: 12, paddingBottom: 8 },
  gridRow: { justifyContent: 'space-between' },
  card: {
    width: '47%',
    borderRadius: 22,
    padding: 14,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(6,95,70,0.1)',
  },
  favBtn: { alignSelf: 'flex-end', marginBottom: 4 },
  fav: { fontSize: 16, color: '#A7F3D0' },
  favActive: { color: '#f0c040' },
  cardName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#065F46',
    marginTop: 8,
    textAlign: 'center',
  },
  cardDesc: {
    fontSize: 11,
    color: '#6B8F80',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 15,
  },
  footer: { paddingVertical: 10, alignItems: 'center' },
});
