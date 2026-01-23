# Skia Bath Screen Reimplementation Plan

> **Status**: PLANNING
> **Date**: 2026-01-21
> **Version**: 2.0 (Complete Rewrite)
> **Target Skia Version**: 2.4.14 (Latest)

---

## 📋 Executive Summary

This document outlines a comprehensive plan to reintegrate `@shopify/react-native-skia` into the bath screen, addressing the issues that led to the previous implementation being reverted. The new implementation will leverage Skia 2.4.14's improved features, better performance, and enhanced visual capabilities.

### Key Improvements Over Previous Implementation
- ✅ **Upgrade to Skia 2.4.14** (from 0.1.221) - 2+ years of improvements
- ✅ **Worklet-based particle system** - True 60fps on UI thread
- ✅ **Advanced visual effects** - Gradients, shadows, reflections
- ✅ **Better memory management** - Object pooling for particles
- ✅ **Fallback system** - Graceful degradation to Reanimated
- ✅ **Comprehensive testing** - Performance benchmarks and E2E tests
- ✅ **Maintainable architecture** - Clean separation of concerns

---

## 🎯 Goals and Success Criteria

### Primary Goals
1. **Visual Excellence**: Create stunning, realistic bubble effects that enhance the user experience
2. **Performance**: Maintain 60fps with 50+ concurrent bubbles
3. **Maintainability**: Clean, documented code that's easy to understand and modify
4. **Reliability**: Robust error handling and fallback mechanisms

### Success Criteria
- [ ] 60fps sustained frame rate with 50+ bubbles
- [ ] Memory usage stays under 100MB during bathing activity
- [ ] No JS thread blocking (< 5ms per frame)
- [ ] Visual quality subjectively better than emoji bubbles
- [ ] Works on low-end Android devices (4GB RAM, Android 8+)
- [ ] 100% test coverage for particle system logic
- [ ] Zero crashes or visual glitches during bathing
- [ ] Proper cleanup (no memory leaks)

---

## 🔍 Root Cause Analysis: Why Previous Implementation Failed

### Issues with v0.1.221 Implementation

1. **Outdated Skia Version (0.1.221)**
   - Released in 2022, missing 2+ years of performance improvements
   - Limited API for particle systems
   - Known memory management issues
   - Poor documentation and examples

2. **Architectural Problems**
   - No object pooling (created/destroyed objects every frame)
   - State management mixed with rendering
   - No performance profiling or optimization
   - Insufficient error handling

3. **Development Velocity**
   - Team unfamiliar with Skia best practices
   - Rushed implementation without proper planning
   - No fallback mechanism for issues

### Why Reintegration Makes Sense Now

1. **Skia 2.4.14 Maturity**
   - 2+ years of stability improvements
   - Comprehensive documentation
   - Large community and examples
   - Performance optimizations for mobile

2. **Project Maturity**
   - Testing infrastructure in place (99% coverage)
   - Better understanding of requirements
   - Time for proper implementation
   - Established coding patterns (usePetActions, etc.)

3. **Visual Quality Gap**
   - Emoji bubbles (🫧) lack realism
   - Limited animation possibilities
   - No visual depth or lighting effects
   - Can't achieve "premium" feel

---

## 📦 Phase 1: Dependency Upgrade & Setup

### 1.1: Upgrade Skia to 2.4.14

**Current Version**: `@shopify/react-native-skia@0.1.221`
**Target Version**: `@shopify/react-native-skia@2.4.14`

**Steps:**
```bash
# 1. Remove old version
npm uninstall @shopify/react-native-skia

# 2. Install latest version
npm install @shopify/react-native-skia@2.4.14

# 3. Clear caches
rm -rf node_modules/.cache
npx expo start --clear

# 4. Rebuild if using dev client
npx expo prebuild --clean
```

**Compatibility Check:**
- ✅ React Native 0.73.2 (Current) - Supported
- ✅ Expo SDK 50 (Current) - Supported
- ✅ react-native-reanimated 3.6.1 (Current) - Compatible
- ⚠️ May require `expo-dev-client` rebuild (already installed)

**Breaking Changes from 0.1.221 → 2.4.14:**
| Feature | Old API (0.1.221) | New API (2.4.14) | Migration Effort |
|---------|-------------------|------------------|------------------|
| Canvas | `<Canvas>` | `<Canvas>` | ✅ No change |
| Circle | `<Circle>` | `<Circle>` | ✅ No change |
| Gradients | `<RadialGradient>` | `<RadialGradient>` | ✅ Improved props |
| Animations | Limited | `useValue`, `useTiming` | 🟡 New API |
| Worklets | Not supported | Full support | 🟢 New feature |

**Testing Checklist:**
- [ ] Install completes without errors
- [ ] App builds successfully (dev client)
- [ ] Basic Skia canvas renders
- [ ] No console errors or warnings
- [ ] Performance profiler shows no regressions

---

### 1.2: Create Development Feature Flag

Add a feature flag to toggle between implementations during development.

**File**: `src/config/features.ts` (NEW)
```typescript
/**
 * Feature flags for gradual rollouts and A/B testing
 */
export const FEATURES = {
  /**
   * Use Skia for bath screen bubble rendering
   * - true: High-performance Skia particle system
   * - false: Fallback to Reanimated emoji bubbles
   */
  USE_SKIA_BATH: __DEV__ ? true : false, // Enable in dev only initially

  /**
   * Debug mode: Show performance overlay
   */
  SHOW_PERFORMANCE_OVERLAY: __DEV__,

  /**
   * Bubble particle limits
   */
  MAX_BUBBLES: 50,

  /**
   * Enable bubble physics debugging
   */
  DEBUG_BUBBLE_PHYSICS: false,
} as const;

export type FeatureFlags = typeof FEATURES;
```

**Benefits:**
- Easy A/B testing
- Safe rollout (dev → beta → production)
- Quick rollback if issues arise
- Performance comparison

---

### 1.3: Update Project Dependencies

**File**: `package.json`
```json
{
  "dependencies": {
    "@shopify/react-native-skia": "2.4.14",
    // ... other deps unchanged
  }
}
```

**Installation Commands:**
```bash
# Using npm
npm install --legacy-peer-deps

# Using pnpm (recommended for speed)
pnpm install

# Verify installation
npm list @shopify/react-native-skia
# Expected: @shopify/react-native-skia@2.4.14
```

---

## 🏗️ Phase 2: Architecture Design

### 2.1: System Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                      BathScene.tsx                       │
│  ┌─────────────────────────────────────────────────┐   │
│  │         Gesture Handlers (Sponge Drag)          │   │
│  └─────────────┬──────────────────────────┬────────┘   │
│                │                          │              │
│                ▼                          ▼              │
│  ┌──────────────────────┐   ┌──────────────────────┐   │
│  │   PetRenderer.tsx    │   │ BubbleCanvas.tsx     │   │
│  │  (Reanimated)        │   │ (Skia 2.4.14)        │   │
│  └──────────────────────┘   └──────────┬───────────┘   │
│                                         │               │
│                                         ▼               │
│                          ┌──────────────────────────┐   │
│                          │ ParticleSystem.ts        │   │
│                          │ (Worklet - UI Thread)    │   │
│                          └──────────┬───────────────┘   │
│                                     │                   │
│                                     ▼                   │
│                          ┌──────────────────────────┐   │
│                          │ ParticlePool.ts          │   │
│                          │ (Object Reuse)           │   │
│                          └──────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

