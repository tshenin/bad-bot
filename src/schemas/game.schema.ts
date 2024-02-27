import { Schema, model, Document } from 'mongoose';
import { IParticipant } from './participant.schema.js';

export interface IGame {
  date: Date;
  duration: string;
  coach: string;
  place: string;
  type: GameType;
  capacity: number;
  level: GameLevel;
  price: number;
  participants: string[] | IParticipant[];
}

export enum GameType {
  training = 'Отработка',
  game = 'Игра',
}

export const COACHES = [
  ['Акентьев Женя', 'Жадан Оксана'],
  ['Чернова Анна', 'Химич Александр'],
  ['Без тренера']
];

export const PLACES = [
  ['Сибирь-Арена'], ['1-ое Мочищенское шоссе 6'], ['Вокзальная магистраль 15']
];

export enum GameLevel {
  ab = 'A/B',
  bc = 'B/C',
  cd = 'C/D',
  de = 'D/E',
}

const gameSchema = new Schema<IGame>({
  date: { type: Date, require: true },
  duration: { type: String, require: true },
  level: { type: String, enum: GameLevel, require: true },
  capacity: { type: Number, require: true },
  type: { type: String, enum: GameType, require: true },
  price: { type: Number, require: true },
  place: { type: String, require: true },
  participants: [{ type: Schema.Types.ObjectId, ref: 'Participant' }],
  coach: String,
});

export const Game = model<IGame>('Game', gameSchema);

export type GameDocument = IGame & Document;
