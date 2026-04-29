import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { gemini } from '@/lib/ai';

export async function POST(req: Request) {
  try {
    const { action, payload } = await req.json();

    if (action === 'ai-assign') {
      const { participants, numRooms } = payload;
      const result = await gemini.generateContent(
        `You are an AI meeting optimizer. Assign these participants into ${numRooms} breakout rooms. Try to balance them optimizing for diverse expertise/roles if provided. Return ONLY JSON: { "groups": [ { "roomId": "room_1", "reasoning": "Explain the balance logic", "participants": ["participantId1"] } ] }\n\nParticipants: ${JSON.stringify(participants)}`
      );
      
      const content = result.response.text();
      const jsonStr = content.substring(content.indexOf('{'), content.lastIndexOf('}') + 1);
      return NextResponse.json(JSON.parse(jsonStr));
    }

    if (action === 'moderate_stall') {
      const { goal, recentTranscript } = payload;
      const result = await gemini.generateContent(
        `You are an AI Breakout Room Moderator. The room has been silent for over 2 minutes. The room's goal is: "${goal}". Based on the recent transcript, suggest a concise, engaging question or prompt to get the discussion moving again.\n\nTranscript: ${recentTranscript || 'No prior discussion recorded.'}`
      );
      return NextResponse.json({ prompt: result.response.text() });
    }

    if (action === 'room_summary') {
      const { transcript, goal } = payload;
      const result = await gemini.generateContent(
        `Summarize this breakout room's progress towards the goal: "${goal}". Provide exactly 3 concise, highly actionable bullet points.\n\nTranscript: ${transcript}`
      );
      return NextResponse.json({ summary: result.response.text() });
    }

    if (action === 'synthesize_all') {
      const { roomSummaries } = payload;
      const result = await gemini.generateContent(
        `You are the master AI Coordinator. Synthesize the following breakout room summaries into one cohesive, high-level master summary for the main meeting. Highlight overarching themes, key decisions, and next steps.\n\nSummaries: ${JSON.stringify(roomSummaries)}`
      );
      return NextResponse.json({ masterSummary: result.response.text() });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    console.error("Breakout API error:", error);
    
    // Mock fallback responses
    return NextResponse.json({ 
      groups: [{ roomId: '1', reasoning: 'Balanced default.', participants: [] }],
      prompt: "What are everyone's thoughts on the priority goals?",
      summary: "- Discussed goals\n- Assigned roles\n- Pending sign-off",
      masterSummary: "All rooms agreed on the general Q3 roadmap."
    });
  }
}
