# Pet Care Game - Claude Code Instructions

## Project Overview

This is a 2D pet care game built with **React Native/Expo** and **TypeScript** for Android and web. Children can create and care for virtual pets (cats or dogs) through various interactive activities.

**Tech Stack:**
- React Native 0.73.2 (Expo ~50.0.0)
- TypeScript 5.1.3
- React Navigation 6.x
- React Native Reanimated 3.6.1 (animations)
- AsyncStorage (data persistence)
- i18next (internationalization - English & Portuguese BR)
- Google AdMob (monetization with COPPA compliance)
- Jest & React Testing Library (tests)

## Project Structure

```
pet-care-game/
├── src/
│   ├── screens/           # Navigation screens (HomeScreen, FeedScene, BathScene, etc.)
│   ├── components/        # Reusable UI components (PetRenderer, StatusBar, buttons, etc.)
│   ├── context/           # React Context (PetContext for pet state)
│   ├── hooks/             # Custom hooks (usePetActions, useAsyncStorage, etc.)
│   ├── utils/             # Utility functions (petStats, validation, debounce, etc.)
│   ├── data/              # Static data (foodItems.ts, clothing configs, etc.)
│   ├── config/            # Configuration files (ads.config.ts, constants.ts, etc.)
│   ├── locales/           # i18n translation files (en.json, pt-BR.json)
│   ├── types.ts           # TypeScript type definitions
│   ├── i18n.ts            # i18next setup
│   └── App.tsx            # Root component
├── assets/                # Images, sprites, fonts
├── docs/                  # Documentation
│   ├── ROADMAP.md         # Feature roadmap (70+ pending tasks)
│   ├── CODE_REVIEW_REFACTORING.md  # Magic number refactoring (Phase 2 pending)
│   ├── IMPLEMENTATION_PLAN.md       # Infrastructure tasks
│   └── TEST_IMPLEMENTATION_PLAN.md  # Testing setup details
├── jest.config.js         # Jest testing configuration
├── .eslintrc.js          # ESLint configuration
├── .prettierrc            # Prettier formatting configuration
└── package.json           # Dependencies and scripts
```

## Running the Project

```bash
# Install dependencies
pnpm install

# Start dev server
npm start

# Run on specific platform
npm run android          # Android emulator/device
npm run ios             # iOS simulator/device
npm run web             # Web browser

# Testing
npm test                # Run all tests
npm test:watch         # Watch mode
npm test:coverage      # Coverage report

# Code quality
npm run lint            # Run ESLint
npm run lint:fix        # Fix ESLint issues
npm run format          # Format with Prettier
npm run format:check    # Check formatting
```

## Key Architectural Patterns

### 1. State Management
- **PetContext** (`src/context/PetContext.tsx`): Central pet state management
- Stores pet data (name, hunger, tiredness, hygiene, mood, clothes, wardrobe, age, coin/money)
- Handles async storage persistence with debouncing
- Auto-saves pet state every 30 seconds

### 2. Custom Hooks
- **usePetActions**: Wraps pet state mutations and animations (feed, bath, play, sleep, vet)
- **useAsyncStorage**: Simplified AsyncStorage access
- **useAnimation**: Animation orchestration with Reanimated

### 3. UI Components
- Most components use TypeScript with explicit prop types
- Accessibility labels required on interactive elements
- Responsive design using viewport dimensions

### 4. Animations
- React Native Reanimated for smooth animations
- Gesture handling with react-native-gesture-handler
- Scene-specific animations (feeding, bathing, playing, sleeping)

### 5. Activity Scenes
Each activity is a full-screen scene with:
- Animation state management
- Gesture/touch detection
- Stat updates with rewards
- Optional ad viewing for bonus coins

**Migrated to usePetActions hook:** Feed, Play (cleaner pattern)
**Not migrated:** Vet (custom payment logic is better left in-place)

## Code Quality Standards

### TypeScript
- Strict mode enabled
- Explicit return types on functions
- Avoid `any` types
- Use discriminated unions for complex states

### React/React Native
- Functional components only
- Use hooks for state and side effects
- Memoize expensive calculations with `useMemo()`
- Memoize callbacks with `useCallback()`
- Use `React.memo()` for expensive components

### Formatting & Linting
- **Prettier**: Enforced formatting (2 spaces, semicolons)
- **ESLint**: React and TypeScript rules enabled
- Run `npm run format` before commits

