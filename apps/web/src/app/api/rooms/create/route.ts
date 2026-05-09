import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Meeting from '@/models/Meeting';

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { room_name, host_id } = await req.json();

    // Generate a unique 9-digit ID (ABC-DEF-GHI)
    const generateId = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      const segment = () => Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
      return `${segment()}-${segment()}-${segment()}`;
    };

    const roomId = generateId();

    const meeting = await Meeting.create({
      roomId,
      name: room_name || 'Strategic Sync',
      hostId: host_id,
      status: 'active',
      startTime: new Date(),
    });

    return NextResponse.json({ id: meeting.roomId });

  } catch (error: any) {
    console.error('Room creation error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
