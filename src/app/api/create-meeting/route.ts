import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST() {
  const meetingId = Math.random().toString(36).substring(2, 11);
  db.meetings.push({ id: meetingId, createdAt: new Date() });
  return NextResponse.json({ success: true, meetingId });
}
