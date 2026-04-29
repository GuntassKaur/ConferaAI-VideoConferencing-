import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || 'demo-key',
});

export async function POST(req: Request) {
  try {
    const { action, payload } = await req.json();

    if (action === 'generate_briefing') {
      const { title, participants, goals } = payload;
      const response = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20240620',
        max_tokens: 350,
        system: `You are ConferaAI's executive assistant preparing a high-level briefing for a meeting host before the call. 
Analyze the meeting title, participants list, and goals. 
Generate a highly actionable 3-point briefing card. Address the host directly. Identify likely decision-makers based on roles, reference assumed past contexts, and suggest a strategic opener. Format nicely with markdown bullet points.`,
        messages: [{ role: 'user', content: JSON.stringify({ title, participants, goals }) }]
      });
      return NextResponse.json({ briefing: (response.content[0] as any).text });
    }

    if (action === 'generate_agenda') {
      const { title, durationMin } = payload;
      const response = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20240620',
        max_tokens: 400,
        system: `You are an AI meeting optimizer. Create a perfectly structured, time-boxed agenda for a meeting titled "${title}" with a total duration of ${durationMin} minutes.
Return ONLY valid JSON matching this schema exactly:
{
  "agenda": [
    { "id": "1", "title": "Topic name", "duration": 15, "completed": false }
  ]
}
Ensure the sum of durations equals exactly ${durationMin}.`,
        messages: [{ role: 'user', content: `Create agenda for: ${title} (${durationMin} min)` }]
      });
      
      const content = (response.content[0] as any).text;
      const jsonStr = content.substring(content.indexOf('{'), content.lastIndexOf('}') + 1);
      return NextResponse.json(JSON.parse(jsonStr));
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    console.warn("Claude Briefing API failed:", error);
    
    // Fallback Mock Data for demo without API Key
    try {
      const { action } = await req.json();
      if (action === 'generate_briefing') {
        return NextResponse.json({ 
          briefing: "• **Sarah** is the key decision maker here based on her Director role.\n• *Last meeting note:* The timeline for Q3 was left unresolved. Bring this up early.\n• *Strategy:* Start with a quick win from the marketing team to build momentum before tackling the budget." 
        });
      }
      if (action === 'generate_agenda') {
        return NextResponse.json({ 
          agenda: [
            { id: '1', title: 'Intros & Context Setting', duration: 5, completed: false }, 
            { id: '2', title: 'Core Strategy Discussion', duration: 20, completed: false },
            { id: '3', title: 'Next Steps & Blockers', duration: 5, completed: false }
          ] 
        });
      }
    } catch (e) {}

    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
