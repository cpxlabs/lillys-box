import { useEffect, useCallback } from 'react';
import { audioService, SoundType } from '../services/AudioService';

export const useAudio = () => {
  useEffect(() => {
    audioService.initialize();
    audioService.preloadSounds();

    return () => {
      audioService.cleanup();
    };
  }, []);

  const playSound = useCallback(async (soundType: SoundType) => {
    await audioService.playSound(soundType);
  }, []);

  const playBackgroundMusic = useCallback(async () => {
    await audioService.playBackgroundMusic();
  }, []);

  const stopBackgroundMusic = useCallback(async () => {
    await audioService.stopBackgroundMusic();
  }, []);

  const pauseBackgroundMusic = useCallback(async () => {
    await audioService.pauseBackgroundMusic();
  }, []);

  const resumeBackgroundMusic = useCallback(async () => {
    await audioService.resumeBackgroundMusic();
  }, []);

  const setSoundEnabled = useCallback(async (enabled: boolean) => {
    await audioService.setSoundEnabled(enabled);
  }, []);

  const setMusicEnabled = useCallback(async (enabled: boolean) => {
    await audioService.setMusicEnabled(enabled);
  }, []);

  const setVolume = useCallback(async (volume: number) => {
    await audioService.setVolume(volume);
  }, []);

  const setRespectSilentMode = useCallback(async (respect: boolean) => {
    await audioService.setRespectSilentMode(respect);
  }, []);

  return {
    playSound,
    playBackgroundMusic,
    stopBackgroundMusic,
    pauseBackgroundMusic,
    resumeBackgroundMusic,
    setSoundEnabled,
    setMusicEnabled,
    setVolume,
    setRespectSilentMode,
    soundEnabled: audioService.getSoundEnabled(),
    musicEnabled: audioService.getMusicEnabled(),
    volume: audioService.getVolume(),
    respectSilentMode: audioService.getRespectSilentMode(),
  };
};
