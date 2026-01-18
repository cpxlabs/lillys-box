# Stats Hook Refactor Plan

**Status**: 📋 PLANNING

**Created**: 2026-01-18

**Goal**: Unify all stats behavior into a custom hook, creating a single source of truth for pet stat modifications and reducing code duplication across scenes.

---

## Current Architecture Analysis

### Current Implementation Pattern

**PetContext** (`src/context/PetContext.tsx`)
- Provides state management for pet data
- Exports action functions: `feed()`, `play()`, `bathe()`, `sleep()`, `exercise()`, `petCuddle()`, `visitVet()`, `earnMoney()`
- Each function directly modifies pet stats using `setPet()`
- Handles stat calculations, energy multipliers, and health recalculation
- Saves to storage after each action

**Scenes** (FeedScene, PlayScene, BathScene, etc.)
- Import `usePet()` hook to access context functions
- Manage their own:
  - Animation states (`eating`, `playing`, `bathing`, etc.)
  - Timeout management (with refs and cleanup)
  - Validation logic (`canPerformActivity()` checks)
  - Toast notifications for feedback
  - Reward triggering (`useDoubleReward` hook)
- Call context functions when actions complete
- Handle UI updates independently

### Problems with Current Architecture

1. **Code Duplication** 🔴
   - Similar animation patterns in FeedScene, PlayScene, BathScene
   - Repeated timeout management code (refs, cleanup, useEffect)
   - Duplicate validation checks before actions
   - Similar toast notification patterns

2. **Scattered Responsibility** 🟡
   - Stat modifications in PetContext
   - Animation logic in Scenes
   - Validation sometimes in context, sometimes in scenes
   - Reward logic via separate hook
   - Toast logic in scenes

3. **Inconsistent Patterns** 🟡
   - FeedScene has validation + toast feedback (recent enhancement)
   - PlayScene has validation + toast feedback (recent enhancement)
   - BathScene lacks user feedback for blocked actions
   - Different error handling approaches

4. **Hard to Maintain** 🟡
   - Changes to action flow require updating multiple scenes
   - Testing requires mocking context, animations, rewards separately
   - New actions require implementing entire flow again

5. **Coupling** 🟡
   - Scenes tightly coupled to animation implementation
   - Direct dependency on PetContext structure
   - Hard to change animation system without touching all scenes

---

## Proposed Architecture

### Overview

Create a unified **`usePetActions`** hook that encapsulates:
- **Stat modifications** (from PetContext)
- **Animation management** (from scenes)
- **Validation** (unified logic)
- **Reward triggering** (integrated)
- **Toast notifications** (automatic feedback)
- **Timeout cleanup** (automatic)

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         SCENES                              │
│  FeedScene | PlayScene | BathScene | SleepScene | etc.     │
│                                                             │
│  - Import usePetActions()                                  │
│  - Call: performAction('feed', options)                    │
│  - Receive: { state, message, isAnimating }                │
│  - Render: Pet with state, message                         │
└─────────────────────────────────────────────────────────────┘
                            ▲
                            │ uses
                            │
┌─────────────────────────────────────────────────────────────┐
│                   usePetActions Hook                        │
│                (src/hooks/usePetActions.ts)                 │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  performAction(actionType, options?)                │  │
│  │  - validate(pet, actionType)                        │  │
│  │  - setAnimationState(actionType states)             │  │
│  │  - call PetContext action                           │  │
│  │  - trigger rewards                                   │  │
│  │  - show toast feedback                              │  │
│  │  - manage timeouts                                   │  │
│  │  - cleanup on unmount                                │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
│  Returns:                                                   │
│  - animationState: AnimationState                          │
│  - message: string                                          │
│  - isAnimating: boolean                                     │
│  - performAction: (type, opts) => Promise<void>            │
└─────────────────────────────────────────────────────────────┘
                            ▲
                            │ uses
                            │
