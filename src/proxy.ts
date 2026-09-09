import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Pre-launch gate.
 *
 * While the site is not launched, every page request is rewritten to the
 * coming-soon page. The visitor keeps the URL they asked for, but the only
 * page they can ever see is the holding page — the marketplace, dashboard,
 * auth pages and finance tools are all unreachable.
 *
 *   SITE_LAUNCHED=true        → gate off, the whole site is open
 *   (unset / anything else)   → gated (the safe default)
 *
 * Team preview while gated: open any URL once with `?preview=<PREVIEW_TOKEN>`.
 * That sets a cookie so you (and only you) can browse the real site.
 */

const COMING_SOON_PATH = "/coming-soon";
const PREVIEW_COOKIE = "pw-preview";

export function proxy(request: NextRequest) {
  if (process.env.SITE_LAUNCHED === "true") {
    return NextResponse.next();
  }

  const { pathname, searchParams } = request.nextUrl;
  const token = process.env.PREVIEW_TOKEN;

  // The holding page itself is always allowed.
  if (pathname === COMING_SOON_PATH) {
    return NextResponse.next();
  }

  // `?preview=<token>` unlocks the real site and remembers it for a week.
  if (token && searchParams.get("preview") === token) {
    const res = NextResponse.next();
    res.cookies.set(PREVIEW_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  }

  // Someone who already unlocked preview sees the real site.
  if (token && request.cookies.get(PREVIEW_COOKIE)?.value === token) {
    return NextResponse.next();
  }

  // Everyone else: show the holding page, keep their URL.
  return NextResponse.rewrite(new URL(COMING_SOON_PATH, request.url));
}

export const config = {
  // Run on every page route except API routes (`/api/*` — e.g. the lead form
  // still needs to work while gated), Next internals (`_next/*`, including HMR)
  // and static assets.
  matcher: [
    "/((?!api|_next|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?)$).*)",
  ],
};
