import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  try {
    const JWT_SECRET = process.env.JWT_SECRET || 'confera-ai-secret-key-2026';
    
    // 1. Safe Env Usage
    if (!JWT_SECRET && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: "Security configuration missing" }, { status: 500 });
    }

    const { email, password } = await req.json().catch(() => ({}));


    if (!email || !password) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: 'Password incorrect' }, { status: 400 });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: '7d',
    });


    return NextResponse.json(
      { 
        token, 
        user: { id: user._id, name: user.name, email: user.email } 
      }, 
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
