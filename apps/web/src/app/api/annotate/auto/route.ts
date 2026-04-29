import { NextResponse } from 'next/server';
import { gemini } from '@/lib/ai';

export async function POST(req: Request) {
  try {
    const { imageBase64, prompt } = await req.json();

    if (!imageBase64) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    const result = await gemini.generateContent([
      { inlineData: { data: imageBase64, mimeType: "image/jpeg" } },
      { text: `You are an AI generating SVG annotations for a 1920x1080 screen. The user voice command was: "${prompt}". 
Identify the most relevant data point, chart, or UI element corresponding to their command and draw a highlighting shape around it.
Return ONLY raw valid SVG code (no markdown or explanations). 
The SVG must have viewBox="0 0 1920 1080" and a transparent background. 
Use a striking color like #ef4444 (red) or #f59e0b (amber) with a stroke-width of 6. Do not include fills, only strokes.` }
    ]);

    let svgStr = result.response.text();
    // Clean up markdown block if present
    svgStr = svgStr.replace(/```xml/g, '').replace(/```svg/g, '').replace(/```/g, '').trim();

    return NextResponse.json({ svg: svgStr });
  } catch (error) {
    console.warn("AI Auto Annotate failed:", error);
    // Mock response
    return NextResponse.json({ 
      svg: `<svg viewBox="0 0 1920 1080" width="100%" height="100%"><circle cx="960" cy="540" r="200" stroke="#ef4444" stroke-width="8" fill="none" opacity="0.8" /></svg>` 
    });
  }
}
