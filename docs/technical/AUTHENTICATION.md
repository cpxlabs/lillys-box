# Authentication & OAuth Setup

## Overview

Lilly's Box uses Google OAuth 2.0 for user authentication with support for guest mode. This document covers both setup (for users) and implementation (for developers).

## Architecture

The authentication system consists of:

```
┌─────────────────────────────────────────────┐
│             App.tsx                         │
│         (Root Component)                    │
└────────────┬────────────────────────────────┘
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

### Key Components

| File | Purpose |
|------|---------|
| `src/context/AuthContext.tsx` | Global authentication state and logic |
| `src/utils/authStorage.ts` | Persist auth state to AsyncStorage |
| `src/screens/LoginScreen.tsx` | User authentication interface |
| `app.config.js` | Google Sign-In configuration |

## User Types

### Authenticated User (Google Sign-In)

- Valid Google account required
- User ID from Google
- Email and profile available
- Auth state persists across restarts
- Data key: `@lillys_box:pet:{userId}`

### Guest User

- No account required
- Anonymous session
- Can be upgraded later
- Local data only (not synced)
- Data key: `@lillys_box:pet:guest`

## Setup for Users

### Prerequisites

- Google Cloud Console account (https://console.cloud.google.com/)
- Android Studio (for Android)
- Xcode (for iOS)
- Node.js and npm/pnpm

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click project dropdown → "NEW PROJECT"
3. Enter name (e.g., "Lilly's Box")
4. Click "CREATE"

### Step 2: Enable Google Sign-In API

1. Go to **APIs & Services** > **Library**
2. Search for "Google+ API"
3. Click and then "ENABLE"

### Step 3: Create OAuth 2.0 Credentials

#### For Android:

1. **APIs & Services** > **Credentials** > **"Create Credentials"** > **"OAuth 2.0 Client ID"**
2. Select **Android**
3. Package name: `com.cpxlabs.lillysbox`
4. SHA-1 fingerprint:
   ```bash
   # Debug builds:
   keytool -list -v -keystore ~/.android/debug.keystore \
     -alias androiddebugkey -storepass android -keypass android
   
   # Release builds (replace paths):
   keytool -list -v -keystore /path/to/keystore.jks -alias your_alias
   ```

#### For iOS:

1. **APIs & Services** > **Credentials** > **"Create Credentials"** > **"OAuth 2.0 Client ID"**
2. Select **iOS**
3. Bundle ID: `com.cpxlabs.lillysbox`

### Step 4: Download Configuration Files

#### Android:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create/select project
3. **Project Settings** > **Service Accounts** > **"Generate New Private Key"**
4. Download `google-services.json`
5. Place in **project root** (same level as `app.config.js`)

#### iOS:

1. Firebase Console > **Project Settings** > **General**
2. Find iOS app section
3. Download `GoogleService-Info.plist`
4. Place in **project root**

### Step 5: Configure Credentials

Update configuration files with your OAuth credentials:

```json
// google-services.json (Android)
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "your-private-key-id",
  "private_key": "your-private-key",
  "client_email": "your-client-email",
  "client_id": "your-client-id",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token"
}
```

## Using Auth in Code

### Access Auth Context

```typescript
import { useAuth } from '../context/AuthContext';

export const MyComponent: React.FC = () => {
  const { user, isGuest, loading, signIn, signOut } = useAuth();

  if (loading) return <Loading />;

  return (
    <View>
      {user ? (
        <Text>Welcome, {user.name}</Text>
      ) : (
        <Text>Guest mode</Text>
      )}
    </View>
  );
};
```

### useAuth Hook Returns

| Property | Type | Description |
|----------|------|-------------|
| `user` | `UserInfo \| null` | Current authenticated user (name, email, photo, id) |
| `isGuest` | `boolean` | true when in guest mode (no Google account) |
| `loading` | `boolean` | true during initialization / auth operations |
| `error` | `string \| null` | Last auth error message, if any |
| `signIn()` | `() => Promise<void>` | Initiate Google sign-in |
| `signOut()` | `() => Promise<void>` | Sign out and clear auth state |
| `playAsGuest()` | `() => Promise<void>` | Enter guest mode without signing in |

## Data Isolation

Each user (authenticated or guest) has isolated data:

```
AsyncStorage Keys:
├── @lillys_box:auth_state         (auth status)
├── @lillys_box:pet:userId1        (user 1's pet)
├── @lillys_box:pet:userId2        (user 2's pet)
└── @lillys_box:pet:guest          (guest's pet)
```

Switching users or logging out doesn't affect other users' data.

## Navigation Flow

```
┌──────────────────┐
│   App Starts     │
└────────┬─────────┘
         │
    ┌────▼──────────────┐
    │ AuthProvider Init  │
    │ (Load from storage)│
    └────────┬───────────┘
             │
        ┌────▼──────────┐
        │ isLoading     │
        │ during check  │
        └────┬───┬──────┘
             │   │
        No   │   │  Yes
         ────┴──┬┴─────
         │      │
      ┌──▼──┐ ┌─▼──────────┐
      │Login│ │Main App    │
      │Screen│ │Content     │
      └──────┘ └────┬───────┘
                    │
            ┌───────┴────────┐
            │                │
     ┌──────▼────┐   ┌──────▼──────┐
     │Sign In    │   │Guest Mode   │
     │Success    │   │(Continue)   │
     └───────────┘   └─────────────┘
```

## Troubleshooting

### Sign-In Not Working

1. Verify `google-services.json` / `GoogleService-Info.plist` placed correctly
2. Check SHA-1 fingerprint matches Google Cloud Console
3. Ensure Google Sign-In API is enabled
4. Check `app.config.js` has correct OAuth config

### Account Issues

- Saved credentials can be cleared via app Settings
- Guest mode always available as fallback
- Log files in console if enabled

## Related Docs

- [API Reference](./API_REFERENCE.md) - Complete API documentation
- [Build Guide](../guides/BUILD.md) - Web and native builds
- [Testing Guide](../testing/TESTING.md) - Auth testing

---

**Last Updated**: 2026-03-13
