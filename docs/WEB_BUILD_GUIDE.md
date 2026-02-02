# Web Build Guide - Pet Care Game

This guide explains how to run and build the Pet Care Game for web platforms, including the fallback authentication system.

## Overview

The Pet Care Game supports three platforms:
- **Mobile (Android/iOS)** - Full OAuth with Google Sign-In
- **Web** - Fallback authentication with local demo user

## Platform Differences

### Mobile (Android/iOS)
- ✅ Google Sign-In with real OAuth
- ✅ Multi-user support
- ✅ Full data isolation
- ✅ AdMob advertisements
- ✅ Production-ready

### Web
- ✅ Demo user for testing (local-only)
- ✅ Guest mode
- ✅ Responsive UI
- ⚠️ No real OAuth (fallback to demo)
- ⚠️ No AdMob ads
- ✅ Perfect for development/testing

## Running Web Builds

### Development Web Server

```bash
# Start web development server
pnpm web
```

This will:
1. Start the Expo web dev server
2. Open browser automatically
3. Use hot reloading for development

### Web Build Commands

```bash
# Export web build
EXPO_PUBLIC_BUILD_PLATFORM=web npx expo export -p web

# Build static web export
EXPO_PUBLIC_BUILD_PLATFORM=web npx expo export --platform web

# Clear web cache and rebuild
EXPO_PUBLIC_BUILD_PLATFORM=web npx expo export -p web --clear
```

## Authentication on Web

### Demo User System (Web Fallback)

When running on web, the authentication system provides a **demo user** for testing:

```typescript
// Auto-created demo user for web
{
  id: 'web-demo-user-1234567890',
  email: 'demo@petcaregame.local',
  name: 'Demo User (Web)',
  photo: undefined
}
```

**Benefits:**
- Test full app functionality without OAuth setup
- Verify authentication flows
- Check multi-user data isolation
- Safe for public demos

### Login Flow on Web

1. **Open app on web**
   - See LoginScreen
   - Two options: "Sign in with Google" or "Play as Guest"

2. **Click "Sign in with Google"**
   - Creates a demo user (web fallback)
   - No real Google authentication needed
   - Logs user in immediately
   - Stored as authenticated user

3. **Click "Play as Guest"**
   - Standard guest mode
   - Same as mobile
   - No user info displayed

4. **Sign Out**
   - Clears demo user session
   - Returns to LoginScreen
   - Can sign in again

### Data Persistence

- Pet data saved to AsyncStorage (browser storage)
- Guest data: `@pet_care_game:pet:guest`
- Demo user data: `@pet_care_game:pet:{demoUserId}`
- Persists across browser refresh
- Cleared on browser data clear

## Environment Variables

### Build Platform Detection

```bash
# Web build
EXPO_PUBLIC_BUILD_PLATFORM=web npx expo export -p web

# Mobile builds (default)
npx expo prebuild --platform android
npx expo prebuild --platform ios
```

### Configuration

In `app.config.js`:
```javascript
const isWebBuild = process.env.EXPO_PUBLIC_BUILD_PLATFORM === 'web';

const plugins = isWebBuild ? [] : [
  "@react-native-google-signin/google-signin"
];
```

## Deployment Options

### Vercel

```bash
# Build for Vercel
EXPO_PUBLIC_BUILD_PLATFORM=web npx expo export -p web --output-dir ./dist

# Deploy to Vercel
vercel deploy
```

### Netlify

```bash
# Build for Netlify
EXPO_PUBLIC_BUILD_PLATFORM=web npx expo export -p web --output-dir ./dist

# Deploy to Netlify
netlify deploy --prod --dir dist
```

### GitHub Pages

```bash
# Build for GitHub Pages
EXPO_PUBLIC_BUILD_PLATFORM=web npx expo export -p web \
  --output-dir ./dist \
  --clear

# Deploy using GitHub Actions or manual upload
```

### Self-hosted

```bash
# Build static files
EXPO_PUBLIC_BUILD_PLATFORM=web npx expo export -p web --output-dir ./build

# Serve with any static server
npx serve -s build
# or
python3 -m http.server --directory build
```

