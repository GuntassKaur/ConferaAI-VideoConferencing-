import mongoose, { Schema, Document } from 'mongoose';

export interface IMeeting extends Document {
  roomId: string;
  name: string;
  hostId: string;
  status: 'active' | 'completed' | 'scheduled';
  startTime: Date;
  endTime?: Date;
  participants: string[];
}

const MeetingSchema: Schema = new Schema({
  roomId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  hostId: { type: String, required: true },
  status: { type: String, enum: ['active', 'completed', 'scheduled'], default: 'active' },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  participants: [{ type: String }],
});

export default mongoose.models.Meeting || mongoose.model<IMeeting>('Meeting', MeetingSchema);