┌────────────────┬──────────────────┬─────────────────────────┐
│   PetContext   │  useDoubleReward │      useToast           │
│   (state)      │   (rewards)      │   (notifications)       │
└────────────────┴──────────────────┴─────────────────────────┘
```

### Benefits

1. **Single Source of Truth** ✅
   - All action logic in one place
   - Consistent behavior across all scenes
   - Easier to understand and maintain

2. **Reduced Duplication** ✅
   - Animation logic written once
   - Timeout management centralized
   - Validation unified
   - Toast patterns standardized

3. **Better Testing** ✅
   - Test hook in isolation
   - Mock fewer dependencies in scene tests
   - Consistent behavior easier to verify

4. **Easier to Extend** ✅
   - New actions follow same pattern
   - Add new animation states in one place
   - Update reward logic once

5. **Cleaner Scenes** ✅
   - Scenes focus on UI rendering
   - Less state management
   - Simpler component logic

---

## Implementation Plan

### Phase 1: Create Hook Foundation (Sprint 1)

#### Task 1.1: Define Hook Interface
**File**: `src/hooks/usePetActions.ts` (NEW)

**Interface Design**:
```typescript
type ActionType = 'feed' | 'play' | 'bathe' | 'sleep' | 'exercise' | 'cuddle' | 'vet';

type ActionOptions = {
  // For feed/bathe: custom amount
  amount?: number;
  // For feed/play: activity details (emoji, name)
  activity?: { emoji: string; nameKey: string };
  // For vet: payment method
  useMoney?: boolean;
  // For sleep: duration override
  duration?: number;
};

type ActionResult = {
  success: boolean;
  completed?: boolean; // For sleep cancellation
};

type UsePetActionsReturn = {
  // Current state
  animationState: AnimationState;
  message: string;
  isAnimating: boolean;

  // Actions
  performAction: (type: ActionType, options?: ActionOptions) => Promise<ActionResult>;
  cancelAction: () => void; // For sleep cancellation
};

function usePetActions(): UsePetActionsReturn;
```

**Dependencies**:
- `usePet()` - Access to pet state and context functions
- `useToast()` - Toast notifications
- `useDoubleReward()` - Reward system
- `useTranslation()` - i18n support

**State Management**:
```typescript
const [animationState, setAnimationState] = useState<AnimationState>('idle');
const [message, setMessage] = useState('');
const [isAnimating, setIsAnimating] = useState(false);
```

**Timeout Management**:
```typescript
const timeoutRefs = useRef<NodeJS.Timeout[]>([]);

useEffect(() => {
  return () => {
    // Cleanup all timeouts on unmount
    timeoutRefs.current.forEach(clearTimeout);
  };
}, []);
```

---

#### Task 1.2: Implement Action Configuration
**File**: `src/config/actionConfig.ts` (NEW)

**Purpose**: Centralize animation sequences and messages for each action type

```typescript
import { ANIMATION_DURATION } from './constants';
import { AnimationState } from '../types';

export type ActionAnimationSequence = {
  states: Array<{
    state: AnimationState;
    duration: number;
    messageKey: string; // i18n key
  }>;
  rewardAmount: number;
  requiresDoubleReward: boolean;
};

export const ACTION_ANIMATIONS: Record<ActionType, ActionAnimationSequence> = {
  feed: {
    states: [
      { state: 'eating', duration: ANIMATION_DURATION.MEDIUM, messageKey: 'feed.eating' },
      { state: 'happy', duration: ANIMATION_DURATION.MEDIUM, messageKey: 'feed.loved' },
      { state: 'idle', duration: 0, messageKey: '' },
    ],
    rewardAmount: 5,
    requiresDoubleReward: true,
  },
  play: {
    states: [
      { state: 'playing', duration: ANIMATION_DURATION.MEDIUM, messageKey: 'play.playing' },
      { state: 'happy', duration: ANIMATION_DURATION.MEDIUM, messageKey: 'play.loved' },
      { state: 'idle', duration: 0, messageKey: '' },
    ],
    rewardAmount: 15,
    requiresDoubleReward: true,
  },
  bathe: {
    states: [
      { state: 'bathing', duration: ANIMATION_DURATION.MEDIUM, messageKey: 'bathe.bathing' },
      { state: 'happy', duration: ANIMATION_DURATION.MEDIUM, messageKey: 'bathe.clean' },
      { state: 'idle', duration: 0, messageKey: '' },
    ],
    rewardAmount: 5,
    requiresDoubleReward: true,
  },
  // ... other actions
};
```

**Benefits**:
- Easy to add/modify animation sequences
- Consistent animation timing
- Centralized reward configuration
- Clear action definitions

---

#### Task 1.3: Implement Validation System
**File**: Update `src/utils/petStats.ts`

**Extend validation to return feedback**:
```typescript
export type ValidationResult = {
  canPerform: boolean;
  reason?: string; // i18n key for toast
};

