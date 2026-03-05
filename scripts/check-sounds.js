/**
 * Small utility to verify audio asset directory and SOUND_MAP consistency.
 * Run with `node scripts/check-sounds.js` from workspace root.
 *
 * This script is intentionally light-weight and does not require TypeScript.
 */
const fs = require('fs');
const path = require('path');

// Sound map import requires transpilation; we simply replicate the file inspection logic here
const soundsRoot = path.join(__dirname, '../app/assets/sounds');

function collectFiles(dir) {
  let results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(collectFiles(full));
    } else if (/\.(wav|mp3)$/i.test(entry.name)) {
      results.push(full);
    }
  }
  return results;
}

const files = collectFiles(soundsRoot).filter((f) => !f.includes(path.join('music', 'background')));
const keys = files.map((f) => {
  const parentFolder = path.basename(path.dirname(f));
  const base = path.basename(f, path.extname(f));
  return parentFolder === 'pet' ? `pet_${base}` : base;
});

console.log('Audio files found (excluding background music):');
keys.forEach((k) => console.log(' -', k));
console.log(`Total count: ${keys.length}`);

console.log(`
If you use SOUND_MAP in code, make sure it has exactly these keys.`);
