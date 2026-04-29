import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { z } from 'zod';

const createRoomSchema = z.object({
  host_id: z.string().optional().default('anonymous'),
  room_name: z.string().optional().default('Confera Meeting'),
});

function generateRoomId() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const getGroup = () => Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `${getGroup()}-${getGroup()}-${getGroup()}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { host_id, room_name } = createRoomSchema.parse(body);
    
    const roomId = generateRoomId();
    
    // Attempting to insert into Supabase. 
    // If the database is not set up, we fallback to returning the ID so the UI doesn't break in dev.
    const { data, error } = await supabase
      .from('rooms')
      .insert({
        id: roomId,
        host_id,
        room_name,
        settings: {
          is_locked: false,
          allow_chat: true,
          video_quality: 'high'
        },
        status: 'active'
      })
      .select()
      .single();

    if (error) {
      console.warn('Supabase insertion failed (possibly not setup yet). Proceeding in dev mode. Error:', error.message);
      // Fallback response for dev when Supabase isn't fully configured
      return NextResponse.json({ 
        id: roomId, 
        host_id, 
        room_name, 
        created_at: new Date().toISOString() 
      });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
