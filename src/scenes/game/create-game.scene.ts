import {Scenes, Telegraf} from "telegraf";

export const createGameSceneRun = () => {
  // todo coach это тот кто создает игру
  const echoScene = new Scenes.BaseScene<Scenes.SceneContext>("create_game");
  // todo показать кнопки даты
  echoScene.enter(ctx => ctx.reply("Введите дату"));

  // todo показать кнопки времени
  echoScene.action("date_enter", (ctx) => ctx.reply("Выберите время"));

  // todo показать типы игр
  echoScene.action("time_enter", (ctx) => ctx.reply("Выберите тип игры"));

  // todo показать кнопки уровней
  echoScene.action("game_type_enter", (ctx) => ctx.reply("Выберите уровень"));

  // todo показать кнопки кол-ва мест 1-10
  echoScene.action("game_level_enter", (ctx) => ctx.reply("Сколько мест"));

  // todo показать кнопку создать и все описание тренировки
  echoScene.action("capacity_enter", (ctx) => {ctx.reply("Создать или отменить?")});

  echoScene.action("save", (ctx) => {
    ctx.reply("Сохранено");
    ctx.scene.leave();
  });

  echoScene.action("cancel", (ctx) => {
    ctx.reply("Отменено");
    ctx.scene.leave();
  });

  return echoScene;
}

export const setCreateGameSceneListener = (bot: Telegraf<Scenes.SceneContext>) => {
  bot.command('create_game', ctx => ctx.scene.enter('create_game'));
}
