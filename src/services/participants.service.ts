import {IParticipant, Participant, ParticipantDocument} from "../schemas/participant.schema.js";


export const getParticipants = async (gameId: string): Promise<ParticipantDocument[]> => {
  return Participant.find({game: gameId});
}

export const addParticipant = async (p: IParticipant): Promise<void> => {
  // todo добавить проверку что такой участник уже есть
  // todo добавить очередь
  const newParticipant = new Participant(p);
  await newParticipant.save();
}

export const removeParticipant = async (tid: string, game: string): Promise<void> => {
  Participant.findOneAndDelete({tid, game})
}

