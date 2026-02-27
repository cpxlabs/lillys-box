import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { usePet } from '../context/PetContext';
import { PetRenderer } from '../components/PetRenderer';
import { StatusCard } from '../components/StatusCard';
import { ScreenHeader } from '../components/ScreenHeader';
import { ClothingSlot } from '../types';
import { getItemsBySlot } from '../data/clothingItems';
import { useBackButton } from '../hooks/useBackButton';
import { useGameBack } from '../hooks/useGameBack';
import { ScreenNavigationProp } from '../types/navigation';
import { calculatePetAge } from '../utils/age';
import { useResponsive } from '../hooks/useResponsive';
import { PET_SIZE_SMALL, WARDROBE_SIZES } from '../config/responsive';

type Props = {
  navigation: ScreenNavigationProp<'Wardrobe'>;
};

const SLOTS: { key: ClothingSlot; labelKey: string; emoji: string }[] = [
  { key: 'head', labelKey: 'wardrobe.slots.head', emoji: '🎩' },
  { key: 'eyes', labelKey: 'wardrobe.slots.eyes', emoji: '👀' },
  { key: 'torso', labelKey: 'wardrobe.slots.torso', emoji: '👕' },
  { key: 'paws', labelKey: 'wardrobe.slots.paws', emoji: '🧦' },
];

export const WardrobeScene: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { pet, setClothing } = usePet();
  const [selectedSlot, setSelectedSlot] = useState<ClothingSlot>('head');
  const BackButtonIcon = useBackButton();
  const handleBack = useGameBack(navigation);
  const { deviceType, spacing } = useResponsive();

  const petSize = PET_SIZE_SMALL[deviceType];
  const wardrobeSizes = WARDROBE_SIZES[deviceType];

  if (!pet) return null;

  const petAge = calculatePetAge(pet.createdAt);
  const petNameDisplay = `${pet.type === 'cat' ? '🐱' : '🐶'} ${pet.name}`;
  const petAgeDisplay = `${petAge} ${petAge === 1 ? t('common.year') : t('common.years')}`;

  const itemsForSlot = getItemsBySlot(selectedSlot);

  const handleSelectItem = (itemId: string | null) => {
    setClothing(selectedSlot, itemId);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title={t('wardrobe.title')}
        onBackPress={handleBack}
        BackButtonIcon={BackButtonIcon}
      />

      {/* Status Card */}
      <StatusCard pet={pet} petName={petNameDisplay} petAge={petAgeDisplay} compact />

      <View style={[styles.petContainer, { paddingVertical: spacing(12) }]}>
        <PetRenderer pet={pet} size={petSize} />
      </View>

      <View
        style={[
          styles.slotSelector,
          {
            paddingVertical: spacing(10),
            marginHorizontal: spacing(12),
            borderRadius: spacing(12),
          },
        ]}
      >
        {SLOTS.map((slot) => (
          <TouchableOpacity
            key={slot.key}
            style={[
              styles.slotButton,
              { padding: wardrobeSizes.slotPadding, borderRadius: spacing(10) },
              selectedSlot === slot.key && styles.slotButtonSelected,
            ]}
            onPress={() => setSelectedSlot(slot.key)}
          >
            <Text style={[styles.slotEmoji, { fontSize: wardrobeSizes.slotEmoji }]}>
              {slot.emoji}
            </Text>
            <Text
              style={[
                styles.slotLabel,
                { fontSize: wardrobeSizes.slotLabel, marginTop: spacing(2) },
              ]}
            >
              {t(slot.labelKey)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={[styles.itemsContainer, { marginTop: spacing(12) }]}>
        <View style={[styles.itemsGrid, { paddingHorizontal: spacing(12) }]}>
          <TouchableOpacity
            style={[
              styles.itemButton,
              {
                width: wardrobeSizes.itemWidth as any,
                padding: wardrobeSizes.itemPadding,
                borderRadius: spacing(10),
                marginBottom: spacing(10),
              },
              pet.clothes[selectedSlot] === null && styles.itemButtonSelected,
            ]}
            onPress={() => handleSelectItem(null)}
          >
            <Text
              style={[
                styles.itemEmoji,
                { fontSize: wardrobeSizes.itemEmoji, marginBottom: spacing(3) },
              ]}
            >
              ❌
            </Text>
            <Text style={[styles.itemName, { fontSize: wardrobeSizes.itemName }]}>{t('wardrobe.none')}</Text>
          </TouchableOpacity>

          {itemsForSlot.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.itemButton,
                {
                  width: wardrobeSizes.itemWidth as any,
                  padding: wardrobeSizes.itemPadding,
                  borderRadius: spacing(10),
                  marginBottom: spacing(10),
                },
                pet.clothes[selectedSlot] === item.id && styles.itemButtonSelected,
              ]}
              onPress={() => handleSelectItem(item.id)}
            >
              <View style={[styles.itemPreview, { width: spacing(40), height: spacing(40) }]}>
                <Text style={[styles.itemPlaceholder, { fontSize: wardrobeSizes.itemEmoji }]}>
                  👔
                </Text>
              </View>
              <Text style={[styles.itemName, { fontSize: wardrobeSizes.itemName }]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fce4ec',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  backButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    fontSize: 16,
    color: '#9b59b6',
    fontWeight: '600',
    marginLeft: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  petContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  slotSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 16,
  },
  slotButton: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 12,
  },
  slotButtonSelected: {
    backgroundColor: '#f8bbd9',
  },
  slotEmoji: {
    fontSize: 24,
  },
  slotLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#333',
    marginTop: 2,
  },
  itemsContainer: {
    flex: 1,
    marginTop: 16,
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
  },
  itemButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    width: '30%',
    marginRight: '3%',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  itemButtonSelected: {
    borderColor: '#e91e63',
    backgroundColor: '#fce4ec',
  },
  itemPreview: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemPlaceholder: {
    fontSize: 32,
  },
  itemEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  itemName: {
    fontSize: 10,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
});
