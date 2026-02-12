/**
 * Color Mixer Lab - Level Definitions
 *
 * Defines all 20 levels with increasing difficulty.
 * Each level has a target color and available paint colors to mix.
 */

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface PaintColor {
  name: string;
  color: RGB;
}

export interface Level {
  id: number;
  targetColor: RGB;
  availableColors: PaintColor[];
  hint: string;
}

/**
 * Calculate the Euclidean distance between two RGB colors
 * Returns a value from 0 (identical) to ~442 (max difference)
 */
export function calculateColorDistance(color1: RGB, color2: RGB): number {
  const rDiff = color1.r - color2.r;
  const gDiff = color1.g - color2.g;
  const bDiff = color1.b - color2.b;
  return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
}

/**
 * Determine star rating based on color distance
 * 3 stars: distance < 30 (nearly perfect)
 * 2 stars: distance < 60 (close)
 * 1 star: distance < 90 (somewhat close)
 * 0 stars: distance >= 90 (try again)
 */
export function getStarsForAccuracy(distance: number): number {
  if (distance < 30) return 3;
  if (distance < 60) return 2;
  if (distance < 90) return 1;
  return 0;
}

/**
 * Calculate accuracy percentage (0-100%)
 */
export function getAccuracyPercentage(distance: number): number {
  const maxDistance = 442; // sqrt(255^2 + 255^2 + 255^2)
  const accuracy = Math.max(0, 100 - (distance / maxDistance) * 100);
  return Math.round(accuracy);
}

/**
 * Mix multiple colors by averaging their RGB values
 */
export function mixColors(colors: RGB[]): RGB {
  if (colors.length === 0) {
    return { r: 255, g: 255, b: 255 }; // White (empty bowl)
  }

  const sum = colors.reduce(
    (acc, color) => ({
      r: acc.r + color.r,
      g: acc.g + color.g,
      b: acc.b + color.b,
    }),
    { r: 0, g: 0, b: 0 }
  );

  return {
    r: Math.round(sum.r / colors.length),
    g: Math.round(sum.g / colors.length),
    b: Math.round(sum.b / colors.length),
  };
}

/**
 * Convert RGB object to CSS color string
 */
export function rgbToString(color: RGB): string {
  return `rgb(${color.r}, ${color.g}, ${color.b})`;
}

// Base paint colors used across levels
const RED: RGB = { r: 255, g: 0, b: 0 };
const BLUE: RGB = { r: 0, g: 0, b: 255 };
const YELLOW: RGB = { r: 255, g: 255, b: 0 };
const WHITE: RGB = { r: 255, g: 255, b: 255 };
const GREEN: RGB = { r: 0, g: 255, b: 0 };
const BLACK: RGB = { r: 0, g: 0, b: 0 };

/**
 * All 20 levels with progressive difficulty
 */
