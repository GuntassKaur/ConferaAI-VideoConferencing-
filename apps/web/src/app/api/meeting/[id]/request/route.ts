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
    const { userId, name } = await req.json();
    await connectDB();

    const meeting = await Meeting.findOne({ meetingId: id });
    if (!meeting) {
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
    }

    // Check if user is already accepted or has a pending request
    let request = meeting.joinRequests.find((r: any) => r.userId === userId);
    
    if (!request) {
      meeting.joinRequests.push({ userId, name, status: 'pending' });
      await meeting.save();
      return NextResponse.json({ status: 'pending' });
    }

    return NextResponse.json({ status: request.status });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