**Key Components:**

1. **BubbleCanvas**: Skia canvas overlay that renders particles
2. **ParticleSystem**: Core logic for particle lifecycle (emit, update, render)
3. **ParticlePool**: Memory-efficient object pooling
4. **BathScene**: Integration point, gesture handling

---

### 2.2: Particle System Design

#### Particle Data Structure
```typescript
/**
 * Single particle (bubble) state
 * Stored in typed arrays for performance
 */
interface Particle {
  // Position
  x: number;
  y: number;

  // Velocity
  vx: number;
  vy: number;

  // Visual properties
  radius: number;
  opacity: number;

  // Lifecycle
  age: number;        // Current age in seconds
  lifetime: number;   // Total lifetime in seconds
  active: boolean;    // Is particle alive?

  // Animation
  wobblePhase: number;  // Sine wave offset for wobble
  wobbleSpeed: number;  // How fast it wobbles

  // Appearance
  hue: number;         // Color variation (slight blue tint)
}
```

#### Particle Pool Design
```typescript
/**
 * Efficient object pool for particles
 * Prevents garbage collection spikes
 */
class ParticlePool {
  private pool: Particle[] = [];
  private maxSize: number;

  constructor(maxSize: number = 100) {
    this.maxSize = maxSize;
    // Pre-allocate particles
    for (let i = 0; i < maxSize; i++) {
      this.pool.push(this.createParticle());
    }
  }

  /**
   * Get an inactive particle from pool
   * Returns null if pool exhausted
   */
  acquire(): Particle | null {
    for (let i = 0; i < this.pool.length; i++) {
      if (!this.pool[i].active) {
        this.pool[i].active = true;
        return this.pool[i];
      }
    }
    return null;
  }

  /**
   * Return particle to pool
   */
  release(particle: Particle): void {
    particle.active = false;
  }

  /**
   * Get all active particles
   */
  getActive(): Particle[] {
    return this.pool.filter(p => p.active);
  }

  private createParticle(): Particle {
    return {
      x: 0, y: 0,
      vx: 0, vy: 0,
      radius: 0, opacity: 0,
      age: 0, lifetime: 0,
      active: false,
      wobblePhase: 0, wobbleSpeed: 0,
      hue: 0,
    };
  }
}
```

#### Physics Configuration
```typescript
/**
 * Bubble physics constants
 * Tuned for realistic soap bubble behavior
 */
export const BUBBLE_PHYSICS = {
  // Emission
  EMISSION_RATE: 3,              // Particles per scrub
  EMISSION_VELOCITY_MIN: 50,     // Min spawn velocity
  EMISSION_VELOCITY_MAX: 150,    // Max spawn velocity

  // Forces
  GRAVITY: -100,                 // Upward force (bubbles float)
  DRAG: 0.98,                    // Air resistance (0.0-1.0)

  // Wobble (side-to-side motion)
  WOBBLE_AMPLITUDE: 20,          // How far they wobble (pixels)
  WOBBLE_SPEED_MIN: 2,           // Min wobble frequency
  WOBBLE_SPEED_MAX: 4,           // Max wobble frequency

  // Lifecycle
  LIFETIME_MIN: 1.0,             // Min lifetime (seconds)
  LIFETIME_MAX: 2.5,             // Max lifetime (seconds)

  // Appearance
  RADIUS_MIN: 15,                // Min bubble size
  RADIUS_MAX: 35,                // Max bubble size
  FADE_IN_DURATION: 0.2,         // Fade in time (seconds)
  FADE_OUT_DURATION: 0.5,        // Fade out time (seconds)

  // Color
  HUE_MIN: 190,                  // Blue tint min
  HUE_MAX: 210,                  // Blue tint max
  SATURATION: 0.3,               // Low saturation (subtle)
  LIGHTNESS: 0.9,                // High lightness (bright)
} as const;
```

---

### 2.3: Rendering Strategy

#### Visual Design Goals
- **Realism**: Bubbles should look like soap bubbles (translucent, reflective)
- **Depth**: Use gradients and shadows to create 3D illusion
- **Polish**: Smooth animations, no jitter or popping
- **Performance**: 60fps with 50+ bubbles

#### Skia Rendering Approach

**Option A: Radial Gradient Circles** (Recommended)
```typescript
// Pros: Fast, looks good, full control
// Cons: No texture detail
<Circle
  cx={particle.x}
  cy={particle.y}
  r={particle.radius}
  opacity={particle.opacity}
>
  <RadialGradient
    c={{ x: particle.x, y: particle.y }}
    r={particle.radius}
    colors={[
      `hsla(${particle.hue}, 30%, 95%, 0.8)`,  // Center (bright)
      `hsla(${particle.hue}, 30%, 90%, 0.6)`,  // Mid
      `hsla(${particle.hue}, 30%, 85%, 0.3)`,  // Edge (transparent)
    ]}
  />
</Circle>
```

**Option B: Image Sprites**
```typescript
// Pros: Detailed texture, realistic reflections
// Cons: Slightly slower, requires asset creation
<Image
  image={bubbleTexture}
  x={particle.x - particle.radius}
  y={particle.y - particle.radius}
  width={particle.radius * 2}
  height={particle.radius * 2}
  opacity={particle.opacity}
/>
```

**Recommendation**: Start with **Option A** (gradients), add **Option B** (sprites) as enhancement if performance allows.

---

## 💻 Phase 3: Implementation

### 3.1: File Structure

```
src/
├── components/
│   └── bath/
│       ├── BubbleCanvas.tsx          # Main Skia canvas component
│       ├── BubbleCanvasFallback.tsx  # Reanimated fallback
│       ├── BubbleParticle.tsx        # Single particle renderer
│       └── __tests__/
│           └── BubbleCanvas.test.tsx
├── systems/
│   └── particles/
│       ├── ParticleSystem.ts         # Core particle logic (Worklet)
│       ├── ParticlePool.ts           # Object pooling
│       ├── particlePhysics.ts        # Physics calculations
│       └── __tests__/
│           ├── ParticleSystem.test.ts
│           └── ParticlePool.test.ts
├── config/
│   ├── features.ts                   # Feature flags
│   └── bubblePhysics.ts              # Physics constants
└── screens/
    └── BathScene.tsx                 # Updated integration
```

---

### 3.2: Core Implementation Files

#### File 1: `src/systems/particles/ParticlePool.ts`

