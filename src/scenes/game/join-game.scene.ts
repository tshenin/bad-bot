import {Scenes, Telegraf} from 'telegraf';
import {addParticipant} from '../../services/participants.service.js';

export const joinGameSceneRun = () => {
  const joinGameScene = new Scenes.BaseScene<Scenes.SceneContext>('join_game');

  joinGameScene.enter(async ctx => {
    // ctx.reply('Выберите желаемый тип события', renderGameTypeButtons());
    //
    // joinGameScene.action(/game_type_enter__(.+)/, async(ctx) => {
    //   const eventType = ctx.match.at(1);
      const id = ctx.scene.state['game'];
      const name = `${ctx.from.first_name} ${ctx.from.last_name || ctx.from.username}`;

      // todo не записывать на прошедшие игры
      const result = await addParticipant({
        tid: ctx.from.id,
        name,
        // eventType,
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
      await ctx.reply('Готово, вы записались.\nНе опаздывайте.');


      await ctx.answerCbQuery();
      await ctx.scene.leave();
    // });
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
