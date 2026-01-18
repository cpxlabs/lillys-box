# Feed Actions Documentation

## Overview
The feed system allows players to nourish their pets with different food items, restoring hunger and improving overall stats. Each feeding action rewards the player with coins, with an optional ad-watching bonus for double rewards.

---

## User Interface (FeedScene.tsx)

### Screen Layout

1. **Header Section** (`src/screens/FeedScene.tsx:122-126`)
   - Title: Internationalized via `t('feed.title')`
   - Back button to return to previous screen

2. **Status Card** (`src/screens/FeedScene.tsx:129-134`)
   - **Compact mode** display with:
     - Pet name with emoji (🐱 for cats, 🐶 for dogs)
     - Pet age (calculated from creation date)
     - Current stat levels

3. **Pet Display Area** (`src/screens/FeedScene.tsx:136-139`)
   - **Pet Renderer**: Shows pet with animation states
     - `idle`: Default state
     - `eating`: When consuming food
     - `happy`: After eating, showing satisfaction
   - **Message Display**: Shows contextual messages during feeding

4. **Food Selection Area** (`src/screens/FeedScene.tsx:141-176`)
   - **Title**: "Choose food" (internationalized)
   - **Navigation Controls**:
     - Left arrow: Previous food item (circular navigation)
     - Right arrow: Next food item (circular navigation)
     - Disabled during animations
   - **Current Food Button**:
     - Large emoji display
     - Food name (internationalized)
     - Hunger restoration value (e.g., "+25%")
     - Disabled when: animation playing OR hunger ≥ 100%
   - **Page Indicator**: Shows "X / Y" (current item / total items)

5. **Double Reward Modal** (`src/screens/FeedScene.tsx:179`)
   - Offers optional ad-watching for double coin reward
   - Appears after feeding animation completes

---

## Food Items

### Available Foods (`src/screens/FeedScene.tsx:31-36`)

| ID | Emoji | Translation Key | Hunger Value | Description |
|----|-------|----------------|--------------|-------------|
| kibble | 🍖 | feed.foods.kibble | 20 | Standard pet food |
| fish | 🐟 | feed.foods.fish | 25 | High-value meal |
| treat | 🦴 | feed.foods.treat | 15 | Small snack |
| milk | 🥛 | feed.foods.milk | 10 | Light refreshment |

**Note:** Food items are also defined in `/src/data/foodItems.ts` with a centralized `FOOD_ITEMS` array and helper function `getFoodById()`, though the FeedScene uses a local definition.

### Food Item Properties
```typescript
{
  id: string;          // Unique identifier
  emoji: string;       // Visual display
  nameKey: string;     // i18n translation key
  value: number;       // Hunger restoration amount
}
```

---

## Feed Action Flow

### User Interaction Sequence

1. **User opens Feed screen**
   - Current hunger level displayed in status card
   - First food item (kibble) shown by default
   - All stat levels visible

2. **User browses food options**
   - Left/right arrows cycle through 4 food items
   - Circular navigation (wraps around)
   - Each item shows hunger restoration value

3. **User selects food** (`src/screens/FeedScene.tsx:82-118`)
   - Button tap triggers `handleFeed(food)`
   - Animation sequence begins
   - Stats updated immediately

4. **Animation Sequence**
   ```
   Eating (2.5s) → Happy (2.5s) → Idle + Reward
   ```

5. **Reward Modal**
   - If ads enabled and ready: Show double reward offer
   - If ads disabled/not ready: Give base reward immediately

---

## Technical Implementation

### handleFeed Function (`src/screens/FeedScene.tsx:83-131`)

**Parameters:**
- `food`: The selected food item with id, emoji, nameKey, and value

**Process:**

1. **Validation Phase** (`FeedScene.tsx:84-94`) ✅ **ENHANCED (2026-01-17)**
   ```typescript
   // Check if pet can perform activity (has enough energy)
   if (!canPerformActivity(pet, 'feed')) {
     showToast(t('feed.tooTired', { name: pet.name }), 'info');
     return;
   }

   // Check if hunger is already full
   if (pet.hunger >= 100) {
     showToast(t('feed.notHungry', { name: pet.name }), 'info');
     return;
   }
   ```
   - Validates energy level before allowing feed action
   - Shows user-friendly toast when pet is too tired
   - Shows user-friendly toast when pet is not hungry
   - Prevents wasted actions with clear feedback

