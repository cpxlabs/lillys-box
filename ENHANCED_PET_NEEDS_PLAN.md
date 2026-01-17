# Enhanced Pet Needs System - Implementation Plan

## 📋 Executive Summary

This document outlines the complete plan for implementing an enhanced pet needs system that adds **Energy**, **Health**, and **Sleep** mechanics to the existing Hunger and Hygiene system. The goal is to create a more engaging, realistic, and balanced pet care experience.

---

## 🎯 Objectives

1. **Increase Game Depth** - Add more dimensions to pet care beyond just feeding and bathing
2. **Create Interdependencies** - Stats should affect each other realistically
3. **Add Sleep Mechanic** - Introduce a rest/sleep activity for energy recovery
4. **Health System** - Overall wellness indicator that reflects proper care
5. **Maintain Balance** - Keep gameplay accessible for children while adding complexity
6. **Backwards Compatibility** - Migrate existing pets without data loss

---

## 📊 Current System Analysis

### Existing Stats (from src/types.ts and PetContext.tsx)

| Stat | Range | Decay Rate | Activities Affecting It |
|------|-------|------------|------------------------|
| **Hunger** | 0-100 | -1 per minute | Feed (+25), Play (-20), Bathe (-10) |
| **Hygiene** | 0-100 | -1 per minute | Bathe (+30), Play (-20) |
| **Money** | 0-∞ | N/A | Earned through ads |

### Current Activities

1. **Feed** - Increases hunger by 25
2. **Play** - Decreases hunger by 20, hygiene by 20
3. **Bathe** - Increases hygiene by 30, decreases hunger by 10

### Identified Issues

- No energy/fatigue system (pet never gets tired)
- No overall health indicator
- Missing sleep/rest mechanic
- Limited strategic depth (just keep stats above 0)
- No consequences for neglecting pet beyond stat depletion

---

## 🆕 Enhanced System Design

### New Stats

#### 1. Energy (0-100)

**Description:** Represents the pet's physical and mental stamina.

**Behavior:**
- Starts at 100 when pet is created
- Decreases based on activity and time
- Low energy affects all other stats negatively
- Restored primarily through sleep

**Decay Rules:**
- **Passive Decay:** -0.5 per minute during daytime (6 AM - 10 PM)
- **Passive Decay:** -0.2 per minute during nighttime (10 PM - 6 AM)
- **Activity Cost:** Each activity consumes additional energy

**Critical Thresholds:**
- 100-70: Energetic (normal stat gains/losses)
- 69-40: Tired (50% reduced stat gains from activities)
- 39-20: Exhausted (75% reduced stat gains, 1.5x stat losses)
- 19-0: Critical (all activities blocked except sleep, accelerated stat decay)

---

#### 2. Health (0-100)

**Description:** Overall wellness indicator based on how well all needs are being met.

