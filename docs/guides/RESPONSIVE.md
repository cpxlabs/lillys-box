# Responsive Design

Complete guide for responsive design in Lilly's Box across mobile, tablet, and web.

## Overview

Lilly's Box uses a responsive design system that automatically scales layouts, text sizes, and component dimensions based on device width. No hardcoded pixel values — everything scales proportionally.

**Key Principle**: Use scaling functions instead of fixed pixel values. Device adapts, not the other way around.

## Device Breakpoints

Four device categories automatically detected:

| Category | Width | Examples |
|----------|-------|----------|
| Mobile | < 428px | iPhone SE, iPhone 12/13/14 |
| Mobile Large | 428-768px | iPhone Pro Max, Galaxy S20 Ultra |
| Tablet | 768-1280px | iPad, iPad Mini |
| Desktop | > 1280px | Web browser, desktop |

## Quick Start

### Import Hook

```typescript
import { useResponsive } from '../hooks/useResponsive';
```

### Use in Component

```typescript
const MyScreen: React.FC = () => {
  const { deviceType, wp, hp, fs, spacing } = useResponsive();

  return (
    <View style={{ padding: spacing(16) }}>
      <Text style={{ fontSize: fs(18) }}>Title</Text>
      <View style={{ height: hp(50), width: wp(90) }}>
        {/* Content */}
      </View>
    </View>
  );
};
```

### Scaling Functions

| Function | Purpose | Example |
|----------|---------|---------|
| `wp(50)` | Width percentage | 50% of screen width |
| `hp(50)` | Height percentage | 50% of screen height |
| `fs(16)` | Font size | Scales on small screens, capped on large |
| `spacing(16)` | Padding/margin | Consistent gaps across devices |

## Common Patterns

### Pattern 1: Responsive Pet Size

```typescript
const { deviceType } = useResponsive();

const petSize = {
  mobile: 280,
  mobileLarge: 320,
  tablet: 380,
  desktop: 450,
}[deviceType];

<PetRenderer size={petSize} />
```

### Pattern 2: Device-Specific Layout

```typescript
const { deviceType } = useResponsive();

if (deviceType === 'tablet' || deviceType === 'desktop') {
  return <TwoColumnLayout />;  // Side-by-side
} else {
  return <SingleColumnLayout />; // Stacked
}
```

### Pattern 3: Responsive Container

```typescript
const { spacing, wp } = useResponsive();

const containerStyle = {
  paddingHorizontal: spacing(16),
  paddingVertical: spacing(12),
  marginBottom: spacing(20),
  width: wp(90),
};
```

### Pattern 4: Responsive Text

```typescript
const { fs, spacing } = useResponsive();

const titleStyle = {
  fontSize: fs(24),
  fontWeight: 'bold',
  marginBottom: spacing(8),
};

const bodyStyle = {
  fontSize: fs(14),
  color: '#666',
};
```

## Scaling Functions Explained

### `wp()` - Width Percentage

Percentage of screen width.

```typescript
wp(50);   // Half screen width
wp(100);  // Full width
wp(90);   // 90% width (5% margin each side)
```

**Use for**: Widths, flexible layouts, card sizes

### `hp()` - Height Percentage

Percentage of screen height.

```typescript
hp(30);   // 30% of height
hp(100);  // Full screen height
```

**Use for**: Heights, vertical spacing, content areas

### `fs()` - Font Size

Scales text, with automatic capping to keep readable.

```typescript
fs(18);   // Scales from ~12px on small to ~28px on large (capped)
fs(12);   // Smaller text, scales proportionally
fs(28);   // Large heading
```

**Use for**: All text (headings, body, captions)

### `spacing()` - Padding/Margin

Scales padding and margins consistently.

```typescript
spacing(16);  // Standard padding
spacing(8);   // Small spacing
spacing(24);  // Large spacing
```

**Use for**: Padding, margins, gaps, insets

## Best Practices

### ✅ DO

```typescript
// Use scaling functions
paddingHorizontal: spacing(16);        // ✅ Good
fontSize: fs(14);                      // ✅ Good
width: wp(90);                         // ✅ Good

// Use device type for layouts
const size = deviceType === 'tablet' ? 400 : 280;  // ✅ Good
```

### ❌ DON'T

```typescript
// Hardcode dimensions
paddingHorizontal: 16;                 // ❌ Won't scale
fontSize: 14;                          // ❌ Too small on tablet
<PetRenderer size={420} />             // ❌ Wrong on all devices
```

## Implementation Guide

### For New Screens

1. Import the hook

```typescript
import { useResponsive } from '../hooks/useResponsive';
```

2. Use in component

```typescript
export const MyScreen: React.FC = () => {
  const { deviceType, fs, spacing, wp } = useResponsive();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ padding: spacing(16) }}>
        <Text style={{ fontSize: fs(20), marginBottom: spacing(12) }}>
          Title
        </Text>
        <View style={{ width: wp(100) }}>
          {/* Content */}
        </View>
      </View>
    </SafeAreaView>
  );
};
```

