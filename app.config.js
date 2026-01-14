module.exports = ({ config }) => {
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
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      package: "com.az1nn.petcaregame"
    },
    web: {
      favicon: "./assets/favicon.png"
    }
  };

  // Only add the AdMob plugin for native platforms (not for web)
  // This prevents plugin loading errors during web builds
  const plugins = [];
  
  // Check if we're building for web
  const isWeb = process.env.EXPO_PLATFORM === 'web';
  
  if (!isWeb) {
    plugins.push([
      "react-native-google-mobile-ads",
      {
        androidAppId: "ca-app-pub-3940256099942544~3347511713",
        iosAppId: "ca-app-pub-3940256099942544~1458002511"
      }
    ]);
  }

  return {
    ...baseConfig,
    plugins
  };
};
