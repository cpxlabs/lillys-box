# Responsivity Implementation Plan - Pet Care Game
## Date: 2026-01-16

---

## Implementation Progress

| # | Task | Status | Completed |
|---|------|--------|-----------|
| 1 | Create responsive utilities hook | :hourglass: Pending | - |
| 2 | Define breakpoint system | :hourglass: Pending | - |
| 3 | Create scalable dimension utilities | :hourglass: Pending | - |
| 4 | Fix HomeScreen responsiveness | :hourglass: Pending | - |
| 5 | Fix IconButton grid layout | :hourglass: Pending | - |
| 6 | Fix StatusCard/StatusBar sizing | :hourglass: Pending | - |
| 7 | Fix PetRenderer dynamic sizing | :hourglass: Pending | - |
| 8 | Fix action screens (Feed, Bath, Play, etc.) | :hourglass: Pending | - |
| 9 | Add web-specific optimizations | :hourglass: Pending | - |
| 10 | Add tablet-specific layout | :hourglass: Pending | - |

---

## Current Issues Analysis

### Screenshots Analysis

**Samsung Galaxy S20 Ultra (412x915):**
- Action buttons in 4-column layout but cramped
- Stats text very small and hard to read
- Pet takes most of the vertical space

**iPhone 12 Pro (390x844):**
- Action buttons wrap to 3+3+1 layout (uneven)
- Same small stats text issue
- "Menu" button orphaned at bottom

### Root Causes

1. **No responsive utilities** - All dimensions are hardcoded pixels
2. **Fixed PetRenderer size** - Uses `size={420}` regardless of screen
3. **Fixed font sizes** - 10-14px fonts are too small on mobile
4. **No breakpoint system** - Same layout for all devices
5. **IconButton grid issues** - No column control for different screen sizes

---

## Device Breakpoints

| Device Type | Width Range | Example Devices |
|-------------|-------------|-----------------|
| **Mobile Small** | < 375px | iPhone SE, older Android |
| **Mobile** | 375px - 428px | iPhone 12/13/14, most Android |
| **Mobile Large** | 428px - 768px | iPhone Pro Max, large Android |
| **Tablet** | 768px - 1024px | iPad Mini, Android tablets |
| **Tablet Large** | 1024px - 1280px | iPad Pro 11" |
| **Desktop** | > 1280px | Web browsers |

---

## Task 1: Create Responsive Utilities Hook

### File: `src/hooks/useResponsive.ts`

```typescript
import { useWindowDimensions, Platform, PixelRatio } from 'react-native';

export type DeviceType = 'mobile' | 'mobileLarge' | 'tablet' | 'desktop';

export interface ResponsiveConfig {
  width: number;
  height: number;
  deviceType: DeviceType;
  isPortrait: boolean;
  isLandscape: boolean;
  scale: number;
  fontScale: number;
  // Scaling functions
  wp: (percentage: number) => number;  // Width percentage
  hp: (percentage: number) => number;  // Height percentage
  fs: (size: number) => number;        // Font size
  spacing: (size: number) => number;   // Spacing/padding
}

export const useResponsive = (): ResponsiveConfig => {
  const { width, height } = useWindowDimensions();

  // Determine device type
  const getDeviceType = (): DeviceType => {
    if (width >= 1280) return 'desktop';
    if (width >= 768) return 'tablet';
    if (width >= 428) return 'mobileLarge';
    return 'mobile';
  };

  // Base width for scaling (iPhone 12 Pro as reference)
  const BASE_WIDTH = 390;
  const scale = width / BASE_WIDTH;
  const fontScale = Math.min(scale, 1.3); // Cap font scaling

  return {
    width,
    height,
    deviceType: getDeviceType(),
    isPortrait: height > width,
    isLandscape: width > height,
    scale,
    fontScale,
    wp: (percentage) => (width * percentage) / 100,
    hp: (percentage) => (height * percentage) / 100,
    fs: (size) => Math.round(size * fontScale),
    spacing: (size) => Math.round(size * Math.min(scale, 1.2)),
  };
};
```

