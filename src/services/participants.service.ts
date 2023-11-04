import {PARTICIPANTS} from "../data.js";
import {Participant} from "../models/participant.model.js";

let participants = [...PARTICIPANTS];

export const getParticipants = (gameId: string): Participant[] => {
  return participants.filter(p => p.game === gameId);
}

export const addParticipant = (p: Participant): boolean => {
  if (participants.find(pa => pa.game === p.game && pa.tid === p.tid)) {
    return false;
  }
  participants.push(p);
  return true;
}

export const removeParticipant = (tid: string): void => {
  participants = participants.filter(p => p.tid !== tid);
}

