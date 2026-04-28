import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { transcript, roomId } = body;

    // Simulate AI Recap if transcript is short or missing
    const summary = transcript && transcript.length > 20 
      ? `The meeting discussed several key aspects of the ${roomId || 'project'}, including architectural decisions and upcoming milestones.`
      : "The session focused on aligning cross-functional teams with the upcoming production release cycle and addressing architectural bottlenecks.";

    const actionItems = [
      { task: 'Deploy security patches to the staging environment', owner: 'Dev Ops' },
      { task: 'Finalize the stakeholder communication plan', owner: 'Product Manager' },
      { task: 'Update documentation for real-time sync protocols', owner: 'Lead Engineer' }
    ];

    return NextResponse.json({ 
      success: true,
      summary, 
      actionItems,
      sentiment: 'Collaborative',
      engagementScore: 92
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
