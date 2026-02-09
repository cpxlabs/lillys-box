import { Platform } from 'react-native';

/**
 * Web-safe emoji font family stack.
 * Ensures consistent emoji rendering across browsers.
 */
export const EMOJI_FONT_FAMILY =
  '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", "Android Emoji", "Twemoji Mozilla", sans-serif';

export const isWeb = Platform.OS === 'web';

/**
 * Text-based fallback map for emojis that may not render on some web platforms.
 * Used when the browser doesn't support color emoji fonts.
 */
const EMOJI_FALLBACKS: Record<string, string> = {
  // Game selection
  '\u{1F43E}': 'PAW',   // 🐾
  '\u{1F522}': '123',   // 🔢
  '\u{1F3A8}': 'ART',   // 🎨
  '\u{1F9E0}': 'MEM',   // 🧠
  '\u{1F3C3}': 'RUN',   // 🏃

  // Action buttons
  '\u{1F356}': 'FEED',  // 🍖
  '\u{1F6C1}': 'BATH',  // 🛁
  '\u{1F4A4}': 'ZZZ',   // 💤
  '\u{1F3E5}': 'VET',   // 🏥
  '\u{1F6A8}': 'SOS',   // 🚨
  '\u{1F455}': 'WEAR',  // 👕
  '\u{1F3AE}': 'PLAY',  // 🎮
  '\u{1F3E0}': 'HOME',  // 🏠

  // Status indicators
  '\u{26A1}': 'ZAP',    // ⚡
  '\u{2764}\u{FE0F}': '<3', // ❤️
  '\u{1F60A}': ':)',     // 😊
  '\u{1F610}': ':|',    // 😐
  '\u{1F622}': ':(',    // 😢
  '\u{1F4B0}': '$',     // 💰

  // Food items
  '\u{1F41F}': 'FISH',  // 🐟
  '\u{1F9B4}': 'BONE',  // 🦴
  '\u{1F95B}': 'MILK',  // 🥛

  // Play activities
  '\u{1F9F6}': 'YARN',  // 🧶
  '\u{26BD}': 'BALL',   // ⚽

  // Wardrobe slots
  '\u{1F3A9}': 'HAT',   // 🎩
  '\u{1F440}': 'EYES',  // 👀
  '\u{1F9E6}': 'SOCK',  // 🧦

  // Pet types
  '\u{1F431}': 'CAT',   // 🐱
  '\u{1F436}': 'DOG',   // 🐶

  // Game objects
  '\u{1FAAB}': 'LOG',   // 🪵
  '\u{1FAA8}': 'ROCK',  // 🪨
  '\u{1F9F1}': 'WALL',  // 🧱
  '\u{1FA99}': 'COIN',  // 🪙

  // Error state
  '\u{1F63F}': ':(',    // 😿

  // Gender / color
  '\u{2642}\u{FE0F}': 'M',  // ♂️
  '\u{2640}\u{FE0F}': 'F',  // ♀️
  '\u{26AA}': 'WHT',    // ⚪
  '\u{26AB}': 'BLK',    // ⚫
  '\u{1F7E4}': 'BRN',   // 🟤
};

/**
 * Get a text fallback for an emoji character.
 * Returns the original emoji if no fallback is defined.
 */
export function getEmojiFallback(emoji: string): string {
  return EMOJI_FALLBACKS[emoji] ?? emoji;
}
