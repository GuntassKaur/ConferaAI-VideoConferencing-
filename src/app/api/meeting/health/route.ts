import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import connectToDatabase from '@/lib/mongodb';
import Meeting from '@/models/Meeting';

export async function GET() {
  return NextResponse.json({ status: "ok" });
}

export async function POST(req: NextRequest) {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      return NextResponse.json({ error: "Database configuration missing" }, { status: 500 });
    }

    const { roomId, score, status, insights, participantTalkTimes } = await req.json().catch(() => ({}));
    if (!roomId) return NextResponse.json({ error: 'roomId required' }, { status: 400 });

    await connectToDatabase();
    await Meeting.findOneAndUpdate(
      { roomId },
      { $set: { 
          'healthData.latestScore': score, 
          'healthData.status': status, 
          'healthData.insights': insights, 
          'healthData.participantTalkTimes': participantTalkTimes, 
          'healthData.updatedAt': new Date() 
      } },
      { upsert: false }
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

