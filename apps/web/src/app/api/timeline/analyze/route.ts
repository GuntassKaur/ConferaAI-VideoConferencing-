import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || 'demo-key',
});

export async function POST(req: Request) {
  let action = '';
  try {
    const body = await req.json();
    const transcript = body.transcript;
    action = body.action;

    if (action === 'magic_clip') {
      const response = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20240620',
        max_tokens: 500,
        system: 'You are an AI meeting assistant. Summarize the provided transcript segment concisely, highlighting key takeaways.',
        messages: [{ role: 'user', content: transcript }]
      });
      return NextResponse.json({ summary: (response.content[0] as any).text });
    }

    // Default action: auto-highlight detection
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 1000,
      system: 'You are an AI assistant analyzing a meeting transcript. Extract highlights (decision, action_item, question, key_moment). Return ONLY JSON: { "highlights": [{ "type": string, "text": string, "timestamp": number, "importance": number }] }.',
      messages: [{ role: 'user', content: transcript }]
    });

    const content = (response.content[0] as any).text;
    const jsonStr = content.substring(content.indexOf('{'), content.lastIndexOf('}') + 1);
    const result = JSON.parse(jsonStr);

    return NextResponse.json(result);
  } catch (error) {
    console.warn("Claude AI analysis failed or no API key, using mock response", error);
    // Return mock data for demo purposes if the API key is not valid or network fails
    if (action === 'magic_clip') {
       return NextResponse.json({ summary: "This is an AI-generated summary of the selected clip. (Mocked due to missing API key)" });
    }
    
    return NextResponse.json({
      highlights: [
        { type: 'key_moment', text: 'Important point raised', timestamp: Date.now() - 60000, importance: 4 }
      ]
    });
  }
}
