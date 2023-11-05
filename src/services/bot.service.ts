import {Scenes, Telegraf} from "telegraf";

export const bot = new Telegraf<Scenes.SceneContext>(process.env.TOKEN);