export function validateAction(
  pet: Pet,
  actionType: ActionType
): ValidationResult {
  // Energy check for most actions
  if (['feed', 'play', 'bathe', 'exercise'].includes(actionType)) {
    if (!canPerformActivity(pet, actionType)) {
      return {
        canPerform: false,
        reason: `${actionType}.needsRest`, // e.g., "feed.needsRest"
      };
    }
  }

  // Specific validations
  if (actionType === 'feed' && pet.hunger >= 100) {
    return { canPerform: false, reason: 'feed.notHungry' };
  }

  if (actionType === 'bathe' && pet.hygiene >= 100) {
    return { canPerform: false, reason: 'bathe.alreadyClean' };
  }

  if (actionType === 'sleep' && pet.energy >= 100) {
    return { canPerform: false, reason: 'sleep.notTired' };
  }

  return { canPerform: true };
}
```

---

#### Task 1.4: Implement Core Hook Logic

**File**: `src/hooks/usePetActions.ts`

**performAction implementation**:
```typescript
const performAction = useCallback(async (
  type: ActionType,
  options: ActionOptions = {}
): Promise<ActionResult> => {
  if (!pet) return { success: false };

  // 1. Validation
  const validation = validateAction(pet, type);
  if (!validation.canPerform) {
    if (validation.reason) {
      showToast(t(validation.reason, { name: pet.name }), 'info');
    }
    return { success: false };
  }

  // 2. Get animation config
  const animConfig = ACTION_ANIMATIONS[type];
  if (!animConfig) {
    logger.error(`No animation config for action: ${type}`);
    return { success: false };
  }

  try {
    // 3. Clear existing timeouts
    timeoutRefs.current.forEach(clearTimeout);
    timeoutRefs.current = [];

    setIsAnimating(true);

    // 4. Execute animation sequence
    for (let i = 0; i < animConfig.states.length; i++) {
      const { state, duration, messageKey } = animConfig.states[i];

      // Set animation state and message
      setAnimationState(state);
      if (messageKey) {
        const messageVars = {
          name: pet.name,
          activity: options.activity ? t(options.activity.nameKey) : '',
          food: options.activity ? t(options.activity.nameKey) : '',
        };
        setMessage(t(messageKey, messageVars));
      } else {
        setMessage('');
      }

      // 5. Execute context action on first animation state
      if (i === 0) {
        await executeContextAction(type, options);
      }

      // 6. Wait for animation duration
      if (duration > 0) {
        await new Promise<void>((resolve) => {
          const timeout = setTimeout(resolve, duration);
          timeoutRefs.current.push(timeout);
        });
      }
    }

    // 7. Trigger reward
    if (animConfig.rewardAmount > 0) {
      if (animConfig.requiresDoubleReward && AdsConfig.enabled) {
        triggerReward(animConfig.rewardAmount);
      } else {
        earnMoney(animConfig.rewardAmount);
        showToast(t('rewards.earned', { amount: animConfig.rewardAmount }), 'success');
      }
    }

    setIsAnimating(false);
    return { success: true };

  } catch (error) {
    logger.error(`Error performing action ${type}:`, error);
    setAnimationState('idle');
    setMessage('');
    setIsAnimating(false);
    return { success: false };
  }
}, [pet, t, showToast, triggerReward, earnMoney]);
```

**Helper function - executeContextAction**:
```typescript
const executeContextAction = (
  type: ActionType,
  options: ActionOptions
): void => {
  switch (type) {
    case 'feed':
      feed(options.amount);
      break;
    case 'play':
      play();
      break;
    case 'bathe':
      bathe(options.amount);
      break;
    case 'sleep':
      // Sleep is special - handled separately
      break;
    case 'exercise':
      exercise();
      break;
    case 'cuddle':
      petCuddle();
      break;
    case 'vet':
      visitVet(options.useMoney);
      break;
  }
};
```

---

### Phase 2: Migrate Scenes (Sprint 2)

#### Task 2.1: Migrate FeedScene
**File**: `src/screens/FeedScene.tsx`

**Before**:
```typescript
const { pet, feed, earnMoney } = usePet();
const { showToast } = useToast();
const { triggerReward, DoubleRewardModal } = useDoubleReward({ earnMoney, showToast });
const [animationState, setAnimationState] = useState<AnimationState>('idle');
const [message, setMessage] = useState('');
const animationTimeout1 = useRef<NodeJS.Timeout | null>(null);
const animationTimeout2 = useRef<NodeJS.Timeout | null>(null);

