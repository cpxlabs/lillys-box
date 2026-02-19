/**
 * Alt 2: Minimal Grid
 * Clean 3-column grid — large emoji + name only. No descriptions, no badges.
 * Focuses on tap targets and visual scanning.
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

export const Alt2MinimalGrid: React.FC<GameSelectorAltProps> = ({
  sortedGames,
  categories,
  selectedCategory,
  setSelectedCategory,
  handleGameSelect,
  t,
}) => {
  const renderCard = ({ item }: { item: GameDefinition }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleGameSelect(item.id)}
      activeOpacity={0.7}
    >
      <EmojiIcon emoji={item.emoji} size={36} />
      <Text style={styles.cardName} numberOfLines={1}>
        {t(item.nameKey)}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{t('selectGame.title')}</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabs}
      >
        <TouchableOpacity
          style={[styles.tab, !selectedCategory && styles.tabActive]}
          onPress={() => setSelectedCategory(null)}
        >
          <Text style={[styles.tabText, !selectedCategory && styles.tabTextActive]}>
            {t('selectGame.allGames')}
          </Text>
        </TouchableOpacity>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.tab, selectedCategory === cat && styles.tabActive]}
            onPress={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
          >
            <Text
              style={[styles.tabText, selectedCategory === cat && styles.tabTextActive]}
            >
              {t(`selectGame.categories.${cat}`)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={sortedGames}
        renderItem={renderCard}
        keyExtractor={(item) => item.id}
        numColumns={3}
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
  container: { flex: 1, backgroundColor: '#fff' },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 8,
  },
  tabs: { paddingHorizontal: 16, gap: 4, paddingBottom: 16 },
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  tabActive: { backgroundColor: '#111' },
  tabText: { fontSize: 13, fontWeight: '500', color: '#888' },
  tabTextActive: { color: '#fff' },
  grid: { paddingHorizontal: 12, paddingBottom: 8 },
  gridRow: { justifyContent: 'flex-start', gap: 8 },
  card: {
    width: '31%',
    aspectRatio: 1,
    backgroundColor: '#f7f7f7',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    gap: 8,
  },
  cardName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  footer: { paddingVertical: 10, alignItems: 'center' },
});
