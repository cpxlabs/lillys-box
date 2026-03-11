# API Reference - Lilly's Box

This document provides detailed API documentation for the Lilly's Box authentication and storage systems.

## Table of Contents

1. [AuthContext API](#authcontext-api)
2. [Auth Storage API](#auth-storage-api)
3. [Pet Storage API](#pet-storage-api)
4. [Types & Interfaces](#types--interfaces)
5. [Hooks](#hooks)

---

## AuthContext API

### Module: `src/context/AuthContext.tsx`

#### `AuthProvider` Component

Wraps the application to provide authentication state globally.

**Props:**
```typescript
interface AuthProviderProps {
  children: ReactNode;
}
```

**Usage:**
```typescript
import { AuthProvider } from './src/context/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      {/* Your app components */}
    </AuthProvider>
  );
}
```

**Initialization:**
- Initializes Google Sign-In on mount
- Restores auth state from AsyncStorage
- Sets loading = false when ready
- Handles errors during initialization

---

#### `useAuth()` Hook

Returns the authentication context and methods.

**Returns:**
```typescript
interface AuthContextType {
  user: UserInfo | null;
  isGuest: boolean;
  loading: boolean;
  error: string | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  playAsGuest: () => Promise<void>;
}
```

**Example:**
```typescript
import { useAuth } from '../context/AuthContext';

const MyComponent = () => {
  const { user, isGuest, signIn, signOut } = useAuth();

  return (
    <View>
      {user && <Text>Hello, {user.name}</Text>}
      {isGuest && <Text>Guest Mode</Text>}
    </View>
  );
};
```

**Throws:**
- `Error`: If used outside `AuthProvider`

---

### Methods

#### `signIn(): Promise<void>`

Initiates Google Sign-In flow.

**Behavior:**
1. Checks if already signed in (silent sign-in)
2. If not, triggers interactive sign-in flow
3. Saves auth state to AsyncStorage
4. Updates user context

**Errors:**
- `statusCodes.SIGN_IN_CANCELLED` - User cancelled sign-in
- `statusCodes.IN_PROGRESS` - Sign-in already in progress
- `statusCodes.PLAY_SERVICES_NOT_AVAILABLE` - Google Play Services not available
- Generic error - Network or other issues

**Example:**
```typescript
const handleLogin = async () => {
  try {
    await signIn();
    // User signed in, navigation updates automatically
  } catch (error) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      console.log('User cancelled sign-in');
    } else {
      console.error('Sign in error:', error);
    }
  }
};
```

---

#### `signOut(): Promise<void>`

Signs out from Google and clears auth state.

**Behavior:**
1. Calls Google Sign-In signOut
2. Clears user data
3. Removes auth state from AsyncStorage
4. Navigation returns to LoginScreen

**Errors:**
- Network errors during sign-out
- AsyncStorage errors

**Example:**
```typescript
const handleLogout = async () => {
  try {
    await signOut();
    // User signed out, navigation updates automatically
  } catch (error) {
    Alert.alert('Error', 'Failed to sign out');
  }
};
```

---

#### `playAsGuest(): Promise<void>`

Enables guest mode without authentication.

**Behavior:**
1. Sets isGuest = true
2. Sets user = null
3. Saves guest state to AsyncStorage
4. Navigation goes to MenuScreen

**Notes:**
- Guest data is stored under 'guest' user ID
- Guest can upgrade to authenticated user later
- Data remains local (not synced)

**Example:**
```typescript
const handleGuestMode = async () => {
  try {
    await playAsGuest();
    // User in guest mode, navigation updates automatically
  } catch (error) {
    console.error('Guest mode error:', error);
  }
};
```

---

## Auth Storage API

### Module: `src/utils/authStorage.ts`

Utilities for persisting authentication state.

---

#### `saveAuthState(user: UserInfo | null, isGuest: boolean): Promise<void>`

Saves authentication state to AsyncStorage.

**Parameters:**
```typescript
user: UserInfo | null      // User object or null
isGuest: boolean           // Whether in guest mode
```

**Storage Key:** `@lillys_box:auth_state`

**Stored Data:**
```typescript
{
  user: {
    id: string;
    email: string;
    name: string;
    photo?: string;
  } | null,
  isGuest: boolean;
}
```

**Throws:**
- AsyncStorage errors

**Example:**
```typescript
import { saveAuthState } from '../utils/authStorage';

const user = {
  id: 'user123',
  email: 'user@example.com',
  name: 'John Doe',
  photo: 'https://...'
};

await saveAuthState(user, false);
```

---

#### `loadAuthState(): Promise<AuthState | null>`

Loads authentication state from AsyncStorage.

**Returns:**
```typescript
interface AuthState {
  user: UserInfo | null;
  isGuest: boolean;
} | null
```

**Returns null if:**
- No auth state saved
- Storage is empty

**Throws:**
- AsyncStorage errors

**Example:**
```typescript
import { loadAuthState } from '../utils/authStorage';

const authState = await loadAuthState();
if (authState) {
  console.log('User:', authState.user);
  console.log('Guest:', authState.isGuest);
}
```

---

#### `clearAuthState(): Promise<void>`

Clears authentication state from AsyncStorage.

**Behavior:**
- Removes the auth state entry
- Data is permanently deleted

**Throws:**
- AsyncStorage errors

**Example:**
```typescript
import { clearAuthState } from '../utils/authStorage';

await clearAuthState();
```

---

## Pet Storage API

### Module: `src/utils/storage.ts`

Utilities for storing and retrieving pet data with multi-user support.

---

#### `savePet(pet: Pet, userId?: string): Promise<void>`

Saves pet data to AsyncStorage with optional user ID.

**Parameters:**
```typescript
pet: Pet          // Pet object to save
userId?: string   // User ID for namespacing (default: 'guest')
```

**Storage Key:** `@lillys_box:pet:{userId}`

**Behavior:**
- Updates lastUpdated timestamp
- Serializes pet to JSON
- Saves to AsyncStorage

**Throws:**
- AsyncStorage errors
- JSON serialization errors

**Example:**
```typescript
import { savePet } from '../utils/storage';

const pet: Pet = {
  id: 'pet123',
  name: 'Fluffy',
  type: 'cat',
  hunger: 50,
  // ... other properties
};

// For specific user
await savePet(pet, 'user123');

// For guest
await savePet(pet, 'guest');

// Using default (guest if userId undefined)
await savePet(pet);
```

---

#### `loadPet(userId?: string): Promise<Pet | null>`

Loads pet data from AsyncStorage.

**Parameters:**
```typescript
userId?: string   // User ID to load for (default: 'guest')
```

**Returns:**
- `Pet` object if found
- `null` if not found or empty

**Behavior:**
1. Retrieves from AsyncStorage
2. Parses JSON
3. Applies migrations
4. Validates data
5. Repairs if invalid

**Throws:**
- AsyncStorage errors

**Example:**
```typescript
import { loadPet } from '../utils/storage';

// Load specific user's pet
const userPet = await loadPet('user123');

// Load guest pet
const guestPet = await loadPet('guest');

// Load default (guest)
const pet = await loadPet();

if (pet) {
  console.log('Pet name:', pet.name);
} else {
  console.log('No pet found');
}
```

---

#### `deletePet(userId?: string): Promise<void>`

Deletes pet data from AsyncStorage.

**Parameters:**
```typescript
userId?: string   // User ID to delete for (default: 'guest')
```

**Behavior:**
- Removes the pet entry
- Data is permanently deleted

**Throws:**
- AsyncStorage errors

**Example:**
```typescript
import { deletePet } from '../utils/storage';

// Delete specific user's pet
await deletePet('user123');

// Delete guest pet
await deletePet('guest');
```

---

## Types & Interfaces

### `UserInfo`

User information from Google Sign-In.

```typescript
interface UserInfo {
  /**
   * Unique identifier from Google
   * @example "110169685...892"
   */
  id: string;

  /**
   * User's email address
   * @example "user@example.com"
   */
  email: string;

  /**
   * Display name
   * @example "John Doe"
   */
  name: string;

  /**
   * Profile photo URL (optional)
   * @example "https://lh3.googleusercontent.com/a-/..."
   */
  photo?: string;
}
```

---

### `AuthState`

Persisted authentication state.

```typescript
interface AuthState {
  user: UserInfo | null;
  isGuest: boolean;
}
```

---

### `AuthContextType`

The shape of the auth context.

```typescript
interface AuthContextType {
  /**
   * Current authenticated user, or null if not authenticated
   */
  user: UserInfo | null;

  /**
   * Whether user is in guest mode
   */
  isGuest: boolean;

  /**
   * True while performing auth operations
   */
  loading: boolean;

  /**
   * Error message if auth operation failed
   */
  error: string | null;

  /**
   * Trigger Google Sign-In flow
   */
  signIn: () => Promise<void>;

  /**
   * Sign out from Google
   */
  signOut: () => Promise<void>;

  /**
   * Enable guest mode
   */
  playAsGuest: () => Promise<void>;
}
```

---

### `Pet`

Pet data structure (existing).

```typescript
interface Pet {
  id: string;
  name: string;
  type: 'cat' | 'dog';
  color: string;
  gender: 'male' | 'female';
  hunger: number;        // 0-100
  hygiene: number;       // 0-100
  energy: number;        // 0-100
  happiness: number;     // 0-100
  health: number;        // 0-100
  money: number;
  clothes: {
    head: string | null;
    eyes: string | null;
    torso: string | null;
    paws: string | null;
  };
  createdAt: number;
  lastUpdated: number;
  isSleeping: boolean;
  sleepStartTime?: number;
}
```

---

## Hooks

### `useAuth()`

**Location:** `src/context/AuthContext.tsx`

**Returns:** `AuthContextType`

**Throws:** `Error` if used outside `AuthProvider`

**Usage:**
```typescript
import { useAuth } from '../context/AuthContext';

const component = () => {
  const { user, isGuest, loading } = useAuth();
  // Use auth state
};
```

---

## Error Codes

Google Sign-In error codes:

```typescript
statusCodes.SIGN_IN_CANCELLED = '-4'     // User cancelled
statusCodes.IN_PROGRESS = '-5'           // Sign-in in progress
statusCodes.PLAY_SERVICES_NOT_AVAILABLE = '-6'  // Google Play Services not available
statusCodes.SIGN_IN_REQUIRED = '12501'   // Sign-in required
statusCodes.NETWORK_ERROR = '-2'         // Network error
```

---

## Common Patterns

### Pattern 1: Check Auth State

```typescript
const { user, isGuest } = useAuth();
const isAuthenticated = user !== null || isGuest;

if (isAuthenticated) {
  // Show authenticated UI
} else {
  // Show login UI
}
```

### Pattern 2: Conditional Rendering

```typescript
const { user, isGuest, loading } = useAuth();

if (loading) return <Spinner />;

return (
  <>
    {user && <AuthenticatedView user={user} />}
    {isGuest && <GuestView />}
    {!user && !isGuest && <LoginView />}
  </>
);
```

### Pattern 3: Per-User Data

```typescript
const { user, isGuest } = useAuth();
const userId = user?.id || (isGuest ? 'guest' : undefined);

useEffect(() => {
  loadPet(userId).then(setPet);
}, [userId]);
```

### Pattern 4: Error Handling

```typescript
const { error, signIn } = useAuth();

const handleSignIn = async () => {
  try {
    await signIn();
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    Alert.alert('Sign In Failed', message);
  }
};
```

---

## Additional Hooks

### `useGameBestScore(storageKey: string)`

**Location:** `src/hooks/useGameBestScore.ts`

Shared hook for per-user best score persistence across all 36 game contexts. Eliminates ~60 lines of duplicated AsyncStorage logic per context.

**Returns:**
```typescript
[bestScore: number, updateBestScore: (newScore: number) => void]
```

**Example:**
```typescript
import { useGameBestScore } from '../hooks/useGameBestScore';

const MyGameContext = () => {
  const [bestScore, updateBestScore] = useGameBestScore(`my_game:${userId}`);

  const onGameEnd = (score: number) => {
    updateBestScore(score); // Only updates if score > bestScore
  };
};
```

---

### `useAudio()`

**Location:** `src/hooks/useAudio.ts`

Hook for audio playback (sound effects and background music) using expo-av.

**Returns:**
```typescript
{
  playSound: (soundName: string) => Promise<void>;
  playMusic: (musicName: string) => Promise<void>;
  stopMusic: () => Promise<void>;
  isMusicPlaying: boolean;
}
```

---

### `usePetActions()`

**Location:** `src/hooks/usePetActions.ts`

Unified hook for all pet actions (feed, play, bathe, sleep, cuddle, exercise, vet). Manages animation states, validation, rewards, and toast notifications.

**Returns:**
```typescript
{
  performAction: (action: PetAction) => void;
  isAnimating: boolean;
  currentAnimation: string | null;
  canPerformAction: (action: PetAction) => boolean;
}
```

---

## Performance Considerations

1. **Auth State Persistence**: Read from AsyncStorage on app start (happens once)
2. **Storage Keys**: Use user ID to namespace data (prevents data collisions)
3. **Debouncing**: Pet context debounces saves (max once per second)
4. **Loading State**: Always check `loading` before using auth state

---

## Backward Compatibility

- Existing guest data stored as `@lillys_box:pet:guest` (compatible)
- Old format `@lillys_box:pet` can be migrated if needed
- Auth state is new, no backward compat issues

---

**Last Updated**: 2026-03-11
**Version**: 1.2
**Status**: Complete
