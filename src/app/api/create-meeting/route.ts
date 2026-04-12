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
  } catch (error: unknown) {
    console.error('Create Meeting Error:', error);
    const msg = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : undefined;
    const errorMessage = msg.includes('Database connection string missing') 
      ? 'Database configuration missing (MONGODB_URI)' 
      : msg || 'Identity link failure';
    
    return NextResponse.json({ 
      error: `Infrastructure Error: ${errorMessage}`,
      details: process.env.NODE_ENV === 'development' ? stack : undefined
    }, { status: 500 });
  }
}
