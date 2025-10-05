import { spotifyQuerySchema } from "@/lib/validations";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const body = spotifyQuerySchema.parse(json);

    const res = await fetch(`https://itunes.apple.com/search?media=podcast&term=${encodeURIComponent(body.query)}`)
    const data = await res.json();

    return NextResponse.json({ ok: true, data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}