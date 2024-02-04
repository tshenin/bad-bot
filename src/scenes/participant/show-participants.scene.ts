import { Scenes, Telegraf } from 'telegraf';
import { getParticipants, removeParticipantAndNotifyQueue } from '../../services/participants.service.js';
import {renderParticipantsMessage} from '../../markup/messages.js';
import {getGame} from '../../services/games.service.js';
import {isAdmin} from "../../services/utils.js";
import {renderParticipantsButtons, renderYesNoButtons} from "../../markup/buttons.js";

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

  showParticipantsScene.action(/delete_participant__(.+)/, (ctx) => {
    const participantId = ctx.match.at(1);
    ctx.session['sessionData'].participantId = participantId;

    ctx.reply('Удалить участника из тренировки?', {
      parse_mode: 'HTML',
      ...renderYesNoButtons(['Подтвердить', 'Отмена'], 'delete_confirm'),
    });
  })

  // todo move to delete participant scene
  showParticipantsScene.action('delete_confirm__yes', async ctx => {
    ctx.session['printActive'] = false;
    const gameId = ctx.scene.state['game'];

    await removeParticipantAndNotifyQueue(ctx.session['sessionData'].participantId, gameId);

    const participants = await getParticipants(gameId);
    const game = await getGame(gameId);

    if (isAdmin(ctx.from.id)) {
      await ctx.reply('Участники', renderParticipantsButtons(game, participants))
    } else {
      await ctx.reply(renderParticipantsMessage(ctx.session['sessionData'].game, participants), {
        parse_mode: 'HTML',
      });
    }
  });

  showParticipantsScene.action('delete_confirm__no', async (ctx) => {
    if (isAdmin(ctx.from.id)) {
      const gameId = ctx.scene.state['game'];
      const game = await getGame(gameId);
      const participants = await getParticipants(gameId);

      await ctx.reply('Участники', renderParticipantsButtons(game, participants))
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
