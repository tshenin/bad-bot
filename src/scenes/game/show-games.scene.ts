import { Scenes, Telegraf } from 'telegraf';
import { getGames } from '../../services/games.service.js';
import { renderGameMessage } from '../../markup/messages.js';
import {renderAdminGameButtons, renderJoinGameButtons} from '../../markup/buttons.js';
import {isAdmin} from "../../services/utils.js";

export const showGamesSceneRun = () => {
  const showGamesScene = new Scenes.BaseScene<Scenes.SceneContext>(
    'show_games',
  );

  showGamesScene.enter(async (ctx) => {
    const games = await getGames();
    games.forEach((game) => {
      const buttons = renderJoinGameButtons(game);

      if (isAdmin(ctx.from.id)) {
        buttons.reply_markup['inline_keyboard'].push(renderAdminGameButtons(game));
      }

      ctx.reply(renderGameMessage(game), {
        parse_mode: 'HTML',
        ...buttons,
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
