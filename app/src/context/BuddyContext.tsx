/**
 * BuddyContext - State management for the Buddy System.
 *
 * Generates a deterministic buddy based on the user's ID and provides
 * event-based reactions and interaction state.
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';
import { generateBuddy } from '../buddy/generator';
import { getReaction } from '../buddy/reactions';
import type { Buddy, BuddyEvent, BuddyEventType } from '../buddy/types';
import { logger } from '../utils/logger';

const BUDDY_STORAGE_KEY = '@lillys_box:buddy';
const IDLE_INTERVAL_MS = 30_000; // idle quip every 30s
const BUBBLE_DURATION_MS = 6_000; // speech bubble visible for 6s

type BuddyContextType = {
  /** The generated buddy (null if not yet loaded) */
  buddy: Buddy | null;
  /** Current speech bubble text */
  speechBubble: string | null;
  /** Whether the buddy is being petted */
  isPetting: boolean;
  /** Total times this buddy has been petted */
  petCount: number;
  /** Send an event to the buddy to get a reaction */
  sendEvent: (type: BuddyEventType, text?: string) => void;
  /** Pet the buddy (tap interaction) */
  petBuddy: () => void;
  /** Re-generate buddy with a new seed (for dev/testing) */
  regenerate: (seed: string) => void;
};

const BuddyContext = createContext<BuddyContextType | undefined>(undefined);

export const BuddyProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user, isGuest } = useAuth();
  const userId = user?.id || (isGuest ? 'guest' : 'anonymous');

  const [buddy, setBuddy] = useState<Buddy | null>(null);
  const [speechBubble, setSpeechBubble] = useState<string | null>(null);
  const [isPetting, setIsPetting] = useState(false);
  const [petCount, setPetCount] = useState(0);

  const bubbleTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const petTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const idleTimerRef = useRef<ReturnType<typeof setInterval>>();

  // Generate buddy from user seed
  useEffect(() => {
    const seed = `buddy-${userId}`;
    const generated = generateBuddy(seed);
    setBuddy(generated);

    // Load pet count from storage
    AsyncStorage.getItem(`${BUDDY_STORAGE_KEY}:${userId}:petCount`)
      .then((stored) => {
        if (stored != null) {
          const val = parseInt(stored, 10);
          if (!isNaN(val)) setPetCount(val);
        }
      })
      .catch((e) => logger.warn('Failed to load buddy pet count', e));

    // Send greeting
    const greetingEvent: BuddyEvent = {
      type: 'greeting',
      timestamp: Date.now(),
    };
    const reaction = getReaction(generated, greetingEvent);
    showBubble(reaction);

    return () => {
      clearTimeout(bubbleTimerRef.current);
      clearTimeout(petTimerRef.current);
    };
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Idle quips
  useEffect(() => {
    if (!buddy) return;

    idleTimerRef.current = setInterval(() => {
      // Don't interrupt existing speech
      if (speechBubble) return;

      const event: BuddyEvent = { type: 'idle', timestamp: Date.now() };
      const reaction = getReaction(buddy, event);
      showBubble(reaction);
    }, IDLE_INTERVAL_MS);

    return () => {
      if (idleTimerRef.current) clearInterval(idleTimerRef.current);
    };
  }, [buddy, speechBubble]); // eslint-disable-line react-hooks/exhaustive-deps

  const showBubble = useCallback((text: string) => {
    setSpeechBubble(text);
    clearTimeout(bubbleTimerRef.current);
    bubbleTimerRef.current = setTimeout(() => {
      setSpeechBubble(null);
    }, BUBBLE_DURATION_MS);
  }, []);

  const sendEvent = useCallback(
    (type: BuddyEventType, text?: string) => {
      if (!buddy) return;
      const event: BuddyEvent = { type, text, timestamp: Date.now() };
      const reaction = getReaction(buddy, event);
      showBubble(reaction);
    },
    [buddy, showBubble],
  );

  const petBuddy = useCallback(() => {
    if (!buddy) return;

    setIsPetting(true);
    const newCount = petCount + 1;
    setPetCount(newCount);

    // Save pet count
    AsyncStorage.setItem(
      `${BUDDY_STORAGE_KEY}:${userId}:petCount`,
      newCount.toString(),
    ).catch((e) => logger.warn('Failed to save buddy pet count', e));

    const event: BuddyEvent = { type: 'petting', timestamp: Date.now() };
    const reaction = getReaction(buddy, event);
    showBubble(reaction);

    clearTimeout(petTimerRef.current);
    petTimerRef.current = setTimeout(() => setIsPetting(false), 2000);
  }, [buddy, petCount, userId, showBubble]);

  const regenerate = useCallback((seed: string) => {
    const generated = generateBuddy(seed);
    setBuddy(generated);
    setPetCount(0);

    const event: BuddyEvent = { type: 'greeting', timestamp: Date.now() };
    const reaction = getReaction(generated, event);
    showBubble(reaction);
  }, [showBubble]);

  return (
    <BuddyContext.Provider
      value={{
        buddy,
        speechBubble,
        isPetting,
        petCount,
        sendEvent,
        petBuddy,
        regenerate,
      }}
    >
      {children}
    </BuddyContext.Provider>
  );
};

export const useBuddy = (): BuddyContextType => {
  const context = useContext(BuddyContext);
  if (context === undefined) {
    throw new Error('useBuddy must be used within a BuddyProvider');
  }
  return context;
};
