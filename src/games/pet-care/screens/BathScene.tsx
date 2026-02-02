import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { usePet } from '../context/PetContext';
import { useToast } from '../../../app/context/ToastContext';
import { PetRenderer } from '../components/PetRenderer';
import { StatusCard } from '../components/StatusCard';
import { ScreenHeader } from '../components/ScreenHeader';
import { AnimationState } from '../types/types';
import { useBackButton } from '../../../shared/hooks/useBackButton';
import { useDoubleReward } from '../hooks/useDoubleReward';
import { AdsConfig } from '../../../app/config/ads.config';
import { ScreenNavigationProp } from '../../../app/types/navigation';
import { ANIMATION_DURATION } from '../../../app/config/constants';
import { calculatePetAge } from '../utils/age';
import { useResponsive } from '../../../app/hooks/useResponsive';
import { ACTION_PET_SIZE, SPONGE_SIZE, SCENE_TEXT_SIZE } from '../../../app/config/responsive';

type Props = {
  navigation: ScreenNavigationProp<'Bath'>;
};

type Bubble = {
  id: number;
  x: number;
  y: number;
  scale: number;
};

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
    <Animated.View style={[styles.dynamicBubble, { left: bubble.x, top: bubble.y }, bubbleStyle]}>
      <Text style={styles.bubbleEmoji}>🫧</Text>
    </Animated.View>
  );
};

