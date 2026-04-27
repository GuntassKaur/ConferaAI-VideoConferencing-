import mongoose from "mongoose";

const MeetingSchema = new mongoose.Schema({
  meetingId: String,
  name: String,
  hostId: String,
  participants: [String],
  status: { type: String, default: 'idle' },
  recap: mongoose.Schema.Types.Mixed,
  joinRequests: [{
    userId: String,
    name: String,
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }
  }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Meeting || mongoose.model("Meeting", MeetingSchema);
