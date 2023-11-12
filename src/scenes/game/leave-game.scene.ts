import { Scenes, Telegraf } from 'telegraf';
import { removeParticipant } from '../../services/participants.service.js';

export const leaveGameSceneRun = () => {
  const leaveGameScene = new Scenes.BaseScene<Scenes.SceneContext>(
    'leave_game',
  );

  leaveGameScene.enter(async (ctx) => {
    const gameId = ctx.scene.state['game'];
    const userId = ctx.from.id;
    // todo не удалять на прошедшие игры
    await removeParticipant(userId, gameId);

    await ctx.reply('Готово, вы больше не участвуете.');
    // todo отправить уведомление другому игроку

    await ctx.answerCbQuery();
    await ctx.scene.leave();
  });

  return leaveGameScene;
};

export const setLeaveGameSceneListener = (
  bot: Telegraf<Scenes.SceneContext>,
): void => {
  bot.action(/leave__(.+)/, (ctx) =>
    ctx.scene.enter('leave_game', { game: ctx.match[1] }),
  );
};
