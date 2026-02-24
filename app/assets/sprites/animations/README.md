# Sprite Sheet Animations

This directory contains sprite sheet animations for pets.

## Directory Structure

```
animations/
├── cats/
│   ├── cat_base_idle.png
│   ├── cat_base_eating.png
│   ├── cat_base_happy.png
│   ├── cat_base_playing.png
│   ├── cat_base_sleeping.png
│   ├── cat_base_bathing.png
│   ├── cat_base_tired.png
│   ├── cat_base_sick.png
│   └── cat_black_*.png (same animations for black variant)
└── dogs/
    ├── dog_brown_*.png (8 animations)
    ├── dog_black_*.png (8 animations)
    └── dog_whiteandbrown_*.png (8 animations)
```

## Sprite Sheet Format

- **Layout**: Horizontal strip (frames side-by-side)
- **Frame size**: 256x256 pixels
- **Format**: PNG with transparency (RGBA)
- **Total size**: (256 × frameCount) × 256 pixels

## Generating Sprite Sheets

See `/docs/VIDEO_GENERATION_PROMPTS.md` for detailed instructions on:

1. Generating animations using Veo 3 or Nano Banana
2. Extracting frames from videos
3. Creating sprite sheets from frames

## Current Status

⚠️ **Placeholder files only** - Actual sprite sheets need to be generated.

The app will fall back to transform-based animations until sprite sheets are created.

## Required Animations

Total: 40 sprite sheets (5 pet variants × 8 animations each)

- [ ] Cat Base (orange tabby) - 8 animations
- [ ] Cat Black - 8 animations
- [ ] Dog Brown - 8 animations
- [ ] Dog Black - 8 animations
- [ ] Dog White & Brown - 8 animations

### Animation List per Pet

1. **idle** - 12 frames, 12 FPS, loops
2. **eating** - 8 frames, 12 FPS, loops 3x
3. **happy** - 10 frames, 12 FPS, plays once
4. **playing** - 12 frames, 15 FPS, loops 2x
5. **sleeping** - 8 frames, 6 FPS, loops
6. **bathing** - 8 frames, 20 FPS, plays 3x
7. **tired** - 8 frames, 8 FPS, loops
8. **sick** - 8 frames, 6 FPS, loops

## Usage

Once sprite sheets are created, enable them in the app:

```typescript
<PetRenderer
  pet={currentPet}
  animationState="eating"
  useSpriteSheets={true}  // ← Enable sprite sheets
/>
```

The system will automatically:
- Load and cache sprite sheets
- Preload priority animations
- Fall back to transforms if sprite sheets aren't ready