**Behavior:**
- Starts at 100 when pet is created
- Calculated as a weighted average of other stats
- Does NOT decay passively (it's a derived stat)
- Low health triggers visual indicators (sad face, shaking)

**Calculation Formula:**
```typescript
health = (
  (hunger * 0.25) +
  (hygiene * 0.20) +
  (energy * 0.25) +
  (happiness * 0.30)
) * statusMultiplier
```

**Status Multiplier:**
- If ALL stats > 50: multiplier = 1.0
- If ANY stat < 50: multiplier = 0.9
- If ANY stat < 25: multiplier = 0.75
- If ANY stat < 10: multiplier = 0.5

**Health States:**
- 100-80: Excellent (green heart icon, happy animations)
- 79-60: Good (yellow heart icon, normal animations)
- 59-40: Fair (orange heart icon, slower animations)
- 39-20: Poor (red heart icon, sad animations)
- 19-0: Critical (blinking red heart, very sad animations, vet needed)

---

#### 3. Happiness (existing concept, now explicit)

**Description:** Emotional well-being of the pet.

**Behavior:**
- Starts at 80 when pet is created
- Affected by activities and how well needs are met
- Decays slowly if pet is neglected

**Decay Rules:**
- **Passive Decay:** -0.3 per minute if health < 60
- **Passive Decay:** -0.5 per minute if health < 40
- **No decay** if health > 60

**Affected By:**
- Play activity (+20)
- Being well-fed (+0.5 per minute if hunger > 70)
- Being clean (+0.5 per minute if hygiene > 70)
- Having energy (+0.5 per minute if energy > 70)
- New clothes/accessories (+5 instant)
- Petting/interaction (+10)

---

### Activity Interactions Matrix

| Activity | Hunger | Hygiene | Energy | Happiness | Duration | Money Earned |
|----------|--------|---------|--------|-----------|----------|--------------|
| **Feed** | +25 | -2 | +5 | +3 | Instant | 0 |
| **Bathe** | -10 | +35 | -8 | +5 | Instant | 0 |
| **Play** | -15 | -15 | -25 | +20 | Instant | 5 |
| **Sleep** | -5 | 0 | +40 | +10 | 30 sec | 0 |
| **Pet/Cuddle** | 0 | 0 | -3 | +10 | Instant | 0 |
| **Vet Visit** | -5 | +5 | -10 | -5 | Instant | -50 or Ad |
| **Exercise** | -20 | -10 | -30 | +15 | Instant | 10 |

---

### New Activity: Sleep

**Purpose:** Primary way to restore energy and provide passive recovery.

**Mechanics:**
- Duration: 30 seconds (real-time)
- Can only be used if energy < 80
- Pet shows sleeping animation during sleep
- All stat decay is paused during sleep
- Player can cancel early (partial energy recovery)

**Visual Design:**
- Bed icon appears when energy < 80
- Pet lies down and closes eyes
- "Zzz" particles float above pet
- Progress bar shows sleep duration
- Gentle music/ambient sounds

**Rewards:**
- Energy: +40 (full sleep) or +1.33 per second
- Happiness: +10 (well-rested bonus)
- Hunger: -5 (slight hunger from time passing)
- Small chance of money reward (+5) for completing full sleep

**Implementation:**
```typescript
sleep: (duration: number = 30000) => {
  // duration in milliseconds, default 30 seconds
  setPet((currentPet) => {
    if (!currentPet || currentPet.energy >= 80) return currentPet;

    const energyGain = Math.min(40, (duration / 30000) * 40);
    const updatedPet: Pet = {
      ...currentPet,
      energy: Math.min(100, currentPet.energy + energyGain),
      happiness: Math.min(100, currentPet.happiness + 10),
      hunger: Math.max(0, currentPet.hunger - 5),
    };
    savePet(updatedPet).catch(console.error);
    return updatedPet;
  });
}
```

---

### New Activity: Vet Visit

**Purpose:** Restore health when pet is sick or neglected.

**When Available:**
- Health < 40 (appears as urgent)
- Health < 60 (appears as suggested)

**Cost:**
- 50 coins OR watch a rewarded ad

**Effects:**
- Health: Set to 70 (minimum)
- Energy: -10 (stressful experience)
- Happiness: -5 (pets don't like vet)
- All other stats: +10 boost

**Visual Design:**
- Medical cross icon (red when urgent, yellow when suggested)
- Shows vet animation (stethoscope, checkup)
- Sound effect: heartbeat, "all clear" chime

---

### New Activity: Exercise/Training

**Purpose:** Balanced activity that increases happiness while consuming resources.

**Mechanics:**
- Available anytime
- More exhausting than regular play
- Earns more money than play

**Effects:**
- Hunger: -20
- Hygiene: -10
- Energy: -30
- Happiness: +15
- Money: +10

**Visual Design:**
- Shows pet running, jumping, or doing tricks
- More dynamic animations than regular play
- Fitness-themed icons (dumbbell, running shoe)

---

### New Activity: Pet/Cuddle

**Purpose:** Low-cost way to boost happiness.

**Mechanics:**
- Available anytime
- No cooldown
- Quick interaction

**Effects:**
- Energy: -3 (minimal cost)
- Happiness: +10
- Shows heart particles

---

## 🔄 Stat Interdependencies

### Energy Effects on Other Stats

| Energy Level | Effect |
|--------------|--------|
| 70-100 | Normal (1.0x gains, 1.0x losses) |
| 40-69 | Tired (0.5x gains, 1.0x losses) |
| 20-39 | Exhausted (0.25x gains, 1.5x losses) |
| 0-19 | Critical (all activities except sleep blocked) |

### Health Effects on Pet Behavior

| Health Level | Visual Indicator | Animation Speed | Decay Rate Modifier |
|--------------|------------------|-----------------|---------------------|
| 80-100 | Happy face, green heart | 100% | 1.0x |
| 60-79 | Neutral face, yellow heart | 100% | 1.0x |
| 40-59 | Sad face, orange heart | 80% | 1.2x |
| 20-39 | Very sad face, red heart | 60% | 1.5x |
| 0-19 | Sick face, blinking red | 40% | 2.0x |

### Happiness Effects

| Happiness Level | Effect |
|-----------------|--------|
| 80-100 | Bonus animations, more responsive |
| 60-79 | Normal behavior |
| 40-59 | Slower reactions, less playful |
| 20-39 | Sad animations, refuses some activities |
| 0-19 | Very sad, only accepts sleep and food |

---

## 🎮 Game Balance

### Decay Rates Summary

| Stat | Base Decay | Conditional Modifiers |
|------|------------|----------------------|
| Hunger | -1.0/min | None |
| Hygiene | -1.0/min | None |
| Energy | -0.5/min (day)<br>-0.2/min (night) | Activity costs |
| Happiness | -0.3/min (health < 60)<br>-0.5/min (health < 40) | +0.5/min if all stats > 70 |

### Time to Critical (from 100 to 0)

| Stat | Time to Critical | Real-World Time |
|------|------------------|-----------------|
| Hunger | 100 minutes | 1 hour 40 minutes |
| Hygiene | 100 minutes | 1 hour 40 minutes |
| Energy | 200 minutes (day)<br>500 minutes (night) | 3-8 hours |
| Happiness | Variable (300+ min if healthy) | 5+ hours |

**Design Goal:** Player should check in 2-3 times per day for optimal care.

---

## 🎨 UI/UX Design

### Status Display Layout

```
┌─────────────────────────────────────┐
│  🍖 Hunger    [████████░░] 80%      │
│  🛁 Hygiene   [██████░░░░] 60%      │
│  ⚡ Energy    [███████░░░] 70%      │
│  😊 Happiness [█████████░] 90%      │
│  ❤️  Health   [████████░░] 82%      │
└─────────────────────────────────────┘
```

### Color Coding

| Stat | Color (High) | Color (Medium) | Color (Low) |
|------|--------------|----------------|-------------|
| Hunger | #4CAF50 (green) | #FFA726 (orange) | #EF5350 (red) |
| Hygiene | #2196F3 (blue) | #FFA726 (orange) | #EF5350 (red) |
| Energy | #FFD54F (yellow) | #FFA726 (orange) | #EF5350 (red) |
| Happiness | #E91E63 (pink) | #FFA726 (orange) | #757575 (gray) |
| Health | #4CAF50 (green) | #FFA726 (orange) | #EF5350 (red) |

### Status Icons

- **Hunger:** 🍖 (drumstick)
- **Hygiene:** 🛁 (bathtub)
- **Energy:** ⚡ (lightning bolt)
- **Happiness:** 😊 (happy face) / 😢 (sad face when low)
- **Health:** ❤️ (heart)

### Warning Indicators

When any stat drops below 25%, show:
- Pulsing red glow around the stat bar
- Exclamation mark (!) next to the stat
- Push notification (if enabled): "Your pet needs attention!"

---

## 🏗️ Technical Implementation

### Phase 1: Type Definitions (Week 1)

**File:** `src/types.ts`

**Changes:**
```typescript
export type Pet = {
  id: string;
  name: string;
  type: PetType;
  color: PetColor;
  gender: Gender;

  // Existing stats
  hunger: number; // 0-100
  hygiene: number; // 0-100
  money: number;

  // NEW: Enhanced stats
  energy: number; // 0-100
  happiness: number; // 0-100
  health: number; // 0-100 (calculated)

  // Metadata
  clothes: Record<ClothingSlot, string | null>;
  background: string | null;
  createdAt: number;
  lastUpdated: number; // NEW: track last update time
  isSleeping?: boolean; // NEW: track sleep state
  sleepStartTime?: number; // NEW: when sleep began
};

export type AnimationState =
  | 'idle'
  | 'eating'
  | 'bathing'
  | 'happy'
  | 'sleeping'  // NEW
  | 'playing'   // NEW
  | 'tired'     // NEW
  | 'sick';     // NEW

export type PetMood =
  | 'excellent'
  | 'good'
  | 'fair'
  | 'poor'
  | 'critical';

export type StatLevel = {
  value: number;
  level: 'high' | 'medium' | 'low' | 'critical';
  color: string;
};
```

---

### Phase 2: Utility Functions (Week 1)

**File:** `src/utils/petStats.ts` (NEW)

```typescript
import { Pet, PetMood, StatLevel } from '../types';

/**
 * Calculate pet's health based on all stats
 */
export const calculateHealth = (pet: Pet): number => {
  const { hunger, hygiene, energy, happiness } = pet;

  // Weighted average
  const baseHealth = (
    (hunger * 0.25) +
    (hygiene * 0.20) +
    (energy * 0.25) +
    (happiness * 0.30)
  );

  // Apply status multiplier
  const allStatsAbove50 = hunger > 50 && hygiene > 50 && energy > 50 && happiness > 50;
  const anyStatBelow25 = hunger < 25 || hygiene < 25 || energy < 25 || happiness < 25;
  const anyStatBelow10 = hunger < 10 || hygiene < 10 || energy < 10 || happiness < 10;
  const anyStatBelow50 = hunger < 50 || hygiene < 50 || energy < 50 || happiness < 50;

  let multiplier = 1.0;
  if (anyStatBelow10) multiplier = 0.5;
  else if (anyStatBelow25) multiplier = 0.75;
  else if (anyStatBelow50) multiplier = 0.9;
  else if (allStatsAbove50) multiplier = 1.0;

  return Math.min(100, Math.max(0, baseHealth * multiplier));
};

/**
 * Get pet's current mood based on health
 */
export const getPetMood = (health: number): PetMood => {
  if (health >= 80) return 'excellent';
  if (health >= 60) return 'good';
  if (health >= 40) return 'fair';
  if (health >= 20) return 'poor';
  return 'critical';
};

/**
 * Get stat level with color coding
 */
export const getStatLevel = (value: number): StatLevel => {
  let level: 'high' | 'medium' | 'low' | 'critical';
  let color: string;

  if (value >= 70) {
    level = 'high';
    color = '#4CAF50'; // green
  } else if (value >= 40) {
    level = 'medium';
    color = '#FFA726'; // orange
  } else if (value >= 20) {
    level = 'low';
    color = '#EF5350'; // red
  } else {
    level = 'critical';
    color = '#C62828'; // dark red
  }

  return { value, level, color };
};

/**
 * Calculate energy decay rate based on time of day
 */
export const getEnergyDecayRate = (): number => {
  const hour = new Date().getHours();
  const isDaytime = hour >= 6 && hour < 22;
  return isDaytime ? -0.5 : -0.2;
};

/**
 * Calculate activity effect multiplier based on energy
 */
export const getEnergyMultiplier = (energy: number): number => {
  if (energy >= 70) return 1.0;
  if (energy >= 40) return 0.5;
  if (energy >= 20) return 0.25;
  return 0; // Critical: activities blocked
};

/**
 * Calculate stat decay multiplier based on health
 */
export const getDecayMultiplier = (health: number): number => {
  if (health >= 80) return 1.0;
  if (health >= 60) return 1.0;
  if (health >= 40) return 1.2;
  if (health >= 20) return 1.5;
  return 2.0;
};

/**
 * Check if vet visit is needed
 */
export const needsVet = (health: number): 'urgent' | 'suggested' | 'none' => {
  if (health < 40) return 'urgent';
  if (health < 60) return 'suggested';
  return 'none';
};

/**
 * Check if pet can perform activity (not too tired)
 */
export const canPerformActivity = (pet: Pet, activityName: string): boolean => {
  // Sleep is always allowed
  if (activityName === 'sleep') return pet.energy < 80;

  // Other activities blocked if energy critical
  if (pet.energy < 20) return false;

  return true;
};
```

---

### Phase 3: Context Updates (Week 2)

**File:** `src/context/PetContext.tsx`

**Major changes:**

1. Add new state properties to Pet type
2. Update decay interval to handle multiple stats
3. Add new activity methods
4. Implement health calculation
5. Add migration logic for existing pets

```typescript
// Enhanced decay interval
useEffect(() => {
  const interval = setInterval(() => {
    setPet((currentPet) => {
      if (!currentPet) return currentPet;

      // Skip decay if pet is sleeping
      if (currentPet.isSleeping) return currentPet;

      const now = Date.now();
      const lastUpdate = currentPet.lastUpdated || now;
      const minutesPassed = (now - lastUpdate) / 60000;

      // Calculate decay based on time passed
      const hungerDecay = 1 * minutesPassed;
      const hygieneDecay = 1 * minutesPassed;
      const energyDecay = getEnergyDecayRate() * minutesPassed;

      // Calculate health first (needed for happiness decay)
      const tempPet = {
        ...currentPet,
        hunger: Math.max(0, currentPet.hunger - hungerDecay),
        hygiene: Math.max(0, currentPet.hygiene - hygieneDecay),
        energy: Math.max(0, currentPet.energy - energyDecay),
      };

      const health = calculateHealth(tempPet);

      // Happiness decay based on health
      let happinessDecay = 0;
      if (health < 40) happinessDecay = 0.5 * minutesPassed;
      else if (health < 60) happinessDecay = 0.3 * minutesPassed;

      // Happiness gain if all stats high
      let happinessGain = 0;
      if (tempPet.hunger > 70 && tempPet.hygiene > 70 && tempPet.energy > 70) {
        happinessGain = 0.5 * minutesPassed;
      }

      const updatedPet: Pet = {
        ...tempPet,
        happiness: Math.min(100, Math.max(0,
          currentPet.happiness - happinessDecay + happinessGain
        )),
        health,
        lastUpdated: now,
      };

      savePet(updatedPet).catch(console.error);
      return updatedPet;
    });
  }, 60000); // Every minute

  return () => clearInterval(interval);
}, []);

// New activities
const sleep = async (duration: number = 30000) => {
  setPet((currentPet) => {
    if (!currentPet || currentPet.energy >= 80) return currentPet;

    const updatedPet: Pet = {
      ...currentPet,
      isSleeping: true,
      sleepStartTime: Date.now(),
    };
    savePet(updatedPet).catch(console.error);
    return updatedPet;
  });

  // Wait for sleep duration
  await new Promise(resolve => setTimeout(resolve, duration));

  // Wake up and apply benefits
  setPet((currentPet) => {
    if (!currentPet) return currentPet;

    const energyGain = 40;
    const updatedPet: Pet = {
      ...currentPet,
      energy: Math.min(100, currentPet.energy + energyGain),
      happiness: Math.min(100, currentPet.happiness + 10),
      hunger: Math.max(0, currentPet.hunger - 5),
      isSleeping: false,
      sleepStartTime: undefined,
      health: calculateHealth(currentPet),
    };
    savePet(updatedPet).catch(console.error);
    return updatedPet;
  });
};

const visitVet = (useMoney: boolean = true) => {
  setPet((currentPet) => {
    if (!currentPet) return currentPet;

    // Check if can afford
    if (useMoney && currentPet.money < 50) return currentPet;

    const updatedPet: Pet = {
      ...currentPet,
      hunger: Math.min(100, currentPet.hunger + 10),
      hygiene: Math.min(100, currentPet.hygiene + 10),
      energy: Math.max(0, currentPet.energy - 10),
      happiness: Math.max(0, currentPet.happiness - 5),
      money: useMoney ? currentPet.money - 50 : currentPet.money,
    };

    updatedPet.health = calculateHealth(updatedPet);
    savePet(updatedPet).catch(console.error);
    return updatedPet;
  });
};

const exercise = () => {
  setPet((currentPet) => {
    if (!currentPet || !canPerformActivity(currentPet, 'exercise')) {
      return currentPet;
    }

    const multiplier = getEnergyMultiplier(currentPet.energy);

    const updatedPet: Pet = {
      ...currentPet,
      hunger: Math.max(0, currentPet.hunger - 20),
      hygiene: Math.max(0, currentPet.hygiene - 10),
      energy: Math.max(0, currentPet.energy - 30),
      happiness: Math.min(100, currentPet.happiness + (15 * multiplier)),
      money: currentPet.money + 10,
    };

    updatedPet.health = calculateHealth(updatedPet);
    savePet(updatedPet).catch(console.error);
    return updatedPet;
  });
};

const petCuddle = () => {
  setPet((currentPet) => {
    if (!currentPet) return currentPet;

    const updatedPet: Pet = {
      ...currentPet,
      energy: Math.max(0, currentPet.energy - 3),
      happiness: Math.min(100, currentPet.happiness + 10),
    };

    updatedPet.health = calculateHealth(updatedPet);
    savePet(updatedPet).catch(console.error);
    return updatedPet;
  });
};
```

---

### Phase 4: Migration Logic (Week 2)

**File:** `src/utils/migration.ts` (NEW)

```typescript
import { Pet } from '../types';

/**
 * Migrate old pet data to new schema
 */
export const migratePetData = (oldPet: any): Pet => {
  // Check if pet already has new fields
  if ('energy' in oldPet && 'happiness' in oldPet && 'health' in oldPet) {
    return oldPet as Pet;
  }

  // Migrate to new schema
  const migratedPet: Pet = {
    ...oldPet,
    energy: oldPet.energy ?? 80, // Start with decent energy
    happiness: oldPet.happiness ?? 75, // Start happy
    health: oldPet.health ?? 85, // Start healthy
    lastUpdated: oldPet.lastUpdated ?? Date.now(),
    isSleeping: false,
  };

  return migratedPet;
};
```

**Update storage.ts:**
```typescript
export const loadPet = async (): Promise<Pet | null> => {
  try {
    const data = await AsyncStorage.getItem(PET_STORAGE_KEY);
    if (data) {
      const pet = JSON.parse(data);
      // Apply migration
      return migratePetData(pet);
    }
    return null;
  } catch (error) {
    console.error('Error loading pet:', error);
    return null;
  }
};
```

---

### Phase 5: UI Components (Week 3)

**File:** `src/components/EnhancedStatusBar.tsx` (NEW)

```typescript
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from './StatusBar';
import { Pet } from '../types';
import { getStatLevel } from '../utils/petStats';

type EnhancedStatusBarProps = {
  pet: Pet;
};

export const EnhancedStatusBar: React.FC<EnhancedStatusBarProps> = ({ pet }) => {
  const hungerLevel = getStatLevel(pet.hunger);
  const hygieneLevel = getStatLevel(pet.hygiene);
  const energyLevel = getStatLevel(pet.energy);
  const happinessLevel = getStatLevel(pet.happiness);
  const healthLevel = getStatLevel(pet.health);

  return (
    <View style={styles.container}>
      <StatusBar
        label="Hunger"
        value={pet.hunger}
        color={hungerLevel.color}
        emoji="🍖"
      />
      <StatusBar
        label="Hygiene"
        value={pet.hygiene}
        color={hygieneLevel.color}
        emoji="🛁"
      />
      <StatusBar
        label="Energy"
        value={pet.energy}
        color={energyLevel.color}
        emoji="⚡"
      />
      <StatusBar
        label="Happiness"
        value={pet.happiness}
        color={happinessLevel.color}
        emoji={pet.happiness > 50 ? "😊" : "😢"}
      />
      <StatusBar
        label="Health"
        value={pet.health}
        color={healthLevel.color}
        emoji="❤️"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
});
```

---

**File:** `src/screens/SleepScene.tsx` (NEW)

```typescript
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { usePet } from '../context/PetContext';

export const SleepScene: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { pet, sleep } = usePet();
  const [isSleeping, setIsSleeping] = useState(false);
  const [sleepProgress, setSleepProgress] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(1));

  const SLEEP_DURATION = 30000; // 30 seconds

  const startSleep = async () => {
    setIsSleeping(true);
    setSleepProgress(0);

    // Fade out effect
    Animated.timing(fadeAnim, {
      toValue: 0.3,
      duration: 2000,
      useNativeDriver: true,
    }).start();

    // Progress bar
    const interval = setInterval(() => {
      setSleepProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + (100 / (SLEEP_DURATION / 100));
      });
    }, 100);

    // Execute sleep
    await sleep(SLEEP_DURATION);

    // Fade back in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();

    clearInterval(interval);
    setIsSleeping(false);

    // Return to home
    navigation.goBack();
  };

  const cancelSleep = () => {
    setIsSleeping(false);
    navigation.goBack();
  };

  if (!pet) return null;

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.petContainer, { opacity: fadeAnim }]}>
        <Text style={styles.sleepText}>💤 Zzz...</Text>
        <Text style={styles.petName}>{pet.name} is sleeping</Text>
      </Animated.View>

      {isSleeping ? (
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Sleeping... {Math.round(sleepProgress)}%
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${sleepProgress}%` }
              ]}
            />
          </View>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={cancelSleep}
          >
            <Text style={styles.cancelButtonText}>Wake Up Early</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.sleepButton}
          onPress={startSleep}
          disabled={pet.energy >= 80}
        >
          <Text style={styles.sleepButtonText}>
            {pet.energy >= 80 ? 'Not Tired' : 'Sleep (30s)'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  petContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  sleepText: {
    fontSize: 60,
    marginBottom: 20,
  },
  petName: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '600',
  },
  sleepButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 12,
  },
  sleepButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  progressContainer: {
    alignItems: 'center',
    width: '80%',
  },
  progressText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 16,
  },
  progressBar: {
    width: '100%',
    height: 20,
    backgroundColor: '#333',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFD54F',
    borderRadius: 10,
  },
  cancelButton: {
    marginTop: 20,
    padding: 12,
  },
  cancelButtonText: {
    color: '#FFA726',
    fontSize: 16,
  },
});
```

---

### Phase 6: Update Existing Screens (Week 3)

**Files to update:**
- `src/screens/HomeScreen.tsx` - Add new status bars, sleep button, vet button
- `src/screens/FeedScene.tsx` - Update to use energy multipliers
- `src/screens/PlayScene.tsx` - Update to use energy multipliers
- `src/screens/BathScene.tsx` - Update to use energy multipliers

**Example update for HomeScreen.tsx:**

```typescript
import { EnhancedStatusBar } from '../components/EnhancedStatusBar';
import { needsVet } from '../utils/petStats';

