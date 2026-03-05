# Pet Actions System

Complete guide to pet actions (feed, play, bathe, sleep, cuddle, exercise, vet) and the unified `usePetActions` hook.

## Overview

All pet interactions flow through a unified system:

```
User Action → usePetActions Hook → Validation → Animation → Stat Updates → Rewards → Persistence
```

**Key Achievement**: Consolidated from ~200 lines of duplicated action logic across 7 scenes down to reusable hook (-87-94% code reduction per scene).

## Architecture

### usePetActions Hook

Location: `src/hooks/usePetActions.ts`

Handles all pet action logic:
- Input validation (sleeps block actions, health checks, etc.)
- Animation state management
- Stat calculations
- Reward calculation
- Data persistence
- Toast notifications

**Returns:**
```typescript
{
  performAction: (action: PetAction) => void;
  isAnimating: boolean;
  currentAnimation: string | null;
  canPerformAction: (action: PetAction) => boolean;
  stats: {
    hunger?: Stat;      // Feed action
    happiness?: Stat;   // Play action
    hygiene?: Stat;     // Bath action
    energy?: Stat;      // Sleep/Exercise
    health?: Stat;      // Vet action
  };
}
```

### Action Types

```typescript
type PetAction = 'feed' | 'play' | 'bathe' | 'sleep' | 'cuddle' | 'exercise' | 'vet';

interface ActionResult {
  action: PetAction;
  statChanges: StatDelta;
  reward: {
    coins: number;
    multiplier: number;  // 1 or 2 if ad bonus
  };
  animation: {
    duration: number;
    type: string;
  };
}
```

## Actions

### Feed 🍖

**Effect**: Restores hunger (increases fullness stat)

**Stat Changes:**
- Hunger: -40 points (pet becomes full)
- Energy: +2 points (eating gives slight energy)

**Requirements:**
- Pet not sleeping
- Hunger > 30

**Rewards:**
- Base coins: 5
- Ad bonus: 10 coins (double)

**UI File**: `src/screens/FeedScene.tsx`

**Example:**
```typescript
const { performAction, isAnimating } = usePetActions();

const handleFeed = async () => {
  performAction('feed');
};
```

### Play 🎮

**Effect**: Increases happiness, consumes energy

**Stat Changes:**
- Happiness: +30 points (pet gets happy)
- Energy: -15 points (play is tiring)
- Hunger: +5 points (play makes pet hungry)

**Requirements:**
- Pet not sleeping
- Energy > 20

**Rewards:**
- Base coins: 8
- Ad bonus: 16 coins (double)

**Activities**: 7 play types
- Ball toss
- Tag
- Hide and seek
- Chase
- Jump rope
- Tickle
- Dance

**UI File**: `src/screens/PlayScene.tsx`

**Example:**
```typescript
const { performAction } = usePetActions();

const handlePlay = () => {
  performAction('play');
};
```

### Bath 🛁

**Effect**: Increases hygiene, special animation

**Stat Changes:**
- Hygiene: +50 points (clean!)
- Happiness: +10 points (feels refreshed)

**Requirements:**
- Pet not sleeping
- Hygiene < 80

**Rewards:**
- Base coins: 6
- Ad bonus: 12 coins (double)

**UI File**: `src/screens/BathScene.tsx`

**Note**: Bath uses Skia graphics for bubble animation

**Example:**
```typescript
const { performAction } = usePetActions();

const handleBath = () => {
  performAction('bathe');
};
```

### Sleep 😴

**Effect**: Restores energy, enters sleep state

**Stat Changes:**
- Energy: +100 points (fully restored)
- Hunger: +10 points (slight increase)

**Sleep State:**
- Pet becomes unavailable for other actions
- Duration: 30 seconds (real time, configurable)
- Automatically wakes after duration
- Can be manually woken early

**Rewards:**
- Base coins: 3
- No ad bonus for sleep

**UI File**: `src/screens/SleepScene.tsx`

**Example:**
```typescript
const { performAction } = usePetActions();

const handleSleep = () => {
  performAction('sleep');
  // Pet sleeps for 30 seconds
};
```

### Cuddle 🤗

**Effect**: Increases happiness, bond-building

**Stat Changes:**
- Happiness: +25 points
- Hunger: -5 points (slight)

**Requirements:**
- Pet not sleeping

**Rewards:**
- Base coins: 4
- Ad bonus: 8 coins (double)

**Availability**: Home screen, always available

**Example:**
```typescript
const { performAction } = usePetActions();

const handleCuddle = () => {
  performAction('cuddle');
};
```

### Exercise 🏃

**Effect**: Develops pet fitness, consumes energy

**Stat Changes:**
- Energy: -20 points
- Hunger: +8 points
- Happiness: +15 points

**Requirements:**
- Pet not sleeping
- Energy > 25

**Rewards:**
- Base coins: 7
- Ad bonus: 14 coins (double)

**Example:**
```typescript
const { performAction } = usePetActions();

const handleExercise = () => {
  performAction('exercise');
};
```

### Vet 🏥

**Effect**: Restores health when pet is sick

