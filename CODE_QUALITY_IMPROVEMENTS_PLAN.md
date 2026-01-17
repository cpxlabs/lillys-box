# Implementation Plan: Code Quality Improvements

## Overview
This document outlines the implementation plan for bug fixes, internationalization improvements, and code quality enhancements identified from comprehensive code documentation and analysis.

**Status**: 🟡 PENDING APPROVAL

**Created**: 2026-01-17

**Based On**: Code documentation analysis (VET_ACTIONS_DOCUMENTATION.md, FEED_ACTIONS_DOCUMENTATION.md, PLAY_ACTIONS_DOCUMENTATION.md)

---

## Priority Levels

- 🔴 **Critical** - Bugs that cause runtime errors
- 🟡 **High** - Important improvements affecting UX/consistency
- 🟢 **Medium** - Code quality and maintainability
- ⚪ **Low** - Nice-to-have enhancements

---

## Issues Identified

### 🔴 Critical Issues

#### Issue #1: VET visitVet() Function - Undefined Variables
**Location**: `src/context/PetContext.tsx:287, 301, 306, 309`

**Problem**:
```typescript
// Line 287: Undefined variable 'treatment'
logger.info(`visitVet: Starting vet visit (treatment: ${treatment}, useMoney: ${useMoney})`);

// Line 301: Undefined variable 'treatmentConfig'
money: useMoney ? currentPet.money - treatmentConfig.cost : currentPet.money,

// Line 306: Undefined variable 'treatmentConfig'
updatedPet.health = Math.max(treatmentConfig.healthTarget, calculatedHealth);

// Line 309: Undefined variable 'treatmentConfig'
`visitVet: Health updated - calculated: ${calculatedHealth}, target: ${treatmentConfig.healthTarget}, final: ${updatedPet.health}`
```

**Expected Values**:
- `treatmentConfig.cost` → Should be `effects.cost`
- `treatmentConfig.healthTarget` → Should be `effects.healthTarget`
- `treatment` → Should be removed or use a descriptive string

**Impact**: Function will throw ReferenceError when executed, breaking vet functionality.

**Evidence**: See docs/VET_ACTIONS_DOCUMENTATION.md section "Code Issues Found"

---

#### Issue #2: Play Scene - Missing UI Import (FIXED ✅)
**Location**: `src/components/PetRenderer.tsx:340`

**Status**: ✅ **ALREADY FIXED** in commit b67e806

**Problem**: Used `UI.DIRT_MARK_SIZE_RATIO` without importing `UI` constant.

**Solution Applied**: Added `import { UI } from '../config/constants';`

---

### 🟡 High Priority Issues

#### Issue #3: Play Scene - No Internationalization
**Location**: `src/screens/PlayScene.tsx`

**Problem**: Hardcoded Portuguese strings throughout the file:
```typescript
// Line 88
title="🎮 Brincar"

// Line 31-32
{ id: 'yarn_ball', emoji: '🧶', name: 'Bola de lã' },
{ id: 'small_ball', emoji: '⚽', name: 'Bolinha' },

// Line 65
setMessage(`${pet.name} está brincando com ${activity.name}! 🎉`);

// Line 73
setMessage(`${pet.name} adorou brincar! 💕`);

// Line 107
<Text>Escolha a atividade:</Text>
```

**Expected Behavior**: Should use i18n translation system like FeedScene:
```typescript
title={t('play.title')}
nameKey: 'play.activities.yarn_ball'
setMessage(t('play.playing', { name: pet.name, activity: t(activity.nameKey) }))
```

**Impact**:
- Unable to support multiple languages
- Inconsistent with rest of application (FeedScene uses i18n)
- Hard to maintain and update text

**Comparison**: FeedScene has full i18n support, PlayScene does not.

---

#### Issue #4: Play Scene - No Timeout Management
**Location**: `src/screens/PlayScene.tsx:63-83`

