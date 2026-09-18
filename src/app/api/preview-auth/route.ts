import { NextResponse } from "next/server";
import { PREVIEW_COOKIE_NAME, PREVIEW_COOKIE_OPTIONS } from "@/lib/preview-access";

/**
 * Backs the `/preview` PIN page — checks the submitted PIN against
 * PREVIEW_TOKEN and, on a match, sets the same cookie `proxy.ts` already
 * accepts from the `?preview=<token>` query-param flow.
 *
 * Not a hardened auth boundary (a 4-digit PIN is inherently guessable) — this
 * exists to make demoing the gated site easy, not to secure it.
 */
export async function POST(request: Request) {
  const token = process.env.PREVIEW_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "Preview access isn't configured." }, { status: 503 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const pin = typeof payload.pin === "string" ? payload.pin.trim() : "";
  if (!pin || pin !== token) {
    return NextResponse.json({ error: "Incorrect PIN." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(PREVIEW_COOKIE_NAME, token, PREVIEW_COOKIE_OPTIONS);
  return res;
}
