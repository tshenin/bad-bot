import {GameDocument} from "../schemas/game.schema.js";
import {ParticipantDocument} from "../schemas/participant.schema.js";

export const renderGameMessage = (game: GameDocument): string => {
  return `Тренер: <b>${game.coach}</b>\nДата: <b>${game.date}</b>\nУчастников: <b>9/10</b>`;
}

export const renderParticipantsMessage = (participants: ParticipantDocument[]): string => {
  if (!participants.length) {
    return 'Пока никого нет';
  }

  return participants.map(p => p.name).join('\n');
}
