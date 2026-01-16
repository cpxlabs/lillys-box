# Implementation Plan: Game Balance & UI Improvements

## Overview
This document outlines the implementation plan for vet healing logic, card stats UI improvements, food system updates, and responsive design documentation.

---

## 1. VET HEALING LOGIC

### Current State
- **File**: `src/screens/VetScene.tsx`
- **Context**: `src/context/PetContext.tsx` - `visitVet()` function
- **Config**: `src/config/gameBalance.ts` - vet section
- Single vet treatment option:
  - Cost: 50 coins OR watch ad
  - Effect: Sets health to minimum 70%, +10 hunger/hygiene, -10 energy, -5 happiness

### Proposed Changes

#### Two Treatment Options:

**1. Antibiotic**
- **Cost**: 30 coins OR watch ad (if no money)
- **Effect**: +50% health (add 50 to current health, max 100)
- **Use Case**: Minor health issues, budget-friendly option

**2. Anti-inflammatory**
- **Cost**: 50 coins (no ad option)
- **Effect**: +80% health (add 80 to current health, max 100)
- **Use Case**: Serious health issues, premium option

#### Implementation Steps:

1. **Update `src/config/gameBalance.ts`**
   ```typescript
   vet: {
     antibiotic: {
       cost: 30,
       healthBoost: 50,
       allowAds: true,
     },
     antiInflammatory: {
       cost: 50,
       healthBoost: 80,
       allowAds: false,
     },
   }
   ```

2. **Update `src/context/PetContext.tsx`**
   - Modify `visitVet()` to accept treatment type parameter
   - Change from setting health target to adding health boost
   ```typescript
   const visitVet = (treatmentType: 'antibiotic' | 'antiInflammatory', useMoney: boolean = true): boolean => {
     const effects = GAME_BALANCE.activities.vet[treatmentType];

     if (useMoney && pet.money < effects.cost) return false;
     if (!useMoney && !effects.allowAds) return false;

     updatedPet.health = Math.min(100, calculateHealth(updatedPet) + effects.healthBoost);
     if (useMoney) updatedPet.money -= effects.cost;

     return true;
   };
   ```

3. **Update `src/screens/VetScene.tsx`**
   - Replace single treatment button with two options
   - Show treatment details (cost, health boost)
   - Show "Watch Ad" option only for Antibiotic
   - Disable Anti-inflammatory if insufficient funds
   - Update UI to display both treatment cards

4. **Update `src/types.ts` (if needed)**
   - Add treatment type enum or union type

---

## 2. CARD STATS UI

### Current State
- **File**: `src/components/StatusCard.tsx`
- **File**: `src/components/EnhancedStatusBar.tsx`
- Shows stats with emoji icons and labels
- May have white background styling
- Two-column layout: Pet info (left), Stats (right)

### Proposed Changes

#### Remove White Background
- Remove or update `backgroundColor` style from stat containers
- Ensure transparent or theme-appropriate background

#### Remove Labels (Icon Only)
- Keep emoji icons (🍖, 🛁, ⚡, 😊, ❤️)
- Remove text labels
- Ensure icons are large enough to be recognizable
- Maintain color-coded progress bars

#### Implementation Steps:

1. **Update `src/components/EnhancedStatusBar.tsx`**
   - Remove label text rendering
   - Keep emoji icons
   - Adjust spacing/padding without labels
   - Ensure color-coded bars remain visible
   - Update layout to be icon-only

2. **Update `src/components/StatusCard.tsx`**
   - Remove white background from stat containers
   - Adjust styling for cleaner look
   - Test visibility with new background

3. **Visual Check**
   - Ensure icons are clear and distinguishable
   - Verify color bars are properly aligned
   - Check responsive behavior

---

## 3. FOOD SYSTEM

### Current State
- **File**: `src/screens/FeedScene.tsx`
- **Context**: `src/context/PetContext.tsx` - `feed()` function
- **Config**: `src/config/gameBalance.ts` - feed section
- Food items:
  - Kibble 🍖: +20 hunger
  - Fish 🐟: +25 hunger
  - Treat 🦴: +15 hunger
  - Milk 🥛: +10 hunger
