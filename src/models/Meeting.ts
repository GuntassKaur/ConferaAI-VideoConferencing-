import mongoose from "mongoose";

const MeetingSchema = new mongoose.Schema({
  meetingId: { type: String, unique: true, required: true },
  name: String,
  hostId: String,
  participants: [String],
  status: { type: String, enum: ['active', 'ended', 'idle'], default: 'idle' },
  notes: { type: String, default: "" },
  notesLastEditedBy: String,
  notesUpdatedAt: Date,
  recap: {
    tldr: String,
    keyPoints: [String],
    actionItems: [{ task: String, owner: String }],
    sentiment: String,
    engagementScore: Number
  },
  joinRequests: [{
    userId: String,
    name: String,
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }
  }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Meeting || mongoose.model("Meeting", MeetingSchema);
