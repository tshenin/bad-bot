import {Game, GameDocument, IGame} from "../schemas/game.schema.js";

export const getGames = async (): Promise<GameDocument[]> => {
  return Game.find({});
}

export const addGame =  async (game: IGame): Promise<void> => {
  const newGame = new Game({...game});
  await newGame.save();
};

export const removeGame =  (id: string): void => {
  Game.findByIdAndDelete(id)
};

export const getUserGames = (): void => {};
