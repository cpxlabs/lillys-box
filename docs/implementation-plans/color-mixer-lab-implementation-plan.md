# Color Mixer Lab - Implementation Plan

## Overview
A target color is displayed, and the player is given 2-3 base paint colors. The player drags paint blobs into a mixing bowl to create the target color. Teaches basic color theory in a playful way.

**Category:** puzzle
**Complexity:** Low
**Reuses existing assets:** Minimal — new color-themed visuals

---

## Game Mechanics (from GAME_IDEAS_BRAINSTORM.md)

### Core Features
- Target color shown at the top of the screen (e.g., orange, purple, green, pink)
- 2-3 draggable paint blobs at the bottom (primary colors: red, blue, yellow + white for tints)
- Drag a color into the central mixing bowl — the bowl color updates in real time
- "Check" button compares the mix to the target
- Accuracy determines stars (exact match = 3 stars, close = 2, far = 1)
- Progressive levels: simple mixes (red + yellow = orange) to complex (tertiary colors, tints)

### Scoring
- Stars per level (1-3)
- Unlock new color palettes as levels progress
- Coin reward per level based on star rating
- Level progression map showing completed/locked levels

---

## Implementation Tasks

### Phase 1: Setup & Configuration
- [ ] Create `ColorMixerNavigator.tsx` with stack navigator (Home → Levels → Game)
- [ ] Create `ColorMixerContext.tsx` with:
  - Level progress state (completed levels, stars earned)
  - Best stars per level
  - Current level state
  - Unlocked color palettes
- [ ] Create `ColorMixerProvider.tsx` to wrap the context
- [ ] Add i18n keys to translation files:
  - `selectGame.colorMixer.name`
  - `selectGame.colorMixer.description`
  - `colorMixer.title`
  - `colorMixer.subtitle`
  - `colorMixer.instructions`
  - `colorMixer.playButton`
  - `colorMixer.level`
  - `colorMixer.target`
  - `colorMixer.mixingBowl`
  - `colorMixer.check`
  - `colorMixer.reset`
  - `colorMixer.perfect`
  - `colorMixer.close`
  - `colorMixer.tryAgain`
  - `colorMixer.levelComplete`
  - `colorMixer.nextLevel`
  - `colorMixer.backToLevels`

