import React from 'react';
import { StyleSheet } from 'react-native';
import {
  Canvas,
  Circle,
  RadialGradient,
  Group,
  vec,
} from '@shopify/react-native-skia';
import {
  useSharedValue,
  useFrameCallback,
  SharedValue,
  useDerivedValue,
} from 'react-native-reanimated';

/**
 * Configuration
 */
const MAX_PARTICLES = 50;
const DRAG = 0.98;
const SPAWN_RATE = 0.1;

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
  return (
    <Canvas style={StyleSheet.absoluteFill} pointerEvents="none">
      {Array.from({ length: MAX_PARTICLES }).map((_, i) => (
        <SingleBubble
          key={i}
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
  spongeX,
  spongeY,
  isScrubbing,
  spongeOrigin,
}: {
  spongeX: SharedValue<number>;
  spongeY: SharedValue<number>;
  isScrubbing: SharedValue<boolean>;
  spongeOrigin: { x: number; y: number; width: number; height: number };
}) => {
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

  // Opacity based on life
  const opacity = useDerivedValue(() => {
    if (!active.value) return 0;
    // Fade in
    if (life.value > 50) return 0.8;
    // Fade out
    return (life.value / 50) * 0.8;
  });

  // Radius with scale and fade effect
  const radius = useDerivedValue(() => {
    if (!active.value) return 0;
    return 15 * scale.value * Math.min(1, life.value / 20);
  });

  // Convert SharedValues to derived values for Skia
  const cx = useDerivedValue(() => x.value);
  const cy = useDerivedValue(() => y.value);
  const reflectionCx = useDerivedValue(() => x.value - 4);
  const reflectionCy = useDerivedValue(() => y.value - 4);

  return (
    <Group opacity={opacity}>
      <Circle cx={cx} cy={cy} r={radius}>
        <RadialGradient
          c={vec(0, 0)}
          r={15}
          colors={['rgba(255, 255, 255, 0.8)', 'rgba(173, 216, 230, 0.4)', 'rgba(255, 255, 255, 0.1)']}
          positions={[0, 0.7, 1]}
        />
      </Circle>
      {/* Reflection dot */}
      <Circle cx={reflectionCx} cy={reflectionCy} r={3} color="rgba(255, 255, 255, 0.9)" />
    </Group>
  );
};
