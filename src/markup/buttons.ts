import { Markup } from 'telegraf';
import {COACHES, GameDocument, GameLevel, PLACES} from '../schemas/game.schema.js';
import {add, format} from "date-fns";

export const renderAdminGameButtons = (game: GameDocument) => ([Markup.button.callback('Удалить', `remove_game__${game.id}`)]);

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
      Markup.button.callback(yes, `${key}__yes`),
      Markup.button.callback(no, `${key}__no`),
    ]),
  };
};

export const renderDateButtons = (startDate: Date = new Date(), days: number = 7) => {
  const dateFormat = 'dd.MM';
  const dateButtons = new Array(days)
      .fill(startDate)
      .map((startDate, index) => {
        const date = add(startDate, { days: index });
        const formattedDate = format(date, dateFormat);
        return Markup.button.callback(formattedDate, `date_enter__${formattedDate}`)
      });

  return { ...Markup.inlineKeyboard(dateButtons) };
}

export const renderCoachButtons = () => {
  return {
    ...Markup.inlineKeyboard([
      COACHES.map(coach => Markup.button.callback(coach, `coach_enter__${coach}`))
    ])
  }
}

export const renderPlaceButtons = () => {

  return {
    ...Markup.inlineKeyboard([
      PLACES.map(place => Markup.button.callback(place, `place_enter__${place}`))
    ])
  }
}

export const renderDurationButtons = () => {
  const placeList = ['1','1:30', '2'];

  return {
    ...Markup.inlineKeyboard([
      placeList.map(durationTime => Markup.button.callback(durationTime, `duration_enter__${durationTime}`))
    ])
  }
}

export const renderTimeButtons = () => {
  const timeList1 = ['17','17:30','18','18:30','19','19:30'];
  const timeList2 = ['20','19:30','20','20:30','21','21:30','22'];

  return {
    ...Markup.inlineKeyboard([
      timeList1.map(time => Markup.button.callback(time, `time_enter__${time}`)),
      timeList2.map(time => Markup.button.callback(time, `time_enter__${time}`)),
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
  const capacityLimit1 = ['4','5','6','7','8','9','10','11'];
  const capacityLimit2 = ['12','14','15','16','17','18','19','20'];

  return {
    ... Markup.inlineKeyboard([
      capacityLimit1.map(participants => Markup.button.callback(participants, `capacity_enter__${participants}`)),
      capacityLimit2.map(participants => Markup.button.callback(participants, `capacity_enter__${participants}`))
    ])
  }
};
