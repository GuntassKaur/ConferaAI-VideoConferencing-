import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import User from '@/models/User';

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export async function GET(req: Request) {
  try {
    const token = req.headers.get('cookie')?.split(';').find(c => c.trim().startsWith('token='))?.split('=')[1];

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, JWT_SECRET);
    await connectDB();
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user });

  } catch (error) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
