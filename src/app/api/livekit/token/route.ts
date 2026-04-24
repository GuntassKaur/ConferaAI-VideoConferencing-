import { NextRequest, NextResponse } from 'next/server';
import { AccessToken } from 'livekit-server-sdk';
import connectToDatabase from '@/lib/mongodb';
import Meeting from '@/models/Meeting';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { roomId, participantName } = body;

    if (!roomId || !participantName) {
      return NextResponse.json(
        { error: 'Missing roomId or participantName' },
        { status: 400 }
      );
    }

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL || process.env.LIVEKIT_URL;

    if (!apiKey || !apiSecret || !wsUrl) {
      return NextResponse.json(
        { error: 'Server is misconfigured with LiveKit credentials' },
        { status: 500 }
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

  } catch (error) {
    console.error('Error generating LiveKit token:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
