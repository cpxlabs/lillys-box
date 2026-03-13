const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const APP_ROOT = path.resolve(__dirname, '..');
const REPO_ROOT = path.resolve(APP_ROOT, '..');
const APK_NAME = 'lillys-box.apk';

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

function getBuildArgs(outputPath = getAndroidApkOutputPath()) {
  return [
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
  ];
}

function run() {
  const outputPath = ensureAndroidOutputDir();
  const args = getBuildArgs(outputPath);

  if (process.argv.includes('--dry-run')) {
    console.log(outputPath);
    console.log(`npx ${args.join(' ')}`);
    return;
  }

  const result = spawnSync('npx', args, {
    cwd: APP_ROOT,
    stdio: 'inherit',
    env: process.env,
  });

  if (result.error) {
    throw result.error;
  }

  process.exit(result.status ?? 1);
}

if (require.main === module) {
  run();
}

module.exports = {
  getAndroidOutputDir,
  getAndroidApkOutputPath,
  ensureAndroidOutputDir,
  getBuildArgs,
  run,
};