2. **Cleanup Phase** (`FeedScene.tsx:97-103`)
   ```typescript
   // Clear any existing timeouts to prevent conflicts
   if (animationTimeout1.current) clearTimeout(animationTimeout1.current);
   if (animationTimeout2.current) clearTimeout(animationTimeout2.current);
   ```
   - Prevents animation overlap
   - Avoids race conditions

3. **Eating Animation** (`FeedScene.tsx:105-108`)
   ```typescript
   setAnimationState('eating');
   setMessage(t('feed.eating', { name: pet.name, food: t(food.nameKey) }));
   feed(food.value);  // Immediately update stats
   ```
   - Changes pet animation to "eating"
   - Shows message: "{pet.name} is eating {food.name}!"
   - Calls `feed()` context function with hunger value

4. **Happy Animation** (`FeedScene.tsx:113-117`)
   ```typescript
   setTimeout(() => {
     setAnimationState('happy');
     setMessage(t('feed.loved', { name: pet.name }));
   }, ANIMATION_DURATION.MEDIUM); // 2500ms
   ```
   - After 2.5 seconds, switch to happy animation
   - Shows message: "{pet.name} loved it! 💕"

5. **Completion & Reward** (`FeedScene.tsx:117-123`)
   ```typescript
   setTimeout(() => {
     setAnimationState('idle');
     setMessage('');
     triggerReward(moneyEarned); // 5 coins base
   }, ANIMATION_DURATION.MEDIUM); // Another 2500ms
   ```
   - After another 2.5 seconds, return to idle
   - Clear message
   - Trigger reward system (5 coins base, or 10 with ad)

6. **Error Handling** (`FeedScene.tsx:125-130`)
   ```typescript
   catch (error) {
     logger.error('Feed error:', error);
     setAnimationState('idle');
     setMessage('');
   }
   ```
   - Reset UI state on error to prevent freeze

### Memory Management (`src/screens/FeedScene.tsx:52-66`)

**Timeout Refs:**
```typescript
const animationTimeout1 = useRef<NodeJS.Timeout | null>(null);
const animationTimeout2 = useRef<NodeJS.Timeout | null>(null);
```

**Cleanup on Unmount:**
```typescript
useEffect(() => {
  return () => {
    if (animationTimeout1.current) clearTimeout(animationTimeout1.current);
    if (animationTimeout2.current) clearTimeout(animationTimeout2.current);
  };
}, []);
```
- Prevents memory leaks
- Avoids state updates on unmounted components

---

## Pet Context Integration

### feed() Function (`src/context/PetContext.tsx:124-143`)

**Parameters:**
- `amount` (optional): Hunger restoration amount (defaults to config value if not provided)

**Process:**

1. **Validation** (`PetContext.tsx:126`)
   ```typescript
   if (!currentPet || !canPerformActivity(currentPet, 'feed')) return currentPet;
   ```
   - Checks if pet exists
   - Ensures energy ≥ 20 (minimum for activities)

2. **Energy Multiplier** (`PetContext.tsx:128`)
   ```typescript
   const multiplier = getEnergyMultiplier(currentPet.energy);
   ```
   - High energy (70-100): 1.0x multiplier
   - Medium energy (40-69): 0.5x multiplier
   - Low energy (20-39): 0.25x multiplier
   - Critical energy (<20): Activity blocked

3. **Stat Updates** (`PetContext.tsx:131-137`)
   ```typescript
   hunger: Math.min(100, currentPet.hunger + (amount || effects.hunger) * multiplier)
   energy: Math.min(100, currentPet.energy + effects.energy)
   happiness: Math.min(100, currentPet.happiness + effects.happiness * multiplier)
   hygiene: Math.max(0, currentPet.hygiene + effects.hygiene)
   ```

4. **Game Balance Effects** (`src/config/gameBalance.ts:22-27`)
   ```typescript
   feed: {
     hunger: 25,      // Base hunger increase
     energy: 5,       // Energy gain
     happiness: 3,    // Happiness gain (affected by multiplier)
     hygiene: -2,     // Slight hygiene decrease
   }
   ```

5. **Health Recalculation** (`PetContext.tsx:139`)
   ```typescript
   updatedPet.health = calculateHealth(updatedPet);
   ```
   - Health recalculated from all stats
   - Weighted average: hunger 25%, hygiene 20%, energy 25%, happiness 30%

6. **Persistence** (`PetContext.tsx:140`)
   ```typescript
   savePet(updatedPet).catch(logger.error);
   ```

---

## Reward System

