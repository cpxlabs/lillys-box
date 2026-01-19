import React, { useMemo } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import {
  Canvas,
  Circle,
  RadialGradient,
  Group,
  vec,
  interpolateColors,
  useFont,
  Text,
} from '@shopify/react-native-skia';
import {
  useSharedValue,
  useFrameCallback,
  SharedValue,
  useDerivedValue,
  runOnJS,
} from 'react-native-reanimated';

/**
 * Configuration
 */
const MAX_PARTICLES = 50;
const GRAVITY = 0.5;
const DRAG = 0.98;
const WOBBLE_SPEED = 0.05;
const SPAWN_RATE = 0.1;

type ParticleData = {
  active: number; // 0 or 1
  x: number;
  y: number;
  vx: number;
  vy: number;
  scale: number;
  life: number;
  maxLife: number;
  wobbleOffset: number;
};

type Props = {
  spongeX: SharedValue<number>;
  spongeY: SharedValue<number>;
  isScrubbing: SharedValue<boolean>;
  spongeOrigin: { x: number; y: number; width: number; height: number };
};

export const BubbleCanvas: React.FC<Props> = ({
  spongeX,
  spongeY,
  isScrubbing,
  spongeOrigin,
}) => {
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

  // We use a Float32Array to store particle data flat for performance
  // [active, x, y, vx, vy, scale, life, maxLife, wobbleOffset] * MAX_PARTICLES
  const DATA_SIZE = 9;
  const particles = useSharedValue(new Float32Array(MAX_PARTICLES * DATA_SIZE));

  // Initialize particles
  // We can't do this in a useEffect easily with SharedValues, but Float32Array is 0 initialized.

  useFrameCallback(() => {
    const arr = particles.value;
    // We can't mutate the array in place and expect React to notice,
    // but Skia doesn't rely on React render cycle for values driven by SharedValues?
    // Wait, Skia needs us to map components.
    // Standard approach: Use an array of SharedValues? Or one big SharedValue<Float32Array>?
    // Skia's <Circle> needs explicit props.
    // If we have 50 <Circle> components, each needs a way to read its own data.

    // Approach: Create an array of SharedValues for the UI.
    // Since we can't change the hook count, we'll create them once.
    // But updating 50 shared values individually is costly?
    // Actually, `useDerivedValue` reading from one big array is efficient.
  });

  return (
    <Canvas style={StyleSheet.absoluteFill} pointerEvents="none">
      {Array.from({ length: MAX_PARTICLES }).map((_, i) => (
        <SingleBubble
          key={i}
          index={i}
          particles={particles}
          spongeX={spongeX}
          spongeY={spongeY}
          isScrubbing={isScrubbing}
          spongeOrigin={spongeOrigin}
        />
      ))}
    </Canvas>
  );
};

const SingleBubble = ({
  index,
  particles,
  spongeX,
  spongeY,
  isScrubbing,
  spongeOrigin,
}: {
  index: number;
  particles: SharedValue<Float32Array>;
  spongeX: SharedValue<number>;
  spongeY: SharedValue<number>;
  isScrubbing: SharedValue<boolean>;
  spongeOrigin: { x: number; y: number; width: number; height: number };
}) => {
  const DATA_SIZE = 9;
  const offset = index * DATA_SIZE;

  // We handle simulation inside useDerivedValue or useFrameCallback per bubble?
  // Better: Global simulation in parent, read in child.
  // But parent useFrameCallback can't easily update the shared value in a way that triggers specific children efficiently without creating a new Float32Array?
  // Actually, mutating the Float32Array inside a worklet works if we trigger an update.

  // Alternative: Each bubble manages itself.
  // This distributes the load and makes logic cleaner.

  const active = useSharedValue(0);
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const vx = useSharedValue(0);
  const vy = useSharedValue(0);
  const scale = useSharedValue(0);
  const life = useSharedValue(0);
  const wobbleOffset = useSharedValue(0);

  useFrameCallback((frameInfo) => {
    // 1. If inactive, try to spawn
    if (active.value === 0) {
      if (isScrubbing.value && Math.random() < SPAWN_RATE) {
         // Check if we should spawn (random chance distributed among pool)
         // To avoid all spawning at once, use index check or random
         if (Math.random() > 0.95) { // 5% chance per frame per inactive particle
            active.value = 1;

            // Spawn position: Center of sponge + random offset
            const startX = spongeOrigin.x + spongeX.value + spongeOrigin.width / 2;
            const startY = spongeOrigin.y + spongeY.value + spongeOrigin.height / 2;

            x.value = startX + (Math.random() - 0.5) * 40;
            y.value = startY + (Math.random() - 0.5) * 40;

            vx.value = (Math.random() - 0.5) * 2;
            vy.value = -2 - Math.random() * 2; // Upward velocity

            scale.value = 0.5 + Math.random() * 0.5;
            life.value = 60 + Math.random() * 60; // Frames
            wobbleOffset.value = Math.random() * Math.PI * 2;
         }
      }
    } else {
      // 2. Update Physics
      x.value += vx.value;
      y.value += vy.value;

      // Wobble
      x.value += Math.sin(frameInfo.timeSinceFirstFrame / 200 + wobbleOffset.value) * 0.5;

      // Gravity / Buoyancy
      vy.value *= DRAG;
      // vy.value -= 0.01; // Constant float up

      life.value -= 1;

      if (life.value <= 0 || y.value < -50) {
        active.value = 0;
      }
    }
  });

  const transform = useDerivedValue(() => {
    return [
      { translateX: x.value },
      { translateY: y.value },
      { scale: active.value ? scale.value * Math.min(1, life.value / 20) : 0 }, // Fade out at end
    ];
  });

  // Opacity based on life
  const opacity = useDerivedValue(() => {
    if (!active.value) return 0;
    // Fade in
    if (life.value > 50) return 0.8;
    // Fade out
    return (life.value / 50) * 0.8;
  });

  return (
    <Group transform={transform} opacity={opacity}>
      <Circle cx={0} cy={0} r={15}>
        <RadialGradient
          c={vec(0, 0)}
          r={15}
          colors={['rgba(255, 255, 255, 0.8)', 'rgba(173, 216, 230, 0.4)', 'rgba(255, 255, 255, 0.1)']}
          positions={[0, 0.7, 1]}
        />
      </Circle>
      {/* Reflection dot */}
      <Circle cx={-4} cy={-4} r={3} color="rgba(255, 255, 255, 0.9)" />
    </Group>
  );
};
