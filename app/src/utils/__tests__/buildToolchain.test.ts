import { createRequire } from 'module';

describe('build toolchain dependencies', () => {
  it('keeps @babel/generator in runtime dependencies for production web exports', () => {
    const packageJson = require('../../../package.json') as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };

    expect(packageJson.dependencies?.['@babel/generator']).toBeDefined();
    expect(packageJson.devDependencies?.['@babel/generator']).toBeUndefined();
  });

  it('resolves @babel/types from the reanimated Babel plugin location', () => {
    const pluginPath = require.resolve('react-native-reanimated/plugin');
    const pluginRequire = createRequire(pluginPath);
    const resolvedPath = pluginRequire.resolve('@babel/types');

    expect(resolvedPath).toBeDefined();
  });

  it('resolves @babel/generator from the nested worklets Babel plugin location', () => {
    const reanimatedPluginPath = require.resolve('react-native-reanimated/plugin');
    const reanimatedPluginRequire = createRequire(reanimatedPluginPath);
    const workletsPluginPath = reanimatedPluginRequire.resolve('react-native-worklets/plugin');
    const workletsPluginRequire = createRequire(workletsPluginPath);
    const resolvedPath = workletsPluginRequire.resolve('@babel/generator');

    expect(resolvedPath).toBeDefined();
  });
});
