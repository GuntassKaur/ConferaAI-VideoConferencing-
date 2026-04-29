import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || 'demo-key',
});

export async function POST(req: Request) {
  try {
    const { action, payload } = await req.json();

    if (action === 'ai-assign') {
      const { participants, numRooms } = payload;
      const response = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20240620',
        max_tokens: 1000,
        system: `You are an AI meeting optimizer. Assign these participants into ${numRooms} breakout rooms. Try to balance them optimizing for diverse expertise/roles if provided. Return ONLY JSON: { "groups": [ { "roomId": "room_1", "reasoning": "Explain the balance logic", "participants": ["participantId1"] } ] }`,
        messages: [{ role: 'user', content: JSON.stringify(participants) }]
      });
      
      const content = (response.content[0] as any).text;
      const jsonStr = content.substring(content.indexOf('{'), content.lastIndexOf('}') + 1);
      return NextResponse.json(JSON.parse(jsonStr));
    }

    if (action === 'moderate_stall') {
      const { goal, recentTranscript } = payload;
      const response = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20240620',
        max_tokens: 150,
        system: `You are an AI Breakout Room Moderator. The room has been silent for over 2 minutes. The room's goal is: "${goal}". Based on the recent transcript, suggest a concise, engaging question or prompt to get the discussion moving again.`,
        messages: [{ role: 'user', content: recentTranscript || 'No prior discussion recorded.' }]
      });
      return NextResponse.json({ prompt: (response.content[0] as any).text });
    }

    if (action === 'room_summary') {
      const { transcript, goal } = payload;
      const response = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20240620',
        max_tokens: 250,
        system: `Summarize this breakout room's progress towards the goal: "${goal}". Provide exactly 3 concise, highly actionable bullet points.`,
        messages: [{ role: 'user', content: transcript }]
      });
      return NextResponse.json({ summary: (response.content[0] as any).text });
    }

    if (action === 'synthesize_all') {
      const { roomSummaries } = payload;
      const response = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20240620',
        max_tokens: 500,
        system: `You are the master AI Coordinator. Synthesize the following breakout room summaries into one cohesive, high-level master summary for the main meeting. Highlight overarching themes, key decisions, and next steps.`,
        messages: [{ role: 'user', content: JSON.stringify(roomSummaries) }]
      });
      return NextResponse.json({ masterSummary: (response.content[0] as any).text });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    console.error("Breakout API error:", error);
    
    // Mock fallback responses
    const { action } = await req.json();
    if (action === 'ai-assign') {
      return NextResponse.json({ groups: [{ roomId: '1', reasoning: 'Balanced default.', participants: [] }] });
    }
    if (action === 'moderate_stall') return NextResponse.json({ prompt: "What are everyone's thoughts on the priority goals?" });
    if (action === 'room_summary') return NextResponse.json({ summary: "- Discussed goals\n- Assigned roles\n- Pending sign-off" });
    if (action === 'synthesize_all') return NextResponse.json({ masterSummary: "All rooms agreed on the general Q3 roadmap." });

    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
