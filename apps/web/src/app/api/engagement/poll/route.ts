import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || 'demo-key',
});

export async function POST(req: Request) {
  try {
    const { transcriptContext, prompt } = await req.json();

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 300,
      system: `You are an AI meeting assistant. Generate a poll based on the recent meeting context or the user's explicit prompt.
Return ONLY valid JSON matching this schema:
{
  "question": "The poll question",
  "options": ["Option 1", "Option 2", "Option 3"]
}
Limit options to 2-5 clear, concise choices.`,
      messages: [
        { role: 'user', content: `Context: ${transcriptContext}\n\nPrompt: ${prompt || 'Generate a relevant poll to gauge team alignment on the current topic.'}` }
      ]
    });

    const content = (response.content[0] as any).text;
    const jsonStr = content.substring(content.indexOf('{'), content.lastIndexOf('}') + 1);
    const result = JSON.parse(jsonStr);

    return NextResponse.json(result);
  } catch (error) {
    console.error("AI Poll Generation failed:", error);
    return NextResponse.json({ 
      question: "Do you agree with the proposed priority?", 
      options: ["Yes, completely", "Somewhat", "Needs revision", "Not at all"] 
    });
  }
}
