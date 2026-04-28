import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import connectToDatabase from '@/lib/mongodb';
import Meeting from '@/models/Meeting';

export async function POST(req: NextRequest) {
  try {
    // 1. Safe Env Usage Check
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      return NextResponse.json({ error: "Database configuration missing" }, { status: 500 });
    }

    // 2. Logic inside function only
    const body = await req.json().catch(() => ({}));
    const { roomId, name, hostId } = body;

    if (!roomId || !name || !hostId) {
      return NextResponse.json(
        { error: 'Missing required fields: roomId, name, or hostId' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Check if room already exists
    const existingMeeting = await Meeting.findOne({ roomId });
    if (existingMeeting) {
      return NextResponse.json(
        { error: 'Room already exists' },
        { status: 409 }
      );
    }

    // Create new meeting
    const newMeeting = await Meeting.create({
      roomId,
      name,
      hostId,
      status: 'waiting',
      participants: [hostId],
      createdAt: new Date()
    });

    return NextResponse.json(
      { success: true, meeting: newMeeting },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Error creating meeting:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

