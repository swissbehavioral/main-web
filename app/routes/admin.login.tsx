import { readFormData } from "../lib/security.server";
import { sameOrigin, rateLimit, privateHeaders } from "../lib/security.server";
import { Logo } from "../components/logo";
import { Form, Link, data, redirect, useNavigation } from "react-router";

import { Container } from "../components/ui/container";
import { appwriteAuthEnabled } from "../lib/appwrite.server";
import {
  isAdmin,
  startAdminSession,
  verifyAdminCredentials,
} from "../lib/auth.server";
import type { Route } from "./+types/admin.login";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Admin Login | Swiss Behavioral Health" },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  if (await isAdmin(request)) throw redirect("/admin");
  const url = new URL(request.url);
  const redirectTo = url.searchParams.get("redirectTo") ?? "/admin";
  return {
    provider: appwriteAuthEnabled
      ? ("appwrite" as const)
      : ("shared-password" as const),
    redirectTo,
  };
}

export async function action({ request }: Route.ActionArgs) {
  sameOrigin(request);
  const form = await readFormData(request);
  const email = String(form.get("email") ?? "").trim();
  const password = String(form.get("password") ?? "");
  const redirectTo = String(form.get("redirectTo") ?? "/admin");

  rateLimit(`login:${email.toLowerCase()}`, 10, 600000);
  const result = await verifyAdminCredentials(email, password);
  if (!result.ok || !result.identity) {
    return data(
      { error: result.message ?? "Invalid credentials." },
      { status: 401 },
    );
  }

  const cookie = await startAdminSession(request, result.identity);
  return redirect(
    /^\/admin(?:[/?]|$)/.test(redirectTo) ? redirectTo : "/admin",
    {
      headers: { "Set-Cookie": cookie },
    },
  );
}

export default function AdminLogin({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { provider, redirectTo } = loaderData;
  const navigation = useNavigation();
  const submitting = navigation.state === "submitting";
  return (
    <main id="main-content" className="admin-login">
      <aside className="login-brand">
        <Link to="/" aria-label="Swiss Behavioral Health home">
          <Logo variant="footer" />
        </Link>
        <div className="login-brand-message">
          <img src="/logos/SBH_Isotipo_Color.svg" alt="" aria-hidden="true" />
          <p className="brand-eyebrow">THE PEOPLE BEHIND THE CARE</p>
          <h2>
            A personal approach.
            <br />
            At every step.
          </h2>
          <p>
            A dedicated space for the admissions team to keep conversations
            moving forward.
          </p>
        </div>
        <p className="login-brand-footer">
          Swiss Behavioral Health <span>Tampa Bay, Florida</span>
        </p>
      </aside>
      <div className="login-form-panel">
        <Link to="/" className="login-back">
          ← Back to website
        </Link>
        <div className="login-form-content">
          <p className="brand-eyebrow">STAFF ACCESS</p>
          <h1>Welcome back.</h1>
          <p>Sign in to your admissions workspace.</p>
          {actionData?.error ? (
            <p
              role="alert"
              className="mt-6 rounded-md border border-navy-200 bg-navy-50 p-4 text-sm text-navy-800"
            >
              {actionData.error}
            </p>
          ) : null}
          <Form method="post" className="mt-9 space-y-5">
            <input type="hidden" name="redirectTo" value={redirectTo} />
            <div>
              <label htmlFor="admin-email">
                Email address{" "}
                {provider === "shared-password" && <span>(if configured)</span>}
              </label>
              <input
                id="admin-email"
                name="email"
                type="email"
                autoComplete="username"
                required={provider === "appwrite"}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="admin-password">Password</label>
              <input
                id="admin-password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="Enter your password"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="login-submit"
            >
              {submitting ? "Signing in…" : "Sign in to workspace"}
              <span aria-hidden="true">→</span>
            </button>
          </Form>
          <p className="login-help">
            Access is reserved for authorized team members. Contact your
            administrator if you need help signing in.
          </p>
        </div>
        <p className="login-footer">
          © {new Date().getFullYear()} Swiss Behavioral Health
        </p>
      </div>
    </main>
  );
}

export function headers() {
  return privateHeaders;
}
