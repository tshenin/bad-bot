import { Scenes, Telegraf } from 'telegraf';
import {getParticipant, removeParticipant} from '../../services/participants.service.js';
import {getGame} from "../../services/games.service.js";
import {renderQueueMessage} from "../../markup/messages.js";

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
    const game = await getGame(gameId);
    if (game.participants.length >= game.capacity) {
      const updatedParticipantId = game.participants[game.capacity - 1];
      const updatedParticipant = await getParticipant(updatedParticipantId as string);
      await ctx.telegram.sendMessage(updatedParticipant.chatId, renderQueueMessage(game), {parse_mode: 'HTML' })
    }
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
