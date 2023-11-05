import {Game, IGame} from "../schemas/game.schema.js";

export const getGames = (): Promise<Game[]> => {
  return Game.find();
}

export const addGame =  async (game: IGame): Promise<void> => {
  const newGame = new Game({...game});
  await newGame.save();
};

export const removeGame =  (id: string): void => {
  Game.findByIdAndDelete(id)
};

export const getUserGames = (): void => {
  // todo: make aggregation
  // Game.findByIdAndDelete(id);

  // return games;
};
