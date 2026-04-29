import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");
export const gemini = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export async function generateRecap(transcript: string, participants: string[]) {
  const prompt = `You are an elite meeting AI. Analyze this transcript and return ONLY valid JSON (no markdown, no backticks):
{
  "tldr": "2-sentence summary",
  "keyDecisions": [{"decision": "", "madeBy": "", "timestamp": ""}],
  "actionItems": [{"task": "", "owner": "", "deadline": "", "priority": "high|medium|low"}],
  "openQuestions": [{"question": "", "raisedBy": ""}],
  "nextMeetingAgenda": ["..."],
  "meetingHealthScore": 0
}

Participants: ${participants.join(", ")}
Transcript:
${transcript}`;

  const result = await gemini.generateContent(prompt);
  const text = result.response.text();
  // Clean up potential markdown formatting
  const jsonStr = text.replace(/```json|```/g, "").trim();
  return JSON.parse(jsonStr);
}

export async function generateCopilotSuggestion(context: string) {
  const result = await gemini.generateContent(
    `You are a live meeting co-pilot. Based on this meeting context, give ONE short, specific suggestion (max 15 words): ${context}`
  );
  return result.response.text();
}

export async function translateText(text: string, targetLanguage: string) {
  const result = await gemini.generateContent(
    `Translate this to ${targetLanguage}. Return only the translation, nothing else: "${text}"`
  );
  return result.response.text();
}