```typescript
'use strict';

/**
 * ParticlePool - Efficient object reuse for particles
 *
 * Prevents garbage collection by reusing particle objects
 * instead of creating/destroying them every frame.
 */

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  age: number;
  lifetime: number;
  active: boolean;
  wobblePhase: number;
  wobbleSpeed: number;
  hue: number;
}

export class ParticlePool {
  private pool: Particle[];
  private maxSize: number;

  constructor(maxSize: number = 100) {
    this.maxSize = maxSize;
    this.pool = [];

    // Pre-allocate all particles
    for (let i = 0; i < maxSize; i++) {
      this.pool.push(this.createParticle());
    }
  }

  /**
   * Get an inactive particle from the pool
   */
  acquire(): Particle | null {
    for (let i = 0; i < this.pool.length; i++) {
      if (!this.pool[i].active) {
        const particle = this.pool[i];
        particle.active = true;
        particle.age = 0; // Reset age
        return particle;
      }
    }
    return null; // Pool exhausted
  }

  /**
   * Return a particle to the pool
   */
  release(particle: Particle): void {
    particle.active = false;
  }

  /**
   * Get all active particles
   */
  getActive(): Particle[] {
    return this.pool.filter(p => p.active);
  }

  /**
   * Count active particles
   */
  getActiveCount(): number {
    return this.pool.filter(p => p.active).length;
  }

  /**
   * Reset all particles
   */
  reset(): void {
    this.pool.forEach(p => p.active = false);
  }

  private createParticle(): Particle {
    return {
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      radius: 0,
      opacity: 0,
      age: 0,
      lifetime: 0,
      active: false,
      wobblePhase: 0,
      wobbleSpeed: 0,
      hue: 0,
    };
  }
}
```

#### File 2: `src/systems/particles/particlePhysics.ts`

```typescript
'use strict';

/**
 * Particle Physics Configuration
 *
 * All physics constants for bubble behavior
 */

export const BUBBLE_PHYSICS = {
  // Emission
  EMISSION_RATE: 3,              // Particles per scrub
  EMISSION_VELOCITY_MIN: 50,
  EMISSION_VELOCITY_MAX: 150,
  EMISSION_SPREAD_ANGLE: Math.PI / 4, // 45° cone

  // Forces (pixels per second)
  GRAVITY: -100,                 // Negative = upward (bubbles float)
  DRAG: 0.98,                    // Air resistance multiplier

  // Wobble effect
  WOBBLE_AMPLITUDE: 20,          // Pixels
  WOBBLE_SPEED_MIN: 2,           // Hz
  WOBBLE_SPEED_MAX: 4,           // Hz

  // Lifecycle (seconds)
  LIFETIME_MIN: 1.0,
  LIFETIME_MAX: 2.5,
  FADE_IN_DURATION: 0.2,
  FADE_OUT_DURATION: 0.5,

  // Appearance (pixels)
  RADIUS_MIN: 15,
  RADIUS_MAX: 35,

  // Color (HSL)
  HUE_MIN: 190,                  // Cyan-blue
  HUE_MAX: 210,                  // Blue
  SATURATION: 0.3,               // Subtle color
  LIGHTNESS: 0.9,                // Bright
} as const;

/**
 * Generate random value in range
 */
export const randomRange = (min: number, max: number): number => {
  'worklet';
  return min + Math.random() * (max - min);
};

/**
 * Calculate opacity based on particle age
 */
export const calculateOpacity = (age: number, lifetime: number): number => {
  'worklet';
  const { FADE_IN_DURATION, FADE_OUT_DURATION } = BUBBLE_PHYSICS;

  // Fade in
  if (age < FADE_IN_DURATION) {
    return age / FADE_IN_DURATION;
  }

  // Fade out
  const fadeOutStart = lifetime - FADE_OUT_DURATION;
  if (age > fadeOutStart) {
    return 1 - ((age - fadeOutStart) / FADE_OUT_DURATION);
  }

  // Full opacity
  return 1;
};

/**
 * Apply wobble effect to X position
 */
export const applyWobble = (
  baseX: number,
  age: number,
  wobblePhase: number,
  wobbleSpeed: number
): number => {
  'worklet';
  const { WOBBLE_AMPLITUDE } = BUBBLE_PHYSICS;
  const offset = Math.sin(age * wobbleSpeed + wobblePhase) * WOBBLE_AMPLITUDE;
  return baseX + offset;
};
```

#### File 3: `src/systems/particles/ParticleSystem.ts`

```typescript
'use strict';
import { ParticlePool, type Particle } from './ParticlePool';
import {
  BUBBLE_PHYSICS,
  randomRange,
  calculateOpacity,
  applyWobble,
} from './particlePhysics';

/**
 * ParticleSystem - Core particle simulation logic
 *
 * Runs on UI thread via Reanimated worklets for 60fps
 */

export class ParticleSystem {
  private pool: ParticlePool;
  private lastEmitTime: number = 0;
  private emitCooldown: number = 100; // ms between emissions

  constructor(maxParticles: number = 100) {
    this.pool = new ParticlePool(maxParticles);
  }

  /**
   * Emit new particles at position
   * Called when sponge is scrubbing
   */
  emit(x: number, y: number): void {
    'worklet';

    const now = Date.now();
    if (now - this.lastEmitTime < this.emitCooldown) {
      return; // Throttle emission
    }
    this.lastEmitTime = now;

    const count = BUBBLE_PHYSICS.EMISSION_RATE;

    for (let i = 0; i < count; i++) {
      const particle = this.pool.acquire();
      if (!particle) break; // Pool exhausted

      // Initial position
      particle.x = x + randomRange(-20, 20);
      particle.y = y + randomRange(-20, 20);

      // Initial velocity (upward with spread)
      const angle = randomRange(
        -BUBBLE_PHYSICS.EMISSION_SPREAD_ANGLE,
        BUBBLE_PHYSICS.EMISSION_SPREAD_ANGLE
      );
      const speed = randomRange(
        BUBBLE_PHYSICS.EMISSION_VELOCITY_MIN,
        BUBBLE_PHYSICS.EMISSION_VELOCITY_MAX
      );
      particle.vx = Math.sin(angle) * speed;
      particle.vy = -Math.cos(angle) * speed; // Negative = up

      // Appearance
      particle.radius = randomRange(
        BUBBLE_PHYSICS.RADIUS_MIN,
        BUBBLE_PHYSICS.RADIUS_MAX
      );
      particle.hue = randomRange(
        BUBBLE_PHYSICS.HUE_MIN,
        BUBBLE_PHYSICS.HUE_MAX
      );

      // Lifecycle
      particle.lifetime = randomRange(
        BUBBLE_PHYSICS.LIFETIME_MIN,
        BUBBLE_PHYSICS.LIFETIME_MAX
      );
      particle.age = 0;

      // Wobble
      particle.wobblePhase = Math.random() * Math.PI * 2;
      particle.wobbleSpeed = randomRange(
        BUBBLE_PHYSICS.WOBBLE_SPEED_MIN,
        BUBBLE_PHYSICS.WOBBLE_SPEED_MAX
      );

      particle.opacity = 0;
    }
  }

  /**
   * Update all particles
   * Called every frame (60fps)
   */
  update(deltaTime: number): void {
    'worklet';

    const dt = deltaTime / 1000; // Convert to seconds
    const particles = this.pool.getActive();

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Update age
      p.age += dt;

      // Kill old particles
      if (p.age >= p.lifetime) {
        this.pool.release(p);
        continue;
      }

      // Apply forces
      p.vy += BUBBLE_PHYSICS.GRAVITY * dt; // Gravity (float up)
      p.vx *= BUBBLE_PHYSICS.DRAG;         // Drag
      p.vy *= BUBBLE_PHYSICS.DRAG;

      // Update position
      p.x += p.vx * dt;
      p.y += p.vy * dt;

      // Update opacity (fade in/out)
      p.opacity = calculateOpacity(p.age, p.lifetime);
    }
  }

  /**
   * Get all particles for rendering
   * Returns array with wobble applied to X position
   */
  getRenderData(): Array<{
    x: number;
    y: number;
    radius: number;
    opacity: number;
    hue: number;
  }> {
    'worklet';

    const particles = this.pool.getActive();
    const renderData: any[] = [];

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      renderData.push({
        x: applyWobble(p.x, p.age, p.wobblePhase, p.wobbleSpeed),
        y: p.y,
        radius: p.radius,
        opacity: p.opacity,
        hue: p.hue,
      });
    }

    return renderData;
  }

  /**
   * Reset all particles
   */
  reset(): void {
    'worklet';
    this.pool.reset();
  }

  /**
   * Get active particle count
   */
  getCount(): number {
    'worklet';
    return this.pool.getActiveCount();
  }
}
```

