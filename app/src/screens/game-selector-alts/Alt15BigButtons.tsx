/**
 * Alt 15: Big Buttons
 * Extra-large tap targets optimized for small children.
 * Giant emoji, huge text, single column, maximum tappability.
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

const BTN_COLORS = ['#FF6B6B', '#4ECDC4', '#FFD93D', '#45B7D1', '#96CEB4', '#FF8A5C', '#A78BFA', '#F472B6'];

export const Alt15BigButtons: React.FC<GameSelectorAltProps> = ({
  sortedGames,
  categories,
  selectedCategory,
  setSelectedCategory,
  handleGameSelect,
  t,
}) => {
  const renderButton = ({ item, index }: { item: GameDefinition; index: number }) => {
    const color = BTN_COLORS[index % BTN_COLORS.length];
    return (
      <TouchableOpacity
        style={[styles.bigBtn, { backgroundColor: color }]}
        onPress={() => handleGameSelect(item.id)}
        activeOpacity={0.75}
      >
        <View style={styles.emojiBox}>
          <EmojiIcon emoji={item.emoji} size={48} />
        </View>
        <Text style={styles.btnName} numberOfLines={1}>
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
        style={sharedStyles.noGrow}
      >
        <TouchableOpacity
          style={[styles.chip, !selectedCategory && styles.chipActive]}
          onPress={() => setSelectedCategory(null)}
        >
          <Text style={[styles.chipText, !selectedCategory && styles.chipTextActive]}>
            {t('selectGame.allGames')}
          </Text>
        </TouchableOpacity>
        {categories.map((cat) => {
          const active = selectedCategory === cat;
          return (
            <TouchableOpacity
              key={cat}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => setSelectedCategory(active ? null : cat)}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {t(`selectGame.categories.${cat}`)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <FlatList
        data={sortedGames}
        renderItem={renderButton}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.footer}>
        <LanguageSelector />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F9FF' },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1E40AF',
    textAlign: 'center',
    paddingTop: 32,
    paddingBottom: 12,
  },
  filterRow: { paddingHorizontal: 14, gap: 8, paddingBottom: 14 },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: '#DBEAFE',
  },
  chipActive: { backgroundColor: '#1E40AF' },
  chipText: { fontSize: 15, fontWeight: '800', color: '#1E40AF' },
  chipTextActive: { color: '#fff' },
  list: { paddingHorizontal: 16, paddingBottom: 8 },
  bigBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginBottom: 12,
    minHeight: 80,
  },
  emojiBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  btnName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    flex: 1,
    textShadowColor: 'rgba(0,0,0,0.12)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  footer: { paddingVertical: 10, alignItems: 'center' },
});
