const en = require('../en.json');
const ptBR = require('../pt-BR.json');

describe('Weather Wizard locale keys', () => {
  const difficultyKeys = ['chooseDifficulty', 'easy', 'normal', 'hard'] as const;
  const gameKeys = ['watchAd', 'magic', 'tryDifferentWeather'] as const;
  const weatherKeys = ['rain', 'sun', 'snow', 'wind'] as const;

  it('defines the Weather Wizard home difficulty labels in both locales', () => {
    difficultyKeys.forEach((key) => {
      expect(en.weatherWizard.home[key]).toBeTruthy();
      expect(ptBR.weatherWizard.home[key]).toBeTruthy();
    });
  });

  it('keeps Weather Wizard text English in pt-BR', () => {
    expect(ptBR.selectGame.weatherWizard.description).toBe(en.selectGame.weatherWizard.description);

    ['subtitle', 'play', 'instructions', 'bestScore', ...difficultyKeys].forEach((key) => {
      expect(ptBR.weatherWizard.home[key]).toBe(en.weatherWizard.home[key]);
    });

    ['scene', 'need', 'choose', 'complete', 'playAgain', ...gameKeys].forEach((key) => {
      expect(ptBR.weatherWizard.game[key]).toBe(en.weatherWizard.game[key]);
    });

    weatherKeys.forEach((key) => {
      expect(ptBR.weatherWizard.game.weather[key]).toBe(en.weatherWizard.game.weather[key]);
    });
  });
});