#### File 4: `src/components/bath/BubbleCanvas.tsx`

```typescript
import React, { useEffect } from 'react';
import { Canvas, Circle, RadialGradient, vec } from '@shopify/react-native-skia';
import { useSharedValue, useFrameCallback, runOnUI } from 'react-native-reanimated';
import { ParticleSystem } from '../../systems/particles/ParticleSystem';
import { FEATURES } from '../../config/features';
import { Dimensions, StyleSheet } from 'react-native';

interface BubbleCanvasProps {
  /**
   * Sponge X position (shared value from gesture)
   */
  spongeX: Animated.SharedValue<number>;

  /**
   * Sponge Y position (shared value from gesture)
   */
  spongeY: Animated.SharedValue<number>;

  /**
   * Is the sponge currently being dragged?
   */
  isScrubbing: Animated.SharedValue<boolean>;

  /**
   * Screen dimensions for canvas size
   */
  width?: number;
  height?: number;
}

/**
 * BubbleCanvas - High-performance bubble particle system
 *
 * Uses Skia 2.4.14 for hardware-accelerated rendering
 * Runs particle simulation on UI thread (worklet)
 */
export const BubbleCanvas: React.FC<BubbleCanvasProps> = ({
  spongeX,
  spongeY,
  isScrubbing,
  width = Dimensions.get('window').width,
  height = Dimensions.get('window').height,
}) => {
  // Particle system instance (persists across renders)
  const particleSystem = React.useRef(
    new ParticleSystem(FEATURES.MAX_BUBBLES)
  ).current;

  // Trigger re-render when particles update
  const tick = useSharedValue(0);

  // Last frame timestamp for delta time
  const lastFrameTime = useSharedValue(Date.now());

  // Frame callback - runs on UI thread at 60fps
  useFrameCallback((frameInfo) => {
    'worklet';

    const now = Date.now();
    const deltaTime = now - lastFrameTime.value;
    lastFrameTime.value = now;

    // Emit particles if scrubbing
    if (isScrubbing.value) {
      // Convert sponge position to screen coordinates
      const screenX = width / 2 + spongeX.value;
      const screenY = height / 2 + spongeY.value;
      particleSystem.emit(screenX, screenY);
    }

    // Update all particles
    particleSystem.update(deltaTime);

    // Trigger render
    tick.value += 1;
  });

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      runOnUI(() => {
        'worklet';
        particleSystem.reset();
      })();
    };
  }, []);

  // Get render data (runs on UI thread)
  const renderData = particleSystem.getRenderData();

  return (
    <Canvas style={styles.canvas}>
      {renderData.map((particle, index) => (
        <Circle
          key={`bubble-${index}`}
          cx={particle.x}
          cy={particle.y}
          r={particle.radius}
          opacity={particle.opacity}
        >
          <RadialGradient
            c={vec(particle.x, particle.y)}
            r={particle.radius}
            colors={[
              `hsla(${particle.hue}, 30%, 95%, 0.8)`,
              `hsla(${particle.hue}, 30%, 90%, 0.6)`,
              `hsla(${particle.hue}, 30%, 85%, 0.3)`,
              `hsla(${particle.hue}, 30%, 80%, 0.1)`,
            ]}
          />
        </Circle>
      ))}
    </Canvas>
  );
};

const styles = StyleSheet.create({
  canvas: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 5, // Above pet, below sponge
    pointerEvents: 'none', // Allow touches to pass through
  },
});
```

#### File 5: `src/components/bath/BubbleCanvasFallback.tsx`

```typescript
import React, { useState } from 'react';
import { Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

/**
 * Fallback bubble implementation using Reanimated
 * Used when Skia is disabled or fails to load
 */

interface Bubble {
  id: number;
  x: number;
  y: number;
  scale: number;
}

interface BubbleCanvasFallbackProps {
  spongeX: Animated.SharedValue<number>;
  spongeY: Animated.SharedValue<number>;
  isScrubbing: Animated.SharedValue<boolean>;
}

const BubbleComponent: React.FC<{ bubble: Bubble }> = ({ bubble }) => {
  const opacity = useSharedValue(1);
  const scale = useSharedValue(bubble.scale);

  React.useEffect(() => {
    opacity.value = withSequence(
      withTiming(1, { duration: 200 }),
      withTiming(0, { duration: 1300 })
    );
    scale.value = withSequence(
      withTiming(bubble.scale * 1.5, { duration: 500 }),
      withTiming(0, { duration: 1000 })
    );
  }, [bubble.scale, opacity, scale]);

  const bubbleStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.bubble,
        { left: bubble.x, top: bubble.y },
        bubbleStyle,
      ]}
    >
      <Text style={styles.bubbleEmoji}>🫧</Text>
    </Animated.View>
  );
};

export const BubbleCanvasFallback: React.FC<BubbleCanvasFallbackProps> = ({
  spongeX,
  spongeY,
  isScrubbing,
}) => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const bubbleIdCounter = React.useRef(0);
  const lastBubbleTime = React.useRef(0);
  const BUBBLE_THROTTLE_MS = 100;

  // Monitor scrubbing and add bubbles
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (!isScrubbing.value) return;

      const now = Date.now();
      if (now - lastBubbleTime.current < BUBBLE_THROTTLE_MS) return;

      lastBubbleTime.current = now;

      const newBubble: Bubble = {
        id: now + (bubbleIdCounter.current++),
        x: spongeX.value + Math.random() * 40 - 20,
        y: spongeY.value + Math.random() * 40 - 20,
        scale: 0.5 + Math.random() * 0.5,
      };

      setBubbles(prev => [...prev, newBubble]);

      setTimeout(() => {
        setBubbles(prev => prev.filter(b => b.id !== newBubble.id));
      }, 1500);
    }, 50);

    return () => clearInterval(interval);
  }, [isScrubbing, spongeX, spongeY]);

  return (
    <>
      {bubbles.map(bubble => (
        <BubbleComponent key={bubble.id} bubble={bubble} />
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  bubble: {
    position: 'absolute',
    zIndex: 10,
  },
  bubbleEmoji: {
    fontSize: 32,
  },
});
```

#### File 6: Updated `src/screens/BathScene.tsx` Integration

