# Building Lilly's Box

Complete guide for building Lilly's Box for web, Android, and iOS platforms.

## Platform Support

| Platform | Status | Auth | Ads | Notes |
|----------|--------|------|-----|-------|
| **Web** | ✅ | Demo user | ❌ | Development & testing |
| **Android** | ✅ | Google OAuth | ✅ | Production-ready |
| **iOS** | ✅ | Google OAuth | ✅ | Production-ready |

## Quick Start

```bash
# Web development (30 seconds)
pnpm web

# Web production build
EXPO_PUBLIC_BUILD_PLATFORM=web npx expo export -p web

# Android development
pnpm android

# iOS development
pnpm ios
```

## Web Builds

### Development Server

```bash
pnpm web
```

Starts local dev server (usually http://localhost:19006) with:
- 🚀 Live reload on code changes
- 🐛 Full debugging tools
- 👤 Demo user for testing (no OAuth needed)
- 💾 Browser storage for pet data

### Production Build

```bash
EXPO_PUBLIC_BUILD_PLATFORM=web npx expo export -p web
```

Creates optimized static files in `./dist` ready for deployment:
- 📦 Minified and optimized
- ✅ No native module errors
- 💾 Pet data persists via browser storage
- 🚀 Ready for Vercel, Netlify, or self-hosting

### Environment Variable

The `EXPO_PUBLIC_BUILD_PLATFORM=web` variable:
- Tells the build to skip Google Sign-In module (web doesn't support native modules)
- Enables demo user fallback
- Required for all web builds
- Not needed for Android/iOS

**On Windows:**
```bash
set EXPO_PUBLIC_BUILD_PLATFORM=web
npx expo export -p web
```

### Web Authentication

#### Demo User (Automatic on Web)

When you run the app on web and click "Sign in with Google":
```
{
  id: 'web-demo-user-1234567890',
  email: 'demo@lillysbox.local',
  name: 'Demo User (Web)'
}
```

- No real OAuth needed
- Fully functional for testing
- Data isolated per demo user
- Persists across browser refresh

#### Guest Mode

Also available on web:
- Anonymous session
- No account required
- Can upgrade to demo user later
- Local data only

### Deployment

#### Vercel (Recommended)

```bash
# Build
EXPO_PUBLIC_BUILD_PLATFORM=web npx expo export -p web

# Deploy (auto-detects dist/)
vercel deploy --prod
```

#### Netlify

```bash
# Build
EXPO_PUBLIC_BUILD_PLATFORM=web npx expo export -p web --output-dir ./dist

# Deploy
netlify deploy --prod --dir dist
```

#### GitHub Pages

```bash
# Build
EXPO_PUBLIC_BUILD_PLATFORM=web npx expo export -p web --output-dir ./dist

# Commit and push
git add dist/
git commit -m "Web build"
git push origin main
```

#### Self-hosted

```bash
# Build
EXPO_PUBLIC_BUILD_PLATFORM=web npx expo export -p web --output-dir ./build

# Serve locally
npx serve -s build
# or Python
python3 -m http.server --directory build
```

### Troubleshooting Web

**Error: Cannot find module '@react-native-google-signin'**
- Set environment variable: `EXPO_PUBLIC_BUILD_PLATFORM=web`
- Clear cache: `EXPO_PUBLIC_BUILD_PLATFORM=web npx expo export -p web --clear`

**Demo user not persisting**
- Check browser storage is enabled
- Verify same domain/localhost
- Clear browser cache if needed

**"Module not found" errors**
- Ensure environment variable is set
- Clear node_modules cache
- Rebuild from scratch

## Android Builds

### Development

```bash
pnpm android
```

### Prerequisites

- Android Studio installed
- Android SDK (API 33+)
- `ANDROID_HOME` environment variable set
- Device or emulator running

### Prebuild

```bash
cd app
npx expo prebuild --platform android --clean
```

### Build APK

Debug APK:
```bash
cd app
npx expo run:android --build
```

Installable APK:
```bash
cd app
pnpm build:android:apk
```

This runs a local Expo Android prebuild plus Gradle debug build, then copies the installable `.apk` to the repository-level `Android/lillys-box.apk` file for easy sharing or manual installation.

### Google Play Store

1. Create Google Play Developer account
2. Set up app in Play Console
3. Configure signing certificate
4. Build Play Store bundle:
   ```bash
   cd app
   npx eas-cli build --platform android --profile production --non-interactive
   ```
5. Upload the generated `.aab` to Play Console

## iOS Builds

### Development

```bash
pnpm ios
```

### Prerequisites

- macOS (Intel or Apple Silicon)
- Xcode
- Apple Developer account
- iOS 13.4+

### Prebuild

```bash
cd app
npx expo prebuild --platform ios --clean
```

### Build

```bash
cd app
npx expo run:ios
```

### App Store

1. Create Apple Developer account
2. Configure signing in Xcode
3. Archive app: Product → Archive
4. Upload to App Store
5. Submit for review

## Configuration Files

### `app.config.js`

Main Expo configuration:

```javascript
const isWebBuild = process.env.EXPO_PUBLIC_BUILD_PLATFORM === 'web';

export default {
  expo: {
    name: 'Lilly\'s Box',
    slug: 'lillysbox',
    plugins: isWebBuild ? [] : [
      "@react-native-google-signin/google-signin"
    ],
    // ... other config
  }
};
```

### OAuth Config (Android)

`google-services.json` in project root:
```json
{
  "project_id": "your-project-id",
  "client_id": "your-client-id.apps.googleusercontent.com"
}
```

### OAuth Config (iOS)

`GoogleService-Info.plist` in project root with OAuth credentials.

See [Authentication Guide](../technical/AUTHENTICATION.md) for setup.

## Environment Variables

### Web Build

```bash
EXPO_PUBLIC_BUILD_PLATFORM=web
```

### Other Variables

Check `.env.example` for:
- Google Cloud Project ID
- Firebase keys (if applicable)
- API endpoints
- Feature flags

## Performance Optimization

### Web

- Output is fully minified by Expo
- Use CDN for static hosting (Vercel, Netlify auto-CDN)
- Enable gzip compression on server

### Mobile

- Use ProGuard for Android release builds
- Strip unused code and assets
- Test on real devices before release

## Common Commands

```bash
# Development
pnpm web                  # Web dev server
pnpm android             # Android dev server
pnpm ios                 # iOS dev server

# Building
pnpm build:web           # Web production build
pnpm build:android       # Android production
pnpm build:ios          # iOS production

# Cleaning
pnpm clean:web          # Clear web build cache
rm -rf node_modules      # Full clean rebuild
pnpm install            # Reinstall dependencies
```

## Useful Links

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [EAS Build Docs](https://docs.expo.dev/eas-build/introduction/)

## See Also

- [Authentication Guide](../technical/AUTHENTICATION.md) - OAuth setup
- [Responsive Design](RESPONSIVE.md) - Mobile & web layouts
- [Testing Guide](../testing/TESTING.md) - Test setup

---

**Last Updated**: 2026-03-13
**Status**: Complete
