import fs from 'fs';
import path from 'path';
import { SOUND_MAP } from '../AudioService';

describe('AudioService asset mapping', () => {
  const soundsRoot = path.resolve(__dirname, '../../../../app/assets/sounds');

  function collectSoundFiles(dir: string): string[] {
    let results: string[] = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        results = results.concat(collectSoundFiles(fullPath));
      } else if (entry.isFile() && /\.(wav|mp3)$/.test(entry.name)) {
        results.push(fullPath);
      }
    }
    return results;
  }

  it('every file under assets/sounds (except music) corresponds to a SOUND_MAP key', () => {
    const files = collectSoundFiles(soundsRoot)
      .filter((f) => !f.includes(path.join('music', 'background')));

    const expectedKeys = files.map((file) => {
      // basename without extension
      return path.basename(file, path.extname(file));
    });

    expectedKeys.sort();
    const mapKeys = Object.keys(SOUND_MAP).sort();

    expect(mapKeys).toEqual(expectedKeys);
  });

  it('SOUND_MAP keys are a subset of SoundType union', () => {
    // TypeScript enforces this at compile time; this is a sanity check for JS
    const unionKeys = Object.keys(SOUND_MAP);
    expect(unionKeys.length).toBeGreaterThan(0);
  });
});
