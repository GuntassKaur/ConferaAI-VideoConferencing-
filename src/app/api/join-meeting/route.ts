import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { meetingId, userId } = await request.json();

    if (!meetingId || !userId) {
      return NextResponse.json({ error: 'Missing meetingId or userId' }, { status: 400 });
    }

    const meeting = db.meetings.find(m => m.id === meetingId);
    if (!meeting) {
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
    }

    // Add user to participants if not already there
    if (!meeting.participants.includes(userId)) {
      meeting.participants.push(userId);
    }

    return NextResponse.json({ success: true, meeting });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
