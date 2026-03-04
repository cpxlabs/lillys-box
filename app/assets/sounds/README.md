# Sounds Directory

This directory contains all audio assets for Lilly's Box.

## Directory Structure

```
sounds/
├── ui/                    # UI sound effects
│   ├── button_click.wav   # Button tap sound
│   ├── coin_collect.wav   # Coin/point collection
│   ├── notification.wav  # Notification alert
│   ├── success.wav       # Success feedback
│   └── error.wav         # Error feedback
│
├── pet/                   # Pet sounds
│   ├── happy.wav          # Pet is happy
│   ├── sad.wav           # Pet is sad
│   ├── meow.wav          # Cat meow
│   └── bark.wav          # Dog bark
│
├── activities/            # Activity-specific sounds
│   ├── eating.wav         # Eating/chewing
│   ├── water_splash.wav  # Bath time water
│   ├── ball_bounce.wav   # Ball bounce
│   ├── toy_squeak.wav    # Toy squeak
│   └── clothes_swap.wav  # Clothing change
│
└── music/
    └── background.wav     # Background music (looping)
```

## Requirements

- Format: MP3 or WAV
- Sample rate: 44.1kHz
- Bit rate: 128-192kbps for effects, 256kbps for music
- Duration: 
  - UI sounds: < 1 second
  - Pet sounds: 1-3 seconds
  - Music: 30-60 seconds (will loop)

> 🎧 **v1.3 roadmap:** the files currently checked in are placeholders. When ready to ship v1.3, replace these with polished/mastered audio assets using the same filenames (or update `SOUND_MAP` accordingly).

## Adding New Sounds

1. Add the audio file to the appropriate subdirectory (overwrite placeholder if replacing)
2. Update `SoundType` in `AudioService.ts` to include the new sound
3. Add the sound to the `SOUND_MAP` object (or run `scripts/check-sounds.js` to regenerate mapping)
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
