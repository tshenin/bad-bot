import 'dotenv/config'
import {connect} from 'mongoose';

import {addGame, getGames} from "./services/games.service.js";
import {renderGameMessage} from "./markup/messages.js";
import {renderGameButtons} from "./markup/buttons.js";
import {bot} from "./services/bot.service.js";
import {createGameSceneRun, setCreateGameSceneListener} from "./scenes/game/create-game.scene.js";
import {Scenes, session} from "telegraf";
import {joinGameSceneRun, setJoinGameSceneListener} from "./scenes/game/join-game.scene.js";
import {
  setShowParticipantsSceneListener,
  showParticipantsSceneRun
} from "./scenes/participant/show-participants.scene.js";
import {message} from "telegraf/filters";
import {GAMES} from "./data.js";

dbConnection().catch(err => console.log('mongoose', err));

async function dbConnection(): Promise<void> {
  await connect(`mongodb://localhost:27017/${process.env.DB_NAME}`);
}

// set all scenes
const stage = new Scenes.Stage<Scenes.SceneContext>([createGameSceneRun(), joinGameSceneRun(), showParticipantsSceneRun()]);
bot.use(session());
bot.use(stage.middleware());

// set all scenes listeners
setCreateGameSceneListener(bot);
setJoinGameSceneListener(bot);
setShowParticipantsSceneListener(bot);


bot.start(async (ctx) => {
  await ctx.setMyCommands([{command: "show_games", description: "Показать доступные игры"}]);
});

bot.command("show_games", async (ctx) => {
  const games = await getGames();

  games.forEach(game => {
    ctx.reply(renderGameMessage(game), {parse_mode: 'HTML', ...renderGameButtons(game)})
  });
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