### Phase 2: ColorMixerHomeScreen
- [ ] Create `src/screens/ColorMixerHomeScreen.tsx`
- [ ] Layout following mini-game home pattern:
  - Purple background (#f5f0ff)
  - Back button top-left
  - Large emoji icon (🎨 or 🌈) at 72px
  - Title "Color Mixer Lab" at 36px, weight 800, color gradient (rainbow effect)
  - Subtitle explaining the game
  - Progress summary card:
    - Levels completed: X/20
    - Total stars: X/60
    - White background, rounded, shadowed
  - Large pill-shaped Play button (gradient background: #ff6b6b → #4ecdc4)
  - Instructions text at bottom
- [ ] Load progress from context
- [ ] Navigation to level select screen on play button press

### Phase 3: Level Select Screen (Optional but Recommended)
- [ ] Create `src/screens/ColorMixerLevelScreen.tsx`
- [ ] Display level progression map:
  - Grid of level buttons (5 columns x 4 rows = 20 levels)
  - Each level button shows:
    - Level number
    - Lock icon if not yet unlocked
    - Stars earned (0-3)
    - Color preview of target
  - Levels unlock sequentially (must complete level N to unlock N+1)
- [ ] Navigation to game screen with selected level

### Phase 4: ColorMixerGameScreen - UI Layout
- [ ] Create `src/screens/ColorMixerGameScreen.tsx`
- [ ] Layout structure:
  - SafeAreaView with gradient background (#fef3c7 → #dbeafe - light yellow to blue)
  - Header with back button, level number
  - **Top section:**
    - "Target Color" label
    - Large square color swatch showing target (with subtle border)
    - Color name/hint (e.g., "Orange" or "Mix Red + Yellow")
  - **Middle section:**
    - "Mixing Bowl" label
    - Large circular bowl graphic (empty or showing current mix)
    - Current mix color fills the bowl
    - Reset button (clear the bowl)
  - **Bottom section:**
    - Available paint colors (2-4 draggable blobs)
    - Each paint blob is a circle with the color + drop shadow
    - Drag indicator (subtle hint: "Drag colors here")
  - **Footer:**
    - Check button (when bowl has some color)

### Phase 5: Color Mixing Logic
- [ ] Implement RGB color blending:
  - Start with empty bowl (white or transparent)
  - Add colors to bowl by averaging RGB values
  - Support mixing 2-3 colors
  - Formula: `newColor.r = (color1.r + color2.r + ...) / count`
- [ ] Define level targets with recipes:
  - Level 1: Orange = Red + Yellow
  - Level 2: Purple = Red + Blue
  - Level 3: Green = Blue + Yellow
  - Level 4: Light Blue = Blue + White
  - Level 5: Pink = Red + White
  - Level 6: Brown = Red + Green
  - Level 7: Teal = Blue + Green + White
  - ... (continue up to 20 levels with increasing complexity)
- [ ] Store target color as RGB value
- [ ] Store player's mixed color as RGB value

### Phase 6: Drag & Drop Interaction
- [ ] Make paint blobs draggable:
  - Use React Native Gesture Handler (PanGestureHandler)
  - Blob follows finger/cursor
  - Visual feedback: scale up while dragging
  - Drop shadow increases while dragging
- [ ] Define drop zone (mixing bowl area):
  - Detect when blob is released over bowl
  - Add color to bowl mix
  - Animate blob into bowl (shrink + fade)
  - Update bowl color in real-time
- [ ] Multiple drops:
  - Allow dragging same color multiple times (increases its proportion)
  - Or: limit to one drop per color (simpler for kids)
- [ ] Reset functionality:
  - Clear button empties the bowl
  - Reset to white/transparent
  - Reset available paint blobs

### Phase 7: Color Comparison & Accuracy
- [ ] Calculate color difference:
  - Use Euclidean distance in RGB space
  - Formula: `distance = sqrt((r1-r2)² + (g1-g2)² + (b1-b2)²)`
  - Normalize to 0-100 scale (0 = perfect match, 100 = completely different)
- [ ] Determine star rating:
  - **3 stars:** difference < 10 (nearly perfect)
  - **2 stars:** difference < 30 (close)
  - **1 star:** difference < 60 (somewhat close)
  - **0 stars:** difference >= 60 (try again)
- [ ] Show comparison result:
  - Side-by-side target vs. player mix
  - Accuracy percentage (e.g., "95% match!")
  - Star rating with animation

### Phase 8: Level Completion & Progression
- [ ] Level complete modal (when player clicks "Check"):
  - Show target color vs. player color side by side
  - Display star rating (animated)
  - Show accuracy percentage
  - Buttons:
    - "Try Again" (if 0-1 stars) → restart level
    - "Next Level" (if 2-3 stars) → go to next level
    - "Back to Levels" → return to level select
- [ ] Update level progress in context:
  - Save stars earned for this level
  - Unlock next level if not already unlocked
  - Update best stars if improved
- [ ] Award coins based on stars:
  - 1 star: 10 coins
  - 2 stars: 25 coins
  - 3 stars: 50 coins

### Phase 9: Visual Polish & Animations
- [ ] Paint blob animations:
  - Idle: subtle bobbing/floating animation
  - Drag: scale to 1.1x, shadow expands
  - Drop: shrink into bowl with ease-in-out, fade out
- [ ] Bowl animations:
  - Color change: smooth transition (300ms) when color added
  - Fill animation: liquid pour effect (optional, advanced)
- [ ] Star rating animation:
  - Stars appear one by one with scale + rotation
  - Gold color (#f1c40f) with sparkle effect
- [ ] Modal animations:
  - Fade in backdrop
  - Scale + bounce in card
  - Confetti/particles on 3-star completion
- [ ] Haptic feedback:
  - Light tap when picking up blob
  - Medium tap when dropping into bowl
  - Success pattern when earning stars

### Phase 10: Level Design & Content
- [ ] Define 20 levels with increasing difficulty:
  - **Levels 1-5:** Simple two-color mixes (primary → secondary)
  - **Levels 6-10:** Add white for tints (lighter colors)
  - **Levels 11-15:** Three-color mixes (tertiary colors)
  - **Levels 16-20:** Complex tints/shades with precise ratios
- [ ] Create level data structure:
  ```typescript
  interface Level {
    id: number;
    targetColor: { r: number; g: number; b: number };
    availableColors: Array<{ name: string; color: { r, g, b } }>;
    hint?: string; // Optional hint text
  }
  ```
- [ ] Store level definitions in JSON or TypeScript file

### Phase 11: Hints & Tutorials
- [ ] Optional hint system:
  - Show recipe hint for each level (e.g., "Try mixing Red and Yellow")
  - Hint button in game screen (costs coins or shown after 2 failed attempts)
- [ ] Tutorial on first play:
  - Show drag instruction overlay
  - Highlight mixing bowl
  - Guide player through first level

### Phase 12: Registration & Navigation
- [ ] Register game in App.tsx:
  ```typescript
  gameRegistry.register({
    id: 'color-mixer',
    nameKey: 'selectGame.colorMixer.name',
    descriptionKey: 'selectGame.colorMixer.description',
    emoji: '🎨',
    category: 'puzzle',
    navigator: ColorMixerNavigator,
    providers: [ColorMixerProvider],
    isEnabled: true,
  });
  ```
- [ ] Add imports in App.tsx
- [ ] Verify navigation from GameSelectionScreen

### Phase 13: Testing & Documentation
- [ ] Test color mixing accuracy across all levels
- [ ] Test drag & drop on different screen sizes
- [ ] Test level progression and unlocking
- [ ] Test star rating thresholds
- [ ] Test persistence of progress and stars
- [ ] Create design documentation in `docs/design-system/19-color-mixer-game.md`
- [ ] Add screenshots to design documentation
- [ ] Update design system README.md with new entry

---

## Design Specifications

### Colors
- **Primary (Gradient):** #ff6b6b → #4ecdc4 (red to teal)
- **Background:** Gradient #fef3c7 → #dbeafe (yellow to blue)
- **Text:** #333 (dark gray)
- **Secondary text:** #666
- **Bowl outline:** #94a3b8 (slate)
- **Lock icon:** #cbd5e1 (gray)
- **Star gold:** #f1c40f

### Typography
- **Home title:** 36px, weight 800, gradient text
- **Home subtitle:** 18px, weight 400
- **Level number:** 20px, weight 700
- **Target label:** 16px, weight 600
- **Accuracy text:** 24px, weight 700
- **Modal title:** 28px, weight 800
- **Hint text:** 14px, weight 400, italic

### Layout
- **Target swatch:** 120px x 120px, border radius 16px
- **Mixing bowl:** 180px diameter circle
- **Paint blobs:** 80px diameter circles
- **Paint blob gap:** 20px
- **Level button:** 60px x 60px (on level select grid)

### Animations
- **Paint blob idle:** 2s infinite ease-in-out bobbing
- **Blob drag:** 150ms scale to 1.1x
- **Bowl color transition:** 300ms ease-out
- **Star appear:** 400ms spring bounce per star
- **Modal entrance:** 250ms ease-out

---

## Color Theory Education (Optional Enhancements)
- [ ] Add color wheel reference graphic
- [ ] Show RGB values as player mixes (educational overlay)
- [ ] Fun facts about colors after level completion
- [ ] Achievements for discovering specific color combinations

---

## Dependencies & Reuse
- **React Navigation:** Native Stack (already installed)
- **React Native Reanimated:** For animations (already installed)
- **React Native Gesture Handler:** For drag interactions (already installed)
- **expo-haptics:** For tactile feedback (already installed)
- **i18next:** For translations (already installed)
- **useResponsive hook:** For responsive sizing
- **Skia (optional):** For advanced bowl/liquid rendering

---

## Success Criteria
- [ ] Game is playable with smooth color mixing
- [ ] Color comparison algorithm is accurate and fair
- [ ] Drag & drop interaction is intuitive
- [ ] Level progression works correctly
- [ ] Stars and progress persist across sessions
- [ ] UI matches design system guidelines
- [ ] Game is registered and accessible from GameSelectionScreen
- [ ] All text is internationalized (EN + PT)
- [ ] Design documentation is complete with screenshots
- [ ] Educational value is clear (teaches color theory)