**Problem**: Uses nested `setTimeout` without refs or cleanup:
```typescript
const handlePlay = (activity: typeof PLAY_ACTIVITIES[0]) => {
  setAnimationState('happy');

  setTimeout(() => {
    setMessage(`${pet.name} adorou brincar! 💕`);

    setTimeout(() => {
      setAnimationState('idle');
      setMessage('');
      triggerReward(moneyEarned);
    }, ANIMATION_DURATION.MEDIUM);
  }, ANIMATION_DURATION.MEDIUM);
};
```

**Expected Pattern** (from FeedScene):
```typescript
const animationTimeout1 = useRef<NodeJS.Timeout | null>(null);
const animationTimeout2 = useRef<NodeJS.Timeout | null>(null);

useEffect(() => {
  return () => {
    if (animationTimeout1.current) clearTimeout(animationTimeout1.current);
    if (animationTimeout2.current) clearTimeout(animationTimeout2.current);
  };
}, []);

const handleFeed = (food) => {
  // Clear existing timeouts
  if (animationTimeout1.current) clearTimeout(animationTimeout1.current);
  if (animationTimeout2.current) clearTimeout(animationTimeout2.current);

  animationTimeout1.current = setTimeout(() => {
    // ...
    animationTimeout2.current = setTimeout(() => {
      // ...
    }, ANIMATION_DURATION.MEDIUM);
  }, ANIMATION_DURATION.MEDIUM);
};
```

**Impact**:
- Potential memory leaks if component unmounts during animation
- State updates on unmounted component warnings
- Can't cancel animations on rapid clicks

**Evidence**: FeedScene implements proper pattern, PlayScene does not.

---

### 🟢 Medium Priority Issues

#### Issue #5: Dual Money System in Play Action
**Location**: `src/context/PetContext.tsx:145-165`, `src/screens/PlayScene.tsx:70`

**Problem**: Play action adds coins in TWO places:
1. **Immediate**: `play()` function adds 5 coins directly to `pet.money` (line 158)
2. **Delayed**: Reward system adds 10 coins base (or 20 with ad) via `earnMoney()`

**Result**:
- User receives 15 coins total (no ad) or 25 coins (with ad)
- Not transparent to users
- Reward modal shows 10 coins but user actually gets 15
- Inconsistent with Feed system (only has reward coins, no immediate coins)

**Evidence**: See docs/PLAY_ACTIONS_DOCUMENTATION.md section "Reward System"

**Recommendation**:
- **Option A**: Remove `money: 5` from gameBalance play effects, increase playReward to 15
- **Option B**: Keep dual system but document it clearly in UI/docs
- **Option C**: Make it consistent - either both actions give immediate coins or neither

---

#### Issue #6: Play Activities Configuration
**Location**: `src/screens/PlayScene.tsx:30-33`

**Problem**: Activities defined inline in component instead of separate data file:
```typescript
const PLAY_ACTIVITIES = [
  { id: 'yarn_ball', emoji: '🧶', name: 'Bola de lã' },
  { id: 'small_ball', emoji: '⚽', name: 'Bolinha' },
];
```

**Expected Pattern**: Similar to food items:
- `src/data/foodItems.ts` exists with `FOOD_ITEMS` array
- Play activities should be in `src/data/playActivities.ts`

**Benefits**:
- Centralized data management
- Easier to add new activities
- Type safety with shared interfaces
- Reusability across components

---

#### Issue #7: Missing User Feedback for Blocked Actions
**Location**: `src/screens/PlayScene.tsx`, `src/screens/FeedScene.tsx`

**Problem**: When energy is too low (<20), play button simply doesn't work with no feedback:
```typescript
disabled={animationState !== 'idle'}  // No check for energy
```

**Expected Behavior**: Show toast/alert when action is blocked:
```typescript
const handlePlay = (activity) => {
  if (!canPerformActivity(pet, 'play')) {
    showToast(t('play.needsRest'), 'info');
    return;
  }
  // ... continue with play
};
```

**Impact**: Users may think app is broken when button doesn't respond.

---

### ⚪ Low Priority Issues

#### Issue #8: FeedScene vs PlayScene Inconsistency
**Location**: Multiple files

**Observations**:

