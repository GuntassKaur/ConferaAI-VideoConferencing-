import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { AccessToken } from 'livekit-server-sdk';
import connectToDatabase from '@/lib/mongodb';
import Meeting from '@/models/Meeting';

export async function POST(req: NextRequest) {
  try {
    // 1. Safe Env Usage Check
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL || process.env.LIVEKIT_URL;

    if (!apiKey || !apiSecret || !wsUrl) {
      console.error('LiveKit credentials missing from environment');
      return NextResponse.json(
        { error: 'Server is misconfigured with LiveKit credentials' },
        { status: 500 }
      );
    }

    // 2. Logic inside function only
    const body = await req.json().catch(() => ({}));
    const { roomId, participantName } = body;

    if (!roomId || !participantName) {
      return NextResponse.json(
        { error: 'Missing roomId or participantName' },
        { status: 400 }
      );
    }

    // Connect to MongoDB and update Meeting
    await connectToDatabase();
    
    // Using $addToSet to prevent the same participant from being added multiple times
    await Meeting.findOneAndUpdate(
      { roomId },
      { 
        $set: { status: 'active' },
        $addToSet: { participants: participantName } 
      },
      { new: true, upsert: false }
    );

    // Create LiveKit Token
    const at = new AccessToken(apiKey, apiSecret, {
      identity: participantName,
      name: participantName,
    });

    at.addGrant({ 
      roomJoin: true, 
      room: roomId, 
      canPublish: true, 
      canSubscribe: true 
    });

    const token = await at.toJwt();

    return NextResponse.json({ token, wsUrl }, { status: 200 });

  } catch (error: any) {
    console.error('Error generating LiveKit token:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

