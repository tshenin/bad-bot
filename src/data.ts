import {Game} from "./models/game.model.js";
import {Participant} from "./models/participant.model.js";

export const GAMES: Game[] = [{
  id: '1',
  coach: "Саша Волосатый Волан",
  date: "23.12.2023",
  capacity: 10
}, {
  id: "2",
  coach: "Тимка нуб",
  date: "25.12.2023",
  capacity: 5
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

