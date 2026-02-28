# Game Testing Guide

This document describes how to write tests for every mini-game in the pet care game project. All games follow consistent patterns making tests predictable and systematic.

## Test Coverage Overview

Each game has **3 testable layers**:

| Layer | Location | What to test |
|-------|----------|-------------|
| Context | `src/context/__tests__/<Game>Context.test.tsx` | Best score persistence via AsyncStorage |
| Home Screen | `src/screens/__tests__/<Game>HomeScreen.test.tsx` | UI rendering, navigation, best score display |
| Game Screen | `src/screens/__tests__/<Game>GameScreen.test.tsx` | Game mechanics, interactions, game over flow |

---

## 1. Context Tests

All game contexts follow an identical pattern: they store and retrieve a best score from AsyncStorage.

### Template

```tsx
import React from 'react';
import { Text } from 'react-native';
import { render, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { <Game>Provider, use<Game> } from '../<Game>Context';

jest.mock('../AuthContext', () => ({
  useAuth: () => ({ user: { id: 'test-user-<unique>' }, isGuest: false }),
}));

let hook: ReturnType<typeof use<Game>>;

const Consumer = () => {
  hook = use<Game>();
  return <Text>best:{hook.bestScore}</Text>;
};

const renderProvider = () =>
  render(
    <<Game>Provider>
      <Consumer />
    </<Game>Provider>
  );

describe('<Game>Context', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
  });

  it('initializes with bestScore 0', async () => {
    renderProvider();
    await act(async () => {});
    expect(hook.bestScore).toBe(0);
  });

  it('loads best score from AsyncStorage', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('500');
    renderProvider();
    await act(async () => {});
    expect(hook.bestScore).toBe(500);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('<storage_key>:test-user-<unique>');
  });

  it('updates best score when new score is higher', async () => {
    renderProvider();
    await act(async () => {});
    act(() => { hook.updateBestScore(750); });
    await act(async () => {});
    expect(hook.bestScore).toBe(750);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('<storage_key>:test-user-<unique>', '750');
  });

  it('does not update best score when new score is lower', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('500');
    renderProvider();
    await act(async () => {});
    act(() => { hook.updateBestScore(200); });
    await act(async () => {});
    expect(hook.bestScore).toBe(500);
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });

  it('throws error when used outside provider', () => {
    const Orphan = () => { use<Game>(); return null; };
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Orphan />)).toThrow('use<Game> must be used within <Game>Provider');
    spy.mockRestore();
  });
});
```

### Storage Keys Per Game

| Game | Storage Key Base | Hook |
|------|-----------------|------|
| color-tap | `@color_tap:bestScore` | `useColorTap` |
| memory-match | `@memory_match:bestScore` | `useMemoryMatch` |
| simon-says | `@simon_says:bestScore` | `useSimonSays` |
| dress-up-relay | `@dress_up_relay:bestScore` | `useDressUpRelay` |
| color-mixer | `@color_mixer:bestScore` | `useColorMixer` |
| catch-the-ball | `@catch_the_ball:bestScore` | `useCatchTheBall` |
| sliding-puzzle | `@sliding_puzzle:bestScore` | `useSlidingPuzzle` |
| bubble-pop | `@bubble_pop:bestScore` | `useBubblePop` |
| pet-dance-party | `@pet_dance_party:bestScore` | `usePetDanceParty` |
| treasure-dig | `@treasure_dig:bestScore` | `useTreasureDig` |
| balloon-float | `@balloon_float:bestScore` | `useBalloonFloat` |
| paint-splash | `@paint_splash:bestScore` | `usePaintSplash` |
| snack-stack | `@snack_stack:bestScore` | `useSnackStack` |
| lightning-tap | `@lightning_tap:bestScore` | `useLightningTap` |
| path-finder | `@path_finder:bestScore` | `usePathFinder` |
| shape-sorter | `@shape_sorter:bestScore` | `useShapeSorter` |
| mirror-match | `@mirror_match:bestScore` | `useMirrorMatchGame` |
| word-bubbles | `@word_bubbles:bestScore` | `useWordBubbles` |
| jigsaw-pets | `@jigsaw_pets:bestScore` | `useJigsawPets` |
| connect-dots | `@connect_dots:bestScore` | `useConnectDots` |
| pet-explorer | `@pet_explorer:bestScore` | `usePetExplorer` |
| weather-wizard | `@weather_wizard:bestScore` | `useWeatherWizard` |
| pet-chef | `@pet_chef:bestScore` | `usePetChef` |
| music-maker | `@music_maker:bestScore` | `useMusicMaker` |
| garden-grow | `@garden_grow:bestScore` | `useGardenGrow` |
| photo-studio | `@photo_studio:bestScore` | `usePhotoStudio` |

