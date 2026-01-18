# Vet Actions Documentation

## Overview
The vet system provides medical care for pets, restoring their health and improving their overall stats. Players can pay with coins or watch an ad to get free treatment.

---

## User Interface (VetScene.tsx)

### Screen Layout

1. **Header Section** (`src/screens/VetScene.tsx:143-148`)
   - Title: "🏥 Veterinário"
   - Back button to return to previous screen

2. **Pet Info Header** (`src/screens/VetScene.tsx:153-167`)
   - Pet name with emoji (🐱 for cats, 🐶 for dogs)
   - Pet age (calculated from creation date)
   - Current money balance (💰)
   - Health badge showing current health percentage with color-coded urgency

3. **Main Display Area** (`src/screens/VetScene.tsx:170-209`)
   - **Pet Renderer**: Shows the pet in idle state
   - **Health Status Card**:
     - Displays current health percentage
     - Shows urgency emoji (🚨 urgent, ⚠️ suggested, ✅ healthy)
     - Color-coded border based on urgency level
     - Urgency message
   - **Benefits Sidebar**: Shows what the vet visit provides
     - Health restored to 70%
     - Stats boosted by +10
     - Energy affected

4. **Payment Options** (`src/screens/VetScene.tsx:212-248`)
   - **Pay with Coins Button**:
     - Cost: 50 coins
     - Shows current balance
     - Disabled if insufficient funds
     - Green background (#4CAF50)

   - **Watch Ad Button**:
     - Free alternative to payment
     - Shows loading state when processing
     - Disabled if ad not ready
     - Blue background (#2196F3)

---

## Health Status System

### Health Thresholds (`src/utils/petStats.ts:121-125`)

The `needsVet()` function determines urgency based on health:

```typescript
- health < 40:  "urgent"     🚨
- health < 60:  "suggested"  ⚠️
- health ≥ 60:  "none"       ✅
```

### Urgency Display (`src/screens/VetScene.tsx:128-140`)

| Status | Color | Message |
|--------|-------|---------|
| Urgent | Red (#EF5350) | "{pet.name} needs urgent medical attention!" |
| Suggested | Orange (#FFA726) | "{pet.name} could use a checkup." |
| None | Green (#4CAF50) | "{pet.name} is healthy but can still visit for a boost!" |

---

## Payment Flow

### 1. Pay with Money (`src/screens/VetScene.tsx:49-72`)

**Process:**
1. Check if player has enough money (≥ 50 coins)
2. If insufficient, show alert and exit
3. If sufficient, show confirmation dialog
4. On confirmation, call `performVetVisit(true)`

**User Feedback:**
- Insufficient funds: Alert with current balance vs. required amount
- Confirmation: Shows cost and treatment description
- Success: "✅ Checkup Complete!" alert with pet name

### 2. Watch Ad (`src/screens/VetScene.tsx:74-100`)

**Process:**
1. Check if rewarded ad is ready
2. If not ready, show "Ad Not Ready" alert
3. Set processing state to prevent multiple triggers
4. Show rewarded ad via `showRewardedAd()` hook
5. On ad completion, call `performVetVisit(false)`
6. Handle errors with user-friendly alert

**States:**
- Processing: Button shows "⏳ Loading..."
- Ad not ready: Button disabled with "Ad loading..." subtext
- Error: Alert with "Something went wrong"

---

## Vet Treatment Logic

### Game Balance Configuration (`src/config/gameBalance.ts:71-77`)

```typescript
vet: {
  cost: 50,              // Coins required for paid visit
  healthTarget: 70,      // Minimum health after treatment
  energy: -10,           // Energy cost (not currently used in implementation)
  happiness: -5,         // Happiness cost (not currently used in implementation)
  statBoost: 10,         // Amount to boost other stats (not currently used - hardcoded as 15)
}
```

### visitVet Function (`src/context/PetContext.tsx:273-317`)

**Parameters:**
- `useMoney` (boolean): Whether to deduct coins (true) or use free treatment from ad (false)

**Return Value:**
- `boolean`: true if successful, false if failed

**Logic Flow:**

1. **Validation** (`PetContext.tsx:274-286`)
   ```typescript
   - Check if pet exists → return false if not
   - If useMoney && insufficient funds → return false
   ```

2. **Stats Improvement** (`PetContext.tsx:289-302`)
   ```typescript
   const statsImprovement = 15;  // Hardcoded value

   Updated stats:
   - hunger: min(100, current + 15)
   - hygiene: min(100, current + 15)
   - energy: min(100, current + 15)
   - happiness: min(100, current + 15)
   - money: current - cost (if useMoney is true)
   ```

3. **Health Calculation** (`PetContext.tsx:305-306`)
   ```typescript
   - Calculate health based on improved stats
   - Set health to maximum of:
     * Calculated health from stats
     * Health target (70%)
   - This guarantees minimum 70% health
   ```

4. **Persistence** (`PetContext.tsx:312`)
   - Save updated pet state to storage
   - Log health update details

---

## Code Issues Found ⚠️

### ~~Bug in visitVet Function~~ ✅ FIXED (2026-01-17)

**Status**: ✅ **RESOLVED** in commit 18d09f3

**Issue:** References to undefined variables:
```typescript
Line 287: logger.info(`visitVet: Starting vet visit (treatment: ${treatment}, useMoney: ${useMoney})`);
Line 301: money: useMoney ? currentPet.money - treatmentConfig.cost : currentPet.money,
Line 306: updatedPet.health = Math.max(treatmentConfig.healthTarget, calculatedHealth);
Line 309: `visitVet: Health updated - calculated: ${calculatedHealth}, target: ${treatmentConfig.healthTarget}, final: ${updatedPet.health}`
```

**Fixed code:**
```typescript
Line 287: logger.info(`visitVet: Starting vet visit (useMoney: ${useMoney})`);
Line 301: money: useMoney ? currentPet.money - effects.cost : currentPet.money,
Line 306: updatedPet.health = Math.max(effects.healthTarget, calculatedHealth);
Line 309: `visitVet: Health updated - calculated: ${calculatedHealth}, target: ${effects.healthTarget}, final: ${updatedPet.health}`
```

**Resolution:**
- Removed undefined `treatment` variable from logger
- Changed `treatmentConfig.cost` → `effects.cost`
- Changed `treatmentConfig.healthTarget` → `effects.healthTarget`

**Impact:** Function now works correctly without ReferenceError. Vet functionality fully operational.

---

## Stats Calculation

### Health Calculation (`src/utils/petStats.ts:8-40`)

Health is calculated as a weighted average of all stats:

```typescript
Weights (from gameBalance.ts):
- Hunger: 25%
- Hygiene: 20%
- Energy: 25%
- Happiness: 30%

Base Health = (hunger × 0.25) + (hygiene × 0.20) + (energy × 0.25) + (happiness × 0.30)

Multipliers applied based on lowest stat:
- Any stat < 10: × 0.5
- Any stat < 25: × 0.75
- Any stat < 50: × 0.9
- All stats ≥ 50: × 1.0

Final Health = min(100, max(0, baseHealth × multiplier))
```

### Why Vet Improves Underlying Stats

Since health is derived from other stats, the vet visit:
1. Boosts all stats by +15
2. Recalculates health based on improved stats
3. Sets health to at least 70% (even if calculated health is lower)

This ensures the pet maintains improved health after the visit.

---

## User Experience Flow

### Typical Vet Visit Journey:

1. **User navigates to Vet screen**
   - Sees pet's current health status
   - Sees urgency indicator and message
   - Views available payment options

2. **User selects payment method**
   - **Option A: Pay with coins**
     - Check balance
     - Confirm payment
     - Deduct 50 coins

   - **Option B: Watch ad**
     - Wait for ad to load
     - Watch rewarded ad
     - No coins deducted

3. **Treatment applied**
   - All stats improved by +15
   - Health recalculated
   - Health set to minimum 70%
   - State saved to storage

4. **Success feedback**
   - Alert: "✅ Checkup Complete!"
   - Message: "{pet.name} has been examined and is feeling much better!"
   - Auto-navigate back to previous screen

---

## Related Files

| File | Purpose |
|------|---------|
| `src/screens/VetScene.tsx` | Main UI component for vet screen |
| `src/context/PetContext.tsx` | Pet state management, visitVet function |
| `src/config/gameBalance.ts` | Vet costs, effects, and thresholds |
| `src/utils/petStats.ts` | Health calculation, needsVet function |
| `src/hooks/useRewardedAd.ts` | Ad integration for free treatment |

---

## Testing Scenarios

### Happy Path
1. Pet health < 60% (needs vet)
2. Player has ≥ 50 coins OR ad is ready
3. Player initiates treatment
4. Health restored to ≥ 70%
5. Stats improved by +15

### Edge Cases
1. **Insufficient funds**: Alert shown, no changes
2. **Ad not ready**: Button disabled, user informed
3. **Pet already healthy (>70%)**: Still allowed, provides stat boost
4. **Health exactly 70%**: Stats improve, health may increase above 70%
5. **Multiple stats below 50%**: All improved equally by +15

---

## Configuration Reference

From `gameBalance.ts:71-77`:

```typescript
vet: {
  cost: 50,              // Tune payment cost
  healthTarget: 70,      // Minimum health after treatment
  energy: -10,           // Energy penalty (unused)
  happiness: -5,         // Happiness penalty (unused)
  statBoost: 10,         // Stat improvement (unused - hardcoded as 15)
}
```

**Note:** The `energy`, `happiness`, and `statBoost` values in config are currently not used by the implementation. The code uses a hardcoded value of 15 for stat improvements.

---

## Summary

The vet system provides a crucial health restoration mechanic with flexible payment options (coins or ads). It works by:
1. Improving all underlying stats (+15 each)
2. Recalculating health from improved stats
3. Guaranteeing minimum 70% health
4. Providing visual feedback through color-coded urgency levels

The system is designed to help players maintain pet health while offering monetization through either in-game currency or ad watching.