### Changes Required
- Create new file: `src/hooks/useResponsive.ts`
- Export from hooks index if exists

---

## Task 2: Define Breakpoint System

### File: `src/config/responsive.ts`

```typescript
export const BREAKPOINTS = {
  mobileSmall: 375,
  mobile: 428,
  mobileLarge: 768,
  tablet: 1024,
  tabletLarge: 1280,
};

export const GRID_COLUMNS = {
  mobile: 4,        // 4 columns for mobile
  mobileLarge: 4,   // 4 columns for large mobile
  tablet: 6,        // 6 columns for tablet
  desktop: 8,       // 8 columns for desktop
};

export const PET_SIZE = {
  mobile: 280,
  mobileLarge: 320,
  tablet: 380,
  desktop: 450,
};

export const FONT_SIZES = {
  xs: 10,
  sm: 12,
  base: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};
```

---

## Task 3: Create Scalable Dimension Utilities

### File: `src/utils/responsive.ts`

```typescript
import { Dimensions, PixelRatio, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Reference dimensions (iPhone 12 Pro)
const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

/**
 * Scale a value based on screen width
 */
export const scale = (size: number): number => {
  return (SCREEN_WIDTH / BASE_WIDTH) * size;
};

/**
 * Scale a value based on screen height
 */
export const verticalScale = (size: number): number => {
  return (SCREEN_HEIGHT / BASE_HEIGHT) * size;
};

/**
 * Moderate scaling - less aggressive for fonts and spacing
 * @param size - Base size
 * @param factor - Scaling factor (default 0.5 for moderate scaling)
 */
export const moderateScale = (size: number, factor: number = 0.5): number => {
  return size + (scale(size) - size) * factor;
};

/**
 * Normalize font size across platforms
 */
export const normalizeFont = (size: number): number => {
  const newSize = moderateScale(size, 0.3);
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  }
  return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
};

/**
 * Get responsive value based on device width
 */
export const responsiveValue = <T>(
  mobile: T,
  tablet: T,
  desktop: T
): T => {
  if (SCREEN_WIDTH >= 1280) return desktop;
  if (SCREEN_WIDTH >= 768) return tablet;
  return mobile;
};
```

---

## Task 4: Fix HomeScreen Responsiveness

### File: `src/screens/HomeScreen.tsx`

**Current Issues:**
- PetRenderer fixed at 420px
- Action buttons have fixed gap/padding
- No responsive layout adjustments

**Changes:**

```typescript
// Add imports
import { useResponsive } from '../hooks/useResponsive';
import { PET_SIZE, GRID_COLUMNS } from '../config/responsive';

// Inside component
const { deviceType, wp, hp, fs, spacing } = useResponsive();

// Get pet size based on device
const petSize = PET_SIZE[deviceType] || PET_SIZE.mobile;

// Dynamic styles
const dynamicStyles = {
  actionsContainer: {
    gap: spacing(12),
    padding: spacing(16),
    paddingBottom: spacing(8),
  },
  warningText: {
    fontSize: fs(14),
    padding: spacing(8),
  },
};

// PetRenderer usage
<PetRenderer pet={pet} animationState={animationState} size={petSize} />
```

**Style Changes:**
```typescript
const styles = StyleSheet.create({
  // Remove hardcoded values, use dynamic instead
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center', // Changed from space-evenly
    alignItems: 'flex-start',
    // gap, padding applied dynamically
  },
});
```

---

## Task 5: Fix IconButton Grid Layout

### File: `src/components/IconButton.tsx`

**Current Issues:**
- Fixed padding (16)
- Fixed emoji size (32)
- Fixed label size (12)
- minWidth: 80 not enough control

**Changes:**

