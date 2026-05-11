import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { loadRootEnv } from '@/lib/env';

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

loadRootEnv();

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req: Request) {
  try {
    if (!JWT_SECRET) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const token = req.headers.get('cookie')?.split(';').find(c => c.trim().startsWith('token='))?.split('=')[1];

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, JWT_SECRET);
    
    try {
      await connectDB();
    } catch (dbError) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user: { id: user._id, name: user.name, email: user.email } });

  } catch (error) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
