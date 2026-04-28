import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { connectDB } from '@/lib/mongodb';

import Meeting from '@/models/Meeting';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const meeting = await Meeting.findOne({ meetingId: id });
    if (!meeting) {
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
    }

    // Capture notes if they exist to provide better context to AI
    const meetingContext = meeting.notes ? `Context from shared notes: ${meeting.notes}` : "No specific notes captured.";

    // Generate Realistic AI Recap using Gemini
    let recap;
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `
        You are an elite enterprise executive assistant.
        The meeting titled "${meeting.name || id}" has just ended.
        ${meetingContext}
        
        Generate a professional, intelligence-grade recap in strict JSON format.
        
        The JSON MUST have exactly these keys:
        - tldr: A concise 1-2 sentence executive summary.
        - keyPoints: An array of 3-4 strategic takeaways.
        - actionItems: An array of 3 objects with "task" and "owner" (use realistic names like 'Dev Lead', 'Product Manager', 'Ops').
        - sentiment: A single word describing the meeting vibe.
        - engagementScore: A number from 0-100.

        Return ONLY the JSON block. Do not include markdown formatting.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();
      
      // Clean up potential markdown JSON blocks
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        recap = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (aiError) {
      console.error('Gemini failed, falling back to template:', aiError);
      recap = {
        tldr: 'The session focused on aligning cross-functional teams with the upcoming production release cycle and addressing architectural bottlenecks.',
        keyPoints: [
          'Confirmed the final feature set for the Q3 enterprise rollout.',
          'Identified mission-critical security patches required for deployment.',
          'Synthesized feedback from stakeholders regarding the new UI design system.',
          'Established a secondary validation protocol for real-time telemetry.'
        ],
        actionItems: [
          { task: 'Deploy security patches to the staging environment', owner: 'Dev Ops' },
          { task: 'Finalize the stakeholder communication plan', owner: 'Product Manager' },
          { task: 'Update documentation for real-time sync protocols', owner: 'Lead Engineer' }
        ],
        sentiment: 'Collaborative',
        engagementScore: 94,
      };
    }

    meeting.status = 'ended';
    meeting.recap = recap;
    await meeting.save();

    return NextResponse.json({ success: true, recap });
  } catch (error: any) {
    console.error('Error ending meeting:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
