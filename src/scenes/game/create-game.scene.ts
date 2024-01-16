import {Scenes, Telegraf} from "telegraf";
import {getYear, setMinutes} from "date-fns";
import {
  renderCapacityButtons,
  renderCoachButtons,
  renderDateButtons,
  renderDurationButtons,
  renderGameLevelButtons,
  renderPlaceButtons,
  renderTimeButtons,
  renderYesNoButtons,
} from "../../markup/buttons.js";
import {GameLevel, IGame} from "../../schemas/game.schema.js";
import {addGame} from "../../services/games.service.js";

export const createGameSceneRun = () => {
  // todo coach это тот кто создает игру
  const createGameScene = new Scenes.BaseScene<Scenes.SceneContext>("create_game");
  // todo показать кнопки даты
  createGameScene.enter(ctx => {
    ctx.session['myData'] = {}
    ctx.reply("Выберите день", {
          ...renderDateButtons(new Date())
        })
  });

  // todo показать кнопки времени
  createGameScene.action(/date_enter__(.+)/, (ctx) => {
    const day = ctx.match.at(1);
    ctx.session['myData'].day = day;

    ctx.reply("Выберите время", renderTimeButtons());
  });

  // todo показать кнопки продолжительности
  createGameScene.action(/time_enter__(.+)/, (ctx) => {
    const time = ctx.match.at(1);
    ctx.session['myData'].time = time;

    ctx.reply("Выберите продолжительность(часы:минуты)", renderDurationButtons());
  });

  // todo показать кнопки c выбором места
  createGameScene.action(/duration_enter__(.+)/, (ctx) => {
    const durationTime = ctx.match.at(1);
    ctx.session['myData'].duration = durationTime;

    ctx.reply("Выберите место проведения", renderPlaceButtons());
  });

  // todo показать кнопки тренеров
  createGameScene.action(/place_enter__(.+)/, (ctx) => {
    ctx.session['myData'].place = ctx.match.at(1);

    ctx.reply("Выберите тренера", renderCoachButtons());
  });

  // todo показать кнопки скила
  createGameScene.action(/coach_enter__(.+)/, (ctx) => {
    ctx.session['myData'].coach = ctx.match.at(1);

    ctx.reply("Выберите уровень", renderGameLevelButtons());
  });

  // todo показать кнопки кол-ва мест 1-10
  createGameScene.action(/level_enter__(.+)/, (ctx) => {
    ctx.session['myData'].level = ctx.match.at(1) as GameLevel;
    ctx.reply("Сколько мест", renderCapacityButtons())
  });

  createGameScene.action(/capacity_enter__(.+)/, async ctx => {
    ctx.session['myData'].capacity = Number(ctx.match.at(1));
    ctx.reply("Введите стоимость игры");

    createGameScene.on("message", ctx => {
      if (!ctx.session['myData'].gamePrice) {
        ctx.session['myData'].gamePrice =  parseInt(ctx.message['text']) || 0;

        ctx.reply("Введите стоимость тренировки");
      } else {
        // todo показать кнопку создать и все описание тренировки
        ctx.session['myData'].trainingPrice =  parseInt(ctx.message['text']) || 0;
        const { day, time, coach, level, duration, place, capacity, trainingPrice, gamePrice } = ctx.session['myData'];

        let message = `Дата: ${day} ${time}\n`;
        message = message + `Продолжительность: ${duration}\n`
        message = message + `Место: ${place}\n`
        message = message + `Тренер: ${coach}\n`
        message = message + `Уровень: ${level}\n`
        message = message + `Численность: ${capacity}\n`
        message = message + `Стоимость: ${gamePrice}/${trainingPrice}\n`

        ctx.reply(message, renderYesNoButtons(['Создать', 'Отменить'], 'create'));
      }
    });
  });

  createGameScene.action("create__yes", async ctx => {
    const { day, time, duration, place, coach, level, capacity, trainingPrice, gamePrice } = ctx.session['myData'];

    const [hours, minutes] = time.split(':');
    try {
      const [dayOfMonth, month] = day.split('.');
      const year = getYear(new Date());
      const date = setMinutes(new Date(year, month - 1, dayOfMonth, hours), minutes);

      // todo: типизровать
      await addGame({ date, coach, capacity, duration, place, level, trainingPrice, gamePrice, participants: [] } as IGame);

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
