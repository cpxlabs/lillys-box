import fs from 'fs';
import path from 'path';

describe('game registrations', () => {
  it('keeps the GBA emulator enabled in the registry', () => {
    const registrationsSource = fs.readFileSync(
      path.resolve(__dirname, '../gameRegistrations.ts'),
      'utf8',
    );

    expect(registrationsSource).toMatch(
      /register\(\{\s*id:\s*'gba-emulator',[^\n]*navigator:\s*GbaEmulatorNavigator,[^\n]*isEnabled:\s*true\s*\}\);/,
    );
  });
});
