import { Markup } from 'telegraf';
import { GameDocument } from '../schemas/game.schema.js';
import {add, format, startOfDay} from "date-fns";

export const renderJoinGameButtons = (game: GameDocument) => {
  return {
    ...Markup.inlineKeyboard([
      Markup.button.callback('Записаться', `join__${game.id}`),
      Markup.button.callback('Участники', `participants__${game.id}`),
    ]),
  };
};

export const renderMyGameButtons = (game: GameDocument) => {
  return {
    ...Markup.inlineKeyboard([
      Markup.button.callback('Участники', `participants__${game.id}`),
      Markup.button.callback('Отменить участие', `leave__${game.id}`),
    ]),
  };
};

export const renderNext7DaysButtons = () => {
  const days = new Array(7).fill(startOfDay(new Date())).map((d, i) => add(d, { days: i }))
  return {
    ...Markup.inlineKeyboard(days.map(day => {
      return Markup.button.callback(format(day, 'EEEEEE d.M'), `create_game_date__${format(day, 'd.M.yyyy')}`);
    })),
  };
}
