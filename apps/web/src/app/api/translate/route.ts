import { NextResponse } from 'next/server';
import { gemini } from '@/lib/ai';

export async function POST(req: Request) {
  try {
    const { text, targetLang, context = '' } = await req.json();

    const result = await gemini.generateContent(
      `You are an expert real-time multilingual translator in a video meeting. Translate the user's text strictly into the language: ${targetLang}. 
If there are idioms, colloquialisms, or cultural references, translate the meaning naturally so it makes sense in the target language.
Additionally, if you detect an idiom or cultural nuance, you MUST add a brief cultural note at the end to educate the user.

Return ONLY valid JSON matching this schema:
{
  "translation": "The direct translated text",
  "notes": ["Optional cultural note 1", "Optional cultural note 2"]
}

Meeting Context: ${context}
Text to translate: "${text}"`
    );

    const content = result.response.text();
    const jsonStr = content.substring(content.indexOf('{'), content.lastIndexOf('}') + 1);
    const parsedResult = JSON.parse(jsonStr);

    return NextResponse.json(parsedResult);
  } catch (error) {
    console.warn("AI Translation failed:", error);
    // Mock fallback
    try {
      const body = await req.clone().json();
      return NextResponse.json({ 
        translation: `[${body.targetLang.toUpperCase()}]: ${body.text}`, 
        notes: [] 
      });
    } catch(e) {
      return NextResponse.json({ error: 'Translation failed' }, { status: 500 });
    }
  }
}
