# Responsive Design Guide

## Overview

The Pet Care Game uses a responsive design system that automatically adjusts layouts, text sizes, and component dimensions based on device screen width. This ensures the game looks great on phones, tablets, and web browsers.

**Key Principle**: Instead of hardcoding pixel values, we use scaling functions that adapt to each device.

---

## Device Breakpoints

The game recognizes four device types:

| Device Type | Width Range | Examples |
|-------------|-------------|----------|
| **Mobile** | < 428px | iPhone SE, iPhone 12/13/14, most Android phones |
| **Mobile Large** | 428px - 768px | iPhone Pro Max, Galaxy S20 Ultra |
| **Tablet** | 768px - 1280px | iPad, iPad Mini, Android tablets |
| **Desktop** | > 1280px | Web browsers on desktop/laptop |

---

## Quick Start: Using Responsive Utilities

### 1. Import the Hook

```typescript
import { useResponsive } from '../hooks/useResponsive';
```

### 2. Get Device Info and Scaling Functions

```typescript
const { deviceType, wp, hp, fs, spacing } = useResponsive();
```

### 3. Use the Scaling Functions

```typescript
// Width percentage (% of screen width)
const containerWidth = wp(90);  // 90% of screen width

// Height percentage (% of screen height)
const containerHeight = hp(50); // 50% of screen height

// Font size (scales on small screens, capped on large screens)
const titleFont = fs(18);        // Base size 18, scales appropriately
const smallFont = fs(12);        // Base size 12

// Spacing/padding (consistent gaps and margins)
const padding = spacing(16);     // Base size 16, scales with device
const marginTop = spacing(8);    // Base size 8
```

---

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

<PetRenderer pet={pet} size={petSize} />
```

### Pattern 2: Responsive Container

```typescript
const { spacing, wp } = useResponsive();

const containerStyle = {
  paddingHorizontal: spacing(16),  // Padding scales on all devices
  paddingVertical: spacing(12),
  marginBottom: spacing(20),
};
```

### Pattern 3: Responsive Text

```typescript
const { fs } = useResponsive();

const textStyle = {
  fontSize: fs(16),      // Title
  fontWeight: 'bold',
  marginBottom: spacing(8),
};

const subtitleStyle = {
  fontSize: fs(12),      // Subtitle (smaller)
  color: '#666',
};
```

### Pattern 4: Device-Specific Logic

```typescript
const { deviceType } = useResponsive();

// Show different layouts on tablet vs mobile
if (deviceType === 'tablet' || deviceType === 'desktop') {
  return <TabletLayout />;  // Two-column layout
} else {
  return <MobileLayout />;   // Single-column layout
}
```

---

## Scaling Functions Explained

### `wp()` - Width Percentage
Returns a pixel value that is a percentage of screen width.

```typescript
wp(50);   // Half the screen width
wp(100);  // Full screen width (100%)
wp(90);   // 90% of screen width (10px margin on each side)
```

**Use for**: Container widths, card widths, flexible layouts

### `hp()` - Height Percentage
Returns a pixel value that is a percentage of screen height.

```typescript
hp(30);   // 30% of screen height
hp(100);  // Full screen height
```

**Use for**: Container heights, vertical spacing calculations

### `fs()` - Font Size
Scales text based on device width, with automatic capping to prevent huge fonts on large screens.

```typescript
fs(18);   // Scales from ~12px on iPhone SE to ~28px on desktop (capped)
fs(12);   // Scales from ~8px on iPhone SE to ~15px on desktop
fs(28);   // Large heading, scales proportionally
```

**Use for**: All text sizes (headings, body, captions)

### `spacing()` - Spacing/Padding
Scales padding and margins based on device width.

```typescript
spacing(16);  // Standard padding
spacing(8);   // Small spacing
spacing(24);  // Large spacing
```

**Use for**: Padding, margins, gaps between elements

---

## Best Practices

### ✅ DO

- **Use scaling functions for all dimensions**
  ```typescript
  paddingHorizontal: spacing(16),  // ✅ Good
  ```

- **Use `deviceType` for device-specific layouts**
  ```typescript
  const size = deviceType === 'tablet' ? 400 : 280;  // ✅ Good
  ```

- **Use `fs()` for all font sizes**
  ```typescript
  fontSize: fs(14),  // ✅ Good
  ```

- **Combine with StyleSheet for base styles**
  ```typescript
  const baseStyle = { color: '#333' };
  const responsiveStyle = { fontSize: fs(14) };
  <Text style={[baseStyle, responsiveStyle]} />  // ✅ Good
  ```

### ❌ DON'T

- **Hardcode pixel values for dimensions**
  ```typescript
  paddingHorizontal: 16,  // ❌ Won't scale!
  ```

- **Use fixed sizes for pet renderers**
  ```typescript
  <PetRenderer size={420} />  // ❌ Too large on mobile, too small on tablet
  ```

- **Skip font scaling**
  ```typescript
  fontSize: 14,  // ❌ Too small on tablet
  ```

---

## Implementing Responsive Features

### For a New Screen Component

1. **Import the hook**
   ```typescript
   import { useResponsive } from '../hooks/useResponsive';
   ```

2. **Use in component**
   ```typescript
   export const MyNewScreen: React.FC<Props> = ({ navigation }) => {
     const { deviceType, fs, spacing, wp } = useResponsive();

     return (
       <SafeAreaView>
         <Text style={{ fontSize: fs(18), marginBottom: spacing(16) }}>
           My Title
         </Text>
       </SafeAreaView>
     );
   };
   ```

3. **For pet sizes, use the config**
   ```typescript
   import { ACTION_PET_SIZE } from '../config/responsive';

   const petSize = ACTION_PET_SIZE[deviceType];
   <PetRenderer size={petSize} />
   ```

---

## Testing on Different Devices

### iOS Simulator
```bash
# Small iPhone
xcrun simctl openurl booted "simulator://open?device=iPhone%20SE"

