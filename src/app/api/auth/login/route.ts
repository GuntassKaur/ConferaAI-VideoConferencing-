import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    await connectDB();
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Secure password comparison
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    return NextResponse.json({ 
      success: true, 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      } 
    });
  } catch (error: any) {
    console.error('Login error:', error);
    if (error.message.includes('Database connection string missing')) {
      return NextResponse.json({ error: 'Server database connection not configured.' }, { status: 503 });
    }
    return NextResponse.json({ error: 'Login failed. Please try again later.' }, { status: 500 });
  }
}