const handleFeed = (food: FoodItem) => {
  // Validation
  if (!canPerformActivity(pet, 'feed')) {
    showToast(t('feed.tooTired', { name: pet.name }), 'info');
    return;
  }

  // Cleanup timeouts
  if (animationTimeout1.current) clearTimeout(animationTimeout1.current);
  if (animationTimeout2.current) clearTimeout(animationTimeout2.current);

  try {
    setAnimationState('eating');
    setMessage(t('feed.eating', { name: pet.name, food: t(food.nameKey) }));
    feed(food.value);

    animationTimeout1.current = setTimeout(() => {
      setAnimationState('happy');
      setMessage(t('feed.loved', { name: pet.name }));

      animationTimeout2.current = setTimeout(() => {
        setAnimationState('idle');
        setMessage('');
        triggerReward(moneyEarned);
      }, ANIMATION_DURATION.MEDIUM);
    }, ANIMATION_DURATION.MEDIUM);
  } catch (error) {
    // error handling
  }
};
```

**After**:
```typescript
const { pet } = usePet();
const { animationState, message, isAnimating, performAction } = usePetActions();
const { DoubleRewardModal } = useDoubleReward();

const handleFeed = async (food: FoodItem) => {
  await performAction('feed', {
    amount: food.value,
    activity: { emoji: food.emoji, nameKey: food.nameKey }
  });
};
```

**Lines of Code**:
- Before: ~50 lines (state, refs, timeouts, cleanup, animation logic)
- After: ~5 lines (just call hook)
- **Reduction**: 90% fewer lines

---

#### Task 2.2: Migrate PlayScene
**File**: `src/screens/PlayScene.tsx`

**Similar pattern to FeedScene**:
```typescript
const handlePlay = async (activity: PlayActivity) => {
  await performAction('play', {
    activity: { emoji: activity.emoji, nameKey: activity.nameKey }
  });
};
```

---

#### Task 2.3: Migrate BathScene
**File**: `src/screens/BathScene.tsx`

**Current**: BathScene has more complex logic with scrub counting

**Strategy**: Keep scrub counting logic in scene, call hook when complete

```typescript
const handleScrub = () => {
  const newCount = scrubCount + 1;
  setScrubCount(newCount);

  if (newCount >= SCRUBS_NEEDED) {
    // Complete bath action
    performAction('bathe', { amount: 15 });
    setScrubCount(0);
  } else {
    // Partial bath
    performAction('bathe', { amount: 5 });
  }
};
```

---

#### Task 2.4: Migrate Other Scenes
- SleepScene - Special handling for cancellation
- VetScene - Integrate with payment options
- ExerciseScene - Similar to PlayScene
- CuddleScene - Simplest case

---

### Phase 3: Advanced Features (Sprint 3)

#### Task 3.1: Add Action Queuing
**Purpose**: Allow chaining multiple actions

```typescript
type ActionQueue = Array<{ type: ActionType; options?: ActionOptions }>;

const queueActions = (actions: ActionQueue) => {
  // Execute actions sequentially
};
```

**Use Case**: Tutorial system, automated demonstrations

---

#### Task 3.2: Add Action History
**Purpose**: Track what actions pet has performed

```typescript
type ActionHistoryEntry = {
  type: ActionType;
  timestamp: number;
  success: boolean;
};

