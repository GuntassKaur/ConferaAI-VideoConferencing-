import { NextResponse } from 'next/server';

export async function POST() {
  const meetingId = `mtg-${Math.random().toString(36).substring(2, 10)}`;
  
  return NextResponse.json({ 
    success: true, 
    meeting: {
      id: meetingId,
      title: 'New Secure Session',
      status: 'active'
    } 
  });
}
