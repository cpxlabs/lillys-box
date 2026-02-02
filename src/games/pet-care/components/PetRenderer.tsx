import React from 'react';
import { Image, StyleSheet, ImageRequireSource, View, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  useSharedValue,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { Pet, PetType, PetColor, AnimationState } from '../types/types';
import { CLOTHING_ITEMS } from '../data/clothingItems';
import { SpriteSheetAnimation } from './SpriteSheetAnimation';
import { UI } from '../../../app/config/constants';
import { useSpriteSheet } from '../hooks/useSpriteSheet';

// Mapeamento de assets base
/* eslint-disable @typescript-eslint/no-require-imports */
const BASE_ASSETS: Record<PetType, Record<PetColor, ImageRequireSource>> = {
  cat: {
    base: require('../../../../assets/sprites/cats/cat_base.png'),
    black: require('../../../../assets/sprites/cats/cat_black.png'),
    brown: require('../../../../assets/sprites/cats/cat_base.png'), // cats don't have brown variant
    whiteandbrown: require('../../../../assets/sprites/cats/cat_base.png'), // cats don't have this variant
  },
  dog: {
    base: require('../../../../assets/sprites/dogs/dog_brown.png'), // using brown as default (dog_base.png doesn't exist)
    black: require('../../../../assets/sprites/dogs/dog_black.png'),
    brown: require('../../../../assets/sprites/dogs/dog_brown.png'),
    whiteandbrown: require('../../../../assets/sprites/dogs/dog_whiteandbrown.png'),
  },
};
/* eslint-enable @typescript-eslint/no-require-imports */

// Sprite sheet system is now managed via:
// - src/config/spriteSheets.ts (configuration)
// - src/utils/SpriteSheetManager.ts (loading/caching)
// - src/hooks/useSpriteSheet.ts (React integration)

// Dirt mark size ratio relative to pet size
const DIRT_MARK_SIZE_RATIO = 0.071;

type PetRendererProps = {
  pet: Pet;
  animationState?: AnimationState;
  size?: number;
  useSpriteSheets?: boolean;
};

export const PetRenderer: React.FC<PetRendererProps> = ({
  pet,
  animationState = 'idle',
  size = 450,
  useSpriteSheets = false,
}) => {
  const translateY = useSharedValue(0);
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  // Use sprite sheet hook for intelligent loading
  const { spriteSheet, isLoaded, exists } = useSpriteSheet(
    pet.type,
    pet.color,
    animationState,
    useSpriteSheets // only auto-preload if sprite sheets are enabled
  );

  React.useEffect(() => {
    // Reset all animations
    translateY.value = 0;
    rotation.value = 0;
    scale.value = 1;

    if (animationState === 'happy') {
      // Bounce: 3 repetitions, -15px height using withSpring
      translateY.value = withRepeat(
        withSequence(
          withSpring(-15, { damping: 8, stiffness: 100 }),
          withSpring(0, { damping: 8, stiffness: 100 })
        ),
        3,
        false
      );

      // Wiggle: Rotate -5° to +5° to 0°, timing-based, 2 repetitions
      rotation.value = withRepeat(
        withSequence(
          withTiming(-5, { duration: 100, easing: Easing.inOut(Easing.ease) }),
          withTiming(5, { duration: 200, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 100, easing: Easing.inOut(Easing.ease) })
        ),
        2,
        false
      );
    } else if (animationState === 'eating') {
      // Gentle head bob: -5px up and down, 400ms duration each
      translateY.value = withRepeat(
        withSequence(
          withTiming(-5, { duration: 400, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 400, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
    } else if (animationState === 'bathing') {
      // Shake: Rotate -3° to +3° to 0°, fast (50-100ms timing), 5 repetitions
      rotation.value = withRepeat(
        withSequence(
          withTiming(-3, { duration: 50, easing: Easing.linear }),
          withTiming(3, { duration: 100, easing: Easing.linear }),
          withTiming(0, { duration: 50, easing: Easing.linear })
        ),
        5,
        false
      );
    } else if (animationState === 'idle') {
      // Subtle breathing: Scale 1.0 to 1.02 and back, 2000ms duration each way
      scale.value = withRepeat(
        withSequence(
          withTiming(1.02, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
          withTiming(1.0, { duration: 2000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
    }
  }, [animationState, translateY, rotation, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { rotate: `${rotation.value}deg` },
      { scale: scale.value },
    ],
  }));

  const getClothingAsset = (slot: keyof typeof pet.clothes) => {
    const itemId = pet.clothes[slot];
    if (!itemId) return null;
    const item = CLOTHING_ITEMS.find((i) => i.id === itemId);
    return item?.asset || null; // troque por require real quando tiver o asset
  };

  // Calculate number of dirt marks based on hygiene (one mark per 20% decrease)
  const getDirtMarksCount = () => {
    if (pet.hygiene > 80) return 0;
    if (pet.hygiene > 60) return 1;
    if (pet.hygiene > 40) return 2;
    if (pet.hygiene > 20) return 3;
    if (pet.hygiene > 0) return 4;
    return 5;
  };

  const dirtMarksCount = getDirtMarksCount();

  // Dirt mark positions (relative to pet size)
  const dirtMarkPositions = [
    { left: '25%', top: '40%' }, // Position 1
    { left: '65%', top: '35%' }, // Position 2
    { left: '45%', top: '60%' }, // Position 3
    { left: '20%', top: '70%' }, // Position 4
    { left: '70%', top: '65%' }, // Position 5
  ];

  // Render sprite sheet animation if enabled, exists, and loaded
  if (useSpriteSheets && exists && isLoaded && spriteSheet) {
    return (
      <Animated.View style={[styles.container, { width: size, height: size }, animatedStyle]}>
        <SpriteSheetAnimation
          spriteSheet={spriteSheet.asset}
          frameCount={spriteSheet.frameCount}
          frameWidth={spriteSheet.frameWidth}
          frameHeight={spriteSheet.frameHeight}
          fps={spriteSheet.fps}
          loop={spriteSheet.loop}
          playing={true}
        />

        {/* Camadas de roupas - ordem: paws → torso → eyes → head */}
        {pet.clothes.paws && getClothingAsset('paws') && (
          <Image
            source={getClothingAsset('paws')!}
            style={[styles.layer, { width: size, height: size }]}
            resizeMode="contain"
          />
        )}

        {pet.clothes.torso && getClothingAsset('torso') && (
          <Image
            source={getClothingAsset('torso')!}
            style={[styles.layer, { width: size, height: size }]}
            resizeMode="contain"
          />
        )}

        {pet.clothes.eyes && getClothingAsset('eyes') && (
          <Image
            source={getClothingAsset('eyes')!}
            style={[styles.layer, { width: size, height: size }]}
            resizeMode="contain"
          />
        )}

        {pet.clothes.head && getClothingAsset('head') && (
          <Image
            source={getClothingAsset('head')!}
            style={[styles.layer, { width: size, height: size }]}
            resizeMode="contain"
          />
        )}

        {/* Dirt marks - show based on hygiene level */}
        {Array.from({ length: Math.min(dirtMarksCount, dirtMarkPositions.length) }, (_, index) => (
          <View
            key={`dirt-${index}`}
            style={[
              styles.dirtMark,
              {
                left: dirtMarkPositions[index].left,
                top: dirtMarkPositions[index].top,
              },
            ]}
          >
            <Text style={[styles.dirtEmoji, { fontSize: size * DIRT_MARK_SIZE_RATIO }]}>💩</Text>
          </View>
        ))}
      </Animated.View>
    );
  }

  // Fallback to static sprite with enhanced animations
  return (
    <Animated.View style={[styles.container, { width: size, height: size }, animatedStyle]}>
      {/* Base do pet */}
      <Image
        source={BASE_ASSETS[pet.type][pet.color]}
        style={[styles.layer, { width: size, height: size }]}
        resizeMode="contain"
      />

      {/* Camadas de roupas - ordem: paws → torso → eyes → head */}
      {pet.clothes.paws && getClothingAsset('paws') && (
        <Image
          source={getClothingAsset('paws')!}
          style={[styles.layer, { width: size, height: size }]}
          resizeMode="contain"
        />
      )}

      {pet.clothes.torso && getClothingAsset('torso') && (
        <Image
          source={getClothingAsset('torso')!}
          style={[styles.layer, { width: size, height: size }]}
          resizeMode="contain"
        />
      )}

      {pet.clothes.eyes && getClothingAsset('eyes') && (
        <Image
          source={getClothingAsset('eyes')!}
          style={[styles.layer, { width: size, height: size }]}
          resizeMode="contain"
        />
      )}

      {pet.clothes.head && getClothingAsset('head') && (
        <Image
          source={getClothingAsset('head')!}
          style={[styles.layer, { width: size, height: size }]}
          resizeMode="contain"
        />
      )}

      {/* Dirt marks - show based on hygiene level */}
      {Array.from({ length: Math.min(dirtMarksCount, dirtMarkPositions.length) }, (_, index) => (
        <View
          key={`dirt-${index}`}
          style={[
            styles.dirtMark,
            {
              left: dirtMarkPositions[index].left,
              top: dirtMarkPositions[index].top,
            },
          ]}
        >
          <Text style={[styles.dirtEmoji, { fontSize: size * UI.DIRT_MARK_SIZE_RATIO }]}>💩</Text>
        </View>
      ))}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  layer: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  dirtMark: {
    position: 'absolute',
    zIndex: 100,
  },
  dirtEmoji: {
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
