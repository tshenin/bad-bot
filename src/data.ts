import {Participant} from "./models/participant.model.js";
import {GameLevel, GameType, IGame} from "./schemas/game.schema.js";

export const GAMES: IGame[] = [{
  coach: "Саша Волосатый Волан",
  capacity: 10,
  type: GameType.game,
  level: GameLevel.a,
  date: new Date()
  },
  {
  coach: "Тимка нуб",
  capacity: 5,
  type: GameType.training,
  level: GameLevel.b,
  date: new Date()
}];

export const PARTICIPANTS: Participant[] = [{
  id: "1",
  tid: '1',
  game: "1",
  name: "Миша",
}, {
  id: "3",
  tid: '1',
  game: "1",
  name: "Маша",
}, {
  id: "2",
  tid: '2',
  game: "2",
  name: "Дима",
}, {
  id: "4",
  tid: '4',
  game: "2",
  name: "Артур",
}]

