import { Schema, model } from 'mongoose';
export interface IGame {
    date: Date;
    coach?: string;
    capacity: number;
    type: GameType;
    level: GameLevel
}

export enum GameType {
    training = 'training',
    game = 'game'
}

export enum GameLevel {
    a = 'a',
    b = 'b',
    c = 'c',
    d = 'd',
    e = 'e',
    ab = 'ab',
    bc = 'bc',
    cd = 'cd',
    de = 'de'
}

// 2. Create a Schema corresponding to the document interface.
const gameSchema = new Schema<IGame>({
    date: { type: Date, require: true },
    type: { type: String, enum: GameType, require: true },
    level: { type: String, enum: GameLevel, require: true },
    capacity: { type: Number, require: true },
    coach: String,
});

// 3. Create a Model.
export const Game = model<IGame>('Game', gameSchema);