### Testing
- Jest tests in `__tests__` folders
- React Testing Library for component testing
- Focus on critical logic (hooks, utils, complex components)
- Target >60% coverage on utils

## Important Files & Patterns

### Constants & Configuration
- **`src/config/constants.ts`**: Game balance constants (stat changes, timings, etc.)
- **`src/config/ads.config.ts`**: AdMob IDs and settings (currently using test IDs)
- Magic number refactoring in progress (Phase 2 of CODE_REVIEW_REFACTORING.md)

### Data Files
- **`src/data/foodItems.ts`**: Food definitions with coin rewards
- **`src/data/clothingConfig.ts`**: Pet wardrobe items
- **`src/data/backgroundConfig.ts`**: Background themes

### Localization
- All user-facing strings in locale files (`src/locales/`)
- Use `useTranslation()` hook in components
- Key structure: `'section.key'` (e.g., `'home.money'`, `'feed.title'`)

### Storage
- AsyncStorage keys: `pet_state`, `language_preference`
- Data structure: Serialized pet object
- Auto-save enabled (debounced every 30s)

## Pending Tasks & Known Issues

### High Priority (🔴)
1. **Add Sounds & Audio** - Integrate audio effects for pet actions
2. **Performance Optimization** - Image caching, React.memo, memoization
3. **Production Prep** - Replace AdMob test IDs with production IDs
4. **Play Store Submission** - App signing, store listing, etc.

### Medium Priority (🟡)
1. **Phase 2 Refactoring** - Replace 45 remaining magic numbers (BathScene, SleepScene, etc.)
2. **Infrastructure Setup** - Error boundaries, input validation, ESLint/Prettier full setup
3. **Testing** - Fix jest-expo version mismatch (environment instability)
4. **Mini-games** - Catch ball game, memory games, puzzle games

### Known Issues
- ⚠️ jest-expo version conflicts (71/72 tests passing)
- Skia implementation was reverted (deprecated - consider removing @shopify/react-native-skia dependency)

### Completed Recently
- ✅ Skia bubble bath implementation reverted to React Native Reanimated
- ✅ Phase 1 refactoring (24 magic numbers eliminated)
- ✅ Action scenes migration to usePetActions hook
- ✅ Food system economy rebalance
- ✅ Responsive design improvements
- ✅ i18n support (English & Portuguese BR)
- ✅ AdMob integration with COPPA compliance

## Git & Development Workflow

### Branch Naming
- Feature branches: `feature/description`
- Bug fixes: `fix/description`
- Claude Code branches: `claude/description-SESSION_ID`

### Commits
- Clear, descriptive commit messages
- Reference related issues if applicable
- Keep commits focused and atomic

### Current Branch
Development happens on: `claude/review-docs-pending-tasks-E8ZEJ`

## Security & Compliance

### COPPA Compliance (Children's Privacy)
- All ads marked as child-directed
- No personalized ads
- No data collection
- Only G-rated content in ad network

### Type Safety
- Strict TypeScript throughout
- Explicit error handling at boundaries
- No implicit any types

## Common Tasks

### Adding a New Feature
1. Create feature branch from main
2. Update types in `src/types.ts` if needed
3. Add new components to `src/components/`
4. Add new screens to `src/screens/` if navigation needed
5. Update locale files in `src/locales/`
6. Write tests in `__tests__/`
7. Run linting and formatting: `npm run lint:fix && npm run format`
8. Test on Android emulator: `npm run android`
9. Create PR with clear description

### Refactoring Code
1. Never change logic, only structure
2. Run full test suite: `npm test`
3. Verify visually on device
4. Update docs if patterns change

### Fixing Bugs
1. Create test that reproduces bug
2. Fix the bug
3. Ensure test passes
4. Run full test suite
5. Manual testing on device

### Adding Translations
1. Add key-value pair to `src/locales/en.json`
2. Add translation to `src/locales/pt-BR.json`
3. Use in component: `const { t } = useTranslation(); t('section.key')`
4. Test with language switcher

## Resources

- **React Native Docs**: https://reactnative.dev
- **Expo Docs**: https://docs.expo.dev
- **React Navigation**: https://reactnavigation.org
- **Reanimated**: https://docs.swmansion.com/react-native-reanimated
- **i18next**: https://www.i18next.com
- **Jest**: https://jestjs.io

## Need Help?

- Check `/help` for Claude Code documentation
- Review existing documentation in `docs/` folder
- Check git history for similar implementations
- Run tests frequently during development
