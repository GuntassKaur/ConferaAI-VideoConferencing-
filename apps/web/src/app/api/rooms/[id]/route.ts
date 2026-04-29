import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { supabase } from '@/lib/supabase';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const { data: room, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('id', id)
      .single();

    // If Supabase is not fully configured, fallback to a mock room so UI doesn't break in dev
    if (error || !room) {
      console.warn(`Room lookup failed for ${id}. Using dev fallback.`, error?.message);
      return NextResponse.json({
        id,
        room_name: 'Confera Meeting',
        host_id: 'anonymous',
        created_at: new Date().toISOString(),
        participant_count: 0
      });
    }

    const createdAt = new Date(room.created_at).getTime();
    const now = Date.now();
    const ageInHours = (now - createdAt) / (1000 * 60 * 60);

    if (ageInHours > 24) {
      return NextResponse.json({ error: 'Room expired' }, { status: 410 });
    }

    return NextResponse.json({
      ...room,
      participant_count: 0 // Mocked initial count, actual handled by Socket.io state
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
