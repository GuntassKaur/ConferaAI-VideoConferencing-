import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({ success: true, user: body.email });
  } catch (error) {
    return NextResponse.json({ success: true, user: 'guest' });
  }
}
