import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateMeetingSummary(
  transcript: string, 
  participants: string[], 
  duration: number
) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    throw new Error("AI Engine configuration missing");
  }
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


  const prompt = `
    You are Confera's Neural Recap engine. Analyze this meeting transcript and return ONLY a JSON object (no markdown, no backticks) with the following structure:
    {
      "title": "string",
      "tldr": "string (2 sentences maximum)",
      "keyPoints": ["string", "up to 5"],
      "actionItems": [{"task": "string", "owner": "string"}],
      "decisions": ["string"],
      "sentiment": "positive" | "neutral" | "tense",
      "engagementScore": number (0-100)
    }

    Meeting Context:
    Participants: ${participants.join(", ")}
    Duration: ${Math.floor(duration / 60)} minutes

    Transcript:
    ${transcript}
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up potential markdown formatting if Gemini included it
    const jsonString = text.replace(/```json|```/gi, "").trim();
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw new Error("Failed to generate neural recap");
  }
}
