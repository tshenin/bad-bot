import {Scenes, Telegraf} from "telegraf";
import {getGames} from "./games.service.js";
import {getParticipants} from "./participants.service.js";
import {format, getTime} from "date-fns";

import * as dotenv from 'dotenv';
import path from 'path';
dotenv.config({path: path.resolve('./', '.env')});

export const bot = new Telegraf<Scenes.SceneContext>(process.env.TOKEN);

let gameNotifier;

export const runGameNotifier = (): void => {
  const TIME = 5400000;
  const HALF_TIME = 2700000;

  if (!gameNotifier) {
    try {
      gameNotifier = setInterval(async () => {
        const games = await getGames();

        games.forEach(async ({id, date}) => {
          if (getTime(date) < (getTime(new Date()) + TIME + HALF_TIME)) {
            const participant = await getParticipants(id);
            const dateFormated = format(date, 'dd.MM k:mm');
            const { chatId } = participant.at(0);

            chatId && bot.telegram.sendMessage(chatId, `${dateFormated} начинается тренировка.`)
          }
        });
        }, HALF_TIME)
    }
    catch (e) {
      console.error('Ошибка уведомления', e);
    }
  }
}
