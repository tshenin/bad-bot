import {Scenes, Telegraf} from "telegraf";
import {
  renderCapacityButtons,
  renderDateButtons,
  renderGameLevelButtons,
  renderGameTypeButtons,
  renderTimeButtons,
  renderYesNoButtons,
} from "../../markup/buttons.js";
import {GameLevel, GameType} from "../../schemas/game.schema.js";
import {addGame} from "../../services/games.service.js";

let date: Date;
let coach: string;
let capacity: number;
let type: GameType;
let level: GameLevel;

export const createGameSceneRun = () => {
  // todo coach это тот кто создает игру
  const echoScene = new Scenes.BaseScene<Scenes.SceneContext>("create_game");
  // todo показать кнопки даты
  echoScene.enter(ctx => ctx.reply("Выберите число", {
     ...renderDateButtons(new Date())
    })
  );

  // todo показать кнопки времени
  echoScene.action(/date_enter__(.+)/, (ctx) => {
    const dayOfDate = Number(ctx.match.at(1))
    date = new Date(dayOfDate);

    ctx.reply("Выберите время", renderTimeButtons());
  });

  // todo показать типы игр
  echoScene.action(/time_enter__(.+)/, (ctx) => {
    date.setHours(Number(ctx.match.at(1)));

    ctx.reply("Выберите тип игры", renderGameTypeButtons());
  });

  // todo показать кнопки уровней
  echoScene.action(/type_enter__(.+)/, (ctx) => {
    type = ctx.match.at(1) as GameType;

    ctx.reply("Выберите уровень", renderGameLevelButtons());
  });

  // todo показать кнопки кол-ва мест 1-10
  echoScene.action(/level_enter__(.+)/, (ctx) => {
    level = ctx.match.at(1) as GameLevel;
    ctx.reply("Сколько мест", renderCapacityButtons())
  });

  // todo показать кнопку создать и все описание тренировки
  echoScene.action(/capacity_enter__(.+)/, async ctx => {
    capacity = Number(ctx.match.at(1));

    const { first_name, last_name } = ctx.update.callback_query.from;
    coach = `${first_name} ${last_name}`

    let message = `Дата: ${date.getDate()}.${date.getMonth()} ${date.getHours()}:00\n`;
    message =  message + `Тренер: ${coach}\n`
    message = message + `Уровень: ${level}\n`
    message = message + `Тип: ${type}\n`
    message = message + `Численность: ${capacity}\n`

    await ctx.reply(message, renderYesNoButtons(['Создать', 'Отменить'], 'create__'));
  });

  echoScene.action("create__yes", async ctx => {

    try {
      await addGame({ date, coach, capacity, type, level, participants: [] });
      ctx.reply("Сохранено");
    } catch (e) {
      ctx.reply("Что-то пошло не так, попробуйте повторить");
    }

    ctx.scene.leave();
  });

  echoScene.action("create__no", (ctx) => {
    ctx.reply("Отменено");
    ctx.scene.leave();
  });

  return echoScene;
}

export const setCreateGameSceneListener = (bot: Telegraf<Scenes.SceneContext>) => {
  bot.command('create_game', ctx => ctx.scene.enter('create_game'));
}
