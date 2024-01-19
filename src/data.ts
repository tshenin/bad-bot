import { GameLevel, IGame } from './schemas/game.schema.js';
import { add, sub } from 'date-fns';

export const GAMES: IGame[] = [
  {
    coach: 'Сашка',
    gamePrice: 100,
    trainingPrice: 100,
    duration: '1:00',
    place: 'корт',
    capacity: 3,
    level: GameLevel.ab,
    date: sub(new Date(), { days: 3 }),
    participants: [],
  },
  {
    coach: 'Тимка',
    gamePrice: 100,
    trainingPrice: 100,
    duration: '1:30',
    capacity: 5,
    place: 'корт',
    level: GameLevel.cd,
    date: add(new Date(), { months: 2 }),
    participants: [],
  },
  {
    coach: 'Сашка',
    gamePrice: 100,
    trainingPrice: 100,
    place: 'корт',
    duration: '2:00',
    capacity: 3,
    level: GameLevel.bc,
    date: add(new Date(), { months: 3 }),
    participants: [],
  },
  {
    coach: 'Тимка',
    capacity: 5,
    gamePrice: 100,
    trainingPrice: 100,
    place: 'корт',
    duration: '1:30',
    level: GameLevel.de,
    date: add(new Date(), { months: 3, days: 5 }),
    participants: [],
  },
];
