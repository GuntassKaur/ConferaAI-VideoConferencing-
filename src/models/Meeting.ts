import mongoose, { Schema, Document } from 'mongoose';

export interface IMeeting extends Document {
  meetingId: string;
  hostId: mongoose.Types.ObjectId;
  title: string;
  startTime: Date;
  endTime?: Date;
  status: 'scheduled' | 'live' | 'completed';
  participants: mongoose.Types.ObjectId[];
  aiRecap?: {
    summary: string;
    actionItems: string[];
    keyPoints: string[];
    transcriptUrl?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const MeetingSchema: Schema = new Schema(
  {
    meetingId: { type: String, required: true, unique: true },
    hostId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date },
    status: { type: String, enum: ['scheduled', 'live', 'completed'], default: 'scheduled' },
    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    aiRecap: {
      summary: String,
      actionItems: [String],
      keyPoints: [String],
      transcriptUrl: String,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Meeting || mongoose.model<IMeeting>('Meeting', MeetingSchema);
