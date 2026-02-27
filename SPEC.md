# Pet Care Game - Project Specification

## Overview

**Project Name:** Pet Care Game (Jogo do Pet)  
**Type:** 2D Mobile Game (React Native/Expo)  
**Platform:** Android (primary), Web (secondary)  
**Description:** A children's pet care game where players care for virtual pets by feeding, bathing, playing, and maintaining their health and happiness.

## Technology Stack

- **Framework:** React Native with Expo SDK 50
- **Language:** TypeScript
- **Navigation:** React Navigation (native-stack)
- **Graphics:** React Native Skia for animations
- **State Management:** React Context API
- **Authentication:** Firebase Auth (Google Sign-In)
- **Storage:** AsyncStorage for local persistence
- **Ads:** Google Mobile Ads
- **Testing:** Jest, React Testing Library, Maestro (E2E)
- **Build:** Expo Router for file-based routing

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

The game includes 20+ mini-games for earning money and entertainment:

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

## Project Structure

```
pet-care-game/
├── app/                    # Main React Native application
│   ├── app/               # Expo Router entry points
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── config/        # Game configuration
│   │   ├── context/       # React Context providers
│   │   ├── screens/      # Screen components
│   │   ├── services/     # Business logic services
│   │   ├── types/        # TypeScript type definitions
│   │   ├── utils/        # Utility functions
│   │   └── artifacts/    # Game artifact definitions
│   ├── assets/           # Images, sprites, sounds
│   ├── dist/             # Web build output
│   ├── docs/             # Documentation
│   └── e2e/              # E2E tests
├── backend/              # Backend server (Express)
├── server/               # Game server (Socket.io)
└── scripts/              # Build/utility scripts
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

- **Local Storage:** AsyncStorage for pet data and user preferences
- **Cloud Storage:** Firebase Firestore for user data sync
- **Authentication:** Firebase Auth with Google Sign-In

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

- **Unit Tests:** Jest with React Testing Library
- **E2E Tests:** Maestro
- **Test Coverage:** CI/CD integration

## Build & Deployment

- **Web Build:** `npm run build:web`
- **Android Build:** Expo (eas build)
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
