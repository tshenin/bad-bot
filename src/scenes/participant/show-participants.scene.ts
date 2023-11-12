import { Scenes, Telegraf } from 'telegraf';
import { getParticipants } from '../../services/participants.service.js';
import { renderParticipantsMessage } from '../../markup/messages.js';
import { getGame } from '../../services/games.service.js';

export const showParticipantsSceneRun = () => {
  const showParticipantsScene = new Scenes.BaseScene<Scenes.SceneContext>(
    'show_participants',
  );

  // todo показать кнопку join game
  showParticipantsScene.enter(async (ctx) => {
    const id = ctx.scene.state['game'];
    const game = await getGame(id);
    const participants = await getParticipants(id);
    await ctx.reply(renderParticipantsMessage(game, participants), {
      parse_mode: 'HTML',
    });
    await ctx.answerCbQuery();
    await ctx.scene.leave();
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
