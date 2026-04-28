import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { connectDB } from '@/lib/mongodb';
import Meeting from '@/models/Meeting';
import { AccessToken } from 'livekit-server-sdk';
import crypto from 'crypto';


export async function POST(req: Request) {
  try {
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL || process.env.LIVEKIT_URL;

    if (!apiKey || !apiSecret || !wsUrl) {
      return NextResponse.json({ success: false, message: "Server misconfigured: LiveKit credentials missing" }, { status: 500 });
    }

    const body = await req.json().catch(() => ({}));
    const { userId, name } = body;

    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized: Missing userId" }, { status: 401 });
    }

    const meetingId = crypto.randomUUID().substring(0, 8);
    const participantName = name || `User-${userId.substring(0, 4)}`;

    // 1. Save in MongoDB (Optional for Guest Mode)
    try {
      const db = await connectDB();
      if (db) {
        await Meeting.create({ 
          meetingId,
          name: name || `Meeting ${meetingId}`,
          hostId: userId,
          status: 'active',
          participants: [userId],
          createdAt: new Date()
        });
      }
    } catch (dbError) {

      console.warn("MongoDB connection failed, proceeding in Guest Mode:", dbError);
    }



    // 2. Generate LiveKit Token
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

    return NextResponse.json({ 
      success: true,
      meetingId, 
      token,
      wsUrl
    });

  } catch (error: any) {
    console.error("Meeting Creation Failure:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
