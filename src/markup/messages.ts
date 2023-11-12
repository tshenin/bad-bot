import { GameDocument } from '../schemas/game.schema.js';
import { ParticipantDocument } from '../schemas/participant.schema.js';
import { format } from 'date-fns';

export const renderGameMessage = (game: GameDocument): string => {
  let message = `Тренер: <b>${game.coach}</b>\n`;
  message += `Дата: <b>${format(game.date, 'dd.MM.yyyy k:mm')}</b>\n`;
  message += `Участников: <b>${game.participants?.length}/${game.capacity}</b>`;
  return message;
};

export const renderParticipantsMessage = (
  game: GameDocument,
  participants: ParticipantDocument[],
): string => {
  if (!participants.length) {
    return 'Пока никого нет';
  }
  let message = renderGameMessage(game) + '\n\n';
  message += participants
    .map((p, index) => {
      let message = index === 0 ? '<b>Участники</b>\n' : '';
      message += index === game.capacity ? '<b>В листе ожидания</b>\n' : '';
      message += p.name;
      return message;
    })
    .join('\n');

  return message;
};
