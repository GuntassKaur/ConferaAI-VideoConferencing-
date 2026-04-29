import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || 'demo-key',
});

export async function POST(req: Request) {
  try {
    const { imageBase64, action, area } = await req.json();

    if (!imageBase64) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    if (action === 'spotlight' && area) {
      // Analyze specific spotlight area
      const response = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20240620',
        max_tokens: 200,
        system: `You are an AI assistant. The user is pointing a laser pointer at coordinates (x: ${area.x}, y: ${area.y}) on their shared screen. Briefly summarize what's visible in that general area based on the image.`,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: imageBase64 } },
              { type: 'text', text: 'What is the user pointing at in this area?' }
            ]
          }
        ]
      });
      return NextResponse.json({ summary: (response.content[0] as any).text });
    }

    // Default action: Full screen understanding
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 500,
      system: `You are an AI analyzing a live screen share in a meeting. Return ONLY JSON format.
{
  "description": "A very short 3-5 word description of what is shown (e.g. Google Doc - Q3 Budget, or VS Code - API Route)",
  "isNewSlide": boolean,
  "annotations": [
    { "x": 0.5, "y": 0.5, "text": "A brief observation about this specific chart or code block" }
  ]
}`,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: imageBase64 } },
            { type: 'text', text: 'Analyze this screen and provide context and annotations.' }
          ]
        }
      ]
    });

    const content = (response.content[0] as any).text;
    const jsonStr = content.substring(content.indexOf('{'), content.lastIndexOf('}') + 1);
    const result = JSON.parse(jsonStr);

    return NextResponse.json(result);
  } catch (error) {
    console.warn("Claude Vision analysis failed:", error);
    // Mock response for dev
    return NextResponse.json({
      description: "Screen Share (AI offline)",
      isNewSlide: false,
      annotations: []
    });
  }
}
