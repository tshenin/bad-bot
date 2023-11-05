import 'dotenv/config'
import {connect} from 'mongoose';

import {addGame, getGames} from "./services/games.service.js";
import {renderGameMessage, renderParticipantsMessage} from "./markup/messages.js";
import {renderGameButtons} from "./markup/buttons.js";
import {addParticipant, getParticipants} from "./services/participants.service.js";
import {GAMES} from "./data.js";
import {message} from "telegraf/filters";
import {bot} from "./services/bot.service.js";
import {createGameSceneRun, setCreateGameSceneListener} from "./scenes/game/create-game.scene.js";
import {Scenes, session} from "telegraf";

dbConnection().catch(err => console.log('mongoose', err));
async function dbConnection() {
  await connect(`mongodb://localhost:27017/${process.env.DB_NAME}`);
}

// set all scenes
const stage = new Scenes.Stage<Scenes.SceneContext>([createGameSceneRun()]);
bot.use(session());
bot.use(stage.middleware());

// set all scenes listeners
setCreateGameSceneListener(bot);


bot.start(async (ctx) => {
  await ctx.setMyCommands([{command: "show_games", description: "Show Available games"}]);
});

bot.command("show_games", async (ctx) => {
  const games = await getGames();

  games.forEach(game => {
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

bot.on(message('text'), async (ctx) => {
  if (ctx.message.text === "mock games") {
    GAMES.forEach(game => {
      addGame(game)
    })
  }
})

bot.launch();


// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))


