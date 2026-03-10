describe('build toolchain dependencies', () => {
  it('resolves @babel/types from the reanimated Babel plugin location', () => {
    const { createRequire } = require('module');
    const pluginPath = require.resolve('react-native-reanimated/plugin');
    const pluginRequire = createRequire(pluginPath);

    expect(pluginRequire.resolve('@babel/types')).toContain('@babel/types');
  });
});
