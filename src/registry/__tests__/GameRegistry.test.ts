import { gameRegistry } from '../../registry/GameRegistry';

const mockComponent = () => null;

function makeGame(id: string, enabled = true) {
  return {
    id,
    nameKey: `${id}.name`,
    descriptionKey: `${id}.desc`,
    emoji: '🎮',
    category: 'casual' as const,
    navigator: mockComponent,
    providers: [mockComponent as any],
    isEnabled: enabled,
  };
}

describe('GameRegistry', () => {
  it('returns undefined for an unregistered id', () => {
    expect(gameRegistry.getGame('no-such-game-ever')).toBeUndefined();
  });

  it('registers a game and retrieves it by id', () => {
    gameRegistry.register(makeGame('gr-unit-a'));
    const game = gameRegistry.getGame('gr-unit-a');
    expect(game).toBeDefined();
    expect(game!.id).toBe('gr-unit-a');
    expect(game!.emoji).toBe('🎮');
  });

  it('throws when the same id is registered twice', () => {
    expect(() => gameRegistry.register(makeGame('gr-unit-a'))).toThrow(/gr-unit-a/);
  });

  it('getAllGames returns only enabled games', () => {
    gameRegistry.register(makeGame('gr-unit-enabled', true));
    gameRegistry.register(makeGame('gr-unit-disabled', false));

    const ids = gameRegistry.getAllGames().map((g) => g.id);
    expect(ids).toContain('gr-unit-enabled');
    expect(ids).not.toContain('gr-unit-disabled');
  });

  it('getAllGames returns all previously registered enabled games', () => {
    // gr-unit-a and gr-unit-enabled were registered in earlier tests
    const ids = gameRegistry.getAllGames().map((g) => g.id);
    expect(ids).toContain('gr-unit-a');
    expect(ids).toContain('gr-unit-enabled');
  });
});
