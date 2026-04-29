import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function generateRoomId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const getGroup = () => Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `${getGroup()}-${getGroup()}-${getGroup()}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const host_id = body.host_id || 'guest';
    const room_name = body.room_name || 'Confera Meeting';

    const roomId = generateRoomId();
    const roomData = {
      id: roomId,
      host_id,
      room_name,
      created_at: new Date().toISOString(),
      status: 'active'
    };

    // Try Supabase if configured, but always succeed
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co') {
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        await supabase.from('rooms').insert(roomData);
      } catch (dbErr) {
        console.warn('Supabase insert skipped (not configured):', dbErr);
      }
    }

    return NextResponse.json(roomData);
  } catch (error) {
    console.error('Room create error:', error);
    // Even on error, return a working room ID so users can meet
    const fallbackId = `${Math.random().toString(36).substring(2, 5).toUpperCase()}-${Math.random().toString(36).substring(2, 5).toUpperCase()}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
    return NextResponse.json({ id: fallbackId, status: 'active', created_at: new Date().toISOString() });
  }
}
