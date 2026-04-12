import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    await connectDB();
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'Account already registered with this email' }, { status: 400 });
    }

    // Secure password hashing
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: 'user',
    });

    return NextResponse.json({ 
      success: true, 
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      } 
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    // User friendly error for DB connection issues
    if (error.message.includes('Database connection string missing')) {
      return NextResponse.json({ error: 'Server database connection not configured.' }, { status: 503 });
    }
    return NextResponse.json({ error: 'Registration failed. Please try again later.' }, { status: 500 });
  }
}