// In render:
<EnhancedStatusBar pet={pet} />

{needsVet(pet.health) !== 'none' && (
  <TouchableOpacity
    style={[
      styles.vetButton,
      needsVet(pet.health) === 'urgent' && styles.vetButtonUrgent
    ]}
    onPress={() => navigation.navigate('VetScene')}
  >
    <Text style={styles.vetButtonText}>
      {needsVet(pet.health) === 'urgent' ? '🚨 Vet (Urgent)' : '⚕️ Vet Visit'}
    </Text>
  </TouchableOpacity>
)}

<TouchableOpacity
  style={[
    styles.sleepButton,
    pet.energy >= 80 && styles.sleepButtonDisabled
  ]}
  onPress={() => navigation.navigate('SleepScene')}
  disabled={pet.energy >= 80}
>
  <Text style={styles.sleepButtonText}>
    💤 Sleep {pet.energy < 50 && '(Needed!)'}
  </Text>
</TouchableOpacity>
```

---

### Phase 7: Testing (Week 4)

**Test Cases:**

1. **Stat Decay Testing**
   - Verify all stats decay at correct rates
   - Test day/night energy decay difference
   - Confirm happiness decays based on health

2. **Activity Testing**
   - Test each activity's stat changes
   - Verify energy multiplier effects
   - Confirm activity blocking when energy critical

3. **Health Calculation**
   - Test health formula with various stat combinations
   - Verify status multipliers apply correctly
   - Test critical thresholds

4. **Sleep Mechanic**
   - Test full sleep duration
   - Test early wake-up (partial recovery)
   - Verify stat decay pause during sleep

5. **Migration Testing**
   - Load old pet data
   - Verify migration adds new fields
   - Confirm old data preserved

6. **Edge Cases**
   - All stats at 0
   - All stats at 100
   - Rapid activity spam
   - App backgrounding during sleep

**Unit Tests:**

```typescript
// src/__tests__/utils/petStats.test.ts
import { calculateHealth, getPetMood, getEnergyMultiplier } from '../utils/petStats';

