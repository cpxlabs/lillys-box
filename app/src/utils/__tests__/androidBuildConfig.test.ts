describe('android build configuration', () => {
  it('defines an installable APK EAS profile for Android builds', () => {
    const easJson = require('../../../eas.json') as {
      build?: {
        preview?: {
          android?: {
            buildType?: string;
          };
        };
        production?: {
          android?: {
            buildType?: string;
          };
        };
      };
    };

    expect(easJson.build?.preview?.android?.buildType).toBe('apk');
    expect(easJson.build?.production?.android?.buildType).toBe('app-bundle');
  });

  it('exposes a package script for generating the Android APK', () => {
    const packageJson = require('../../../package.json') as {
      scripts?: Record<string, string>;
    };

    expect(packageJson.scripts?.['build:android:apk']).toContain('--profile preview');
    expect(packageJson.scripts?.['build:android:apk']).toContain('--platform android');
  });
});
