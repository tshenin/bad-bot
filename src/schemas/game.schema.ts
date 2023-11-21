import { Schema, model, Document } from 'mongoose';
import { IParticipant } from './participant.schema.js';

export interface IGame {
  date: Date;
  coach?: string;
  capacity: number;
  type: GameType;
  level: GameLevel;
  participants: string[] | IParticipant[];
}

export enum GameType {
  training = 'Тренировка',
  game = 'Игра',
}

export enum GameLevel {
  a = 'A',
  b = 'B',
  c = 'C',
  d = 'D',
  e = 'E',
  ab = 'A/B',
  bc = 'B/C',
  cd = 'C/D',
  de = 'D/E',
}

const gameSchema = new Schema<IGame>({
  date: { type: Date, require: true },
  type: { type: String, enum: GameType, require: true },
  level: { type: String, enum: GameLevel, require: true },
  capacity: { type: Number, require: true },
  participants: [{ type: Schema.Types.ObjectId, ref: 'Participant' }],
  coach: String,
});

export const Game = model<IGame>('Game', gameSchema);

export type GameDocument = IGame & Document;
