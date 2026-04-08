export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    const apiKey = process.env.OPENAI_API_KEY;

    // AI AUTO NOTES / RECAP MOCKUP FALLBACK (If no API Key)
    if (!apiKey) {
      return NextResponse.json({
        recap: "### Key Points\n- Q4 roadmap and AI recap prioritized\n- Frontend UI must be clean with neon glassmorphism\n\n### Summary\nThe team aligned on the immediate priorities for Q4, pushing the AI recap feature and the new premium layout update to the forefront of development.\n\n### Action Items\n- Charlie: Implement the frontend for the Smart Chat AI\n- Alice: Schedule sync with stakeholders",
      });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are an AI meeting assistant. Generate output in markdown with '### Key Points', '### Summary', and '### Action Items' format." },
          { role: "user", content: `Summarize this meeting transcript and extract the key intelligence: ${text}` }
        ]
      })
    });

    const data = await response.json();
    
    if (data.choices && data.choices.length > 0) {
       return NextResponse.json({ recap: data.choices[0].message.content });
    } else {
       return NextResponse.json({ error: "No response from AI" }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate recap via OpenAI API" }, { status: 500 });
  }
}