const actionHistory = useRef<ActionHistoryEntry[]>([]);
```

**Use Case**: Analytics, achievements, daily activity tracking

---

#### Task 3.3: Add Custom Callbacks
**Purpose**: Allow scenes to hook into action lifecycle

```typescript
type ActionCallbacks = {
  onStart?: (type: ActionType) => void;
  onComplete?: (type: ActionType, result: ActionResult) => void;
  onError?: (type: ActionType, error: Error) => void;
};

const performAction = (
  type: ActionType,
  options?: ActionOptions,
  callbacks?: ActionCallbacks
) => {
  // ...
};
```

**Use Case**: Achievement system, special effects, sound triggers

---

### Phase 4: Testing & Documentation (Sprint 4)

#### Task 4.1: Unit Tests
**File**: `src/hooks/__tests__/usePetActions.test.ts`

**Test Cases**:
- ✅ Validates actions correctly
- ✅ Shows appropriate toast messages for blocked actions
- ✅ Executes animation sequences correctly
- ✅ Calls context functions with correct parameters
- ✅ Triggers rewards appropriately
- ✅ Cleans up timeouts on unmount
- ✅ Handles errors gracefully
- ✅ Cancels sleep correctly

---

#### Task 4.2: Integration Tests
**Test**: Full action flow with real scenes

---

#### Task 4.3: Documentation
**Files**:
- `docs/ARCHITECTURE.md` - Update with new hook pattern
- `docs/CUSTOM_HOOKS.md` - Document usePetActions API
- README.md - Update development guide

---

## File Structure

```
src/
├── hooks/
│   ├── usePetActions.ts          # NEW - Main hook
│   ├── __tests__/
│   │   └── usePetActions.test.ts # NEW - Tests
│   └── ...existing hooks
├── config/
│   ├── actionConfig.ts           # NEW - Action definitions
│   └── ...existing config
├── utils/
│   └── petStats.ts               # MODIFIED - Enhanced validation
├── screens/
│   ├── FeedScene.tsx             # MODIFIED - Use hook
│   ├── PlayScene.tsx             # MODIFIED - Use hook
│   ├── BathScene.tsx             # MODIFIED - Use hook
│   ├── SleepScene.tsx            # MODIFIED - Use hook
│   └── ...other scenes
└── docs/
    ├── ARCHITECTURE.md           # MODIFIED
    └── CUSTOM_HOOKS.md           # NEW
