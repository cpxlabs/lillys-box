# Play Actions Documentation

## Overview
The play system allows players to engage their pets in fun activities, increasing happiness while consuming energy. Each play session rewards the player with coins, with an optional ad-watching bonus for double rewards.

**🎯 Architecture Update (2026-01-18):** PlayScene has been migrated to use the `usePetActions` hook, reducing action logic from ~80 lines to ~5 lines (-94% code reduction). See [Stats Hook Migration](#stats-hook-migration) section for details.

---

## User Interface (PlayScene.tsx)

### Screen Layout

1. **Header Section** (`src/screens/PlayScene.tsx:87-91`)
   - Title: "🎮 Brincar" (Portuguese for "Play")
   - Back button to return to previous screen

2. **Status Card** (`src/screens/PlayScene.tsx:94-99`)
   - **Compact mode** display with:
     - Pet name with emoji (🐱 for cats, 🐶 for dogs)
     - Pet age (calculated from creation date)
     - Current stat levels

3. **Pet Display Area** (`src/screens/PlayScene.tsx:101-104`)
   - **Pet Renderer**: Shows pet with animation states
     - `idle`: Default state
     - `happy`: When playing with activity
   - **Message Display**: Shows contextual messages during play

4. **Activities Selection Area** (`src/screens/PlayScene.tsx:106-140`)
   - **Title**: "Escolha a atividade:" ("Choose the activity:")
   - **Navigation Controls**:
     - Left arrow: Previous activity (circular navigation)
     - Right arrow: Next activity (circular navigation)
     - Disabled during animations
   - **Current Activity Button**:
     - Large emoji display
     - Activity name
     - Clickable to initiate play
     - Disabled during animations
   - **Page Indicator**: Shows "X / Y" (current activity / total activities)

5. **Double Reward Modal** (`src/screens/PlayScene.tsx:143`)
   - Offers optional ad-watching for double coin reward
   - Appears after play animation completes

---

## Play Activities

### Available Activities (`src/screens/PlayScene.tsx:30-33`)

| ID | Emoji | Name | Description |
|----|-------|------|-------------|
| yarn_ball | 🧶 | Bola de lã | Playing with yarn ball |
| small_ball | ⚽ | Bolinha | Playing with small ball |

### Activity Properties
```typescript
{
  id: string;        // Unique identifier
  emoji: string;     // Visual display
  name: string;      // Activity name (hardcoded in Portuguese)
}
```

**Note:** Unlike feed items, play activities don't have value modifiers - all activities use the same stat effects from game balance configuration.

---

## Play Action Flow

### User Interaction Sequence

1. **User opens Play screen**
   - Current happiness and energy levels displayed in status card
   - First activity (yarn ball) shown by default
   - All stat levels visible

2. **User browses activities**
   - Left/right arrows cycle through 2 activities
   - Circular navigation (wraps around)
   - Both activities have identical effects

3. **User selects activity** (`src/screens/PlayScene.tsx:63-83`)
   - Button tap triggers `handlePlay(activity)`
   - Animation sequence begins
   - Stats updated immediately

4. **Animation Sequence**
   ```
   Happy (2.5s) → Happy with new message (2.5s) → Idle + Reward
   ```

5. **Reward Modal**
   - If ads enabled and ready: Show double reward offer
   - If ads disabled/not ready: Give base reward immediately

---

## Technical Implementation

### handlePlay Function (`src/screens/PlayScene.tsx:52-59`) ✅ **MIGRATED TO HOOK (2026-01-18)**

**Current Implementation (Hook-based):**

```typescript
const handlePlay = async (activity: typeof PLAY_ACTIVITIES[0]) => {
  await performAction('play', {
    activity: {
      emoji: activity.emoji,
      nameKey: activity.nameKey,
    },
  });
};
```

**Parameters:**
- `activity`: The selected activity with emoji and nameKey

**Process:**
1. Calls `performAction()` from `usePetActions` hook
2. Hook handles ALL animation states, timing, validation, and rewards automatically
3. No manual state management required
4. Automatic cleanup on component unmount

**Benefits:**
- ✅ **5 lines of code** (vs 43 lines in old implementation)
- ✅ **94% code reduction** in action logic
- ✅ No manual timeout refs or cleanup useEffect needed
- ✅ No manual validation or error handling boilerplate
- ✅ Consistent behavior with other action scenes
- ✅ Automatic memory leak prevention

---

### OLD Implementation (Pre-Hook, Historical Reference)

<details>
<summary>Click to view legacy implementation (before hook migration)</summary>

**Parameters:**
- `activity`: The selected activity with id, emoji, and name

**Process:**

1. **Happy Animation Start**
   ```typescript
   setAnimationState('happy');
   setMessage(`${pet.name} está brincando com ${activity.name}! 🎉`);
   play();
   ```
   - Changes pet animation to "happy"
   - Shows message: "{pet.name} is playing with {activity.name}! 🎉"
   - Calls `play()` context function immediately

2. **Continued Happiness**
   ```typescript
   setTimeout(() => {
     setMessage(`${pet.name} adorou brincar! 💕`);
   }, ANIMATION_DURATION.MEDIUM); // 2500ms
   ```
   - After 2.5 seconds, update message
   - Shows: "{pet.name} loved playing! 💕"
   - Pet remains in happy state

3. **Completion & Reward**
   ```typescript
   setTimeout(() => {
     setAnimationState('idle');
     setMessage('');
     triggerReward(moneyEarned); // 10 coins base
   }, ANIMATION_DURATION.MEDIUM); // Another 2500ms
   ```
   - After another 2.5 seconds, return to idle
   - Clear message
   - Trigger reward system (10 coins base, or 20 with ad)

**Total Animation Duration:** 5 seconds (2.5s + 2.5s)

**Issues with Old Approach:**
- ❌ 43 lines of boilerplate code
- ❌ Manual timeout management with refs
- ❌ Manual cleanup in useEffect
- ❌ Manual validation logic
- ❌ Manual error handling
- ❌ Code duplication across scenes

</details>

**Total Animation Duration:** Still 5 seconds (2.5s + 2.5s) - behavior unchanged, just cleaner code

---

## Pet Context Integration

### play() Function (`src/context/PetContext.tsx:145-165`)

**Parameters:** None

**Process:**

1. **Validation** (`PetContext.tsx:147`)
   ```typescript
   if (!currentPet || !canPerformActivity(currentPet, 'play')) return currentPet;
   ```
   - Checks if pet exists
   - Ensures energy ≥ 20 (minimum for activities)

2. **Energy Multiplier** (`PetContext.tsx:149`)
   ```typescript
   const multiplier = getEnergyMultiplier(currentPet.energy);
   ```
   - High energy (70-100): 1.0x multiplier
   - Medium energy (40-69): 0.5x multiplier
   - Low energy (20-39): 0.25x multiplier
   - Critical energy (<20): Activity blocked

3. **Stat Updates** (`PetContext.tsx:152-159`)
   ```typescript
   hunger: Math.max(0, currentPet.hunger + effects.hunger)
   hygiene: Math.max(0, currentPet.hygiene + effects.hygiene)
   energy: Math.max(0, currentPet.energy + effects.energy)
   happiness: Math.min(100, currentPet.happiness + effects.happiness * multiplier)
   money: currentPet.money + effects.money
   ```

4. **Game Balance Effects** (`src/config/gameBalance.ts:47-53`)
   ```typescript
   play: {
     happiness: 20,   // Happiness increase (affected by multiplier)
     hunger: -15,     // Hunger cost
     hygiene: -15,    // Hygiene cost
     energy: -25,     // Energy cost
     money: 5,        // Coins earned (in addition to reward system)
   }
   ```

   **⚠️ Important:** The `money: 5` in game balance is ALWAYS added to pet's money during play(), REGARDLESS of the reward system. This means:
   - Play action adds 5 coins to pet.money immediately
   - Reward system then offers 10 coins base (or 20 with ad)
   - **Total coins earned: 15 coins (or 25 with ad)**

5. **Health Recalculation** (`PetContext.tsx:161`)
   ```typescript
   updatedPet.health = calculateHealth(updatedPet);
   ```
   - Health recalculated from all stats
   - Weighted average: hunger 25%, hygiene 20%, energy 25%, happiness 30%

6. **Persistence** (`PetContext.tsx:162`)
   ```typescript
   savePet(updatedPet).catch(logger.error);
   ```

---

## Reward System

### Base Reward (`src/config/ads.config.ts:44`)
```typescript
playReward: 10, // Base coins for playing with pet
```

### Double Reward Flow (`src/hooks/useDoubleReward.tsx`)

**Decision Logic** (`useDoubleReward.tsx:65-74`)
```typescript
if (AdsConfig.enabled && AdsConfig.rewards.activityDoubleReward && isAdReady) {
  setPendingReward(amount);
  setShowDoubleRewardModal(true); // Show modal
} else {
  earnMoney(amount);  // Give reward immediately
  showToast(t('rewards.earned', { amount }), 'success');
}
```

**Reward Outcomes:**

| Scenario | Ad Status | Coins from Reward | Coins from play() | Total Coins | User Action |
|----------|-----------|-------------------|-------------------|-------------|-------------|
| Ads enabled | Ready | 20 (if watches) | 5 | **25** | Modal appears, user chooses |
| Ads enabled | Ready | 10 (if declines) | 5 | **15** | Modal appears, user declines |
| Ads enabled | Not ready | 10 | 5 | **15** | Reward given immediately |
| Ads disabled | N/A | 10 | 5 | **15** | Reward given immediately |

**⚠️ Note:** The 5 coins from `effects.money` are added BEFORE the reward modal, so they're already in the pet's money count when the modal appears.

**Modal Options:**
- **Watch Ad**: User watches rewarded video, receives additional 20 coins (10 × 2)
- **No Thanks**: User declines, receives additional 10 coins (base reward)

### Reward Multiplier (`src/config/constants.ts:158-163`)
```typescript
export const REWARD_MULTIPLIER = {
  SINGLE: 1,
  DOUBLE: 2,
} as const;
```

---

## Stat Impact Analysis

### Play Effect Breakdown

**Positive Effects:**
- **Happiness**: +20 (× energy multiplier)
- **Money**: +5 (immediate, from play() function)
- **Reward Coins**: +10 base (or +20 with ad)

**Costs:**
- **Hunger**: -15 (needs feeding afterwards)
- **Hygiene**: -15 (pet gets dirty from playing)
- **Energy**: -25 (significant energy drain)

### Energy Multiplier Impact

```
Example: Play action with different energy levels

High Energy (70-100):
- Happiness: 20 × 1.0 = +20
- Hunger: -15 (fixed)
- Hygiene: -15 (fixed)
- Energy: -25 (fixed)
- Money: +5 (fixed) + reward

Medium Energy (40-69):
- Happiness: 20 × 0.5 = +10
- Other stats: Same as above

Low Energy (20-39):
- Happiness: 20 × 0.25 = +5
- Other stats: Same as above

Critical Energy (<20):
- Play action BLOCKED
- Must sleep first
```

### Net Effect on Health

Since health is calculated from all stats:
```
Health = (hunger × 0.25) + (hygiene × 0.20) + (energy × 0.25) + (happiness × 0.30)

Before Play (example):
- Hunger: 80, Hygiene: 80, Energy: 70, Happiness: 60
- Health = (80×0.25) + (80×0.20) + (70×0.25) + (60×0.30) = 20 + 16 + 17.5 + 18 = 71.5

After Play (high energy):
- Hunger: 65, Hygiene: 65, Energy: 45, Happiness: 80
- Health = (65×0.25) + (65×0.20) + (45×0.25) + (80×0.30) = 16.25 + 13 + 11.25 + 24 = 64.5

Net Change: -7 health (short-term decrease due to stat costs)
```

**Implication:** Playing provides happiness and money but requires subsequent feeding and bathing to maintain health.

---

## UI States & Interactions

### Button States

**Play Button Disabled When:**
- Animation is playing (`animationState !== 'idle'`)
- Energy < 20 (activity validation in `canPerformActivity()`)

**Arrow Buttons Disabled When:**
- Animation is playing (`animationState !== 'idle'`)

### Animation States
```typescript
type AnimationState = 'idle' | 'happy';
```

| State | Duration | Displayed During |
|-------|----------|------------------|
| happy | 5 seconds total | Pet playing with activity |
| idle | Continuous | Default state, awaiting input |

### Messages

**Phase 1 (0-2.5s):**
```
"{pet.name} está brincando com {activity.name}! 🎉"
```
Example: "Fluffy está brincando com Bola de lã! 🎉"

**Phase 2 (2.5s-5s):**
```
"{pet.name} adorou brincar! 💕"
```
Example: "Fluffy adorou brincar! 💕"

**Note:** Messages are hardcoded in Portuguese, not using i18n system.

---

## Circular Navigation System

### useNavigationList Hook (`src/hooks/useNavigationList.ts`)

**Features:**
- Circular navigation (wraps around at start/end)
- Current index tracking (0-based)
- Total items count (2 activities)
- Navigation controls: `goToNext()`, `goToPrevious()`

**Example:**
```
Yarn Ball (0) ⇄ Small Ball (1) ⇄ Yarn Ball (0) ⇄ ...
```

### Page Indicator (`PlayScene.tsx:137-139`)
```typescript
{currentIndex + 1} / {totalItems}
```
- Displays as "1 / 2" or "2 / 2"
- User-friendly 1-based indexing

---

## Styling & Theme

### Color Scheme
- **Background**: `#e1f5fe` (Light blue)
- **Activities Container**: `#fff` (White)
- **Arrow Buttons**: `#b3e5fc` (Light blue)
- **Arrow Text**: `#0288d1` (Blue)
- **Current Activity Button**:
  - Background: `#81d4fa` (Medium blue)
  - Border: `#0288d1` (Blue, 3px)
- **Page Indicator**: `#666` (Gray)

### Responsive Design (`src/config/responsive.ts`)
- Pet size adapts to device type (mobile/tablet/desktop)
- Button sizes scale appropriately
- Text sizes adjust for readability
- Spacing uses responsive utility function

---

## Internationalization Status

### ~~Issues Found~~ ✅ FIXED (2026-01-17)

**Status**: ✅ **FULLY INTERNATIONALIZED** in commit 18d09f3

**Previous Issues (Now Resolved):**
1. ~~Screen title: `"🎮 Brincar"`~~ → ✅ Now uses `t('play.title')`
2. ~~Activity names: `"Bola de lã"`, `"Bolinha"`~~ → ✅ Now uses `t(activity.nameKey)`
3. ~~Messages: Template literals~~ → ✅ Now uses `t('play.playing')`, `t('play.loved')`
4. ~~Section title: `"Escolha a atividade:"`~~ → ✅ Now uses `t('play.chooseActivity')`

**Implementation:**
- Created `src/data/playActivities.ts` with centralized configuration
- Updated `PlayScene.tsx` to import PLAY_ACTIVITIES from data file
- All strings now use translation keys with i18n system
- Added translation keys to both `pt-BR.json` and `en.json`
- Matches FeedScene pattern for consistency

**Supported Languages:**
- ✅ Portuguese (pt-BR) - Complete
- ✅ English (en) - Complete

**Additional i18n Keys Added:**
- `play.needsRest` - User feedback when energy too low

---

## Edge Cases & Special Behaviors

### 1. Low Energy (`pet.energy < 20`)
- `canPerformActivity()` returns false
- Play action blocked entirely
- Pet needs to sleep first
- UI doesn't show error, button simply doesn't work

### 2. Energy Depletion During Play
- Energy reduced by 25 immediately when play() called
- Example: 40 energy → 15 energy after play
- If energy drops below 20, next play attempt blocked
- User should sleep to restore energy

### 3. Stat Overflow/Underflow
```typescript
Happiness: Math.min(100, currentPet.happiness + 20)  // Capped at 100
Hunger: Math.max(0, currentPet.hunger - 15)          // Floored at 0
Hygiene: Math.max(0, currentPet.hygiene - 15)        // Floored at 0
Energy: Math.max(0, currentPet.energy - 25)          // Floored at 0
```

### 4. Money Accumulation
- Money has no cap (can exceed 100)
- Each play: +5 immediately (from play())
- Plus: +10 base reward (or +20 with ad)
- Money never decreases from play action

### 5. Health Impact
- Health decreases short-term due to stat costs
- Requires balancing with feed/bathe/sleep actions
- Encourages varied gameplay loop

### 6. Ad Not Ready
- Modal not shown
- Base reward given immediately (10 coins)
- Total earned: 15 coins (5 + 10)
- Toast: "Earned 10 coins!" (doesn't include the 5 from play())

### 7. Rapid Clicking Prevention
- Buttons disabled during animations
- `animationState !== 'idle'` check on buttons
- No timeout refs needed (simpler than FeedScene)

---

## Comparison with Feed System

| Feature | Feed | Play |
|---------|------|------|
| **Primary Stat** | Hunger (+25 base) | Happiness (+20 base) |
| **Energy Cost** | +5 (gains energy) | -25 (costs energy) |
| **Money from Action** | 0 | +5 (immediate) |
| **Base Reward** | 5 coins | 10 coins |
| **Double Reward** | 10 coins | 20 coins |
| **Total Coins (no ad)** | 5 | 15 (5+10) |
| **Total Coins (with ad)** | 10 | 25 (5+20) |
| **Animation States** | eating → happy | happy → happy |
| **Duration** | 5 seconds | 5 seconds |
| **Activities Count** | 4 foods | 2 activities |
| **Internationalization** | ✅ Full | ❌ Hardcoded Portuguese |
| **Timeout Management** | ✅ Refs + cleanup | ❌ No refs (nested setTimeout) |

---

## Configuration Reference

### From gameBalance.ts
```typescript
activities: {
  play: {
    happiness: 20,   // Happiness increase (× energy multiplier)
    hunger: -15,     // Hunger cost
    hygiene: -15,    // Hygiene cost
    energy: -25,     // Energy cost
    money: 5,        // Immediate coin reward
  }
}

thresholds: {
  energyForActivities: 20, // Minimum energy to perform activities
}
```

### From ads.config.ts
```typescript
rewards: {
  playReward: 10,             // Base coin reward (separate from money: 5)
  activityDoubleReward: true, // Enable double reward offers
}
```

### From constants.ts
```typescript
ANIMATION_DURATION: {
  MEDIUM: 2500, // Milliseconds for each animation phase
}

REWARD_MULTIPLIER: {
  SINGLE: 1,
  DOUBLE: 2,
}
```

---

## Stats Hook Migration

### Overview ✅ **COMPLETED (2026-01-18)**

PlayScene was successfully migrated to use the unified `usePetActions` hook as part of a comprehensive stats refactor initiative.

### Migration Results

**Code Reduction:**
- **Before**: 280 lines total, ~80 lines of action logic
- **After**: 180 lines total, ~5 lines of action logic
- **Reduction**: -100 lines total (35%), -75 lines action code (94%)

**What Changed:**

**OLD Code (43 lines):**
```typescript
const { pet, play, earnMoney } = usePet();
const { showToast } = useToast();
const { triggerReward, DoubleRewardModal } = useDoubleReward({ earnMoney, showToast });
const [animationState, setAnimationState] = useState<AnimationState>('idle');
const [message, setMessage] = useState('');
const animationTimeout1 = useRef<NodeJS.Timeout | null>(null);
const animationTimeout2 = useRef<NodeJS.Timeout | null>(null);

useEffect(() => {
  return () => {
    if (animationTimeout1.current) clearTimeout(animationTimeout1.current);
    if (animationTimeout2.current) clearTimeout(animationTimeout2.current);
  };
}, []);

const handlePlay = (activity) => {
  if (!canPerformActivity(pet, 'play')) {
    showToast(t('play.needsRest', { name: pet.name }), 'info');
    return;
  }
  try {
    if (animationTimeout1.current) clearTimeout(animationTimeout1.current);
    if (animationTimeout2.current) clearTimeout(animationTimeout2.current);
    setAnimationState('happy');
    setMessage(t('play.playing', { name: pet.name, activity: t(activity.nameKey) }));
    play();
    const moneyEarned = AdsConfig.rewards.playReward;
    animationTimeout1.current = setTimeout(() => {
      setMessage(t('play.loved', { name: pet.name }));
      animationTimeout2.current = setTimeout(() => {
        setAnimationState('idle');
        setMessage('');
        triggerReward(moneyEarned);
      }, ANIMATION_DURATION.MEDIUM);
    }, ANIMATION_DURATION.MEDIUM);
  } catch (error) {
    logger.error('Play error:', error);
    setAnimationState('idle');
    setMessage('');
  }
};
```

**NEW Code (5 lines):**
```typescript
const { pet } = usePet();
const { animationState, message, isAnimating, performAction, DoubleRewardModal } = usePetActions();

const handlePlay = async (activity) => {
  await performAction('play', {
    activity: { emoji: activity.emoji, nameKey: activity.nameKey },
  });
};
```

### Hook Features Used

**From `usePetActions`:**
- ✅ `performAction()` - Single async function for all actions
- ✅ `animationState` - Current animation state (idle, playing, happy)
- ✅ `message` - Current message to display
- ✅ `isAnimating` - Boolean flag for button disable states
- ✅ `DoubleRewardModal` - Pre-configured reward modal component

**Automatic Behaviors:**
- ✅ Validation via `validateAction()` from petStats
- ✅ Toast notifications for validation failures
- ✅ Animation sequence from `actionConfig`
- ✅ Reward triggering (15 coins total: 5 immediate + 10 base reward)
- ✅ Timeout cleanup on unmount
- ✅ Error handling with state reset

### Configuration-Driven

All play action behavior is now defined in `src/config/actionConfig.ts`:

```typescript
play: {
  states: [
    { state: 'playing', duration: 1500, messageKey: 'play.playing', messageVars: ['name', 'activity'] },
    { state: 'happy', duration: 1500, messageKey: 'play.loved', messageVars: ['name'] },
    { state: 'idle', duration: 0, messageKey: '' },
  ],
  rewardAmount: 15,
  requiresDoubleReward: true,
  executeOnStart: true,
}
```

### Documentation Updates

**Related Documentation:**
- See `STATS_HOOK_MIGRATION_STATUS.md` for full migration report
- See `src/hooks/usePetActions.ts` for hook implementation details
- See `src/config/actionConfig.ts` for action configuration

---

## Related Files

| File | Purpose | Hook Migration |
|------|---------|----------------|
| `src/screens/PlayScene.tsx` | Main UI component for play screen | ✅ Migrated |
| `src/hooks/usePetActions.ts` ✨ | Unified action hook (NEW) | Migration core |
| `src/config/actionConfig.ts` ✨ | Action configuration (NEW) | Defines behavior |
| `src/context/PetContext.tsx` | Pet state management, play() function | Unchanged |
| `src/config/gameBalance.ts` | Play effects and energy thresholds | Unchanged |
| `src/config/ads.config.ts` | Reward amounts and ad configuration | Unchanged |
| `src/hooks/useDoubleReward.tsx` | Double reward modal and ad integration | Used by hook |
| `src/hooks/useNavigationList.ts` | Circular navigation for activities | Unchanged |
| `src/utils/petStats.ts` | Energy multiplier and activity validation | Enhanced |
| `src/data/playActivities.ts` | Centralized activity definitions | Unchanged |

---

## Testing Scenarios

### Happy Path
1. Pet has energy ≥ 20
2. User selects activity (yarn ball or small ball)
3. Animation plays (happy → happy with message change)
4. Stats updated: happiness +20, hunger -15, hygiene -15, energy -25, money +5
5. Health recalculated (likely decreases)
6. Reward offered (10 coins base, or modal for 20)
7. Total coins earned: 15 (or 25 with ad)

### Edge Cases to Test
1. **Low energy (<20)**: Play button doesn't work, no error shown
2. **Energy depletion**: Energy drops from 40 to 15, blocking next play
3. **Happiness at 95**: Playing gives 5 happiness (capped at 100)
4. **Hunger at 10**: Playing reduces to 0 (floored), pet needs food urgently
5. **Ad declined**: User receives 10 coins reward (15 total)
6. **Ad watched**: User receives 20 coins reward (25 total)
7. **High energy (80)**: Full multiplier, happiness +20
8. **Low energy (25)**: Reduced multiplier, happiness +5

---

## Recommended Improvements

### 1. Internationalization
```typescript
// Current (hardcoded)
title: "🎮 Brincar"

// Recommended
title: t('play.title')
```

### 2. Timeout Management
```typescript
// Add refs like FeedScene to prevent memory leaks
const animationTimeout1 = useRef<NodeJS.Timeout | null>(null);

useEffect(() => {
  return () => {
    if (animationTimeout1.current) clearTimeout(animationTimeout1.current);
  };
}, []);
```

### 3. Activity Configuration
```typescript
// Move to data file like foodItems.ts
export const PLAY_ACTIVITIES = [
  { id: 'yarn_ball', emoji: '🧶', nameKey: 'play.activities.yarn_ball' },
  { id: 'small_ball', emoji: '⚽', nameKey: 'play.activities.small_ball' },
];
```

### 4. User Feedback for Blocked Actions
```typescript
// Show toast when energy too low
if (!canPerformActivity(pet, 'play')) {
  showToast(t('play.needsRest'), 'info');
  return;
}
```

---

## Summary

The play system provides an engaging, rewarding interaction for pet happiness with:
- **2 play activities** (yarn ball and small ball) with identical effects
- **Smooth animation sequence** (5 seconds total)
- **Energy-based multipliers** affecting happiness gain
- **Dual coin system**: 5 coins immediate + 10 base reward (or 20 with ad)
- **Significant stat costs** requiring balancing with other actions
- **Circular navigation** for activity selection
- **Optional ad-watching** for double coin rewards

**Key Difference from Feed:** Play is a **high-risk, high-reward** action that costs significant stats (especially energy) but provides substantial happiness and monetary rewards.

**Strategic Gameplay:** Players must balance play sessions with feeding, bathing, and sleeping to maintain overall pet health while maximizing coin earnings.
