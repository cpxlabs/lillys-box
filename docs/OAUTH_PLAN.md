# Google OAuth Implementation Plan

**Status**: ✅ **COMPLETED** (2026-01-21)

This document outlines the plan to implement Google OAuth login in the Pet Care Game app.

## Overview

The goal is to integrate Google Sign-In, allowing users to authenticate with their Google accounts. This involves setting up the authentication context, adding a login screen, and integrating it with the existing navigation and data persistence layers.

## Prerequisites (User Responsibility)

To fully enable Google Sign-In for native builds (Android/iOS), you must:

1.  **Google Cloud Project**: Create a project in the [Google Cloud Console](https://console.cloud.google.com/).
2.  **Credentials**: Create OAuth 2.0 Client IDs for Android and iOS.
3.  **Configuration Files**:
    *   Download `google-services.json` (Android) and place it in the project root.
    *   Download `GoogleService-Info.plist` (iOS) and place it in the project root.
4.  **SHA-1 Fingerprint**: Add your keystore's SHA-1 fingerprint to the Firebase/Google Cloud Console for the Android client.

## Implementation Steps

### 1. Dependencies

Install the required packages for Google Sign-In.

```bash
pnpm add @react-native-google-signin/google-signin
npx expo install expo-dev-client
```

*Note: `@react-native-google-signin/google-signin` is the recommended library for React Native apps.*

### 2. Configuration (`app.config.js`)

Update `app.config.js` to include the Google Sign-In plugin and configure build properties.

```javascript
module.exports = () => {
  return {
    expo: {
      // ... existing config
      ios: {
        bundleIdentifier: "com.az1nn.petcaregame", // Ensure this matches your Google Console
        googleServicesFile: "./GoogleService-Info.plist",
      },
      android: {
        package: "com.az1nn.petcaregame", // Ensure this matches your Google Console
        googleServicesFile: "./google-services.json",
      },
      plugins: [
        "@react-native-google-signin/google-signin",
        // ... other plugins
      ]
    }
  };
};
```

### 3. Auth Context (`src/context/AuthContext.tsx`)

Create an `AuthContext` to manage the authentication state globally.

*   **State**: `user` (null | UserInfo), `loading` (boolean), `isGuest` (boolean).
*   **Actions**:
    *   `signIn()`: Triggers Google Sign-In flow.
    *   `signOut()`: Signs out and clears state.
    *   `playAsGuest()`: Sets `isGuest` to true.
*   **Persistence**: Automatically checks for an existing signed-in user on app launch.

### 4. Login Screen (`src/screens/LoginScreen.tsx`)

Create a new screen that serves as the entry point for unauthenticated users.

*   **UI Elements**:
    *   App Logo / Title.
    *   "Sign in with Google" button (using standard Google branding).
    *   "Play as Guest" button.
*   **Logic**:
    *   Call `signIn()` on button press.
    *   On success, navigation automatically handles the transition (via `AppNavigator` state change).

### 5. Navigation Updates (`App.tsx` & `AppNavigator`)

Modify the navigation structure to guard access to the main game.

*   Wrap the application with `AuthProvider`.
*   Update `AppNavigator` to conditionally render screens based on auth state:
    ```tsx
    const { user, isGuest } = useAuth();

    // If not authenticated and not guest, show LoginScreen
    if (!user && !isGuest) {
      return <LoginScreen />;
    }

    // Otherwise show main stack
    return (
      <Stack.Navigator>
        <Stack.Screen name="Menu" component={MenuScreen} />
        {/* ... other screens */}
      </Stack.Navigator>
    );
    ```

### 6. Data Isolation (Recommended)

Currently, pet data is stored in `AsyncStorage` under a fixed key `@pet_care_game:pet`. To support multiple users on the same device (e.g. logging out and logging in as someone else), we should namespace the storage key.

*   Update `src/utils/storage.ts`:
    *   Accept a `userId` (or default to 'guest') to generate the key: `@pet_care_game:pet:${userId}`.
    *   Update `PetContext` to pass the current `user.id` to storage functions.

### 7. Menu Screen Integration (`src/screens/MenuScreen.tsx`)

Update the menu to reflect the user's status.

*   Display "Welcome, {user.name}" if logged in.
*   Add a "Sign Out" button (replaces "Exit" or added to settings).
*   If Guest, show "Login to save progress" (optional feature for later).

## File Structure Changes

```
src/
  context/
    AuthContext.tsx  (New)
  screens/
    LoginScreen.tsx  (New)
  utils/
    storage.ts       (Modify for multi-user support)
App.tsx              (Modify to include AuthProvider)
app.config.js        (Modify config)
```

## Testing

*   **Mocking**: Since Google Sign-In requires native device/emulator with Google Play Services, we will create a mock implementation of `AuthContext` or mock the `google-signin` library for Jest tests.
*   **Manual Testing**: Verify flow:
    1.  App Launch -> Login Screen.
    2.  Guest -> Menu -> Create Pet -> Restart App -> Data persists.
    3.  Google Login -> Menu -> Create Pet -> Logout -> Data cleared/swapped -> Login again -> Data restored.

## Detailed Implementation Plan

This section provides a step-by-step breakdown of tasks to implement the Google OAuth feature.

### Phase 1: Foundation & Dependencies

#### Task 1.1: Install Required Dependencies
```bash
pnpm add @react-native-google-signin/google-signin
npx expo install expo-dev-client
```

**Acceptance Criteria:**
- Dependencies added to package.json
- No version conflicts
- pnpm lock file updated

#### Task 1.2: Update App Configuration
**File:** `app.config.js`

**Actions:**
- Add `@react-native-google-signin/google-signin` to plugins array
- Configure iOS section with bundleIdentifier and googleServicesFile path
- Configure Android section with package name and googleServicesFile path
- Ensure bundleIdentifier and package match Google Cloud Console settings

**Acceptance Criteria:**
- Config file includes all Google Sign-In plugin settings
- Build configurations are properly structured
- No syntax errors in config

#### Task 1.3: Create Placeholder Configuration Files
**Files:**
- `google-services.json` (Android - root directory)
- `GoogleService-Info.plist` (iOS - root directory)

**Actions:**
- Create placeholder files with documentation comments
- Add to .gitignore (these contain sensitive data)
- Document in README where to obtain these files

**Acceptance Criteria:**
- Placeholder files exist with clear instructions
- Files are excluded from version control
- README updated with setup instructions

---

### Phase 2: Authentication Context & State Management

#### Task 2.1: Create AuthContext
**File:** `src/context/AuthContext.tsx`

**Actions:**
- Define TypeScript interfaces:
  - `UserInfo` (id, email, name, photo)
  - `AuthContextType` (user, loading, isGuest, signIn, signOut, playAsGuest)
- Create AuthContext with createContext
- Implement AuthProvider component with:
  - State for user, loading, isGuest
  - Initialize GoogleSignin in useEffect
  - Implement signIn function using GoogleSignin.signIn()
  - Implement signOut function using GoogleSignin.signOut()
  - Implement playAsGuest function
  - Persist auth state to AsyncStorage
  - Restore auth state on app launch
- Create useAuth hook for consuming context
- Export AuthProvider and useAuth

**Acceptance Criteria:**
- All TypeScript interfaces properly defined
- AuthContext provides all required methods
- Auth state persists across app restarts
- Error handling for sign-in failures
- Loading states properly managed
- Context can be consumed via useAuth hook

#### Task 2.2: Create Auth State Persistence
**File:** `src/utils/authStorage.ts` (new file)

**Actions:**
- Create utility functions:
  - `saveAuthState(user, isGuest)` - Save to AsyncStorage
  - `loadAuthState()` - Retrieve from AsyncStorage
  - `clearAuthState()` - Remove from AsyncStorage
- Use AsyncStorage key: `@pet_care_game:auth_state`

**Acceptance Criteria:**
- Functions properly save/load/clear auth state
- Error handling for AsyncStorage failures
- TypeScript types properly defined

---

### Phase 3: Multi-User Data Isolation

#### Task 3.1: Update Storage Utilities for Multi-User Support
**File:** `src/utils/storage.ts`

**Actions:**
- Modify storage key generation to include userId:
  - Change from `@pet_care_game:pet` to `@pet_care_game:pet:${userId}`
  - Default to 'guest' if no userId provided
- Update all storage functions to accept optional userId parameter:
  - `savePet(pet, userId?)`
  - `loadPet(userId?)`
  - `deletePet(userId?)`
- Maintain backward compatibility for existing data

**Acceptance Criteria:**
- Storage keys are namespaced by userId
- Guest users have isolated storage
- Different users can't access each other's data
- Existing guest data is preserved (migration if needed)
- All storage functions accept userId parameter

#### Task 3.2: Update PetContext to Use User-Scoped Storage
**File:** `src/context/PetContext.tsx`

**Actions:**
- Import useAuth hook
- Get current user/isGuest state from AuthContext
- Pass userId to all storage operations
- Handle user switching (clear local state on user change)
- Reload pet data when user changes

**Acceptance Criteria:**
- PetContext uses userId from AuthContext
- Pet data loads correctly for each user
- Switching users properly isolates data
- Guest users maintain separate data

---

### Phase 4: Login Screen

#### Task 4.1: Create Login Screen Component
**File:** `src/screens/LoginScreen.tsx`

**Actions:**
- Create functional component using React Native View, Text, TouchableOpacity
- Design UI layout:
  - App logo/title at top
  - "Sign in with Google" button (follow Google branding guidelines)
  - "Play as Guest" button
  - Optional: tagline or description
- Style with existing theme colors
- Import useAuth hook
- Implement button handlers:
  - Google Sign-In: call `signIn()` from AuthContext
  - Guest: call `playAsGuest()` from AuthContext
- Add loading indicator during sign-in
- Add error handling and display error messages

**Acceptance Criteria:**
- Screen is visually appealing and follows app design
- Google Sign-In button follows Google branding guidelines
- Both buttons are functional
- Loading states are visible
- Error messages are user-friendly
- Responsive layout works on different screen sizes

#### Task 4.2: Add Login Screen Assets
**Files:** `assets/` (if needed)

**Actions:**
- Add app logo if not already present
- Add Google Sign-In button assets (or use library-provided)
- Optimize image sizes for mobile

**Acceptance Criteria:**
- Assets properly added to project
- Images optimized for performance
- Assets display correctly on screen

---

### Phase 5: Navigation Integration

#### Task 5.1: Wrap App with AuthProvider
**File:** `App.tsx`

**Actions:**
- Import AuthProvider from AuthContext
- Wrap the entire app component tree with AuthProvider
- Ensure AuthProvider is outside NavigationContainer
- Order: AuthProvider > PetProvider > NavigationContainer

**Acceptance Criteria:**
- AuthProvider wraps all components
- Context is accessible throughout app
- No circular dependencies
- App still runs without errors

#### Task 5.2: Update AppNavigator for Auth-Based Routing
**File:** `src/navigation/AppNavigator.tsx`

**Actions:**
- Import useAuth hook
- Destructure user, isGuest, loading from useAuth
- Add conditional rendering logic:
  - Show loading screen/spinner while loading is true
  - Show LoginScreen if !user && !isGuest
  - Show main app navigation if user || isGuest
- Ensure smooth transitions between states

**Acceptance Criteria:**
- Navigation properly switches based on auth state
- Loading screen prevents flash of wrong screen
- LoginScreen shown to unauthenticated users
- Main app accessible after authentication or guest mode
- No navigation errors or crashes

---

### Phase 6: Menu Screen Updates

#### Task 6.1: Add User Info Display to Menu Screen
**File:** `src/screens/MenuScreen.tsx`

**Actions:**
- Import useAuth hook
- Get user and isGuest from AuthContext
- Add UI section to display:
  - User photo (if available)
  - "Welcome, {user.name}" for logged-in users
  - "Guest User" or similar for guest users
- Style user info section
- Position at top of menu or in header

**Acceptance Criteria:**
- User name displays correctly for logged-in users
- Guest users see appropriate message
- Photo displays if available
- UI is visually consistent with app design

#### Task 6.2: Add Sign Out Functionality to Menu
**File:** `src/screens/MenuScreen.tsx`

**Actions:**
- Import signOut from useAuth
- Add "Sign Out" button to menu
- Implement button handler to call signOut()
- Add confirmation dialog before signing out
- Handle loading state during sign-out
- Position button appropriately (settings section or bottom of menu)

**Acceptance Criteria:**
- Sign Out button is visible
- Confirmation dialog appears before signing out
- Sign out successfully clears auth state
- Navigation returns to LoginScreen after sign out
- No errors during sign-out process

#### Task 6.3: Add Login Prompt for Guest Users (Optional)
**File:** `src/screens/MenuScreen.tsx`

**Actions:**
- Check if isGuest is true
- Display banner or message: "Login to save progress online"
- Add button to trigger login from guest mode
- Implement handler to call signIn()

**Acceptance Criteria:**
- Banner only shows for guest users
- Login button triggers sign-in flow
- User can upgrade from guest to logged-in user
- Data migration handled if needed

---

### Phase 7: Testing & Quality Assurance

#### Task 7.1: Create Mock Auth Context for Tests
**File:** `src/context/__mocks__/AuthContext.tsx`

**Actions:**
- Create mock implementation of AuthContext
- Mock all auth functions (signIn, signOut, playAsGuest)
- Provide test utilities to set auth state
- Export mock hooks and providers

**Acceptance Criteria:**
- Mock context works in Jest tests
- All functions are mockable
- Test utilities allow state manipulation
- No dependency on native Google Sign-In

#### Task 7.2: Write Unit Tests for AuthContext
**File:** `src/context/__tests__/AuthContext.test.tsx`

**Actions:**
- Test AuthProvider initialization
- Test signIn flow (mocked)
- Test signOut flow
- Test playAsGuest flow
- Test state persistence
- Test state restoration on mount
- Test error handling

**Acceptance Criteria:**
- All tests pass
- Coverage > 80% for AuthContext
- Edge cases covered
- Error scenarios tested

#### Task 7.3: Write Unit Tests for Updated Storage
**File:** `src/utils/__tests__/storage.test.ts`

**Actions:**
- Test storage with different userIds
- Test guest user storage
- Test data isolation between users
- Test backward compatibility

**Acceptance Criteria:**
- All tests pass
- User data isolation verified
- No data leakage between users
- Guest data works correctly

#### Task 7.4: Write Integration Tests
**File:** `src/__tests__/auth-flow.test.tsx`

**Actions:**
- Test complete login flow
- Test guest flow
- Test sign-out flow
- Test navigation transitions
- Test data persistence across flows

**Acceptance Criteria:**
- All integration tests pass
- User flows work end-to-end (mocked)
- Navigation behaves correctly
- Data persists correctly

#### Task 7.5: Update Existing Tests
**Files:** Various test files

**Actions:**
- Update tests to wrap components with AuthProvider
- Mock useAuth where needed
- Fix any broken tests due to context changes
- Update snapshots if needed

**Acceptance Criteria:**
- All existing tests still pass
- No test failures due to AuthContext
- Mock data properly set up

---

### Phase 8: Documentation & Polish

#### Task 8.1: Create User Setup Guide
**File:** `docs/GOOGLE_OAUTH_SETUP.md` (new)

**Actions:**
- Document step-by-step Google Cloud Console setup
- Include screenshots or links
- Explain how to get OAuth credentials
- Document how to obtain google-services.json and GoogleService-Info.plist
- Explain SHA-1 fingerprint setup for Android
- Add troubleshooting section

**Acceptance Criteria:**
- Guide is clear and complete
- All steps documented
- Links to Google documentation included
- Common issues addressed

#### Task 8.2: Update Main README
**File:** `README.md`

**Actions:**
- Add Google OAuth feature to features list
- Link to GOOGLE_OAUTH_SETUP.md
- Update setup instructions
- Document new dependencies

**Acceptance Criteria:**
- README reflects new OAuth feature
- Setup instructions updated
- Links are correct

#### Task 8.3: Add Code Comments and Documentation
**Files:** All new and modified files

**Actions:**
- Add JSDoc comments to all public functions
- Document complex logic
- Add inline comments where needed
- Document TypeScript interfaces

**Acceptance Criteria:**
- All public APIs documented
- Complex logic explained
- Code is readable and maintainable

#### Task 8.4: Error Handling & User Feedback
**Files:** `AuthContext.tsx`, `LoginScreen.tsx`

**Actions:**
- Add user-friendly error messages for common scenarios:
  - Network errors
  - Cancelled sign-in
  - Invalid credentials
  - Google Play Services not available
- Add toast notifications or alerts
- Handle edge cases gracefully

**Acceptance Criteria:**
- All error scenarios handled
- User sees helpful error messages
- App doesn't crash on errors
- Users can retry failed operations

---

### Phase 9: Build & Deployment Preparation

#### Task 9.1: Build Development Client
```bash
npx expo prebuild
```

**Actions:**
- Run prebuild to generate native projects
- Verify native configurations
- Check that Google Sign-In plugin applied correctly

**Acceptance Criteria:**
- Android and iOS projects generated
- Native code includes Google Sign-In
- No prebuild errors

#### Task 9.2: Test on Android Emulator/Device
**Actions:**
- Add google-services.json
- Build and run on Android
- Test sign-in flow
- Test guest flow
- Test sign-out
- Verify data persistence

**Acceptance Criteria:**
- Google Sign-In works on Android
- All flows functional
- No crashes or errors

#### Task 9.3: Test on iOS Simulator/Device
**Actions:**
- Add GoogleService-Info.plist
- Build and run on iOS
- Test sign-in flow
- Test guest flow
- Test sign-out
- Verify data persistence

**Acceptance Criteria:**
- Google Sign-In works on iOS
- All flows functional
- No crashes or errors

#### Task 9.4: Verify Multi-User Data Isolation
**Actions:**
- Sign in as User A
- Create pet and data
- Sign out
- Sign in as User B
- Verify User B sees empty state
- Create different pet
- Sign out and sign in as User A
- Verify User A's data restored

**Acceptance Criteria:**
- Users have isolated data
- No data leakage between accounts
- Data persists correctly per user

---

## Implementation Order

The tasks should be completed in the following order to minimize dependencies and integration issues:

1. **Phase 1** (Foundation): Tasks 1.1 → 1.2 → 1.3
2. **Phase 2** (Auth Context): Tasks 2.1 → 2.2
3. **Phase 3** (Storage): Tasks 3.1 → 3.2
4. **Phase 4** (Login UI): Tasks 4.1 → 4.2
5. **Phase 5** (Navigation): Tasks 5.1 → 5.2
6. **Phase 6** (Menu): Tasks 6.1 → 6.2 → 6.3
7. **Phase 7** (Testing): Tasks 7.1 → 7.2 → 7.3 → 7.4 → 7.5
8. **Phase 8** (Documentation): Tasks 8.1 → 8.2 → 8.3 → 8.4
9. **Phase 9** (Build & Test): Tasks 9.1 → 9.2 → 9.3 → 9.4

## Estimated Complexity

- **Phase 1**: Low - Straightforward dependency and config setup
- **Phase 2**: Medium - Core auth logic, requires careful state management
- **Phase 3**: Medium - Storage refactoring, migration considerations
- **Phase 4**: Low - UI implementation
- **Phase 5**: Low - Navigation integration
- **Phase 6**: Low - UI updates
- **Phase 7**: Medium-High - Comprehensive testing coverage
- **Phase 8**: Low - Documentation and polish
- **Phase 9**: Medium - Native builds and testing

## Success Criteria

The implementation will be considered complete when:

1. ✅ Users can sign in with Google account
2. ✅ Users can play as guest without authentication
3. ✅ Users can sign out and return to login screen
4. ✅ Pet data is isolated per user (no data leakage)
5. ✅ Auth state persists across app restarts
6. ✅ All tests pass with >80% coverage for new code
7. ✅ Documentation is complete and accurate
8. ✅ App builds and runs on both Android and iOS
9. ✅ No crashes or critical errors in auth flows
10. ✅ User experience is smooth and intuitive

## Completed Tasks

- [x] **Phase 1: Foundation & Dependencies**
  - [x] Install packages
  - [x] Configure `app.config.js`
  - [x] Add placeholder google-services files

- [x] **Phase 2: Authentication Context**
  - [x] Create `AuthContext.tsx`
  - [x] Create `authStorage.ts`
  - [x] Implement signIn/signOut/playAsGuest

- [x] **Phase 3: Multi-User Data Isolation**
  - [x] Update `storage.ts` for namespacing
  - [x] Update `PetContext.tsx` to use auth user ID

- [x] **Phase 4: Login Screen**
  - [x] Create `LoginScreen.tsx`
  - [x] Add Google Sign-In button
  - [x] Add Guest button

- [x] **Phase 5: Navigation**
  - [x] Update `App.tsx` / `AppNavigator`
  - [x] Guard routes based on auth state

- [x] **Phase 6: Menu Updates**
  - [x] Show user info in Menu
  - [x] Add Sign Out button

- [x] **Phase 7: Testing**
  - [x] Fix Jest configuration for PNPM
  - [x] Create tests for AuthContext and Storage
  - [x] Verify existing tests pass

- [x] **Phase 8: Documentation**
  - [x] Create `GOOGLE_OAUTH_SETUP.md`
  - [x] Update `README.md`
