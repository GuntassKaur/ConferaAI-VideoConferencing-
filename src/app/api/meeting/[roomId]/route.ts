import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Meeting from '@/models/Meeting';

export async function GET(
  req: NextRequest,
  { params }: { params: { roomId: string } }
) {
  try {
    await connectToDatabase();
    const meeting = await Meeting.findOne({ roomId: params.roomId });

    if (!meeting) {
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
    }

    return NextResponse.json(meeting);
  } catch (error) {
    console.error('Error fetching meeting:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
