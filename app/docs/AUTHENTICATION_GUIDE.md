# Authentication Guide for Lilly's Box

## Overview

The Lilly's Box now includes a complete authentication system with Google OAuth integration and guest mode support. This guide explains how the authentication system works and how to use it in your code.

## Table of Contents

1. [Architecture](#architecture)
2. [User Types](#user-types)
3. [Using the Auth System](#using-the-auth-system)
4. [Data Isolation](#data-isolation)
5. [Navigation Flow](#navigation-flow)
6. [Setup Instructions](#setup-instructions)
7. [API Reference](#api-reference)
8. [Troubleshooting](#troubleshooting)

---

## Architecture

### Components

The authentication system consists of several interconnected components:

```
┌─────────────────────────────────────────────┐
│             App.tsx                         │
│         (Root Component)                    │
└────────────────┬────────────────────────────┘
                 │
        ┌────────▼─────────┐
        │  AuthProvider    │
        │ (Global State)   │
        └────────┬─────────┘
                 │
        ┌────────▼────────────────┐
        │   AppNavigator          │
        │ (Conditional Routing)   │
        └────────┬────────────────┘
                 │
        ┌────────┴────────┐
        │                 │
    ┌───▼────┐      ┌────▼──────┐
    │ Login  │      │ Main App   │
    │ Screen │      │  Screens   │
    └────────┘      └────────────┘
```

### Key Files

| File | Purpose |
|------|---------|
| `src/context/AuthContext.tsx` | Global authentication state and logic |
| `src/utils/authStorage.ts` | Persist auth state to AsyncStorage |
| `src/screens/LoginScreen.tsx` | User authentication interface |
| `App.tsx` | Provider wrapper and navigation setup |
| `app.config.js` | Google Sign-In configuration |

---

## User Types

### 1. Authenticated User (Google Sign-In)

**Properties:**
- Has valid Google account credentials
- User ID from Google
- Email and name available
- Profile photo may be available
- Auth state persists across app restarts

**Data:**
- Pet data stored with key: `@pet_care_game:pet:{userId}`
- Auth state stored in: `@pet_care_game:auth_state`

### 2. Guest User

**Properties:**
- No Google account required
- Anonymous user session
- Can be upgraded to authenticated user later
- Local data only (not synced)

**Data:**
- Pet data stored with key: `@pet_care_game:pet:guest`
- Guest status stored in auth state

---

## Using the Auth System

### Accessing Auth Context

In any component, use the `useAuth` hook:

```typescript
import { useAuth } from '../context/AuthContext';

export const MyComponent: React.FC = () => {
  const { user, isGuest, loading, error, signIn, signOut, playAsGuest } = useAuth();

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <View>
      {user && <Text>Welcome, {user.name}</Text>}
      {isGuest && <Text>Playing as Guest</Text>}
    </View>
  );
};
```

### Auth State Object

```typescript
interface AuthContextType {
  user: UserInfo | null;        // Current user or null
  isGuest: boolean;             // True if in guest mode
  loading: boolean;             // True during auth operations
  error: string | null;         // Error message if sign-in failed
  signIn: () => Promise<void>;  // Trigger Google Sign-In
  signOut: () => Promise<void>; // Sign out from Google
  playAsGuest: () => Promise<void>; // Enable guest mode
}

interface UserInfo {
  id: string;                   // Unique Google user ID
  email: string;               // User's email
  name: string;                // Display name
  photo?: string;              // Profile photo URL
}
```

### Example: Conditional Rendering

```typescript
import { useAuth } from '../context/AuthContext';

export const MenuHeader: React.FC = () => {
  const { user, isGuest, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  return (
    <View style={styles.header}>
      {user && (
        <>
          <Text>{user.name}</Text>
          <TouchableOpacity onPress={handleSignOut}>
            <Text>Sign Out</Text>
          </TouchableOpacity>
        </>
      )}
      {isGuest && (
        <Text>Guest Mode</Text>
      )}
    </View>
  );
};
```

---

## Data Isolation

### Multi-User Storage

Pet data is isolated per user using namespaced AsyncStorage keys:

```typescript
// For authenticated users
@pet_care_game:pet:{userId}

// For guest users
@pet_care_game:pet:guest
```

### How PetContext Handles It

```typescript
const { user, isGuest } = useAuth();

// Generate userId for storage
const userId = user?.id || (isGuest ? 'guest' : undefined);

// Load pet for current user
useEffect(() => {
  loadPet(userId).then((loadedPet) => {
    setPet(loadedPet);
  });
}, [userId]);

// Save pet for current user
const savePetData = (pet: Pet) => {
  savePet(pet, userId);
};
```

### Scenario: User Switching

```
1. User A signed in
   └─ Loads pet from: @pet_care_game:pet:{userA_id}
   └─ Shows User A's pet

2. User A signs out
   └─ Auth state cleared
   └─ PetContext resets

3. User B signs in
   └─ Loads pet from: @pet_care_game:pet:{userB_id}
   └─ Shows User B's pet (or empty if first time)
```

---

## Navigation Flow

### Authentication-Based Navigation

The app shows different screens based on auth state:

```typescript
// In AppNavigator.tsx
const { user, isGuest } = useAuth();
const isAuthenticated = user !== null || isGuest;

{isAuthenticated ? (
  // Show main app screens
  <Stack.Navigator initialRouteName="Menu">
    <Stack.Screen name="Menu" component={MenuScreen} />
    <Stack.Screen name="Home" component={HomeScreen} />
    {/* ... other screens */}
  </Stack.Navigator>
) : (
  // Show login screen
  <Stack.Navigator initialRouteName="Login">
    <Stack.Screen name="Login" component={LoginScreen} />
  </Stack.Navigator>
)}
```

### User Journey

```
App Start
    │
    ├─→ AuthContext initializes
    │   ├─→ Restores saved auth state
    │   └─→ Sets loading = false
    │
    ├─→ AppNavigator checks auth state
    │
    ├─→ If NOT authenticated
    │   └─→ Show LoginScreen
    │       ├─→ User clicks "Sign in with Google"
    │       │   └─→ Google Sign-In flow
    │       │   └─→ Auth state saved
    │       │   └─→ Navigate to Menu
    │       │
    │       └─→ User clicks "Play as Guest"
    │           └─→ Set isGuest = true
    │           └─→ Navigate to Menu
    │
    └─→ If authenticated
        └─→ Show MenuScreen
            ├─→ Display user name in header
            ├─→ Show "Sign Out" button
            └─→ Allow access to game
```

---

## Setup Instructions

### For Developers

1. **Install Dependencies**
   ```bash
   pnpm install
   npx expo install expo-dev-client
   ```

2. **Configure Web Client ID**
   - Go to `src/context/AuthContext.tsx`
   - Replace `YOUR_WEB_CLIENT_ID` with your actual Web Client ID from Google Cloud Console
   ```typescript
   await GoogleSignin.configure({
     webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
     // ...
   });
   ```

3. **For Local Testing**
   - Use guest mode to test without Google account
   - Google Sign-In requires either:
     - Physical device with Google Play Services
     - Android emulator with Google APIs image
     - Real Google account

### For End Users

See [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md) for complete setup instructions.

---

## API Reference

### AuthContext Methods

#### `signIn()`
```typescript
const { signIn } = useAuth();

try {
  await signIn();
  // User signed in successfully
  // Navigation automatically updates
} catch (error) {
  // Handle sign-in error
}
```

#### `signOut()`
```typescript
const { signOut } = useAuth();

try {
  await signOut();
  // User signed out
  // Pet data cleared for this session
  // Navigation returns to login screen
} catch (error) {
  // Handle sign-out error
}
```

#### `playAsGuest()`
```typescript
const { playAsGuest } = useAuth();

try {
  await playAsGuest();
  // Guest mode enabled
  // Can play with local storage only
} catch (error) {
  // Handle guest mode error
}
```

### Auth Storage Utilities

```typescript
import { saveAuthState, loadAuthState, clearAuthState } from '../utils/authStorage';

// Save auth state (automatically done by AuthContext)
await saveAuthState(user, isGuest);

// Load auth state (automatically done on app start)
const state = await loadAuthState();

// Clear auth state
await clearAuthState();
```

---

## Troubleshooting

### "Google Play Services not available"

**Cause**: Android emulator doesn't have Google Play Services

**Solution**:
- Use an emulator image with Google APIs
- Use a physical device
- Test in guest mode on emulator

### "Invalid Client" or "Sign in failed"

**Cause**: Wrong Web Client ID or network issues

**Solution**:
- Verify Web Client ID in `AuthContext.tsx`
- Check internet connection
- Try again after a few seconds

### "User data not persisting"

**Cause**: AsyncStorage not working or storage keys incorrect

**Solution**:
- Check if phone has storage space
- Verify storage files aren't in `.gitignore`
- Test on physical device if using emulator

### "Multiple users not isolated"

**Cause**: userId not being passed to storage functions

**Solution**:
- Ensure `PetContext` has `useAuth()` hook
- Check that `userId` is being passed to `savePet()` and `loadPet()`
- Verify storage keys include user ID

### "Sign out not working"

**Cause**: Google Sign-In not initialized or error during signOut

**Solution**:
- Check if Google Sign-In initialized successfully
- Verify network connection
- Check console for error messages
- Try again after a delay

---

## Best Practices

### 1. Always Check Loading State

```typescript
const { loading, user, isGuest } = useAuth();

if (loading) {
  return <LoadingSpinner />;
}

// Safe to use user/isGuest here
```

### 2. Handle Errors Gracefully

```typescript
const handleSignIn = async () => {
  try {
    await signIn();
  } catch (error) {
    Alert.alert('Sign In Failed', 'Please try again.');
  }
};
```

### 3. Pass userId to Storage Functions

```typescript
// ✅ Correct
const userId = user?.id || (isGuest ? 'guest' : undefined);
await savePet(pet, userId);

// ❌ Wrong - will lose data for other users
await savePet(pet);
```

### 4. Respect Auth State in Navigation

```typescript
// ✅ Correct - use conditional navigation
const isAuthenticated = user || isGuest;

// ❌ Wrong - allows access to protected screens
{/* Always show game screens */}
```

---

## Security Considerations

1. **Configuration Files**: Never commit `google-services.json` or `GoogleService-Info.plist`
2. **Web Client ID**: Don't hardcode in production (use environment variables)
3. **Token Management**: SDK handles tokens automatically
4. **Data Privacy**: Each user's data is isolated
5. **GDPR Compliance**: Ensure privacy policy covers Google OAuth

---

## Related Documentation

- [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md) - User setup guide
- [OAUTH_PLAN.md](./OAUTH_PLAN.md) - Implementation plan
- [FOLDER_STRUCTURE.md](../FOLDER_STRUCTURE.md) - Project structure
- [README.md](../README.md) - Project overview

---

**Last Updated**: 2026-01-22
**Version**: 1.0
**Status**: Complete
