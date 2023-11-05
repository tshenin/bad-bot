import {Scenes, Telegraf} from "telegraf";
import {addParticipant} from "../../services/participants.service.js";

export const joinGameSceneRun = (): Scenes.BaseScene => {
  const joinGameScene = new Scenes.BaseScene<Scenes.SceneContext>("join_game");

  // todo чекнуть про WizardScene
  joinGameScene.enter(async ctx => {
    const id = ctx.scene.state["game"];
    if (!ctx.from.last_name) {
      // todo запросить имя
      await ctx.reply('У вас не указана фамилия');
    } else {
      const name = `${ctx.from.first_name} ${ctx.from.last_name}`;
      await addParticipant({
        tid: ctx.from.id,
        name,
        game: id
      });
      // todo дать еще раз время и дату
      await ctx.reply('Готово, вы записались на игру.\nНе опаздывайте.');
    }

    await ctx.answerCbQuery();
    await ctx.scene.leave();
  });

  return joinGameScene;
}

export const setJoinGameSceneListener = (bot: Telegraf<Scenes.SceneContext>): void => {
  bot.action(/join__(.+)/, ctx => ctx.scene.enter('join_game', {game: ctx.match[1]}));
}
