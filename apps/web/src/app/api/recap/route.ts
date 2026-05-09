import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Recap from '@/models/Recap';
import { gemini } from '@/lib/ai';

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { roomId, transcript, participants } = await req.json();

    if (!transcript) {
      return NextResponse.json({ error: 'Missing transcript' }, { status: 400 });
    }

    const prompt = `
      You are Confera AI's intelligence engine. Analyze the following meeting transcript and participants.
      Participants: ${JSON.stringify(participants)}
      Transcript: ${transcript}

      Return a professional JSON summary:
      {
        "summary": "2-sentence executive summary",
        "keyPoints": ["point 1", "point 2"],
        "actionItems": [{"task": "task description", "owner": "owner name"}],
        "score": number (1-100)
      }
    `;

    const result = await gemini.generateContent(prompt);
    const text = result.response.text();
    const cleanedJson = text.replace(/```json|```/g, '').trim();
    const data = JSON.parse(cleanedJson);

    const recap = await Recap.create({
      meetingId: roomId,
      summary: data.summary,
      keyPoints: data.keyPoints,
      actionItems: data.actionItems,
      score: data.score
    });

    return NextResponse.json(recap);

  } catch (error: any) {
    console.error('Recap generation failed:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
