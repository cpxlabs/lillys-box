import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { usePetExplorer } from '../context/PetExplorerContext';
import { ScreenNavigationProp } from '../types/navigation';
import { EmojiIcon } from '../components/EmojiIcon';
import { useGameBack } from '../hooks/useGameBack';

type Props = { navigation: ScreenNavigationProp<'PetExplorerHome'> };

export const PetExplorerHomeScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { bestScore } = usePetExplorer();
  const handleBack = useGameBack(navigation);
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleBack}><Text style={styles.backText}>← {t('common.back')}</Text></TouchableOpacity>
      <View style={styles.content}>
        <EmojiIcon emoji="🧭" size={72} style={styles.emoji} />
        <Text style={styles.title}>{t('petExplorer.home.title')}</Text>
        <Text style={styles.subtitle}>{t('petExplorer.home.subtitle')}</Text>
        {bestScore > 0 && (<View style={styles.bestScoreCard}><Text style={styles.bestScoreLabel}>{t('petExplorer.home.bestScore')}</Text><Text style={styles.bestScoreValue}>{bestScore}</Text></View>)}
        <TouchableOpacity style={styles.playButton} onPress={() => navigation.navigate('PetExplorerGame')} activeOpacity={0.85}><Text style={styles.playButtonText}>{t('petExplorer.home.play')}</Text></TouchableOpacity>
        <Text style={styles.instructions}>{t('petExplorer.home.instructions')}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  backButton: { paddingHorizontal: 20, paddingTop: 16 },
  backText: { fontSize: 14, color: '#78c850', fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, marginTop: -40 },
  emoji: { fontSize: 72, marginBottom: 12 },
  title: { fontSize: 32, fontWeight: '900', color: '#ffd700', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#8899aa', textAlign: 'center', marginBottom: 28, letterSpacing: 0.5 },
  bestScoreCard: { backgroundColor: '#16213e', borderRadius: 4, borderWidth: 3, borderColor: '#78c850', paddingVertical: 12, paddingHorizontal: 28, marginBottom: 28, alignItems: 'center' },
  bestScoreLabel: { fontSize: 12, color: '#78c850', fontWeight: '800', textTransform: 'uppercase', letterSpacing: 2 },
  bestScoreValue: { fontSize: 32, fontWeight: '900', color: '#ffd700' },
  playButton: { backgroundColor: '#ee1515', paddingVertical: 16, paddingHorizontal: 52, borderRadius: 4, borderWidth: 3, borderColor: '#ff4444' },
  playButtonText: { fontSize: 20, fontWeight: '900', color: '#fff', textTransform: 'uppercase', letterSpacing: 2 },
  instructions: { fontSize: 13, color: '#5a6a7a', textAlign: 'center', marginTop: 28, maxWidth: 300, lineHeight: 20, letterSpacing: 0.5 },
});