> **Note**: Some contexts (MemoryMatch, SlidingPuzzle) track scores per difficulty. Check the actual context file for the exact `updateBestScore` signature and storage key format.

---

## 2. Home Screen Tests

All home screens share the same layout: back button, emoji, title, subtitle, best score card (conditional), play button, instructions.

### Template

```tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { <Game>HomeScreen } from '../<Game>HomeScreen';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const mockUpdateBestScore = jest.fn();
const mockUse<Game> = jest.fn(() => ({
  bestScore: 0,
  updateBestScore: mockUpdateBestScore,
}));

jest.mock('../../context/<Game>Context', () => ({
  use<Game>: () => mockUse<Game>(),
}));

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockCanGoBack = jest.fn(() => true);
const mockGetParent = jest.fn(() => ({ goBack: jest.fn() }));

const navigation = {
  navigate: mockNavigate,
  goBack: mockGoBack,
  canGoBack: mockCanGoBack,
  getParent: mockGetParent,
};

describe('<Game>HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUse<Game>.mockReturnValue({
      bestScore: 0,
      updateBestScore: mockUpdateBestScore,
    });
  });

  it('renders title and play button', () => {
    const { getByText } = render(
      <<Game>HomeScreen navigation={navigation as any} />
    );
    expect(getByText('<gameName>.home.title')).toBeTruthy();
    expect(getByText('<gameName>.home.play')).toBeTruthy();
  });

  it('shows best score when greater than 0', () => {
    mockUse<Game>.mockReturnValue({
      bestScore: 500,
      updateBestScore: mockUpdateBestScore,
    });
    const { getByText } = render(
      <<Game>HomeScreen navigation={navigation as any} />
    );
    expect(getByText('500')).toBeTruthy();
    expect(getByText('<gameName>.home.bestScore')).toBeTruthy();
  });

  it('does not show best score when 0', () => {
    const { queryByText } = render(
      <<Game>HomeScreen navigation={navigation as any} />
    );
    expect(queryByText('<gameName>.home.bestScore')).toBeNull();
  });

  it('navigates to game on play press', () => {
    const { getByText } = render(
      <<Game>HomeScreen navigation={navigation as any} />
    );
    fireEvent.press(getByText('<gameName>.home.play'));
    expect(mockNavigate).toHaveBeenCalledWith('<Game>Game');
  });

  it('navigates back on back press', () => {
    const { getByText } = render(
      <<Game>HomeScreen navigation={navigation as any} />
    );
    fireEvent.press(getByText('← common.back'));
    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });
});
```

### Navigation Target Per Game

| Home Screen | Navigate To |
|-------------|-------------|
| ColorTapHomeScreen | `ColorTapGame` |
| MemoryMatchHomeScreen | `MemoryMatchGame` |
| SimonSaysHomeScreen | `SimonSaysGame` |
| DressUpRelayHomeScreen | `DressUpRelayGame` |
| ColorMixerHomeScreen | `ColorMixerGame` |
| CatchTheBallHomeScreen | `CatchTheBallGame` |
| SlidingPuzzleHomeScreen | `SlidingPuzzleGame` |
| BubblePopHomeScreen | `BubblePopGame` |
| PetDancePartyHomeScreen | `PetDancePartyGame` |
| TreasureDigHomeScreen | `TreasureDigGame` |
| BalloonFloatHomeScreen | `BalloonFloatGame` |
| PaintSplashHomeScreen | `PaintSplashGame` |
| SnackStackHomeScreen | `SnackStackGame` |
| LightningTapHomeScreen | `LightningTapGame` |
| PathFinderHomeScreen | `PathFinderGame` |
| ShapeSorterHomeScreen | `ShapeSorterGame` |
| MirrorMatchHomeScreen | `MirrorMatchGame` |
| WordBubblesHomeScreen | `WordBubblesGame` |
| JigsawPetsHomeScreen | `JigsawPetsGame` |
| ConnectDotsHomeScreen | `ConnectDotsGame` |
| PetExplorerHomeScreen | `PetExplorerGame` |
| WeatherWizardHomeScreen | `WeatherWizardGame` |
| PetChefHomeScreen | `PetChefGame` |
| MusicMakerHomeScreen | `MusicMakerGame` |
| GardenGrowHomeScreen | `GardenGrowGame` |
| PhotoStudioHomeScreen | `PhotoStudioGame` |

