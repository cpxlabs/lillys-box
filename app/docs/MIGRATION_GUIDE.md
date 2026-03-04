# Migration Guide: OAuth Implementation

This guide helps developers understand the changes made for OAuth authentication implementation and how to adapt existing code if needed.

## Overview

The Lilly's Box now includes Google OAuth authentication with multi-user support. This guide explains what changed and how to update your code if necessary.

## What Changed

### New Files Added

1. **`src/context/AuthContext.tsx`** - Global authentication state management
2. **`src/screens/LoginScreen.tsx`** - Login UI with Google Sign-In button
3. **`src/utils/authStorage.ts`** - Auth state persistence utilities
4. **`docs/GOOGLE_OAUTH_SETUP.md`** - User setup guide
5. **`docs/AUTHENTICATION_GUIDE.md`** - Developer authentication guide
6. **`docs/API_REFERENCE.md`** - API documentation
7. **Configuration files** (placeholders in root):
   - `google-services.json` (Android)
   - `GoogleService-Info.plist` (iOS)

### Modified Files

| File | Changes | Impact |
|------|---------|--------|
| `App.tsx` | Added AuthProvider wrapper | Auth available globally |
| `app.config.js` | Added Google Sign-In plugin config | Native build support |
| `src/context/PetContext.tsx` | Added useAuth, userId-based storage | Per-user pet data |
| `src/utils/storage.ts` | Added userId parameter to functions | Storage keys include user ID |
| `src/screens/MenuScreen.tsx` | Added user info header, sign-out button | User identification UI |
| `.gitignore` | Added config files | Secrets protected |
| `README.md` | Added OAuth section | Updated documentation |

---

## Breaking Changes

### ⚠️ Storage Keys Changed

**Before:**
```typescript
const PET_STORAGE_KEY = '@pet_care_game:pet';
await AsyncStorage.setItem(PET_STORAGE_KEY, petData);
```

**After:**
```typescript
const storageKey = `@pet_care_game:pet:${userId}`;
await AsyncStorage.setItem(storageKey, petData);

// Where userId is:
// - User's Google ID for authenticated users
// - 'guest' for guest users
// - undefined defaults to 'guest'
```

**Migration:**
- Existing guest data automatically found under new key
- No manual migration needed for most users
- Data persists across updates

### ⚠️ Storage Function Signatures Changed

**Before:**
```typescript
export const savePet = async (pet: Pet): Promise<void>
export const loadPet = async (): Promise<Pet | null>
export const deletePet = async (): Promise<void>
```

**After:**
```typescript
export const savePet = async (pet: Pet, userId?: string): Promise<void>
export const loadPet = async (userId?: string): Promise<Pet | null>
export const deletePet = async (userId?: string): Promise<void>
```

**Migration:**
- Old calls still work (defaults to 'guest')
- Pass userId for multi-user support
- Update PetContext to pass userId

---

## Code Migration Guide

### If You're Using PetContext Directly

**Before:**
```typescript
import { usePet } from '../context/PetContext';

const MyScreen = () => {
  const { pet, createPet, feed } = usePet();
  // Works without any changes
};
```

**After:**
```typescript
// Code unchanged - PetContext handles userId internally
import { usePet } from '../context/PetContext';

const MyScreen = () => {
  const { pet, createPet, feed } = usePet();
  // Works the same - userId automatically managed
};
```

**No changes needed** - PetContext is backward compatible.

---

### If You're Using Storage Utilities Directly

**Before:**
```typescript
import { savePet, loadPet } from '../utils/storage';

// Save pet
await savePet(myPet);

// Load pet
const pet = await loadPet();
```

**After - To Support Multiple Users:**
```typescript
import { savePet, loadPet } from '../utils/storage';
import { useAuth } from '../context/AuthContext';

const MyComponent = () => {
  const { user, isGuest } = useAuth();
  const userId = user?.id || (isGuest ? 'guest' : undefined);

  // Save pet for current user
  await savePet(myPet, userId);

  // Load pet for current user
  const pet = await loadPet(userId);
};
```

**Backward Compatibility:**
- Old code still works without userId parameter
- Defaults to 'guest' for guest users
- Recommend updating to pass userId

---

### If You're Reading Auth State

**New in This Version:**
```typescript
import { useAuth } from '../context/AuthContext';

const MyComponent = () => {
  // Get auth state
  const { user, isGuest, loading, error } = useAuth();

  // Perform auth actions
  const handleSignIn = async () => {
    try {
      const { signIn } = useAuth();
      await signIn();
    } catch (error) {
      console.error(error);
    }
  };
};
```

---

## Navigation Changes

### Before OAuth

```typescript
// App.tsx - No auth check
const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Menu">
      <Stack.Screen name="Menu" component={MenuScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      {/* ... */}
    </Stack.Navigator>
  );
};
```

### After OAuth

```typescript
// App.tsx - Auth-based routing
const AppNavigator = () => {
  const { user, isGuest } = useAuth();
  const isAuthenticated = user !== null || isGuest;

  return (
    <Stack.Navigator
      initialRouteName={isAuthenticated ? 'Menu' : 'Login'}
    >
      {!isAuthenticated ? (
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : (
        <>
          <Stack.Screen name="Menu" component={MenuScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          {/* ... */}
        </>
      )}
    </Stack.Navigator>
  );
};
```

**Impact:**
- Unauthenticated users see LoginScreen first
- Authenticated users go straight to MenuScreen
- Automatic redirection on login/logout

---

## Configuration Changes

### app.config.js

**Before:**
```javascript
module.exports = () => {
  return {
    expo: {
      // ... existing config
      plugins: [] // No plugins or AdMob only
    }
  };
};
```

