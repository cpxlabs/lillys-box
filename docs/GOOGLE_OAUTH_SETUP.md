# Google OAuth Setup Guide

This guide explains how to set up Google OAuth for the Pet Care Game on both Android and iOS.

## Prerequisites

- A [Google Cloud Console](https://console.cloud.google.com/) account.
- Basic familiarity with React Native and Expo configuration.

## 1. Google Cloud Console Setup

1.  **Create a Project**: Go to the Google Cloud Console and create a new project.
2.  **OAuth Consent Screen**:
    -   Navigate to "APIs & Services" > "OAuth consent screen".
    -   Select "External" (or "Internal" if you are a G Suite user).
    -   Fill in the required details (App name, User support email, etc.).
    -   Add `.../auth/userinfo.email` and `.../auth/userinfo.profile` scopes.
    -   Save.
3.  **Credentials**:
    -   Navigate to "APIs & Services" > "Credentials".
    -   Click "Create Credentials" > "OAuth client ID".

### Android Setup

1.  Select **Android** as the Application type.
2.  **Package Name**: Enter `com.az1nn.petcaregame` (or your custom package name from `app.config.js`).
3.  **SHA-1 Certificate Fingerprint**:
    -   For **Development** (Expo Go / Dev Client): You need the SHA-1 of your local debug keystore.
        ```bash
        # macOS/Linux
        keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
        # Windows
        keytool -list -v -keystore "%USERPROFILE%\.android\debug.keystore" -alias androiddebugkey -storepass android -keypass android
        ```
    -   For **Production**: You need the SHA-1 of your release keystore (or App Signing Key if using Play Console signing).
4.  Click **Create**.
5.  **Download JSON**: Download the `google-services.json` file.
6.  **Place File**: Move `google-services.json` to the root directory of your project.

### iOS Setup

1.  Select **iOS** as the Application type.
2.  **Bundle ID**: Enter `com.az1nn.petcaregame` (or your custom bundle ID from `app.config.js`).
3.  Click **Create**.
4.  **Download Plist**: Download the `GoogleService-Info.plist` file.
5.  **Place File**: Move `GoogleService-Info.plist` to the root directory of your project.

## 2. Project Configuration

Ensure your `app.config.js` is correctly configured to reference these files.

```javascript
module.exports = () => {
  return {
    expo: {
      ios: {
        bundleIdentifier: "com.az1nn.petcaregame",
        googleServicesFile: "./GoogleService-Info.plist",
      },
      android: {
        package: "com.az1nn.petcaregame",
        googleServicesFile: "./google-services.json",
      },
      plugins: [
        "@react-native-google-signin/google-signin",
      ]
    }
  };
};
```

## 3. Web Client ID (Optional but Recommended)

For backend verification or obtaining an ID token, you often need a Web Client ID.
1.  Create another OAuth client ID in Google Cloud Console.
2.  Select **Web application**.
3.  Use the generated Client ID in `GoogleSignin.configure({ webClientId: '...' })`.

## 4. Troubleshooting

*   **"Play Services not available"**: This usually happens on emulators without Google Play Store. Use an emulator with "Google Play" API image.
*   **"Developer Error" (10)**: This usually means the SHA-1 fingerprint is incorrect or mismatched between your build and the Google Cloud Console. Check if you are using the debug or release keystore.
*   **"Canceled" (12501)**: Often user cancellation, but can also be configuration related on Android.

## 5. Building

Since this uses native code (`@react-native-google-signin/google-signin`), you cannot use standard Expo Go. You must build a **Development Client**.

```bash
# Android
npx expo run:android

# iOS
npx expo run:ios
```

Or build with EAS:

```bash
eas build --profile development --platform android
eas build --profile development --platform ios
```
