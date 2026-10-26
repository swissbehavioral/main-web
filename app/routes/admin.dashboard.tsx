import { Users, MessageSquare, ShieldCheck, UserCheck } from "lucide-react";
import { Button } from "../components/ui/button";
import { DateField } from "../components/date-field";
import { dateRangeError } from "../lib/calendar";
import { Form, Link, data, useNavigation } from "react-router";
import { requireAdmin } from "../lib/auth.server";
import { can } from "../lib/permissions";
import { listLeads } from "../lib/leads.server";
import { listStaff } from "../lib/staff.server";
import { filterLeads } from "../lib/lead-filters";
import {
  leadKindLabels,
  leadStatusLabels,
  verificationLabels,
} from "../lib/leads.types";
import { privateHeaders } from "../lib/security.server";
import type { Route } from "./+types/admin.dashboard";
export function meta() {
  return [{ title: "Leads | SBH Admin" }];
}
export async function loader({ request }: Route.LoaderArgs) {
  const identity = await requireAdmin(request);
  const params = new URL(request.url).searchParams;
  const [all, staff] = await Promise.all([listLeads(), listStaff()]);
  const visible = all.filter(
    (l) => identity.role !== "agent" || l.assignedTo === identity.id,
  );
  const matches = filterLeads(visible, params);
  const active = visible.filter((l) => l.status !== "deleted");
  const page = Math.max(
    1,
    Math.min(
      Math.ceil(matches.length / 25) || 1,
      Number(params.get("page")) || 1,
    ),
  );
  return data(
    {
      identity,
      staff,
      leads: matches.slice((page - 1) * 25, page * 25),
      count: matches.length,
      page,
      filters: Object.fromEntries(params),
      query: params.toString(),
      dateError: dateRangeError(
        params.get("from") || "",
        params.get("to") || "",
      ),
      summary: {
        total: active.length,
        new: active.filter((l) => l.status === "new").length,
        insurance: active.filter(
          (l) =>
            l.kind === "insurance" &&
            !["verified", "not_eligible"].includes(l.verificationStatus || ""),
        ).length,
        admitted: active.filter((l) => l.status === "admitted").length,
      },
    },
    { headers: privateHeaders },
  );
}
export default function Dashboard({ loaderData: d }: Route.ComponentProps) {
  const busy = useNavigation().state !== "idle";
  function pageUrl(page: number) {
    const p = new URLSearchParams(d.query);
    p.set("page", String(page));
    return `/admin?${p}`;
  }
  return (
    <div className="management">
      <div className="management-stats">
        {Object.entries({
          "Active leads": d.summary.total,
          "Awaiting response": d.summary.new,
          "Insurance to review": d.summary.insurance,
          Admitted: d.summary.admitted,
        }).map(([label, count], index) => {
          const Icon = [Users, MessageSquare, ShieldCheck, UserCheck][index];
          return (
            <div key={label} className="dashboard-metric">
              <div className="metric-caption">
                <span>{label}</span>
                <span className="metric-icon">
                  <Icon size={19} aria-hidden="true" />
                </span>
              </div>
              <strong>{count}</strong>
              <span className="metric-rule" aria-hidden="true" />
            </div>
          );
        })}
      </div>
      <div className="management-heading">
        <div>
          <h2>
            {d.identity.role === "agent"
              ? "My assigned leads"
              : "Lead directory"}
          </h2>
          <p>Manage the next step for every inquiry.</p>
        </div>
        {can(d.identity.role, "export") && (
          <a
            className="admin-button secondary"
            href={`/admin/export?${d.query}`}
          >
            Export filtered CSV ↓
          </a>
        )}
      </div>
      <details className="lead-filter-drawer" open={!!d.dateError || undefined}>
        <summary>Search & filters <span>{Object.entries(d.filters).filter(([key,value]) => key!=="page" && value && value!=="all").length || ""}</span></summary>
      <Form method="get" className="management-filters" key={d.query}>
        <div className="filter-panel-heading">
          <span>Directory filters</span>
          <small>Search, ownership &amp; date range</small>
        </div>
        <label>
          Search
          <input
            name="q"
            type="search"
            defaultValue={d.filters.q}
            placeholder="Name, email, phone…"
          />
        </label>
        <label>
          Type
          <select name="kind" defaultValue={d.filters.kind || "all"}>
            <option value="all">All types</option>
            {Object.entries(leadKindLabels).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </label>
        <label>
          Status
          <select name="status" defaultValue={d.filters.status || "all"}>
            <option value="all">All active leads</option>
            {Object.entries(leadStatusLabels).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </label>
        <label>
          Assigned to
          <select
            name="assignedTo"
            defaultValue={d.filters.assignedTo || "all"}
          >
            <option value="all">Everyone</option>
            <option value="unassigned">Unassigned</option>
            {d.staff.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name || s.email}
                {!s.active ? " (inactive)" : ""}
              </option>
            ))}
          </select>
        </label>
        <DateField
          name="from"
          label="From date"
          defaultValue={d.filters.from}
        />
        <DateField name="to" label="Through date" defaultValue={d.filters.to} />
        <label>
          Insurance review
          <select
            name="verification"
            defaultValue={d.filters.verification || "all"}
          >
            <option value="all">All outcomes</option>
            {Object.entries(verificationLabels).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </label>
        <div className="management-actions">
          <Button className="admin-button" disabled={busy}>
            {busy ? "Loading…" : "Apply filters"}
          </Button>
          <Link to="/admin">Reset</Link>
        </div>
        {d.dateError && (
          <p className="management-error" role="alert">
            {d.dateError}
          </p>
        )}
        <p className="management-help">
          Dates include the full day in America/New_York. CSV exports every
          matching result.
        </p>
      </Form>
      </details>
      <div className="management-heading">
        <p>
          {d.count} matching lead{d.count === 1 ? "" : "s"}
        </p>
      </div>
      <div className="management-table">
        <table>
          <thead>
            <tr>
              {[
                "Received",
                "Name / contact",
                "Type",
                "Assigned to",
                "Status",
                "Review",
                "",
              ].map((t, i) => (
                <th key={i}>{t}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {d.leads.map((l) => (
              <tr key={l.id}>
                <td>
                  {new Date(l.createdAt).toLocaleDateString("en-US", {
                    timeZone: "America/New_York",
                  })}
                </td>
                <td>
                  <strong>{l.name}</strong>
                  <small>{l.email || l.phone || "—"}</small>
                </td>
                <td>{leadKindLabels[l.kind]}</td>
                <td>
                  {d.staff.find((s) => s.id === l.assignedTo)?.name ||
                    d.staff.find((s) => s.id === l.assignedTo)?.email ||
                    "Unassigned"}
                </td>
                <td>
                  <span
                    className={`management-badge ${l.status === "deleted" ? "muted" : ""}`}
                  >
                    {leadStatusLabels[l.status]}
                  </span>
                </td>
                <td>
                  {l.kind === "insurance"
                    ? verificationLabels[l.verificationStatus || "pending"]
                    : "—"}
                </td>
                <td>
                  <Link to={`/admin/leads/${l.id}`}>Open →</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!d.leads.length && (
          <p className="management-empty">
            No leads match this view. Adjust the filters or wait for a new
            inquiry.
          </p>
        )}
      </div>
      <div className="management-heading">
        <span>
          Page {d.page} of {Math.max(1, Math.ceil(d.count / 25))}
        </span>
        <div className="management-actions">
          {d.page > 1 && <Link to={pageUrl(d.page - 1)}>← Previous</Link>}
          {d.page * 25 < d.count && (
            <Link to={pageUrl(d.page + 1)}>Next →</Link>
          )}
        </div>
      </div>
    </div>
  );
}
