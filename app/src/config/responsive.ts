import { DimensionValue } from 'react-native';
import { DeviceType } from '../hooks/useResponsive';

export const BREAKPOINTS = {
  mobileSmall: 375,
  mobile: 428,
  mobileLarge: 768,
  tablet: 1024,
  tabletLarge: 1280,
};

export const GRID_COLUMNS: Record<DeviceType, number> = {
  mobile: 4,
  mobileLarge: 4,
  tablet: 4,
  desktop: 4,
};

export const PET_SIZE: Record<DeviceType, number> = {
  mobile: 260,
  mobileLarge: 300,
  tablet: 350,
  desktop: 400,
};

export const PET_SIZE_SMALL: Record<DeviceType, number> = {
  mobile: 220,
  mobileLarge: 260,
  tablet: 300,
  desktop: 350,
};

export const ICON_BUTTON_SIZE: Record<
  DeviceType,
  { width: number; padding: number; emoji: number; label: number }
> = {
  mobile: { width: 72, padding: 10, emoji: 26, label: 10 },
  mobileLarge: { width: 80, padding: 12, emoji: 28, label: 11 },
  tablet: { width: 90, padding: 14, emoji: 32, label: 12 },
  desktop: { width: 100, padding: 16, emoji: 36, label: 14 },
};

export const STATUS_BAR_SIZE: Record<
  DeviceType,
  { barHeight: number; fontSize: number; emojiSize: number }
> = {
  mobile: { barHeight: 6, fontSize: 9, emojiSize: 12 },
  mobileLarge: { barHeight: 8, fontSize: 10, emojiSize: 14 },
  tablet: { barHeight: 10, fontSize: 12, emojiSize: 16 },
  desktop: { barHeight: 12, fontSize: 14, emojiSize: 18 },
};

// Pet sizes for action screens (Feed, Play, Bath, etc.)
export const ACTION_PET_SIZE: Record<DeviceType, number> = {
  mobile: 280,
  mobileLarge: 340,
  tablet: 400,
  desktop: 450,
};

// Navigation arrows and action buttons in action screens
export const ACTION_BUTTON_SIZE: Record<
  DeviceType,
  {
    arrowSize: number;
    arrowFontSize: number;
    itemWidth: number;
    itemPadding: number;
    itemEmoji: number;
    itemFont: number;
    valueFont: number;
  }
> = {
  mobile: {
    arrowSize: 40,
    arrowFontSize: 22,
    itemWidth: 110,
    itemPadding: 14,
    itemEmoji: 36,
    itemFont: 13,
    valueFont: 12,
  },
  mobileLarge: {
    arrowSize: 50,
    arrowFontSize: 28,
    itemWidth: 140,
    itemPadding: 20,
    itemEmoji: 48,
    itemFont: 16,
    valueFont: 14,
  },
  tablet: {
    arrowSize: 55,
    arrowFontSize: 30,
    itemWidth: 160,
    itemPadding: 24,
    itemEmoji: 52,
    itemFont: 18,
    valueFont: 15,
  },
  desktop: {
    arrowSize: 60,
    arrowFontSize: 32,
    itemWidth: 180,
    itemPadding: 28,
    itemEmoji: 56,
    itemFont: 20,
    valueFont: 16,
  },
};

// Sponge size for bath scene
export const SPONGE_SIZE: Record<DeviceType, { width: number; height: number; bottom: number }> = {
  mobile: { width: 100, height: 75, bottom: 150 },
  mobileLarge: { width: 150, height: 112, bottom: 200 },
  tablet: { width: 180, height: 135, bottom: 240 },
  desktop: { width: 200, height: 150, bottom: 280 },
};

// Slot selector in wardrobe scene
export const WARDROBE_SIZES: Record<
  DeviceType,
  {
    slotEmoji: number;
    slotLabel: number;
    slotPadding: number;
    itemWidth: DimensionValue;
    itemPadding: number;
    itemEmoji: number;
    itemName: number;
  }
> = {
  mobile: {
    slotEmoji: 20,
    slotLabel: 9,
    slotPadding: 6,
    itemWidth: '30%',
    itemPadding: 10,
    itemEmoji: 28,
    itemName: 9,
  },
  mobileLarge: {
    slotEmoji: 24,
    slotLabel: 10,
    slotPadding: 8,
    itemWidth: '30%',
    itemPadding: 12,
    itemEmoji: 32,
    itemName: 10,
  },
  tablet: {
    slotEmoji: 28,
    slotLabel: 12,
    slotPadding: 10,
    itemWidth: '23%',
    itemPadding: 14,
    itemEmoji: 36,
    itemName: 11,
  },
  desktop: {
    slotEmoji: 32,
    slotLabel: 14,
    slotPadding: 12,
    itemWidth: '18%',
    itemPadding: 16,
    itemEmoji: 40,
    itemName: 12,
  },
};

// Sleep and Vet scene specific sizes
export const SCENE_TEXT_SIZE: Record<
  DeviceType,
  {
    titleSize: number;
    messageSize: number;
    buttonText: number;
    progressText: number;
    sidebarTitle: number;
    sidebarText: number;
  }
> = {
  mobile: {
    titleSize: 18,
    messageSize: 14,
    buttonText: 14,
    progressText: 16,
    sidebarTitle: 12,
    sidebarText: 10,
  },
  mobileLarge: {
    titleSize: 24,
    messageSize: 18,
    buttonText: 18,
    progressText: 20,
    sidebarTitle: 14,
    sidebarText: 12,
  },
  tablet: {
    titleSize: 28,
    messageSize: 20,
    buttonText: 20,
    progressText: 22,
    sidebarTitle: 15,
    sidebarText: 13,
  },
  desktop: {
    titleSize: 32,
    messageSize: 22,
    buttonText: 22,
    progressText: 24,
    sidebarTitle: 16,
    sidebarText: 14,
  },
};
