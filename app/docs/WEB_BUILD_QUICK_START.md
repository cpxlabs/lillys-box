# Web Build Quick Start

Get the Pet Care Game running on web in 30 seconds.

## TL;DR

```bash
# Development
pnpm web

# Production
EXPO_PUBLIC_BUILD_PLATFORM=web npx expo export -p web
```

That's it! The app will work perfectly on web with our fallback authentication system.

## What Happens

### Development (`pnpm web`)
- 🚀 Starts local dev server (usually http://localhost:19006)
- 🔄 Auto-reloads on code changes
- 🐛 Full debugging tools
- 👤 Demo user available when you "Sign in with Google"

### Production (`EXPO_PUBLIC_BUILD_PLATFORM=web npx expo export -p web`)
- 📦 Creates optimized static files in `./dist`
- ✅ Ready to deploy to Vercel, Netlify, GitHub Pages, etc.
- 🎯 No Google OAuth module errors
- 💾 Pet data persists using browser storage

## Platform Detection

The app automatically detects the platform:
- **Web** → Uses demo user (no OAuth needed)
- **Android/iOS** → Uses real Google OAuth

No configuration needed! Set the environment variable and go.

## Environment Variable

```bash
# This tells the app to build for web (no native plugins)
export EXPO_PUBLIC_BUILD_PLATFORM=web

# Then run export or dev server
npx expo export -p web
```

On Windows, use `set` instead of `export`:
```bash
set EXPO_PUBLIC_BUILD_PLATFORM=web
npx expo export -p web
```

## Testing the App

### On Web
1. Run `pnpm web`
2. Click "Sign in with Google"
3. See "Demo User (Web)" in the header
4. Create and manage pets normally
5. Data persists with browser refresh

### On Mobile
1. Run `pnpm android` or `pnpm ios`
2. Use real Google Sign-In
3. Everything works as before

## Deployment

### Vercel
```bash
EXPO_PUBLIC_BUILD_PLATFORM=web npx expo export -p web
git push  # Vercel auto-deploys
```

### Netlify
```bash
EXPO_PUBLIC_BUILD_PLATFORM=web npx expo export -p web -o ./dist
netlify deploy --prod --dir dist
```

### GitHub Pages
```bash
EXPO_PUBLIC_BUILD_PLATFORM=web npx expo export -p web -o ./build
git add . && git commit -m "Web build"
git push origin main
```

## FAQ

**Q: Why do I need the environment variable?**
A: It tells the build to skip Google Sign-In (native-only module), preventing web build errors.

**Q: Is the demo user secure?**
A: No - it's only for testing/development. Use real auth for production.

**Q: Does mobile still work?**
A: Yes! Nothing changed for Android/iOS. Just don't set the environment variable.

**Q: Can I use real OAuth on web?**
A: Yes! See [AUTHENTICATION_GUIDE.md](./AUTHENTICATION_GUIDE.md) for extending the auth system.

**Q: How do I fix "Cannot find module" errors?**
A: Set the environment variable: `EXPO_PUBLIC_BUILD_PLATFORM=web`

## Common Commands

```bash
# Development web server with hot reload
pnpm web

# Build for web deployment
EXPO_PUBLIC_BUILD_PLATFORM=web npx expo export -p web

# Clear web build cache
EXPO_PUBLIC_BUILD_PLATFORM=web npx expo export -p web --clear

# Development on mobile
pnpm android
pnpm ios

# Full documentation
docs/WEB_BUILD_GUIDE.md
```

## Next Steps

- **Learn more**: Read [WEB_BUILD_GUIDE.md](./WEB_BUILD_GUIDE.md)
- **Extend auth**: See [AUTHENTICATION_GUIDE.md](./AUTHENTICATION_GUIDE.md)
- **Deploy**: Push to Vercel, Netlify, or GitHub Pages

---

**That's it!** You now have a fully functional Pet Care Game running on web. 🎉

