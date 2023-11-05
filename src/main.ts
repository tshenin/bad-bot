import {Telegraf} from 'telegraf';
import 'dotenv/config'
import {getGames} from "./services/games.service.js";
import {renderGameButtons} from "./markup/buttons.js";
import {renderGameMessage, renderParticipantsMessage} from "./markup/messages.js";
import {addParticipant, getParticipants} from "./services/participants.service.js";
import {connect} from 'mongoose';

main().catch(err => console.log('mongoose', err));

async function main() {
  await connect(`mongodb://localhost:27017/${process.env.DB_NAME}`);
}

const bot = new Telegraf(process.env.TOKEN);

bot.start(async (ctx) => {
  await ctx.setMyCommands([{command: "show_games", description: "Show Available games"}]);
});

bot.command("show_games", async (ctx) => {
  getGames().forEach(game => {
    ctx.reply(renderGameMessage(game), {parse_mode: 'HTML', ...renderGameButtons(game)})
  });
})

bot.action(/join__(.+)/, (ctx) => {
  const gameID = ctx.match[1];
  ctx.answerCbQuery();
  const res = addParticipant({
    tid: ctx.from.id,
    name: (ctx.from.first_name + " " + ctx.from.last_name) || ctx.from.username,
    game: gameID
  });
  if (res) {
    ctx.reply('Готово, вы записались на игру к такому-то тренеру, в такое-то число.\nПриходите за 15 минут до тренировки.');
  } else {
    ctx.reply('Вы уже записаны на эту игру');
  }
});

bot.action(/participants__(.+)/, (ctx) => {
  const gameID = ctx.match[1];
  ctx.answerCbQuery();
  ctx.reply(renderParticipantsMessage(getParticipants(gameID)));
});

bot.launch();


// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

