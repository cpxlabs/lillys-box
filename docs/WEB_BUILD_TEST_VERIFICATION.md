# Web Build Test Verification

Quick checklist to verify the web build fallback is working correctly.

## Test 1: Development Web Server

### Setup
```bash
cd /home/user/pet-care-game
pnpm web
```

### Expected Behavior ✅
- [ ] Terminal shows "Tunnel URL: ..." or "Local: http://localhost:19006"
- [ ] Browser opens automatically (or you can open http://localhost:19006)
- [ ] LoginScreen appears with:
  - [ ] "Sign in with Google" button
  - [ ] "Play as Guest" button
  - [ ] Pet Care Game logo/title

### Test Sign In with Demo User
1. Click "Sign in with Google"
2. Expect:
   - [ ] No error about missing Google Sign-In module
   - [ ] Loading spinner briefly
   - [ ] Redirects to MenuScreen
   - [ ] User header shows "Welcome, Demo User (Web)"
   - [ ] User email: "demo@petcaregame.local"
   - [ ] Sign Out button visible

### Test Guest Mode
1. Go back to login: Click Sign Out
2. Click "Play as Guest"
3. Expect:
   - [ ] Redirects to MenuScreen
   - [ ] User header shows "Guest User"
   - [ ] No Sign Out button
   - [ ] Guest banner: "Login to save your progress online"

### Test Pet Management
1. Click "Create Pet"
2. Create a pet (fill in name, type, etc.)
3. Expect:
   - [ ] Pet creation works
   - [ ] Pet appears in HomeScreen
   - [ ] Can perform actions (feed, play, etc.)
4. Refresh browser (F5)
5. Expect:
   - [ ] Pet data persists
   - [ ] User still logged in as demo user
   - [ ] No data loss

## Test 2: Production Web Build

### Build
```bash
cd /home/user/pet-care-game
export EXPO_PUBLIC_BUILD_PLATFORM=web
npx expo export -p web
```

### Expected Behavior ✅
- [ ] No errors about missing modules
- [ ] Build completes successfully
- [ ] Creates `dist/` directory
- [ ] Files in dist:
  - [ ] index.html
  - [ ] js/ directory (bundle files)
  - [ ] assets/ directory (images)

### Test Built App
```bash
# Serve the built app locally
npx serve -s dist
```

Then visit `http://localhost:3000` (or shown URL):
- [ ] App loads
- [ ] LoginScreen appears
- [ ] "Sign in with Google" works
- [ ] Demo user created successfully
- [ ] All functionality works (pet creation, etc.)
- [ ] Refresh persists data
- [ ] No console errors

## Test 3: Mobile Still Works

### Android
```bash
cd /home/user/pet-care-game
# Make sure environment variable is NOT set
unset EXPO_PUBLIC_BUILD_PLATFORM
pnpm android
```

Expected:
- [ ] Android build succeeds (may take a while)
- [ ] Emulator launches app
- [ ] Google Sign-In works (real OAuth, not demo)
- [ ] All mobile features work unchanged

### iOS
```bash
cd /home/user/pet-care-game
unset EXPO_PUBLIC_BUILD_PLATFORM
pnpm ios
```

Expected:
- [ ] iOS build succeeds
- [ ] Simulator launches app
- [ ] Google Sign-In works (real OAuth)
- [ ] All mobile features work unchanged

## Test 4: Environment Variable Handling

### Set Variable (Web Build)
```bash
export EXPO_PUBLIC_BUILD_PLATFORM=web
npx expo export -p web --clear
```
- [ ] Completes without errors
- [ ] No "Cannot find module" errors

### Unset Variable (Mobile Build)
```bash
unset EXPO_PUBLIC_BUILD_PLATFORM
npx expo prebuild --platform android
```
- [ ] Includes Google Sign-In plugin
- [ ] No web module errors

### Windows Testing
```cmd
set EXPO_PUBLIC_BUILD_PLATFORM=web
npx expo export -p web
```
- [ ] Works on Windows with `set` command
- [ ] Produces same output as Linux/Mac

## Test 5: Error Handling

### Test Invalid Web Client ID
1. Edit `src/context/AuthContext.tsx`
2. Change Web Client ID to invalid value
3. Run `pnpm web`
4. Click "Sign in with Google"
5. Expect:
   - [ ] Demo user still created (fallback works)
   - [ ] No crash
   - [ ] Graceful error handling

### Test Network Issues
1. Open DevTools
2. Go to Network tab
3. Set throttling to "Offline"
4. Try to sign in
5. Expect:
   - [ ] App handles it gracefully
   - [ ] Demo user created locally
   - [ ] No unhandled promise rejection

## Test 6: Data Isolation

### Test Multi-User Separation
1. Sign in as demo user
2. Create pet "Pet A"
3. Sign out
4. Switch to guest mode
5. Create pet "Pet B"
6. Refresh page
7. Both pets accessible
8. Each user sees only their pet

### Test Browser Storage
1. Open DevTools
2. Application > Local Storage
3. Check for keys:
   - [ ] `@pet_care_game:auth_state`
   - [ ] `@pet_care_game:pet:{demoUserId}` (for demo user)
   - [ ] `@pet_care_game:pet:guest` (for guest)

## Test 7: Build Artifacts

### Check Output Structure
```bash
ls -la dist/
```

Expected files/directories:
- [ ] index.html
- [ ] js/ (bundle)
- [ ] assets/ (images)
- [ ] README (from expo)

### Check Bundle Size
```bash
du -sh dist/
```

Expected: ~2-3 MB total

### Check for Native Module References
```bash
grep -r "google-signin" dist/ || echo "Good - no native refs"
```

Expected: No matches (native module not included)

## Test 8: Documentation Verification

### Quick Start Guide
- [ ] Read: `docs/WEB_BUILD_QUICK_START.md`
- [ ] All commands work as documented
- [ ] No incorrect information

### Full Web Guide
- [ ] Read: `docs/WEB_BUILD_GUIDE.md`
- [ ] All sections accurate
- [ ] Links work
- [ ] Code examples correct

### Auth Documentation
- [ ] Read: `docs/AUTHENTICATION_GUIDE.md`
- [ ] Web platform explained
- [ ] Demo user documented
- [ ] Fallback behavior clear

## Deployment Test (Optional)

### Deploy to Vercel
```bash
export EXPO_PUBLIC_BUILD_PLATFORM=web
npx expo export -p web
vercel deploy
```

Expected:
- [ ] Deployment successful
- [ ] App accessible at deployed URL
- [ ] All features work
- [ ] No console errors in production

## Checklist Summary

| Test | Status | Notes |
|------|--------|-------|
| Dev server (`pnpm web`) | ⬜ | |
| Sign in with Google | ⬜ | Demo user |
| Guest mode | ⬜ | |
| Pet persistence | ⬜ | Refresh persists |
| Build (`EXPO_PUBLIC_BUILD_PLATFORM=web`) | ⬜ | No errors |
| Built app (`npx serve -s dist`) | ⬜ | Works locally |
| Android build | ⬜ | Real OAuth |
| iOS build | ⬜ | Real OAuth |
| Environment variable handling | ⬜ | Web & mobile |
| Error handling | ⬜ | Graceful |
| Data isolation | ⬜ | Separate storage |
| Browser storage | ⬜ | Correct keys |
| Bundle analysis | ⬜ | No native refs |
| Documentation | ⬜ | Accurate |
| Deployment | ⬜ | Optional |

## Quick Test

If you want a quick 5-minute test:

```bash
# Terminal 1: Dev web server
pnpm web

# In browser:
# 1. Click "Sign in with Google"
# 2. See "Demo User (Web)"
# 3. Create a pet
# 4. Refresh page
# 5. Pet persists ✅

# Terminal 2: Verify mobile still works
unset EXPO_PUBLIC_BUILD_PLATFORM
pnpm android  # or pnpm ios
```

Done! Both platforms working ✅

## Troubleshooting

If tests fail, check:

1. **Module not found error**
   - Make sure `EXPO_PUBLIC_BUILD_PLATFORM=web` is set
   - Clear cache: `npx expo export -p web --clear`

2. **Demo user not created**
   - Check browser console (DevTools F12)
   - Check AsyncStorage keys
   - Verify Platform.OS detection

3. **Pet data not persisting**
   - Check browser storage settings
   - Make sure you're on same domain/port
   - Check AsyncStorage quota

4. **Mobile build fails after web build**
   - Unset the environment variable: `unset EXPO_PUBLIC_BUILD_PLATFORM`
   - Clear cache: `npm cache clean --force`
   - Fresh build: `pnpm install && pnpm android`

---

**All tests passing?** 🎉

Then the web build fallback is working perfectly! Ready to deploy to Vercel, Netlify, or anywhere else.

