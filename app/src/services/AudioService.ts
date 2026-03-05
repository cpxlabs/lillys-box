/**
 * AudioService - Centralized audio management for Lilly's Box
 * 
 * Handles sound effects, background music, and audio settings persistence.
 * Uses expo-av for audio playback with platform-aware behavior (web skipped).
 * 
 * @example
 * // Play a sound effect
 * await audioService.playSound('coin_collect');
 * 
 * // Control background music
 * await audioService.playBackgroundMusic();
 * await audioService.pauseBackgroundMusic();
 * 
 * // Adjust volume
 * await audioService.setVolume(0.5);
 * 
 * // Toggle sound/music
 * await audioService.setSoundEnabled(false);
 * await audioService.setMusicEnabled(false);
 */

import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, AppState, AppStateStatus } from 'react-native';
import { logger } from '../utils/logger';

/** Key for storing sound enabled state in AsyncStorage */
const SOUND_ENABLED_KEY = 'sound_enabled';
/** Key for storing music enabled state in AsyncStorage */
const MUSIC_ENABLED_KEY = 'music_enabled';
/** Key for storing volume level in AsyncStorage */
const VOLUME_KEY = 'volume_level';
/** Key for storing respect silent mode preference in AsyncStorage */
const RESPECT_SILENT_MODE_KEY = 'respect_silent_mode';

/**
 * Available sound effect types
 * @typedef {'button_click' | 'coin_collect' | 'notification' | 'pet_happy' | 'pet_sad' | 'pet_meow' | 'pet_bark' | 'eating' | 'water_splash' | 'ball_bounce' | 'toy_squeak' | 'clothes_swap' | 'success' | 'error'} SoundType
 */
export type SoundType =
  | 'button_click'
  | 'coin_collect'
  | 'notification'
  | 'pet_happy'
  | 'pet_sad'
  | 'pet_meow'
  | 'pet_bark'
  | 'eating'
  | 'water_splash'
  | 'ball_bounce'
  | 'toy_squeak'
  | 'clothes_swap'
  | 'success'
  | 'error';

/** Check if running on web platform */
const isWeb = Platform.OS === 'web';

/** Map of sound types to audio file assets */
// NOTE: the current files under `assets/sounds` are placeholder WAVs used during
// development. When v1.3 is prepared, these should be swapped out with the
// final mastered audio assets. The keys here must match the file basenames.
// A helper script (`scripts/check-sounds.js`) and the accompanying unit test
// verify consistency between SOUND_MAP and the directory contents.
export const SOUND_MAP: Record<SoundType, ReturnType<typeof require>> = isWeb 
  ? {} as Record<SoundType, ReturnType<typeof require>> 
  : {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  button_click: require('../../assets/sounds/ui/button_click.wav'),
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  coin_collect: require('../../assets/sounds/ui/coin_collect.wav'),
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  notification: require('../../assets/sounds/ui/notification.wav'),
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  pet_happy: require('../../assets/sounds/pet/happy.wav'),
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  pet_sad: require('../../assets/sounds/pet/sad.wav'),
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  pet_meow: require('../../assets/sounds/pet/meow.wav'),
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  pet_bark: require('../../assets/sounds/pet/bark.wav'),
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  eating: require('../../assets/sounds/activities/eating.wav'),
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  water_splash: require('../../assets/sounds/activities/water_splash.wav'),
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  ball_bounce: require('../../assets/sounds/activities/ball_bounce.wav'),
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  toy_squeak: require('../../assets/sounds/activities/toy_squeak.wav'),
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  clothes_swap: require('../../assets/sounds/activities/clothes_swap.wav'),
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  success: require('../../assets/sounds/ui/success.wav'),
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  error: require('../../assets/sounds/ui/error.wav'),
};

// eslint-disable-next-line @typescript-eslint/no-require-imports
const BACKGROUND_MUSIC = isWeb ? null : require('../../assets/sounds/music/background.wav');

/**
 * Audio service for managing sound effects and background music
 * @remarks Uses expo-av for audio playback with web platform detection
 */
