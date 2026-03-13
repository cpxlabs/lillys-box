import path from 'path';

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

    expect(packageJson.scripts?.['build:android:apk']).toBe('node scripts/buildAndroidApk.js');
  });

  it('writes the Android APK to the repository-level Android folder', () => {
    const { getAndroidApkOutputPath, getBuildArgs } = require('../../../scripts/buildAndroidApk.js') as {
      getAndroidApkOutputPath: () => string;
      getBuildArgs: (outputPath: string) => string[];
    };

    const outputPath = getAndroidApkOutputPath();

    expect(outputPath).toBe(
      path.resolve(__dirname, '../../../../Android/lillys-box.apk')
    );
    expect(getBuildArgs(outputPath)).toEqual(
      expect.arrayContaining([
        'eas-cli',
        'build',
        '--local',
        '--platform',
        'android',
        '--profile',
        'preview',
        '--non-interactive',
        '--output',
        outputPath,
      ])
    );
  });
});