export const BathScene: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { pet, bathe, earnMoney } = usePet();
  const { showToast } = useToast();
  const { triggerReward, DoubleRewardModal } = useDoubleReward({ earnMoney, showToast });
  const [animationState, setAnimationState] = useState<AnimationState>('idle');
  const [message, setMessage] = useState('');
  const [scrubCount, setScrubCount] = useState(0);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const BackButtonIcon = useBackButton();
  const { deviceType, spacing, fs } = useResponsive();

  const petSize = ACTION_PET_SIZE[deviceType];
  const spongeSizes = SPONGE_SIZE[deviceType];
  const textSizes = SCENE_TEXT_SIZE[deviceType];

  const translateX = useSharedValue(0);
  const spongeX = useSharedValue(0);
  const spongeY = useSharedValue(0);
  const isMoving = useSharedValue(false);
  const bubbleIdCounter = React.useRef(0);
  const timeoutRefs = React.useRef<Set<NodeJS.Timeout>>(new Set());
  const lastBubbleTime = React.useRef(0);

  if (!pet) return null;

  const petAge = calculatePetAge(pet.createdAt);
  const petNameDisplay = `${pet.type === 'cat' ? '🐱' : '🐶'} ${pet.name}`;
  const petAgeDisplay = `${petAge} ${petAge === 1 ? t('common.year') : t('common.years')}`;

  const SCRUBS_NEEDED = 5;
  const BUBBLE_VELOCITY_THRESHOLD = 100;
  const BUBBLE_POSITION_VARIANCE = 40;
  const BUBBLE_POSITION_OFFSET = 20;
  const BUBBLE_THROTTLE_MS = 100; // Minimum time between bubble creation

  const addBubble = (x: number, y: number) => {
    const now = Date.now();

    // Throttle bubble creation to prevent performance issues
    if (now - lastBubbleTime.current < BUBBLE_THROTTLE_MS) {
      return;
    }

    lastBubbleTime.current = now;

    const newBubble: Bubble = {
      id: now + bubbleIdCounter.current++,
      x: x + Math.random() * BUBBLE_POSITION_VARIANCE - BUBBLE_POSITION_OFFSET,
      y: y + Math.random() * BUBBLE_POSITION_VARIANCE - BUBBLE_POSITION_OFFSET,
      scale: 0.5 + Math.random() * 0.5,
    };

    setBubbles((prev) => [...prev, newBubble]);

    // Remove bubble after animation
    const timeoutId = setTimeout(() => {
      setBubbles((prev) => prev.filter((b) => b.id !== newBubble.id));
      timeoutRefs.current.delete(timeoutId);
    }, 1500);
    timeoutRefs.current.add(timeoutId);
  };

  // Cleanup timeouts on unmount
  React.useEffect(() => {
    return () => {
      timeoutRefs.current.forEach((timeout) => clearTimeout(timeout));
      timeoutRefs.current.clear();
    };
  }, []);

  const handleScrub = () => {
    const newCount = scrubCount + 1;
    setScrubCount(newCount);

    // Give 5% hygiene per scrub
    bathe(5);

    if (newCount >= SCRUBS_NEEDED) {
      setAnimationState('bathing');
      setMessage(t('bath.bathing', { name: pet.name }));

      // Give bonus 10% hygiene at the end (5 scrubs x 5% + 10% bonus = 35% total)
      bathe(10);

      // Base money earned for bathing
      const moneyEarned = AdsConfig.rewards.bathReward;

      setTimeout(() => {
        setAnimationState('happy');
        setMessage(t('bath.clean', { name: pet.name }));
        setScrubCount(0);

        setTimeout(() => {
          setAnimationState('idle');
          setMessage('');

          // Offer double reward or give reward immediately
          triggerReward(moneyEarned);
        }, ANIMATION_DURATION.LONG);
      }, ANIMATION_DURATION.MEDIUM);
    }
  };

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX * 0.3;
    })
    .onEnd(() => {
      translateX.value = withSpring(0);
      handleScrub();
    });

  const spongeDragGesture = Gesture.Pan()
    .onStart(() => {
      isMoving.value = true;
    })
    .onUpdate((e) => {
      spongeX.value = e.translationX;
      spongeY.value = e.translationY;

      // Generate bubbles while moving
      if (
        Math.abs(e.velocityX) > BUBBLE_VELOCITY_THRESHOLD ||
        Math.abs(e.velocityY) > BUBBLE_VELOCITY_THRESHOLD
      ) {
        addBubble(e.absoluteX, e.absoluteY);
      }
    })
    .onEnd(() => {
      isMoving.value = false;
      spongeX.value = withSpring(0);
      spongeY.value = withSpring(0);
      handleScrub();
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const spongeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: spongeX.value },
      { translateY: spongeY.value },
      { scale: isMoving.value ? withSpring(1.1) : withSpring(1) },
    ],
  }));

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title={t('bath.title')}
        onBackPress={() => navigation.goBack()}
        BackButtonIcon={BackButtonIcon}
      />

      {/* Status Card */}
      <StatusCard pet={pet} petName={petNameDisplay} petAge={petAgeDisplay} compact />

      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.petContainer, animatedStyle]}>
          <PetRenderer pet={pet} animationState={animationState} size={petSize} />

          {/* Dynamic Bubbles */}
          {bubbles.map((bubble) => (
            <BubbleComponent key={bubble.id} bubble={bubble} />
          ))}
        </Animated.View>
      </GestureDetector>

      {/* Draggable Sponge */}
      <GestureDetector gesture={spongeDragGesture}>
        <Animated.View
          style={[styles.spongeContainer, spongeAnimatedStyle, { bottom: spongeSizes.bottom }]}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={t('bath.instructions')}
          accessibilityHint="Drag the sponge to bathe your pet"
        >
          <Image
            source={require('../../../../assets/sprites/sponge.png')}
            style={[styles.spongeImage, { width: spongeSizes.width, height: spongeSizes.height }]}
          />
        </Animated.View>
      </GestureDetector>

      <View style={[styles.messageContainer, { padding: spacing(12) }]}>
        <Text style={[styles.message, { fontSize: textSizes.messageSize }]}>
          {message || t('bath.instructions')}
        </Text>
        {scrubCount > 0 && scrubCount < SCRUBS_NEEDED && (
          <Text style={[styles.progress, { fontSize: fs(13), marginTop: spacing(6) }]}>
            {t('bath.scrubbing', { count: scrubCount, needed: SCRUBS_NEEDED })}
          </Text>
        )}
      </View>

      {/* Double Reward Modal */}
      {DoubleRewardModal}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e3f2fd',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  backButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    fontSize: 16,
    color: '#9b59b6',
    fontWeight: '600',
    marginLeft: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  hygieneInfo: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  hygieneText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2196F3',
  },
  petContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  dynamicBubble: {
    position: 'absolute',
    zIndex: 10,
  },
  bubbleEmoji: {
    fontSize: 32,
  },
  spongeContainer: {
    position: 'absolute',
    bottom: 200,
    left: 40,
    zIndex: 20,
  },
  spongeImage: {
    width: 150,
    height: 112,
    resizeMode: 'contain',
  },
  messageContainer: {
    alignItems: 'center',
    padding: 16,
  },
  message: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  progress: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
});
