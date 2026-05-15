import { NextResponse } from "next/server";
import Meeting from "@/models/Meeting";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { userId, name } = await req.json();
    
    // Generate a simple readable room ID like XXX-XXXX-XXX or just a random string
    const meetingId = Math.random().toString(36).substring(2, 5) + '-' + 
                    Math.random().toString(36).substring(2, 6) + '-' + 
                    Math.random().toString(36).substring(2, 5);

    await Meeting.create({
      meetingId,
      hostId: userId || 'anonymous',
      name: name ? `${name}'s Session` : 'Untitled Meeting',
      status: 'active',
      participants: userId ? [userId] : [],
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      meetingId: meetingId,
    });
  } catch (error: any) {
    console.error("Meeting creation error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
