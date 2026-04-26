import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Meeting from '@/models/Meeting';

export async function POST(
  req: NextRequest,
  { params }: { params: { roomId: string } }
) {
  try {
    await connectToDatabase();

    const meeting = await Meeting.findOne({ roomId: params.roomId });
    if (!meeting) {
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
    }

    // Generate Mock AI Recap
    const recap = {
      title: meeting.name + ' Summary',
      tldr: 'A productive session focused on architectural refinements and deployment strategies for the upcoming Q3 release.',
      keyPoints: [
        'Confirmed migration to Next.js 15 for improved performance.',
        'Finalized the schema for real-time join approval flow.',
        'Discussed LiveKit integration bottlenecks and potential solutions.'
      ],
      actionItems: [
        { task: 'Update environment variables for production', owner: 'Dev Team' },
        { task: 'Draft API documentation for new endpoints', owner: 'Lead Engineer' },
        { task: 'Schedule load testing for the media server', owner: 'Ops' }
      ],
      decisions: [
        'Standardize on Tailwind CSS for all future UI components.',
        'Use MongoDB as the primary persistence layer for session metadata.'
      ],
      sentiment: 'Highly Collaborative',
      engagementScore: 88,
    };

    meeting.status = 'ended';
    meeting.recap = recap;
    await meeting.save();

    return NextResponse.json({ success: true, recap });
  } catch (error) {
    console.error('Error ending meeting:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
