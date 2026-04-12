import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import connectDB from '@/lib/mongodb';
import Meeting from '@/models/Meeting';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ success: true, meetings: [] });
    }

    // Find sessions where this user was a participant
    const userMeetings = await Meeting.find({ 
      participants: userId 
    }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, meetings: userMeetings });
  } catch (error: unknown) {
    console.error('Fetch meetings error:', error);
    const msg = error instanceof Error ? error.message : '';
    const errorMessage = msg.includes('Database connection string missing') 
      ? 'Database Configuration Missing' 
      : 'Session Query Timeout';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const meetingId = searchParams.get('meetingId');
    const userId = searchParams.get('userId');

    if (!meetingId || !userId) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // Security: Only host can delete (or at least check participants)
    const meeting = await Meeting.findOne({ meetingId });
    if (!meeting) {
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
    }

    // Simple security: check if user is the host
    if (meeting.hostId.toString() !== userId) {
      return NextResponse.json({ error: 'Unauthorized: Only the host can delete this session' }, { status: 403 });
    }

    await Meeting.deleteOne({ meetingId });

    return NextResponse.json({ success: true, message: 'Session successfully purged' });
  } catch (error: unknown) {
    console.error('Delete meeting error:', error);
    return NextResponse.json({ error: 'Failed to purge session layer' }, { status: 500 });
  }
}
