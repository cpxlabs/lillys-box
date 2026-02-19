/**
 * Alt 5: Bubble Layout
 * Large circular emoji buttons in a flowing 3-column grid.
 * Playful, toy-like aesthetic with pastel colors.
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

const PASTEL: string[] = [
  '#fce4ec', '#e8f5e9', '#e3f2fd', '#fff3e0',
  '#f3e5f5', '#e0f7fa', '#fff9c4', '#fbe9e7',
  '#e8eaf6', '#f1f8e9', '#ede7f6', '#e0f2f1',
];

export const Alt5BubbleLayout: React.FC<GameSelectorAltProps> = ({
  sortedGames,
  categories,
  selectedCategory,
  setSelectedCategory,
  handleGameSelect,
  t,
}) => {
  const renderBubble = ({ item, index }: { item: GameDefinition; index: number }) => {
    const bg = PASTEL[index % PASTEL.length];
    return (
      <TouchableOpacity
        style={styles.bubbleWrapper}
        onPress={() => handleGameSelect(item.id)}
        activeOpacity={0.75}
      >
        <View style={[styles.bubble, { backgroundColor: bg }]}>
          <EmojiIcon emoji={item.emoji} size={38} />
        </View>
        <Text style={styles.bubbleName} numberOfLines={1}>
          {t(item.nameKey)}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{t('selectGame.title')}</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
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
        renderItem={renderBubble}
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
  container: { flex: 1, backgroundColor: '#fafafa' },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#333',
    textAlign: 'center',
    paddingTop: 36,
    paddingBottom: 12,
  },
  filterRow: { paddingHorizontal: 16, gap: 8, paddingBottom: 16 },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#eee',
  },
  pillActive: { backgroundColor: '#ff7043' },
  pillText: { fontSize: 13, fontWeight: '600', color: '#777' },
  pillTextActive: { color: '#fff' },
  grid: { paddingHorizontal: 16, paddingBottom: 8 },
  gridRow: { justifyContent: 'space-around', marginBottom: 4 },
  bubbleWrapper: {
    alignItems: 'center',
    width: '30%',
    marginBottom: 16,
  },
  bubble: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  bubbleName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#444',
    marginTop: 6,
    textAlign: 'center',
  },
  footer: { paddingVertical: 10, alignItems: 'center' },
});
