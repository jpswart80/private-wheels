/**
 * Shared between `proxy.ts` (which reads the cookie) and the `/preview` PIN
 * page's API route (which sets it) — kept in one place so the two can't drift.
 */
export const PREVIEW_COOKIE_NAME = "pw-preview";

export const PREVIEW_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 1 week
};
