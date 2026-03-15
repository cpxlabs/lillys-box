# Lilly's Box - Documentation

Complete documentation for the Lilly's Box project.

## Quick Navigation

### Getting Started
- [BUILD.md](guides/BUILD.md) - Building for web, Android, iOS
- [NAVIGATION.md](guides/NAVIGATION.md) - Navigation flow and troubleshooting
- [RESPONSIVE.md](guides/RESPONSIVE.md) - Responsive design system
- [FOLDER_STRUCTURE.md](guides/FOLDER_STRUCTURE.md) - Project structure
- [LOAD_ROMS.md](guides/LOAD_ROMS.md) - Loading games in GBA Emulator

### Authentication & Development
- [AUTHENTICATION.md](technical/AUTHENTICATION.md) - OAuth setup and auth system
- [API_REFERENCE.md](technical/API_REFERENCE.md) - Complete API documentation
- [ACTIONS.md](technical/ACTIONS.md) - Pet actions system (feed, play, bathe, etc.)
- [EMULATOR.md](technical/EMULATOR.md) - Phased plan for a GBA-style emulator experience

### Testing
- [TESTING.md](testing/TESTING.md) - E2E tests (Maestro), game tests, unit tests

### Games System
- [GAMES_SYSTEM_UPGRADE.md](GAMES_SYSTEM_UPGRADE.md) - Complete game architecture, creation guide, and tooling
- [GAMES_ARCHITECTURE.md](GAMES_ARCHITECTURE.md) - Visual architecture diagrams

### Design System
- [design-system/](design-system/) - UI screens, components, games documentation

---

## Project Overview

**Lilly's Box** is a comprehensive platform of interactive experiences for families and children, available on Android, iOS, and web. Built with React Native/Expo, it features 36 mini-games alongside virtual pet interactions.

### Key Features

**Platform Core:**
- 🎮 **36 diverse mini-games** - Reflexo, memory, puzzle, creative, and more
- 🐱🐶 **Pet care system** - Create, customize, and nurture virtual pets
- 👨‍👩‍👧‍👦 **Family-friendly experiences** - Design for all ages

**Technical Excellence:**
- 🔐 Google OAuth + guest mode with multi-user support
- 🌐 Multi-language support (EN, PT-BR)
- 📱 Per-user data isolation
- 🎨 Responsive design (mobile, tablet, web)
- ⭐ Review system with ratings, comments, images, and GIFs

### Tech Stack

- React Native 0.77 (Expo 55)
- TypeScript 5.1
- Expo Router (file-based routing)
- AsyncStorage (local persistence)
- react-native-reanimated 4.2 (animations)
- Google Sign-In OAuth
- Socket.io (multiplayer)
- i18next (translation)
- Jest + React Testing Library (testing)

---

## Directory Structure

```
docs/
├── README.md                    # This file
├── GAMES_SYSTEM_UPGRADE.md      # Full game system reference
├── GAMES_ARCHITECTURE.md        # Games architecture diagrams
├── RALPH_LOOPS.md               # AI coding loops guide
├── guides/
│   ├── BUILD.md                # Building for all platforms
│   ├── NAVIGATION.md           # Navigation flow and troubleshooting
│   ├── RESPONSIVE.md           # Responsive design guide
│   ├── LOAD_ROMS.md            # Loading games in GBA emulator
│   └── FOLDER_STRUCTURE.md     # Project folder layout
├── technical/
│   ├── AUTHENTICATION.md       # OAuth & auth system
│   ├── API_REFERENCE.md        # Complete API docs
│   ├── ACTIONS.md              # Pet actions system
│   ├── EMULATOR.md             # GBA emulator proposal
│   └── CODE_REVIEW.md          # Engineering review & roadmap
├── testing/
│   └── TESTING.md              # E2E, game, unit tests
├── design-system/
│   └── (23 UI & game docs)
```

---

## Common Tasks

### I want to...

