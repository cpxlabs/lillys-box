module.exports = () => {
  // Base configuration
  const baseConfig = {
    name: "Pet Care Game",
    slug: "pet-care-game",
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
    web: {
      favicon: "./assets/favicon.png"
    }
  };

  // Plugins array
  const plugins = [
    "@react-native-google-signin/google-signin"
  ];
  
  // NOTE: The react-native-google-mobile-ads plugin is intentionally excluded
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
