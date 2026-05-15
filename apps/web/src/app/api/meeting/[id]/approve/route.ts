import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { connectDB } from '@/lib/mongodb';

import Meeting from '@/models/Meeting';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { userId, approve } = await req.json();
    await connectDB();

    const meeting = await Meeting.findOne({ meetingId: id });
    if (!meeting) {
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
    }

    const requestIndex = meeting.joinRequests.findIndex((r: any) => r.userId === userId);
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
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
