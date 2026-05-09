import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Note from '@/models/Note';

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { meetingId, userId, content } = await req.json();

    const note = await Note.findOneAndUpdate(
      { meetingId, userId },
      { content, updatedAt: new Date() },
      { upsert: true, new: true }
    );

    return NextResponse.json(note);
  } catch (error: any) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const meetingId = searchParams.get('meetingId');
    const userId = searchParams.get('userId');

    const note = await Note.findOne({ meetingId, userId });
    return NextResponse.json({ note });
  } catch (error: any) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
