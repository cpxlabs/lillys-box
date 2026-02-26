import { Audio, AVPlaybackStatus, AVPlaybackStatusSuccess } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SOUND_ENABLED_KEY = 'sound_enabled';
const MUSIC_ENABLED_KEY = 'music_enabled';
const VOLUME_KEY = 'volume_level';

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

const SOUND_MAP: Record<SoundType, any> = {
  button_click: require('../../assets/sounds/ui/button_click.mp3'),
  coin_collect: require('../../assets/sounds/ui/coin_collect.mp3'),
  notification: require('../../assets/sounds/ui/notification.mp3'),
  pet_happy: require('../../assets/sounds/pet/happy.mp3'),
  pet_sad: require('../../assets/sounds/pet/sad.mp3'),
  pet_meow: require('../../assets/sounds/pet/meow.mp3'),
  pet_bark: require('../../assets/sounds/pet/bark.mp3'),
  eating: require('../../assets/sounds/activities/eating.mp3'),
  water_splash: require('../../assets/sounds/activities/water_splash.mp3'),
  ball_bounce: require('../../assets/sounds/activities/ball_bounce.mp3'),
  toy_squeak: require('../../assets/sounds/activities/toy_squeak.mp3'),
  clothes_swap: require('../../assets/sounds/activities/clothes_swap.mp3'),
  success: require('../../assets/sounds/ui/success.mp3'),
  error: require('../../assets/sounds/ui/error.mp3'),
};

const BACKGROUND_MUSIC = require('../../assets/sounds/music/background.mp3');

class AudioService {
  private sounds: Map<SoundType, Audio.Sound> = new Map();
  private backgroundMusic: Audio.Sound | null = null;
  private soundEnabled: boolean = true;
  private musicEnabled: boolean = true;
  private volume: number = 1.0;
  private isInitialized: boolean = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });

      await this.loadSettings();
      this.isInitialized = true;
    } catch (error) {
      console.warn('Failed to initialize audio:', error);
    }
  }

  private async loadSettings(): Promise<void> {
    try {
      const soundEnabled = await AsyncStorage.getItem(SOUND_ENABLED_KEY);
      const musicEnabled = await AsyncStorage.getItem(MUSIC_ENABLED_KEY);
      const volume = await AsyncStorage.getItem(VOLUME_KEY);

      this.soundEnabled = soundEnabled !== 'false';
      this.musicEnabled = musicEnabled !== 'false';
      this.volume = volume ? parseFloat(volume) : 1.0;
    } catch (error) {
      console.warn('Failed to load audio settings:', error);
    }
  }

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

  async playSound(soundType: SoundType): Promise<void> {
    if (!this.soundEnabled || !this.isInitialized) return;

    try {
      let sound = this.sounds.get(soundType);

      if (!sound) {
        const soundSource = SOUND_MAP[soundType];
        if (!soundSource) {
          console.warn(`Sound type "${soundType}" not found`);
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
      console.warn(`Failed to play sound "${soundType}":`, error);
    }
  }

  async playBackgroundMusic(): Promise<void> {
    if (!this.musicEnabled || !this.isInitialized) return;

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
      console.warn('Failed to play background music:', error);
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
      console.warn('Failed to stop background music:', error);
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
      console.warn('Failed to pause background music:', error);
    }
  }

  async resumeBackgroundMusic(): Promise<void> {
    if (!this.musicEnabled) return;

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
      console.warn('Failed to resume background music:', error);
    }
  }

  async preloadSounds(): Promise<void> {
    if (!this.soundEnabled) return;

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
          console.warn(`Failed to preload sound "${soundType}":`, error);
        }
      })
    );
  }

  async cleanup(): Promise<void> {
    try {
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
      console.warn('Failed to cleanup audio:', error);
    }
  }
}

export const audioService = new AudioService();
