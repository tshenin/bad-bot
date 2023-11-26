import { Markup } from 'telegraf';
import {GameDocument, GameLevel, GameType} from '../schemas/game.schema.js';

export const adminButtons = (game: GameDocument) => ([Markup.button.callback('Удалить', `remove_game__${game.id}`)]);

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

export const renderYesNoButtons = (buttonsName: string[], key: string) => {
  const [yes, no] = buttonsName;

  return {
    ...Markup.inlineKeyboard([
      Markup.button.callback(yes, `${key}yes`),
      Markup.button.callback(no, `${key}no`),
    ]),
  };
};

export const renderDateButtons = (currentDate: Date) => {
  const dayOfDate = currentDate.getDate();
  const dateList = [0,1,2,3,4,5,6];

  const calcDay = (day: number, addedDay: number) => {
    return new Date().setDate(day + addedDay);
  }

  return {
    ...Markup.inlineKeyboard([
      dateList.map(date => Markup.button.callback(`${new Date(calcDay(dayOfDate, date)).getDate()}`, `date_enter__${calcDay(dayOfDate, date)}`))
    ])
  }
};

export const renderTimeButtons = () => {
  const timeList = ['10','11','12','18','19','20','21','22'];

  return {
    ...Markup.inlineKeyboard([
      timeList.map(time => Markup.button.callback(time, `time_enter__${time}`))
    ])
  }
};

export const renderGameTypeButtons = () => {

  return {
    ...Markup.inlineKeyboard([
      Object.values(GameType).map(type => Markup.button.callback(type, `type_enter__${type}`))
    ])
  }
};

export const renderGameLevelButtons = () => {

  return {
    ...Markup.inlineKeyboard([
      Object.values(GameLevel).map(level => Markup.button.callback(level, `level_enter__${level}`))
    ])
  }
};

export const renderCapacityButtons = () => {
  const capacityLimit = ['1','2','3','4','5','6','7','8'];

  return {
    ...Markup.inlineKeyboard([
      capacityLimit.map(participants => Markup.button.callback(participants, `capacity_enter__${participants}`))
    ])
  }
};
