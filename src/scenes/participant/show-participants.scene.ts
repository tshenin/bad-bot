import {Scenes, Telegraf} from 'telegraf';
import {getParticipants} from '../../services/participants.service.js';
import {renderParticipantsMessage} from '../../markup/messages.js';
import {getGame} from '../../services/games.service.js';
import {isAdmin} from "../../services/utils.js";
import {renderParticipantsButtons} from "../../markup/buttons.js";

export const showParticipantsSceneRun = () => {
  const showParticipantsScene = new Scenes.BaseScene<Scenes.SceneContext>(
    'show_participants',
  );

  showParticipantsScene.enter(async (ctx) => {
    ctx.session['sessionData'] = {};

    const gameId = ctx.scene.state['game'];
    const game = await getGame(gameId);
    const participants = await getParticipants(gameId);

    if (isAdmin(ctx.from.id)) {
      await ctx.reply('Участники', renderParticipantsButtons(game, participants));
    } else {
      await ctx.reply(renderParticipantsMessage(game, participants), {
        parse_mode: 'HTML',
      });
    }
  });

  return showParticipantsScene;
};

export const setShowParticipantsSceneListener = (
  bot: Telegraf<Scenes.SceneContext>,
): void => {
  bot.action(/participants__(.+)/, (ctx) =>
    ctx.scene.enter('show_participants', { game: ctx.match[1] }),
  );
};
