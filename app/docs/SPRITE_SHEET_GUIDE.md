# Sprite Sheet Animation System Guide

## Overview

Lilly's Box now has a comprehensive sprite sheet animation system with intelligent caching, preloading, and fallback support.

## Architecture

### Core Components

1. **Configuration** (`src/config/spriteSheets.ts`)
   - Centralized sprite sheet definitions
   - Frame counts, FPS, dimensions
   - Animation metadata (loop, interruptible, transitions)

2. **Asset Manager** (`src/utils/SpriteSheetManager.ts`)
   - Singleton for sprite sheet loading
   - Intelligent caching system
   - Batch preloading capabilities
   - Memory management

3. **React Integration** (`src/hooks/useSpriteSheet.ts`)
   - `useSpriteSheet` - Load individual animations
   - `usePreloadPetAnimations` - Preload all pet animations

4. **Renderer** (`src/components/PetRenderer.tsx`)
   - Automatic sprite sheet detection
   - Fallback to transform animations
   - Clothing layer support

5. **Preloader** (`src/components/SpriteSheetPreloader.tsx`)
   - App initialization preloading
   - Progress tracking UI
   - Batch loading support

## Directory Structure

```
assets/sprites/animations/
├── cats/
│   ├── cat_base_idle.png
│   ├── cat_base_eating.png
│   ├── cat_base_happy.png
│   ├── cat_base_playing.png
│   ├── cat_base_sleeping.png
│   ├── cat_base_bathing.png
│   ├── cat_base_tired.png
│   ├── cat_base_sick.png
│   ├── cat_black_idle.png
│   └── ... (same for black variant)
└── dogs/
    ├── dog_brown_idle.png
    ├── dog_brown_eating.png
    └── ... (same for brown, black, whiteandbrown)
```

## Sprite Sheet Specifications

### Technical Requirements

- **Format**: PNG with transparency (RGBA)
- **Layout**: Horizontal strip (frames side-by-side)
- **Frame dimensions**: 256x256 pixels per frame
- **Total size**: 256 × (frameCount × 256) pixels

### Animation Specifications

| Animation | Frames | FPS | Duration | Loop | Repeats |
|-----------|--------|-----|----------|------|---------|
| idle | 12 | 12 | 1.0s | ✅ | Infinite |
| eating | 8 | 12 | 0.67s | ✅ | 3× → happy |
| happy | 10 | 12 | 0.83s | ❌ | 1× → idle |
| playing | 12 | 15 | 0.8s | ✅ | 2× → happy |
| sleeping | 8 | 6 | 1.33s | ✅ | Infinite |
| bathing | 8 | 20 | 0.4s | ❌ | 3× → happy |
| tired | 8 | 8 | 1.0s | ✅ | Infinite |
| sick | 8 | 6 | 1.33s | ✅ | Infinite |

## Usage Examples

### 1. Using Sprite Sheets in Components

```typescript
import { PetRenderer } from '../components/PetRenderer';

// Enable sprite sheets with useSpriteSheets prop
<PetRenderer
  pet={currentPet}
  animationState="eating"
  size={300}
  useSpriteSheets={true}  // 👈 Enable sprite sheets
/>
```

### 2. Preloading at App Start

```typescript
import { SpriteSheetPreloader } from '../components/SpriteSheetPreloader';

function App() {
  const { pets, currentPet } = usePetStore();

  return (
    <SpriteSheetPreloader
      pet={currentPet}
      allPets={pets}
      showUI={true}
      onComplete={() => console.log('Ready!')}
      onProgress={(current, total, percentage) => {
        console.log(`Loading: ${percentage}%`);
      }}
    >
      <MainApp />
    </SpriteSheetPreloader>
  );
}
```

### 3. Manual Preloading

```typescript
import { spriteSheetManager } from '../utils/SpriteSheetManager';

// Preload single animation
await spriteSheetManager.preload('cat', 'base', 'idle');

// Preload all animations for a pet
await spriteSheetManager.preloadPet('cat', 'base');

// Batch preload multiple pets
await spriteSheetManager.preloadBatch([
  { type: 'cat', color: 'base' },
  { type: 'dog', color: 'brown' },
]);

// Check cache stats
const stats = spriteSheetManager.getCacheStats();
console.log(stats); // { total: 10, loaded: 8, failed: 0, pending: 2 }
```

