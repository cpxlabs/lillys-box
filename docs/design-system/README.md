# Pet Care Game - Design System

> Complete visual reference for every screen and component.
> Use these docs with Nano Banana or Claude to implement UI upgrades.

---

## Documents

### Foundation
- **[00 - Design Tokens](./00-design-tokens.md)** - Colors, typography, spacing, shadows, breakpoints, animations, icon system

### Authentication & Navigation
- **[01 - LoginScreen](./01-login-screen.md)** - Google Sign-In / Guest mode entry
- **[02 - GameSelectionScreen](./02-game-selection-screen.md)** - Game hub with 2-column card grid
- **[03 - MenuScreen](./03-menu-screen.md)** - Pet management with patchwork/quilt theme

### Pet Care Screens
- **[04 - CreatePetScreen](./04-create-pet-screen.md)** - Pet creation form with animated selections
- **[05 - HomeScreen](./05-home-screen.md)** - Main pet care hub with action buttons
- **[06 - FeedScene](./06-feed-scene.md)** - Feeding with food carousel (amber theme)
- **[07 - BathScene](./07-bath-scene.md)** - Gesture-based bathing with sponge and bubbles
- **[08 - SleepScene](./08-sleep-scene.md)** - Dark-themed sleep with progress bar
- **[09 - PlayScene](./09-play-scene.md)** - Activity carousel (sky blue theme)
- **[10 - VetScene](./10-vet-scene.md)** - Health management with treatment options
- **[11 - WardrobeScene](./11-wardrobe-scene.md)** - Clothing system with slot tabs and item grid

### Mini-Games
- **[12 - Muito Game](./12-muito-game.md)** - Counting game (home + gameplay)
- **[13 - Color Tap Game](./13-color-tap-game.md)** - Color matching (home + HTML artifact)
- **[14 - Memory Match Game](./14-memory-match-game.md)** - Card flipping with difficulty levels
- **[15 - Pet Runner Game](./15-pet-runner-game.md)** - Side-scrolling runner (green theme)

### Components
- **[16 - Shared Components](./16-shared-components.md)** - StatusCard, IconButton, ScreenHeader, ConfirmModal, etc.

---

## Screen Map

```
LoginScreen
  └─ GameSelectionScreen
       ├─ Pet Care Game
       │    ├─ MenuScreen
       │    │    ├─ CreatePetScreen → HomeScreen
       │    │    └─ HomeScreen
       │    │         ├─ FeedScene
       │    │         ├─ BathScene
       │    │         ├─ SleepScene
       │    │         ├─ PlayScene
       │    │         ├─ VetScene
       │    │         └─ WardrobeScene
       │    └─ (back to GameSelection)
       ├─ Muito Game
       │    ├─ MuitoHomeScreen
       │    ├─ MuitoGameScreen
       │    ├─ MuitoLobbyScreen
       │    ├─ MuitoMultiGameScreen
       │    └─ MuitoResultsScreen
       ├─ Color Tap Game
       │    ├─ ColorTapHomeScreen
       │    └─ ColorTapGameScreen (HTML)
       ├─ Memory Match Game
       │    ├─ MemoryMatchHomeScreen
       │    └─ MemoryMatchGameScreen
       └─ Pet Runner Game
            ├─ PetRunnerHomeScreen
            └─ PetRunnerGameScreen
```

---

## Design Patterns

### Three-Zone Layout (Pet Care Screens)
Most pet care screens follow a consistent pattern:
1. **Top**: StatusCard (pet info + stat bars)
2. **Middle**: PetRenderer (animated pet display, flex: 1)
3. **Bottom**: Action area (white bg, rounded top corners)

### Mini-Game Home Pattern
All mini-game homes share:
- Centered layout with large emoji icon (72px)
- Large title (36-40px, weight 800)
- Best score card (white, rounded, shadowed)
- Pill-shaped play button (32px border radius)
- Instructions text at bottom

### Color Themes by Screen
Each screen has a unique background color for visual differentiation:
- Login/Games/Minigames: Purple family (`#f5f0ff`)
- Home: Green (`#e8f5e9`)
- Feed: Amber (`#fff8e1`)
- Bath: Blue (`#e3f2fd`)
- Sleep: Dark navy (`#1a1a2e`)
- Play: Sky blue (`#e1f5fe`)
- Vet: Green (`#E8F5E9`)
- Wardrobe: Pink (`#fce4ec`)
- Menu: Cream (`#fdf6ec`)
- Runner: Sky blue (`#87CEEB`)

### Responsive Design
All screens use the `useResponsive()` hook providing:
- `deviceType`: mobile / mobileLarge / tablet / desktop
- `fs(size)`: scaled font size
- `spacing(size)`: scaled spacing
- `wp(%)` / `hp(%)`: width/height percentages

---

## Tech Stack
- **Framework**: React Native 0.73 + Expo 50
- **Styling**: React Native StyleSheet (no CSS-in-JS framework)
- **Animations**: React Native Reanimated
- **Icons**: Emoji-based (no icon font library)
- **i18n**: i18next (English + Portuguese)
- **Navigation**: React Navigation (Native Stack)
