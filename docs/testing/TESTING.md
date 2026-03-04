# Testing Guide

Complete testing guide for Lilly's Box including E2E tests, game tests, and unit tests.

## Overview

Three layers of testing:

1. **E2E Tests** - Full app flows (Maestro)
2. **Game Tests** - Individual game mechanics (Jest)
3. **Unit Tests** - Utils, hooks, logic (Jest)

## E2E Testing with Maestro

End-to-End testing using Maestro for user flow validation.

### Prerequisites

1. Install Maestro CLI

```bash
curl -Ls "https://get.maestro.mobile.dev" | bash

# Or via Homebrew (macOS)
brew install maestro
```

2. Running emulator/simulator

- **Android**: `adb devices` should list emulator
- **iOS**: Simulator should be booted

3. App installed on device

- **Expo Go**: App must be open before tests
- **Development Build** (recommended): Use `npx expo run:android` or `npx expo run:ios`

### Running E2E Tests

```bash
# Run main test flow
npm run test:e2e
# or
maestro test e2e/flow.yaml

# Run specific test
maestro test e2e/my-test.yaml

# Run and record video
maestro test e2e/flow.yaml --record-output test-recording.mp4
```

### Main Test Flow

Location: `e2e/flow.yaml`

Tests the "happy path":

1. Launch app
2. Handle menu (delete pet if exists)
3. Create new cat named "Maestro"
4. Verify home screen with action buttons

### Writing E2E Tests

Create new `.yaml` files in `e2e/` folder.

**Example:**
```yaml
appId: com.cpxlabs.lillysbox
---
- launchApp
- tapOn:
    text: "Feed"
- assertVisible:
    text: "Hunger"
- tapOn:
    point:
      x: 100
      y: 200
- swipeUp
- swipeDown
```

### Common Maestro Commands

| Command | Purpose | Example |
|---------|---------|---------|
| `launchApp` | Launch app | - |
| `tapOn` | Tap element | `tapOn: "Feed"` |
| `swipeUp` | Swipe up | - |
| `swipeDown` | Swipe down | - |
| `inputText` | Type text | `inputText: "Fluffy"` |
| `assertVisible` | Verify visible | `assertVisible: "Home"` |
| `assertNotVisible` | Verify not visible | - |
| `waitForAnimationToEnd` | Wait for animation | - |

### CI/CD Integration

Run Maestro in CI (GitHub Actions):

```yaml
name: E2E Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install Maestro
        run: curl -Ls "https://get.maestro.mobile.dev" | bash
      - name: Boot Simulator
        run: xcrun simctl boot iPhone-SE
      - name: Build app
        run: npx expo run:ios --simulator
      - name: Run tests
        run: maestro test e2e/flow.yaml
```

### Maestro Best Practices

✅ **DO:**
- Use visible text selectors: `tapOn: "Feed"`
- Wait for animations: `waitForAnimationToEnd`
- Test happy path thoroughly
- Record videos for debugging

❌ **DON'T:**
- Hardcode coordinates (fragile)
- Test one action per file (combine related flows)
- Skip waits between actions
- Test errors in Maestro (use unit tests)

## Game Testing with Jest

Test game mechanics, UI, and best score persistence.

### Test Layers

| Layer | Location | Tests |
|-------|----------|-------|
| Context | `src/context/__tests__/<Game>Context.test.tsx` | Best score persistence |
| Home Screen | `src/screens/__tests__/<Game>HomeScreen.test.tsx` | UI, navigation, display |
| Game Screen | `src/screens/__tests__/<Game>GameScreen.test.tsx` | Game logic, interactions |

### 1. Context Tests

Template for testing game context:

```typescript
import React from 'react';
import { Text } from 'react-native';
import { render, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ColorTapProvider, useColorTap } from '../ColorTapContext';

jest.mock('../AuthContext', () => ({
  useAuth: () => ({ user: { id: 'test-user-123' }, isGuest: false }),
}));

let hook: ReturnType<typeof useColorTap>;

const Consumer = () => {
  hook = useColorTap();
  return <Text>best:{hook.bestScore}</Text>;
};

describe('ColorTapContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
  });

  // Initialize with 0
  it('initializes with bestScore 0', async () => {
    render(
      <ColorTapProvider>
        <Consumer />
      </ColorTapProvider>
    );
    await act(async () => {});
    expect(hook.bestScore).toBe(0);
  });

  // Load from storage
  it('loads best score from AsyncStorage', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('500');
    render(
      <ColorTapProvider>
        <Consumer />
      </ColorTapProvider>
    );
    await act(async () => {});
    expect(hook.bestScore).toBe(500);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith(
      '@color_tap:bestScore:test-user-123'
    );
  });

  // Update if higher
  it('updates best score when new score is higher', async () => {
    render(
      <ColorTapProvider>
        <Consumer />
      </ColorTapProvider>
    );
    await act(async () => {});
    act(() => {
      hook.updateBestScore(750);
    });
    await act(async () => {});
    expect(hook.bestScore).toBe(750);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      '@color_tap:bestScore:test-user-123',
      '750'
    );
  });

  // Don't update if lower
  it('does not update if new score is lower', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('500');
    render(
      <ColorTapProvider>
        <Consumer />
      </ColorTapProvider>
    );
    await act(async () => {});
    act(() => {
      hook.updateBestScore(200);
    });
    await act(async () => {});
    expect(hook.bestScore).toBe(500);
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });

  // Error outside provider
  it('throws error when used outside provider', () => {
    const Orphan = () => {
      useColorTap();
      return null;
    };
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Orphan />)).toThrow(
      'useColorTap must be used within ColorTapProvider'
    );
    spy.mockRestore();
  });
});
```

