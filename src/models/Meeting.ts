import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMeeting extends Document {
  roomId: string;
  name: string;
  hostId: string;
  createdAt: Date;
  participants: string[];
  status: 'waiting' | 'active' | 'ended';
  recap?: {
    title: string;
    tldr: string;
    keyPoints: string[];
    actionItems: { task: string; owner: string }[];
    decisions: string[];
    sentiment: string;
    engagementScore: number;
  };
  // Stores the last session's recap summary for Pre-Meeting Brief context
  previousRecap?: {
    tldr: string;
    keyPoints: string[];
    decisions: string[];
  };
  // Live health telemetry saved every 60s during the session
  healthData?: {
    latestScore: number;
    status: string;
    insights: string[];
    participantTalkTimes: Record<string, number>;
    updatedAt: Date;
  };
  // Scheduled agenda items for Pre-Meeting Brief
  agenda?: string[];
}

const MeetingSchema: Schema<IMeeting> = new Schema({
  roomId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  hostId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  participants: [{ type: String }],
  status: {
    type: String,
    enum: ['waiting', 'active', 'ended'],
    default: 'waiting',
  },
  agenda: [{ type: String }],
  recap: {
    title: String,
    tldr: String,
    keyPoints: [String],
    actionItems: [{ task: String, owner: String }],
    decisions: [String],
    sentiment: String,
    engagementScore: Number,
  },
  previousRecap: {
    tldr: String,
    keyPoints: [String],
    decisions: [String],
  },
  healthData: {
    latestScore: Number,
    status: String,
    insights: [String],
    participantTalkTimes: { type: Map, of: Number },
    updatedAt: Date,
  },
});

// Prevent Mongoose from compiling the model multiple times in Next.js development
const Meeting: Model<IMeeting> =
  mongoose.models.Meeting || mongoose.model<IMeeting>('Meeting', MeetingSchema);

export default Meeting;
