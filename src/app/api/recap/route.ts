import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Mocked output for wow-factor demonstration without needing a real key to be set
      return NextResponse.json({
        recap: "### Key Points\n- Q4 roadmap and AI recap prioritized\n- Frontend UI must be clean with neon glassmorphism\n\n### Summary\nThe team aligned on the immediate priorities for Q4, pushing the Gemini AI recap feature and the new premium layout update to the forefront of development.\n\n### Action Items\n- Charlie: Implement the frontend for the Gemini smart chat\n- Alice: Schedule sync with stakeholders",
      });
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: {
         "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `Summarize this meeting in bullet points and give key action items based on this transcript: ${text}` }]
        }]
      })
    });

    const data = await response.json();
    
    if (data.candidates && data.candidates.length > 0) {
       return NextResponse.json({ recap: data.candidates[0].content.parts[0].text });
    } else {
       return NextResponse.json({ error: "No response from Gemini API" }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate recap via Gemini API" }, { status: 500 });
  }
}
