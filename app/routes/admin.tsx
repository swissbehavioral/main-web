import {adminBackLink} from "../lib/admin-navigation";
import type { ShouldRevalidateFunctionArgs } from "react-router";
import { MessageSquare, FileText, ShieldCheck } from "lucide-react";
import { Logo } from "../components/logo";
import { IconArrowUpRight, IconUsers } from "../components/icons";
import { Form, Link, NavLink, Outlet, useLocation, useMatches, data } from "react-router";

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

export function shouldRevalidate({currentUrl,nextUrl,defaultShouldRevalidate}:ShouldRevalidateFunctionArgs) {
  return currentUrl.pathname===nextUrl.pathname && nextUrl.pathname==="/admin/content" && currentUrl.search!==nextUrl.search ? false : defaultShouldRevalidate;
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
  const location=useLocation(),path=location.pathname;
  const record=useMatches().map(match=>(match.data as {record?:{kind?:string}}|undefined)?.record).find(Boolean);
  const back=adminBackLink(path,location.search,record?.kind);
  const title = path.startsWith("/admin/chat")
    ? "Conversations"
    : path.startsWith("/admin/staff")
      ? "Staff & access"
      : path.startsWith("/admin/content")
        ? "Pages & blog"
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
            Leads & inquiries<span>→</span>
          </NavLink>
          <NavLink to="/admin/chat" className="sidebar-nav">
            <MessageSquare className="h-5 w-5" /> Live chat <span>→</span>
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
        <div className="sidebar-note">
          <span className="sidebar-note-rule" />
          <p>
            A thoughtful first response.
            <br />A personal next step.
          </p>
        </div>
        <Link to="/" className="sidebar-site" target="_blank" rel="noopener noreferrer" title="Opens the public website in a new tab; you stay signed in here">
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
            title={health.reachable ? "Services available" : "Services unavailable"}
          >
            <i />
            {provider === "appwrite"
              ? health.reachable
                ? "Connected"
                : "Connection issue"
              : "Workspace"}
          </span>
        </header>
        <div className={`admin-content ${path === "/admin" ? "lead-directory-page" : ""}`}>
          {back?<Link className="admin-context-back" to={back.to}><span aria-hidden="true">←</span>{back.label}</Link>:null}
          <div className="admin-page-heading">
            <div>
              <p className="brand-eyebrow">ADMISSIONS MANAGEMENT</p>
              <h1>{title}</h1>
              <p>A clear view of every conversation and its next step.</p>
            </div>
            <Link to="/contact" className="admin-secondary-link" target="_blank" rel="noopener noreferrer">
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
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export function headers() {
  return privateHeaders;
}
