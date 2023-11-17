import {Composer, Scenes, Telegraf} from "telegraf";
import {renderNext7DaysButtons} from "../../markup/buttons.js";



export const createGameSceneRun = () => {
  const stepHandler = new Composer<Scenes.WizardContext>();
  stepHandler.action(/create_game_date__(.+)/, async (ctx) => {
    ctx.scene.session["date"] = ctx.match[1];
    return ctx.wizard.next();
  });

  const createGameScene = new Scenes.WizardScene<Scenes.WizardContext>("create_game", async ctx => {
    if (ctx.from.id.toString() === process.env.ATID) {
      await ctx.reply("Выберите день тренировки", renderNext7DaysButtons());
    } else {
      await ctx.reply("Команда недоступна");
      await ctx.scene.leave();
    }
    return ctx.wizard.next();
  },
    stepHandler,
    async (ctx) => {

    console.log(ctx.scene.session["date"])
    await ctx.reply(`Дата: ${ctx.wizard.state['data'].date}\nВыберите время тренировки`);
    await ctx.scene.leave();
  });

  // // todo показать кнопки времени
  // createGameScene.action("date_enter", (ctx) => ctx.reply("Выберите время"));
  //
  // // todo показать типы игр
  // createGameScene.action("time_enter", (ctx) => ctx.reply("Выберите тип игры"));
  //
  // // todo показать кнопки уровней
  // createGameScene.action("game_type_enter", (ctx) => ctx.reply("Выберите уровень"));
  //
  // // todo показать кнопки кол-ва мест 1-10
  // createGameScene.action("game_level_enter", (ctx) => ctx.reply("Сколько мест"));
  //
  // // todo показать кнопку создать и все описание тренировки
  // createGameScene.action("capacity_enter", (ctx) => {ctx.reply("Создать или отменить?")});
  //
  // createGameScene.action("save", (ctx) => {
  //   ctx.reply("Сохранено");
  //   ctx.scene.leave();
  // });
  //
  // createGameScene.action("cancel", (ctx) => {
  //   ctx.reply("Отменено");
  //   ctx.scene.leave();
  // });

  return createGameScene;
}

export const setCreateGameSceneListener = (bot: Telegraf<Scenes.WizardContext>) => {
  bot.hears('Создать новую игру', ctx => ctx.scene.enter('create_game'));
}