| Feature | FeedScene | PlayScene |
|---------|-----------|-----------|
| **i18n Support** | ✅ Full | ❌ None |
| **Timeout Management** | ✅ Refs + cleanup | ❌ No refs |
| **Error Handling** | ✅ Try-catch | ❌ None |
| **Items Count** | 4 foods | 2 activities |
| **Data File** | ✅ foodItems.ts exists | ❌ Inline definition |

**Recommendation**: Align PlayScene with FeedScene patterns for consistency.

---

## Implementation Plan

### Phase 1: Critical Bug Fixes 🔴

#### Task 1.1: Fix VET visitVet() Undefined Variables
**Priority**: 🔴 Critical
**Estimated Time**: 30 minutes
**Files**: `src/context/PetContext.tsx`

**Changes Required**:

```typescript
// Line 287: Remove or fix undefined 'treatment' variable
// BEFORE:
logger.info(`visitVet: Starting vet visit (treatment: ${treatment}, useMoney: ${useMoney})`);

// AFTER:
logger.info(`visitVet: Starting vet visit (useMoney: ${useMoney})`);


// Line 293: Define statsImprovement constant (already correct, just verify)
const statsImprovement = 15;


// Line 301: Fix undefined 'treatmentConfig.cost'
// BEFORE:
money: useMoney ? currentPet.money - treatmentConfig.cost : currentPet.money,

// AFTER:
money: useMoney ? currentPet.money - effects.cost : currentPet.money,


// Line 306-309: Fix undefined 'treatmentConfig.healthTarget'
// BEFORE:
updatedPet.health = Math.max(treatmentConfig.healthTarget, calculatedHealth);
logger.info(
  `visitVet: Health updated - calculated: ${calculatedHealth}, target: ${treatmentConfig.healthTarget}, final: ${updatedPet.health}`
);

// AFTER:
updatedPet.health = Math.max(effects.healthTarget, calculatedHealth);
logger.info(
  `visitVet: Health updated - calculated: ${calculatedHealth}, target: ${effects.healthTarget}, final: ${updatedPet.health}`
);
```

**Testing**:
- [ ] Visit vet with sufficient money (50 coins)
- [ ] Visit vet with ad watching (0 coins)
- [ ] Visit vet with insufficient money (< 50 coins)
- [ ] Verify health is set to minimum 70%
- [ ] Check console logs are correct
- [ ] No ReferenceError thrown

---

### Phase 2: Internationalization 🟡

#### Task 2.1: Add Play Scene i18n Support
**Priority**: 🟡 High
**Estimated Time**: 2 hours
**Files**:
- `src/screens/PlayScene.tsx`
- `src/data/playActivities.ts` (new)
- `src/i18n/locales/pt.json` (or equivalent)
- `src/i18n/locales/en.json` (if exists)

**Step 1: Create Play Activities Data File**

Create `src/data/playActivities.ts`:
```typescript
/**
 * Play Activities Configuration
 * Centralized data for all play activities in the game
 */

export interface PlayActivity {
  id: string;
  emoji: string;
  nameKey: string;
}

export const PLAY_ACTIVITIES: readonly PlayActivity[] = [
  {
    id: 'yarn_ball',
    emoji: '🧶',
    nameKey: 'play.activities.yarn_ball',
  },
  {
    id: 'small_ball',
    emoji: '⚽',
    nameKey: 'play.activities.small_ball',
  },
] as const;

export const getActivityById = (id: string): PlayActivity | undefined => {
  return PLAY_ACTIVITIES.find((activity) => activity.id === id);
};
```

**Step 2: Update PlayScene.tsx**

```typescript
// Add imports
import { PLAY_ACTIVITIES } from '../data/playActivities';

// Remove inline PLAY_ACTIVITIES definition (lines 30-33)

// Update title (line 88)
// BEFORE:
title="🎮 Brincar"
// AFTER:
title={t('play.title')}

// Update section title (line 107)
// BEFORE:
<Text style={[styles.activitiesTitle, ...]}>Escolha a atividade:</Text>
// AFTER:
<Text style={[styles.activitiesTitle, ...]}>{t('play.chooseActivity')}</Text>

// Update activity name display (line 125)
// BEFORE:
<Text style={[styles.currentActivityName, ...]}>{currentActivity.name}</Text>
// AFTER:
<Text style={[styles.currentActivityName, ...]}>{t(currentActivity.nameKey)}</Text>

// Update messages (lines 65, 73)
// BEFORE:
setMessage(`${pet.name} está brincando com ${activity.name}! 🎉`);
setMessage(`${pet.name} adorou brincar! 💕`);

// AFTER:
setMessage(t('play.playing', { name: pet.name, activity: t(activity.nameKey) }));
setMessage(t('play.loved', { name: pet.name }));
```