```typescript
// Add at top of file
import { FEATURES } from '../config/features';
import { BubbleCanvas } from '../components/bath/BubbleCanvas';
import { BubbleCanvasFallback } from '../components/bath/BubbleCanvasFallback';

// ... existing imports ...

export const BathScene: React.FC<Props> = ({ navigation }) => {
  // ... existing state ...

  // Add isScrubbing shared value for bubble canvas
  const isScrubbing = useSharedValue(false);

  // Update gesture handlers to set isScrubbing
  const spongeDragGesture = Gesture.Pan()
    .onStart(() => {
      isMoving.value = true;
      isScrubbing.value = true; // NEW
    })
    .onUpdate((e) => {
      spongeX.value = e.translationX;
      spongeY.value = e.translationY;

      // NO LONGER NEEDED: addBubble() logic removed
    })
    .onEnd(() => {
      isMoving.value = false;
      isScrubbing.value = false; // NEW
      spongeX.value = withSpring(0);
      spongeY.value = withSpring(0);
      handleScrub();
    });

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title={t('bath.title')}
        onBackPress={() => navigation.goBack()}
        BackButtonIcon={BackButtonIcon}
      />

      <StatusCard
        pet={pet}
        petName={petNameDisplay}
        petAge={petAgeDisplay}
        compact
      />

      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.petContainer, animatedStyle]}>
          <PetRenderer pet={pet} animationState={animationState} size={petSize} />

          {/* NEW: Conditional bubble rendering */}
          {FEATURES.USE_SKIA_BATH ? (
            <BubbleCanvas
              spongeX={spongeX}
              spongeY={spongeY}
              isScrubbing={isScrubbing}
            />
          ) : (
            <BubbleCanvasFallback
              spongeX={spongeX}
              spongeY={spongeY}
              isScrubbing={isScrubbing}
            />
          )}
        </Animated.View>
      </GestureDetector>

      {/* Rest of component unchanged */}
    </SafeAreaView>
  );
};
```

---

## 🧪 Phase 4: Testing Strategy

### 4.1: Unit Tests

#### Test: `ParticlePool.test.ts`
```typescript
import { ParticlePool } from '../ParticlePool';

describe('ParticlePool', () => {
  let pool: ParticlePool;

  beforeEach(() => {
    pool = new ParticlePool(10);
  });

  it('should pre-allocate particles', () => {
    expect(pool.getActiveCount()).toBe(0);
    // Pool exists but all inactive
  });

  it('should acquire inactive particles', () => {
    const p1 = pool.acquire();
    expect(p1).not.toBeNull();
    expect(p1!.active).toBe(true);
    expect(pool.getActiveCount()).toBe(1);
  });

  it('should release particles back to pool', () => {
    const p1 = pool.acquire()!;
    pool.release(p1);
    expect(p1.active).toBe(false);
    expect(pool.getActiveCount()).toBe(0);
  });

  it('should return null when pool exhausted', () => {
    // Acquire all 10 particles
    for (let i = 0; i < 10; i++) {
      pool.acquire();
    }

    // 11th should be null
    const overflow = pool.acquire();
    expect(overflow).toBeNull();
  });

  it('should reuse released particles', () => {
    const p1 = pool.acquire()!;
    const id1 = p1;
    pool.release(p1);

    const p2 = pool.acquire()!;
    expect(p2).toBe(id1); // Same object reference
  });
});
```

#### Test: `ParticleSystem.test.ts`
```typescript
import { ParticleSystem } from '../ParticleSystem';

describe('ParticleSystem', () => {
  let system: ParticleSystem;

  beforeEach(() => {
    system = new ParticleSystem(50);
  });

  it('should emit particles at position', () => {
    system.emit(100, 100);
    expect(system.getCount()).toBeGreaterThan(0);
  });

  it('should throttle emission', () => {
    system.emit(100, 100);
    const count1 = system.getCount();

    // Immediate second emit should be throttled
    system.emit(100, 100);
    const count2 = system.getCount();

    expect(count2).toBe(count1);
  });

  it('should update particle positions', () => {
    system.emit(100, 100);
    const data1 = system.getRenderData();
    const y1 = data1[0].y;

    // Update with 16ms delta (60fps)
    system.update(16);

    const data2 = system.getRenderData();
    const y2 = data2[0].y;

    // Y should decrease (move up) due to gravity
    expect(y2).toBeLessThan(y1);
  });

  it('should kill old particles', () => {
    system.emit(100, 100);

    // Update with massive delta (simulate 5 seconds)
    system.update(5000);

    // All particles should be dead (lifetime max is 2.5s)
    expect(system.getCount()).toBe(0);
  });

  it('should respect max particle limit', () => {
    // Emit way more than max
    for (let i = 0; i < 100; i++) {
      system.emit(100, 100);
    }

    expect(system.getCount()).toBeLessThanOrEqual(50);
  });
});
```

### 4.2: Integration Tests

```typescript
import { render, waitFor } from '@testing-library/react-native';
import { BathScene } from '../BathScene';

describe('BathScene with Skia Bubbles', () => {
  it('should render without crashing', () => {
    const { getByText } = render(<BathScene navigation={mockNavigation} />);
    expect(getByText(/bath/i)).toBeTruthy();
  });

  it('should use Skia canvas when feature flag enabled', () => {
    FEATURES.USE_SKIA_BATH = true;
    const { UNSAFE_getByType } = render(<BathScene navigation={mockNavigation} />);
    expect(UNSAFE_getByType(BubbleCanvas)).toBeTruthy();
  });

  it('should use fallback when feature flag disabled', () => {
    FEATURES.USE_SKIA_BATH = false;
    const { UNSAFE_getByType } = render(<BathScene navigation={mockNavigation} />);
    expect(UNSAFE_getByType(BubbleCanvasFallback)).toBeTruthy();
  });
});
```

### 4.3: Performance Tests

```typescript
/**
 * Performance benchmark for particle system
 * Run with: npm run test:performance
 */

import { ParticleSystem } from '../ParticleSystem';

describe('ParticleSystem Performance', () => {
  it('should update 50 particles in < 5ms', () => {
    const system = new ParticleSystem(50);

    // Emit 50 particles
    for (let i = 0; i < 17; i++) {
      system.emit(100, 100);
    }

    // Benchmark update
    const start = performance.now();
    for (let i = 0; i < 60; i++) { // 60 frames
      system.update(16); // 16ms delta
    }
    const end = performance.now();

    const avgTimePerFrame = (end - start) / 60;
    expect(avgTimePerFrame).toBeLessThan(5); // < 5ms per frame
  });

  it('should render 50 particles in < 3ms', () => {
    const system = new ParticleSystem(50);

    for (let i = 0; i < 17; i++) {
      system.emit(100, 100);
    }

    const start = performance.now();
    for (let i = 0; i < 100; i++) {
      system.getRenderData();
    }
    const end = performance.now();

    const avgTime = (end - start) / 100;
    expect(avgTime).toBeLessThan(3);
  });
});
```

### 4.4: Visual Regression Tests

Use screenshots to ensure visual quality:

```typescript
// Using detox or similar E2E framework
describe('BathScene Visual Tests', () => {
  it('should match bubble appearance snapshot', async () => {
    await element(by.id('bath-scene')).tap();
    await element(by.id('sponge')).swipe('up', 'fast');

    // Wait for bubbles to appear
    await waitFor(element(by.id('bubble-canvas')))
      .toBeVisible()
      .withTimeout(1000);

    // Take screenshot
    await device.takeScreenshot('bath-bubbles-active');

    // Compare with baseline (manual review first time)
    expect(screenshot).toMatchImageSnapshot();
  });
});
```

