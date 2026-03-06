import { PLAY_ACTIVITIES, getActivityById } from '../playActivities';

describe('playActivities', () => {
  it('includes games brainstorm session activity', () => {
    expect(PLAY_ACTIVITIES).toContainEqual({
      id: 'games_brainstorm_session',
      emoji: '🧠',
      nameKey: 'play.activities.gamesBrainstormSession',
    });
  });

  it('resolves games brainstorm session by id', () => {
    expect(getActivityById('games_brainstorm_session')).toEqual({
      id: 'games_brainstorm_session',
      emoji: '🧠',
      nameKey: 'play.activities.gamesBrainstormSession',
    });
  });
});
