import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';


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