export const LEVELS: Level[] = [
  // LEVELS 1-5: Simple two-color mixes (primary → secondary)
  {
    id: 1,
    targetColor: { r: 255, g: 128, b: 0 }, // Orange
    availableColors: [
      { name: 'Red', color: RED },
      { name: 'Yellow', color: YELLOW },
    ],
    hint: 'Mix Red + Yellow',
  },
  {
    id: 2,
    targetColor: { r: 128, g: 0, b: 128 }, // Purple
    availableColors: [
      { name: 'Red', color: RED },
      { name: 'Blue', color: BLUE },
    ],
    hint: 'Mix Red + Blue',
  },
  {
    id: 3,
    targetColor: { r: 128, g: 255, b: 0 }, // Lime Green
    availableColors: [
      { name: 'Yellow', color: YELLOW },
      { name: 'Green', color: GREEN },
    ],
    hint: 'Mix Yellow + Green',
  },
  {
    id: 4,
    targetColor: { r: 0, g: 128, b: 128 }, // Teal
    availableColors: [
      { name: 'Blue', color: BLUE },
      { name: 'Green', color: GREEN },
    ],
    hint: 'Mix Blue + Green',
  },
  {
    id: 5,
    targetColor: { r: 128, g: 128, b: 255 }, // Light Blue
    availableColors: [
      { name: 'Blue', color: BLUE },
      { name: 'White', color: WHITE },
    ],
    hint: 'Mix Blue + White',
  },

  // LEVELS 6-10: Add white for tints (lighter colors)
  {
    id: 6,
    targetColor: { r: 255, g: 128, b: 128 }, // Pink
    availableColors: [
      { name: 'Red', color: RED },
      { name: 'White', color: WHITE },
    ],
    hint: 'Mix Red + White',
  },
  {
    id: 7,
    targetColor: { r: 255, g: 192, b: 128 }, // Peach
    availableColors: [
      { name: 'Red', color: RED },
      { name: 'Yellow', color: YELLOW },
      { name: 'White', color: WHITE },
    ],
    hint: 'Mix Red + Yellow + White',
  },
  {
    id: 8,
    targetColor: { r: 192, g: 128, b: 255 }, // Lavender
    availableColors: [
      { name: 'Red', color: RED },
      { name: 'Blue', color: BLUE },
      { name: 'White', color: WHITE },
    ],
    hint: 'Mix Red + Blue + White',
  },
  {
    id: 9,
    targetColor: { r: 255, g: 255, b: 128 }, // Light Yellow
    availableColors: [
      { name: 'Yellow', color: YELLOW },
      { name: 'White', color: WHITE },
    ],
    hint: 'Mix Yellow + White',
  },
  {
    id: 10,
    targetColor: { r: 128, g: 255, b: 192 }, // Mint
    availableColors: [
      { name: 'Green', color: GREEN },
      { name: 'Blue', color: BLUE },
      { name: 'White', color: WHITE },
    ],
    hint: 'Mix Green + Blue + White',
  },

  // LEVELS 11-15: Three-color mixes (tertiary colors)
  {
    id: 11,
    targetColor: { r: 170, g: 85, b: 0 }, // Brown
    availableColors: [
      { name: 'Red', color: RED },
      { name: 'Yellow', color: YELLOW },
      { name: 'Blue', color: BLUE },
    ],
    hint: 'Mix Red + Yellow + Blue',
  },
  {
    id: 12,
    targetColor: { r: 255, g: 85, b: 85 }, // Coral
    availableColors: [
      { name: 'Red', color: RED },
      { name: 'Yellow', color: YELLOW },
      { name: 'White', color: WHITE },
    ],
    hint: 'More Red, less Yellow',
  },
  {
    id: 13,
    targetColor: { r: 85, g: 170, b: 127 }, // Sea Green
    availableColors: [
      { name: 'Blue', color: BLUE },
      { name: 'Green', color: GREEN },
      { name: 'White', color: WHITE },
    ],
    hint: 'Mix carefully!',
  },
  {
    id: 14,
    targetColor: { r: 170, g: 85, b: 255 }, // Violet
    availableColors: [
      { name: 'Red', color: RED },
      { name: 'Blue', color: BLUE },
      { name: 'White', color: WHITE },
    ],
    hint: 'More Blue than Red',
  },
  {
    id: 15,
    targetColor: { r: 255, g: 170, b: 0 }, // Gold
    availableColors: [
      { name: 'Red', color: RED },
      { name: 'Yellow', color: YELLOW },
      { name: 'White', color: WHITE },
    ],
    hint: 'Bright and warm!',
  },

  // LEVELS 16-20: Complex tints/shades with precise ratios
  {
    id: 16,
    targetColor: { r: 210, g: 180, b: 140 }, // Tan
    availableColors: [
      { name: 'Red', color: RED },
      { name: 'Yellow', color: YELLOW },
      { name: 'White', color: WHITE },
      { name: 'Blue', color: BLUE },
    ],
    hint: 'Earthy tone',
  },
  {
    id: 17,
    targetColor: { r: 128, g: 64, b: 64 }, // Maroon
    availableColors: [
      { name: 'Red', color: RED },
      { name: 'Blue', color: BLUE },
      { name: 'Black', color: BLACK },
    ],
    hint: 'Dark red',
  },
  {
    id: 18,
    targetColor: { r: 64, g: 128, b: 128 }, // Dark Teal
    availableColors: [
      { name: 'Blue', color: BLUE },
      { name: 'Green', color: GREEN },
      { name: 'Black', color: BLACK },
    ],
    hint: 'Ocean depths',
  },
  {
    id: 19,
    targetColor: { r: 255, g: 215, b: 180 }, // Cream
    availableColors: [
      { name: 'Red', color: RED },
      { name: 'Yellow', color: YELLOW },
      { name: 'White', color: WHITE },
    ],
    hint: 'Very light and warm',
  },
  {
    id: 20,
    targetColor: { r: 186, g: 85, b: 211 }, // Magenta
    availableColors: [
      { name: 'Red', color: RED },
      { name: 'Blue', color: BLUE },
      { name: 'White', color: WHITE },
    ],
    hint: 'Vibrant purple!',
  },
];

export const TOTAL_LEVELS = LEVELS.length;
