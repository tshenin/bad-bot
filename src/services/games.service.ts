import { Game, GameDocument, IGame } from '../schemas/game.schema.js';
import { Participant } from '../schemas/participant.schema.js';
import {getParticipants, removeParticipant} from "./participants.service.js";

export const getGame = async (id: string): Promise<GameDocument> => {
  return Game.findById(id.trim()).exec();
};

export const getGames = async (): Promise<GameDocument[]> => {
  return Game.find({ date: { $gte: new Date() } })
    .sort('date')
    .exec();
};

export const addGame = async (game: IGame): Promise<void> => {
  const newGame = new Game({ ...game });
  await newGame.save();
};

export const removeGame = async (id: string): Promise<GameDocument> => {
  const participants = await getParticipants(id);
  participants.forEach(async item => await removeParticipant(item.tid, id))

  return Game.findByIdAndDelete(id.trim()).exec();
};

export const getUserGames = async (tid: string): Promise<GameDocument[]> => {
  const participations = await Participant.find({ tid }).exec();
  const games = participations.map((p) => p.game);

  return await Game.find({ date: { $gte: new Date() } })
    .where('_id')
    .in(games)
    .sort('date')
    .exec();
};
