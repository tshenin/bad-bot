import {Scenes, Telegraf} from 'telegraf';
import {addParticipant} from '../../services/participants.service.js';
import {isAdmin} from "../../services/utils.js";

export const addParticipantSceneRun = () => {
  const addParticipantScene = new Scenes.BaseScene<Scenes.SceneContext>(
    'add_participant',
  );

  addParticipantScene.enter(async (ctx) => {
    ctx.session["gameId"] = ctx.scene.state['game'];

    if (isAdmin(ctx.from.id)) {
      ctx.session['typingNameInProgress'] = true;
      ctx.reply('Введите имя и фамилию игрока');
    } else {
      ctx.reply('Недостаточно прав');
    }

    await ctx.answerCbQuery();
  });


  addParticipantScene.on('message', async ctx => {
    if (ctx.session['typingNameInProgress']) {
      const name = ctx.message['text'];
      const game = ctx.session["gameId"];

      await addParticipant({
        // for manually created players telegram id has to be generated
        tid: Date.now(),
        name,
        game,
      });
      ctx.reply('Добавлен');
      ctx.session['typingNameInProgress'] = false;

      await ctx.scene.leave();
    }
    else {
      await ctx.scene.leave();
    }
  });

  return addParticipantScene;
};

export const setAddParticipantSceneListener = (
  bot: Telegraf<Scenes.SceneContext>,
): void => {
  bot.action(/add_participant__(.+)/, (ctx) => {
    ctx.scene.enter('add_participant', { game: ctx.match[1] })
  });
};