**After:**
```javascript
module.exports = () => {
  return {
    expo: {
      // ... existing config
      ios: {
        bundleIdentifier: "com.az1nn.petcaregame",
        googleServicesFile: "./GoogleService-Info.plist",
      },
      android: {
        package: "com.az1nn.petcaregame",
        googleServicesFile: "./google-services.json",
      },
      plugins: [
        "@react-native-google-signin/google-signin"
      ]
    }
  };
};
```

**Action Required:**
- Download and place configuration files
- Update Web Client ID in AuthContext

---

## Testing Updates

### PetContext Tests

**Before:**
```typescript
import { PetProvider } from '../context/PetContext';

it('should create pet', async () => {
  render(
    <PetProvider>
      <TestComponent />
    </PetProvider>
  );
  // Test code
});
```

**After:**
```typescript
import { AuthProvider } from '../context/AuthContext';
import { PetProvider } from '../context/PetContext';

it('should create pet', async () => {
  render(
    <AuthProvider>
      <PetProvider>
        <TestComponent />
      </PetProvider>
    </AuthProvider>
  );
  // Test code
});
```

**Why:** PetContext now uses AuthContext internally.

---

### Storage Tests

**Before:**
```typescript
import { savePet, loadPet } from '../utils/storage';

it('should save and load pet', async () => {
  const pet = createTestPet();
  await savePet(pet);
  const loaded = await loadPet();
  expect(loaded).toEqual(pet);
});
```

**After:**
```typescript
import { savePet, loadPet } from '../utils/storage';

it('should save and load pet', async () => {
  const pet = createTestPet();
  const userId = 'test-user-123';

  // Pass userId for clarity
  await savePet(pet, userId);
  const loaded = await loadPet(userId);
  expect(loaded).toEqual(pet);
});
```

---

## Environment Setup

### Install Dependencies

```bash
pnpm install
npx expo install expo-dev-client
```

### Configuration Files

1. **Create Google Cloud Project**
   - Visit https://console.cloud.google.com/
   - Create new project
   - Enable Google Sign-In API

2. **Generate Credentials**
   - Android: Create OAuth 2.0 Client ID (Android)
   - iOS: Create OAuth 2.0 Client ID (iOS)
   - Web: Create OAuth 2.0 Client ID (Web application)

3. **Download Files**
   - Download `google-services.json` → Place in project root
   - Download `GoogleService-Info.plist` → Place in project root

4. **Update Code**
   - Open `src/context/AuthContext.tsx`
   - Replace `YOUR_WEB_CLIENT_ID` with your Web Client ID

5. **Build**
   ```bash
   npx expo prebuild --clean
   pnpm android
   # or
   pnpm ios
   ```

---

## Data Migration

### Existing Guest Data

**Automatic:** Guest pet data stored at `@pet_care_game:pet` is accessible at `@pet_care_game:pet:guest`

No manual action needed - the system handles it automatically.

### Upgrading Guest to Authenticated

```typescript
// Guest plays and creates pet
await playAsGuest();
// Pet stored as: @pet_care_game:pet:guest

// Later, user signs in
await signIn();
// userId changes to Google ID
// New storage key: @pet_care_game:pet:{googleId}

// Guest data is still accessible at: @pet_care_game:pet:guest
// User gets fresh start with new account
```

**Note:** Guest and authenticated data are separate. User doesn't inherit guest data when signing in.

---

## Rollback Procedure

If you need to revert OAuth changes:

```bash
# Check the previous commit before OAuth
git log --oneline

# Reset to previous commit
git reset --hard <commit-hash>

# Or create a new branch from previous state
git checkout -b pre-oauth <commit-hash>
```

**Data:** Guest data at `@pet_care_game:pet:guest` will still be there - migration back is not automatic.

---

## Common Issues After Migration

### Issue 1: "useAuth must be used within AuthProvider"

**Cause:** Component using `useAuth` but not wrapped with `AuthProvider`

**Solution:**
```typescript
// ✅ Correct
export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}

// ❌ Wrong
export default function App() {
  const { user } = useAuth(); // Error - no provider
  return <AppNavigator />;
}
```

### Issue 2: Pet data lost after update

**Cause:** Storage key changed but old data not migrated

**Solution:**
```typescript
// Data at '@pet_care_game:pet:guest' should still work
// If lost, check AsyncStorage for old key: '@pet_care_game:pet'
// If found there, that's the issue - the key changed
```

### Issue 3: "Cannot read property 'id' of undefined"

**Cause:** Using userId before auth is loaded

**Solution:**
```typescript
// ✅ Check loading state
const { loading, user } = useAuth();
if (loading) return <Spinner />;

// ❌ Don't use without checking
const userId = user.id; // Could be undefined
```

---

## Verification Checklist

After updating, verify:

- [ ] App builds without errors
- [ ] AuthProvider wraps entire app
- [ ] LoginScreen shows on first app open
- [ ] Google Sign-In button works (or use guest mode)
- [ ] Guest mode allows playing
- [ ] Pet data persists for guest
- [ ] Sign-out button appears in menu
- [ ] Signing out returns to LoginScreen
- [ ] Multiple users have separate data
- [ ] Tests pass (if applicable)

---

## Support Resources

- **OAuth Setup:** [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md)
- **Auth Guide:** [AUTHENTICATION_GUIDE.md](./AUTHENTICATION_GUIDE.md)
- **API Reference:** [API_REFERENCE.md](./API_REFERENCE.md)
- **Plan Document:** [OAUTH_PLAN.md](./OAUTH_PLAN.md)

---

**Last Updated**: 2026-01-22
**Version**: 1.0
**Status**: Complete
