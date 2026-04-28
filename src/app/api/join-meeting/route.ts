import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Meeting from '@/models/Meeting';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { meetingId, userId } = body;

    if (!meetingId || !userId) {
      return NextResponse.json({ error: 'Meeting ID and User ID are required' }, { status: 400 });
    }

    await connectDB();
    const meeting = await Meeting.findOne({ meetingId });
    
    if (!meeting) {
      return NextResponse.json({ 
        error: 'Invalid Meeting ID. Please check the code and try again.' 
      }, { status: 404 });
    }

    // Add user to participants list if not present
    if (!meeting.participants.includes(userId)) {
      meeting.participants.push(userId);
      await meeting.save();
    }

    return NextResponse.json({ 
      success: true, 
      meeting: {
        id: meeting.meetingId,
        name: meeting.name,
        hostId: meeting.hostId,
        participants: meeting.participants
      }
    });
  } catch (error: any) {
    console.error('Join API Error:', error);
    return NextResponse.json({ error: 'Real-time join failed. Please try again later.' }, { status: 500 });
  }
}