## Troubleshooting Web Builds

### Common Import Path Errors (Fixed)

The following import path issues have been resolved in the codebase:

#### 1. Asset Import Paths
**Symptom:** `Unable to resolve module ../../assets/sprites/...`

**Cause:** Asset imports using incorrect relative paths from game components

**Fixed Files:**
- `src/games/pet-care/components/PetRenderer.tsx` - All sprite assets
- `src/games/pet-care/screens/BathScene.tsx` - Sponge sprite

**Solution Applied:** Updated paths from `../../assets/` to `../../../../assets/`

#### 2. Haptics Import Path
**Symptom:** `Unable to resolve module ../utils/haptics`

**Cause:** IconButton trying to import from non-existent `src/app/utils/haptics`

**Fixed File:** `src/app/components/IconButton.tsx`

**Solution Applied:** Changed import from `../utils/haptics` to `../../shared/utils/haptics`

#### 3. ConfirmModal Import Path
**Symptom:** `Unable to resolve module ../components/ConfirmModal`

**Cause:** Game hook importing from wrong component directory

**Fixed File:** `src/games/pet-care/hooks/useDoubleReward.tsx`

**Solution Applied:** Changed import from `../components/ConfirmModal` to `../../../app/components/ConfirmModal`

#### 4. Hook and Config Import Paths
**Symptom:** `Unable to resolve module ./useRewardedAd` or `../config/ads.config`

**Cause:** Game hooks trying to import app-level utilities from local directories

**Fixed File:** `src/games/pet-care/hooks/useDoubleReward.tsx`

**Solution Applied:**
- `useRewardedAd`: Changed from `./useRewardedAd` to `../../../app/hooks/useRewardedAd`
- `AdsConfig`: Changed from `../config/ads.config` to `../../../app/config/ads.config`

#### 5. i18n Import Path
**Symptom:** `Unable to resolve module ../../i18n`

**Cause:** LanguageContext using incorrect relative path

**Fixed File:** `src/app/context/LanguageContext.tsx`

**Solution Applied:** Changed import from `../../i18n` to `../i18n`

### i18n Translation Not Working

**Symptom:** Translation keys showing as fallback text instead of actual translations

**Cause:** Game translations not registered with i18n instance

**Solution Applied:**
1. Updated `GameRegistry.ts` to register game translations as namespaces
2. Updated all game components to use `useTranslation('pet-care')` instead of `useTranslation()`

**Files Updated:** 13 files including all game screens, hooks, and components

**Technical Details:**
```typescript
// GameRegistry now calls this when registering games
private registerGameTranslations(game: Game): void {
  i18n.addResourceBundle('en', game.id, game.translations.en, true, true);
  i18n.addResourceBundle('pt-BR', game.id, game.translations['pt-BR'], true, true);
}

// Game components use namespace
const { t } = useTranslation('pet-care'); // ✓ Correct
const { t } = useTranslation();           // ✗ Old (incorrect)
```

### "Cannot find module '@react-native-google-signin'"

**Cause:** Building for web without setting environment variable

**Solution:**
```bash
# Always use this for web builds
EXPO_PUBLIC_BUILD_PLATFORM=web npx expo export -p web
```

### "Module not found" errors on web

**Cause:** Native modules aren't being skipped

**Solution:**
1. Ensure environment variable is set: `EXPO_PUBLIC_BUILD_PLATFORM=web`
2. Clear cache: `npx expo export -p web --clear`
3. Rebuild: `EXPO_PUBLIC_BUILD_PLATFORM=web npx expo export -p web`

### Demo user not persisting

**Cause:** Browser storage cleared or different domain

**Solution:**
- Check browser storage (DevTools > Application)
- Same domain/port required for persistence
- Guest data may persist, demo user created fresh each login

### Performance on web

**Tips:**
- Use modern browser (Chrome, Firefox, Safari, Edge)
- Test on desktop first, then mobile browsers
- Check DevTools Performance tab
- Use `pnpm web` for hot reloading development

## Testing Checklist

