import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Meeting from '@/models/Meeting';

export async function POST(
  req: NextRequest,
  { params }: { params: { roomId: string } }
) {
  try {
    const { userId, name } = await req.json();
    await connectToDatabase();

    const meeting = await Meeting.findOne({ roomId: params.roomId });
    if (!meeting) {
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
    }

    if (meeting.status === 'ended') {
      return NextResponse.json({ error: 'Meeting has ended' }, { status: 400 });
    }

    // Check if user is host
    if (meeting.hostId === userId) {
      return NextResponse.json({ status: 'accepted', message: 'Host automatically joined' });
    }

    // Check if request already exists
    const existingRequest = meeting.joinRequests.find(r => r.userId === userId);
    if (existingRequest) {
      return NextResponse.json({ status: existingRequest.status });
    }

    meeting.joinRequests.push({
      userId,
      name,
      status: 'pending',
      requestedAt: new Date(),
    });

    await meeting.save();
    return NextResponse.json({ status: 'pending' });
  } catch (error) {
    console.error('Error requesting join:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
