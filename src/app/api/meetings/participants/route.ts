import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';


export async function GET() {
  try {
    await connectToDatabase();
    // Fetch all users to populate the "Team" directory
    const participants = await User.find({}, 'name email').lean();
    
    return NextResponse.json({
      success: true,
      participants: participants.map((p: any) => ({
        id: p._id,
        name: p.name,
        email: p.email
      }))
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
