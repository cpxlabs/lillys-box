import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useLightningTap } from '../context/LightningTapContext';
import { ScreenNavigationProp } from '../types/navigation';
import { EmojiIcon } from '../components/EmojiIcon';
import { useGameBack } from '../hooks/useGameBack';

type Props = { navigation: ScreenNavigationProp<'LightningTapHome'> };

export const LightningTapHomeScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { bestScore } = useLightningTap();
  const handleBack = useGameBack(navigation);
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleBack}><Text style={styles.backText}>← {t('common.back')}</Text></TouchableOpacity>
      <View style={styles.content}>
        <EmojiIcon emoji="⚡" size={72} style={styles.emoji} />
        <Text style={styles.title}>{t('lightningTap.home.title')}</Text>
        <Text style={styles.subtitle}>{t('lightningTap.home.subtitle')}</Text>
        {bestScore > 0 && (<View style={styles.bestScoreCard}><Text style={styles.bestScoreLabel}>{t('lightningTap.home.bestScore')}</Text><Text style={styles.bestScoreValue}>{bestScore}</Text></View>)}
        <TouchableOpacity style={styles.playButton} onPress={() => navigation.navigate('LightningTapGame')} activeOpacity={0.85}><Text style={styles.playButtonText}>{t('lightningTap.home.play')}</Text></TouchableOpacity>
        <Text style={styles.instructions}>{t('lightningTap.home.instructions')}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fffde7' },
  backButton: { paddingHorizontal: 20, paddingTop: 16 },
  backText: { fontSize: 16, color: '#ffc107', fontWeight: '600' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, marginTop: 0 },
  emoji: { fontSize: 72, marginBottom: 12 },
  title: { fontSize: 36, fontWeight: '800', color: '#ffc107', marginBottom: 8 },
  subtitle: { fontSize: 18, color: '#666', textAlign: 'center', marginBottom: 28 },
  bestScoreCard: { backgroundColor: '#fff', borderRadius: 16, paddingVertical: 12, paddingHorizontal: 28, marginBottom: 28, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3, alignItems: 'center' },
  bestScoreLabel: { fontSize: 14, color: '#888', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },
  bestScoreValue: { fontSize: 32, fontWeight: '800', color: '#ffc107' },
  playButton: { backgroundColor: '#ffc107', paddingVertical: 18, paddingHorizontal: 52, borderRadius: 32, shadowColor: '#ffc107', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  playButtonText: { fontSize: 22, fontWeight: '700', color: '#fff' },
  instructions: { fontSize: 14, color: '#888', textAlign: 'center', marginTop: 28, maxWidth: 300, lineHeight: 20 },
});
