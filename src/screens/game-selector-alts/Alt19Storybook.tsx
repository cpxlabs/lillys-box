/**
 * Alt 19: Storybook
 * Warm cream "book page" aesthetic. Serif-inspired typography.
 * Games listed like chapters in a children's storybook.
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

export const Alt19Storybook: React.FC<GameSelectorAltProps> = ({
  sortedGames,
  categories,
  selectedCategory,
  setSelectedCategory,
  isFavorite,
  toggleFavorite,
  handleGameSelect,
  t,
}) => {
  const renderChapter = ({ item, index }: { item: GameDefinition; index: number }) => {
    const fav = isFavorite(item.id);
    return (
      <TouchableOpacity
        style={styles.chapter}
        onPress={() => handleGameSelect(item.id)}
        activeOpacity={0.8}
      >
        <View style={styles.chapterLeft}>
          <Text style={styles.chapterNum}>{index + 1}</Text>
        </View>
        <View style={styles.chapterEmoji}>
          <EmojiIcon emoji={item.emoji} size={32} />
        </View>
        <View style={styles.chapterInfo}>
          <Text style={styles.chapterTitle} numberOfLines={1}>
            {t(item.nameKey)}
          </Text>
          <Text style={styles.chapterDesc} numberOfLines={2}>
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
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.bookCover}>
        <Text style={styles.title}>{t('selectGame.title')}</Text>
        <View style={styles.titleLine} />
        <Text style={styles.subtitle}>{t('selectGame.subtitle')}</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
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
        renderItem={renderChapter}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      <View style={styles.footer}>
        <LanguageSelector />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF8F0' },
  bookCover: { alignItems: 'center', paddingTop: 32, paddingBottom: 12 },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#7C2D12',
    fontStyle: 'italic',
  },
  titleLine: {
    width: 80,
    height: 2,
    backgroundColor: '#D97706',
    marginVertical: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#B45309',
    fontStyle: 'italic',
  },
  filterRow: { paddingHorizontal: 14, gap: 8, paddingBottom: 14 },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  tabActive: { backgroundColor: '#92400E', borderColor: '#92400E' },
  tabText: { fontSize: 13, fontWeight: '600', color: '#92400E' },
  tabTextActive: { color: '#fff' },
  list: { paddingHorizontal: 16, paddingBottom: 8 },
  separator: {
    height: 1,
    backgroundColor: '#F3E8D0',
    marginVertical: 2,
    marginHorizontal: 8,
  },
  chapter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  chapterLeft: {
    width: 32,
    alignItems: 'center',
  },
  chapterNum: {
    fontSize: 18,
    fontWeight: '800',
    color: '#D4A06A',
    fontStyle: 'italic',
  },
  chapterEmoji: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  chapterInfo: { flex: 1 },
  chapterTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#7C2D12',
  },
  chapterDesc: {
    fontSize: 12,
    color: '#A68060',
    marginTop: 3,
    lineHeight: 16,
    fontStyle: 'italic',
  },
  fav: { fontSize: 20, color: '#E0D0C0', paddingHorizontal: 6 },
  favActive: { color: '#f0c040' },
  footer: { paddingVertical: 10, alignItems: 'center' },
});
