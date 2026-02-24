/**
 * Alt 16: Rainbow Rows
 * Single-column list where each row cycles through rainbow colors.
 * Clean, cheerful, easy to scan. Large touch targets.
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

const RAINBOW = [
  { bg: '#FEE2E2', text: '#DC2626' },
  { bg: '#FFEDD5', text: '#EA580C' },
  { bg: '#FEF9C3', text: '#CA8A04' },
  { bg: '#DCFCE7', text: '#16A34A' },
  { bg: '#DBEAFE', text: '#2563EB' },
  { bg: '#E0E7FF', text: '#4F46E5' },
  { bg: '#F3E8FF', text: '#9333EA' },
];

export const Alt16RainbowRows: React.FC<GameSelectorAltProps> = ({
  sortedGames,
  categories,
  selectedCategory,
  setSelectedCategory,
  handleGameSelect,
  t,
}) => {
  const renderRow = ({ item, index }: { item: GameDefinition; index: number }) => {
    const rainbow = RAINBOW[index % RAINBOW.length];
    return (
      <TouchableOpacity
        style={[styles.row, { backgroundColor: rainbow.bg }]}
        onPress={() => handleGameSelect(item.id)}
        activeOpacity={0.75}
      >
        <EmojiIcon emoji={item.emoji} size={36} />
        <View style={styles.info}>
          <Text style={[styles.name, { color: rainbow.text }]} numberOfLines={1}>
            {t(item.nameKey)}
          </Text>
          <Text style={styles.desc} numberOfLines={1}>
            {t(item.descriptionKey)}
          </Text>
        </View>
        <Text style={[styles.arrow, { color: rainbow.text }]}>›</Text>
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
        renderItem={renderRow}
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
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#4F46E5',
    textAlign: 'center',
    paddingTop: 32,
    paddingBottom: 12,
  },
  tabs: { paddingHorizontal: 14, gap: 8, paddingBottom: 14 },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
  },
  tabActive: { backgroundColor: '#4F46E5' },
  tabText: { fontSize: 14, fontWeight: '700', color: '#4F46E5' },
  tabTextActive: { color: '#fff' },
  list: { paddingHorizontal: 14, paddingBottom: 8 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    padding: 16,
    marginBottom: 8,
    minHeight: 70,
  },
  info: { flex: 1, marginLeft: 14 },
  name: { fontSize: 17, fontWeight: '800' },
  desc: { fontSize: 12, color: '#888', marginTop: 3 },
  arrow: { fontSize: 32, fontWeight: '300', marginLeft: 8 },
  footer: { paddingVertical: 10, alignItems: 'center' },
});
