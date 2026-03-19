# Folder Structure & Code Organization

Project directory organization, file locations, and naming conventions.

## Table of Contents
1. [Root Directory](#root-directory)
2. [Application Directory (`/app`)](#application-directory-app)
3. [Source Code Organization (`/app/src`)](#source-code-organization-appsrc)
4. [Testing and Tooling](#testing-and-tooling)
5. [Documentation Map](#documentation-map)
6. [File Naming Conventions](#file-naming-conventions)
7. [Key File Locations](#key-file-locations)
8. [Dependencies Location](#dependencies-location)
9. [Assets Organization](#assets-organization)
10. [Build Output](#build-output)
11. [Version Control](#version-control)
12. [Development Setup](#development-setup)

## Root Directory

```
lillys-box/
├── app/                    # Expo app (see app/README.md for details)
├── backend/                # Backend services (optional)
├── docs/                   # Documentation (this folder)
├── scripts/                # Build and utility scripts
├── CONTRIBUTING.md         # Contributing guidelines
├── README.md               # Project overview
├── SPEC.md                 # Project specifications
├── package.json            # Root dependencies
├── pnpm-lock.yaml          # Monorepo lockfile (single source of truth)
└── pnpm-workspace.yaml     # Workspace definition (app, backend)
```

## Application Directory (`/app`)

Main Expo application code:

```
app/
├── app/                    # Expo Router file-based routing
│   ├── _layout.tsx        # Root layout
│   ├── index.tsx          # Home screen
│   ├── login.tsx          # Login screen
│   └── game/
│       └── [gameId].tsx   # Dynamic game screen
├── assets/                # Static assets
│   ├── sprites/           # Character & item sprites
│   │   ├── animations/    # Animation sequences
│   │   ├── backgrounds/   # Scene backgrounds
│   │   ├── cats/          # Cat sprites
│   │   ├── dogs/          # Dog sprites
│   │   ├── clothes/       # Clothing items
│   │   ├── food/          # Food sprites
│   │   └── toys/          # Toy sprites
│   ├── sounds/            # Audio assets
│   │   ├── music/         # Background music
│   │   ├── pet/           # Pet sounds
│   │   ├── ui/            # UI button sounds
│   │   └── activities/    # Action sounds
│   └── (icons, splash)
├── src/                   # TypeScript source code
│   ├── components/        # Reusable UI components
│   ├── screens/           # Full-screen components
│   ├── context/           # React Context providers
│   ├── hooks/             # Custom React hooks
│   ├── services/          # Business logic & APIs
│   ├── utils/             # Utility functions
│   ├── config/            # App configuration
│   ├── data/              # Static data
│   ├── types/             # TypeScript definitions
│   ├── locales/           # i18n translations
│   ├── registry/          # Game registry
│   ├── testUtils/         # Shared test helpers
│   ├── gameRegistrations.ts
│   ├── i18n.ts
│   └── types.ts
├── e2e/                   # End-to-end tests
│   └── flow.yaml          # Maestro test flows
├── __mocks__/             # Jest mocks
├── app.config.js          # Expo configuration
├── babel.config.js        # Babel configuration
├── eslint.config.js       # ESLint configuration
├── jest.config.js         # Jest configuration
├── jest.setup.js          # Jest setup
├── metro.config.js        # Metro bundler config
├── tsconfig.json          # TypeScript configuration
├── package.json           # App dependencies
└── vercel.json            # Vercel deployment config
```

## Source Code Organization (`/app/src`)

### components/

Reusable UI components (not full screens):

```
components/
├── BannerAd.tsx              # Ad banner
├── ConfirmModal.tsx          # Confirmation dialog
├── EnhancedStatusBar.tsx     # Status bar
├── ErrorBoundary.tsx         # Error handling
├── IconButton.tsx            # Button with icon
├── LanguageSelector.tsx      # Language toggle
├── PetRenderer.tsx           # Pet display
├── RewardedAdButton.tsx      # Ad button
├── ScreenHeader.tsx          # Screen title bar
├── SettingsModal.tsx         # Settings dialog
├── SpriteSheetAnimation.tsx  # Animation wrapper
├── StarRating.tsx            # Rating widget
├── StatusBar.tsx             # Pet status display
├── StatusCard.tsx            # Stat card
├── __tests__/                # Component tests
└── ...
```

### screens/

Full-screen components (one per logical screen):

```
screens/
├── LoginScreen.tsx           # Authentication
├── HomeScreen.tsx            # Main pet view
├── MenuScreen.tsx            # Navigation menu
├── CreatePetScreen.tsx       # Pet creation/customization
├── GameSelectionScreen.tsx   # Game hub
├── GameReviewsScreen.tsx     # Reviews list
├── FeedScene.tsx             # Feed interaction
├── BathScene.tsx             # Bath interaction
├── PlayScene.tsx             # Play interaction
├── SleepScene.tsx            # Sleep interaction
├── VetScene.tsx              # Vet interaction
├── WardrobeScene.tsx         # Clothing customization
└── __tests__/                # Screen tests
```

### context/

Global state management with React Context:

```
context/
├── AdContext.tsx             # Advertisement state
├── AuthContext.tsx           # Authentication state
├── LanguageContext.tsx       # Language/i18n state
├── PetContext.tsx            # Pet state & persistence
├── ToastContext.tsx          # Toast notifications
├── ColorTapContext.tsx       # Color Tap game state
├── MemoryMatchContext.tsx    # Memory Match game state
└── ... (36 game contexts + 5 app contexts + 20 unregistered game contexts)
```

### hooks/

Custom React hooks for reusable logic:

```
hooks/
├── useAudio.ts               # Audio playback
├── useBackButton.tsx         # Android back button
├── useDoubleReward.tsx       # Reward multiplier
├── useFavoriteGames.ts       # Favorite games
├── useGameAds.ts             # Game ad integration
├── useGameBack.ts            # Game back navigation
├── useGameBestScore.ts       # Best score management
├── useGameState.ts           # Unified game state hooks
├── useNavigationList.ts      # List navigation
├── usePetActions.ts          # Unified pet actions
├── useResponsive.ts          # Responsive design
├── useReview.ts              # Review state
├── useRewardedAd.ts          # Ad management
├── useSocket.ts              # Socket.io multiplayer
├── useSpriteSheet.ts         # Sprite animation
├── __tests__/                # Hook tests
└── ...
```

### services/

Business logic and external integrations:

```
services/
├── AdService.ts              # AdMob integration
├── AudioService.ts           # Audio management
├── ErrorService.ts           # Error handling/Sentry
├── ReviewService.ts          # Reviews data layer
└── ...
```

### utils/

Utility functions and helpers:

```
utils/
├── age.ts                    # Pet age calculations
├── authStorage.ts            # Auth persistence
├── debounce.ts               # Debounce helper
├── haptics.ts                # Haptic feedback
├── logger.ts                 # Logging
├── migration.ts              # Data migrations
├── petStats.ts               # Pet stat calculations
├── storage.ts                # AsyncStorage wrapper
├── validation.ts             # Input validation
└── __tests__/                # Utility tests
```

### config/

Application configuration:

```
config/
├── actionConfig.ts           # Action configurations
├── ads.config.ts             # Ad unit IDs & settings
├── constants.ts              # App constants
├── gameBalance.ts            # Game balance values
├── responsive.ts             # Responsive breakpoints
└── spriteSheets.ts           # Sprite configurations
```

### data/

Static data and constants:

```
data/
├── clothingItems.ts          # Available clothing
├── foodItems.ts              # Available food
├── playActivities.ts         # Play activity types
└── ...
```

### types/

TypeScript type definitions:

```
types/
├── ads.ts                    # Ad types
├── gameAds.ts                # Game ad types
├── gameState.ts              # Unified game state types
├── global.d.ts               # Global type declarations
├── navigation.ts             # Navigation types
├── review.ts                 # Review types
└── types.ts                  # General types
```

### locales/

Translation files for internationalization:

```
locales/
├── en.json                   # English translations
└── pt-BR.json                # Portuguese (Brazil)
```

## Testing and Tooling

```
app/
├── e2e/                      # Maestro tests
├── __mocks__/                # Jest mocks
├── jest.config.js            # Jest configuration
├── jest.setup.js             # Jest setup
├── eslint.config.js          # ESLint configuration
├── babel.config.js           # Babel configuration
├── metro.config.js           # Metro bundler configuration
└── tsconfig.json             # TypeScript configuration
```

## Documentation Map

Documentation files in root and `/docs`:

```
/
├── README.md                 # Project overview (main entry point)
├── CONTRIBUTING.md           # Contributing guide
├── SPEC.md                   # Project specifications
└── docs/                     # Complete documentation
    ├── README.md             # Documentation index
    ├── GAMES_SYSTEM_UPGRADE.md  # Game system reference
    ├── GAMES_ARCHITECTURE.md    # Game architecture diagrams
    ├── BRAINSTORM.md            # Game brainstorm ideas
    ├── RALPH_LOOPS.md           # AI coding loops guide
    ├── guides/
    │   ├── BUILD.md          # Building for platforms
    │   ├── NAVIGATION.md     # Game navigation system
    │   ├── RESPONSIVE.md     # Responsive design
    │   ├── LOAD_ROMS.md      # Loading games in GBA emulator
    │   ├── CLAUDE_MEM.md     # Claude-Mem persistent memory setup
    │   └── FOLDER_STRUCTURE.md  # This file
    ├── technical/
    │   ├── AUTHENTICATION.md
    │   ├── API_REFERENCE.md
    │   ├── ACTIONS.md
    │   ├── EMULATOR.md       # GBA emulator proposal
    │   └── CODE_REVIEW.md
    ├── testing/
    │   └── TESTING.md
    └── design-system/        # UI design documentation
        ├── 00-design-tokens.md
        ├── 01-login-screen.md
        └── ... (23 more)
```

## File Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Components/Screens | PascalCase | `HomeScreen.tsx`, `PetRenderer.tsx` |
| Hooks | camelCase + `use` prefix | `useAuth.ts`, `usePetActions.ts` |
| Services | camelCase + `Service` | `AudioService.ts`, `AdService.ts` |
| Utils | camelCase | `petStats.ts`, `storage.ts` |
| Config | camelCase + `.config` | `ads.config.ts` |
| Types | camelCase | `ads.ts`, `navigation.ts` |
| Contexts | PascalCase + `Context` | `AuthContext.tsx` |
| Tests | `*.test.ts` or `__tests__/` | `AuthContext.test.tsx` |

## Key File Locations

### Pet Management
- Pet creation: `src/screens/CreatePetScreen.tsx`
- Pet state: `src/context/PetContext.tsx`
- Pet storage: `src/utils/storage.ts`
- Pet stats: `src/utils/petStats.ts`

### Authentication
- Login screen: `src/screens/LoginScreen.tsx`
- Auth context: `src/context/AuthContext.tsx`
- Auth storage: `src/utils/authStorage.ts`
- Auth config: `app.config.js`

### Game System
- Game selection: `src/screens/GameSelectionScreen.tsx`
- Game contexts: `src/context/*Context.tsx` (61 files)
- Game registry: `src/gameRegistrations.ts`
- Game balance: `src/config/gameBalance.ts`

### User Interface
- Responsive utilities: `src/hooks/useResponsive.ts`
- Responsive config: `src/config/responsive.ts`
- UI components: `src/components/*.tsx`
- Design system: `docs/design-system/`

### Actions & Interactions
- Actions hook: `src/hooks/usePetActions.ts`
- Action config: `src/config/actionConfig.ts`
- Feed scene: `src/screens/FeedScene.tsx`
- Play scene: `src/screens/PlayScene.tsx`
- Bath scene: `src/screens/BathScene.tsx`

### Testing
- E2E tests: `app/e2e/flow.yaml`
- Unit tests: `src/**/__tests__/*.test.ts`
- Jest config: `app/jest.config.js`
- Test setup: `app/jest.setup.js`

### Configuration
- App config: `app/app.config.js`
- TypeScript: `app/tsconfig.json`
- ESLint: `app/eslint.config.js`
- Babel: `app/babel.config.js`
- Metro: `app/metro.config.js`

### Deployment
- Web build config: `app/vercel.json`
- Deployment: See [BUILD.md](BUILD.md)

## Dependencies Location

### Root Dependencies
- `pnpm-workspace.yaml` - Workspace configuration
- `package.json` - Root-level scripts and tools

### App Dependencies
- `app/package.json` - React Native/Expo dependencies
- `pnpm-lock.yaml` - Locked versions (root-level, single lockfile for the monorepo)

### Backend Dependencies (if used)
- `backend/package.json` - Server dependencies
- `backend/shared/package.json` - Shared code

## Assets Organization

### Sprites (`assets/sprites/`)

**Character Sprites:**
- `cats/` - Cat character variations
- `dogs/` - Dog character variations
- `clothes/` - Clothing items
- `animations/` - Action animations

**Scene Sprites:**
- `backgrounds/` - Scene backgrounds
- `food/` - Food items
- `toys/` - Toy items

### Sounds (`assets/sounds/`)

**Categories:**
- `music/` - Background music
- `pet/` - Pet sounds (meow, bark)
- `ui/` - Button clicks
- `activities/` - Action sounds (feed, play)

## Build Output

After building, generated directories:

```
app/
├── .expo/                    # Expo cache
├── .next/                    # NextJS build (web)
├── dist/                     # Web build output
├── android/                  # Android build output
├── ios/                      # iOS build output
└── node_modules/             # Dependencies
```

## Version Control

### Ignored Directories
- `node_modules/` - Dependencies
- `dist/`, `.next/` - Build outputs
- `.expo/` - Expo cache
- `android/.gradle/`, `ios/Pods/` - Native builds

### Tracked Files
- `src/**` - Source code
- `app/**` - App configs
- `assets/**` - Static assets
- `docs/**` - Documentation
- `package.json`, `pnpm-lock.yaml` - Dependencies

## Development Setup

See [BUILD.md](BUILD.md) for:
- Installing dependencies
- Running development servers
- Building for production
- Deploying to platforms

---

**Last Updated**: 2026-03-19  
**Status**: Complete
