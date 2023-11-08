import {Schema, model, Document, InferSchemaType} from 'mongoose';

const participantSchema = new Schema({
    tid: { type: Number, require: true },
    name: { type: String,  require: true },
    game: { type: Schema.Types.ObjectId, ref: 'Game' },
});

export const Participant = model('Participant', participantSchema);
export type IParticipant = InferSchemaType<typeof participantSchema>;
export type ParticipantDocument = IParticipant & Document;