```typescript
import { useResponsive } from '../hooks/useResponsive';

type Props = {
  emoji: string;
  label: string;
  onPress: () => void;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
};

export const IconButton: React.FC<Props> = ({
  emoji,
  label,
  onPress,
  disabled,
  size = 'medium'
}) => {
  const { deviceType, wp, fs, spacing } = useResponsive();

  // Calculate button width based on columns needed
  const getButtonWidth = () => {
    const columns = deviceType === 'tablet' || deviceType === 'desktop' ? 4 : 4;
    const totalGap = spacing(12) * (columns - 1);
    const availableWidth = wp(100) - spacing(32) - totalGap;
    return availableWidth / columns;
  };

  const buttonWidth = getButtonWidth();

  const dynamicStyles = StyleSheet.create({
    button: {
      width: buttonWidth,
      maxWidth: 100,
      padding: spacing(12),
      borderRadius: spacing(16),
    },
    emoji: {
      fontSize: fs(28),
    },
    label: {
      fontSize: fs(11),
      marginTop: spacing(4),
    },
  });

  return (
    <TouchableOpacity
      style={[styles.button, dynamicStyles.button, disabled && styles.buttonDisabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.emoji, dynamicStyles.emoji]}>{emoji}</Text>
      <Text style={[styles.label, dynamicStyles.label]}>{label}</Text>
    </TouchableOpacity>
  );
};
```

---

## Task 6: Fix StatusCard/StatusBar Sizing

### File: `src/components/StatusCard.tsx`

**Changes:**
```typescript
import { useResponsive } from '../hooks/useResponsive';

export const StatusCard: React.FC<Props> = ({ pet, petName, petAge, compact }) => {
  const { fs, spacing, deviceType } = useResponsive();

  // Tablet/Desktop: show more info
  const showFullStats = deviceType === 'tablet' || deviceType === 'desktop';

  const dynamicStyles = {
    card: {
      marginHorizontal: spacing(12),
      marginVertical: spacing(6),
      padding: spacing(compact ? 8 : 12),
      borderRadius: spacing(12),
    },
    petName: {
      fontSize: fs(compact ? 14 : 16),
    },
    petAge: {
      fontSize: fs(compact ? 11 : 13),
    },
    moneyText: {
      fontSize: fs(compact ? 12 : 14),
    },
  };

  // ...
};
```

### File: `src/components/StatusBar.tsx`

**Changes:**
```typescript
import { useResponsive } from '../hooks/useResponsive';

export const StatusBar: React.FC<Props> = ({ label, value, emoji, color }) => {
  const { fs, spacing } = useResponsive();

  const dynamicStyles = {
    label: {
      fontSize: fs(10),
      width: spacing(32),
    },
    emoji: {
      fontSize: fs(14),
    },
    barBackground: {
      height: spacing(8),
      borderRadius: spacing(4),
    },
    valueText: {
      fontSize: fs(10),
      width: spacing(30),
    },
  };

  // ...
};
```

---

## Task 7: Fix PetRenderer Dynamic Sizing

### File: `src/components/PetRenderer.tsx`

**Current:** Accepts `size` prop but callers use fixed values

**No changes needed in component** - fix at usage sites:
- HomeScreen.tsx: Use responsive size
- FeedScene.tsx: Use responsive size
- VetScene.tsx: Use responsive size
- SleepScene.tsx: Use responsive size

**Example pattern:**
```typescript
const { deviceType } = useResponsive();
const petSize = {
  mobile: 280,
  mobileLarge: 320,
  tablet: 350,
  desktop: 400,
}[deviceType];

<PetRenderer pet={pet} size={petSize} />
```

---

## Task 8: Fix Action Screens

### Files to Update:
- `src/screens/FeedScene.tsx`
- `src/screens/BathScene.tsx`
- `src/screens/PlayScene.tsx`
- `src/screens/SleepScene.tsx`
- `src/screens/VetScene.tsx`
- `src/screens/WardrobeScene.tsx`

**Common Pattern:**
```typescript
import { useResponsive } from '../hooks/useResponsive';

// Inside component
const { fs, spacing, wp, hp, deviceType } = useResponsive();

// Pet size
const petSize = deviceType === 'tablet' || deviceType === 'desktop' ? 350 : 280;

// Dynamic styles
const dynamicStyles = {
  container: {
    paddingHorizontal: spacing(16),
  },
  title: {
    fontSize: fs(18),
  },
  button: {
    paddingVertical: spacing(14),
    paddingHorizontal: spacing(20),
    borderRadius: spacing(12),
  },
  buttonText: {
    fontSize: fs(16),
  },
};
```

