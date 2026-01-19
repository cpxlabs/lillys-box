# Skia Implementation Plan: Bathing Mini-Game

## Goal
Enhance the visual quality and performance of the Bathing mini-game by replacing standard React Native views with high-performance 2D graphics using `@shopify/react-native-skia`.

## Current State
- **Bubbles:** Implemented as `Animated.View` elements wrapping a Text emoji ("🫧").
- **State:** Managed via `useState` array (`bubbles`), causing re-renders on every addition/removal.
- **Animation:** `useEffect` and `setTimeout` used for lifecycle management.
- **Performance:** Potential bottlenecks with many DOM elements; limited visual fidelity.

## Proposed Architecture

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
- **Emission:** When the sponge moves fast enough, emit N particles at the sponge location.
- **Update:** Apply gravity (negative Y), drag, and wobble (sine wave on X).
- **Render:** Draw circles with radial gradients to simulate bubbles, or use an image sprite.

### 3. Integration: `BathScene`
- Remove `BubbleComponent` and `bubbles` state.
- Remove `addBubble` and timeout logic.
- Wrap the scene content (or just overlay) with `BubbleCanvas`.
- Pass `spongeX` and `spongeY` shared values to `BubbleCanvas`.

## Implementation Steps

1.  **Install**: `npx expo install @shopify/react-native-skia`
2.  **Asset (Optional)**: If using sprites, add a bubble PNG to `assets/sprites/`. For now, we will proceed with procedural drawing (Circle + Gradient) for better performance and style matching.
3.  **Create `BubbleCanvas`**:
    -   Setup `Canvas`.
    -   Implement `useFrameCallback` loop.
    -   Logic to add/update/remove particles.
4.  **Refactor `BathScene`**:
    -   Remove old code.
    -   Insert `BubbleCanvas`.
5.  **Refine**: Tune physics (gravity, wobble speed) to feel "soapy".

## Risks
- **Expo Go Compatibility**: Skia generally works well, but if native code issues arise, a rebuild might be needed (unlikely for standard Expo Go).
- **Z-Index**: ensuring the canvas is above the pet but below the sponge (or above both depending on desired effect).

## Success Criteria
- Bubbles appear when scrubbing.
- Movement is smooth (60fps).
- No JS thread blocking (logic moves to UI thread via Worklets).
