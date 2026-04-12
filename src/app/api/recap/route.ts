export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { transcripts } = await req.json();
    
    if (!transcripts || transcripts.length === 0) {
      return NextResponse.json({ error: "No transcript data provided" }, { status: 400 });
    }

    const transcriptText = transcripts.map((t: any) => `${t.speaker}: ${t.text}`).join('\n');

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { 
          role: "system", 
          content: `You are an expert AI meeting analyst. Analyze the transcript and provide a structured JSON response.
          Schema:
          {
            "summary": "Full paragraph summary",
            "keyPoints": ["Point 1", "Point 2"],
            "actionItems": [{"task": "Do this", "priority": "high" | "medium" | "low"}]
          }` 
        },
        { role: "user", content: `Analyze this transcript:\n${transcriptText}` }
      ],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error("Empty AI response");

    return NextResponse.json(JSON.parse(content));
  } catch (error: any) {
    console.error('AI Recap Error:', error);
    return NextResponse.json({ error: "High-security neural link failed. Fallback to local processing." }, { status: 500 });
  }
}
