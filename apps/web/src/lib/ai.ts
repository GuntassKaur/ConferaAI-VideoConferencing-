import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");
export const gemini = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export async function generateRecap(transcript: string, participants: string[]) {
  const prompt = `You are Confera AI's intelligence engine. Analyze this meeting transcript and return a structured JSON summary.
Return ONLY valid JSON:
{
  "tldr": "2-sentence high-level summary",
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
    `You are Confera AI's strategic assistant. Based on this session context, provide ONE concise, professional suggestion (max 15 words) to drive the meeting forward: ${context}`
  );
  return result.response.text();
}

export async function translateText(text: string, targetLanguage: string) {
  const result = await gemini.generateContent(
    `Translate this to ${targetLanguage}. Return only the translation, nothing else: "${text}"`
  );
  return result.response.text();
}