3. For pet sizes, use config

```typescript
import { ACTION_PET_SIZE } from '../config/responsive';

const petSize = ACTION_PET_SIZE[deviceType];
<PetRenderer size={petSize} />
```

## Predefined Sizes

### Pet Sizes

```typescript
// Home screen
const PET_SIZE = {
  mobile: 280,
  mobileLarge: 320,
  tablet: 380,
  desktop: 450,
};

// Action screens
const ACTION_PET_SIZE = {
  mobile: 280,
  mobileLarge: 320,
  tablet: 350,
  desktop: 400,
};
```

### Grid Columns

```typescript
const GRID_COLUMNS = {
  mobile: 4,      // 4 columns for mobile
  tablet: 6,      // 6 columns for tablet
  desktop: 8,     // 8 columns for desktop
};
```

### Spacing

```typescript
const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};
```

## Testing Responsive Design

### Mobile (iPhone SE - 375px)

```bash
# iOS simulator
xcrun simctl openurl booted "simulator://open?device=iPhone%20SE"
```

- Test smallest devices
- Compact layouts
- Scaled-down fonts

### Large Mobile (iPhone Pro Max - 428px)

```bash
xcrun simctl openurl booted "simulator://open?device=iPhone%2014%20Pro%20Max"
```

- Larger pet renderer
- More button space
- Slightly larger fonts

### Tablet (iPad - 768px)

```bash
xcrun simctl openurl booted "simulator://open?device=iPad%20Pro"
```

- Two-column options
- Larger pet size
- Full-sized fonts

### Web Browser

Resize browser window to test different widths, or use DevTools (F12 → Device Mode).

### Android Emulator

- Pixel 4a (small phone)
- Pixel 6 Pro (standard)
- Pixel Tablet

## Web-Specific Optimization

On web, limit max-width to maintain mobile-like experience:

```typescript
import { Platform } from 'react-native';

export const webContainerStyle = () => {
  if (Platform.OS !== 'web') return {};

  return {
    maxWidth: 480,
    marginHorizontal: 'auto',
    width: '100%',
  };
};
```

In `App.tsx`:

```typescript
{Platform.OS === 'web' ? (
  <View style={{ maxWidth: 480, marginHorizontal: 'auto' }}>
    <NavigationContainer>{/* App */}</NavigationContainer>
  </View>
) : (
  <NavigationContainer>{/* App */}</NavigationContainer>
)}
```

## Tablet-Specific Layout

For two-column layout on tablets:

```typescript
const { deviceType, wp } = useResponsive();

if (deviceType === 'tablet' || deviceType === 'desktop') {
  return (
    <View style={{ flex: 1, flexDirection: 'row' }}>
      <View style={{ flex: 1, alignItems: 'center' }}>
        <StatusCard />
        <PetRenderer size={380} />
      </View>
      <View style={{ width: 200, padding: 16 }}>
        <ActionsGrid />
      </View>
    </View>
  );
}

return <MobileLayout />;
```

## Troubleshooting

### Text too small on tablets

**Solution**: Use `fs()` function

```typescript
// ❌ Wrong
fontSize: 12

// ✅ Correct
fontSize: fs(12)
```

### Inconsistent padding

**Solution**: Use `spacing()` function

```typescript
// ❌ Wrong
padding: 12

// ✅ Correct
padding: spacing(12)
```

### Pet wrong size on devices

**Solution**: Use device-type-specific sizes

```typescript
// ❌ Wrong
size={420}

// ✅ Correct
const size = {
  mobile: 280,
  mobileLarge: 320,
  tablet: 380,
  desktop: 450,
}[deviceType];
```

## Reference Files

- **Hook**: `src/hooks/useResponsive.ts`
- **Config**: `src/config/responsive.ts`
- **Examples**: `src/screens/FeedScene.tsx`, `src/components/StatusCard.tsx`

## Key Metrics

System based on **iPhone 12 Pro (390px)** as reference:

- **Font scaling**: Capped at 1.3x to prevent huge fonts
- **Spacing scaling**: Capped at 1.2x to maintain balance
- **Base width**: 390px

This means:
- Small phones (iPhone SE): Slightly reduced
- Large phones: Slightly increased
- Tablets: Noticeable increase
- Desktop: Maximum (capped)

## Performance

- Scaling calculations lightweight and cached
- No performance impact on animations or scrolling
- Single hook per component recommended (not per element)

## Platforms

### iOS

- Safe area respected (notches, home indicator)
- Font rendering optimized
- Touch interactions smooth

### Android

- Status bar and nav bar handled
- Different font rendering than iOS
- Gesture handling optimized

### Web

- Window resizing supported
- Browser keyboard considered
- Mouse and touch handled

## Future Enhancements

- Landscape mode support
- Notch/safe area optimization
- OS text size preferences (accessibility)
- Dark/light mode-specific sizes
- Orientation change handling

---

**Last Updated**: 2026-03-04  
**Status**: Production Ready  
**Reference**: iPhone 12 Pro
