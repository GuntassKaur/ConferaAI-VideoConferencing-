import { AccessToken } from "livekit-server-sdk";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { room, username } = await req.json();

    if (!room || !username) {
      return Response.json({ error: "Room and username are required" }, { status: 400 });
    }

    const at = new AccessToken(
      process.env.LIVEKIT_API_KEY!,
      process.env.LIVEKIT_API_SECRET!,
      { identity: username }
    );

    at.addGrant({
      room,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
    });

    const token = await at.toJwt();

    return Response.json({ token });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
