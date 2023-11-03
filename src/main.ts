import {Telegraf, Markup} from 'telegraf';
import 'dotenv/config'
import {GAMES} from "./data.js";

const bot = new Telegraf(process.env.TOKEN);

bot.start(async (ctx) => {
  await ctx.setMyCommands([{command: "show_games", description: "Show Available games"}]);
});

bot.command("show_games", async (ctx) => {
  const gameMessage = (game: { date: string, coach: string}) => `Тренер: <b>${game.coach}</b>\nДата: <b>${game.date}</b>`;

  GAMES.forEach(game => {
    ctx.reply(gameMessage(game), {
      parse_mode: 'HTML',
      ...Markup.inlineKeyboard([
        Markup.button.callback('Записаться', 'join'),
        Markup.button.callback('Участники', 'participants')
      ])
    })
  });
})

bot.launch();


// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))


