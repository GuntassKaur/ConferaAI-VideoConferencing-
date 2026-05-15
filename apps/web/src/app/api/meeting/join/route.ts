import { NextResponse } from 'next/server';
import Meeting from '@/models/Meeting';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { meetingId, userId } = await req.json();

    if (!meetingId) {
      return NextResponse.json({ success: false, message: "Meeting ID is required" }, { status: 400 });
    }

    const meeting = await Meeting.findOne({ meetingId });

    if (!meeting) {
      return NextResponse.json({ success: false, message: "Meeting not found. Please check the ID." }, { status: 404 });
    }

    // Add user to participants if not already there
    if (userId && !meeting.participants.includes(userId)) {
      meeting.participants.push(userId);
      await meeting.save();
    }

    return NextResponse.json({ 
      success: true, 
      meetingId: meeting.meetingId,
      name: meeting.name
    });

  } catch (error: any) {
    console.error("Meeting join error:", error);
    return NextResponse.json({ success: false, message: "Failed to join meeting" }, { status: 500 });
  }
}
