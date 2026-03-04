# Google OAuth Setup Guide

This guide walks you through setting up Google OAuth 2.0 for Lilly's Box on both Android and iOS platforms.

## Prerequisites

- Google Cloud Console account (https://console.cloud.google.com/)
- Android Studio (for Android setup)
- Xcode (for iOS setup)
- Node.js and npm/pnpm installed

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click "NEW PROJECT"
4. Enter a name (e.g., "Lilly's Box")
5. Click "CREATE"
6. Wait for the project to be created

## Step 2: Enable Google Sign-In API

1. In the Google Cloud Console, go to **APIs & Services** > **Library**
2. Search for "Google+ API" or "Identity Toolkit API"
3. Click on "Google+ API" or the relevant API
4. Click "ENABLE"

## Step 3: Create OAuth 2.0 Credentials

### For Android:

1. Go to **APIs & Services** > **Credentials**
2. Click "Create Credentials" > "OAuth 2.0 Client ID"
3. Select "Android" as the application type
4. Enter your app information:
   - **Package name**: `com.cpxlabs.lillysbox`
   - **SHA-1 certificate fingerprint**: (see below)
5. Click "Create"
6. Download the JSON file (if available) or note the Client ID

### Getting SHA-1 Fingerprint for Android:

```bash
# For debug builds:
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android

# For release builds (replace /path/to/keystore):
keytool -list -v -keystore /path/to/your/keystore.jks -alias your_alias
```

Copy the SHA-1 fingerprint value and use it when creating credentials.

### For iOS:

1. Go to **APIs & Services** > **Credentials**
2. Click "Create Credentials" > "OAuth 2.0 Client ID"
3. Select "iOS" as the application type
4. Enter your app information:
   - **Bundle ID**: `com.cpxlabs.lillysbox`
   - **Team ID**: (optional, but recommended - find in Apple Developer Account)
5. Click "Create"
6. Download the file or note the Client ID

## Step 4: Download Configuration Files

### For Android:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use your existing Google Cloud Project
3. Select your project and add Firebase
4. Go to **Project Settings** > **Service Accounts**
5. Click "Generate New Private Key"
6. Download `google-services.json`
7. Place it in the **project root directory** (same level as `app.config.js`)

### For iOS:

1. In Firebase Console, go to **Project Settings** > **General** tab
2. Find the iOS app section
3. Download `GoogleService-Info.plist`
4. Place it in the **project root directory** (same level as `app.config.js`)

## Step 5: Update Configuration Files

### Android (google-services.json)

Replace the placeholder values with those from your downloaded file:

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "your-private-key-id",
  "private_key": "your-private-key",
  "client_email": "your-client-email",
  "client_id": "your-client-id",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "your-cert-url"
}
```

### iOS (GoogleService-Info.plist)

The downloaded plist file should be placed as-is in the project root.

## Step 6: Update Web Client ID in Code

1. Go to **APIs & Services** > **Credentials** in Google Cloud Console
2. Find your OAuth 2.0 credentials (usually labeled as "Web application")
3. If you don't have one, create a new "OAuth 2.0 Client ID" of type "Web application"
4. Copy the Client ID
5. Open `src/context/AuthContext.tsx`
6. Replace `YOUR_WEB_CLIENT_ID` with your actual Web Client ID:

```typescript
await GoogleSignin.configure({
  webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
  // ...
});
```

## Step 7: Build and Test

### Android:

```bash
# First time or after changes to native code
npx expo prebuild --clean

# Build and run on Android emulator/device
pnpm android
```

### iOS:

```bash
# First time or after changes to native code
npx expo prebuild --clean

# Build and run on iOS simulator/device
pnpm ios
```

## Troubleshooting

### "Google Play Services not available"

**Cause**: The emulator doesn't have Google Play Services installed.

**Solution**:
- Use an emulator image that includes Google Play (look for `google_play_store` in the image name)
- Or use a physical device for testing
- Or use Firebase Emulator Suite

### "Sign in failed" or "Invalid Client"

**Cause**:
- Wrong Client ID in code
- SHA-1 fingerprint mismatch
- App package name doesn't match configuration

**Solution**:
- Double-check the Web Client ID in `AuthContext.tsx`
- Verify SHA-1 fingerprint matches what's in Google Cloud Console
- Ensure package name is exactly `com.cpxlabs.lillysbox`

### "Invalid iOS Bundle ID"

**Cause**: Bundle ID in `GoogleService-Info.plist` doesn't match app configuration

**Solution**:
- Verify bundle ID in `app.config.js` matches the plist file
- Regenerate `GoogleService-Info.plist` if necessary

### Configuration Files Not Found

**Cause**: Files are in wrong location or have wrong names

**Solution**:
- Ensure `google-services.json` is in project root (same level as `app.config.js`)
- Ensure `GoogleService-Info.plist` is in project root
- Double-check file names and extensions

### "Failed to initialize auth"

**Cause**: Network error or Google services unreachable

**Solution**:
- Check internet connection
- Verify Google Play Services is up to date on device/emulator
- Try clearing app cache and reinstalling

## Important Notes

1. **Keep credentials secure**: Never commit `google-services.json` or `GoogleService-Info.plist` to version control (they're in `.gitignore`)

2. **Different credentials for different environments**: Consider creating separate OAuth credentials for development, staging, and production

3. **Test thoroughly**: Test both sign-in and guest modes extensively before releasing to users

4. **Data privacy**: Make sure to have appropriate privacy policies in place before collecting user information

5. **Token refresh**: The SDK handles token refresh automatically, but ensure `offlineAccess` is enabled in configuration

## Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [React Native Google Sign-In Library](https://github.com/react-native-google-signin/google-signin)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Firebase Console](https://console.firebase.google.com/)

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review Google Sign-In library documentation
3. Check Google Cloud Console logs for API errors
4. Ensure all configuration files are in place and valid
5. Try with a clean build: `npx expo prebuild --clean`
