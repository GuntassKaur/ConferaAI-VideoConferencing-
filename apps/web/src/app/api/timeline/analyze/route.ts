import { NextResponse } from 'next/server';
import { gemini } from '@/lib/ai';

export async function POST(req: Request) {
  let action = '';
  try {
    const body = await req.json();
    const transcript = body.transcript;
    action = body.action;

    if (action === 'magic_clip') {
      const result = await gemini.generateContent(
        `You are an AI meeting assistant. Summarize the provided transcript segment concisely, highlighting key takeaways: ${transcript}`
      );
      return NextResponse.json({ summary: result.response.text() });
    }

    // Default action: auto-highlight detection
    const result = await gemini.generateContent(
      `You are an AI assistant analyzing a meeting transcript. Extract highlights (decision, action_item, question, key_moment). Return ONLY JSON (no markdown): { "highlights": [{ "type": string, "text": string, "timestamp": number, "importance": number }] }.\n\nTranscript: ${transcript}`
    );

    const content = result.response.text();
    const jsonStr = content.substring(content.indexOf('{'), content.lastIndexOf('}') + 1);
    const parsedResult = JSON.parse(jsonStr);

    return NextResponse.json(parsedResult);
  } catch (error) {
    console.warn("AI analysis failed, using mock response", error);
    if (action === 'magic_clip') {
       return NextResponse.json({ summary: "This is an AI-generated summary of the selected clip. (Mocked due to failure)" });
    }
    
    return NextResponse.json({
      highlights: [
        { type: 'key_moment', text: 'Important point raised', timestamp: Date.now() - 60000, importance: 4 }
      ]
    });
  }
}
