const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.sourceExts = [...config.resolver.sourceExts, 'tsx', 'ts'];

config.resolver.resolveRequest = (context, moduleName, platform) => {
  const originalResolveRequest = context.resolveRequest;

  if (platform === 'web') {
    if (moduleName.includes('../Utilities/Platform')) {
      return {
        type: 'sourceFile',
        filePath: require.resolve('react-native-web/dist/exports/Platform'),
      };
    }

    if (moduleName === 'react-native-google-mobile-ads') {
      return {
        type: 'empty',
      };
    }
  }

  return originalResolveRequest(context, moduleName, platform);
};

module.exports = config;
