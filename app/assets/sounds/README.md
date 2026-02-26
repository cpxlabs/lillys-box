# Sounds Directory

This directory contains all audio assets for the Pet Care Game.

## Directory Structure

```
sounds/
├── ui/                    # UI sound effects
│   ├── button_click.mp3   # Button tap sound
│   ├── coin_collect.mp3   # Coin/point collection
│   ├── notification.mp3  # Notification alert
│   ├── success.mp3       # Success feedback
│   └── error.mp3         # Error feedback
│
├── pet/                   # Pet sounds
│   ├── happy.mp3          # Pet is happy
│   ├── sad.mp3           # Pet is sad
│   ├── meow.mp3          # Cat meow
│   └── bark.mp3          # Dog bark
│
├── activities/            # Activity-specific sounds
│   ├── eating.mp3         # Eating/chewing
│   ├── water_splash.mp3  # Bath time water
│   ├── ball_bounce.mp3   # Ball bounce
│   ├── toy_squeak.mp3    # Toy squeak
│   └── clothes_swap.mp3  # Clothing change
│
└── music/
    └── background.mp3     # Background music (looping)
```

## Requirements

- Format: MP3 or WAV
- Sample rate: 44.1kHz
- Bit rate: 128-192kbps for effects, 256kbps for music
- Duration: 
  - UI sounds: < 1 second
  - Pet sounds: 1-3 seconds
  - Music: 30-60 seconds (will loop)

## Adding New Sounds

1. Add the audio file to the appropriate subdirectory
2. Update `SoundType` in `AudioService.ts` to include the new sound
3. Add the sound to the `SOUND_MAP` object
4. Update this README with the new file

## Usage

```typescript
import { audioService } from '../services/AudioService';

// Play a sound effect
await audioService.playSound('button_click');

// Control background music
await audioService.playBackgroundMusic();
await audioService.pauseBackgroundMusic();
await audioService.stopBackgroundMusic();

// Settings
await audioService.setSoundEnabled(true);
await audioService.setMusicEnabled(true);
await audioService.setVolume(0.5);
```

Or use the hook:

```typescript
import { useAudio } from '../hooks/useAudio';

const MyComponent = () => {
  const { playSound, playBackgroundMusic } = useAudio();
  
  return (
    <Button onPress={() => playSound('button_click')}>
      Press me
    </Button>
  );
};
```
