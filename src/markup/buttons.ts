import {Markup} from "telegraf";
import {GameDocument} from "../schemas/game.schema.js";

export const renderGameButtons = (game: GameDocument) => {
  return {
    ...Markup.inlineKeyboard([
      Markup.button.callback('Записаться', `join__${game.id}`),
      Markup.button.callback('Участники', `participants__${game.id}`)
    ])
  }
}
