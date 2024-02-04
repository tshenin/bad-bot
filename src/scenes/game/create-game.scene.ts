import {Scenes, Telegraf} from "telegraf";
import {getYear, setMinutes} from "date-fns";
import {
  renderCapacityButtons,
  renderCoachButtons,
  renderDateButtons,
  renderDurationButtons,
  renderGameLevelButtons,
  renderGameTypeButtons,
  renderPlaceButtons,
  renderTimeButtons, renderYesNoButtons,
} from "../../markup/buttons.js";
import {GameLevel} from "../../schemas/game.schema.js";
import {addGame} from "../../services/games.service.js";

export const createGameSceneRun = () => {
  const createGameScene = new Scenes.BaseScene<Scenes.SceneContext>("create_game");
  createGameScene.enter(ctx => {
    ctx.session['myData'] = {}
    ctx.reply("Выберите день", {
          ...renderDateButtons(new Date())
        })
  });

  createGameScene.action(/date_enter__(.+)/, (ctx) => {
    const day = ctx.match.at(1);
    ctx.session['myData'].day = day;

    ctx.reply("Выберите время", renderTimeButtons());
  });

  createGameScene.action(/time_enter__(.+)/, (ctx) => {
    const time = ctx.match.at(1);
    ctx.session['myData'].time = time;

    ctx.reply("Выберите продолжительность", renderDurationButtons());
  });

  createGameScene.action(/duration_enter__(.+)/, (ctx) => {
    const durationTime = ctx.match.at(1);
    ctx.session['myData'].duration = durationTime;

    ctx.reply("Выберите место проведения", renderPlaceButtons());
  });

  createGameScene.action(/place_enter__(.+)/, (ctx) => {
    ctx.session['myData'].place = ctx.match.at(1);

    ctx.reply("Выберите тип игры", renderGameTypeButtons());
  });

  // todo показать кнопки тренеров
  createGameScene.action(/type_enter__(.+)/, (ctx) => {
    ctx.session['myData'].type = ctx.match.at(1);

    ctx.reply("Выберите тренера", renderCoachButtons());
  });

  createGameScene.action(/coach_enter__(.+)/, (ctx) => {
    ctx.session['myData'].coach = ctx.match.at(1);

    ctx.reply("Выберите уровень", renderGameLevelButtons());
  });

  createGameScene.action(/level_enter__(.+)/, (ctx) => {
    ctx.session['myData'].level = ctx.match.at(1) as GameLevel;
    ctx.reply("Сколько мест", renderCapacityButtons())
  });

  createGameScene.action(/capacity_enter__(.+)/, async ctx => {
    ctx.session['myData'].capacity = Number(ctx.match.at(1));
    ctx.reply("Введите стоимость игры");
    createGameScene.on("message", ctx => {
      ctx.session['myData'].price = parseInt(ctx.message['text']) || 0;
      const {day, time, coach, level, duration, place, capacity, price} = ctx.session['myData'];

      let message = `Дата: ${day} ${time}\n`;
      message = message + `Продолжительность: ${duration}\n`
      message = message + `Место: ${place}\n`
      message = message + `Тренер: ${coach}\n`
      message = message + `Уровень: ${level}\n`
      message = message + `Численность: ${capacity}\n`
      message = message + `Стоимость: ${price}\n`

      ctx.reply(message, renderYesNoButtons(['Создать', 'Отменить'], 'create'));
    });
  });

  createGameScene.action("create__yes", async ctx => {
    const { day, time, duration, place, coach, type, level, capacity, price } = ctx.session['myData'];

    const [hours, minutes] = time.split(':');
    try {
      const [dayOfMonth, month] = day.split('.');
      const year = getYear(new Date());
      const date = setMinutes(new Date(year, month - 1, dayOfMonth, hours), minutes);

      await addGame({ date, coach, capacity, duration, place, type, level, price, participants: [] });

      ctx.reply("Сохранено");
    } catch (e) {
      console.error(e)
      ctx.reply("Что-то пошло не так, попробуйте повторить");
    }

    ctx.scene.leave();
  });

  createGameScene.action("create__no", (ctx) => {
    ctx.reply("Отменено");
    ctx.scene.leave();
  });

  return createGameScene;
}

export const setCreateGameSceneListener = (bot: Telegraf<Scenes.SceneContext>) => {
  bot.command('create_game', ctx => ctx.scene.enter('create_game'));
}
