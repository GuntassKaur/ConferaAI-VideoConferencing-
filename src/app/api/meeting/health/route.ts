import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Meeting from '@/models/Meeting';

export async function POST(req: NextRequest) {
  try {
    const { roomId, score, status, insights, participantTalkTimes } = await req.json();
    if (!roomId) return NextResponse.json({ error: 'roomId required' }, { status: 400 });

    await connectToDatabase();
    await Meeting.findOneAndUpdate(
      { roomId },
      { $set: { 'healthData.latestScore': score, 'healthData.status': status, 'healthData.insights': insights, 'healthData.participantTalkTimes': participantTalkTimes, 'healthData.updatedAt': new Date() } },
      { upsert: false }
    );

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
