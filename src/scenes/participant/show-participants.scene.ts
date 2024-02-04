import { Scenes, Telegraf } from 'telegraf';
import {
  addParticipant,
  getParticipants,
  removeParticipantAndNotifyQueue,
} from '../../services/participants.service.js';
import {renderParticipantsMessage} from '../../markup/messages.js';
import {getGame} from '../../services/games.service.js';
import {isAdmin} from "../../services/utils.js";
import {renderParticipantsButtons, renderYesNoButtons} from "../../markup/buttons.js";

export const showParticipantsSceneRun = () => {
  const showParticipantsScene = new Scenes.BaseScene<Scenes.SceneContext>(
    'show_participants',
  );

  // todo показать кнопку join game
  showParticipantsScene.enter(async (ctx) => {
    ctx.session['myData'] = {};
    ctx.session['printActive'] = false;

    const id = ctx.scene.state['game'];
    const game = await getGame(id);
    const participants = await getParticipants(id);
    ctx.session['myData'].participants = participants;
    ctx.session['myData'].game = game;

    if (isAdmin(ctx.from.id)) {
      await ctx.reply('Участники', renderParticipantsButtons(participants));
    } else {
      await ctx.reply(renderParticipantsMessage(game, participants), {
        parse_mode: 'HTML',
      });
    }
  });

  showParticipantsScene.action(/delete_participant__(.+)/, (ctx) => {
    const participantId = ctx.match.at(1);
    ctx.session['myData'].participantId = participantId;

    ctx.reply('Удалить участника из игры?', {
      parse_mode: 'HTML',
      ...renderYesNoButtons(['Подтвердить', 'Отмена'], 'delete_confirm'),
    });
  })

  // todo move to delete participant scene
  showParticipantsScene.action('delete_confirm__yes', async ctx => {
    ctx.session['printActive'] = false;
    const gameId = ctx.scene.state['game'];

    await removeParticipantAndNotifyQueue(ctx.session['myData'].participantId, gameId);

    const participants = await getParticipants(gameId);

    if (isAdmin(ctx.from.id)) {
      await ctx.reply('Участники', renderParticipantsButtons(participants))
    } else {
      await ctx.reply(renderParticipantsMessage(ctx.session['myData'].game, participants), {
        parse_mode: 'HTML',
      });
    }
  });

  showParticipantsScene.action('delete_confirm__no', async (ctx) => {
    ctx.session['printActive'] = false;

    if (isAdmin(ctx.from.id)) {
      await ctx.reply('Участники', renderParticipantsButtons(ctx.session['myData'].participants))
    } else {
      const { game, participants } = ctx.session['myData'];

      await ctx.reply(renderParticipantsMessage(game, participants), {
        parse_mode: 'HTML',
      });
    }
  });

  showParticipantsScene.action(/add_participant/, (ctx) => {
    ctx.session['printActive'] = true;

    ctx.reply('Введите имя и фамилию игрока');

    showParticipantsScene.on('message', async ctx => {
      if (ctx.session['printActive']) {
        ctx.session['myData'].addedParticipant = ctx.message['text'];

        const tid = Date.now();

        await addParticipant({
          tid,
          name: ctx.session['myData'].addedParticipant,
          game: ctx.scene.state['game'],
        });
        ctx.reply('Добавлен');

        await ctx.answerCbQuery();
        await ctx.scene.leave();
      }
      else {
        await ctx.scene.leave();
      }
    });
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
