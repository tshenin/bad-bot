import {Scenes, Telegraf} from "telegraf";

export const bot = new Telegraf<Scenes.SceneContext & Scenes.WizardContext>(process.env.TOKEN);