- Free to feed (players earn money from feeding)
- Base effects: +25 hunger, +5 energy, +3 happiness, -2 hygiene

### Proposed Changes

#### Increase Food Percentages
- Kibble: 20 → 30
- Fish: 25 → 35
- Treat: 15 → 25
- Milk: 10 → 20

#### Add Food Costs (15-20 coins)
- Kibble: 15 coins
- Fish: 20 coins
- Treat: 18 coins
- Milk: 15 coins

#### Implementation Steps:

1. **Update `src/screens/FeedScene.tsx`**
   ```typescript
   const FOODS = [
     { id: 'kibble', emoji: '🍖', nameKey: 'feed.foods.kibble', value: 30, cost: 15 },
     { id: 'fish', emoji: '🐟', nameKey: 'feed.foods.fish', value: 35, cost: 20 },
     { id: 'treat', emoji: '🦴', nameKey: 'feed.foods.treat', value: 25, cost: 18 },
     { id: 'milk', emoji: '🥛', nameKey: 'feed.foods.milk', value: 20, cost: 15 },
   ];
   ```

2. **Update `src/context/PetContext.tsx`**
   - Modify `feed()` to accept cost parameter
   - Deduct cost from pet.money
   - Add money check before allowing feed
   ```typescript
   const feed = (amount?: number, cost?: number) => {
     if (cost && pet.money < cost) return false;

     // Apply feeding effects
     updatedPet.hunger += (amount || effects.hunger) * multiplier;
     // ... other effects

     if (cost) updatedPet.money -= cost;
     return true;
   };
   ```

3. **Update `src/screens/FeedScene.tsx` UI**
   - Show cost on food buttons (e.g., "🍖 15 💰")
   - Disable food button if insufficient funds
   - Update handleFeed to pass cost
   - Consider removing "earn money from feeding" mechanic or adjust balance

4. **Update Translation Files (if needed)**
   - Add cost labels to food items in locale files

---

## 4. RESPONSIVE DESIGN DOCUMENTATION

### Current State
- React Native app
- Likely has some responsive logic
- Need to document breakpoints and responsive behavior

### Proposed Documentation

#### Create `RESPONSIVE.md`

**Content Structure:**

1. **Overview**
   - Responsive design philosophy
   - Platform support (iOS, Android, Web)

2. **Breakpoints**
   - **Mobile**: < 768px (phones)
   - **Tablet**: 768px - 1024px (tablets, small laptops)
   - **Web**: > 1024px (desktop, large screens)

3. **Implementation Approach**
   - React Native Dimensions API
   - Platform-specific components
   - Flexbox layout strategy
   - Font scaling
   - Image scaling

4. **Component Guidelines**
   - StatusCard responsive behavior
   - Scene layouts (Feed, Play, Exercise, Vet)
   - Button sizing
   - Modal responsiveness

5. **Testing**
   - Test devices/simulators
   - Orientation handling (portrait/landscape)
   - Platform-specific considerations

#### Implementation Steps:

1. **Audit Current Responsive Code**
   - Check `src/components/` for dimension usage
   - Review screen layouts
   - Identify hardcoded values

2. **Document Findings**
   - Current breakpoints used
   - Responsive patterns
   - Platform-specific code

3. **Create `RESPONSIVE.md`**
   - Comprehensive guide
   - Code examples
   - Screenshots (if applicable)

4. **Add Guidelines**
   - Best practices for new components
   - Common pitfalls
   - Recommended libraries/utilities

---

## Implementation Order

### Phase 1: Configuration & Backend
1. Update `src/config/gameBalance.ts` (vet, food)
2. Update `src/types.ts` (add treatment types if needed)
3. Update `src/context/PetContext.tsx` (visitVet, feed functions)

### Phase 2: UI Updates
4. Update `src/screens/VetScene.tsx` (two treatment options)
5. Update `src/components/EnhancedStatusBar.tsx` (remove labels, background)
6. Update `src/components/StatusCard.tsx` (styling)
7. Update `src/screens/FeedScene.tsx` (costs, updated values)

