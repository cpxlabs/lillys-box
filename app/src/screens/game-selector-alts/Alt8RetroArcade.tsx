/**
 * Alt 8: Retro Arcade
 * Chunky borders, bold saturated colors, pixelated/retro gaming aesthetic.
 * Thick outlines, uppercase text, arcade cabinet vibes.
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

const RETRO_COLORS = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#a29bfe', '#fd79a8', '#00b894'];

export const Alt8RetroArcade: React.FC<GameSelectorAltProps> = ({
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
    const fav = isFavorite(item.id);
    const color = RETRO_COLORS[index % RETRO_COLORS.length];

    return (
      <TouchableOpacity
        style={[styles.card, { borderColor: color }]}
        onPress={() => handleGameSelect(item.id)}
        activeOpacity={0.8}
      >
        <View style={[styles.cardHeader, { backgroundColor: color }]}>
          <EmojiIcon emoji={item.emoji} size={32} />
          <TouchableOpacity
            onPress={() => toggleFavorite(item.id)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={[styles.fav, fav && styles.favActive]}>
              {fav ? '★' : '☆'}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.cardBody}>
          <Text style={styles.cardName} numberOfLines={1}>
            {t(item.nameKey)}
          </Text>
          <Text style={styles.cardDesc} numberOfLines={2}>
            {t(item.descriptionKey)}
          </Text>
        </View>
        <View style={[styles.playBar, { backgroundColor: color }]}>
          <Text style={styles.playText}>PLAY</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleBar}>
        <Text style={styles.title}>SELECT GAME</Text>
        <View style={styles.titleUnderline} />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
        style={sharedStyles.noGrow}
        >
        <TouchableOpacity
          style={[styles.filterBtn, !selectedCategory && styles.filterBtnActive]}
          onPress={() => setSelectedCategory(null)}
        >
          <Text
            style={[
              styles.filterText,
              !selectedCategory && styles.filterTextActive,
            ]}
          >
            ALL
          </Text>
        </TouchableOpacity>
        {categories.map((cat) => {
          const active = selectedCategory === cat;
          return (
            <TouchableOpacity
              key={cat}
              style={[styles.filterBtn, active && styles.filterBtnActive]}
              onPress={() => setSelectedCategory(active ? null : cat)}
            >
              <Text style={[styles.filterText, active && styles.filterTextActive]}>
                {t(`selectGame.categories.${cat}`).toUpperCase()}
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
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.colWrap}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.footer}>
        <LanguageSelector />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  titleBar: { alignItems: 'center', paddingTop: 36, paddingBottom: 16 },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#ffe66d',
    letterSpacing: 4,
  },
  titleUnderline: {
    width: 60,
    height: 4,
    backgroundColor: '#ffe66d',
    marginTop: 6,
    borderRadius: 2,
  },
  filterRow: { paddingHorizontal: 16, gap: 8, paddingBottom: 14 },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#333',
    backgroundColor: '#16213e',
  },
  filterBtnActive: {
    borderColor: '#ffe66d',
    backgroundColor: '#ffe66d',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#666',
    letterSpacing: 1,
  },
  filterTextActive: { color: '#1a1a2e' },
  list: { paddingHorizontal: 12, paddingBottom: 8 },
  colWrap: { justifyContent: 'space-between' },
  card: {
    width: '48%',
    marginBottom: 12,
    borderRadius: 4,
    borderWidth: 3,
    backgroundColor: '#16213e',
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  cardBody: { padding: 10 },
  cardName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardDesc: {
    fontSize: 11,
    color: '#8899aa',
    marginTop: 4,
    lineHeight: 15,
  },
  playBar: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  playText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#1a1a2e',
    letterSpacing: 2,
  },
  fav: { fontSize: 18, color: 'rgba(255,255,255,0.3)' },
  favActive: { color: '#ffe66d' },
  footer: { paddingVertical: 10, alignItems: 'center' },
});