### Test Coverage by Game

Every game context should have:
- ✅ Initialize with 0 best score
- ✅ Load from AsyncStorage
- ✅ Update on higher score
- ✅ Skip update on lower score
- ✅ Error handling outside provider

### 2. Home Screen Tests

Test game home screen UI and navigation:

```typescript
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import ColorTapHomeScreen from '../ColorTapHomeScreen';

const mockNavigation = {
  navigate: jest.fn(),
};

describe('ColorTapHomeScreen', () => {
  it('renders game title', () => {
    render(
      <ColorTapHomeScreen navigation={mockNavigation as any} />
    );
    expect(screen.getByText('Color Tap')).toBeTruthy();
  });

  it('displays best score', () => {
    render(
      <ColorTapHomeScreen navigation={mockNavigation as any} />
    );
    expect(screen.getByText(/Best Score: \d+/)).toBeTruthy();
  });

  it('navigates to game screen on play', () => {
    render(
      <ColorTapHomeScreen navigation={mockNavigation as any} />
    );
    fireEvent.press(screen.getByText('Play'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('ColorTapGame');
  });

  it('shows instructions', () => {
    render(
      <ColorTapHomeScreen navigation={mockNavigation as any} />
    );
    expect(screen.getByText(/Tap colors in sequence/)).toBeTruthy();
  });
});
```

### 3. Game Screen Tests

Test actual game mechanics:

```typescript
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react-native';
import ColorTapGameScreen from '../ColorTapGameScreen';

describe('ColorTapGameScreen', () => {
  it('renders initial colors', () => {
    render(<ColorTapGameScreen />);
    expect(screen.getAllByTestId(/color-button/)).toHaveLength(4);
  });

  it('updates score on correct tap', async () => {
    render(<ColorTapGameScreen />);
    const buttons = screen.getAllByTestId(/color-button/);
    
    await act(async () => {
      fireEvent.press(buttons[0]);
    });

    expect(screen.getByText(/Score: 1/)).toBeTruthy();
  });

  it('shows game over on mistake', async () => {
    render(<ColorTapGameScreen />);
    const buttons = screen.getAllByTestId(/color-button/);
    
    // Tap wrong color
    await act(async () => {
      fireEvent.press(buttons[1]); // Should tap buttons[0]
    });

    expect(screen.getByText('Game Over')).toBeTruthy();
  });

  it('increases difficulty on levels', async () => {
    render(<ColorTapGameScreen />);
    
    // Complete a level
    for (let i = 0; i < 5; i++) {
      const buttons = screen.getAllByTestId(/color-button/);
      await act(async () => {
        fireEvent.press(buttons[0]);
      });
    }

    expect(screen.getByText(/Level: 2/)).toBeTruthy();
  });

  it('saves best score', async () => {
    render(<ColorTapGameScreen />);
    // Game logic to reach high score
    // Verify AsyncStorage.setItem was called
  });
});
```

### Jest Setup

Install testing dependencies:

```bash
npm install --save-dev @testing-library/react-native jest
```

Jest config in `jest.config.js`:

```javascript
module.exports = {
  preset: 'react-native',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
```

### Running Tests

```bash
# All tests
npm test

# Watch mode
npm test -- --watch

# Specific file
npm test ColorTapContext

# Coverage report
npm test -- --coverage
```

## Unit Tests

Test utility functions, hooks, and helpers.

### Utils Testing

```typescript
import { calculatePetAge, calculateHunger } from '../petStats';

describe('petStats', () => {
  it('calculates pet age correctly', () => {
    const created = Date.now() - 7 * 24 * 60 * 60 * 1000; // 7 days ago
    const age = calculatePetAge(created);
    expect(age).toBe(1); // 1 week = 1 year in game
  });

  it('calculates hunger increase over time', () => {
    const stale = Date.now() - 60 * 60 * 1000; // 1 hour old
    const hunger = calculateHunger(50, stale);
    expect(hunger).toBeGreaterThan(50);
  });
});
```

### Hooks Testing

```typescript
import { renderHook, act } from '@testing-library/react-native';
import { usePetActions } from '../usePetActions';

describe('usePetActions', () => {
  it('validates action before execution', () => {
    const { result } = renderHook(() => usePetActions());
    
    const pet = { energy: 5, isSleeping: false };
    const canPlay = result.current.canPerformAction('play', pet);
    
    expect(canPlay).toBe(false); // Energy too low
  });

  it('calculates correct coin reward', async () => {
    const { result } = renderHook(() => usePetActions());
    
    const reward = result.current.getReward('feed');
    expect(reward).toBe(5);
  });
});
```

## Code Coverage Goals

| Category | Target | Current |
|----------|--------|---------|
| Statements | 80% | — |
| Branches | 75% | — |
| Functions | 80% | — |
| Lines | 80% | — |

Run coverage report:

```bash
npm test -- --coverage
```

## Test Checklist

Before committing:

- [ ] New tests written for features
- [ ] All existing tests pass
- [ ] No console errors/warnings
- [ ] Code coverage maintained or improved
- [ ] E2E tests run successfully

## CI/CD Pipeline

Tests run automatically:

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: 18
      - run: npm install
      - run: npm test -- --coverage
      - run: maestro test e2e/flow.yaml
```

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Native Testing Library](https://testing-library.com/react-native)
- [Maestro Documentation](https://maestro.mobile.dev/)

---

**Last Updated**: 2026-03-04  
**Status**: Complete
