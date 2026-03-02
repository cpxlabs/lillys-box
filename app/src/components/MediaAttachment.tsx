import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { ReviewMedia } from '../types/review';
import { GifPicker } from './GifPicker';
import { logger } from '../utils/logger';

// Lazy import to avoid crash when expo-image-picker is not installed
let ImagePicker: typeof import('expo-image-picker') | null = null;
try {
  ImagePicker = require('expo-image-picker');
} catch {
  logger.warn('expo-image-picker not installed — image picking disabled');
}

const MAX_ITEMS = 3;
const MAX_IMAGE_PX = 1024;

type Props = {
  media: ReviewMedia[];
  onAdd: (item: ReviewMedia) => void;
  onRemove: (index: number) => void;
};

export const MediaAttachment: React.FC<Props> = ({ media, onAdd, onRemove }) => {
  const { t } = useTranslation();
  const [gifPickerVisible, setGifPickerVisible] = useState(false);
  const canAdd = media.length < MAX_ITEMS;

  const handlePickImage = async () => {
    if (!ImagePicker) {
      Alert.alert(t('review.imagePickerUnavailable'), t('review.imagePickerInstallHint'));
      return;
    }

    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(t('review.permissionDenied'), t('review.permissionGallery'));
        return;
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
      exif: false,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      onAdd({
        type: 'image',
        uri: asset.uri,
        width: Math.min(asset.width ?? MAX_IMAGE_PX, MAX_IMAGE_PX),
        height: asset.height,
      });
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.strip}
      >
        {/* Add buttons */}
        {canAdd && (
          <>
            <TouchableOpacity
              style={styles.addButton}
              onPress={handlePickImage}
              activeOpacity={0.7}
              accessibilityLabel={t('review.addImage')}
            >
              <Text style={styles.addButtonIcon}>📷</Text>
              <Text style={styles.addButtonLabel}>{t('review.addImage')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setGifPickerVisible(true)}
              activeOpacity={0.7}
              accessibilityLabel={t('review.addGif')}
            >
              <Text style={styles.addButtonIcon}>GIF</Text>
              <Text style={styles.addButtonLabel}>{t('review.addGif')}</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Media previews */}
        {media.map((item, index) => (
          <View key={item.uri} style={styles.preview}>
            <Image source={{ uri: item.thumbnailUri ?? item.uri }} style={styles.previewImage} />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => onRemove(index)}
              hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
              accessibilityLabel={t('review.removeMedia')}
            >
              <Text style={styles.removeIcon}>✕</Text>
            </TouchableOpacity>
            {item.type === 'gif' && (
              <View style={styles.gifBadge}>
                <Text style={styles.gifBadgeText}>GIF</Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {media.length >= MAX_ITEMS && (
        <Text style={styles.maxReached}>{t('review.maxMediaReached', { max: MAX_ITEMS })}</Text>
      )}

      <GifPicker
        visible={gifPickerVisible}
        onSelect={(gif) => {
          onAdd(gif);
          setGifPickerVisible(false);
        }}
        onClose={() => setGifPickerVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  strip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 2,
    paddingVertical: 4,
  },
  addButton: {
    width: 70,
    height: 70,
    borderRadius: 12,
    backgroundColor: '#f5f0ff',
    borderWidth: 1.5,
    borderColor: '#d0b8f0',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  addButtonIcon: {
    fontSize: 20,
    lineHeight: 24,
  },
  addButtonLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#9b59b6',
  },
  preview: {
    width: 70,
    height: 70,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  previewImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
  },
  removeButton: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeIcon: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    lineHeight: 14,
  },
  gifBadge: {
    position: 'absolute',
    bottom: 3,
    left: 3,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  gifBadgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
  },
  maxReached: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    marginLeft: 2,
  },
});
