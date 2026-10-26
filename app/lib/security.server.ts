import { randomBytes } from "node:crypto";
export const sessionSecret = process.env.SESSION_SECRET?.trim() || (process.env.NODE_ENV === "production" ? "" : randomBytes(32).toString("hex"));
if (!sessionSecret || (process.env.NODE_ENV === "production" && sessionSecret.length < 32)) throw new Error("SESSION_SECRET must be configured in production.");
export function sameOrigin(request: Request) {
  const origin = request.headers.get("Origin");
  const target = new URL(request.url).origin;
  if (origin && origin !== target) throw new Response("Invalid request origin", { status: 403 });
  const fetchSite = request.headers.get("Sec-Fetch-Site");
  let validReferer = false;
  try { validReferer = new URL(request.headers.get("Referer") || "").origin === target; } catch {}
  if (!origin && !validReferer && fetchSite !== "same-origin") throw new Response("Unable to verify request origin", {status:403});
  if (fetchSite === "cross-site") throw new Response("Invalid request origin", { status: 403 });
}
const attempts = new Map<string, { count: number; until: number }>();
export function rateLimit(key: string, limit = 30, duration = 60_000) {
  const now = Date.now();
  if (attempts.size > 10000) for (const [k, v] of attempts) if (v.until < now) attempts.delete(k);
  let item = attempts.get(key);
  if (!item || item.until < now) { item = { count: 0, until: now + duration }; attempts.set(key, item); }
  if (++item.count > limit) throw new Response("Too many attempts. Please wait and try again.", { status: 429, headers: { "Retry-After": String(Math.ceil((item.until - now) / 1000)) } });
}
export const privateHeaders = { "Cache-Control": "no-store, private", "X-Content-Type-Options":"nosniff", "Referrer-Policy":"no-referrer", "X-Robots-Tag":"noindex, nofollow, noarchive" };

export { readFormData } from "./http-security.server";
