import { GameDocument } from '../schemas/game.schema.js';
import { ParticipantDocument } from '../schemas/participant.schema.js';

export const renderGameMessage = (game: GameDocument): string => {
  let message = `Тренер: <b>${game.coach}</b>\n`;
  message += `Дата: <b>${game.date}</b>\n`;
  message += `Участников: <b>${game.participants?.length}/${game.capacity}</b>`;
  return message;
};

export const renderParticipantsMessage = (
  participants: ParticipantDocument[],
): string => {
  if (!participants.length) {
    return 'Пока никого нет';
  }

  return participants.map((p) => p.name).join('\n');
};
