import {GameLevel, GameType, IGame} from "./schemas/game.schema.js";

export const GAMES: IGame[] = [
  {
    coach: "Саша Волосатый Волан",
    capacity: 10,
    type: GameType.game,
    level: GameLevel.a,
    date: new Date(),
    participants: []
  },
  {
    coach: "Тимка нуб",
    capacity: 5,
    type: GameType.training,
    level: GameLevel.b,
    date: new Date(),
    participants: []
  }
];

