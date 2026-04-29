import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { gemini } from '@/lib/ai';

export async function POST(req: Request) {
  try {
    const { action, payload } = await req.json();

    if (action === 'generate_briefing') {
      const { title, participants, goals } = payload;
      const result = await gemini.generateContent(
        `You are ConferaAI's executive assistant preparing a high-level briefing for a meeting host before the call. 
Analyze the meeting title, participants list, and goals. 
Generate a highly actionable 3-point briefing card. Address the host directly. Identify likely decision-makers based on roles, reference assumed past contexts, and suggest a strategic opener. Format nicely with markdown bullet points.\n\nData: ${JSON.stringify({ title, participants, goals })}`
      );
      return NextResponse.json({ briefing: result.response.text() });
    }

    if (action === 'generate_agenda') {
      const { title, durationMin } = payload;
      const result = await gemini.generateContent(
        `You are an AI meeting optimizer. Create a perfectly structured, time-boxed agenda for a meeting titled "${title}" with a total duration of ${durationMin} minutes.
Return ONLY valid JSON matching this schema exactly:
{
  "agenda": [
    { "id": "1", "title": "Topic name", "duration": number, "completed": false }
  ]
}
Ensure the sum of durations equals exactly ${durationMin}.\n\nMeeting: ${title} (${durationMin} min)`
      );
      
      const content = result.response.text();
      const jsonStr = content.substring(content.indexOf('{'), content.lastIndexOf('}') + 1);
      return NextResponse.json(JSON.parse(jsonStr));
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    console.warn("AI Briefing API failed:", error);
    
    // Fallback Mock Data for demo without API Key
    return NextResponse.json({ 
      briefing: "• **Sarah** is the key decision maker here based on her Director role.\n• *Last meeting note:* The timeline for Q3 was left unresolved. Bring this up early.\n• *Strategy:* Start with a quick win from the marketing team to build momentum before tackling the budget.",
      agenda: [
        { id: '1', title: 'Intros & Context Setting', duration: 5, completed: false }, 
        { id: '2', title: 'Core Strategy Discussion', duration: 20, completed: false },
        { id: '3', title: 'Next Steps & Blockers', duration: 5, completed: false }
      ] 
    });
  }
}
