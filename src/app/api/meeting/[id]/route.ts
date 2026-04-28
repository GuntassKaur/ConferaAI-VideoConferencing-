import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic';
import { connectDB } from "@/lib/mongodb";

import Meeting from "@/models/Meeting";

export async function GET(
  req: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const meeting = await Meeting.findOne({ meetingId: id });

    if (!meeting) {
      return NextResponse.json({ message: "Meeting not found" }, { status: 404 });
    }

    return NextResponse.json(meeting);
  } catch (error: any) {
    console.error("Fetch meeting error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

