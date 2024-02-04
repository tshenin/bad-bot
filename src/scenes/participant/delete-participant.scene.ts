import {Scenes, Telegraf} from 'telegraf';
import {isAdmin} from "../../services/utils.js";
import {getParticipants, removeParticipantAndNotifyQueue} from '../../services/participants.service.js';
import {getGame} from '../../services/games.service.js';
import {renderYesNoButtons, renderParticipantsButtons} from '../../markup/buttons.js';
import {renderParticipantsMessage} from '../../markup/messages.js';

export const deleteParticipantSceneRun = () => {
  const deleteParticipantScene = new Scenes.BaseScene<Scenes.SceneContext>(
    'delete_participant',
  );

  deleteParticipantScene.enter(async (ctx) => {
    const gameId = ctx.scene.state['game'];
    const participantId = ctx.scene.state['participant'];

    if (gameId && participantId) {
      ctx.reply('Удалить участника из тренировки?', {
        parse_mode: 'HTML',
        ...renderYesNoButtons(['Да, удалить', 'Отмена'], 'delete_confirm'),
      });
    } else {
      ctx.reply('Такая тренировка или участник не были найдены');
    }
  });

  deleteParticipantScene.action('delete_confirm__yes', async ctx => {
    const gameId = ctx.scene.state['game'];
    const participantId = ctx.scene.state['participant'];

    await removeParticipantAndNotifyQueue(participantId, gameId);

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

  deleteParticipantScene.action('delete_confirm__no', async (ctx) => {
    if (isAdmin(ctx.from.id)) {
      const gameId = ctx.scene.state['game'];
      const game = await getGame(gameId);
      const participants = await getParticipants(gameId);

      await ctx.reply('Участники', renderParticipantsButtons(game, participants))
    }
  });

  return deleteParticipantScene;
};

export const setDeleteParticipantSceneListener = (
  bot: Telegraf<Scenes.SceneContext>,
): void => {
  bot.action(/delete_participant__(.+)__(.+)/, (ctx) => {
    ctx.scene.enter('delete_participant', { game: ctx.match[1], participant: ctx.match[2] })
  });
};
