import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Meeting from "@/models/Meeting";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { name, hostId } = await req.json().catch(() => ({}));

    const meetingId = Math.random().toString(36).substring(2, 8);

    const meeting = await Meeting.create({ 
      meetingId,
      name: name || `${meetingId}'s Meeting`,
      hostId: hostId || 'guest_global'
    });

    return NextResponse.json(meeting);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
