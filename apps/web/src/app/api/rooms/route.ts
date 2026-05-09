import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Meeting from '@/models/Meeting';

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    await connectDB();
    // In a real app, we would filter by the logged in user's ID from the session
    // For now, returning all for simplicity, but in a production SaaS we'd use the hostId
    const meetings = await Meeting.find({}).sort({ startTime: -1 }).limit(10);
    
    return NextResponse.json({ 
      rooms: meetings.map(m => ({
        id: m.roomId,
        room_name: m.name,
        created_at: m.startTime
      })) 
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
