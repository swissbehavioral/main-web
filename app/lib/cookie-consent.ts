export const CONSENT_COOKIE = "sbh_cookie_preferences";
export const CONSENT_DAYS = 180;
export type CookiePreference = { version: 1; externalMedia: boolean; savedAt: number };
export function parseCookiePreference(value: string | undefined, now = Date.now()): CookiePreference | null {
  try {
    const parsed = JSON.parse(decodeURIComponent(value || ""));
    return parsed.version === 1 && typeof parsed.externalMedia === "boolean" && Number.isFinite(parsed.savedAt) && parsed.savedAt <= now && now - parsed.savedAt < CONSENT_DAYS * 86400000 ? parsed : null;
  } catch { return null; }
}