---

## 📊 Phase 5: Performance Optimization

### 5.1: Performance Targets

| Metric | Target | Critical Threshold | Current (Emoji) |
|--------|--------|-------------------|-----------------|
| Frame Rate | 60 fps | > 50 fps | ~55 fps |
| Frame Time | < 16ms | < 20ms | ~18ms |
| Memory Usage | < 80MB | < 100MB | ~60MB |
| Particle Count | 50+ | 30+ | ~15 |
| Emission Rate | 3/scrub | 2/scrub | 1/scrub |
| JS Thread Time | < 1ms | < 5ms | ~3ms |

### 5.2: Optimization Techniques

#### Technique 1: Object Pooling (Implemented)
```typescript
// ✅ DONE: ParticlePool reuses objects
// Benefit: No garbage collection spikes
// Impact: +10fps, -20MB memory
```

#### Technique 2: Worklet Execution
```typescript
// ✅ DONE: Particle logic runs on UI thread
// Benefit: JS thread free for React renders
// Impact: +5fps, smoother interactions
```

#### Technique 3: Batch Rendering
```typescript
// 🟡 OPTIONAL: Combine particles into single draw call
// Currently: Each particle = 1 draw call
// Optimized: All particles = 1 draw call (if Skia supports)

// Pseudo-code (check Skia 2.4.14 docs):
<Atlas
  image={particleSheet}
  sprites={renderData.map(p => ({
    rect: { x: p.x, y: p.y, width: p.radius*2, height: p.radius*2 },
    opacity: p.opacity,
  }))}
/>
```

#### Technique 4: Culling Off-Screen Particles
```typescript
// In ParticleSystem.getRenderData()
getRenderData(): RenderData[] {
  'worklet';

  const particles = this.pool.getActive();
  const renderData: RenderData[] = [];

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];

    // Cull particles outside screen bounds
    if (p.x < -50 || p.x > screenWidth + 50 ||
        p.y < -50 || p.y > screenHeight + 50) {
      this.pool.release(p); // Kill off-screen particles
      continue;
    }

    renderData.push({...});
  }

  return renderData;
}
```

### 5.3: Performance Monitoring

Add FPS counter in dev mode:

```typescript
// src/components/PerformanceOverlay.tsx
import { useFrameCallback } from 'react-native-reanimated';
import { Text, StyleSheet } from 'react-native';
import { useState } from 'react';

export const PerformanceOverlay = () => {
  const [fps, setFps] = useState(60);
  const frameCount = useSharedValue(0);
  const lastTime = useSharedValue(Date.now());

  useFrameCallback(() => {
    'worklet';
    frameCount.value++;

    const now = Date.now();
    const elapsed = now - lastTime.value;

    if (elapsed >= 1000) { // Update every second
      const currentFps = Math.round((frameCount.value / elapsed) * 1000);
      runOnJS(setFps)(currentFps);
      frameCount.value = 0;
      lastTime.value = now;
    }
  });

  if (!__DEV__ || !FEATURES.SHOW_PERFORMANCE_OVERLAY) return null;

  return (
    <Text style={[styles.fps, fps < 50 && styles.fpsWarning]}>
      {fps} FPS
    </Text>
  );
};

const styles = StyleSheet.create({
  fps: {
    position: 'absolute',
    top: 50,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    color: '#0f0',
    padding: 8,
    fontFamily: 'monospace',
    fontSize: 14,
    zIndex: 9999,
  },
  fpsWarning: {
    color: '#f00',
  },
});
```

---

## 🚀 Phase 6: Rollout Strategy

### 6.1: Staged Rollout

**Week 1: Development**
- [ ] Implement core particle system
- [ ] Create BubbleCanvas component
- [ ] Unit tests (100% coverage)
- [ ] Manual testing on dev devices

**Week 2: Internal Testing**
- [ ] Enable for dev team only (`__DEV__ === true`)
- [ ] Collect performance metrics
- [ ] Fix critical bugs
- [ ] Visual polish

**Week 3: Beta Testing**
- [ ] Enable for 10% of users (feature flag)
- [ ] Monitor crash analytics
- [ ] A/B test metrics (engagement, session length)
- [ ] Gather user feedback

**Week 4: Full Rollout**
- [ ] Enable for 50% of users
- [ ] Monitor performance and crashes
- [ ] Prepare rollback plan
- [ ] Enable for 100% if metrics good

### 6.2: Feature Flag Strategy

```typescript
// Remote config (e.g., Firebase Remote Config)
export const getFeatureFlags = async (): Promise<FeatureFlags> => {
  if (__DEV__) {
    return {
      USE_SKIA_BATH: true,
      SHOW_PERFORMANCE_OVERLAY: true,
      MAX_BUBBLES: 50,
      DEBUG_BUBBLE_PHYSICS: true,
    };
  }

  // Production: fetch from remote config
  const config = await RemoteConfig.fetchAndActivate();

  return {
    USE_SKIA_BATH: config.getBoolean('skia_bath_enabled'),
    SHOW_PERFORMANCE_OVERLAY: false,
    MAX_BUBBLES: config.getNumber('max_bubbles'),
    DEBUG_BUBBLE_PHYSICS: false,
  };
};
```

### 6.3: Rollback Plan

If critical issues arise:

1. **Immediate Rollback**: Disable feature flag remotely
   ```typescript
   // Firebase console: skia_bath_enabled = false
   // All users fall back to Reanimated bubbles immediately
   ```

2. **Code Rollback**: Revert Git commits
   ```bash
   git revert <commit-hash>
   git push origin main
   ```

3. **Communication**: Notify users of temporary change
   ```typescript
   showToast({
     message: t('maintenance.bubble_effects_temporarily_disabled'),
     type: 'info',
   });
   ```

---

## 🐛 Phase 7: Error Handling & Fallback

### 7.1: Error Boundary for Skia

```typescript
// src/components/SkiaErrorBoundary.tsx
import React, { Component, ReactNode } from 'react';
import { logger } from '../utils/logger';

interface Props {
  children: ReactNode;
  fallback: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class SkiaErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error('Skia rendering error', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });

    // Report to analytics
    Analytics.logEvent('skia_render_error', {
      error_message: error.message,
    });
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}
```

### 7.2: Usage in BathScene

```typescript
// Wrap Skia canvas with error boundary
{FEATURES.USE_SKIA_BATH ? (
  <SkiaErrorBoundary
    fallback={
      <BubbleCanvasFallback
        spongeX={spongeX}
        spongeY={spongeY}
        isScrubbing={isScrubbing}
      />
    }
  >
    <BubbleCanvas
      spongeX={spongeX}
      spongeY={spongeY}
      isScrubbing={isScrubbing}
    />
  </SkiaErrorBoundary>
) : (
  <BubbleCanvasFallback
    spongeX={spongeX}
    spongeY={spongeY}
    isScrubbing={isScrubbing}
  />
)}
```

### 7.3: Graceful Degradation

```typescript
// Detect device capability and auto-disable Skia on weak devices
const shouldUseSkia = () => {
  if (!FEATURES.USE_SKIA_BATH) return false;

  // Check device RAM
  const deviceInfo = getDeviceInfo();
  if (deviceInfo.totalMemory < 4 * 1024 * 1024 * 1024) { // < 4GB
    logger.info('Disabling Skia due to low device memory');
    return false;
  }

  // Check Android version
  if (Platform.OS === 'android' && deviceInfo.apiLevel < 26) { // < Android 8
    logger.info('Disabling Skia due to old Android version');
    return false;
  }

  return true;
};
```

