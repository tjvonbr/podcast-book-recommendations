import { spotifyQuerySchema } from "@/lib/validations";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const body = spotifyQuerySchema.parse(json);

    const authRes = await fetch(`https://accounts.spotify.com/api/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `grant_type=client_credentials&client_id=${process.env.SPOTIFY_CLIENT_ID}&client_secret=${process.env.SPOTIFY_CLIENT_SECRET}`,
    })

    const auth = await authRes.json();

    const res = await fetch(`https://api.spotify.com/v1/search?q=${body.query}&type=show`, {
      headers: {
        Authorization: `Bearer ${auth.access_token}`,
      },
    });

    const data = await res.json();
    console.log(data)

    return NextResponse.json({ ok: true, data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}