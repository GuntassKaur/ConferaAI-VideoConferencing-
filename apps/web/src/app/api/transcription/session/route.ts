import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Initializes a Gemini Multimodal Live API session as the robust server-side fallback
    // Instead of Deepgram, we configure the Gemini API websocket for real-time chunk streaming
    
    const geminiApiKey = process.env.GEMINI_API_KEY;
    
    if (!geminiApiKey) {
      console.warn("GEMINI_API_KEY not found in environment. Fallback transcription may fail.");
    }

    return NextResponse.json({
      provider: 'gemini',
      token: geminiApiKey || 'demo-token',
      url: 'wss://generativelanguage.googleapis.com/ws'
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create Gemini transcription session' }, { status: 500 });
  }
}
