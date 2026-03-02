import { ClothingItem, ClothingSlot } from '../types';
import { ImageSourcePropType } from 'react-native';

type ClothingItemWithAsset = ClothingItem & {
  asset: ImageSourcePropType | null;
  emoji: string;
};

// Substitua `asset: null` por require real quando adicionar os PNGs.
export const CLOTHING_ITEMS: ClothingItemWithAsset[] = [
  // Head
  { id: 'hat_red', slot: 'head', assetKey: 'hat_red', name: 'Chapéu Vermelho', asset: null, emoji: '🎩' },
  { id: 'hat_blue', slot: 'head', assetKey: 'hat_blue', name: 'Chapéu Azul', asset: null, emoji: '🪖' },
  { id: 'crown', slot: 'head', assetKey: 'crown', name: 'Coroa', asset: null, emoji: '👑' },

  // Eyes
  { id: 'eyes_big', slot: 'eyes', assetKey: 'eyes_big', name: 'Olhos Grandes', asset: null, emoji: '👁️' },
  { id: 'eyes_star', slot: 'eyes', assetKey: 'eyes_star', name: 'Olhos Estrela', asset: null, emoji: '⭐' },
  { id: 'glasses', slot: 'eyes', assetKey: 'glasses', name: 'Óculos', asset: null, emoji: '👓' },

  // Torso
  { id: 'shirt_blue', slot: 'torso', assetKey: 'shirt_blue', name: 'Camiseta Azul', asset: null, emoji: '👕' },
  { id: 'shirt_red', slot: 'torso', assetKey: 'shirt_red', name: 'Camiseta Vermelha', asset: null, emoji: '👘' },
  { id: 'dress_pink', slot: 'torso', assetKey: 'dress_pink', name: 'Vestido Rosa', asset: null, emoji: '👗' },

  // Paws
  { id: 'paws_boots', slot: 'paws', assetKey: 'paws_boots', name: 'Botas', asset: null, emoji: '👢' },
  { id: 'paws_socks', slot: 'paws', assetKey: 'paws_socks', name: 'Meias', asset: null, emoji: '🧦' },
];

export const getItemsBySlot = (slot: ClothingSlot): ClothingItemWithAsset[] => {
  return CLOTHING_ITEMS.filter((item) => item.slot === slot);
};
