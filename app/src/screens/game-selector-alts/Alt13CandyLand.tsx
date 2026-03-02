/**
 * Alt 13: Candy Land
 * Sweet pastel candy colors, bubbly rounded shapes.
 * Soft gradients, pill shapes, lollipop vibes.
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
import { sharedStyles } from './sharedStyles';

const CANDY = [
  { bg: '#FDDDE6', accent: '#E8598B' },
  { bg: '#D4F0F0', accent: '#3ABFBF' },
  { bg: '#FFF5BA', accent: '#D4A017' },
  { bg: '#D5CCFF', accent: '#7B61FF' },
  { bg: '#C8F7DC', accent: '#2ECC71' },
  { bg: '#FFE0CC', accent: '#FF7F50' },
];

export const Alt13CandyLand: React.FC<GameSelectorAltProps> = ({
  sortedGames,
  categories,
  selectedCategory,
  setSelectedCategory,
  isFavorite,
  toggleFavorite,
  handleGameSelect,
  t,
}) => {
  const renderCandy = ({ item, index }: { item: GameDefinition; index: number }) => {
    const candy = CANDY[index % CANDY.length];
    const fav = isFavorite(item.id);

    return (
      <TouchableOpacity
        style={[styles.candy, { backgroundColor: candy.bg }]}
        onPress={() => handleGameSelect(item.id)}
        activeOpacity={0.8}
      >
        <View style={styles.candyTop}>
          <View style={[styles.lollipop, { backgroundColor: candy.accent }]}>
            <EmojiIcon emoji={item.emoji} size={34} />
          </View>
          <TouchableOpacity
            onPress={() => toggleFavorite(item.id)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={[styles.fav, fav && { color: '#f0c040' }]}>
              {fav ? '★' : '☆'}
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.candyName, { color: candy.accent }]} numberOfLines={1}>
          {t(item.nameKey)}
        </Text>
        <Text style={styles.candyDesc} numberOfLines={2}>
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
      style={sharedStyles.noGrow}
      >
        <TouchableOpacity
          style={[styles.pill, !selectedCategory && styles.pillActive]}
          onPress={() => setSelectedCategory(null)}
        >
          <Text style={[styles.pillText, !selectedCategory && styles.pillTextActive]}>
            {t('selectGame.allGames')}
          </Text>
        </TouchableOpacity>
        {categories.map((cat) => {
          const active = selectedCategory === cat;
          return (
            <TouchableOpacity
              key={cat}
              style={[styles.pill, active && styles.pillActive]}
              onPress={() => setSelectedCategory(active ? null : cat)}
            >
              <Text style={[styles.pillText, active && styles.pillTextActive]}>
                {t(`selectGame.categories.${cat}`)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <FlatList
        data={sortedGames}
        renderItem={renderCandy}
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
  container: { flex: 1, backgroundColor: '#FFF5F9' },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#E8598B',
    textAlign: 'center',
    paddingTop: 32,
  },
  subtitle: {
    fontSize: 14,
    color: '#D4A0B0',
    textAlign: 'center',
    marginTop: 4,
    paddingBottom: 12,
  },
  filterRow: { paddingHorizontal: 14, gap: 8, paddingBottom: 14 },
  pill: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: '#FFE8F0',
  },
  pillActive: { backgroundColor: '#E8598B' },
  pillText: { fontSize: 14, fontWeight: '700', color: '#E8598B' },
  pillTextActive: { color: '#fff' },
  grid: { paddingHorizontal: 12, paddingBottom: 8 },
  gridRow: { justifyContent: 'space-between' },
  candy: {
    width: '47%',
    borderRadius: 28,
    padding: 14,
    marginBottom: 14,
    alignItems: 'center',
  },
  candyTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    marginBottom: 8,
  },
  lollipop: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.3,
  },
  fav: { fontSize: 18, color: '#E0C0C0' },
  candyName: {
    fontSize: 15,
    fontWeight: '800',
    textAlign: 'center',
  },
  candyDesc: {
    fontSize: 11,
    color: '#B08090',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 15,
  },
  footer: { paddingVertical: 10, alignItems: 'center' },
});