**Step 3: Add Translation Keys**

Add to translation files (e.g., `src/i18n/locales/pt.json`):
```json
{
  "play": {
    "title": "🎮 Brincar",
    "chooseActivity": "Escolha a atividade:",
    "playing": "{{name}} está brincando com {{activity}}! 🎉",
    "loved": "{{name}} adorou brincar! 💕",
    "needsRest": "{{name}} está muito cansado para brincar. Precisa descansar!",
    "activities": {
      "yarn_ball": "Bola de lã",
      "small_ball": "Bolinha"
    }
  }
}
```

Add to `src/i18n/locales/en.json` (if exists):
```json
{
  "play": {
    "title": "🎮 Play",
    "chooseActivity": "Choose the activity:",
    "playing": "{{name}} is playing with {{activity}}! 🎉",
    "loved": "{{name}} loved playing! 💕",
    "needsRest": "{{name}} is too tired to play. Needs rest!",
    "activities": {
      "yarn_ball": "Yarn Ball",
      "small_ball": "Small Ball"
    }
  }
}
```

**Testing**:
- [ ] All text displays correctly in Portuguese
- [ ] Switch language (if supported) and verify English
- [ ] Activity names use translation keys
- [ ] Messages use translation with variables
- [ ] No hardcoded strings remain

---

#### Task 2.2: Add Timeout Management to PlayScene
**Priority**: 🟡 High
**Estimated Time**: 1 hour
**Files**: `src/screens/PlayScene.tsx`

**Changes Required**:

```typescript
// Add refs at component top (after useState hooks)
const animationTimeout1 = useRef<NodeJS.Timeout | null>(null);
const animationTimeout2 = useRef<NodeJS.Timeout | null>(null);

// Add cleanup effect (after other useEffects)
useEffect(() => {
  return () => {
    if (animationTimeout1.current) {
      clearTimeout(animationTimeout1.current);
    }
    if (animationTimeout2.current) {
      clearTimeout(animationTimeout2.current);
    }
  };
}, []);

// Update handlePlay function
const handlePlay = (activity: typeof PLAY_ACTIVITIES[0]) => {
  try {
    // Clear any existing timeouts to prevent conflicts
    if (animationTimeout1.current) {
      clearTimeout(animationTimeout1.current);
    }
    if (animationTimeout2.current) {
      clearTimeout(animationTimeout2.current);
    }

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

**Testing**:
- [ ] Normal play flow works correctly
- [ ] Rapid clicking doesn't cause animation conflicts
- [ ] Navigate away during animation - no warnings
- [ ] Component unmount cleans up timeouts
- [ ] Error handling resets UI state

---

### Phase 3: Code Quality & UX 🟢

#### Task 3.1: Add User Feedback for Blocked Actions
**Priority**: 🟢 Medium
**Estimated Time**: 1 hour
**Files**: `src/screens/PlayScene.tsx`, `src/screens/FeedScene.tsx`

**PlayScene Changes**:

```typescript
const handlePlay = (activity: typeof PLAY_ACTIVITIES[0]) => {
  // Check if pet can perform activity
  if (!canPerformActivity(pet, 'play')) {
    showToast(t('play.needsRest', { name: pet.name }), 'info');
    return;
  }

  try {
    // ... existing play logic
  } catch (error) {
    logger.error('Play error:', error);
    setAnimationState('idle');
    setMessage('');
  }
};
```

**FeedScene Changes** (similar pattern):

```typescript
const handleFeed = (food: typeof FOODS[0]) => {
  // Check if pet can perform activity
  if (!canPerformActivity(pet, 'feed')) {
    showToast(t('feed.tooTired', { name: pet.name }), 'info');
    return;
  }

  // Check if hunger is already full
  if (pet.hunger >= 100) {
    showToast(t('feed.notHungry', { name: pet.name }), 'info');
    return;
  }

  try {
    // ... existing feed logic
  } catch (error) {
    logger.error('Feed error:', error);
    setAnimationState('idle');
    setMessage('');
  }
};
```

**Add Translation Keys**:
```json
{
  "play": {
    "needsRest": "{{name}} está muito cansado para brincar. Precisa descansar!"
  },
  "feed": {
    "tooTired": "{{name}} está muito cansado para comer. Precisa descansar!",
    "notHungry": "{{name}} não está com fome agora!"
  }
}
```

**Testing**:
- [ ] Low energy shows toast when trying to play
- [ ] Low energy shows toast when trying to feed
- [ ] Full hunger shows toast when trying to feed
- [ ] Toast messages are clear and helpful
- [ ] Actions still work normally when allowed

---

#### Task 3.2: Resolve Dual Money System Decision
**Priority**: 🟢 Medium
**Estimated Time**: 2 hours (including testing)
**Files**: `src/context/PetContext.tsx`, `src/config/gameBalance.ts`, `src/config/ads.config.ts`

**Options for Resolution**:

**Option A: Consolidate to Reward System Only** (Recommended)
```typescript
// gameBalance.ts
play: {
  happiness: 20,
  hunger: -15,
  hygiene: -15,
  energy: -25,
  money: 0,        // REMOVE immediate coins
}