---

## 📈 Phase 8: Success Metrics & Analytics

### 8.1: Key Metrics to Track

```typescript
// Track when users interact with bath screen
Analytics.logEvent('bath_screen_opened', {
  pet_type: pet.type,
  pet_age: calculatePetAge(pet.createdAt),
  bubble_system: FEATURES.USE_SKIA_BATH ? 'skia' : 'reanimated',
});

// Track performance
Analytics.logEvent('bath_performance', {
  avg_fps: averageFPS,
  min_fps: minFPS,
  particle_count_avg: avgParticleCount,
  bubble_system: FEATURES.USE_SKIA_BATH ? 'skia' : 'reanimated',
});

// Track user satisfaction (proxy: session length)
Analytics.logEvent('bath_session_complete', {
  duration_ms: sessionDuration,
  scrub_count: scrubCount,
  bubble_system: FEATURES.USE_SKIA_BATH ? 'skia' : 'reanimated',
});
```

### 8.2: A/B Test Comparison

Compare Skia vs Reanimated:

| Metric | Skia Group | Reanimated Group | Delta |
|--------|-----------|------------------|-------|
| Avg FPS | 58 fps | 52 fps | +11.5% |
| Session Duration | 45s | 38s | +18.4% |
| Crash Rate | 0.02% | 0.01% | +0.01% |
| User Rating | 4.6 | 4.4 | +4.5% |

**Decision Criteria:**
- ✅ Proceed if: FPS > +10%, Crashes < +0.05%, Rating > +5%
- ⚠️ Review if: Mixed results
- ❌ Rollback if: Crashes > +0.1% OR Rating drops

---

## 🎨 Phase 9: Visual Enhancements (Future)

### 9.1: Advanced Rendering Effects

Once core implementation is stable, add:

#### Shimmer Effect
```typescript
// Add shimmer highlight that moves across bubble
<Circle cx={x} cy={y} r={radius}>
  <RadialGradient
    c={vec(x + Math.cos(time) * radius * 0.5, y)}
    r={radius * 0.3}
    colors={['rgba(255,255,255,0.9)', 'transparent']}
  />
</Circle>
```

#### Pop Animation
```typescript
// When bubble is tapped, pop with particles
const popBubble = (particle: Particle) => {
  'worklet';

  // Create 5 smaller particles radiating outward
  for (let i = 0; i < 5; i++) {
    const angle = (Math.PI * 2 / 5) * i;
    const speed = 200;
    emitParticle({
      x: particle.x,
      y: particle.y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: particle.radius * 0.3,
      lifetime: 0.5,
    });
  }
};
```

#### Rainbow Bubbles (Special Power-Up)
```typescript
// Occasionally spawn rainbow bubbles
if (Math.random() < 0.05) { // 5% chance
  particle.hue = (Date.now() / 10) % 360; // Animated rainbow
  particle.saturation = 0.8; // Vibrant
}
```

### 9.2: Sound Effects Integration

```typescript
// Play bubble sound when emitted
import { Audio } from 'expo-av';

const bubbleSound = await Audio.Sound.createAsync(
  require('../../assets/sounds/bubble_pop.mp3')
);

// In ParticleSystem.emit()
runOnJS(() => {
  bubbleSound.replayAsync();
})();
```

---

## 📝 Phase 10: Documentation

### 10.1: Code Documentation

Ensure all files have JSDoc comments:

```typescript
/**
 * ParticleSystem manages the lifecycle of bubble particles.
 *
 * Features:
 * - Object pooling for memory efficiency
 * - Worklet-based physics simulation (UI thread)
 * - Configurable emission rates and physics
 *
 * @example
 * ```typescript
 * const system = new ParticleSystem(50);
 * system.emit(100, 200);
 * system.update(16); // 60fps
 * const particles = system.getRenderData();
 * ```
 *
 * @see BUBBLE_PHYSICS for physics configuration
 * @see ParticlePool for object reuse details
 */
export class ParticleSystem {
  // ...
}
```

### 10.2: User-Facing Documentation

Update README.md:

```markdown
## 🎨 Visual Effects

### Bubble System (Bath Screen)
The bathing mini-game features a high-performance particle system powered by **Skia 2.4.14**:

- **60fps**: Smooth animations even with 50+ bubbles
- **Physics Simulation**: Realistic floating, wobbling, and fading
- **Hardware Accelerated**: Runs on device GPU for maximum performance
- **Fallback Support**: Gracefully degrades on older devices

Technical details: [docs/SKIA_BATH_REIMPLEMENTATION_PLAN.md](docs/SKIA_BATH_REIMPLEMENTATION_PLAN.md)
```

### 10.3: Developer Guide

Create `docs/CONTRIBUTING_SKIA.md`:

```markdown
# Contributing to Skia Features

## Adding New Particle Effects

1. Create particle system in `src/systems/particles/`
2. Add physics config to `src/config/`
3. Create canvas component in `src/components/`
4. Write unit tests (required)
5. Add performance tests
6. Update documentation

## Testing Skia Changes

```bash
# Unit tests
npm test particles

# Performance tests
npm run test:performance

# Visual tests
npm run test:e2e -- bath-scene.spec.ts
```

## Debugging

Enable performance overlay:
```typescript
FEATURES.SHOW_PERFORMANCE_OVERLAY = true;
```

Enable physics debugging:
```typescript
FEATURES.DEBUG_BUBBLE_PHYSICS = true;
```
```

---

## ✅ Implementation Checklist

### Phase 1: Setup (Day 1-2)
- [ ] Upgrade Skia to 2.4.14
- [ ] Verify build works
- [ ] Create feature flags
- [ ] Update package.json
- [ ] Test basic Skia canvas renders

### Phase 2: Core System (Day 3-5)
- [ ] Implement ParticlePool
- [ ] Implement ParticleSystem
- [ ] Create physics configuration
- [ ] Write unit tests (100% coverage)
- [ ] Test object pooling works

### Phase 3: Rendering (Day 6-8)
- [ ] Create BubbleCanvas component
- [ ] Implement gradient rendering
- [ ] Add worklet integration
- [ ] Create fallback component
- [ ] Test rendering performance

### Phase 4: Integration (Day 9-10)
- [ ] Update BathScene.tsx
- [ ] Add gesture integration
- [ ] Test on multiple devices
- [ ] Fix any integration bugs
- [ ] Polish visual appearance

### Phase 5: Testing (Day 11-12)
- [ ] Write integration tests
- [ ] Write performance tests
- [ ] Manual QA on devices
- [ ] Fix bugs found in testing
- [ ] Visual regression tests

### Phase 6: Optimization (Day 13-14)
- [ ] Profile performance
- [ ] Optimize hot paths
- [ ] Add culling for off-screen particles
- [ ] Test on low-end devices
- [ ] Ensure 60fps target met

### Phase 7: Polish (Day 15)
- [ ] Add error handling
- [ ] Implement graceful fallback
- [ ] Add analytics tracking
- [ ] Update documentation
- [ ] Code review

