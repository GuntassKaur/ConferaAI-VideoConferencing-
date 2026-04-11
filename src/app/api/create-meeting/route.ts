import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { userId, title } = await request.json();

    if (!userId || !title) {
      return NextResponse.json({ error: 'Missing userId or title' }, { status: 400 });
    }

    const meetingId = Math.random().toString(36).substring(2, 11);
    
    const newMeeting = {
      id: meetingId,
      title,
      hostId: userId,
      participants: [userId], // Host joins by default
      status: 'live' as const,
      createdAt: new Date().toISOString(),
      transcript: []
    };

    db.meetings.push(newMeeting);

    return NextResponse.json({ success: true, meeting: newMeeting });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
