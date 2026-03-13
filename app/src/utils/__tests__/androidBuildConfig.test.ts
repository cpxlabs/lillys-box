import { Buffer } from 'buffer';
import fs from 'fs';
import os from 'os';
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
    const { getAndroidApkOutputPath, getBuildArgs, getGradleArgs } = require('../../../scripts/buildAndroidApk.js') as {
      getAndroidApkOutputPath: () => string;
      getBuildArgs: () => string[];
      getGradleArgs: () => string[];
    };

    const outputPath = getAndroidApkOutputPath();

    expect(outputPath).toBe(
      path.resolve(__dirname, '../../../../Android/lillys-box.apk')
    );
    expect(getBuildArgs()).toEqual(
      expect.arrayContaining([
        'expo',
        'prebuild',
        '--platform',
        'android',
        '--clean',
      ])
    );
    expect(getGradleArgs()).toEqual(['assembleDebug']);
  });

  it('uses existing asset files for Expo app icons and splash screens', () => {
    const configFactory = require('../../../app.config.js') as () => {
      expo: {
        icon: string;
        splash: {
          image: string;
        };
        android: {
          adaptiveIcon: {
            foregroundImage: string;
          };
        };
      };
    };

    const config = configFactory().expo;
    const appRoot = path.resolve(__dirname, '../../../');
    const iconPath = path.resolve(appRoot, config.icon.replace('./', ''));
    const splashPath = path.resolve(appRoot, config.splash.image.replace('./', ''));
    const adaptiveIconPath = path.resolve(
      appRoot,
      config.android.adaptiveIcon.foregroundImage.replace('./', '')
    );

    expect(fs.existsSync(iconPath)).toBe(true);
    expect(fs.existsSync(splashPath)).toBe(true);
    expect(fs.existsSync(adaptiveIconPath)).toBe(true);
  });

  it('fails clearly when the local Gradle APK has not been generated', () => {
    const { copyBuiltApk } = require('../../../scripts/buildAndroidApk.js') as {
      copyBuiltApk: (outputPath: string, builtApkPath: string) => string;
    };
    const tempDir = os.tmpdir();

    expect(() =>
      copyBuiltApk(
        path.join(tempDir, 'lillys-box-test-output.apk'),
        path.join(tempDir, 'lillys-box-missing.apk')
      )
    ).toThrow(
      `Expected APK was not generated at ${path.join(tempDir, 'lillys-box-missing.apk')}.`
    );
  });

  it('copies a generated APK into the requested output path', () => {
    const { copyBuiltApk } = require('../../../scripts/buildAndroidApk.js') as {
      copyBuiltApk: (outputPath: string, builtApkPath: string) => string;
    };
    const tempDir = os.tmpdir();
    const sourcePath = path.join(tempDir, 'lillys-box-source.apk');
    const outputPath = path.join(tempDir, 'lillys-box-output.apk');
    const apkBuffer = Buffer.from('apk-binary-placeholder');

    try {
      fs.writeFileSync(sourcePath, apkBuffer);

      expect(copyBuiltApk(outputPath, sourcePath)).toBe(outputPath);
      expect(fs.readFileSync(outputPath)).toEqual(apkBuffer);
    } finally {
      if (fs.existsSync(sourcePath)) {
        fs.unlinkSync(sourcePath);
      }

      if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
      }
    }
  });
});
