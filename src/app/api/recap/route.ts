import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import connectToDatabase from '@/lib/mongodb';
import Meeting from '@/models/Meeting';
import { generateMeetingSummary } from '@/lib/gemini';


export async function POST(req: NextRequest) {
  try {
    const { roomId, transcript, participants, duration } = await req.json();

    if (!roomId || !transcript) {
      return NextResponse.json(
        { error: 'Room ID and Transcript are required for recap generation' }, 
        { status: 400 }
      );
    }

    // Generate recap using Gemini
    const recap = await generateMeetingSummary(
      transcript, 
      participants || [], 
      duration || 0
    );

    await connectToDatabase();
    
    // First, promote existing recap → previousRecap for historical brief context
    const existingMeeting = await Meeting.findOne({ roomId });
    const updatePayload: any = {
      $set: { recap, status: 'ended' }
    };
    if (existingMeeting?.recap?.tldr) {
      updatePayload.$set.previousRecap = {
        tldr: existingMeeting.recap.tldr,
        keyPoints: existingMeeting.recap.keyPoints || [],
        decisions: existingMeeting.recap.decisions || [],
      };
    }

    // Update the meeting document with the generated recap and mark as ended
    const updatedMeeting = await Meeting.findOneAndUpdate(
      { roomId },
      updatePayload,
      { new: true }
    );

    if (!updatedMeeting) {
      return NextResponse.json(
        { error: 'Meeting not found in registry' }, 
        { status: 404 }
      );
    }

    return NextResponse.json(recap, { status: 200 });

  } catch (error: unknown) {
    console.error('Recap API Error:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Internal Server Error during recap generation' }, 
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const roomId = searchParams.get('roomId');

    if (!roomId) {
      return NextResponse.json({ error: 'Room ID is required' }, { status: 400 });
    }

    await connectToDatabase();
    const meeting = await Meeting.findOne({ roomId });

    if (!meeting || !meeting.recap) {
      return NextResponse.json({ error: 'Recap not found' }, { status: 404 });
    }

    return NextResponse.json(meeting.recap);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch recap' }, { status: 500 });
  }
}
