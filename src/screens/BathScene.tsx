import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { usePet } from '../context/PetContext';
import { useToast } from '../context/ToastContext';
import { PetRenderer } from '../components/PetRenderer';
import { StatusCard } from '../components/StatusCard';
import { ScreenHeader } from '../components/ScreenHeader';
import { AnimationState } from '../types';
import { useBackButton } from '../hooks/useBackButton';
import { useDoubleReward } from '../hooks/useDoubleReward';
import { AdsConfig } from '../config/ads.config';
import { ScreenNavigationProp } from '../types/navigation';
import { ANIMATION_DURATION } from '../config/constants';
import { calculatePetAge } from '../utils/age';
import { useResponsive } from '../hooks/useResponsive';
import { ACTION_PET_SIZE, SPONGE_SIZE, SCENE_TEXT_SIZE } from '../config/responsive';
import { BubbleCanvas } from '../components/bath/BubbleCanvas';

type Props = {
  navigation: ScreenNavigationProp<'Bath'>;
};

export const BathScene: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { pet, bathe, earnMoney } = usePet();
  const { showToast } = useToast();
  const { triggerReward, DoubleRewardModal } = useDoubleReward({ earnMoney, showToast });
  const [animationState, setAnimationState] = useState<AnimationState>('idle');
  const [message, setMessage] = useState('');
  const [scrubCount, setScrubCount] = useState(0);
  const BackButtonIcon = useBackButton();
  const { deviceType, spacing, fs } = useResponsive();

  const petSize = ACTION_PET_SIZE[deviceType];
  const spongeSizes = SPONGE_SIZE[deviceType];
  const textSizes = SCENE_TEXT_SIZE[deviceType];

  const translateX = useSharedValue(0);
  const spongeX = useSharedValue(0);
  const spongeY = useSharedValue(0);
  const isMoving = useSharedValue(false);

  // Moved early return to prevent hook errors, but we need safe access
  // We'll handle the null check in the render or use optional chaining where needed
  // However, hooks must run.

  // Calculate derived values only if pet exists, otherwise defaults
  const petAge = pet ? calculatePetAge(pet.createdAt) : 0;
  const petNameDisplay = pet ? `${pet.type === 'cat' ? '🐱' : '🐶'} ${pet.name}` : '';
  const petAgeDisplay = `${petAge} ${petAge === 1 ? t('common.year') : t('common.years')}`;

  const SCRUBS_NEEDED = 5;

  const handleScrub = () => {
    if (!pet) return;
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

  if (!pet) return null;

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const spongeImage = require('../../assets/sprites/sponge.png');

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title={t('bath.title')}
        onBackPress={() => navigation.goBack()}
        BackButtonIcon={BackButtonIcon}
      />

      {/* Status Card */}
      <StatusCard
        pet={pet}
        petName={petNameDisplay}
        petAge={petAgeDisplay}
        compact
      />

      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.petContainer, animatedStyle]}>
          <PetRenderer pet={pet} animationState={animationState} size={petSize} />
        </Animated.View>
      </GestureDetector>

      {/* Skia Bubbles Overlay */}
      <BubbleCanvas
        spongeX={spongeX}
        spongeY={spongeY}
        isScrubbing={isMoving}
        spongeOrigin={{
          x: 40,
          y: spongeSizes.bottom ? (typeof spongeSizes.bottom === 'number' ? 200 : 200) : 200, // Approximate Y start
          width: spongeSizes.width,
          height: spongeSizes.height,
        }}
      />

      {/* Draggable Sponge */}
      <GestureDetector gesture={spongeDragGesture}>
        <Animated.View style={[styles.spongeContainer, spongeAnimatedStyle, { bottom: spongeSizes.bottom }]}>
          <Image
            source={spongeImage}
            style={[styles.spongeImage, { width: spongeSizes.width, height: spongeSizes.height }]}
          />
        </Animated.View>
      </GestureDetector>

      <View style={[styles.messageContainer, { padding: spacing(12) }]}>
        <Text style={[styles.message, { fontSize: textSizes.messageSize }]}>{message || t('bath.instructions')}</Text>
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