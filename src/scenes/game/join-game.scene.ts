import {Scenes, Telegraf} from 'telegraf';
import {addParticipant} from '../../services/participants.service.js';
import {renderGameTypeButtons} from "../../markup/buttons.js";

export const joinGameSceneRun = () => {
  const joinGameScene = new Scenes.BaseScene<Scenes.SceneContext>('join_game');

  joinGameScene.enter(ctx => {
    ctx.reply('Выбирите желаемый тип события', renderGameTypeButtons());

    joinGameScene.action(/type_enter__(.+)/, async(ctx) => {
      const type = ctx.match.at(1);
      const id = ctx.scene.state['game'];
      const name = `${ctx.from.first_name} ${ctx.from.last_name || ctx.from.username}`;

      // todo не записывать на прошедшие игры
      const result = await addParticipant({
        tid: ctx.from.id,
        name,
        type,
        game: id,
        chatId: ctx.chat.id
      });

      if (!result) {
        await ctx.reply('Вы уже записаны на эту игру');
        await ctx.answerCbQuery();
        await ctx.scene.leave();
        return;
      }

      // todo дать еще раз время и дату
      await ctx.reply('Готово, вы записались на игру.\nНе опаздывайте.');


      await ctx.answerCbQuery();
      await ctx.scene.leave();
    });
  });

  return joinGameScene;
};

export const setJoinGameSceneListener = (
  bot: Telegraf<Scenes.SceneContext>,
): void => {
  bot.action(/join__(.+)/, (ctx) =>
    ctx.scene.enter('join_game', { game: ctx.match[1] }),
  );
};
