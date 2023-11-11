import { Scenes, Telegraf } from 'telegraf';
import { getGames } from '../../services/games.service.js';
import { renderGameMessage } from '../../markup/messages.js';
import { renderGameButtons } from '../../markup/buttons.js';

export const showGamesSceneRun = () => {
  const showGamesScene = new Scenes.BaseScene<Scenes.SceneContext>(
    'show_games',
  );

  showGamesScene.enter(async (ctx) => {
    const games = await getGames();
    games.forEach((game) => {
      ctx.reply(renderGameMessage(game), {
        parse_mode: 'HTML',
        ...renderGameButtons(game),
      });
    });
    showGamesScene.leave();
  });

  return showGamesScene;
};

export const setShowGamesSceneListener = (
  bot: Telegraf<Scenes.SceneContext>,
): void => {
  bot.command('show_games', (ctx) => ctx.scene.enter('show_games'));
};
