import {
  IParticipant,
  Participant,
  ParticipantDocument,
} from '../schemas/participant.schema.js';
import {Game} from '../schemas/game.schema.js';
import {getGame} from "./games.service.js";
import {bot} from "./bot.service.js";
import {renderQueueMessage} from "../markup/messages.js";

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
  try {
    await Participant.findOneAndDelete({ tid, game }).exec();
  } catch (e) {
    console.error('Ошибка уведомления', e);
  }
};


export const removeParticipantAndNotifyQueue = async (participantId: number, gameId: string): Promise<void> => {
  await removeParticipant(participantId, gameId);

  // todo move notification part to it's own service and call separately
  const game = await getGame(gameId);
  if (game.participants.length >= game.capacity) {
    const participantIdToNotify = game.participants[game.capacity - 1].toString();
    const participantToNotify= await getParticipant(participantIdToNotify);

    if (participantToNotify?.chatId) {
      await bot.telegram.sendMessage(participantToNotify.chatId, renderQueueMessage(game), {parse_mode: 'HTML' })
    }
  }
}
