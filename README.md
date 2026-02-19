# Pet Care Game

A 2D children's game for Android using React Native, where kids can create and care for virtual pets (cats or dogs).

## Features

- Create pets (cat or dog) with custom name and gender
- Age system (starts at 1 year, +1 per week, max 19)
- Feed, bathe, play with, and put your pet to sleep
- Visit the vet for health restoration
- Wardrobe with clothing and accessories
- Coin system with optional rewarded ads
- Multi-language support (English and Brazilian Portuguese)
- Google OAuth authentication + guest mode
- Multi-game platform with Game Registry and game selection screen
- 12 mini-games: Pet Care, Muito (counting), Color Tap, Memory Match, Pet Runner, Simon Says, Dress Up Relay, Color Mixer, Feed the Pet, Whack-a-Mole, Catch the Ball, Sliding Puzzle

## Quick Start

```bash
pnpm install
npx expo start
```

## Tech Stack

- React Native (Expo) + TypeScript
- React Navigation
- AsyncStorage
- react-native-reanimated, react-native-gesture-handler, react-native-svg
- Google OAuth (`@react-native-google-signin/google-signin`)
- Google AdMob (`react-native-google-mobile-ads`)
- i18next & react-i18next
- Jest & React Native Testing Library

## Project Structure

```
src/
├── components/    # Reusable UI components
├── screens/       # App screens
├── context/       # Context API providers
├── hooks/         # Custom hooks
├── config/        # Game balance, constants, ads config
├── data/          # Static game data
├── registry/      # Game registry system
├── services/      # Ad service, emoji service
├── types/         # TypeScript type definitions
├── utils/         # Utility functions
└── locales/       # i18n translation files (en, pt-BR)
```

## Testing

```bash
pnpm test              # Run all tests
pnpm test -- --watch   # Watch mode
pnpm test -- --coverage # Coverage report
```

## Documentation

See [`docs/README.md`](./docs/README.md) for the full documentation index covering:

- Feature documentation (Feed, Play, Vet systems)
- Authentication & OAuth setup
- Responsive design guide
- Web build guides
- Design system specs
- Project roadmap
