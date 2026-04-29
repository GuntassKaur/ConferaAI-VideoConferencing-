import { NextResponse } from 'next/server';
import { gemini } from '@/lib/ai';

export async function POST(req: Request) {
  try {
    const { imageBase64, action, area } = await req.json();

    if (!imageBase64) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    if (action === 'spotlight' && area) {
      const result = await gemini.generateContent([
        { inlineData: { data: imageBase64, mimeType: "image/jpeg" } },
        { text: `You are an AI assistant. The user is pointing a laser pointer at coordinates (x: ${area.x}, y: ${area.y}) on their shared screen. Briefly summarize what's visible in that general area based on the image.` }
      ]);
      return NextResponse.json({ summary: result.response.text() });
    }

    // Default action: Full screen understanding
    const result = await gemini.generateContent([
      { inlineData: { data: imageBase64, mimeType: "image/jpeg" } },
      { text: `You are an AI analyzing a live screen share in a meeting. Return ONLY JSON format.
{
  "description": "A very short 3-5 word description of what is shown (e.g. Google Doc - Q3 Budget, or VS Code - API Route)",
  "isNewSlide": boolean,
  "annotations": [
    { "x": number, "y": number, "text": "A brief observation about this specific chart or code block" }
  ]
}` }
    ]);

    const content = result.response.text();
    const jsonStr = content.substring(content.indexOf('{'), content.lastIndexOf('}') + 1);
    const parsedResult = JSON.parse(jsonStr);

    return NextResponse.json(parsedResult);
  } catch (error) {
    console.warn("AI Vision analysis failed:", error);
    return NextResponse.json({
      description: "Screen Share (AI offline)",
      isNewSlide: false,
      annotations: []
    });
  }
}
