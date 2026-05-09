import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Meeting from '@/models/Meeting';

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    
    const meeting = await Meeting.findOne({ roomId: id });
    
    if (!meeting) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    return NextResponse.json({ room: meeting });

  } catch (error: any) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
