#!/usr/bin/env node
/**
 * check-locale-keys.js
 *
 * Diffs top-level keys between all locale files under src/locales/*.json.
 * Exits with code 1 if any locale is missing keys present in en.json,
 * or has extra keys absent from en.json.
 *
 * Usage:
 *   node scripts/check-locale-keys.js
 *
 * Add to CI:
 *   - name: Check locale key parity
 *     run: node app/scripts/check-locale-keys.js
 */

const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(__dirname, '..', 'src', 'locales');
const BASE_LOCALE = 'en.json';

function flattenKeys(obj, prefix = '') {
  let keys = [];
  for (const [k, v] of Object.entries(obj)) {
    const full = prefix ? `${prefix}.${k}` : k;
    if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
      keys = keys.concat(flattenKeys(v, full));
    } else {
      keys.push(full);
    }
  }
  return keys;
}

const files = fs.readdirSync(LOCALES_DIR).filter((f) => f.endsWith('.json'));
const basePath = path.join(LOCALES_DIR, BASE_LOCALE);

if (!fs.existsSync(basePath)) {
  console.error(`Base locale not found: ${basePath}`);
  process.exit(1);
}

const baseKeys = new Set(flattenKeys(JSON.parse(fs.readFileSync(basePath, 'utf8'))));
let hasErrors = false;

for (const file of files) {
  if (file === BASE_LOCALE) continue;
  const filePath = path.join(LOCALES_DIR, file);
  const localeKeys = new Set(flattenKeys(JSON.parse(fs.readFileSync(filePath, 'utf8'))));

  const missing = [...baseKeys].filter((k) => !localeKeys.has(k));
  const extra = [...localeKeys].filter((k) => !baseKeys.has(k));

  if (missing.length > 0) {
    console.error(`\n[${file}] Missing ${missing.length} key(s) present in ${BASE_LOCALE}:`);
    missing.forEach((k) => console.error(`  - ${k}`));
    hasErrors = true;
  }
  if (extra.length > 0) {
    console.error(`\n[${file}] Has ${extra.length} extra key(s) not in ${BASE_LOCALE}:`);
    extra.forEach((k) => console.error(`  + ${k}`));
    hasErrors = true;
  }
  if (missing.length === 0 && extra.length === 0) {
    console.log(`[${file}] ✓ All keys match ${BASE_LOCALE}`);
  }
}

if (hasErrors) {
  console.error('\nLocale key parity check FAILED. Fix the mismatches above.');
  process.exit(1);
} else {
  console.log('\nLocale key parity check PASSED.');
}
