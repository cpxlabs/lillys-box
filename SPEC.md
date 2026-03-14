# Lilly's Box - Project Specification

## Overview

**Project Name:** Lilly's Box (Jogo do Pet)  
**Type:** 2D Mobile Game (React Native/Expo)  
**Platform:** Android (primary), Web (secondary)  
**Description:** A children's interactive platform where players care for virtual pets by feeding, bathing, playing, and maintaining their health and happiness — plus 36 mini-games.

## Technology Stack

- **Framework:** React Native 0.77.3 with Expo SDK 55
- **Language:** TypeScript 5.1.3 (strict mode)
- **Navigation:** Expo Router 55 (file-based routing)
- **Graphics:** React Native Skia, React Native SVG, React Native Reanimated 4.2
- **State Management:** React Context API
- **Authentication:** @react-native-google-signin/google-signin (Google OAuth)
- **Storage:** AsyncStorage (local), Firebase Firestore (cloud sync)
- **Ads:** Google Mobile Ads (AdMob) — COPPA compliant
- **Audio:** expo-av (background music + sound effects)
- **Multiplayer:** socket.io-client 4.8.0
- **i18n:** i18next + react-i18next (English + Portuguese Brazil)
- **Testing:** Jest 30, React Native Testing Library, Maestro (E2E)
- **Error Tracking:** Sentry (source maps + debug symbols)
- **Code Quality:** ESLint, Prettier

## Core Features

### Pet System

- **Pet Types:** Cat, Dog
- **Pet Colors:** Base, Black, Brown, White & Brown
- **Pet Gender:** Male, Female, Other

### Pet Stats (0-100 scale)

| Stat | Description | Decay Rate |
|------|-------------|------------|
| Hunger | Food level | -0.5/min |
| Hygiene | Cleanliness | -0.5/min |
| Energy | Stamina | -0.25/min (day), -0.1/min (night) |
| Happiness | Mood | ±0.5/min (based on conditions) |
| Health | Overall wellness (calculated) | Derived from other stats |

### Pet Actions

| Action | Effects | Requirements |
|--------|---------|---------------|
| Feed | +25 hunger, +5 energy, +3 happiness, -2 hygiene | Energy ≥ 20 |
| Play | +20 happiness, -15 hunger, -15 hygiene, -25 energy, +15 money | Energy ≥ 20 |
| Bathe | +35 hygiene, -10 hunger, -8 energy, +5 happiness | Energy ≥ 20 |
| Sleep | +40 energy, +10 happiness, -5 hunger | Energy < 80 |
| Exercise | +15 happiness, -20 hunger, -10 hygiene, -30 energy, +25 money | Energy ≥ 20 |
| Cuddle | +10 happiness, -3 energy | None |
| Vet Visit | Restores health (50-80 based on treatment) | Health < 60, money for treatment |

### Mini-Games

The game includes 36 mini-games for earning money and entertainment:

1. **Feed The Pet** - Feeding mechanics
2. **Bubble Pop** - Pop bubbles
3. **Catch The Ball** - Catch falling balls
4. **Color Tap** - Tap colored items
5. **Color Mixer** - Mix colors
6. **Connect Dots** - Connect numbered dots
7. **Dress Up Relay** - Dress the pet
8. **Balloon Float** - Keep balloons floating
9. **Garden Grow** - Grow plants
10. **Jigsaw Pets** - Jigsaw puzzles
11. **Lightning Tap** - Fast tapping
12. **Memory Match** - Card matching
13. **Mirror Match** - Symmetry matching
14. **Music Maker** - Create music
15. **Paint Splash** - Paint activities
16. **Path Finder** - Navigate mazes
17. **Pet Chef** - Cooking mini-game
18. **Pet Dance Party** - Dance mechanics
19. **Pet Explorer** - Exploration
20. **Pet Taxi** - Transportation
21. **Photo Studio** - Photo activities
22. **Shape Sorter** - Shape matching
23. **Simon Says** - Memory game
24. **Sliding Puzzle** - Puzzle mechanics
25. **Snack Stack** - Stacking game
26. **Treasure Dig** - Digging for treasure
27. **Weather Wizard** - Weather magic
28. **Whack A Mole** - Whack moles
29. **Word Bubbles** - Word games
30. **Pet Runner** - Running game
31. **Hide and Seek** - Hide and seek game
32. **Star Catcher** - Catch falling stars
33. **Muito** - Multiplayer card game
34. **Pet Care** - Virtual pet care
35. **Kids Chess** - Chess for children
36. **GBA Emulator** - Retro game emulator

