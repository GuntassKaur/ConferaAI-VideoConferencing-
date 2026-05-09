import mongoose, { Schema, Document } from 'mongoose';

export interface INote extends Document {
  meetingId: string;
  userId: string;
  content: string;
  updatedAt: Date;
}

const NoteSchema: Schema = new Schema({
  meetingId: { type: String, required: true },
  userId: { type: String, required: true },
  content: { type: String, default: '' },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Note || mongoose.model<INote>('Note', NoteSchema);
