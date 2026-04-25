import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import connectToDatabase from '@/lib/mongodb';
import Meeting from '@/models/Meeting';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    const { roomId, participantName } = await req.json();
    if (!roomId || !participantName) {
      return NextResponse.json(
        { error: 'roomId and participantName are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const meeting = await Meeting.findOne({ roomId });

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const hour = new Date().getHours();
    const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';

    // Build rich context from DB for Gemini
    const previousContext = meeting?.previousRecap?.tldr
      ? `Previous session summary: "${meeting.previousRecap.tldr}". Key decisions: ${meeting.previousRecap.decisions?.join(', ') || 'none recorded'}.`
      : 'No previous meeting data exists for this room.';

    const agendaContext = meeting?.agenda?.length
      ? `Scheduled agenda: ${meeting.agenda.join(', ')}`
      : 'No agenda has been set for this meeting.';

    const participantContext = meeting?.participants?.length
      ? `Known participants: ${meeting.participants.join(', ')}`
      : `Participant joining: ${participantName}`;

    const prompt = `
You are Confera AI's Pre-Meeting Intelligence Engine.
Generate a smart, personalized pre-call brief for a participant joining a live session.
Return ONLY a valid JSON object with NO markdown, no backticks, no extra text:
{
  "greeting": "Good ${timeOfDay}, ${participantName}! [one warm, specific sentence about the session]",
  "agenda": ["item 1", "item 2", "item 3"],
  "contextFromLastMeeting": "string — 1-2 sentences about what was discussed last time, or null if no history",
  "suggestedPrep": ["specific suggestion 1", "specific suggestion 2", "specific suggestion 3"]
}

Session Context:
Meeting Name: ${meeting?.name || roomId}
${participantContext}
${agendaContext}
${previousContext}
Meeting Status: ${meeting?.status || 'waiting'}
    `.trim();

    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json|```/gi, '').trim();

    let brief;
    try {
      brief = JSON.parse(text);
    } catch {
      // Fallback brief if Gemini returns malformed JSON
      brief = {
        greeting: `Good ${timeOfDay}, ${participantName}! Your session is ready.`,
        agenda: meeting?.agenda || ['Open discussion'],
        contextFromLastMeeting: meeting?.previousRecap?.tldr || null,
        suggestedPrep: ['Review recent notes', 'Test your audio and video', 'Have key questions ready'],
      };
    }

    return NextResponse.json(brief);
  } catch (error: unknown) {
    console.error('Pre-Meeting Brief Error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
