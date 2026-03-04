module.exports = () => {
  // Base configuration
  const baseConfig = {
    name: "Lilly's Box",
    slug: "lillys-box",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.az1nn.petcaregame",
      googleServicesFile: "./GoogleService-Info.plist"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      package: "com.az1nn.petcaregame",
      googleServicesFile: "./google-services.json"
    },
    scheme: "lillys-box",
    web: {
      favicon: "./assets/favicon.png",
      bundler: "metro"
    }
  };

  // Determine if building for web (skip native plugins for web builds)
  // Set EXPO_PUBLIC_BUILD_PLATFORM=web for web builds
  const isWebBuild = process.env.EXPO_PUBLIC_BUILD_PLATFORM === 'web';

  // Plugins array - only include native plugins for mobile builds
  const plugins = isWebBuild ? [
    "expo-router"
  ] : [
    "expo-router",
    "@react-native-google-signin/google-signin",
    [
      "@sentry/react-native/expo",
      {
        organization: "hitss-40",
        project: "lillys-box",
      }
    ]
  ];

  // NOTE: Native plugins are intentionally excluded for web builds to prevent
  // module resolution errors. The app will use fallback authentication on web.
  //
  // For mobile builds (Android/iOS):
  // - Google Sign-In plugin is included
  // - Uses actual OAuth authentication
  // - Requires google-services.json and GoogleService-Info.plist
  //
  // For web builds:
  // - Use: EXPO_PUBLIC_BUILD_PLATFORM=web npm run web
  // - Fallback: Local-only authentication (no OAuth)
  // - Works for testing and development
  //
  // NOTE: The react-native-google-mobile-ads plugin is also intentionally excluded
  // from the config to prevent web build errors. The native module will still
  // work on iOS/Android when using expo-dev-client with custom dev builds.
  //
  // For production native builds:
  // 1. Uncomment the plugin below
  // 2. Replace test ad IDs with your production IDs
  // 3. Run `npx expo prebuild` to generate native projects
  // 4. Build using expo-dev-client or EAS Build
  //
  // plugins.push([
  //   "react-native-google-mobile-ads",
  //   {
  //     androidAppId: "ca-app-pub-3940256099942544~3347511713",
  //     iosAppId: "ca-app-pub-3940256099942544~1458002511"
  //   }
  // ]);

  return {
    expo: {
      ...baseConfig,
      plugins
    }
  };
};
