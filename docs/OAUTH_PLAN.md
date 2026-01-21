# Google OAuth Implementation Plan

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