### 4. Using the Hook Directly

```typescript
import { useSpriteSheet } from '../hooks/useSpriteSheet';

function CustomPetComponent({ pet }) {
  const { spriteSheet, isLoaded, exists, error } = useSpriteSheet(
    pet.type,
    pet.color,
    'eating',
    true // auto-preload
  );

  if (!exists) {
    return <FallbackAnimation />;
  }

  if (!isLoaded) {
    return <LoadingSpinner />;
  }

  if (error) {
    console.error('Failed to load:', error);
    return <FallbackAnimation />;
  }

  return (
    <SpriteSheetAnimation
      spriteSheet={spriteSheet.asset}
      frameCount={spriteSheet.frameCount}
      frameWidth={spriteSheet.frameWidth}
      frameHeight={spriteSheet.frameHeight}
      fps={spriteSheet.fps}
      loop={spriteSheet.loop}
    />
  );
}
```

## Memory Management

### Automatic Cache Cleanup

```typescript
// Clear old cache entries (older than 5 minutes)
spriteSheetManager.clearOldCache(5 * 60 * 1000);

// Clear all cache
spriteSheetManager.clearCache();
```

### Cache Inspection

```typescript
// Get all cached keys
const keys = spriteSheetManager.getCachedKeys();
// ['cat_base_idle', 'cat_base_eating', 'dog_brown_idle']

// Check if specific animation is loaded
const loaded = spriteSheetManager.isLoaded('cat', 'base', 'idle');

// Get error for failed loads
const error = spriteSheetManager.getError('cat', 'base', 'idle');
```

## Adding New Animations

### Step 1: Create the Sprite Sheet

Generate your sprite sheet using Veo 3 or other tools (see video generation prompts in this directory).

### Step 2: Add to Assets

Place the sprite sheet in the correct directory:
```
assets/sprites/animations/{petType}/{petType}_{color}_{animation}.png
```

### Step 3: Update Configuration

The sprite sheet is already configured in `src/config/spriteSheets.ts`. The system will automatically detect and use it.

### Step 4: Test

```typescript
// Check if sprite sheet exists
import { hasSpriteSheet } from '../config/spriteSheets';

console.log(hasSpriteSheet('cat', 'base', 'idle')); // true or false
```

## Fallback Behavior

The system gracefully falls back to transform-based animations when:

1. Sprite sheets are not enabled (`useSpriteSheets={false}`)
2. Sprite sheet doesn't exist for the pet/animation
3. Sprite sheet fails to load
4. Asset is not yet preloaded

This ensures the app always works, even without sprite sheet assets.

## Performance Tips

1. **Preload on app start** - Use `SpriteSheetPreloader` at app root
2. **Prioritize common animations** - idle, eating, happy load first
3. **Clear old cache** - Run cleanup periodically to free memory
4. **Batch preload** - Load multiple pets together for efficiency
5. **Monitor cache stats** - Track loaded/failed assets in development

## Troubleshooting

### Sprite sheets not appearing?

1. Check if `useSpriteSheets={true}` is set
2. Verify file exists at correct path
3. Check console for loading errors
4. Inspect cache: `spriteSheetManager.getCacheStats()`

### Performance issues?

1. Reduce sprite sheet file sizes (optimize PNGs)
2. Clear old cache entries
3. Preload only priority animations
4. Check FPS settings aren't too high

### Assets not loading on web?

1. Verify Metro bundler includes the assets
2. Check file paths are correct
3. Clear Metro cache: `npx expo start --clear`

## Migration from Old System

The old `SPRITE_SHEET_ASSETS` structure is deprecated. The new system provides:

✅ Automatic preloading
✅ Intelligent caching
✅ React hooks integration
✅ Type-safe configuration
✅ Memory management
✅ Progress tracking
✅ Error handling

Simply enable `useSpriteSheets={true}` on `PetRenderer` to use the new system.