**Stat Changes:**
- Health: +60 points
- Medicine cost: -20 coins (from pet's money)

**Requirements:**
- Pet not sleeping
- Health < 40

**Triggers:** Can be initiated when:
- Health stat is low
- Pet shows sick animation
- User clicks vet button

**UI File**: `src/screens/VetScene.tsx`

**Example:**
```typescript
const { performAction, stats } = usePetActions();

const handleVet = () => {
  if (stats.health && stats.health.value < 40) {
    performAction('vet');
  }
};
```

## Using Actions in Screens

### Pattern 1: Simple Action Button

```typescript
const MyScene: React.FC = () => {
  const { performAction, isAnimating } = usePetActions();

  return (
    <View>
      <Button
        onPress={() => performAction('feed')}
        disabled={isAnimating}
      >
        Feed
      </Button>
    </View>
  );
};
```

### Pattern 2: Activity Selection

```typescript
const activities = ['ball', 'tag', 'hide', 'chase'];
const [selected, setSelected] = useState(0);
const { performAction, isAnimating } = usePetActions();

const handlePlay = () => {
  // Play activity determined by per-activity logic
  performAction('play');
};
```

### Pattern 3: Validation Before Action

```typescript
const { canPerformAction, performAction, stats } = usePetActions();

const handleAction = (action: PetAction) => {
  if (!canPerformAction(action)) {
    // Show error: requirements not met
    return;
  }
  performAction(action);
};
```

### Pattern 4: Animating During Action

```typescript
const { performAction, isAnimating, currentAnimation } = usePetActions();

return (
  <>
    <PetAnimator
      animationType={currentAnimation}
      isAnimating={isAnimating}
    />
    <ActionButton
      disabled={isAnimating}
      onPress={() => performAction('bathe')}
    />
  </>
);
```

## Rewards System

### Ad Bonus

After completing an action, player sees a modal:
- "Watch ad for double coins?"
- If accept: coins × 2
- If decline: coins × 1

### Coin Calculation

```typescript
let coins = baseCoins[action];  // e.g., Feed = 5

if (watchAd) {
  coins *= 2;
}

pet.money += coins;
```

### Base Coin Rewards

| Action | Base | With Ad |
|--------|------|---------|
| Feed | 5 | 10 |
| Play | 8 | 16 |
| Bath | 6 | 12 |
| Sleep | 3 | 3 |
| Cuddle | 4 | 8 |
| Exercise | 7 | 14 |
| Vet | 0 | 0 |

## Stat System

Each pet has 5 core stats (0-100):

```
Hunger:     How full the pet is
Happiness:  Pet's mood/joy level
Hygiene:    How clean the pet is
Energy:     Pet's tiredness level
Health:     Pet's wellness (sickness)
```

### Stat Formulas

```typescript
// Stat change over time (background)
hunger += 1 point/minute       // Increases (pet gets hungry)
energy -= 0.5 point/minute     // Decreases (pet gets tired)
happiness -= 0.2 point/minute  // Decays slowly

// Action effects (immediate)
feed:      hunger -= 40
play:      happiness += 30, energy -= 15
bathe:     hygiene += 50
sleep:     energy += 100
exercise:  energy -= 20, hunger += 8
vet:       health += 60
cuddle:    happiness += 25

// Critical thresholds
health < 20     → pet shows sick animation
energy < 10     → pet slow/weak
hunger > 80     → pet eager to eat
```

## Sleep Mechanics

**Entering Sleep:**
```typescript
pet.isSleeping = true;
pet.sleepStartTime = Date.now();
// Block all other actions
```

**During Sleep:**
- Pet unavailable (6 seconds in-game time)
- Animation: pet sleeping on bed
- Energy slowly restores (might wake early if energy full)

**Waking Up:**
- Automatic after duration
- Or manual via user pressing "Wake"
- Returns to normal state

## Data Persistence

After each action:
```typescript
const newPet = applyAction(pet, action);
savePet(newPet, userId);  // AsyncStorage
// Pet state synced to context
```

Actions are auto-saved within 1 second (debounced) to prevent rapid disk writes.

## Validation Rules

Before performing any action:

1. **Pet awake check**
   ```typescript
   if (pet.isSleeping) return false;
   ```

2. **Stat requirement checks**
   - Feed: hunger > 30
   - Play: energy > 20
   - Exercise: energy > 25
   - Vet: health < 40

3. **Animation lock**
   ```typescript
   if (isAnimating) return false;
   ```

## Performance

- Action completion: ~2-3 seconds animation
- Data save: debounced to once per second
- No network calls (all local)
- AsyncStorage write: ~50ms

## Testing Actions

See [Testing Guide](../testing/TESTING.md) for unit and integration tests.

**Example Test:**
```typescript
test('feed action reduces hunger', async () => {
  const pet = createTestPet();
  const result = applyAction(pet, 'feed');
  expect(result.hunger).toBeLessThan(pet.hunger);
});
```

## Related Docs

- [API Reference](API_REFERENCE.md) - `usePetActions` hook API
- [Testing Guide](../testing/TESTING.md) - Action testing patterns
- [Folder Structure](../guides/FOLDER_STRUCTURE.md) - Screen locations

---

**Last Updated**: 2026-03-04  
**Status**: Complete  
**Version**: 2.0 (Consolidated 2026-01-18)
