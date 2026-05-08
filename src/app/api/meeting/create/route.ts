import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import Meeting from "@/models/Meeting";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST() {
  try {
    await connectDB();

    const meetingId = uuidv4();

    const meeting = await Meeting.create({
      meetingId,
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      meetingId: meeting.meetingId,
    });
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
