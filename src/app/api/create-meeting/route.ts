import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { userId, title } = body;

    console.log('Create Meeting Request:', { userId, title });

    if (!userId) {
      return NextResponse.json({ error: 'Authenticated User ID is required' }, { status: 400 });
    }

    const meetingId = Math.random().toString(36).substring(2, 11);
    
    const newMeeting = {
      id: meetingId,
      title: title || 'New AI Session',
      hostId: userId,
      participants: [userId],
      status: 'live' as const,
      createdAt: new Date().toISOString(),
      transcript: []
    };

    db.meetings.push(newMeeting);
    console.log('Meeting Created:', newMeeting);

    return NextResponse.json({ success: true, meeting: newMeeting });
  } catch (error: unknown) {
    console.error('Create Meeting Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ 
      error: 'Failed to create meeting', 
      details: message 
    }, { status: 500 });
  }

}
