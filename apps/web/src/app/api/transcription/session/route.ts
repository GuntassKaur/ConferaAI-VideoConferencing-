import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST() {
  try {
    const geminiApiKey = process.env.GEMINI_API_KEY;
    
    if (!geminiApiKey) {
      console.warn("GEMINI_API_KEY not found in environment. Transcription may fail.");
    }

    return NextResponse.json({
      provider: 'gemini',
      token: geminiApiKey || 'demo-token',
      url: 'wss://generativelanguage.googleapis.com/ws'
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create transcription session' }, { status: 500 });
  }
}
