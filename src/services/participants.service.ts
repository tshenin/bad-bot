import {
  IParticipant,
  Participant,
  ParticipantDocument,
} from '../schemas/participant.schema.js';
import { Game } from '../schemas/game.schema.js';

export const getParticipants = async (
  gameId: string,
): Promise<ParticipantDocument[]> => Participant.find({ game: gameId });

export const getParticipant = async (
  id: string,
): Promise<ParticipantDocument> => {
  return Participant.findById(id);
};

export const addParticipant = async (p: IParticipant): Promise<boolean> => {
  const participant = await Participant.findOne({ tid: p.tid, game: p.game });
  if (participant) {
    // todo return custom error type
    return false;
  }
  const newParticipant = await new Participant(p).save();
  const game = await Game.findById(p.game);
  game.participants.push(newParticipant.id);
  await game.save();
  return true;
};

export const removeParticipant = async (
  tid: number,
  game: string,
): Promise<void> => {
  await Participant.findOneAndDelete({ tid, game }).exec();
};
