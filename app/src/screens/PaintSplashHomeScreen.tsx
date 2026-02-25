import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { usePaintSplash } from '../context/PaintSplashContext';
import { ScreenNavigationProp } from '../types/navigation';
import { EmojiIcon } from '../components/EmojiIcon';
import { useGameBack } from '../hooks/useGameBack';

type Props = { navigation: ScreenNavigationProp<'PaintSplashHome'> };

export const PaintSplashHomeScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { bestScore } = usePaintSplash();
  const handleBack = useGameBack(navigation);
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleBack}><Text style={styles.backText}>← {t('common.back')}</Text></TouchableOpacity>
      <View style={styles.content}>
        <EmojiIcon emoji="🎨" size={72} style={styles.emoji} />
        <Text style={styles.title}>{t('paintSplash.home.title')}</Text>
        <Text style={styles.subtitle}>{t('paintSplash.home.subtitle')}</Text>
        {bestScore > 0 && (<View style={styles.bestScoreCard}><Text style={styles.bestScoreLabel}>{t('paintSplash.home.bestScore')}</Text><Text style={styles.bestScoreValue}>{bestScore}</Text></View>)}
        <TouchableOpacity style={styles.playButton} onPress={() => navigation.navigate('PaintSplashGame')} activeOpacity={0.85}><Text style={styles.playButtonText}>{t('paintSplash.home.play')}</Text></TouchableOpacity>
        <Text style={styles.instructions}>{t('paintSplash.home.instructions')}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fce4ec' },
  backButton: { paddingHorizontal: 20, paddingTop: 16 },
  backText: { fontSize: 16, color: '#e91e63', fontWeight: '600' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, marginTop: -40 },
  emoji: { fontSize: 72, marginBottom: 12 },
  title: { fontSize: 36, fontWeight: '800', color: '#e91e63', marginBottom: 8 },
  subtitle: { fontSize: 18, color: '#666', textAlign: 'center', marginBottom: 28 },
  bestScoreCard: { backgroundColor: '#fff', borderRadius: 16, paddingVertical: 12, paddingHorizontal: 28, marginBottom: 28, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3, alignItems: 'center' },
  bestScoreLabel: { fontSize: 14, color: '#888', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },
  bestScoreValue: { fontSize: 32, fontWeight: '800', color: '#e91e63' },
  playButton: { backgroundColor: '#e91e63', paddingVertical: 18, paddingHorizontal: 52, borderRadius: 32, shadowColor: '#e91e63', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  playButtonText: { fontSize: 22, fontWeight: '700', color: '#fff' },
  instructions: { fontSize: 14, color: '#888', textAlign: 'center', marginTop: 28, maxWidth: 300, lineHeight: 20 },
});
