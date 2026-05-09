import mongoose, { Schema, Document } from 'mongoose';

export interface IRecap extends Document {
  meetingId: string;
  summary: string;
  keyPoints: string[];
  actionItems: { task: string; owner: string }[];
  score: number;
  createdAt: Date;
}

const RecapSchema: Schema = new Schema({
  meetingId: { type: String, required: true },
  summary: { type: String, required: true },
  keyPoints: [{ type: String }],
  actionItems: [{
    task: { type: String },
    owner: { type: String }
  }],
  score: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Recap || mongoose.model<IRecap>('Recap', RecapSchema);
