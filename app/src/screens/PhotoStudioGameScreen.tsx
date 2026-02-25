import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Modal } from 'react-native';
import { useTranslation } from 'react-i18next';
import { usePhotoStudio } from '../context/PhotoStudioContext';
import { ScreenNavigationProp } from '../types/navigation';
import { useGameBack } from '../hooks/useGameBack';

type Props = { navigation: ScreenNavigationProp<'PhotoStudioGame'> };

const BACKGROUNDS = ['🌅', '🌌', '🏖️', '🏰', '🌿', '🎡'];
const BG_NAMES = ['Sunset', 'Space', 'Beach', 'Castle', 'Garden', 'Fun Fair'];
const BG_COLORS = ['#ff7043', '#1a237e', '#26c6da', '#7b1fa2', '#388e3c', '#f9a825'];

const POSES = [
  { emoji: '🐾', name: 'Happy', face: '😄' },
  { emoji: '🐾', name: 'Silly', face: '😜' },
  { emoji: '🐾', name: 'Cool', face: '😎' },
  { emoji: '🐾', name: 'Sleepy', face: '😴' },
];

const PROPS = ['🎩', '👓', '🎀', '🌟', '🦄', '🍭', '🎸', '🎪'];
const STICKERS = ['⭐', '❤️', '✨', '🌈', '🎊', '💫', '🌸', '🦋'];

const MAX_PHOTOS = 5;

interface Photo {
  bg: number;
  pose: number;
  props: string[];
  stickers: string[];
  id: number;
}

let photoId = 0;

