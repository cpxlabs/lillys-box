import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import {
  Canvas,
  Circle,
  RadialGradient,
  vec,
} from '@shopify/react-native-skia';
import {
  SharedValue,
  runOnJS,
  useAnimatedReaction,
} from 'react-native-reanimated';

/**
 * Configuration
 */
const MAX_PARTICLES = 30;

type Bubble = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  scale: number;
  life: number;
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
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [frameCount, setFrameCount] = useState(0);

  // Spawn bubbles when scrubbing
  useAnimatedReaction(
    () => ({ scrubbing: isScrubbing.value, x: spongeX.value, y: spongeY.value }),
    (current) => {
      if (current.scrubbing && Math.random() < 0.3) {
        runOnJS(spawnBubble)(
          spongeOrigin.x + current.x + spongeOrigin.width / 2,
          spongeOrigin.y + current.y + spongeOrigin.height / 2
        );
      }
    }
  );

  const spawnBubble = (centerX: number, centerY: number) => {
    setBubbles((prev) => {
      if (prev.length >= MAX_PARTICLES) {
        return prev;
      }

      const newBubble: Bubble = {
        id: Date.now() + Math.random(),
        x: centerX + (Math.random() - 0.5) * 40,
        y: centerY + (Math.random() - 0.5) * 40,
        vx: (Math.random() - 0.5) * 2,
        vy: -2 - Math.random() * 2,
        scale: 0.5 + Math.random() * 0.5,
        life: 60 + Math.random() * 60,
        wobbleOffset: Math.random() * Math.PI * 2,
      };

      return [...prev, newBubble];
    });
  };

  // Animation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setFrameCount((f) => f + 1);
      setBubbles((prev) =>
        prev
          .map((bubble) => ({
            ...bubble,
            x: bubble.x + bubble.vx + Math.sin(frameCount / 20 + bubble.wobbleOffset) * 0.5,
            y: bubble.y + bubble.vy,
            vy: bubble.vy * 0.98,
            life: bubble.life - 1,
          }))
          .filter((bubble) => bubble.life > 0 && bubble.y > -50)
      );
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [frameCount]);

  return (
    <Canvas style={StyleSheet.absoluteFill} pointerEvents="none">
      {bubbles.map((bubble) => (
        <BubbleRenderer key={bubble.id} bubble={bubble} />
      ))}
    </Canvas>
  );
};

const BubbleRenderer = ({ bubble }: { bubble: Bubble }) => {
  // Calculate opacity based on life
  const opacity = bubble.life > 50 ? 0.8 : (bubble.life / 50) * 0.8;

  // Calculate radius with fade effect
  const radius = 15 * bubble.scale * Math.min(1, bubble.life / 20);
  const reflectionRadius = 3 * Math.min(1, bubble.life / 20);

  return (
    <>
      <Circle cx={bubble.x} cy={bubble.y} r={radius} opacity={opacity}>
        <RadialGradient
          c={vec(0, 0)}
          r={15}
          colors={['rgba(255, 255, 255, 0.8)', 'rgba(173, 216, 230, 0.4)', 'rgba(255, 255, 255, 0.1)']}
          positions={[0, 0.7, 1]}
        />
      </Circle>
      {/* Reflection dot */}
      <Circle
        cx={bubble.x - 4}
        cy={bubble.y - 4}
        r={reflectionRadius}
        color="rgba(255, 255, 255, 0.9)"
        opacity={opacity}
      />
    </>
  );
};
