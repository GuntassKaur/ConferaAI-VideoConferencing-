import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        recap: "Key Points:\n- Q4 roadmap and AI recap prioritized\n- Frontend UI must be clean with White + Indigo theme\n\nSummary:\nThe team aligned on the immediate priorities for Q4, pushing the AI recap feature and the new clean UI update to the forefront of development.\n\nAction Items:\n- Charlie: Implement the frontend for the 5-minute AI recap\n- Alice: Schedule sync with stakeholders for next Friday",
      });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are an AI meeting assistant. Please provide output starting with 'Key Points:', 'Summary:', and 'Action Items:'" },
          { role: "user", content: `Summarize this meeting in bullet points and give key action items: ${text}` }
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
    return NextResponse.json({ error: "Failed to generate recap" }, { status: 500 });
  }
}