---

## Task 9: Add Web-Specific Optimizations

### File: `src/config/responsive.ts` (additions)

```typescript
import { Platform } from 'react-native';

export const WEB_MAX_WIDTH = 480; // Max width for mobile-like experience
export const WEB_CENTERED_LAYOUT = Platform.OS === 'web';

export const getWebContainerStyle = () => {
  if (Platform.OS !== 'web') return {};

  return {
    maxWidth: WEB_MAX_WIDTH,
    marginHorizontal: 'auto',
    width: '100%',
  };
};
```

### App.tsx Web Container

```typescript
// Wrap NavigationContainer with a web container
{Platform.OS === 'web' ? (
  <View style={webContainerStyles}>
    <NavigationContainer>{/* ... */}</NavigationContainer>
  </View>
) : (
  <NavigationContainer>{/* ... */}</NavigationContainer>
)}

const webContainerStyles = StyleSheet.create({
  container: {
    flex: 1,
    maxWidth: 480,
    marginHorizontal: 'auto',
    backgroundColor: '#f5f5f5',
    // Add shadow for web
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
});
```

---

## Task 10: Add Tablet-Specific Layout

### Tablet Optimizations

**Two-column layout for tablets:**
```typescript
// HomeScreen tablet layout
const { deviceType, wp } = useResponsive();

if (deviceType === 'tablet' || deviceType === 'desktop') {
  return (
    <View style={styles.tabletContainer}>
      <View style={styles.leftColumn}>
        <StatusCard />
        <PetRenderer size={380} />
      </View>
      <View style={styles.rightColumn}>
        <ActionsGrid />
      </View>
    </View>
  );
}

const tabletStyles = StyleSheet.create({
  tabletContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  leftColumn: {
    flex: 1,
    alignItems: 'center',
  },
  rightColumn: {
    width: 200,
    padding: 16,
  },
});
```

---

## File Summary

| File | Action | Priority |
|------|--------|----------|
| `src/hooks/useResponsive.ts` | Create | High |
| `src/config/responsive.ts` | Create | High |
| `src/utils/responsive.ts` | Create | High |
| `src/screens/HomeScreen.tsx` | Modify | High |
| `src/components/IconButton.tsx` | Modify | High |
| `src/components/StatusCard.tsx` | Modify | Medium |
| `src/components/StatusBar.tsx` | Modify | Medium |
| `src/screens/FeedScene.tsx` | Modify | Medium |
| `src/screens/BathScene.tsx` | Modify | Medium |
| `src/screens/PlayScene.tsx` | Modify | Medium |
| `src/screens/SleepScene.tsx` | Modify | Medium |
| `src/screens/VetScene.tsx` | Modify | Medium |
| `src/screens/WardrobeScene.tsx` | Modify | Medium |
| `App.tsx` | Modify (web) | Low |

---

## Testing Checklist

### Mobile (< 428px)
- [ ] iPhone SE (375x667)
- [ ] iPhone 12/13/14 (390x844)
- [ ] Android small (360x640)

### Mobile Large (428px - 768px)
- [ ] iPhone Pro Max (428x926)
- [ ] Samsung Galaxy S20 Ultra (412x915)

### Tablet (768px - 1024px)
- [ ] iPad Mini (768x1024)
- [ ] Android tablet (800x1280)

### Desktop (> 1024px)
- [ ] Web browser (1920x1080)
- [ ] iPad Pro (1024x1366)

---

## Expected Results

### Before vs After

| Metric | Before | After |
|--------|--------|-------|
| Font readability | Small, fixed | Scaled to device |
| Button grid | Uneven wrapping | Consistent columns |
| Pet size | Fixed 420px | Adaptive to screen |
| Tablet experience | Same as mobile | Optimized layout |
| Web experience | Stretched | Centered, max-width |

---

*Generated: 2026-01-16*