### Phase 3: Documentation
8. Audit responsive code
9. Create `RESPONSIVE.md`

### Phase 4: Testing & Refinement
10. Test all changes on different screen sizes
11. Verify game balance
12. Test edge cases (insufficient funds, max stats, etc.)
13. Update translations if needed

---

## Files to Modify

### Core Files
- [ ] `src/config/gameBalance.ts` - Update vet and food configs
- [ ] `src/context/PetContext.tsx` - Update visitVet() and feed() functions
- [ ] `src/types.ts` - Add treatment type definitions

### Screen Files
- [ ] `src/screens/VetScene.tsx` - Implement two treatment options
- [ ] `src/screens/FeedScene.tsx` - Add costs and update values

### Component Files
- [ ] `src/components/StatusCard.tsx` - Remove white background
- [ ] `src/components/EnhancedStatusBar.tsx` - Icon-only display

### Documentation
- [ ] `RESPONSIVE.md` - Create comprehensive responsive design guide

---

## Testing Checklist

### VET System
- [ ] Antibiotic costs 30 coins and adds 50 health
- [ ] Anti-inflammatory costs 50 coins and adds 80 health
- [ ] Antibiotic allows ad option when no money
- [ ] Anti-inflammatory disabled if less than 50 coins
- [ ] Health doesn't exceed 100
- [ ] Money deducted correctly

### FOOD System
- [ ] All food items cost coins (15-20)
- [ ] Food values increased (kibble 30, fish 35, treat 25, milk 20)
- [ ] Cannot feed if insufficient funds
- [ ] Money deducted after feeding
- [ ] Food buttons show costs

### CARD STATS
- [ ] White background removed
- [ ] Labels removed, only icons visible
- [ ] Icons are clear and recognizable
- [ ] Color bars still functional
- [ ] Layout looks clean

### RESPONSIVE
- [ ] Documentation covers all breakpoints
- [ ] Examples are clear and actionable
- [ ] Guidelines help future development

---

## Risks & Considerations

### Game Balance
- **Risk**: Making food cost money may make game too difficult
- **Mitigation**: Ensure money-earning activities (play, exercise) provide sufficient income
- **Consideration**: Test progression - can players afford vet AND food?

### UX Impact
- **Risk**: Removing labels may reduce clarity for new players
- **Mitigation**: Ensure icons are universally recognizable, consider tutorial/help screen
- **Consideration**: Test with users unfamiliar with the game

### Health Calculation
- **Risk**: Changing from "set health to X" to "add X health" changes game mechanics
- **Mitigation**: Balance antibiotic/anti-inflammatory costs accordingly
- **Consideration**: Pet at 10% health + antibiotic (50%) = 60% vs old system (70%)

### Backward Compatibility
- **Risk**: Existing saved games may have issues with new cost structure
- **Mitigation**: Consider migration logic for existing players with low money
- **Consideration**: May need to grant starting bonus to existing users

---

## Success Criteria

### VET System
✅ Two distinct treatment options available
✅ Costs and health boosts match specifications
✅ Ad option works for Antibiotic only
✅ UI clearly shows difference between treatments

### FOOD System
✅ All foods cost coins (15-20 range)
✅ Hunger values increased by ~50%
✅ Cannot feed without sufficient funds
✅ Game remains balanced and playable

### CARD STATS
✅ Clean, icon-only display
✅ No white background
✅ Stats easily readable
✅ Maintains visual appeal

### RESPONSIVE
✅ Comprehensive documentation created
✅ Covers mobile, tablet, and web
✅ Includes practical examples
✅ Useful for future development

---

## Post-Implementation

### Monitoring
- Track player feedback on new vet options
- Monitor game economy (are players earning enough?)
- Check for UI/UX issues with icon-only stats

### Potential Future Enhancements
- Additional vet treatments (surgery, vaccination)
- More food variety with different cost/value ratios
- Premium food items
- Responsive UI improvements based on documentation

---

## Notes

- All monetary values in coins (💰)
- Health values as percentages (0-100)
- Maintain existing multiplier logic for energy-based effects
- Preserve ad integration for Antibiotic treatment
- Keep translation system intact for i18n support
