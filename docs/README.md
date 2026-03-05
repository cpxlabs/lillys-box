# Lilly's Box - Documentation

Complete documentation for the Lilly's Box pet care game project.

## Quick Navigation

### Getting Started
- [BUILD.md](guides/BUILD.md) - Building for web, Android, iOS
- [RESPONSIVE.md](guides/RESPONSIVE.md) - Responsive design system
- [FOLDER_STRUCTURE.md](guides/FOLDER_STRUCTURE.md) - Project structure

### Authentication & Development
- [AUTHENTICATION.md](technical/AUTHENTICATION.md) - OAuth setup and auth system
- [API_REFERENCE.md](technical/API_REFERENCE.md) - Complete API documentation
- [ACTIONS.md](technical/ACTIONS.md) - Pet actions system (feed, play, bathe, etc.)

### Testing
- [TESTING.md](testing/TESTING.md) - E2E tests (Maestro), game tests, unit tests

### Design System
- [design-system/](design-system/) - UI screens, components, games documentation

---

## Project Overview

**Lilly's Box** is a comprehensive platform of interactive experiences for families and children, available on Android, iOS, and web. Built with React Native/Expo, it combines pet care gameplay with 30+ engaging mini-games.

### Key Features

**Platform Core:**
- 🎮 **30+ diverse mini-games** - Reflexo, memory, puzzle, creative, and more
- 🐱🐶 **Pet care system** - Create, customize, and nurture virtual pets
- 👨‍👩‍👧‍👦 **Family-friendly experiences** - Design for all ages

**Technical Excellence:**
- 🔐 Google OAuth + guest mode with multi-user support
- 🌐 Multi-language support (EN, PT-BR)
- 📱 Per-user data isolation
- 🎨 Responsive design (mobile, tablet, web)
- ⭐ Review system with ratings, comments, images, and GIFs

### Tech Stack

- React Native 0.73 (Expo 50)
- TypeScript 5.1
- Expo Router 3.4 (file-based routing)
- AsyncStorage (local persistence)
- react-native-reanimated 3.6 (animations)
- Google Sign-In OAuth
- Socket.io (multiplayer)
- i18next (translation)
- Jest + React Testing Library (testing)

---

## Directory Structure

```
docs/
├── README.md                    # This file
├── guides/
│   ├── BUILD.md                # Building for all platforms
│   ├── RESPONSIVE.md           # Responsive design guide
│   └── FOLDER_STRUCTURE.md     # Project folder layout
├── technical/
│   ├── AUTHENTICATION.md       # OAuth & auth system
│   ├── API_REFERENCE.md        # Complete API docs
│   └── ACTIONS.md              # Pet actions system
├── testing/
│   └── TESTING.md              # E2E, game, unit tests
├── design-system/
│   └── (23 UI & game docs)
└── (additional docs at root as needed)
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

**...make the app responsive**
→ [RESPONSIVE.md](guides/RESPONSIVE.md)

**...implement a pet action**
→ [ACTIONS.md](technical/ACTIONS.md)

**...write tests**
→ [TESTING.md](testing/TESTING.md)

**...understand the API**
→ [API_REFERENCE.md](technical/API_REFERENCE.md)

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
npm --prefix app run web

# Android development
npm --prefix app run android

# iOS development
npm --prefix app run ios
```

### Building for Deployment

```bash
# Web production
EXPO_PUBLIC_BUILD_PLATFORM=web npx expo export -p web

# Android production
eas build --platform android

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

- **AuthContext** - Global auth state
- **PetContext** - Global pet state (with debounced saves)
- **LanguageContext** - i18n state
- **ToastContext** - Toast notifications
- **GameContexts** - Per-game best scores

### Data Storage

```
AsyncStorage Keys:
├── @pet_care_game:auth_state           (auth info)
├── @pet_care_game:pet:{userId}         (pet data)
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
- 30+ mini-games
- Responsive design
- Comprehensive testing
- Multi-language support
- Performance optimized

---

**Last Updated**: 2026-03-04

**Maintained By**: Lilly's Box Development Team

---

**Need help?** Check the relevant doc or open an issue on GitHub.
