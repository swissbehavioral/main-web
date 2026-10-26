import { timingSafeEqual } from "node:crypto";
import { Account } from "node-appwrite";
import { createCookieSessionStorage, redirect } from "react-router";
import { appwriteAuthEnabled, createUserClient, getUsers, getServerClient } from "./appwrite.server";
import { can, roleFromLabels, type Permission, type StaffRole } from "./permissions";
import { sessionSecret } from "./security.server";
export const adminSessionStorage = createCookieSessionStorage({ cookie: { name: "sbh_admin_session", httpOnly: true, path: "/", sameSite: "lax", secrets: [sessionSecret], secure: process.env.NODE_ENV === "production", maxAge: 28800 } });
export interface AdminIdentity { id: string; email: string; name: string; role: StaffRole; provider: "appwrite" | "shared-password"; }
interface LoginIdentity extends AdminIdentity { secret?: string; }
export function checkAdminPassword(input: string) {
  const expected = process.env.ADMIN_PASSWORD || (process.env.NODE_ENV !== "production" ? "sbh-admin" : "");
  const a = Buffer.from(input), b = Buffer.from(expected);
  return !!expected && a.length === b.length && timingSafeEqual(a, b);
}
export async function verifyAdminCredentials(email: string, password: string): Promise<{ ok: boolean; identity?: LoginIdentity; message?: string }> {
  if (appwriteAuthEnabled) {
    try {
      // The server key allows Appwrite to return the secret for SSR cookies.
      const session = await new Account(getServerClient()).createEmailPasswordSession({ email, password });
      const user = await getUsers().get({ userId: session.userId });
      const role = roleFromLabels(user.labels);
      if (!role || !user.status) { await getUsers().deleteSession({ userId: user.$id, sessionId: session.$id }); return { ok: false, message: "This account does not have staff access." }; }
      return { ok: true, identity: { id: user.$id, email: user.email, name: user.name, role, provider: "appwrite", secret: session.secret } };
    } catch { return { ok: false, message: "Invalid credentials or staff access unavailable." }; }
  }
  if (process.env.NODE_ENV === "production") return {ok:false, message:"Staff sign-in is temporarily unavailable."};
  const expected = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if ((expected && email.toLowerCase() !== expected) || !checkAdminPassword(password)) return { ok: false, message: "Invalid credentials." };
  return { ok: true, identity: { id: "local-admin", email: email || "admin", name: "Local administrator", role: "admin", provider: "shared-password" } };
}
export const getAdminSession = (request: Request) => adminSessionStorage.getSession(request.headers.get("Cookie"));
export async function getAdminIdentity(request: Request): Promise<AdminIdentity | null> {
  const session = await getAdminSession(request);
  if (session.get("admin") !== true || Date.now() - Number(session.get("since")) > 28800000) return null;
  if (appwriteAuthEnabled) {
    const secret = session.get("secret");
    if (!secret) return null;
    try {
      const user = await new Account(createUserClient().setSession(secret)).get();
      const role = roleFromLabels(user.labels);
      if (!role || !user.status) return null;
      return { id: user.$id, email: user.email, name: user.name, role, provider: "appwrite" };
    } catch (e) { if ([401,403,404].includes((e as {code:number}).code)) return null; throw new Response("Authentication service unavailable. Try again shortly.", {status:503}); }
  }
  if (session.get("provider") !== "shared-password") return null;
  return { id: "local-admin", email: session.get("email"), name: "Local administrator", role: "admin", provider: "shared-password" };
}
export async function isAdmin(request: Request) { return !!await getAdminIdentity(request); }
export async function requireAdmin(request: Request): Promise<AdminIdentity> {
  const identity = await getAdminIdentity(request);
  if (identity) return identity;
  const url = new URL(request.url);
  throw redirect(`/admin/login?redirectTo=${encodeURIComponent(url.pathname + url.search)}`);
}
export async function requirePermission(request: Request, permission: Permission) {
  const user = await requireAdmin(request);
  if (!can(user.role, permission)) throw new Response("You do not have permission for this action.", { status: 403 });
  return user;
}
export async function startAdminSession(request: Request, identity: LoginIdentity) {
  const session = await adminSessionStorage.getSession();
  for (const [k,v] of Object.entries({ admin: true, email: identity.email, provider: identity.provider, secret: identity.secret, since: Date.now() })) session.set(k,v);
  return adminSessionStorage.commitSession(session);
}
export async function endAdminSession(request: Request) {
  const session = await getAdminSession(request);
  if (session.get("secret")) { try { await new Account(createUserClient().setSession(session.get("secret"))).deleteSession({ sessionId: "current" }); } catch {} }
  return adminSessionStorage.destroySession(session);
}
