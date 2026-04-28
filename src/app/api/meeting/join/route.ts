import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { connectDB } from '@/lib/mongodb';
import Meeting from '@/models/Meeting';
import { AccessToken } from 'livekit-server-sdk';

export async function POST(req: Request) {
  try {
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL || process.env.LIVEKIT_URL;

    if (!apiKey || !apiSecret || !wsUrl) {
      return NextResponse.json({ success: false, message: "Server misconfigured: LiveKit credentials missing" }, { status: 500 });
    }

    await connectDB();
    const body = await req.json().catch(() => ({}));
    const { meetingId, userId, name } = body;

    if (!meetingId || !userId) {
      return NextResponse.json({ success: false, message: "Missing meetingId or userId" }, { status: 400 });
    }

    // 1. Check in DB
    const meeting = await Meeting.findOne({ meetingId });
    if (!meeting) {
      return NextResponse.json({ success: false, message: "Meeting not found in registry" }, { status: 404 });
    }

    // 2. Generate LiveKit Token
    const participantName = name || `User-${userId.substring(0, 4)}`;
    const at = new AccessToken(apiKey, apiSecret, {
      identity: userId,
      name: participantName,
    });

    at.addGrant({ 
      roomJoin: true, 
      room: meetingId, 
      canPublish: true, 
      canSubscribe: true 
    });

    const token = await at.toJwt();

    // 3. Update participants in DB
    if (!meeting.participants.includes(userId)) {
      meeting.participants.push(userId);
      await meeting.save();
    }

    return NextResponse.json({ 
      success: true, 
      token,
      wsUrl,
      meeting: {
        id: meeting.meetingId,
        name: meeting.name
      }
    });

  } catch (error: any) {
    console.error("Meeting Join Failure:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
