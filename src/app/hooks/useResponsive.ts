import { useWindowDimensions, PixelRatio } from 'react-native';

export type DeviceType = 'mobile' | 'mobileLarge' | 'tablet' | 'desktop';

export interface ResponsiveConfig {
  width: number;
  height: number;
  deviceType: DeviceType;
  isPortrait: boolean;
  isLandscape: boolean;
  scale: number;
  fontScale: number;
  wp: (percentage: number) => number;
  hp: (percentage: number) => number;
  fs: (size: number) => number;
  spacing: (size: number) => number;
}

// Reference dimensions (iPhone 12 Pro)
const BASE_WIDTH = 390;

export const useResponsive = (): ResponsiveConfig => {
  const { width, height } = useWindowDimensions();

  const getDeviceType = (): DeviceType => {
    if (width >= 1280) return 'desktop';
    if (width >= 768) return 'tablet';
    if (width >= 428) return 'mobileLarge';
    return 'mobile';
  };

  const scale = width / BASE_WIDTH;
  // Cap font scaling to prevent text from getting too large on tablets/desktop
  const fontScale = Math.min(Math.max(scale, 0.85), 1.3);

  return {
    width,
    height,
    deviceType: getDeviceType(),
    isPortrait: height > width,
    isLandscape: width > height,
    scale,
    fontScale,
    // Width percentage
    wp: (percentage: number) => Math.round((width * percentage) / 100),
    // Height percentage
    hp: (percentage: number) => Math.round((height * percentage) / 100),
    // Font size scaling
    fs: (size: number) => Math.round(PixelRatio.roundToNearestPixel(size * fontScale)),
    // Spacing scaling (less aggressive)
    spacing: (size: number) => Math.round(size * Math.min(scale, 1.15)),
  };
};
