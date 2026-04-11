import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { meetingId, userId } = body;

    console.log('Join Meeting Request:', { meetingId, userId });

    if (!meetingId || !userId) {
      return NextResponse.json({ error: 'Meeting ID and User ID are required' }, { status: 400 });
    }

    // Direct search in singleton
    const meeting = db.meetings.find(m => m.id === meetingId);
    
    if (!meeting) {
      console.warn('Meeting Not Found:', meetingId);
      return NextResponse.json({ 
        error: 'Invalid Meeting ID. Please check the code and try again.' 
      }, { status: 404 });
    }

    // Add user to participants list if not present
    if (!meeting.participants.includes(userId)) {
      meeting.participants.push(userId);
      console.log('User added to meeting participants:', userId);
    }

    return NextResponse.json({ 
      success: true, 
      meeting: {
        id: meeting.id,
        title: meeting.title,
        hostId: meeting.hostId,
        participants: meeting.participants
      }
    });
  } catch (error: unknown) {
    console.error('Join API Error:', error);
    return NextResponse.json({ error: 'Real-time join failed. Please try again later.' }, { status: 500 });
  }

}