```

---

## Migration Strategy

### Approach: Gradual Migration

**Why**: Minimize risk, allow testing at each step

**Order**:
1. ✅ Create hook with basic functionality (Sprint 1)
2. ✅ Migrate simplest scene first (ExerciseScene or CuddleScene)
3. ✅ Test thoroughly, fix issues
4. ✅ Migrate FeedScene (medium complexity)
5. ✅ Migrate PlayScene (similar to Feed)
6. ✅ Migrate BathScene (custom logic)
7. ✅ Migrate SleepScene (async/cancellation)
8. ✅ Migrate VetScene (payment logic)

**Safety**: Keep old code commented out until migration confirmed working

---

## Sprint Breakdown

### Sprint 1: Foundation (Days 1-2)
**Goal**: Create working hook with basic functionality

**Tasks**:
1. Create `actionConfig.ts` with animation sequences
2. Create `usePetActions.ts` with core logic
3. Enhance validation in `petStats.ts`
4. Write unit tests
5. Migrate ExerciseScene as proof of concept

**Deliverable**: Working hook + 1 migrated scene

---

### Sprint 2: Scene Migration (Days 3-5)
**Goal**: Migrate all scenes to use new hook

**Tasks**:
1. Migrate FeedScene
2. Migrate PlayScene
3. Migrate BathScene
4. Migrate remaining simple scenes
5. Migrate SleepScene and VetScene (complex cases)
6. Update integration tests

**Deliverable**: All scenes using hook

---

### Sprint 3: Polish & Features (Day 6)
**Goal**: Add advanced features, optimize

**Tasks**:
1. Implement action queuing (if needed)
2. Implement action history tracking
3. Add custom callbacks support
4. Performance optimization
5. Code cleanup - remove old patterns

**Deliverable**: Polished, feature-complete hook

---

### Sprint 4: Testing & Documentation (Day 7)
**Goal**: Comprehensive testing and docs

**Tasks**:
1. Complete test coverage
2. Integration testing all scenes
3. Update documentation
4. Code review and refactor
5. Performance benchmarking

**Deliverable**: Production-ready code with docs

---

## Success Criteria

### Code Quality ✅
- [ ] Single source of truth for action logic
- [ ] No duplicated animation/timeout code
- [ ] Consistent validation across all actions
- [ ] Proper error handling everywhere
- [ ] Clean, maintainable code

### Testing ✅
- [ ] >90% unit test coverage for hook
- [ ] Integration tests for all scenes
- [ ] No regressions in existing functionality
- [ ] Performance not degraded

### User Experience ✅
- [ ] All actions work as before
- [ ] Consistent user feedback
- [ ] No animation glitches
- [ ] Proper cleanup (no memory leaks)

### Developer Experience ✅
- [ ] Easy to add new actions
- [ ] Clear, documented API
- [ ] Scenes are simpler and cleaner
- [ ] Less boilerplate code

---

## Risks & Mitigations

| Risk | Severity | Mitigation |
|------|----------|-----------|
| Breaking existing functionality | High | Gradual migration, thorough testing |
| Performance degradation | Medium | Benchmark before/after, optimize hook |
| Complex scenes hard to migrate | Medium | Keep custom logic in scenes when needed |
| Timeout/memory issues | Medium | Comprehensive cleanup testing |
| Regression in animations | Low | Visual testing, video comparisons |

---

## Estimated Effort

**Total**: 7-10 days

| Phase | Days | Complexity |
|-------|------|------------|
| Sprint 1: Foundation | 2 | High - New architecture |
| Sprint 2: Migration | 3 | Medium - Repetitive work |
| Sprint 3: Polish | 1 | Low - Enhancements |
| Sprint 4: Testing/Docs | 1 | Low - Documentation |

---

## Alternative Approaches Considered

### Alternative 1: State Machine
**Approach**: Use XState or similar for action flows

**Pros**:
- Very explicit state transitions
- Built-in testing tools
- Visual state diagrams

**Cons**:
- Learning curve
- Additional dependency
- Overkill for current needs

**Decision**: ❌ Not chosen - too complex for current requirements

---

### Alternative 2: Middleware Pattern
**Approach**: Create middleware chain for actions (validate → execute → animate → reward)

**Pros**:
- Very flexible
- Easy to add steps
- Clear separation of concerns

**Cons**:
- More complex API
- Harder to understand flow
- More boilerplate

**Decision**: ❌ Not chosen - custom hook is simpler

---

### Alternative 3: Higher Order Component
**Approach**: HOC that wraps scenes with action logic

**Pros**:
- Works with class components
- Can inject props

**Cons**:
- Less TypeScript-friendly
- Harder to compose
- Hooks are more modern

**Decision**: ❌ Not chosen - hooks are preferred pattern

---

## Post-Implementation

### Monitoring
- Track performance metrics
- Monitor for animation issues
- Watch for memory leaks
- Collect developer feedback

### Future Enhancements
- Sound effects integration
- Particle effects system
- Achievement triggers
- Analytics tracking
- Action replay system

---

## Notes

- All stat calculations remain in PetContext
- Scenes keep UI-specific logic (layout, styling, navigation)
- Hook focuses on orchestration and consistency
- Backward compatible during migration
- Can be extended for future action types

---

## Questions & Decisions

### Decision #1: Hook Naming
**Options**:
- `usePetActions` ✅ (chosen - clear, action-focused)
- `usePetStats` (too broad, stats != actions)
- `useActions` (too generic)

### Decision #2: Error Handling
**Approach**: Return success boolean, log errors, show toast

### Decision #3: Sleep Cancellation
**Approach**: Expose `cancelAction()` method, scenes call when needed

### Decision #4: Reward Timing
**Approach**: Trigger after animation completes (maintains current UX)
