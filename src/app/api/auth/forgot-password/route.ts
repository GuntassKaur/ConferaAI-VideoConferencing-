import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    await connectDB();
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // For security, don't reveal if user exists or not
      return NextResponse.json({ message: 'If an account exists, a reset link has been sent.' });
    }

    // Generate secure token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: `"Confera AI Security" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Confera AI - Secure Password Reset Request',
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
          <h2 style="color: #2563eb; margin-bottom: 24px;">Password Reset Request</h2>
          <p style="color: #475569; line-height: 1.6;">A password reset for your Confera AI account was requested. This link will expire in 60 minutes.</p>
          <div style="margin: 32px 0;">
            <a href="${resetLink}" style="background-color: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">Reset My Password</a>
          </div>
          <p style="color: #64748b; font-size: 13px; line-height: 1.6; border-top: 1px solid #e2e8f0; padding-top: 24px;">If you didn't request this, your account is safe and you can ignore this email.</p>
          <p style="color: #94a3b8; font-size: 11px;">Confera Enterprise Video Platform • Secure Session Protocol</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Reset link sent successfully' });
  } catch (error: any) {
    console.error('Error in forgot password route:', error);
    if (error.message.includes('Database connection string missing')) {
      return NextResponse.json({ error: 'System database not configured.' }, { status: 503 });
    }
    return NextResponse.json({ error: 'Failed to process request. Try again later.' }, { status: 500 });
  }
}
