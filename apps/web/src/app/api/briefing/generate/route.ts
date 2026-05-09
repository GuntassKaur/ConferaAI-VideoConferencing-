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
        `You are Confera AI's professional meeting assistant. Prepare a strategic executive briefing for the meeting host.
Analyze the following context:
Meeting: ${title}
Participants: ${JSON.stringify(participants)}
Objectives: ${JSON.stringify(goals)}

Generate a concise, 3-point strategic briefing card with actionable insights on how to drive the conversation toward the objectives. Focus on stakeholder alignment and technical blockers. Format with markdown bullet points.`
      );
      return NextResponse.json({ briefing: result.response.text() });
    }

    if (action === 'generate_agenda') {
      const { title, durationMin } = payload;
      const result = await gemini.generateContent(
        `You are a professional meeting architect. Create a high-efficiency, time-boxed agenda for a meeting titled "${title}" lasting ${durationMin} minutes.
Return ONLY a JSON object:
{
  "agenda": [
    { "id": "1", "title": "Section Title", "duration": number, "completed": false }
  ]
}
Ensure durations total exactly ${durationMin}.`
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
      briefing: "• **Strategic Alignment:** Focus on identifying key technical blockers mentioned in the roadmap.\n• **Context:** The previous session highlighted timeline risks. Address these early to maintain project momentum.\n• **Opening:** Begin with a brief overview of the current sprint velocity before diving into specific objectives.",
      agenda: [
        { id: '1', title: 'Context & Alignment', duration: 5, completed: false }, 
        { id: '2', title: 'Strategic Discussion', duration: 20, completed: false },
        { id: '3', title: 'Action Items & Sync', duration: 5, completed: false }
      ] 
    });
  }
}
