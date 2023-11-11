import { GameLevel, GameType, IGame } from './schemas/game.schema.js';
import { add, sub } from 'date-fns';

export const GAMES: IGame[] = [
  {
    coach: 'Сашка',
    capacity: 3,
    type: GameType.game,
    level: GameLevel.a,
    date: sub(new Date(), { days: 3 }),
    participants: [],
  },
  {
    coach: 'Тимка',
    capacity: 5,
    type: GameType.training,
    level: GameLevel.b,
    date: add(new Date(), { months: 2 }),
    participants: [],
  },
  {
    coach: 'Сашка',
    capacity: 3,
    type: GameType.game,
    level: GameLevel.bc,
    date: add(new Date(), { months: 3 }),
    participants: [],
  },
  {
    coach: 'Тимка',
    capacity: 5,
    type: GameType.training,
    level: GameLevel.c,
    date: add(new Date(), { months: 3, days: 5 }),
    participants: [],
  },
];
