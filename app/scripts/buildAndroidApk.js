const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const APP_ROOT = path.resolve(__dirname, '..');
const REPO_ROOT = path.resolve(APP_ROOT, '..');
const APK_NAME = 'lillys-box.apk';
const ANDROID_PROJECT_DIR = path.join(APP_ROOT, 'android');
const BUILT_APK_PATH = path.join(
  ANDROID_PROJECT_DIR,
  'app',
  'build',
  'outputs',
  'apk',
  'debug',
  'app-debug.apk'
);

function getAndroidOutputDir(repoRoot = REPO_ROOT) {
  return path.join(repoRoot, 'Android');
}

function getAndroidApkOutputPath(repoRoot = REPO_ROOT) {
  return path.join(getAndroidOutputDir(repoRoot), APK_NAME);
}

function ensureAndroidOutputDir(outputPath = getAndroidApkOutputPath()) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  return outputPath;
}

function getBuildArgs() {
  return [
    'expo',
    'prebuild',
    '--platform',
    'android',
    '--clean',
  ];
}

function getGradleCommand() {
  return process.platform === 'win32' ? 'gradlew.bat' : './gradlew';
}

function getGradleArgs() {
  return ['assembleDebug'];
}

function runCommand(command, args, cwd) {
  const result = spawnSync(command, args, {
    cwd,
    stdio: 'inherit',
    env: process.env,
  });

  if (result.error) {
    throw result.error;
  }

  if (result.signal) {
    console.error(`Android APK build was interrupted by signal ${result.signal}.`);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function getGeneratedApkPath() {
  return BUILT_APK_PATH;
}

function copyBuiltApk(outputPath = getAndroidApkOutputPath(), builtApkPath = BUILT_APK_PATH) {
  if (!fs.existsSync(builtApkPath)) {
    throw new Error(`Expected APK was not generated at ${builtApkPath}.`);
  }

  fs.copyFileSync(builtApkPath, outputPath);
  return outputPath;
}

function run() {
  const outputPath = ensureAndroidOutputDir();
  const prebuildArgs = getBuildArgs();
  const gradleCommand = getGradleCommand();
  const gradleArgs = getGradleArgs();

  if (process.argv.includes('--dry-run')) {
    console.log(outputPath);
    console.log(`npx ${prebuildArgs.join(' ')}`);
    console.log(`${gradleCommand} ${gradleArgs.join(' ')}`);
    return;
  }

  runCommand('npx', prebuildArgs, APP_ROOT);
  runCommand(gradleCommand, gradleArgs, ANDROID_PROJECT_DIR);
  copyBuiltApk(outputPath);
}

if (require.main === module) {
  run();
}

module.exports = {
  getAndroidOutputDir,
  getAndroidApkOutputPath,
  ensureAndroidOutputDir,
  getBuildArgs,
  getGradleArgs,
  getGradleCommand,
  getGeneratedApkPath,
  copyBuiltApk,
  run,
};
