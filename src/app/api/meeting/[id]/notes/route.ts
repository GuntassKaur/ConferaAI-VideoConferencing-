import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Meeting from '@/models/Meeting';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    const meeting = await Meeting.findOne({ meetingId: id });
    return NextResponse.json({ notes: meeting?.notes || "" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { notes, userId } = await req.json();
    await connectDB();

    const meeting = await Meeting.findOneAndUpdate(
      { meetingId: id },
      { 
        notes, 
        notesLastEditedBy: userId,
        notesUpdatedAt: new Date()
      },
      { new: true }
    );

    return NextResponse.json({ success: true, notes: meeting.notes });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