**...set up Google OAuth**
→ [AUTHENTICATION.md](technical/AUTHENTICATION.md#setup-for-users)

**...understand the codebase**
→ [FOLDER_STRUCTURE.md](guides/FOLDER_STRUCTURE.md)

**...build the app for web/Android/iOS**
→ [BUILD.md](guides/BUILD.md)

**...debug navigation or back-button issues**
→ [NAVIGATION.md](guides/NAVIGATION.md)

**...make the app responsive**
→ [RESPONSIVE.md](guides/RESPONSIVE.md)

**...implement a pet action**
→ [ACTIONS.md](technical/ACTIONS.md)

**...write tests**
→ [TESTING.md](testing/TESTING.md)

**...understand the API**
→ [API_REFERENCE.md](technical/API_REFERENCE.md)

**...evaluate the GBA emulator proposal**
→ [EMULATOR.md](technical/EMULATOR.md)

**...load ROMs into the GBA emulator**
→ [LOAD_ROMS.md](guides/LOAD_ROMS.md)

**...create a new game**
→ [GAMES_SYSTEM_UPGRADE.md](GAMES_SYSTEM_UPGRADE.md)

---

## Key Concepts

### Authentication Flow

```
User Opens App
    ↓
LoginScreen (Sign in with Google or Guest)
    ↓
AuthProvider manages state globally
    ↓
[Authenticated User] OR [Guest User]
    ↓
MenuScreen → Game Screens
    ↓
Data isolated per userId
```

### Pet Actions System

All pet interactions (feed, play, bathe, etc.) unified through `usePetActions` hook:
- Validates pet state
- Manages animations
- Calculates rewards
- Updates stats
- Persists data

See [ACTIONS.md](technical/ACTIONS.md) for details.

### Responsive Design

Single source of truth for sizing:

```typescript
const { fs, spacing, wp, hp } = useResponsive();

// Font size (auto-scales)
fontSize: fs(16)

// Padding (auto-scales)
padding: spacing(16)

// Width/height percentages
width: wp(90)
height: hp(50)
```

See [RESPONSIVE.md](guides/RESPONSIVE.md) for details.

---

## Development Workflows

### Local Development

```bash
# Web development
pnpm web

# Android development
pnpm android

# iOS development
pnpm ios
```

### Building for Deployment

```bash
# Web production
EXPO_PUBLIC_BUILD_PLATFORM=web npx expo export --platform web

# Android installable APK
cd app && npx eas-cli build --platform android --profile preview

# Android Play Store bundle
cd app && npx eas-cli build --platform android --profile production

# iOS production
eas build --platform ios
```

### Testing

```bash
# Unit & game tests
npm test

# E2E tests
maestro test e2e/flow.yaml

# With coverage
npm test -- --coverage
```

---

## Code Examples

### Using Authentication

```typescript
import { useAuth } from '../context/AuthContext';

const MyComponent = () => {
  const { user, isAuthenticated, signIn, signOut } = useAuth();

  return (
    <>
      {isAuthenticated ? (
        <Text>Welcome, {user?.name}</Text>
      ) : (
        <Text>Guest Mode</Text>
      )}
    </>
  );
};
```

### Performing Pet Actions

```typescript
import { usePetActions } from '../hooks/usePetActions';

const FeedScene = () => {
  const { performAction, isAnimating } = usePetActions();

  return (
    <Button
      onPress={() => performAction('feed')}
      disabled={isAnimating}
    >
      Feed Pet
    </Button>
  );
};
```

### Responsive Design

```typescript
import { useResponsive } from '../hooks/useResponsive';

const MyScreen = () => {
  const { fs, spacing, wp, deviceType } = useResponsive();

  const petSize = {
    mobile: 280,
    mobileLarge: 320,
    tablet: 380,
    desktop: 450,
  }[deviceType];

  return (
    <View style={{ padding: spacing(16) }}>
      <Text style={{ fontSize: fs(20) }}>Title</Text>
      <PetRenderer size={petSize} />
    </View>
  );
};
```

---

## Architecture

### State Management

- **AdContext** - Advertisement state
- **AuthContext** - Global auth state
- **PetContext** - Global pet state (with debounced saves)
- **LanguageContext** - i18n state
- **ToastContext** - Toast notifications
- **GameContexts** - Per-game state and best scores (36 registered game contexts, 20 additional unregistered)

### Data Storage

```
AsyncStorage Keys:
├── @lillys_box:auth_state              (auth info)
├── @lillys_box:pet:{userId}            (pet data)
├── @color_tap:bestScore:{userId}       (game scores)
└── ... (one per game)
```

### File Organization

```
src/
├── components/        # Reusable UI components
├── screens/          # Full-screen components
├── context/          # State management (Context API)
├── hooks/            # Custom React hooks
├── services/         # Business logic & APIs
├── utils/            # Helper functions
├── config/           # App configuration
├── data/             # Static data
├── types/            # TypeScript definitions
└── locales/          # Translations (EN, PT-BR)
```

---

## Testing Strategy

| Level | Tool | Purpose |
|-------|------|---------|
| E2E | Maestro | Full user flows |
| Integration | Jest + RTL | Screen logic |
| Unit | Jest | Utils, hooks |

See [TESTING.md](testing/TESTING.md) for complete guide.

---

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for:
- Code style guide
- PR process
- Branch naming
- Commit message format

---

## Troubleshooting

### Common Issues

**Build error: "Cannot find module '@react-native-google-signin'"**
- For web: Set `EXPO_PUBLIC_BUILD_PLATFORM=web`
- See [BUILD.md](guides/BUILD.md#troubleshooting-web)

**Auth not working**
- Check OAuth credentials in `app.config.js`
- Verify `google-services.json` / `GoogleService-Info.plist` placement
- See [AUTHENTICATION.md](technical/AUTHENTICATION.md#troubleshooting)

**Responsive design not working**
- Ensure using `fs()`, `spacing()`, etc. functions
- Not using hardcoded pixels
- See [RESPONSIVE.md](guides/RESPONSIVE.md#troubleshooting)

**Tests failing**
- Clear Jest cache: `jest --clearCache`
- Check AsyncStorage mocks
- See [TESTING.md](testing/TESTING.md)

**Back button or game navigation not working**
- Check [NAVIGATION.md](guides/NAVIGATION.md) for `useGameBack`, direct-link fallback behavior, and web-specific troubleshooting

---

## Resources

- **Expo Docs**: https://docs.expo.dev/
- **React Native Docs**: https://reactnative.dev/
- **TypeScript Docs**: https://www.typescriptlang.org/docs/
- **Jest Docs**: https://jestjs.io/
- **Maestro Docs**: https://maestro.mobile.dev/

---

## Status

✅ **Production Ready**

- Multi-platform support (Android, iOS, Web)
- OAuth authentication with fallback
- 36 mini-games
- Responsive design
- Comprehensive testing
- Multi-language support
- Performance optimized

---

**Last Updated**: 2026-03-14

**Maintained By**: Lilly's Box Development Team

---

**Need help?** Check the relevant doc or open an issue on GitHub.