### Base Reward (`src/config/ads.config.ts:42`)
```typescript
feedReward: 5, // Base coins for feeding pet
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

| Scenario | Ad Status | Coins Earned | User Action |
|----------|-----------|--------------|-------------|
| Ads enabled | Ready | 10 (if user watches) | Modal appears, user chooses |
| Ads enabled | Ready | 5 (if user declines) | Modal appears, user declines |
| Ads enabled | Not ready | 5 | Reward given immediately |
| Ads disabled | N/A | 5 | Reward given immediately |

**Modal Options:**
- **Watch Ad**: User watches rewarded video, receives 10 coins (5 × 2)
- **No Thanks**: User declines, receives 5 coins (base reward)

### Reward Multiplier (`src/config/constants.ts:158-163`)
```typescript
export const REWARD_MULTIPLIER = {
  SINGLE: 1,
  DOUBLE: 2,
} as const;
```

---

## UI States & Interactions

### Button States

**Feed Button Disabled When:**
1. Animation is playing (`animationState !== 'idle'`)
2. Hunger is full (`pet.hunger >= 100`)

**Arrow Buttons Disabled When:**
- Animation is playing (`animationState !== 'idle'`)

### Animation States
```typescript
type AnimationState = 'idle' | 'eating' | 'happy';
```

| State | Duration | Displayed During |
|-------|----------|------------------|
| eating | 2.5 seconds | Pet consuming food |
| happy | 2.5 seconds | Pet satisfied after eating |
| idle | Continuous | Default state, awaiting input |

### Messages

**During Eating:**
```
"{pet.name} is eating {food.name}!"
```
Example: "Fluffy is eating Fish!"

**During Happy:**
```
"{pet.name} loved it! 💕"
```
Example: "Fluffy loved it! 💕"

---

## Circular Navigation System

### useNavigationList Hook (`src/hooks/useNavigationList.ts`)

**Features:**
- Circular navigation (wraps around at start/end)
- Current index tracking (0-based)
- Total items count (4 foods)
- Navigation controls: `goToNext()`, `goToPrevious()`

**Example:**
```
Kibble (0) → Fish (1) → Treat (2) → Milk (3) → Kibble (0) → ...
         ←                                  ←
```

### Page Indicator (`FeedScene.tsx:173-175`)
```typescript
{currentIndex + 1} / {totalItems}
```
- Displays as "1 / 4", "2 / 4", etc.
- User-friendly 1-based indexing

---

## Styling & Theme

### Color Scheme
- **Background**: `#fff8e1` (Warm cream)
- **Food Container**: `#fff` (White)
- **Arrow Buttons**: `#fff3e0` (Light orange)
- **Arrow Text**: `#ff9800` (Orange)
- **Current Food Button**:
  - Background: `#ffe0b2` (Light orange)
  - Border: `#ff9800` (Orange, 3px)
- **Food Value Text**: `#4CAF50` (Green, indicates positive gain)

### Responsive Design (`src/config/responsive.ts`)
- Pet size adapts to device type (mobile/tablet/desktop)
- Button sizes scale appropriately
- Text sizes adjust for readability
- Spacing uses responsive utility function

---

## Internationalization (i18n)

### Translation Keys Used

| Key | Example Value | Usage |
|-----|---------------|-------|
| `feed.title` | "🍽️ Feed" | Screen header |
| `feed.chooseFood` | "Choose food:" | Food selection title |
| `feed.eating` | "{name} is eating {food}!" | Eating animation message |
| `feed.loved` | "{name} loved it! 💕" | Happy animation message |
| `feed.tooTired` ✅ | "{name} is too tired to eat. Needs rest!" | Energy validation feedback |
| `feed.notHungry` ✅ | "{name} is not hungry right now!" | Hunger validation feedback |
| `feed.foods.kibble` | "Kibble" | Food name |
| `feed.foods.fish` | "Fish" | Food name |
| `feed.foods.treat` | "Treat" | Food name |
| `feed.foods.milk` | "Milk" | Food name |
| `rewards.earned` | "Earned {amount} coins!" | Base reward toast |
| `rewards.doubleEarned` | "Earned {amount} coins!" | Double reward toast |
| `rewards.doubleReward.title` | "Double Your Reward!" | Modal title |
| `rewards.doubleReward.message` | "Watch ad for {double} or skip for {normal}" | Modal message |
| `rewards.doubleReward.watchAd` | "Watch Ad" | Confirm button |
| `rewards.doubleReward.noThanks` | "No Thanks" | Cancel button |

**Note:** Keys marked with ✅ were added in the 2026-01-17 user feedback enhancement.

---

## Edge Cases & Special Behaviors

