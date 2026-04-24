import { NextRequest } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const { message, transcript, participants, roomName } = await req.json();

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const systemPrompt = `
      You are Confera Brain, a sophisticated AI assistant embedded in a live video call.
      Meeting Identity: ${roomName}
      Authorized Nodes (Participants): ${participants?.join(", ") || 'Unknown'}
      
      Neural Session Data (Transcript):
      ${transcript || 'No transcript data yet.'}

      Mission: Answer the user's request concisely and helpfully based on the session data provided. 
      Maintain a futuristic, professional, and tactical tone. 
      If you are asked for a summary, prioritize key decisions and action items.
    `;

    const result = await model.generateContentStream([systemPrompt, message]);

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            if (chunkText) {
              // Standard SSE format for streaming to client
              const data = JSON.stringify({ text: chunkText });
              controller.enqueue(encoder.encode(`data: ${data}\n\n`));
            }
          }
          controller.close();
        } catch (e) {
          controller.error(e);
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error: any) {
    console.error('Gemini Neural Stream Error:', error);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