// ads.config.ts
rewards: {
  playReward: 15,  // INCREASE from 10 to 15 (matches current total)
}
```
**Pros**: Simpler, consistent with Feed system, clearer to users
**Cons**: Slight change to existing behavior

**Option B: Keep Dual System, Document Clearly**
```typescript
// Keep current implementation
// Update UI to show "Earned 15 coins!" instead of "Earned 10 coins!"
// Document in code comments why both exist
```
**Pros**: No changes needed, maintains current behavior
**Cons**: Confusing for users and developers, inconsistent

**Option C: Add Immediate Coins to Feed Too**
```typescript
// gameBalance.ts
feed: {
  // ... other effects
  money: 5,        // ADD immediate coins to match Play
}

// ads.config.ts - keep as is
feedReward: 5,     // Reward stays 5
```
**Pros**: Consistency between Feed and Play
**Cons**: Changes established Feed behavior, may break game balance

**Recommendation**: **Option A** - Consolidate to reward system only.

**Implementation** (Option A):

```typescript
// 1. Update src/config/gameBalance.ts
play: {
  happiness: 20,
  hunger: -15,
  hygiene: -15,
  energy: -25,
  money: 0,  // Changed from 5 to 0
}

// 2. Update src/config/ads.config.ts
rewards: {
  playReward: 15,  // Changed from 10 to 15
}

