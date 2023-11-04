import {Game} from "../models/game.model.js";
import {Markup} from "telegraf";

export const renderGameButtons = (game: Game) => {
  return {
    ...Markup.inlineKeyboard([
      Markup.button.callback('Записаться', `join__${game.id}`),
      Markup.button.callback('Участники', `participants__${game.id}`)
    ])
  }
}