class AudioService {
  private sounds: Map<SoundType, Audio.Sound> = new Map();
  private backgroundMusic: Audio.Sound | null = null;
  private soundEnabled: boolean = true;
  private musicEnabled: boolean = true;
  private volume: number = 1.0;
  private respectSilentMode: boolean = true;
  private isInitialized: boolean = false;
  private wasPlayingBeforeBackground: boolean = false;
  private appStateSubscription: { remove: () => void } | null = null;

  /**
   * Initialize the audio service
   * @remarks Sets up audio mode, loads saved settings, and listens for AppState changes
   * to pause/resume background music when the app goes to background/foreground.
   * @returns Promise that resolves when initialization is complete
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      await this.loadSettings();
      await this.applyAudioMode();
      this.setupAppStateListener();
      this.isInitialized = true;
    } catch (error) {
      logger.warn('Failed to initialize audio:', error);
    }
  }

  private async applyAudioMode(): Promise<void> {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: !this.respectSilentMode,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    });
  }

  private setupAppStateListener(): void {
    if (isWeb || this.appStateSubscription) return;

    this.appStateSubscription = AppState.addEventListener(
      'change',
      this.handleAppStateChange,
    );
  }

  private handleAppStateChange = async (nextState: AppStateStatus): Promise<void> => {
    if (nextState === 'active') {
      if (this.wasPlayingBeforeBackground && this.musicEnabled) {
        await this.resumeBackgroundMusic();
      }
    } else if (nextState === 'background' || nextState === 'inactive') {
      if (this.backgroundMusic) {
        const status = await this.backgroundMusic.getStatusAsync();
        this.wasPlayingBeforeBackground = status.isLoaded && status.isPlaying;
        if (this.wasPlayingBeforeBackground) {
          await this.pauseBackgroundMusic();
        }
      }
    }
  };

  private async loadSettings(): Promise<void> {
    try {
      const soundEnabled = await AsyncStorage.getItem(SOUND_ENABLED_KEY);
      const musicEnabled = await AsyncStorage.getItem(MUSIC_ENABLED_KEY);
      const volume = await AsyncStorage.getItem(VOLUME_KEY);
      const respectSilentMode = await AsyncStorage.getItem(RESPECT_SILENT_MODE_KEY);

      this.soundEnabled = soundEnabled !== 'false';
      this.musicEnabled = musicEnabled !== 'false';
      this.volume = volume ? parseFloat(volume) : 1.0;
      this.respectSilentMode = respectSilentMode !== 'false';
    } catch (error) {
      logger.warn('Failed to load audio settings:', error);
    }
  }

  /**
   * Enable or disable sound effects
   * @param enabled - Whether sound effects should be enabled
   */
  async setSoundEnabled(enabled: boolean): Promise<void> {
    this.soundEnabled = enabled;
    await AsyncStorage.setItem(SOUND_ENABLED_KEY, String(enabled));
  }

  async setMusicEnabled(enabled: boolean): Promise<void> {
    this.musicEnabled = enabled;
    if (!enabled) {
      await this.stopBackgroundMusic();
    }
    await AsyncStorage.setItem(MUSIC_ENABLED_KEY, String(enabled));
  }

  async setVolume(volume: number): Promise<void> {
    this.volume = Math.max(0, Math.min(1, volume));
    await AsyncStorage.setItem(VOLUME_KEY, String(this.volume));

    if (this.backgroundMusic) {
      await this.backgroundMusic.setVolumeAsync(this.volume);
    }
  }

  getSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  getMusicEnabled(): boolean {
    return this.musicEnabled;
  }

  getVolume(): number {
    return this.volume;
  }

  /**
   * Enable or disable respecting the device's silent/ringer mode.
   * When true (default), audio is muted when the device is in silent mode.
   * When false, audio plays even in silent mode.
   */
  async setRespectSilentMode(respect: boolean): Promise<void> {
    this.respectSilentMode = respect;
    await AsyncStorage.setItem(RESPECT_SILENT_MODE_KEY, String(respect));
    if (this.isInitialized) {
      await this.applyAudioMode();
    }
  }

