import { NextResponse } from 'next/server';
import Meeting from '@/models/Meeting';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID required" }, { status: 400 });
    }

    // For simplicity, we fetch meetings where the user is a participant
    // Firestore find wrapper handles this
    const userMeetings = await Meeting.find({ participants: userId }).sort({ createdAt: -1 }).limit(10);
    
    return NextResponse.json({ success: true, meetings: userMeetings });
  } catch (error) {
    console.error('Fetch meetings error:', error);
    return NextResponse.json({ success: true, meetings: [] });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const meetingId = searchParams.get('meetingId');
    const userId = searchParams.get('userId');

    if (!meetingId || !userId) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const meeting = await Meeting.findOne({ meetingId });
    if (!meeting) {
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
    }

    // Allow deletion if user is host or if it's their own record
    if (meeting.hostId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await Meeting.deleteOne({ meetingId });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete meeting error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
