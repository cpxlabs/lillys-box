const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      babel: {
        dangerouslyAddModulePathsToTranspile: ['react-native-google-mobile-ads']
      }
    },
    argv
  );

  // Add alias for react-native-google-mobile-ads on web
  config.resolve.alias['react-native-google-mobile-ads'] = require.resolve('./src/mocks/react-native-google-mobile-ads.web.js');

  return config;
};