### 1. Hunger Already Full (`pet.hunger >= 100`) ✅ **ENHANCED (2026-01-17)**
- Feed button disabled
- Visual cue: Button appears grayed out
- **User feedback**: Toast message "{name} is not hungry right now!" displayed
- User can still navigate food items
- Action prevented with clear explanation

### 2. Low Energy (`pet.energy < 20`) ✅ **ENHANCED (2026-01-17)**
- `canPerformActivity()` returns false
- Feed action blocked entirely
- Pet needs to sleep first
- **User feedback**: Toast message "{name} is too tired to eat. Needs rest!" displayed
- Helps user understand why action failed

### 3. Overfeed Scenario
- Hunger capped at 100 (cannot exceed)
- Example: 95 hunger + 25 fish = 100 hunger (not 120)

### 4. Energy Multiplier Impact
```
Example: Fish (+25 hunger base)
- High energy (70+): 25 × 1.0 = 25 hunger
- Medium energy (40-69): 25 × 0.5 = 12.5 hunger
- Low energy (20-39): 25 × 0.25 = 6.25 hunger

Happiness (+3 base):
- High energy: 3 × 1.0 = 3 happiness
- Medium energy: 3 × 0.5 = 1.5 happiness
- Low energy: 3 × 0.25 = 0.75 happiness
```

### 5. Ad Not Ready
- Modal not shown
- Base reward given immediately (5 coins)
- Toast: "Earned 5 coins!"

### 6. Rapid Clicking Prevention
- Buttons disabled during animations
- Existing timeouts cleared before starting new animation
- Error handling resets UI state

### 7. Component Unmount During Animation
- Timeouts automatically cleared
- No state updates on unmounted component
- Prevents memory leaks and warnings

---

## Configuration Reference

### From gameBalance.ts
```typescript
activities: {
  feed: {
    hunger: 25,      // Base hunger increase
    energy: 5,       // Energy boost
    happiness: 3,    // Happiness increase (× energy multiplier)
    hygiene: -2,     // Small hygiene penalty
  }
}

thresholds: {
  energyForActivities: 20, // Minimum energy to perform activities
}
```

### From ads.config.ts
```typescript
rewards: {
  feedReward: 5,              // Base coin reward
  activityDoubleReward: true, // Enable double reward offers
}
```

### From constants.ts
```typescript
ANIMATION_DURATION: {
  MEDIUM: 2500, // Milliseconds for eating/happy animations
}

REWARD_MULTIPLIER: {
  SINGLE: 1,
  DOUBLE: 2,
}
```

---

## Related Files

| File | Purpose |
|------|---------|
| `src/screens/FeedScene.tsx` | Main UI component for feed screen |
| `src/context/PetContext.tsx` | Pet state management, feed() function |
| `src/config/gameBalance.ts` | Feed effects and energy thresholds |
| `src/config/ads.config.ts` | Reward amounts and ad configuration |
| `src/hooks/useDoubleReward.tsx` | Double reward modal and ad integration |
| `src/hooks/useNavigationList.ts` | Circular navigation for food items |
| `src/data/foodItems.ts` | Centralized food item definitions |
| `src/utils/petStats.ts` | Energy multiplier and activity validation |

---

## Testing Scenarios

### Happy Path
1. Pet has hunger < 100 and energy ≥ 20
2. User selects food item
3. Animation plays (eating → happy → idle)
4. Stats updated (hunger +25, energy +5, happiness +3, hygiene -2)
5. Health recalculated
6. Reward offered (5 coins or modal for 10)

### Edge Cases to Test
1. **Full hunger**: Feed button disabled, no action possible
2. **Low energy**: Feed action blocked by `canPerformActivity()`
3. **Ad declined**: User receives 5 coins, sees success toast
4. **Ad watched**: User receives 10 coins, sees success toast
5. **Rapid clicking**: Timeouts cleared, no animation conflicts
6. **Component unmount**: No memory leaks, clean timeout cleanup
7. **High energy**: Full multiplier effect on stats
8. **Low energy**: Reduced multiplier effect on stats

---

## Summary

The feed system provides an engaging, rewarding interaction for pet care with:
- **4 food options** with varying hunger values
- **Smooth animation sequence** (5 seconds total)
- **Energy-based multipliers** affecting effectiveness
- **Optional ad-watching** for double coin rewards
- **Circular navigation** for easy food selection
- **Proper memory management** to prevent leaks
- **Internationalization** for multi-language support
- **Responsive design** adapting to all device sizes

The system encourages frequent player engagement while offering monetization through optional rewarded video ads.
