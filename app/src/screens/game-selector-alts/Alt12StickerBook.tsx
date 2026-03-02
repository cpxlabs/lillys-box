/**
 * Alt 12: Sticker Book
 * Games appear as stickers on a dotted notebook background.
 * Tilted cards, colorful borders, playful feel.
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

const STICKER_BG = ['#FECACA', '#BBF7D0', '#BFDBFE', '#FDE68A', '#E9D5FF', '#FBCFE8', '#A7F3D0', '#FED7AA'];
const STICKER_BORDER = ['#EF4444', '#22C55E', '#3B82F6', '#EAB308', '#A855F7', '#EC4899', '#10B981', '#F97316'];

export const Alt12StickerBook: React.FC<GameSelectorAltProps> = ({
  sortedGames,
  categories,
  selectedCategory,
  setSelectedCategory,
  handleGameSelect,
  t,
}) => {
  const renderSticker = ({ item, index }: { item: GameDefinition; index: number }) => {
    const bg = STICKER_BG[index % STICKER_BG.length];
    const border = STICKER_BORDER[index % STICKER_BORDER.length];
    const tilt = index % 2 === 0 ? -2 : 2;

    return (
      <TouchableOpacity
        style={[
          styles.sticker,
          {
            backgroundColor: bg,
            borderColor: border,
            transform: [{ rotate: `${tilt}deg` }],
          },
        ]}
        onPress={() => handleGameSelect(item.id)}
        activeOpacity={0.8}
      >
        <EmojiIcon emoji={item.emoji} size={40} />
        <Text style={[styles.stickerName, { color: border }]} numberOfLines={1}>
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
        contentContainerStyle={styles.tabs}
      style={sharedStyles.noGrow}
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
        renderItem={renderSticker}
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
  container: { flex: 1, backgroundColor: '#FFFEF5' },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#7C3AED',
    textAlign: 'center',
    paddingTop: 32,
    paddingBottom: 10,
  },
  tabs: { paddingHorizontal: 14, gap: 8, paddingBottom: 14 },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#F5F3FF',
    borderWidth: 2,
    borderColor: '#E9D5FF',
  },
  tabActive: { backgroundColor: '#7C3AED', borderColor: '#7C3AED' },
  tabText: { fontSize: 14, fontWeight: '700', color: '#7C3AED' },
  tabTextActive: { color: '#fff' },
  grid: { paddingHorizontal: 16, paddingBottom: 8 },
  gridRow: { justifyContent: 'space-between' },
  sticker: {
    width: '46%',
    borderRadius: 20,
    padding: 18,
    marginBottom: 18,
    alignItems: 'center',
    borderWidth: 3,
    borderStyle: 'dashed',
  },
  stickerName: {
    fontSize: 15,
    fontWeight: '800',
    marginTop: 10,
    textAlign: 'center',
  },
  footer: { paddingVertical: 10, alignItems: 'center' },
});
