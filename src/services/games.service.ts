import {GAMES} from "../data.js";
import {Game} from "../models/game.model.js";

let games = [...GAMES];

export const getGames = (): Game[] => {
  return [...games];
}

export const addGame =  (game): void => {
  games.push(game);
};

export const removeGame =  (id): void => {
  games = games.filter(game => game.id !== id);
};

export const getUserGames = () => {
  // todo
  return games;
};
