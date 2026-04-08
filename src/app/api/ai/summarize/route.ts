export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
  try {
    const { context } = await req.json();

    if (!context || typeof context !== 'string') {
      return NextResponse.json({ error: 'Valid "context" string is required' }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ summary: "Demo Mode: OpenAI API key missing. You've discussed important scaling metrics and product iterations." });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are an elite executive assistant on a video conferencing call. Provide a highly concise, punchy "Catch Me Up" summary (2-3 sentences max) capturing the current vibe and decisions from the transcript context provided.' },
        { role: 'user', content: `Here is the recent transcript:\n\n${context}` }
      ],
      temperature: 0.5,
      max_tokens: 150,
    });

    return NextResponse.json({ summary: response.choices[0].message.content });
  } catch (error) {
    console.error('Summarize Error:', error);
    return NextResponse.json({ error: 'Failed to generate summary.' }, { status: 500 });
  }
}
