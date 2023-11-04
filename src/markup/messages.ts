import {Game} from "../models/game.model.js";
import {Participant} from "../models/participant.model.js";

export const renderGameMessage = (game: Game): string => {
  return `Тренер: <b>${game.coach}</b>\nДата: <b>${game.date}</b>\nУчастников: <b>9/10</b>`;
}

export const renderParticipantsMessage = (participants: Participant[]): string => {
  return participants?.map(p => p.name)?.join('\n') ?? 'Пока никого нет';
}