Each mini-game has best score tracking (per-user via AsyncStorage), optional difficulty levels, and a coin reward system.

### Economy System

- **Currency:** Money (earned through play/exercise)
- **Item Costs:**
  - Basic food: varies
  - Vet antibiotic: $30
  - Vet anti-inflammatory: $50

### Clothing System

Customization slots:
- Head
- Eyes
- Torso
- Paws

### Game Review System

Players can leave reviews on individual games:
- Star ratings (1-5)
- Text comments (max 500 chars)
- Image/GIF attachments (expo-image-picker + Tenor API)
- Firebase Firestore sync
- Helpful reactions, sort/filter options

### Authentication System

- Google OAuth sign-in with guest mode fallback
- Multi-user support (per-user data isolation)
- Auth state persistence across app restarts

## Project Structure

```
lillys-box/
├── app/                    # Main React Native application
│   ├── app/               # Expo Router entry points
│   ├── src/
│   │   ├── components/    # Reusable UI components (22 files)
│   │   ├── config/        # Game configuration (gameBalance, constants, ads)
│   │   ├── context/       # React Context providers (Auth, Pet, Ad, Toast, etc.)
│   │   ├── hooks/         # Custom hooks (usePetActions, useAudio, useGameBestScore)
│   │   ├── screens/       # Screen components
│   │   ├── services/      # Business logic (AdService, AudioService, ReviewService)
│   │   ├── types/         # TypeScript type definitions
│   │   ├── utils/         # Utility functions (storage, validation, logger)
│   │   ├── data/          # Static data (foods, clothing, activities)
│   │   ├── artifacts/     # Game artifact definitions
│   │   └── locales/       # i18n translations (en.json, pt-BR.json)
│   ├── assets/            # Images, sprites, sounds
│   ├── scripts/           # CI/dev scripts (locale key checker)
│   ├── dist/              # Web build output
│   ├── docs/              # Documentation
│   └── e2e/               # E2E tests (Maestro)
├── backend/               # Backend server (Fastify)
├── server/                # Game server (Socket.io)
├── shared/                # Shared types and utilities
└── docs/                  # Root documentation (design system)
```

## UI/UX Design

### Visual Style
- Colorful, child-friendly graphics
- Simple, intuitive touch interactions
- Animated pet sprites using Skia
- Status bars for pet stats
- Warning indicators for low stats

### Navigation
- Tab-based navigation for main sections
- Stack navigation for game screens
- Modal dialogs for settings and confirmations

### Accessibility
- Support for multiple languages (i18n)
- Touch-friendly UI elements
- Clear visual feedback

## Data Persistence

- **Local Storage:** AsyncStorage for pet data, user preferences, and game best scores
- **Cloud Storage:** Firebase Firestore for reviews and user data sync
- **Authentication:** Google OAuth via @react-native-google-signin/google-signin (+ guest mode)

## Game Balance

### Stat Decay (per minute)
- Hunger: 0.5
- Hygiene: 0.5
- Energy: 0.25 (day) / 0.1 (night)
- Happiness: ±0.5 (based on health)

### Health Calculation
Weighted average of all stats with multipliers:
- Hunger: 25%
- Hygiene: 20%
- Energy: 25%
- Happiness: 30%

### Energy Multipliers
- 70-100 energy: 1.0x
- 40-69 energy: 0.5x
- 20-39 energy: 0.25x
- 0-19 energy: 0x (blocked)

## Testing

- **Unit Tests:** Jest 30 with React Native Testing Library (671 tests across 123 suites, all passing)
- **E2E Tests:** Maestro
- **CI Scripts:** Locale key parity check (`scripts/check-locale-keys.js`)

## Build & Deployment

- **Web Build:** `EXPO_PUBLIC_BUILD_PLATFORM=web npx expo export --platform web`
- **Web Deploy:** Vercel (production active)
- **Android Build:** Expo EAS (`eas build`)
- **Testing:** `npm test`, `npm run test:e2e`

## Development Commands

```bash
npm start          # Start Expo dev server
npm run android    # Run on Android
npm run web         # Run on web
npm test           # Run tests
npm run lint       # Lint code
npm run format     # Format code
```
