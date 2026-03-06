/**
 * Alt 7: App Store Style
 * Featured banner at top + vertical list of remaining games.
 * Inspired by iOS App Store "Today" tab.
 */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { EmojiIcon } from '../../components/EmojiIcon';
import { LanguageSelector } from '../../components/LanguageSelector';
import { GameDefinition } from '../../registry/GameRegistry';
import { GameSelectorAltProps } from './types';
import { sharedStyles } from './sharedStyles';

const FEATURED_BG = ['#4a148c', '#1a237e', '#004d40', '#b71c1c', '#e65100'];

export const Alt7AppStore: React.FC<GameSelectorAltProps> = ({
  sortedGames,
  categories,
  selectedCategory,
  setSelectedCategory,
  isFavorite,
  toggleFavorite,
  handleGameSelect,
  t,
}) => {
  // Top 3 as featured
  const featured = sortedGames.slice(0, 3);
  const rest = sortedGames.slice(3);

  const renderFeatured = (item: GameDefinition, idx: number) => {
    const bg = FEATURED_BG[idx % FEATURED_BG.length];
    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.featuredCard, { backgroundColor: bg }]}
        onPress={() => handleGameSelect(item.id)}
        activeOpacity={0.85}
      >
        <View style={styles.featuredContent}>
          <View style={{ flex: 1 }}>
            <Text style={styles.featuredLabel}>FEATURED</Text>
            <Text style={styles.featuredName}>{t(item.nameKey)}</Text>
            <Text style={styles.featuredDesc} numberOfLines={2}>
              {t(item.descriptionKey)}
            </Text>
          </View>
          <View style={styles.featuredEmoji}>
            <EmojiIcon emoji={item.emoji} size={56} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderListItem = ({ item }: { item: GameDefinition }) => {
    const fav = isFavorite(item.id);
    return (
      <TouchableOpacity
        style={styles.listItem}
        onPress={() => handleGameSelect(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.listEmoji}>
          <EmojiIcon emoji={item.emoji} size={32} />
        </View>
        <View style={styles.listInfo}>
          <Text style={styles.listName} numberOfLines={1}>
            {t(item.nameKey)}
          </Text>
          <Text style={styles.listDesc} numberOfLines={1}>
            {t(item.descriptionKey)}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => toggleFavorite(item.id)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={[styles.fav, fav && styles.favActive]}>
            {fav ? '★' : '☆'}
          </Text>
        </TouchableOpacity>
        <View style={styles.getBtn}>
          <Text style={styles.getBtnText}>PLAY</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{t('selectGame.title')}</Text>

        {/* Featured horizontal scroll */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featuredRow}
          pagingEnabled={false}
          snapToInterval={300}
          decelerationRate="fast"
        >
          {featured.map(renderFeatured)}
        </ScrollView>

        {/* Category filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catRow}
        style={sharedStyles.noGrow}
        >
          <TouchableOpacity
            style={[styles.catChip, !selectedCategory && styles.catChipActive]}
            onPress={() => setSelectedCategory(null)}
          >
            <Text
              style={[
                styles.catChipText,
                !selectedCategory && styles.catChipTextActive,
              ]}
            >
              {t('selectGame.allGames')}
            </Text>
          </TouchableOpacity>
          {categories.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.catChip, active && styles.catChipActive]}
                onPress={() => setSelectedCategory(active ? null : cat)}
              >
                <Text
                  style={[styles.catChipText, active && styles.catChipTextActive]}
                >
                  {t(`selectGame.categories.${cat}`)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Game list */}
        {rest.map((item) => (
          <View key={item.id}>{renderListItem({ item })}</View>
        ))}

        <View style={styles.footer}>
          <LanguageSelector />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f7' },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: '#000',
    paddingHorizontal: 20,
    paddingTop: 36,
    paddingBottom: 16,
  },
  featuredRow: { paddingHorizontal: 16, gap: 12, paddingBottom: 20 },
  featuredCard: {
    width: 280,
    borderRadius: 20,
    padding: 20,
    overflow: 'hidden',
  },
  featuredContent: { flexDirection: 'row', alignItems: 'center' },
  featuredLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  featuredName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 6,
  },
  featuredDesc: { fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 18 },
  featuredEmoji: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  catRow: { paddingHorizontal: 16, gap: 8, paddingBottom: 16 },
  catChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#e5e5ea',
  },
  catChipActive: { backgroundColor: '#007aff' },
  catChipText: { fontSize: 13, fontWeight: '600', color: '#666' },
  catChipTextActive: { color: '#fff' },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 0,
  },
  listEmoji: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#f2f2f7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  listInfo: { flex: 1 },
  listName: { fontSize: 15, fontWeight: '600', color: '#000' },
  listDesc: { fontSize: 12, color: '#8e8e93', marginTop: 2 },
  fav: { fontSize: 18, color: '#ddd', marginRight: 10 },
  favActive: { color: '#f0c040' },
  getBtn: {
    backgroundColor: '#f2f2f7',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  getBtnText: { fontSize: 13, fontWeight: '700', color: '#007aff' },
  footer: { paddingVertical: 20, alignItems: 'center' },
});