# Large iPhone
xcrun simctl openurl booted "simulator://open?device=iPhone%2014%20Pro%20Max"

# iPad
xcrun simctl openurl booted "simulator://open?device=iPad%20Pro"
```

### Android Emulator
- Pixel 4a (small phone)
- Pixel 6 Pro (standard phone)
- Pixel Tablet

### Web Browser
- Resize browser window to test different widths
- Use Chrome DevTools device emulation (F12 → Device Mode)

---

## Device Examples

### iPhone SE (375px width)
- Smallest mobile device
- Pet size: 280px
- Button sizes: Small and compact
- Font sizes: Capped at smaller scales

### iPhone Pro Max (428px width)
- Large mobile device
- Pet size: 320px
- More room for buttons
- Font sizes scale up slightly

### iPad (768-1024px width)
- Tablet device
- Pet size: 380px
- Can use two-column layouts
- Fonts scale to comfortable reading size

### Desktop Browser (1280px+)
- Large screen
- Pet size: 450px
- Can show more information
- Fonts at maximum readable size

---

## Reference Implementation

See these files for working examples:

- **Core Hook**: `src/hooks/useResponsive.ts` - The responsive utilities
- **Constants**: `src/config/responsive.ts` - Predefined sizes for common elements
- **Examples**:
  - `src/screens/VetScene.tsx` - Full responsive scene implementation
  - `src/screens/FeedScene.tsx` - Responsive action screen
  - `src/components/StatusCard.tsx` - Responsive component

---

## Troubleshooting

### Text is too small on tablets
**Solution**: Ensure you're using `fs()` for font sizes
```typescript
// ❌ Wrong
fontSize: 12,

// ✅ Correct
fontSize: fs(12),
```

### Padding is inconsistent
**Solution**: Use `spacing()` for all padding/margins
```typescript
// ❌ Wrong
padding: 12,

// ✅ Correct
padding: spacing(12),
```

### Layouts aren't device-specific
**Solution**: Check the device type and use conditional layouts
```typescript
const { deviceType } = useResponsive();

if (deviceType === 'tablet' || deviceType === 'desktop') {
  return <TabletLayout />;
}
return <MobileLayout />;
```

### Pet is too large/small
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
<PetRenderer size={size} />
```

---

## Key Metrics

The responsive system is built around **iPhone 12 Pro (390px width)** as the reference device. All scaling is calculated relative to this width.

- **Base width**: 390px
- **Font scaling**: Capped at 1.3x to prevent overly large text on huge screens
- **Spacing scaling**: Capped at 1.2x to maintain visual balance

This means:
- Smaller phones (iPhone SE at 375px): Fonts and spacing slightly reduced
- Larger phones (Galaxy S20 Ultra at 412px): Fonts and spacing slightly increased
- Tablets (768px+): Noticeable increase in sizes, optimized for touch
- Desktop (1280px+): Maximum sized, capped to stay readable

---

## Platform Considerations

### iOS
- Safe area respected (notches, home indicator)
- Font rendering slightly different than Android
- Use `useBottomTabBarHeight()` for tab bar calculations

### Android
- Status bar and navigation bar considerations
- Font rendering slightly different than iOS
- Gesture handling differences

### Web
- Keyboard may appear/disappear
- Mouse vs touch interaction
- Window resizing supported
- Consider responsive design for browser windows (Firefox, Chrome, Safari)

---

## Future Enhancements

Potential improvements to the responsive system:

1. **Landscape mode support** - Handle device rotations
2. **Notch/Safe area detection** - Better handling of display cutouts
3. **Accessibility scaling** - Respect OS text size preferences
4. **Performance optimization** - Cache scaling calculations
5. **Theme-aware sizes** - Different sizes for dark/light modes

---

## Resources

- **Technical Details**: See `160126-responsivity.md` for implementation specifics
- **Responsive Hook**: `src/hooks/useResponsive.ts`
- **Responsive Config**: `src/config/responsive.ts`
- **React Native Docs**: [useWindowDimensions](https://reactnative.dev/docs/usewindowdimensions)

---

**Last Updated**: 2026-01-17
**Status**: ✅ Production Ready
**Maintained by**: Pet Care Game Development Team
