import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic';
import { connectDB } from "@/lib/mongodb";

import Meeting from "@/models/Meeting";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { userId, name } = await req.json().catch(() => ({ userId: null, name: null }));

    const meetingId = Math.random().toString(36).substring(2, 8);

    // Create meeting in database
    await Meeting.create({ 
      meetingId,
      name: name || `Meeting ${meetingId}`,
      hostId: userId,
      status: 'idle',
      createdAt: new Date()
    });

    console.log("Meeting created in DB:", meetingId, "by", userId);

    return NextResponse.json({ meetingId });
  } catch (error: any) {
    console.error("Failed to create meeting:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


