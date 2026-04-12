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
  } catch (error: any) {
    console.error('Fetch meetings error:', error);
    return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 });
  }
}
