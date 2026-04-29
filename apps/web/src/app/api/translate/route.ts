import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || 'demo-key',
});

export async function POST(req: Request) {
  try {
    const { text, targetLang, context = '' } = await req.json();

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 300,
      system: `You are an expert real-time multilingual translator in a video meeting. Translate the user's text strictly into the language: ${targetLang}. 
If there are idioms, colloquialisms, or cultural references, translate the meaning naturally so it makes sense in the target language.
Additionally, if you detect an idiom or cultural nuance, you MUST add a brief cultural note at the end to educate the user.

Return ONLY valid JSON matching this schema:
{
  "translation": "The direct translated text",
  "notes": ["Optional cultural note 1", "Optional cultural note 2"]
}`,
      messages: [
        { role: 'user', content: `Meeting Context: ${context}\n\nText to translate: "${text}"` }
      ]
    });

    const content = (response.content[0] as any).text;
    const jsonStr = content.substring(content.indexOf('{'), content.lastIndexOf('}') + 1);
    const result = JSON.parse(jsonStr);

    return NextResponse.json(result);
  } catch (error) {
    console.warn("Claude Translation failed:", error);
    // Mock fallback
    const { text, targetLang } = await req.json();
    return NextResponse.json({ 
      translation: `[${targetLang.toUpperCase()}]: ${text}`, 
      notes: [] 
    });
  }
}
