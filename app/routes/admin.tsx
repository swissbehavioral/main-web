import { useEffect } from "react";
import { useAdminAlerts } from "../lib/use-admin-alerts";
import { adminBackLink } from "../lib/admin-navigation";
import type { ShouldRevalidateFunctionArgs } from "react-router";
import { MessageSquare, FileText, ShieldCheck } from "lucide-react";
import { Logo } from "../components/logo";
import { IconArrowUpRight, IconUsers } from "../components/icons";
import {
  Form,
  Link,
  NavLink,
  Outlet,
  useLocation,
  useMatches,
  data,
  useRevalidator,
  useNavigation,
} from "react-router";

import { can, roleLabels } from "../lib/permissions";
import { privateHeaders } from "../lib/security.server";
import { checkAppwriteHealth } from "../lib/appwrite.server";
import { requireAdmin } from "../lib/auth.server";
import { leadsProvider } from "../lib/leads.server";
import type { Route } from "./+types/admin";

/**
 * Admin area layout (§3.1). Every child route is guarded here — the loader
 * redirects unauthenticated visitors to the login screen.
 */
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Admin Dashboard | Swiss Behavioral Health" },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

export function shouldRevalidate({
  currentUrl,
  nextUrl,
  defaultShouldRevalidate,
}: ShouldRevalidateFunctionArgs) {
  return currentUrl.pathname === nextUrl.pathname &&
    nextUrl.pathname === "/admin/content" &&
    currentUrl.search !== nextUrl.search
    ? false
    : defaultShouldRevalidate;
}

export async function loader({ request }: Route.LoaderArgs) {
  const identity = await requireAdmin(request);
  const health = await checkAppwriteHealth();
  return data(
    { identity, health, provider: leadsProvider },
    { headers: privateHeaders },
  );
}