describe('petStats', () => {
  describe('calculateHealth', () => {
    it('calculates perfect health when all stats are 100', () => {
      const pet = {
        hunger: 100,
        hygiene: 100,
        energy: 100,
        happiness: 100,
      };
      expect(calculateHealth(pet)).toBe(100);
    });

    it('applies multiplier when any stat below 50', () => {
      const pet = {
        hunger: 40,
        hygiene: 80,
        energy: 80,
        happiness: 80,
      };
      expect(calculateHealth(pet)).toBeLessThan(80);
    });
  });

  describe('getPetMood', () => {
    it('returns excellent for health above 80', () => {
      expect(getPetMood(85)).toBe('excellent');
    });

    it('returns critical for health below 20', () => {
      expect(getPetMood(15)).toBe('critical');
    });
  });
});
```

---

## 📦 Deliverables

### Week 1: Foundation
- ✅ Updated type definitions
- ✅ Utility functions for stat calculations
- ✅ Migration logic
- ✅ Documentation

### Week 2: Core Logic
- ✅ Enhanced PetContext with new stats
- ✅ Decay system implementation
- ✅ New activity methods
- ✅ Health calculation

### Week 3: UI Implementation
- ✅ Enhanced status bar component
- ✅ Sleep scene
- ✅ Vet scene
- ✅ Updated existing scenes
- ✅ Warning indicators

### Week 4: Polish & Testing
- ✅ Unit tests
- ✅ Integration tests
- ✅ Bug fixes
- ✅ Balance adjustments
- ✅ Performance optimization

---

## 📈 Success Metrics

### Player Engagement
- **Target:** 20% increase in daily sessions
- **Measure:** Average sessions per day per user

### Session Length
- **Target:** 30% increase in average session duration
- **Measure:** Time spent in app per session

### Retention
- **Target:** 15% improvement in Day 7 retention
- **Measure:** Users returning after 7 days

### Feature Usage
- **Target:** 80% of users try sleep feature
- **Measure:** % of users who use sleep at least once

---

## 🔧 Configuration & Tuning

All numerical values should be easily configurable for balance tuning:

**File:** `src/config/gameBalance.ts` (NEW)

```typescript
export const GAME_BALANCE = {
  decay: {
    hunger: -1.0, // per minute
    hygiene: -1.0,
    energyDay: -0.5,
    energyNight: -0.2,
    happinessHealthy: 0.5,
    happinessUnhealthy: -0.3,
    happinessVeryUnhealthy: -0.5,
  },

  activities: {
    feed: { hunger: 25, energy: 5, happiness: 3, hygiene: -2 },
    bathe: { hygiene: 35, hunger: -10, energy: -8, happiness: 5 },
    play: { happiness: 20, hunger: -15, hygiene: -15, energy: -25, money: 5 },
    sleep: { energy: 40, happiness: 10, hunger: -5, duration: 30000 },
    exercise: { happiness: 15, hunger: -20, hygiene: -10, energy: -30, money: 10 },
    petCuddle: { happiness: 10, energy: -3 },
    vet: { cost: 50, health: 70, energy: -10, happiness: -5 },
  },

  thresholds: {
    energyForSleep: 80,
    energyForActivities: 20,
    healthForVetUrgent: 40,
    healthForVetSuggested: 60,
    statWarning: 25,
  },

  multipliers: {
    energyHigh: 1.0,
    energyMedium: 0.5,
    energyLow: 0.25,
    energyCritical: 0,

    decayHealthy: 1.0,
    decayFair: 1.2,
    decayPoor: 1.5,
    decayCritical: 2.0,
  },
};
```

---

## 🚨 Risks & Mitigation

### Risk 1: Too Complex for Target Audience (Children)
**Mitigation:**
- Add tutorial explaining each stat
- Visual indicators make it obvious what pet needs
- Allow some neglect without immediate consequences

### Risk 2: Player Frustration with Decay Rates
**Mitigation:**
- Extensive playtesting to find sweet spot
- Make decay rates configurable
- Consider "vacation mode" for extended absences

### Risk 3: Breaking Existing Saves
**Mitigation:**
- Robust migration logic
- Extensive testing with old save data
- Fallback to reasonable defaults

### Risk 4: Performance Impact
**Mitigation:**
- Optimize calculation frequency
- Use memoization for expensive calculations
- Profile and monitor performance metrics

### Risk 5: Balance Issues
**Mitigation:**
- Implement A/B testing
- Gather analytics on stat distributions
- Easy configuration for quick balance patches

---

## 📚 Resources Needed

### Development
- 4 weeks development time (1 developer)
- 1 week QA testing
- Design assets for new UI elements
- Sound effects for new activities

### Assets Needed
- Sleep animation sprites
- Vet/hospital scene graphics
- Exercise/training animations
- Status bar icons (high-res)
- Warning indicator graphics

### Documentation
- User tutorial/guide
- Developer documentation
- Balance tuning guide
- Analytics dashboard setup

---

## 🎯 Post-Launch Plan

### Week 1-2 After Launch
- Monitor player feedback and reviews
- Track analytics for stat distributions
- Identify balance issues
- Hot-fix critical bugs

### Week 3-4 After Launch
- Release balance patch if needed
- Add additional activities based on feedback
- Consider seasonal events

### Month 2+
- Expand system with new features (mini-games tied to stats)
- Add achievements related to pet care
- Consider multiplayer/social features

---

## ✅ Checklist

### Pre-Development
- [ ] Review and approve this plan
- [ ] Gather required design assets
- [ ] Set up analytics tracking
- [ ] Create development branch

### Development Phase
- [ ] Week 1: Type definitions and utilities
- [ ] Week 1: Migration logic
- [ ] Week 2: Context updates
- [ ] Week 2: Core game logic
- [ ] Week 3: UI components
- [ ] Week 3: Screen updates
- [ ] Week 4: Testing and bug fixes
- [ ] Week 4: Balance tuning

### Pre-Launch
- [ ] All tests passing
- [ ] Migration tested with old saves
- [ ] Performance profiling complete
- [ ] User tutorial created
- [ ] Analytics events configured
- [ ] Backup plan for rollback

### Launch
- [ ] Deploy to production
- [ ] Monitor analytics
- [ ] Gather feedback
- [ ] Prepare for balance patch

---

**Document Version:** 1.0
**Last Updated:** 2026-01-14
**Estimated Completion:** 4 weeks (1 developer)
**Status:** Ready for Review

---

## 📞 Questions or Feedback?

For questions about this implementation plan, please create a GitHub issue or contact the development team.