---

## 3. Game Screen Tests

Game screens vary more in mechanics. Here are the common elements to test for every game, plus game-specific patterns.

### Common Test Setup

```tsx
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

// Mock context hook
const mockUpdateBestScore = jest.fn();
jest.mock('../../context/<Game>Context', () => ({
  use<Game>: () => ({ bestScore: 0, updateBestScore: mockUpdateBestScore }),
}));

// Mock navigation
const mockGoBack = jest.fn();
const navigation = {
  goBack: mockGoBack,
  canGoBack: jest.fn(() => true),
  getParent: jest.fn(() => undefined),
};

beforeEach(() => {
  jest.clearAllMocks();
  jest.useFakeTimers();
  // Add Dimensions mock if game uses screen dimensions
  jest.spyOn(Dimensions, 'get').mockReturnValue({
    width: 390, height: 844, scale: 2, fontScale: 1,
  });
  // Add Animated mock if game uses animations
  jest.spyOn(Animated, 'timing').mockReturnValue({
    start: jest.fn(), stop: jest.fn(), reset: jest.fn(),
  } as any);
});

afterEach(() => {
  jest.useRealTimers();
});
```

### Common Assertions (Every Game)

1. **Renders initial state** - score, UI elements visible
2. **Back button works** - navigates back
3. **Game emoji renders** - characteristic emoji appears
4. **Timer/counter works** - if timer-based, verify countdown
5. **Game over triggers** - modal appears at end condition
6. **updateBestScore called** - on game end

### Game Type Categories

| Category | Games | Timer | Key Mechanic |
|----------|-------|-------|-------------|
| Timer + Tap | LightningTap, BubblePop, PetDanceParty, BalloonFloat, PetTaxi | Yes (30-60s) | Tap targets |
| Timer + Move | CatchTheBall | Yes (30s) | Lane movement |
| Round-based | SimonSays, DressUpRelay, ShapeSorter, WeatherWizard, PetChef | No | Complete rounds |
| Puzzle | MemoryMatch, SlidingPuzzle, PathFinder, JigsawPets, ConnectDots, MirrorMatch | No | Solve puzzle |
| Word/Sequence | WordBubbles | No | Tap letters in order |
| Creative | MusicMaker, PhotoStudio, GardenGrow, PaintSplash, ColorMixer | No | Build/create |
| Stacking | SnackStack | No | Precision timing |
| Exploration | TreasureDig, PetExplorer | No | Tap to discover |
| Artifact-based | ColorTap | Yes | WebView bridge |

### Additional Mocks by Game Type

**Games using `requestAnimationFrame`**: CatchTheBall
```tsx
global.requestAnimationFrame = jest.fn((cb) => 1) as any;
global.cancelAnimationFrame = jest.fn() as any;
```

**Games using `Animated.spring`**: SimonSays, DressUpRelay
```tsx
jest.spyOn(Animated, 'spring').mockReturnValue({
  start: jest.fn(), stop: jest.fn(), reset: jest.fn(),
} as any);
```

**Games using `PanResponder`**: BalloonFloat, ColorMixer
```tsx
// PanResponder tests are limited in RNTL; test the rendered output instead
```

**Games using `Haptics`**: SimonSays, DressUpRelay, PetDanceParty
```tsx
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  ImpactFeedbackStyle: { Medium: 'medium', Light: 'light' },
  NotificationFeedbackType: { Success: 'success', Error: 'error' },
}));
```

**Games with route params**: MemoryMatch, SlidingPuzzle
```tsx
const route = { params: { difficulty: 'easy' } };
// Pass as: <GameScreen navigation={navigation} route={route} />
```

---

## 4. Running Tests

```bash
# Run all tests
cd app && npx jest --no-coverage

# Run tests for a specific game
npx jest --testPathPatterns="PetTaxi" --no-coverage

# Run only context tests
npx jest --testPathPatterns="context/__tests__" --no-coverage

# Run only screen tests
npx jest --testPathPatterns="screens/__tests__" --no-coverage

# Run with coverage
npx jest --coverage
```

---

## 5. Checklist

For each game, ensure these test files exist and pass:

- [ ] `src/context/__tests__/<Game>Context.test.tsx` (5 tests)
- [ ] `src/screens/__tests__/<Game>HomeScreen.test.tsx` (5 tests)
- [ ] `src/screens/__tests__/<Game>GameScreen.test.tsx` (5+ tests)

Minimum **15 tests per game** across all 3 files.