  getRespectSilentMode(): boolean {
    return this.respectSilentMode;
  }

  async playSound(soundType: SoundType): Promise<void> {
    if (isWeb || !this.soundEnabled || !this.isInitialized) return;

    try {
      let sound = this.sounds.get(soundType);

      if (!sound) {
        const soundSource = SOUND_MAP[soundType];
        if (!soundSource) {
          logger.warn(`Sound type "${soundType}" not found`);
          return;
        }

        const { sound: newSound } = await Audio.Sound.createAsync(soundSource, {
          volume: this.volume,
          shouldPlay: true,
        });
        sound = newSound;
        this.sounds.set(soundType, sound);
      } else {
        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
          await sound.setPositionAsync(0);
          await sound.playAsync();
        }
      }
    } catch (error) {
      logger.warn(`Failed to play sound "${soundType}":`, error);
    }
  }

  async playBackgroundMusic(): Promise<void> {
    if (isWeb || !this.musicEnabled || !this.isInitialized || !BACKGROUND_MUSIC) return;

    try {
      if (!this.backgroundMusic) {
        const { sound } = await Audio.Sound.createAsync(BACKGROUND_MUSIC, {
          volume: this.volume,
          isLooping: true,
          shouldPlay: true,
        });
        this.backgroundMusic = sound;
      } else {
        const status = await this.backgroundMusic.getStatusAsync();
        if (status.isLoaded && !status.isPlaying) {
          await this.backgroundMusic.playAsync();
        }
      }
    } catch (error) {
      logger.warn('Failed to play background music:', error);
    }
  }

  async stopBackgroundMusic(): Promise<void> {
    try {
      if (this.backgroundMusic) {
        const status = await this.backgroundMusic.getStatusAsync();
        if (status.isLoaded && status.isPlaying) {
          await this.backgroundMusic.stopAsync();
        }
      }
    } catch (error) {
      logger.warn('Failed to stop background music:', error);
    }
  }

  async pauseBackgroundMusic(): Promise<void> {
    try {
      if (this.backgroundMusic) {
        const status = await this.backgroundMusic.getStatusAsync();
        if (status.isLoaded && status.isPlaying) {
          await this.backgroundMusic.pauseAsync();
        }
      }
    } catch (error) {
      logger.warn('Failed to pause background music:', error);
    }
  }

  async resumeBackgroundMusic(): Promise<void> {
    if (isWeb || !this.musicEnabled || !BACKGROUND_MUSIC) return;

    try {
      if (this.backgroundMusic) {
        const status = await this.backgroundMusic.getStatusAsync();
        if (status.isLoaded && !status.isPlaying) {
          await this.backgroundMusic.playAsync();
        }
      } else {
        await this.playBackgroundMusic();
      }
    } catch (error) {
      logger.warn('Failed to resume background music:', error);
    }
  }

  async preloadSounds(): Promise<void> {
    if (isWeb || !this.soundEnabled || Object.keys(SOUND_MAP).length === 0) return;

    const soundTypes = Object.keys(SOUND_MAP) as SoundType[];

    await Promise.all(
      soundTypes.map(async (soundType) => {
        try {
          const soundSource = SOUND_MAP[soundType];
          const { sound } = await Audio.Sound.createAsync(soundSource, {
            volume: this.volume,
          });
          this.sounds.set(soundType, sound);
        } catch (error) {
          logger.warn(`Failed to preload sound "${soundType}":`, error);
        }
      })
    );
  }

  async cleanup(): Promise<void> {
    try {
      if (this.appStateSubscription) {
        this.appStateSubscription.remove();
        this.appStateSubscription = null;
      }

      for (const sound of this.sounds.values()) {
        await sound.unloadAsync();
      }
      this.sounds.clear();

      if (this.backgroundMusic) {
        await this.backgroundMusic.stopAsync();
        await this.backgroundMusic.unloadAsync();
        this.backgroundMusic = null;
      }
    } catch (error) {
      logger.warn('Failed to cleanup audio:', error);
    }
  }
}

export const audioService = new AudioService();