// 3. No changes needed to PetContext.tsx - money: 0 will just add nothing
```

**Testing**:
- [ ] Play action with no ad: receive 15 coins total
- [ ] Play action with ad: receive 30 coins total (15 × 2)
- [ ] Toast message shows correct amount
- [ ] Feed action unchanged: 5 coins (or 10 with ad)
- [ ] Game economy remains balanced

---

### Phase 4: Documentation Updates 📚

#### Task 4.1: Update Code Documentation
**Priority**: 🟢 Medium
**Estimated Time**: 30 minutes
**Files**: `docs/PLAY_ACTIONS_DOCUMENTATION.md`, `docs/VET_ACTIONS_DOCUMENTATION.md`

**Changes**:
1. Update PLAY_ACTIONS_DOCUMENTATION.md:
   - Mark i18n issues as resolved
   - Mark timeout management as resolved
   - Update dual money system section with chosen solution
   - Update code examples to reflect new implementation

2. Update VET_ACTIONS_DOCUMENTATION.md:
   - Mark visitVet() bugs as resolved
   - Update code examples with correct variable names

3. Create CHANGELOG.md entry:
   - List all bug fixes
   - List all improvements
   - Note any breaking changes

---

#### Task 4.2: Update User-Facing Documentation
**Priority**: ⚪ Low
**Estimated Time**: 1 hour
**Files**: `README.md`, `docs/USER_GUIDE.md` (if exists)

**Changes**:
- Document play and feed systems for users
- Explain coin earning mechanics clearly
- Add troubleshooting section for common issues
- Update feature list with i18n support

---

## Implementation Order

### Sprint 1: Critical Fixes (Day 1)
1. ✅ Fix VET visitVet() undefined variables (Task 1.1)
2. ✅ Test vet functionality thoroughly

### Sprint 2: Internationalization (Days 2-3)
3. ✅ Create play activities data file (Task 2.1 Step 1)
4. ✅ Add i18n to PlayScene (Task 2.1 Step 2-3)
5. ✅ Add timeout management (Task 2.2)
6. ✅ Test all changes

### Sprint 3: UX & Polish (Days 4-5)
7. ✅ Add user feedback for blocked actions (Task 3.1)
8. ✅ Resolve dual money system (Task 3.2)
9. ✅ Test game economy balance

### Sprint 4: Documentation (Day 6)
10. ✅ Update code documentation (Task 4.1)
11. ✅ Update user documentation (Task 4.2)
12. ✅ Final review and testing

---

## Files to Modify

### New Files to Create
- [ ] `src/data/playActivities.ts` - Play activities configuration

### Files to Modify
- [ ] `src/context/PetContext.tsx` - Fix visitVet() bugs (Lines 287, 301, 306, 309)
- [ ] `src/screens/PlayScene.tsx` - Add i18n, timeout management, user feedback
- [ ] `src/screens/FeedScene.tsx` - Add user feedback for blocked actions
- [ ] `src/config/gameBalance.ts` - Update play money (if Option A chosen)
- [ ] `src/config/ads.config.ts` - Update playReward (if Option A chosen)
- [ ] `src/i18n/locales/pt.json` - Add play translation keys
- [ ] `src/i18n/locales/en.json` - Add play translation keys (if exists)

### Documentation Files to Update
- [ ] `docs/PLAY_ACTIONS_DOCUMENTATION.md` - Mark issues as resolved
- [ ] `docs/VET_ACTIONS_DOCUMENTATION.md` - Mark bugs as resolved
- [ ] `CHANGELOG.md` - Add changelog entry (create if doesn't exist)
- [ ] `README.md` - Update feature list (optional)

---

## Testing Checklist

### VET System Fixes
- [ ] Vet visit with money works without errors
- [ ] Vet visit with ad works without errors
- [ ] Console logs display correctly
- [ ] Health calculation works as expected
- [ ] No ReferenceError or undefined variable errors

### Play Scene i18n
- [ ] All text uses translation keys
- [ ] Portuguese translations display correctly
- [ ] English translations display correctly (if applicable)
- [ ] Activity names use translation system
- [ ] Messages with variables render correctly

### Timeout Management
- [ ] Normal play animation works
- [ ] Rapid clicking doesn't break animation
- [ ] Component unmount clears timeouts
- [ ] No console warnings about state updates
- [ ] Error handling works correctly

### User Feedback
- [ ] Low energy shows helpful toast (Play)
- [ ] Low energy shows helpful toast (Feed)
- [ ] Full hunger shows helpful toast (Feed)
- [ ] Toast messages are clear and localized
- [ ] Actions work normally when conditions are met

### Money System
- [ ] Play earns correct total coins (15 or chosen amount)
- [ ] Feed earns correct coins (5 or 10 with ad)
- [ ] Game economy is balanced
- [ ] Toast messages show correct amounts
- [ ] Double reward modal shows correct values

### Regression Testing
- [ ] All existing functionality still works
- [ ] No new bugs introduced
- [ ] Performance is not degraded
- [ ] All screens load correctly
- [ ] State persistence works

---

## Success Criteria

### Critical Bugs Fixed ✅
- VET visitVet() function works without errors
- No undefined variable references
- Console logs are correct and informative

### Internationalization Complete ✅
- Play scene fully internationalized
- Consistent with Feed scene implementation
- Supports multiple languages (Portuguese + English minimum)
- No hardcoded strings in Play scene

### Code Quality Improved ✅
- Proper timeout management with cleanup
- Error handling in place
- User feedback for blocked actions
- Consistent patterns across similar components

### Documentation Updated ✅
- Code documentation reflects current state
- Known issues marked as resolved
- User documentation is helpful and accurate

### No Regressions ✅
- All existing features work as before
- No new bugs introduced
- Performance maintained or improved

---

## Risks & Considerations

### Risk 1: Translation Coverage
**Risk**: Not all languages may have complete translations
**Mitigation**:
- Ensure fallback to default language (Portuguese)
- Test with incomplete translation files
- Document missing translations for future work

### Risk 2: Timeout Management Changes
**Risk**: Changing timeout handling could introduce new timing bugs
**Mitigation**:
- Follow proven pattern from FeedScene
- Test thoroughly on different devices
- Monitor for any animation glitches

### Risk 3: Money System Changes
**Risk**: Changing coin rewards could break game balance
**Mitigation**:
- Calculate total daily earnings vs. spending
- Test with different play patterns
- Keep old config values in comments for reference
- Can revert quickly if balance is broken

### Risk 4: User Confusion
**Risk**: Users may not understand new toast messages
**Mitigation**:
- Use clear, simple language in toasts
- Include pet name for personalization
- Test messages with target audience (kids/parents)

---

## Decision Log

### Decision #1: VET Bug Fix Approach
**Date**: 2026-01-17
**Decision**: Replace undefined variables with correct references to `effects` object
**Rationale**: Simple fix, maintains existing functionality, prevents runtime errors
**Status**: ⏳ Pending Implementation

### Decision #2: Play Scene i18n Priority
**Date**: 2026-01-17
**Decision**: Make Play scene i18n a high priority to match Feed scene
**Rationale**: Inconsistency is confusing for developers and limits international adoption
**Status**: ⏳ Pending Implementation

### Decision #3: Timeout Management Pattern
**Date**: 2026-01-17
**Decision**: Use FeedScene pattern as reference implementation
**Rationale**: Already proven to work, maintains consistency, includes cleanup
**Status**: ⏳ Pending Implementation

### Decision #4: Dual Money System Resolution
**Date**: 2026-01-17
**Decision**: TBD - Options presented for team discussion
**Recommendation**: Option A (consolidate to reward system only)
**Rationale**: Simpler, clearer, consistent with Feed system
**Status**: 🟡 Awaiting Approval

---

## Post-Implementation

### Monitoring
- Track crash reports for any new errors
- Monitor user feedback on translated content
- Check analytics for play/feed engagement changes
- Verify game economy remains balanced

### Future Enhancements
- Add more play activities (3-4 additional activities)
- Add more languages (Spanish, French, German)
- Add tutorial explaining energy/activity relationship
- Consider unified reward system across all activities
- Add sound effects to play/feed actions

---

## Notes

- All changes maintain backward compatibility with saved game data
- No changes to Pet type structure required
- Translation keys follow existing naming conventions
- Code patterns follow established best practices
- Testing should be done on multiple device types
- Consider A/B testing for money system changes

---

## Approval Signatures

**Developer**: ___________________________ Date: ___________

**Code Reviewer**: ______________________ Date: ___________

**Product Owner**: ______________________ Date: ___________

---

**Status Updates**:
- 2026-01-17: Plan created, awaiting approval
- _________: Approved for implementation
- _________: Sprint 1 completed
- _________: Sprint 2 completed
- _________: Sprint 3 completed
- _________: Sprint 4 completed
- _________: All testing passed, ready for merge

---

## Quick Start

To begin implementation:

1. **Review this plan** and get team approval
2. **Create feature branch**: `git checkout -b feature/code-quality-improvements`
3. **Start with Sprint 1** (Critical fixes)
4. **Test thoroughly** after each task
5. **Update this document** as tasks are completed
6. **Submit PR** when all sprints complete

For questions or suggestions, create a GitHub issue or discuss in team meeting.
