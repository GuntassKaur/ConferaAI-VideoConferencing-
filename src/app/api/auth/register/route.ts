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
    
    // 1. Safe Env Usage Check
    if (!JWT_SECRET && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: "Security configuration missing" }, { status: 500 });
    }

    const { name, email, password } = await req.json().catch(() => ({}));


    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    await connectToDatabase();

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
    });

    const token = jwt.sign({ id: newUser._id, email: newUser.email }, JWT_SECRET, {
      expiresIn: '7d',
    });

    const response = NextResponse.json(
      { 
        success: true,
        message: 'User created', 
        user: { id: newUser._id, name: newUser.name, email: newUser.email } 
      }, 
      { status: 201 }
    );

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;


  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
