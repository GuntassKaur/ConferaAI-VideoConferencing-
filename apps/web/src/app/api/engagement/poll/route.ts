import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { gemini } from '@/lib/ai';

export async function POST(req: Request) {
  try {
    const { transcriptContext, prompt } = await req.json();

    const result = await gemini.generateContent(
      `You are an AI meeting assistant. Generate a poll based on the recent meeting context or the user's explicit prompt.
Return ONLY valid JSON matching this schema:
{
  "question": "The poll question",
  "options": ["Option 1", "Option 2", "Option 3"]
}
Limit options to 2-5 clear, concise choices.

Context: ${transcriptContext}
Prompt: ${prompt || 'Generate a relevant poll to gauge team alignment on the current topic.'}`
    );

    const content = result.response.text();
    const jsonStr = content.substring(content.indexOf('{'), content.lastIndexOf('}') + 1);
    const parsedResult = JSON.parse(jsonStr);

    return NextResponse.json(parsedResult);
  } catch (error) {
    console.error("AI Poll Generation failed:", error);
    return NextResponse.json({ 
      question: "Do you agree with the proposed priority?", 
      options: ["Yes, completely", "Somewhat", "Needs revision", "Not at all"] 
    });
  }
}
