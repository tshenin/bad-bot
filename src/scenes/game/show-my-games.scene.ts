import { Scenes, Telegraf } from 'telegraf';
import { getUserGames } from '../../services/games.service.js';
import { renderGameMessage } from '../../markup/messages.js';
import { renderMyGameButtons } from '../../markup/buttons.js';

export const showMyGamesSceneRun = () => {
  const showMyGamesScene = new Scenes.BaseScene<Scenes.SceneContext>(
    'show_my_games',
  );

  showMyGamesScene.enter(async (ctx) => {
    const games = await getUserGames(ctx.scene.state['user']);
    if (!games.length) {
      await ctx.reply('Вы пока никуда не записались');
      showMyGamesScene.leave();
      return;
    }

    games.forEach((game) => {
      ctx.reply(renderGameMessage(game), {
        parse_mode: 'HTML',
        ...renderMyGameButtons(game),
      });
    });
    showMyGamesScene.leave();
  });

  return showMyGamesScene;
};

export const setShowMyGamesSceneListener = (
  bot: Telegraf<Scenes.SceneContext>,
): void => {
  bot.command('my_games', (ctx) =>
    ctx.scene.enter('show_my_games', { user: ctx.from.id }),
  );
};
