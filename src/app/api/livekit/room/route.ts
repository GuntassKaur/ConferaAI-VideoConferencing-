import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Meeting from '@/models/Meeting';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
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
      participants: [],
    });

    return NextResponse.json(
      { success: true, meeting: newMeeting },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating meeting:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
