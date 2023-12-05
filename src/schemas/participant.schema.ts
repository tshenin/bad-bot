import { Schema, model, Document, InferSchemaType } from 'mongoose';
import { Game } from './game.schema.js';

const participantSchema = new Schema({
  tid: { type: Number, require: true },
  name: { type: String, require: true },
  chatId: { type: Number, require: true },
  game: { type: Schema.Types.ObjectId, ref: 'Game' },
});

participantSchema.pre('findOneAndDelete', async function (next) {
  const participant = await this.model
    .findOne<ParticipantDocument>(this.getQuery())
    .exec();

  await Game.updateOne(
    { _id: participant.game },
    { $pull: { participants: participant._id } },
  ).exec();

  next();
});
export const Participant = model('Participant', participantSchema);
export type IParticipant = InferSchemaType<typeof participantSchema>;
export type ParticipantDocument = IParticipant & Document;
