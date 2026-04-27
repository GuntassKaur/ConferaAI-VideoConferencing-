import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Meeting from '@/models/Meeting';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const { roomId } = await params;
    const { userId, approve } = await req.json();
    await connectToDatabase();

    const meeting = await Meeting.findOne({ roomId });
    if (!meeting) {
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
    }

    const requestIndex = meeting.joinRequests.findIndex(r => r.userId === userId);
    if (requestIndex === -1) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    meeting.joinRequests[requestIndex].status = approve ? 'accepted' : 'rejected';
    
    if (approve) {
      if (!meeting.participants.includes(userId)) {
        meeting.participants.push(userId);
      }
      meeting.status = 'active';
    }

    await meeting.save();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error approving request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
