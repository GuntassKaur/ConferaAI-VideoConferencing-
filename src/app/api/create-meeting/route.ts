import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import connectDB from '@/lib/mongodb';
import Meeting from '@/models/Meeting';
import mongoose from 'mongoose';

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json().catch(() => ({}));
    const { userId, title } = body;

    const meetingId = `mtg-${Math.random().toString(36).substring(2, 8)}`;
    
    // Create new meeting in MongoDB
    const newMeeting = await Meeting.create({
      meetingId,
      title: title || 'New AI Session',
      hostId: userId && mongoose.Types.ObjectId.isValid(userId) ? userId : new mongoose.Types.ObjectId(), // Virtual host for guests
      participants: userId && mongoose.Types.ObjectId.isValid(userId) ? [userId] : [],
      status: 'live',
      startTime: new Date(),
    });

    console.log('Meeting Created in DB:', meetingId);

    return NextResponse.json({ 
      success: true, 
      meeting: {
        id: newMeeting.meetingId,
        title: newMeeting.title,
        status: newMeeting.status
      } 
    });
  } catch (error: any) {
    console.error('Create Meeting Error:', error);
    return NextResponse.json({ error: 'Failed to initialize session' }, { status: 500 });
  }
}
