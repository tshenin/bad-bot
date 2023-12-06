import {Scenes, Telegraf} from "telegraf";
import {getGames} from "./games.service.js";
import {getParticipants} from "./participants.service.js";
import { format } from "date-fns";

export const bot = new Telegraf<Scenes.SceneContext>(process.env.TOKEN);

let gameNotify;

export const runGameNotify = async (ctx) => {
    const HOUR = 3600000;
    const HAF_HOUR = 180000;
    const games = await getGames();

    if (!gameNotify) {
        gameNotify = setInterval(() => {
            games.forEach(async ({_id, date}) => {

                if (date.getTime() < new Date().getTime() + HOUR) {
                    const participant = await getParticipants(_id);

                    const dateFormated =  format(date, 'dd.MM k:mm')
                    ctx.telegram.sendMessage(
                        participant.at(0).chatId,
                        `${dateFormated} начинется тренировка, удачной игры`
                    )
                }
            });
        }, HAF_HOUR)
    }

}
