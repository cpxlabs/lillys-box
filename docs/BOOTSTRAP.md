# React Native Template App — Bootstrap Guide

Reference for bootstrapping new React Native apps using the framework, Expo configuration, and npm packages established in this repository.

---

## Table of Contents

1. [Core Framework](#core-framework)
2. [npm Packages](#npm-packages)
3. [Expo Configuration](#expo-configuration)
4. [TypeScript](#typescript)
5. [Babel](#babel)
6. [Metro Bundler](#metro-bundler)
7. [React Navigation](#react-navigation)
8. [State Management (Context API)](#state-management-context-api)
9. [Animations (Reanimated)](#animations-reanimated)
10. [Gestures](#gestures)
11. [Graphics (Skia & SVG)](#graphics-skia--svg)
12. [Internationalization (i18n)](#internationalization-i18n)
13. [Local Storage (AsyncStorage)](#local-storage-asyncstorage)
14. [Authentication (Google Sign-In)](#authentication-google-sign-in)
15. [Ads (Google AdMob)](#ads-google-admob)
16. [Realtime (Socket.io)](#realtime-socketio)
17. [Haptics](#haptics)
18. [Web Support](#web-support)
19. [Testing](#testing)
20. [ESLint](#eslint)
21. [Prettier](#prettier)
22. [Scripts](#scripts)
23. [Platform Notes](#platform-notes)

---

## Core Framework

| Package | Version | Purpose |
|---|---|---|
| `react` | 18.2.0 | UI library |
| `react-native` | 0.73.2 | Native runtime |
| `expo` | ~50.0.0 | Managed workflow, dev tooling, OTA updates |
| `typescript` | ^5.1.3 | Type-safe development (strict mode) |

Expo managed workflow is used — no ejected native projects. Native modules that require custom builds use `expo-dev-client`.

---

## npm Packages

### Production Dependencies

| Package | Version | Category |
|---|---|---|
| `react` | 18.2.0 | Core |
| `react-native` | 0.73.2 | Core |
| `expo` | ~50.0.0 | Core |
| `react-dom` | 18.2.0 | Web |
| `react-native-web` | ~0.19.6 | Web |
| `@expo/metro-runtime` | ~3.1.3 | Web |
| `@react-navigation/native` | ^6.1.9 | Navigation |
| `@react-navigation/native-stack` | ^6.9.17 | Navigation |
| `react-native-screens` | ~3.29.0 | Navigation |
| `react-native-safe-area-context` | 4.8.2 | Navigation / Layout |
| `react-native-reanimated` | ~3.6.1 | Animation |
| `react-native-gesture-handler` | ~2.14.0 | Gestures |
| `@shopify/react-native-skia` | 0.1.221 | 2D graphics |
| `react-native-svg` | 14.1.0 | SVG rendering |
| `@react-native-async-storage/async-storage` | 1.21.0 | Local storage |
| `@react-native-google-signin/google-signin` | ^16.1.1 | Authentication |
| `react-native-google-mobile-ads` | ^16.0.1 | Monetization |
| `i18next` | ^25.7.4 | Internationalization |
| `react-i18next` | ^16.5.3 | i18n React bindings |
| `socket.io-client` | ^4.8.0 | WebSocket / realtime |
| `expo-haptics` | ^15.0.8 | Haptic feedback |
| `expo-dev-client` | ^6.0.20 | Custom native dev builds |
| `react-native-webview` | ^13.16.0 | Embedded web views |
| `react-native-get-random-values` | ^2.0.0 | Crypto polyfill (required by uuid) |
| `uuid` | ^9.0.0 | Unique ID generation |
| `@expo/vector-icons` | ^14.1.0 | Icon sets |
| `@react-native/assets-registry` | ^0.83.1 | Asset resolution |
| `@babel/runtime` | ^7.28.4 | Babel polyfills |

### Dev Dependencies

| Package | Version | Category |
|---|---|---|
| `typescript` | ^5.1.3 | Language |
| `@babel/core` | ^7.20.0 | Build |
| `@babel/preset-flow` | ^7.27.1 | Build |
| `babel-jest` | ^30.2.0 | Test transform |
| `jest` | ^30.2.0 | Test runner |
| `jest-expo` | 50.0.0 | Test preset |
| `@testing-library/react-native` | ^13.3.3 | Component testing |
| `@testing-library/react-hooks` | ^8.0.1 | Hook testing |
| `react-test-renderer` | ^18.2.0 | Render testing |
| `ts-jest` | ^29.4.6 | TS transform |
| `@types/jest` | ^30.0.0 | Types |
| `@types/node` | ^25.0.9 | Types |
| `@types/react` | ~18.2.45 | Types |
| `@types/uuid` | ^9.0.0 | Types |
| `eslint` | ^9.39.2 | Linting |
| `@eslint/js` | ^9.39.2 | Linting |
| `@typescript-eslint/eslint-plugin` | ^8.53.0 | Linting |
| `@typescript-eslint/parser` | ^8.53.0 | Linting |
| `eslint-plugin-react` | ^7.37.5 | Linting |
| `eslint-plugin-react-hooks` | ^7.0.1 | Linting |
| `prettier` | ^3.8.0 | Formatting |

---

## Expo Configuration

`app.config.js` uses a dynamic function to conditionally include native-only plugins:

```js
module.exports = () => {
  const isWebBuild = process.env.EXPO_PUBLIC_BUILD_PLATFORM === 'web';

  const plugins = isWebBuild ? [] : [
    "@react-native-google-signin/google-signin"
    // For production, also add:
    // ["react-native-google-mobile-ads", {
    //   androidAppId: "ca-app-pub-xxx",
    //   iosAppId: "ca-app-pub-xxx"
    // }]
  ];

  return {
    expo: {
      name: "App Name",
      slug: "app-slug",
      version: "1.0.0",
      orientation: "portrait",
      icon: "./assets/icon.png",
      userInterfaceStyle: "light",
      splash: {
        image: "./assets/splash.png",
        resizeMode: "contain",
        backgroundColor: "#ffffff"
      },
      assetBundlePatterns: ["**/*"],
      ios: {
        supportsTablet: true,
        bundleIdentifier: "com.yourorg.yourapp",
        googleServicesFile: "./GoogleService-Info.plist"
      },
      android: {
        adaptiveIcon: {
          foregroundImage: "./assets/adaptive-icon.png",
          backgroundColor: "#ffffff"
        },
        package: "com.yourorg.yourapp",
        googleServicesFile: "./google-services.json"
      },
      web: { favicon: "./assets/favicon.png" },
      plugins
    }
  };
};
```

Key points:
- Native-only plugins (Google Sign-In, AdMob) are excluded when `EXPO_PUBLIC_BUILD_PLATFORM=web`.
- `expo-dev-client` is used for custom dev builds that include native modules.
- Google services config files are required for mobile auth/ads.

---

## TypeScript

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }
  },
  "include": ["**/*.ts", "**/*.tsx"]
}
```

- **Strict mode** is enabled.
- **Path alias** `@/*` maps to `src/*` — must also be configured in `jest.config.js` and `babel.config.js` if used.
- Extends Expo's base TS config for React Native compatibility.

---

## Babel

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { flow: false }],
      '@babel/preset-flow',
    ],
    plugins: ['react-native-reanimated/plugin'],  // MUST be last
  };
};
```

- `babel-preset-expo` handles React Native + JSX transform.
- `@babel/preset-flow` for Flow-typed third-party code.
- **`react-native-reanimated/plugin` must always be the last plugin** in the list.

---

## Metro Bundler

```js
const { getDefaultConfig } = require('expo/metro-config');
const config = getDefaultConfig(__dirname);

config.resolver.sourceExts = [...config.resolver.sourceExts, 'tsx', 'ts'];

config.resolver.resolveRequest = (context, moduleName, platform) => {
  const originalResolveRequest = context.resolveRequest;

  if (platform === 'web') {
    // Resolve RN Platform module to web equivalent
    if (moduleName.includes('../Utilities/Platform')) {
      return {
        type: 'sourceFile',
        filePath: require.resolve('react-native-web/dist/exports/Platform'),
      };
    }
    // Empty-resolve native-only modules on web
    if (moduleName === 'react-native-google-mobile-ads') {
      return { type: 'empty' };
    }
  }

  return originalResolveRequest(context, moduleName, platform);
};

module.exports = config;
```

Use the `resolveRequest` hook to:
- Map native modules to their web equivalents.
- Return `{ type: 'empty' }` for packages that have no web support.

---

## React Navigation

Packages: `@react-navigation/native`, `@react-navigation/native-stack`, `react-native-screens`, `react-native-safe-area-context`.

### Setup

Wrap the app in `NavigationContainer` and define stacks with `createNativeStackNavigator`:

```tsx
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Details" component={DetailsScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);
```

### Type-Safe Routes

Define param list types for compile-time route safety:

```ts
type RootStackParamList = {
  Home: undefined;
  Details: { id: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();
```

---

## State Management (Context API)

No external state library is used. Each feature domain has its own React Context:

```tsx
// 1. Types
interface MyState { count: number }
interface MyContextValue extends MyState { increment: () => void }

// 2. Context
const MyContext = createContext<MyContextValue | undefined>(undefined);

// 3. Provider
export const MyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [count, setCount] = useState(0);
  const increment = () => setCount((c) => c + 1);
  return <MyContext.Provider value={{ count, increment }}>{children}</MyContext.Provider>;
};

// 4. Consumer hook with guard
export const useMy = () => {
  const ctx = useContext(MyContext);
  if (!ctx) throw new Error('useMy must be used within MyProvider');
  return ctx;
};
```

### Provider Composition

Providers are nested in `App.tsx` in dependency order:

```tsx
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
```

Order matters — outer providers are available to inner ones.

---

## Animations (Reanimated)

Package: `react-native-reanimated` ~3.6.1

Animations run on the native UI thread via worklets.

### Key APIs

| API | Use |
|---|---|
| `useSharedValue` | Mutable value on UI thread |
| `useAnimatedStyle` | Derives animated styles from shared values |
| `withSpring(target, config)` | Physics-based spring animation |
| `withTiming(target, config)` | Duration-based animation |
| `withRepeat(animation, count)` | Loop an animation |
| `withSequence(a, b, c)` | Chain animations in order |
| `withDelay(ms, animation)` | Delay before starting |

### Example

```tsx
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

const scale = useSharedValue(1);
const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ scale: scale.value }],
}));

// Trigger:
scale.value = withSpring(1.2);

return <Animated.View style={animatedStyle} />;
```

### Setup Reminder

- Babel plugin (`react-native-reanimated/plugin`) must be **last** in `babel.config.js`.
- `GestureHandlerRootView` must wrap the app root.

---

## Gestures

Package: `react-native-gesture-handler` ~2.14.0

- `GestureHandlerRootView` must wrap the entire app.
- Provides `Pan`, `Tap`, `LongPress`, `Pinch`, `Rotation` gesture handlers.
- Works with Reanimated for gesture-driven animations.

---

## Graphics (Skia & SVG)

| Package | Use |
|---|---|
| `@shopify/react-native-skia` 0.1.221 | High-performance 2D canvas (particle effects, custom drawing) |
| `react-native-svg` 14.1.0 | SVG rendering (icons, shapes, vector art) |

---

## Internationalization (i18n)

Packages: `i18next` ^25.7.4, `react-i18next` ^16.5.3

### Initialization

```ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import ptBR from './locales/pt-BR.json';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    'pt-BR': { translation: ptBR },
  },
  lng: 'en',           // or auto-detect from device
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  compatibilityJSON: 'v4',
});
```

### Device Language Detection

```ts
import { Platform, NativeModules } from 'react-native';

const getDeviceLanguage = () => {
  if (Platform.OS === 'ios') {
    return NativeModules.SettingsManager?.settings?.AppleLocale || 'en';
  } else if (Platform.OS === 'android') {
    return NativeModules.I18nManager?.localeIdentifier || 'en';
  }
  return navigator.language || 'en';  // web
};
```

### Usage

```tsx
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  return <Text>{t('common.confirm')}</Text>;
};
```

### Adding a Language

1. Create `src/locales/{lang}.json` with the same keys as `en.json`.
2. Import and add it to the `resources` object in the i18n init.

---

## Local Storage (AsyncStorage)

Package: `@react-native-async-storage/async-storage` 1.21.0

```ts
import AsyncStorage from '@react-native-async-storage/async-storage';

// Write
await AsyncStorage.setItem('key', JSON.stringify(data));

// Read
const raw = await AsyncStorage.getItem('key');
const data = raw ? JSON.parse(raw) : null;

// Delete
await AsyncStorage.removeItem('key');
```

Tips:
- Namespace keys by user ID for multi-user isolation.
- Debounce frequent writes to avoid performance issues.
- Validate data on read to handle schema changes.

---

## Authentication (Google Sign-In)

Package: `@react-native-google-signin/google-signin` ^16.1.1

- **Android**: requires `google-services.json` in project root.
- **iOS**: requires `GoogleService-Info.plist` in project root.
- **Web**: not supported — use a fallback (guest mode or web OAuth).
- Must be listed as an Expo plugin in `app.config.js` for native builds.
- Excluded from web builds via the `EXPO_PUBLIC_BUILD_PLATFORM` check.

---

## Ads (Google AdMob)

Package: `react-native-google-mobile-ads` ^16.0.1

- Supports banner, rewarded, and interstitial ad formats.
- COPPA-compliant child-directed settings available.
- Test ad unit IDs available for development.
- Not available on web — resolve as empty module in `metro.config.js`.
- Requires `expo-dev-client` for custom native builds.

---

## Realtime (Socket.io)

Package: `socket.io-client` ^4.8.0

```ts
import { io } from 'socket.io-client';

const socket = io('https://your-server.com');
socket.on('connect', () => { /* connected */ });
socket.on('event-name', (data) => { /* handle */ });
socket.emit('event-name', payload);
socket.disconnect();
```

Wrap connection lifecycle in a custom hook for clean mount/unmount handling.

---

## Haptics

Package: `expo-haptics` ^15.0.8

```ts
import * as Haptics from 'expo-haptics';

Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
```

No-op on web — safe to call on all platforms.

---

## Web Support

Package: `react-native-web` ~0.19.6, `@expo/metro-runtime` ~3.1.3

### Running

```bash
EXPO_PUBLIC_BUILD_PLATFORM=web expo start --web
```

### Metro Overrides

Native-only modules must be handled in `metro.config.js`:
- Map `react-native` Platform to `react-native-web` equivalent.
- Return `{ type: 'empty' }` for packages without web support (e.g., `react-native-google-mobile-ads`).

### Expo Config

Exclude native-only plugins from `app.config.js` when `EXPO_PUBLIC_BUILD_PLATFORM === 'web'`.

---

## Testing

### Packages

| Package | Purpose |
|---|---|
| `jest` ^30.2.0 | Test runner |
| `jest-expo` 50.0.0 | Expo-aware Jest preset |
| `babel-jest` ^30.2.0 | Transform JS/TS for Jest |
| `@testing-library/react-native` ^13.3.3 | Component rendering & queries |
| `@testing-library/react-hooks` ^8.0.1 | Hook testing utilities |
| `react-test-renderer` ^18.2.0 | Render tree snapshots |
| `ts-jest` ^29.4.6 | TypeScript transform |

### Jest Configuration

```js
module.exports = {
  preset: 'jest-expo',
  setupFiles: ['<rootDir>/jest.setup.js'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/types/**/*',
  ],
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!.*((jest-)?react-native|@react-native(-community)?|'
    + '@react-native/.*|expo(nent)?|@expo(nent)?/.*|react-navigation|'
    + '@react-navigation/.*|@unimodules/.*|unimodules|react-native-svg|'
    + 'react-native-reanimated|react-native-gesture-handler|'
    + 'react-native-safe-area-context|react-native-screens|'
    + 'react-native-get-random-values|react-native-google-mobile-ads|'
    + 'uuid|@shopify/react-native-skia|expo-haptics|expo-constants))',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/fileMock.js',
  },
};
```

Key details:
- `transformIgnorePatterns` whitelists React Native and Expo packages that ship un-transpiled ESM.
- `moduleNameMapper` mirrors the `@/*` path alias and stubs image imports.
- Coverage excludes `.d.ts` files and the `types/` directory.

### Mock Setup (`jest.setup.js`)

Pre-configure mocks for native modules that don't run in Node:
- React Native core (View, Text, ScrollView, FlatList, etc.)
- AsyncStorage
- Google Sign-In
- expo-haptics
- uuid
- Any native module your app uses

### Test File Convention

Place tests in `__tests__/` directories next to the source:

```
src/hooks/useMyHook.ts
src/hooks/__tests__/useMyHook.test.ts
```

---

## ESLint

```js
module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'react', 'react-hooks'],
  rules: {
    'react/react-in-jsx-scope': 'off',        // React 17+ JSX transform
    'react/prop-types': 'off',                 // Using TypeScript
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
  settings: { react: { version: 'detect' } },
  env: { browser: true, es2021: true, node: true },
};
```

---

## Prettier

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

---

## Scripts

| Script | Command | Description |
|---|---|---|
| `start` | `expo start` | Start Expo dev server |
| `android` | `expo start --android` | Run on Android |
| `ios` | `expo start --ios` | Run on iOS |
| `web` | `EXPO_PUBLIC_BUILD_PLATFORM=web expo start --web` | Run on web |
| `test` | `jest` | Run test suite |
| `test:watch` | `jest --watch` | Watch mode |
| `test:coverage` | `jest --coverage` | With coverage report |
| `test:ci` | `jest --ci --coverage --maxWorkers=2` | CI-optimized |
| `test:e2e` | `maestro test e2e/flow.yaml` | Maestro E2E tests |
| `lint` | `eslint "src/**/*.{ts,tsx}"` | Lint source files |
| `lint:fix` | `eslint "src/**/*.{ts,tsx}" --fix` | Lint and auto-fix |
| `format` | `prettier --write "src/**/*.{ts,tsx}"` | Format source files |
| `format:check` | `prettier --check "src/**/*.{ts,tsx}"` | Check formatting |

---

## Platform Notes

### Android
- Requires `google-services.json` for Firebase/Google services.
- Uses `expo-dev-client` for custom dev builds with native modules.
- Hardware back button handling via `BackHandler` from `react-native`.
- Haptic feedback via `expo-haptics`.

### iOS
- Requires `GoogleService-Info.plist` for Firebase/Google services.
- `SafeAreaView` (from `react-native-safe-area-context`) for notch/Dynamic Island.
- `supportsTablet: true` in Expo config to enable iPad.

### Web
- Set `EXPO_PUBLIC_BUILD_PLATFORM=web` to exclude native plugins.
- `metro.config.js` must resolve `react-native-web` Platform and empty-resolve native-only packages.
- Google Sign-In and AdMob are not available — implement fallbacks.
- `expo-haptics` is a safe no-op on web.
