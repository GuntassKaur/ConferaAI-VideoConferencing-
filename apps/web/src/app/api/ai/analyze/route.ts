export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';


export async function POST(req: NextRequest) {
  try {
    const { transcript } = await req.json();

    if (!transcript || typeof transcript !== 'string') {
      return NextResponse.json(
        { error: 'Valid "transcript" string is required' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        minutes:
          '# Meeting Minutes\n\n- Discussed Confera Pro architecture.\n- Decided on SFU over Mesh topology.',
        actionItems: [{ assignee: 'Team', task: 'Implement LiveKit WebRTC.' }],
        sentiment: { score: 85, label: 'Highly Productive' },
      });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const prompt = `Analyze the following meeting transcript and return a JSON object containing:
1. "minutes": A concise markdown string of meeting minutes.
2. "actionItems": An array of objects { assignee, task } representing action items.
3. "sentiment": An object { score: number (0-100), label: string } judging the productivity and overall vibe.

Transcript:
${transcript}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'system', content: prompt }],
      temperature: 0.2,
      response_format: { type: 'json_object' },
    });

    const parsedData = JSON.parse(response.choices[0].message.content || '{}');
    return NextResponse.json(parsedData);
  } catch (error) {
    console.error('Analyze Error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze meeting artifacts.' },
      { status: 500 }
    );
  }
}
