# React Native Template App — Bootstrap Guide

This document describes the full architecture, conventions, and configuration of this repository so that new React Native applications can be bootstrapped from it as a template.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Project Structure](#project-structure)
3. [Getting Started](#getting-started)
4. [Configuration Files](#configuration-files)
5. [Architecture Patterns](#architecture-patterns)
6. [State Management](#state-management)
7. [Navigation](#navigation)
8. [Multi-Game Registry](#multi-game-registry)
9. [Internationalization (i18n)](#internationalization-i18n)
10. [Authentication](#authentication)
11. [Monetization (Ads)](#monetization-ads)
12. [Animation & Graphics](#animation--graphics)
13. [Data Persistence](#data-persistence)
14. [Responsive Design](#responsive-design)
15. [Testing](#testing)
16. [Code Quality (Lint & Format)](#code-quality-lint--format)
17. [Scripts Reference](#scripts-reference)
18. [Platform-Specific Considerations](#platform-specific-considerations)
19. [Checklist for New Apps](#checklist-for-new-apps)

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | React Native (Expo managed) | 0.73.2 / Expo ~50 |
| Language | TypeScript (strict mode) | ^5.1.3 |
| Navigation | React Navigation (native-stack) | ^6.x |
| State | React Context API + custom hooks | — |
| Animation | react-native-reanimated | ~3.6.1 |
| Gestures | react-native-gesture-handler | ~2.14.0 |
| Graphics | @shopify/react-native-skia | 0.1.221 |
| SVG | react-native-svg | 14.1.0 |
| Storage | @react-native-async-storage/async-storage | 1.21.0 |
| Auth | @react-native-google-signin/google-signin | ^16.1.1 |
| Ads | react-native-google-mobile-ads | ^16.0.1 |
| i18n | i18next + react-i18next | ^25.x / ^16.x |
| Realtime | socket.io-client | ^4.8.0 |
| Web | react-native-web | ~0.19.6 |
| Testing | Jest + jest-expo + Testing Library | ^30.x |
| Lint | ESLint + TypeScript plugin | ^9.x |
| Format | Prettier | ^3.8.0 |
| Package manager | pnpm | ^10.x |

---

## Project Structure

```
<app-root>/
├── App.tsx                      # Entry point — provider tree + root navigator
├── app.config.js                # Expo config (dynamic, platform-aware)
├── babel.config.js              # Babel — expo preset + reanimated plugin
├── metro.config.js              # Metro bundler — web overrides
├── tsconfig.json                # TypeScript — strict, path aliases
├── jest.config.js               # Jest — expo preset, transforms, mappers
├── jest.setup.js                # Global mocks for native modules
├── .eslintrc.js                 # ESLint rules
├── .prettierrc                  # Prettier formatting rules
│
├── src/
│   ├── components/              # Reusable UI components
│   │   └── __tests__/           # Component unit tests
│   │
│   ├── screens/                 # Full-screen views + navigators
│   │   └── __tests__/           # Screen unit tests
│   │
│   ├── context/                 # React Context providers (global state)
│   │   └── __tests__/           # Context unit tests
│   │
│   ├── hooks/                   # Custom React hooks
│   │   └── __tests__/           # Hook unit tests
│   │
│   ├── config/                  # App configuration & constants
│   ├── data/                    # Static data (items, activities)
│   ├── utils/                   # Utility/helper functions
│   │   └── __tests__/           # Utility unit tests
│   │
│   ├── services/                # Business logic services
│   ├── types/                   # TypeScript type definitions
│   ├── registry/                # Game registry (plugin architecture)
│   │   └── __tests__/
│   │
│   ├── locales/                 # i18n translation JSON files
│   │   ├── en.json
│   │   └── pt-BR.json
│   │
│   ├── artifacts/               # Standalone embeddable components
│   └── i18n.ts                  # i18n initialization
│
├── assets/                      # Images, sprites, icons
├── backend/                     # Fastify API server (optional)
├── server/                      # Socket.io multiplayer server (optional)
├── shared/                      # Shared code across packages (optional)
├── docs/                        # Project documentation
├── e2e/                         # End-to-end tests (Maestro)
├── __mocks__/                   # Global Jest mocks
└── scripts/                     # Helper/build scripts
```

### Conventions

- **One context per feature**: each feature domain (auth, ads, language, each game) has its own context file under `src/context/`.
- **Co-located tests**: every directory that contains source files has a `__tests__/` subdirectory.
- **Path alias**: `@/*` resolves to `src/*` (configured in `tsconfig.json` and `jest.config.js`).
- **Screens vs Components**: `screens/` holds full-screen views and navigators. `components/` holds reusable UI pieces used across multiple screens.

---

## Getting Started

### Prerequisites

- Node.js >= 18
- pnpm (`npm install -g pnpm`)
- Expo CLI (`npx expo`)
- Android Studio / Xcode (for native builds)

### Install & Run

```bash
# Install dependencies
pnpm install

# Start the Expo dev server
pnpm start

# Platform-specific
pnpm run android
pnpm run ios
pnpm run web           # sets EXPO_PUBLIC_BUILD_PLATFORM=web automatically
```

### Bootstrapping a New App

1. Clone or copy this repository.
2. Update `package.json`: `name`, `description`, `version`.
3. Update `app.config.js`: `name`, `slug`, `bundleIdentifier` (iOS), `package` (Android).
4. Replace assets in `assets/` (icon, splash, adaptive-icon, favicon).
5. Remove game-specific code under `src/screens/`, `src/context/`, and game registrations in `App.tsx`.
6. Keep the provider skeleton in `App.tsx` (ErrorBoundary, GestureHandler, Language, Auth, Ad, Toast).
7. Register your own screens/games using the GameRegistry pattern or replace with direct navigation.
8. Update translation keys in `src/locales/`.

---

## Configuration Files

### `app.config.js` — Expo Configuration

Dynamic configuration that conditionally includes native plugins based on the build platform:

```js
module.exports = () => {
  const isWebBuild = process.env.EXPO_PUBLIC_BUILD_PLATFORM === 'web';
  const plugins = isWebBuild ? [] : [
    "@react-native-google-signin/google-signin"
  ];
  return { expo: { ...baseConfig, plugins } };
};
```

Key points:
- Native-only plugins (Google Sign-In, AdMob) are excluded from web builds.
- `EXPO_PUBLIC_BUILD_PLATFORM=web` env var controls web mode.
- Google services files (`google-services.json`, `GoogleService-Info.plist`) are required for mobile OAuth.

### `tsconfig.json` — TypeScript

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }
  }
}
```

### `babel.config.js` — Babel

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [['babel-preset-expo', { flow: false }], '@babel/preset-flow'],
    plugins: ['react-native-reanimated/plugin'],  // must be listed last
  };
};
```

> The `react-native-reanimated/plugin` must always be the **last** plugin in the list.

### `metro.config.js` — Metro Bundler

Extends Expo's default config with:
- Web platform overrides (resolve `react-native-web` Platform module).
- Empty module resolution for native-only packages on web (e.g., `react-native-google-mobile-ads`).

### `.eslintrc.js` — ESLint

Extends:
- `eslint:recommended`
- `plugin:@typescript-eslint/recommended`
- `plugin:react/recommended`
- `plugin:react-hooks/recommended`

Notable rules:
- `react/react-in-jsx-scope`: off (React 17+ JSX transform)
- `@typescript-eslint/no-explicit-any`: warn
- `react-hooks/rules-of-hooks`: error
- `react-hooks/exhaustive-deps`: warn

### `.prettierrc` — Prettier

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

---

## Architecture Patterns

### Provider Tree (App.tsx)

The root `App` component composes global providers in a fixed nesting order. Every new app should preserve this skeleton:

```tsx
export default function App() {
  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <LanguageProvider>
          <AuthProvider>
            <AdProvider>
              <ToastProvider>
                <AppNavigator />
              </ToastProvider>
            </AdProvider>
          </AuthProvider>
        </LanguageProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
```

Order matters:
1. **ErrorBoundary** — catches all render errors.
2. **GestureHandlerRootView** — required by react-native-gesture-handler.
3. **LanguageProvider** — i18n must be available to all children.
4. **AuthProvider** — auth state gates navigation.
5. **AdProvider** — ad logic depends on auth state.
6. **ToastProvider** — toasts can appear anywhere.

### Custom Hooks Pattern

Complex logic is extracted into custom hooks under `src/hooks/`. Key examples:

| Hook | Purpose |
|---|---|
| `usePetActions` | Unified handler for animation + reward + state updates on pet actions |
| `useDoubleReward` | Rewarded ad flow with double-coin logic |
| `useResponsive` | Returns current breakpoint and scaling values |
| `useBackButton` | Android hardware back button handler |
| `useSocket` | WebSocket connection lifecycle |
| `useSpriteSheet` | Async sprite sheet loading with cache |

### Service Layer

Stateless services live in `src/services/`:

- **AdService** — AdMob initialization and platform checks.
- **EmojiService** — Emoji asset management.

### Config-Driven Design

Game balance, animation sequences, ad settings, and responsive breakpoints are all defined as configuration objects in `src/config/`:

| File | Contains |
|---|---|
| `gameBalance.ts` | Stat decay rates, activity effects, reward values |
| `actionConfig.ts` | Animation state sequences and durations |
| `ads.config.ts` | AdMob unit IDs, frequency settings |
| `constants.ts` | Global constants |
| `responsive.ts` | Breakpoints (mobile < 480, tablet < 1024, desktop) |
| `spriteSheets.ts` | Sprite sheet definitions and frame maps |

---

## State Management

This project uses **React Context API** exclusively (no Redux/MobX). Each feature domain has its own context:

| Context | Responsibility |
|---|---|
| `AuthContext` | User session, Google OAuth, guest mode |
| `PetContext` | Pet state, stats, actions, persistence |
| `AdContext` | Ad availability, interstitial scheduling |
| `LanguageContext` | Language preference persistence |
| `ToastContext` | Toast notification queue |
| `MuitoContext` | Counting game state |
| `MultiPlayerMuitoContext` | Multiplayer game state via Socket.io |
| `ColorTapContext` | Color tap game state |
| `MemoryMatchContext` | Memory match game state |
| `PetRunnerContext` | Pet runner game state |

### Context Pattern

Each context follows the same structure:

```tsx
// 1. Define types
interface MyState { /* ... */ }
interface MyContextValue extends MyState { /* action methods */ }

// 2. Create context
const MyContext = createContext<MyContextValue | undefined>(undefined);

// 3. Create provider with state + actions
export const MyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<MyState>(initialState);
  // ... actions that call setState
  return <MyContext.Provider value={{ ...state, ...actions }}>{children}</MyContext.Provider>;
};

// 4. Create consumer hook with guard
export const useMy = () => {
  const ctx = useContext(MyContext);
  if (!ctx) throw new Error('useMy must be used within MyProvider');
  return ctx;
};
```

---

## Navigation

Built on **React Navigation** with `@react-navigation/native-stack`.

### Root Navigation Flow

```
Login ──(auth)──> GameSelection ──(pick game)──> GameContainer
                                                      │
                                    ┌─────────────────┼─────────────────┐
                                    │                 │                 │
                              PetGameNavigator  MuitoNavigator  ColorTapNavigator ...
```

- **LoginScreen** — shown when no user session exists.
- **GameSelectionScreen** — grid of registered games.
- **GameContainer** — dynamically wraps the selected game's navigator with its context providers.

### Per-Game Navigators

Each game defines its own stack navigator (e.g., `PetGameNavigator`, `MuitoNavigator`). This isolates game-specific navigation from the root stack.

### Type-Safe Navigation

Navigation types are defined in `src/types/navigation.ts`. Each navigator declares its own param list type for compile-time route safety.

---

## Multi-Game Registry

The **GameRegistry** pattern (`src/registry/GameRegistry.ts`) enables a plugin-like architecture for adding games:

```ts
interface GameDefinition {
  id: string;
  nameKey: string;          // i18n key
  descriptionKey: string;   // i18n key
  emoji: string;
  category: 'pet' | 'puzzle' | 'adventure' | 'casual';
  navigator: React.ComponentType;
  providers: Array<React.ComponentType<{ children: React.ReactNode }>>;
  isEnabled: boolean;
}
```

### Registering a New Game

In `App.tsx`:

```tsx
import { gameRegistry } from './src/registry/GameRegistry';
import { MyProvider } from './src/context/MyContext';
import { MyNavigator } from './src/screens/MyNavigator';

gameRegistry.register({
  id: 'my-game',
  nameKey: 'selectGame.myGame.name',
  descriptionKey: 'selectGame.myGame.description',
  emoji: '🎮',
  category: 'casual',
  navigator: MyNavigator,
  providers: [MyProvider],
  isEnabled: true,
});
```

The `GameContainer` component reads the registry and automatically wraps the navigator with the declared providers.

---

## Internationalization (i18n)

### Setup (`src/i18n.ts`)

- Uses `i18next` + `react-i18next`.
- Auto-detects device language (iOS, Android, Web).
- Falls back to English.
- Translation files live in `src/locales/{lang}.json`.

### Translation File Structure

```json
{
  "common": { "back": "Back", "confirm": "Confirm", "cancel": "Cancel" },
  "menu": { "title": "Menu", "settings": "Settings" },
  "selectGame": {
    "myGame": { "name": "My Game", "description": "A fun game" }
  }
}
```

### Adding a New Language

1. Create `src/locales/{lang}.json` with all keys from `en.json`.
2. Register it in `src/i18n.ts`:

```ts
import newLang from './locales/{lang}.json';

// Add to resources:
resources: {
  en: { translation: en },
  '{lang}': { translation: newLang },
}
```

3. Update device language detection in `getDeviceLanguage()` if needed.

### Usage in Components

```tsx
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  return <Text>{t('common.confirm')}</Text>;
};
```

---

## Authentication

### Supported Modes

| Mode | Platform | Description |
|---|---|---|
| Google OAuth 2.0 | Android, iOS | Full Google Sign-In with user profile |
| Guest | All | No account, data stored locally as `guest` |
| Web fallback | Web | Local-only demo user (no OAuth on web) |

### Setup Requirements

- **Android**: place `google-services.json` in project root.
- **iOS**: place `GoogleService-Info.plist` in project root.
- Configure Web Client ID in `AuthContext.tsx`.

### Auth Flow

1. `AuthProvider` restores persisted session from AsyncStorage on mount.
2. `LoginScreen` offers "Sign in with Google" or "Play as Guest".
3. On success, `AuthContext` stores user info and the navigator switches to the authenticated stack.
4. Pet/game data is isolated by `userId` (or `'guest'`).

---

## Monetization (Ads)

COPPA-compliant ad integration using Google AdMob.

### Ad Types

| Type | Placement | Behavior |
|---|---|---|
| Banner | Bottom of home screen | Always visible |
| Rewarded | Optional button for bonus coins | User-initiated |
| Interstitial | Between screen transitions | Every 4 transitions, min 5 min apart |

### Configuration (`src/config/ads.config.ts`)

- Test ad unit IDs are pre-configured for development.
- Replace with production IDs before release.
- Child-directed settings enabled by default.

### Disabling Ads

To create an ad-free app, remove `AdProvider` from the provider tree in `App.tsx` and delete `src/context/AdContext.tsx`, `src/services/AdService.ts`, and `src/config/ads.config.ts`.

---

## Animation & Graphics

### Reanimated

All animations use `react-native-reanimated` worklets that run on the native UI thread:

- `withSpring` — physics-based spring animations.
- `withTiming` — duration-based transitions.
- `withRepeat` / `withSequence` — looping and chaining.

### Animation States

Defined as a union type in `src/types/types.ts`:

```ts
type AnimationState = 'idle' | 'eating' | 'bathing' | 'happy' | 'sleeping' | 'playing' | 'tired' | 'sick';
```

Animation sequences for each state are configured in `src/config/actionConfig.ts`.

### Sprite System

- Sprite sheets managed by `SpriteSheetManager` (`src/utils/SpriteSheetManager.ts`).
- Configuration in `src/config/spriteSheets.ts`.
- `useSpriteSheet` hook handles async loading with caching.
- `SpriteSheetAnimation` component handles frame sequencing.

### Skia

`@shopify/react-native-skia` is available for advanced 2D graphics (particle effects, custom drawing).

---

## Data Persistence

### Strategy

- **AsyncStorage** for all local data.
- Storage keys are namespaced by `userId` for multi-user isolation.
- Writes are **debounced** (max 1 save per second) via `src/utils/debounce.ts`.
- Data validation on load via `src/utils/validation.ts`.
- Migration support for schema changes via `src/utils/migration.ts`.

### Storage Utility (`src/utils/storage.ts`)

Wraps AsyncStorage with typed get/set helpers and user-scoped key management.

---

## Responsive Design

### Breakpoints (`src/config/responsive.ts`)

| Breakpoint | Width |
|---|---|
| Mobile | < 480px |
| Tablet | 480px – 1024px |
| Desktop | > 1024px |

### Hook

```tsx
const { breakpoint, scale } = useResponsive();
// breakpoint: 'mobile' | 'tablet' | 'desktop'
```

### Platform Handling

- `SafeAreaView` for iOS notches.
- `react-native-web` for browser rendering.
- Dynamic sizing based on `Dimensions.get('window')`.

---

## Testing

### Framework

- **Jest** with `jest-expo` preset.
- **@testing-library/react-native** for component rendering.
- **@testing-library/react-hooks** for hook testing.

### Configuration (`jest.config.js`)

- Transforms all `.ts`/`.tsx`/`.js`/`.jsx` through `babel-jest`.
- `transformIgnorePatterns` whitelist for React Native and Expo packages.
- Path alias `@/*` mapped via `moduleNameMapper`.
- Image imports mapped to `__mocks__/fileMock.js`.
- Coverage collected from `src/` excluding `.d.ts` and `types/`.

### Mock Setup (`jest.setup.js`)

Pre-configured mocks for:
- React Native core components and APIs.
- AsyncStorage.
- Google Sign-In.
- expo-haptics.
- UUID.
- Native modules.

### Writing Tests

Place test files in `__tests__/` directories adjacent to the code they test:

```
src/hooks/usePetActions.ts
src/hooks/__tests__/usePetActions.test.ts
```

### Running Tests

```bash
pnpm test                # Single run
pnpm run test:watch      # Watch mode
pnpm run test:coverage   # With coverage report
pnpm run test:ci         # CI mode (coverage + limited workers)
pnpm run test:e2e        # Maestro E2E tests
```

---

## Code Quality (Lint & Format)

### Lint

```bash
pnpm run lint            # Check for issues
pnpm run lint:fix        # Auto-fix
```

### Format

```bash
pnpm run format          # Auto-format all src files
pnpm run format:check    # Check without writing
```

Both tools target `src/**/*.{ts,tsx}`.

---

## Scripts Reference

| Script | Command | Description |
|---|---|---|
| `start` | `expo start` | Start Expo dev server |
| `android` | `expo start --android` | Run on Android |
| `ios` | `expo start --ios` | Run on iOS |
| `web` | `EXPO_PUBLIC_BUILD_PLATFORM=web expo start --web` | Run on web |
| `test` | `jest` | Run test suite |
| `test:watch` | `jest --watch` | Run tests in watch mode |
| `test:coverage` | `jest --coverage` | Run tests with coverage |
| `test:ci` | `jest --ci --coverage --maxWorkers=2` | CI-optimized test run |
| `test:e2e` | `maestro test e2e/flow.yaml` | Run Maestro E2E tests |
| `lint` | `eslint "src/**/*.{ts,tsx}"` | Lint source files |
| `lint:fix` | `eslint "src/**/*.{ts,tsx}" --fix` | Lint and auto-fix |
| `format` | `prettier --write "src/**/*.{ts,tsx}"` | Format source files |
| `format:check` | `prettier --check "src/**/*.{ts,tsx}"` | Check formatting |

---

## Platform-Specific Considerations

### Web

- `EXPO_PUBLIC_BUILD_PLATFORM=web` must be set to exclude native plugins.
- `metro.config.js` resolves `react-native-web` Platform module and empties native-only packages.
- Google Sign-In falls back to a local demo user on web.
- AdMob is not available on web (module resolved as empty).

### Android

- Requires `google-services.json` for Firebase/Google services.
- Uses `expo-dev-client` for custom dev builds with native modules.
- Hardware back button handled via `useBackButton` hook.
- Haptic feedback via `expo-haptics`.

### iOS

- Requires `GoogleService-Info.plist` for Firebase/Google services.
- `SafeAreaView` handles notch/Dynamic Island.
- `supportsTablet: true` in app config.

---

## Checklist for New Apps

Use this checklist when bootstrapping a new application from this template:

- [ ] Update `package.json` — name, description, version
- [ ] Update `app.config.js` — name, slug, bundleIdentifier, package
- [ ] Replace `assets/` — icon.png, splash.png, adaptive-icon.png, favicon.png
- [ ] Clear game-specific code — remove existing screens, contexts, and game registrations from `App.tsx`
- [ ] Keep the provider skeleton — ErrorBoundary, GestureHandler, Language, Auth, Ad, Toast
- [ ] Update `src/locales/` — replace translation keys with your app's strings
- [ ] Configure auth — add your Google OAuth credentials or remove `AuthProvider` if not needed
- [ ] Configure ads — update ad unit IDs in `src/config/ads.config.ts` or remove `AdProvider` if not needed
- [ ] Register your screens/games — use the GameRegistry or set up direct navigation
- [ ] Update `src/config/` — adjust game balance, constants, and responsive breakpoints
- [ ] Run `pnpm test` — verify the test setup works after your changes
- [ ] Run `pnpm run lint` — ensure code quality passes
- [ ] Update `docs/` — replace documentation with your app's specifics