export const PhotoStudioGameScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { updateBestScore } = usePhotoStudio();

  const [bgIndex, setBgIndex] = useState(0);
  const [poseIndex, setPoseIndex] = useState(0);
  const [activeProps, setActiveProps] = useState<string[]>([]);
  const [activeStickers, setActiveStickers] = useState<string[]>([]);
  const [gallery, setGallery] = useState<Photo[]>([]);
  const [showGallery, setShowGallery] = useState(false);
  const [flash, setFlash] = useState(false);
  const [score, setScore] = useState(0);

  const toggleProp = useCallback((prop: string) => {
    setActiveProps(prev => prev.includes(prop) ? prev.filter(p => p !== prop) : [...prev, prop].slice(-3));
  }, []);

  const toggleSticker = useCallback((sticker: string) => {
    setActiveStickers(prev => prev.includes(sticker) ? prev.filter(s => s !== sticker) : [...prev, sticker].slice(-5));
  }, []);

  const takePhoto = useCallback(() => {
    setFlash(true);
    setTimeout(() => setFlash(false), 300);
    const photo: Photo = { bg: bgIndex, pose: poseIndex, props: [...activeProps], stickers: [...activeStickers], id: photoId++ };
    const newGallery = [...gallery, photo].slice(-MAX_PHOTOS);
    setGallery(newGallery);
    const pts = 50 + activeProps.length * 10 + activeStickers.length * 5;
    const newScore = score + pts;
    setScore(newScore);
    updateBestScore(newScore);
  }, [bgIndex, poseIndex, activeProps, activeStickers, gallery, score, updateBestScore]);

  const handleBack = useGameBack(navigation);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}><Text style={styles.backText}>← {t('common.back')}</Text></TouchableOpacity>
        <Text style={styles.title}>{t('photoStudio.game.title')}</Text>
        <TouchableOpacity onPress={() => setShowGallery(true)}>
          <Text style={styles.galleryBtn}>🖼️ {gallery.length}</Text>
        </TouchableOpacity>
      </View>

      {/* Photo Stage */}
      <View style={[styles.stage, { backgroundColor: BG_COLORS[bgIndex] }]}>
        {flash && <View style={styles.flashOverlay} />}
        <Text style={styles.bgEmoji}>{BACKGROUNDS[bgIndex]}</Text>
        <View style={styles.petStage}>
          <Text style={styles.propsRow}>{activeProps.join(' ')}</Text>
          <Text style={styles.petBody}>{POSES[poseIndex].face}</Text>
          <Text style={styles.petPaw}>{POSES[poseIndex].emoji}</Text>
        </View>
        <Text style={styles.stickersRow}>{activeStickers.join(' ')}</Text>
      </View>

      <ScrollView style={styles.controls}>
        {/* Background */}
        <Text style={styles.sectionLabel}>{t('photoStudio.game.background')}:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.optionRow}>
          {BACKGROUNDS.map((bg, i) => (
            <TouchableOpacity key={i} style={[styles.bgOption, bgIndex === i && styles.bgSelected, { backgroundColor: BG_COLORS[i] }]} onPress={() => setBgIndex(i)}>
              <Text style={styles.bgEmojiBtn}>{bg}</Text>
              <Text style={styles.bgName}>{BG_NAMES[i]}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Poses */}
        <Text style={styles.sectionLabel}>{t('photoStudio.game.pose')}:</Text>
        <View style={styles.optionRow}>
          {POSES.map((pose, i) => (
            <TouchableOpacity key={i} style={[styles.poseBtn, poseIndex === i && styles.poseSelected]} onPress={() => setPoseIndex(i)}>
              <Text style={styles.poseFace}>{pose.face}</Text>
              <Text style={styles.poseName}>{pose.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Props */}
        <Text style={styles.sectionLabel}>{t('photoStudio.game.props')}:</Text>
        <View style={styles.propsGrid}>
          {PROPS.map((prop, i) => (
            <TouchableOpacity key={i} style={[styles.propBtn, activeProps.includes(prop) && styles.propSelected]} onPress={() => toggleProp(prop)}>
              <Text style={styles.propEmoji}>{prop}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Stickers */}
        <Text style={styles.sectionLabel}>{t('photoStudio.game.stickers')}:</Text>
        <View style={styles.propsGrid}>
          {STICKERS.map((sticker, i) => (
            <TouchableOpacity key={i} style={[styles.propBtn, activeStickers.includes(sticker) && styles.propSelected]} onPress={() => toggleSticker(sticker)}>
              <Text style={styles.propEmoji}>{sticker}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.shutterBtn} onPress={takePhoto}>
        <Text style={styles.shutterEmoji}>📸</Text>
        <Text style={styles.shutterText}>{t('photoStudio.game.takePhoto')}</Text>
      </TouchableOpacity>

      {/* Gallery Modal */}
      <Modal visible={showGallery} transparent animationType="slide">
        <View style={styles.galleryModal}>
          <View style={styles.galleryHeader}>
            <Text style={styles.galleryTitle}>{t('photoStudio.game.gallery')} ({gallery.length})</Text>
            <TouchableOpacity onPress={() => setShowGallery(false)}><Text style={styles.galleryClose}>✕</Text></TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.galleryGrid}>
            {gallery.map(photo => (
              <View key={photo.id} style={[styles.photoCard, { backgroundColor: BG_COLORS[photo.bg] }]}>
                <Text style={styles.photoBg}>{BACKGROUNDS[photo.bg]}</Text>
                <Text style={styles.photoFace}>{POSES[photo.pose].face}</Text>
                <Text style={styles.photoProps}>{photo.props.join('')}</Text>
                <Text style={styles.photoStickers}>{photo.stickers.join('')}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#efebe9' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#bcaaa4' },
  backText: { fontSize: 16, color: '#3e2723', fontWeight: '600' },
  title: { fontSize: 18, fontWeight: '700', color: '#3e2723' },
  galleryBtn: { fontSize: 16, fontWeight: '700', color: '#3e2723' },
  stage: { height: 200, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  flashOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#fff', opacity: 0.9, zIndex: 10 },
  bgEmoji: { position: 'absolute', fontSize: 80, opacity: 0.4 },
  petStage: { alignItems: 'center' },
  propsRow: { fontSize: 28, marginBottom: 4 },
  petBody: { fontSize: 56 },
  petPaw: { fontSize: 24, marginTop: 4 },
  stickersRow: { fontSize: 24, marginTop: 8 },
  controls: { flex: 1, backgroundColor: '#fff' },
  sectionLabel: { fontSize: 13, fontWeight: '700', color: '#666', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 6, textTransform: 'uppercase' },
  optionRow: { flexDirection: 'row', paddingHorizontal: 12, gap: 8, paddingBottom: 4, flexWrap: 'wrap' },
  bgOption: { borderRadius: 10, padding: 8, alignItems: 'center', width: 64 },
  bgSelected: { borderWidth: 3, borderColor: '#fff' },
  bgEmojiBtn: { fontSize: 24 },
  bgName: { fontSize: 9, color: '#fff', fontWeight: '600', marginTop: 2 },
  poseBtn: { backgroundColor: '#f5f5f5', borderRadius: 12, padding: 10, alignItems: 'center', flex: 1, margin: 4 },
  poseSelected: { backgroundColor: '#bcaaa4' },
  poseFace: { fontSize: 32 },
  poseName: { fontSize: 10, color: '#555', marginTop: 2 },
  propsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, gap: 8, paddingBottom: 8 },
  propBtn: { width: 52, height: 52, borderRadius: 10, backgroundColor: '#f5f5f5', justifyContent: 'center', alignItems: 'center' },
  propSelected: { backgroundColor: '#bcaaa4', borderWidth: 2, borderColor: '#795548' },
  propEmoji: { fontSize: 28 },
  shutterBtn: { backgroundColor: '#795548', margin: 16, borderRadius: 24, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  shutterEmoji: { fontSize: 28 },
  shutterText: { fontSize: 18, fontWeight: '700', color: '#fff' },
  galleryModal: { flex: 1, backgroundColor: '#fff', marginTop: 60, borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  galleryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
  galleryTitle: { fontSize: 18, fontWeight: '700', color: '#333' },
  galleryClose: { fontSize: 20, color: '#888' },
  galleryGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 12, gap: 12 },
  photoCard: { width: 120, height: 120, borderRadius: 12, justifyContent: 'center', alignItems: 'center', padding: 8 },
  photoBg: { fontSize: 32, opacity: 0.6, position: 'absolute' },
  photoFace: { fontSize: 32 },
  photoProps: { fontSize: 16 },
  photoStickers: { fontSize: 14 },
});