- [ ] Run `pnpm web` successfully
- [ ] See LoginScreen
- [ ] Click "Sign in with Google" → Demo user created
- [ ] See user name in menu header
- [ ] Create a pet
- [ ] Verify pet appears
- [ ] Refresh page → Pet data persists
- [ ] Sign out
- [ ] Guest mode works
- [ ] Create guest pet
- [ ] Guest data persists
- [ ] Build with `EXPO_PUBLIC_BUILD_PLATFORM=web`

## Known Limitations on Web

| Feature | Status | Notes |
|---------|--------|-------|
| Google OAuth | ⚠️ Fallback | Demo user only, no real OAuth |
| AdMob Ads | ❌ Not Available | Web doesn't support native ads |
| Haptic Feedback | ❌ Not Available | No haptic on web |
| Push Notifications | ❌ Not Available | Not implemented |
| Native Modules | ⚠️ Limited | Only web-compatible packages work |

## Mobile vs Web Development

### For Mobile Development
```bash
# Android
pnpm android

# iOS
pnpm ios
```

### For Web Development
```bash
# Dev server with hot reload
pnpm web

# Production build
EXPO_PUBLIC_BUILD_PLATFORM=web npx expo export -p web
```

### Using Both

You can develop for both platforms simultaneously:

```bash
# Terminal 1: Web development
pnpm web

# Terminal 2: Mobile (in another terminal)
pnpm android
# or
pnpm ios
```

## CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Build Web

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'

      - name: Install dependencies
        run: pnpm install

      - name: Build web
        run: EXPO_PUBLIC_BUILD_PLATFORM=web npx expo export -p web

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## Performance Metrics

### Typical Web Build Sizes

| Artifact | Size | Notes |
|----------|------|-------|
| Initial JS bundle | ~800 KB | Minified + gzipped |
| Total static files | ~2-3 MB | Including assets |
| Pet image assets | ~1 MB | SVG/PNG sprites |

### Page Load Times

- **Initial load:** 2-5 seconds (depends on connection)
- **Interaction:** Sub-100ms (after page load)
- **Pet actions:** 100-300ms (animations)

## Security Considerations

### Web Demo User

**Important:** The demo user is ONLY for local testing/demos.
- ⚠️ Not secure for production use
- ⚠️ No real authentication
- ⚠️ Data not encrypted
- ⚠️ Use only for development/testing

### For Production Web

If deploying to production:
1. Implement real authentication backend
2. Add HTTPS enforcement
3. Implement proper session management
4. Add CSRF protection
5. Validate all inputs on backend

## Advanced: Custom Web Authentication

To implement real authentication on web, see:
- `docs/AUTHENTICATION_GUIDE.md` - Auth architecture
- `docs/API_REFERENCE.md` - API details
- `src/context/AuthContext.tsx` - Current implementation

You can extend the fallback to use:
- Firebase Authentication
- Auth0
- Custom backend API
- OAuth 2.0 (via PKCE flow)

## Support & Resources

### Documentation
- [AUTHENTICATION_GUIDE.md](./AUTHENTICATION_GUIDE.md) - Auth system
- [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md) - OAuth setup
- [README.md](../README.md) - Project overview

### External Resources
- [Expo Web Documentation](https://docs.expo.dev/workflow/web/)
- [React Native Web](https://necolas.github.io/react-native-web/)
- [AsyncStorage Web](https://react-native-async-storage.github.io/async-storage/)

---

**Last Updated**: 2026-02-02
**Version**: 1.1
**Status**: Complete - All import errors fixed, i18n working

---

## Quick Reference

```bash
# Development
pnpm web                    # Dev server

# Building
EXPO_PUBLIC_BUILD_PLATFORM=web npx expo export -p web    # Export for web

# Environment variable
export EXPO_PUBLIC_BUILD_PLATFORM=web    # Set for session (Linux/Mac)
set EXPO_PUBLIC_BUILD_PLATFORM=web       # Set for session (Windows)

# Deployment
vercel deploy               # Deploy to Vercel
netlify deploy --prod       # Deploy to Netlify
```