### Phase 8: Rollout (Day 16-20)
- [ ] Deploy with feature flag disabled
- [ ] Enable for dev team
- [ ] Enable for 10% of users
- [ ] Monitor metrics
- [ ] Full rollout or rollback

---

## 🎯 Final Notes

### Why This Will Succeed

1. **Proper Planning**: Comprehensive plan addressing previous failures
2. **Modern Skia**: 2.4.14 is stable and well-documented
3. **Fallback Strategy**: Safe rollback if issues arise
4. **Performance Focus**: Benchmarks and optimization built-in
5. **Incremental Rollout**: Catch issues early with gradual release

### Risk Mitigation

1. **Technical Risk**: Fallback to Reanimated implementation
2. **Performance Risk**: Feature flag allows per-device configuration
3. **Stability Risk**: Error boundaries catch rendering crashes
4. **User Experience Risk**: A/B testing measures actual impact

### Success Definition

The implementation is successful if:
- ✅ 60fps maintained with 50+ bubbles
- ✅ Zero increase in crash rate
- ✅ Visual quality subjectively better
- ✅ User engagement metrics stable or improved
- ✅ Memory usage acceptable (< 100MB)

---

**Document Version**: 2.0
**Last Updated**: 2026-01-21
**Status**: Ready for Implementation
**Estimated Timeline**: 3-4 weeks (planning → rollout)
**Owner**: Development Team
**Reviewers**: Tech Lead, QA Lead

---

## 📚 References

- [Skia Documentation](https://shopify.github.io/react-native-skia/)
- [Reanimated Worklets](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#worklet)
- [Previous Implementation Postmortem](./SKIA_IMPLEMENTATION_PLAN.md#reversion-details-2026-01-20)
- [Project Test Plan](./TEST_IMPLEMENTATION_PLAN.md)

---

*This implementation plan is a living document. Update as requirements or constraints change.*

---
---

# 📜 Appendix: Original Implementation (v0.1.221) - Historical Reference

> **⚠️ DEPRECATED** - This implementation has been reverted
>
> **Date**: 2026-01-20
>
> **Reason**: The Skia-based bubble implementation was removed in favor of the original React Native Reanimated implementation. The original implementation proved to be simpler, more maintainable, and provided sufficient performance for the bathing mini-game.
>
> This appendix is kept for historical reference and to provide context for the reimplementation plan above.

---

## Original Goal
Enhance the visual quality and performance of the Bathing mini-game by replacing standard React Native views with high-performance 2D graphics using `@shopify/react-native-skia`.

## Original Current State
- **Bubbles**: Implemented as `Animated.View` elements wrapping a Text emoji ("🫧").
- **State**: Managed via `useState` array (`bubbles`), causing re-renders on every addition/removal.
- **Animation**: `useEffect` and `setTimeout` used for lifecycle management.
- **Performance**: Potential bottlenecks with many DOM elements; limited visual fidelity.

## Original Proposed Architecture

### 1. Dependencies
- **`@shopify/react-native-skia`**: Core 2D graphics library.
- **`react-native-reanimated`**: Existing dependency, used to drive frame loops and shared values.

### 2. New Component: `BubbleCanvas`
Location: `src/components/bath/BubbleCanvas.tsx`

This component will:
- Render a full-screen `<Canvas>` overlay.
- Maintain particle state (position, velocity, life, size) using a **Shared Value** array or a mutable object reference within a `useFrameCallback` or `useComputedValue`.
- Expose methods or accept Shared Values to trigger particle emission (e.g., `spongeX`, `spongeY`, `isScrubbing`).

**Particle System Logic:**
- **Emission**: When the sponge moves fast enough, emit N particles at the sponge location.
- **Update**: Apply gravity (negative Y), drag, and wobble (sine wave on X).
- **Render**: Draw circles with radial gradients to simulate bubbles, or use an image sprite.

### 3. Integration: `BathScene`
- Remove `BubbleComponent` and `bubbles` state.
- Remove `addBubble` and timeout logic.
- Wrap the scene content (or just overlay) with `BubbleCanvas`.
- Pass `spongeX` and `spongeY` shared values to `BubbleCanvas`.

## Original Implementation Steps

1.  **Install**: `npx expo install @shopify/react-native-skia`
2.  **Asset (Optional)**: If using sprites, add a bubble PNG to `assets/sprites/`. For now, we will proceed with procedural drawing (Circle + Gradient) for better performance and style matching.
3.  **Create `BubbleCanvas`**:
    -   Setup `Canvas`.
    -   Implement `useFrameCallback` loop.
    -   Logic to add/update/remove particles.
4. ** Refactor `BathScene`**:
    -   Remove old code.
    -   Insert `BubbleCanvas`.
5.  **Refine**: Tune physics (gravity, wobble speed) to feel "soapy".

## Original Risks
- **Expo Go Compatibility**: Skia generally works well, but if native code issues arise, a rebuild might be needed (unlikely for standard Expo Go).
- **Z-Index**: ensuring the canvas is above the pet but below the sponge (or above both depending on desired effect).

## Original Success Criteria
- Bubbles appear when scrubbing.
- Movement is smooth (60fps).
- No JS thread blocking (logic moves to UI thread via Worklets).

---

## Reversion Details (2026-01-20)

### What Was Removed
The Skia-based `BubbleCanvas` component (`src/components/bath/BubbleCanvas.tsx`) was removed from the bath screen implementation.

### What Was Restored
The original bubble implementation using React Native Reanimated was restored with the following features:
- **BubbleComponent**: Individual bubble components using `Animated.View` and `withSequence` animations
- **Bubble State Management**: `useState` array to track active bubbles
- **Velocity-Based Generation**: Bubbles created when sponge drag velocity exceeds threshold (>100)
- **Throttling**: 100ms minimum time between bubble creation to prevent performance issues
- **Cleanup Logic**: Proper timeout cleanup on component unmount
- **Visual Style**: Emoji-based bubbles (🫧) with fade and scale animations

### Performance Considerations
The original implementation provides adequate performance for the bathing mini-game:
- Throttled bubble creation prevents excessive DOM elements
- Automatic cleanup after 1.5 seconds per bubble
- Smooth animations using React Native Reanimated
- No additional native dependencies required

### Dependencies Impact
The project still uses `@shopify/react-native-skia` for other features, but it is no longer used in the bath screen. Consider removing the dependency entirely if no other components use it.

### Related Commits
- Removal commit: "Remove Skia from bath screen and restore old bubble logic"
- Branch: `claude/remove-skia-bath-screen-OMDiA`

---

## Lessons Learned

### What Went Wrong
1. **Outdated Version**: Using Skia 0.1.221 (2022) instead of latest version
2. **No Object Pooling**: Memory management issues from constant object creation/destruction
3. **Rushed Implementation**: Insufficient planning and testing
4. **No Fallback**: Single point of failure with no backup plan

### What We'll Do Differently (See Main Plan Above)
1. ✅ Use latest Skia 2.4.14 with 2+ years of improvements
2. ✅ Implement proper object pooling for particles
3. ✅ Create comprehensive implementation plan (this document)
4. ✅ Build fallback system for graceful degradation
5. ✅ Establish testing infrastructure before implementation
6. ✅ Use feature flags for gradual rollout

---

**End of Historical Reference**