export default function AdminLayout({ loaderData }: Route.ComponentProps) {
  const { identity, health, provider } = loaderData;
  const location = useLocation(),
    path = location.pathname,
    matches = useMatches();
  const alerts = useAdminAlerts(identity.id);
  const revalidator = useRevalidator(),
    navigation = useNavigation();
  useEffect(() => {
    const update = () => {
      if (
        !document.hidden &&
        revalidator.state === "idle" &&
        navigation.state === "idle" &&
        ["/admin", "/admin/insurance", "/admin/chat"].includes(path)
      )
        void revalidator.revalidate();
    };
    window.addEventListener("sbh-workspace-update", update);
    window.addEventListener("focus", update);
    document.addEventListener("visibilitychange", update);
    return () => {
      window.removeEventListener("sbh-workspace-update", update);
      window.removeEventListener("focus", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, [revalidator, navigation.state, path]);
  const badge = (count: number) =>
    count > 0 ? (
      <span className="workspace-unread" aria-label={`${count} unread`}>
        {count > 99 ? "99+" : count}
      </span>
    ) : null;
  const record = matches
    .map(
      (match) =>
        (match.data as { record?: { kind?: string } } | undefined)?.record,
    )
    .find(Boolean);
  const back = adminBackLink(
    path,
    location.search,
    record?.kind ||
      matches
        .map(
          (match) =>
            (match.data as { lead?: { kind?: string } } | undefined)?.lead
              ?.kind,
        )
        .find(Boolean),
  );
  const title = path.startsWith("/admin/chat")
    ? "Conversations"
    : path.startsWith("/admin/staff")
      ? "Staff & access"
      : path.startsWith("/admin/content")
        ? "Pages & blog"
        : path.startsWith("/admin/insurance")
          ? "Insurance inquiries"
          : "Leads & inquiries";
  return (
    <div className="admin-workspace">
      <aside className="admin-sidebar">
        <Link to="/admin" aria-label="Admissions workspace home">
          <Logo variant="footer" />
        </Link>
        <p className="sidebar-label">ADMISSIONS WORKSPACE</p>
        <nav aria-label="Admin sections">
          <NavLink to="/admin" end className="sidebar-nav">
            <IconUsers className="h-5 w-5" />
            Leads & inquiries{badge(alerts.counts.inquiry)}
          </NavLink>
          <NavLink to="/admin/insurance" className="sidebar-nav">
            <ShieldCheck className="h-5 w-5" />
            Insurance inquiries{badge(alerts.counts.insurance)}
          </NavLink>
          <NavLink to="/admin/chat" className="sidebar-nav">
            <MessageSquare className="h-5 w-5" /> Live chat{" "}
            {badge(alerts.counts.chat)}
          </NavLink>
          {can(identity.role, "content") && (
            <NavLink to="/admin/content" className="sidebar-nav">
              <FileText className="h-5 w-5" /> Pages & blog <span>→</span>
            </NavLink>
          )}
          {can(identity.role, "staff") && (
            <NavLink to="/admin/staff" className="sidebar-nav">
              <ShieldCheck className="h-5 w-5" /> Staff & access <span>→</span>
            </NavLink>
          )}
        </nav>
        <div className="workspace-alert-settings">
          <button type="button" onClick={() => void alerts.toggle()}>
            {alerts.enabled
              ? "Disable desktop alerts"
              : "Enable desktop alerts"}
          </button>
          <small>
            {alerts.permission === "denied"
              ? "Notifications are blocked in this browser’s site settings."
              : alerts.permission === "unsupported"
                ? "Desktop alerts are unavailable in this browser. Tab and section badges remain active."
                : alerts.enabled
                  ? "Alerts are on while this workspace is open."
                  : "Get alerts while working in another tab."}
          </small>
          {alerts.problem && (
            <small role="status">
              Updates delayed. Retrying automatically.
            </small>
          )}
        </div>
        <div className="sidebar-note">
          <span className="sidebar-note-rule" />
          <p>
            A thoughtful first response.
            <br />A personal next step.
          </p>
        </div>
        <Link
          to="/"
          className="sidebar-site"
          target="_blank"
          rel="noopener noreferrer"
          title="Opens the public website in a new tab; you stay signed in here"
        >
          Public website (new tab) <IconArrowUpRight className="h-4 w-4" />
        </Link>
        <div className="sidebar-account">
          <span className="account-avatar">
            {(identity?.email ?? "A").slice(0, 1).toUpperCase()}
          </span>
          <div>
            <strong>{identity?.email ?? "Admin"}</strong>
            <small>{roleLabels[identity.role]}</small>
          </div>
          <Form method="post" action="/admin/logout">
            <button type="submit">Sign out</button>
          </Form>
        </div>
      </aside>
      <main id="main-content" className="admin-main">
        <header className="admin-topbar">
          <p>
            Workspace <span>/</span> Admissions
          </p>
          <span
            className={`connection-badge ${provider === "appwrite" && !health.reachable ? "connection-warning" : ""}`}
            title={
              health.reachable ? "Services available" : "Services unavailable"
            }
          >
            <i />
            {provider === "appwrite"
              ? health.reachable
                ? "Connected"
                : "Connection issue"
              : "Workspace"}
          </span>
        </header>
        <div
          className={`admin-content ${["/admin", "/admin/insurance"].includes(path) ? "lead-directory-page" : ""}`}
        >
          {back ? (
            <Link className="admin-context-back" to={back.to}>
              <span aria-hidden="true">←</span>
              {back.label}
            </Link>
          ) : null}
          <div className="admin-page-heading">
            <div>
              <p className="brand-eyebrow">ADMISSIONS MANAGEMENT</p>
              <h1>{title}</h1>
              <p>A clear view of every conversation and its next step.</p>
            </div>
            <Link
              to={
                path.startsWith("/admin/insurance")
                  ? "/verify-insurance"
                  : "/contact"
              }
              className="admin-secondary-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Inquiry form (new tab) <IconArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          {!health.reachable && provider === "appwrite" ? (
            <p
              role="status"
              className="mb-6 rounded-md border border-navy-200 bg-navy-50 p-4 text-sm text-navy-900"
            >
              The service is temporarily unavailable. Please try again shortly.
            </p>
          ) : null}
          {alerts.notice && (
            <div className="workspace-alert-toast" role="status">
              <Link to={alerts.notice.to} onClick={alerts.dismiss}>
                {alerts.notice.kind === "chat"
                  ? "New chat activity"
                  : alerts.notice.kind === "insurance"
                    ? "New insurance inquiry"
                    : "New website inquiry"}{" "}
                — Open →
              </Link>
              <button
                type="button"
                onClick={alerts.dismiss}
                aria-label="Dismiss notification"
              >
                ×
              </button>
            </div>
          )}
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export function headers() {
  return privateHeaders;
}
