import { dateRangeError } from "./calendar.ts";
import type { Lead } from "./leads.types";
export function filterLeads(leads: Lead[], params: URLSearchParams) {
  const q = (params.get("q") || "").trim().toLowerCase();
  const status = params.get("status") || "all";
  const from = params.get("from") || "",
    to = params.get("to") || "";
  if (dateRangeError(from, to)) return [];
  // Calendar dates use the facility's Eastern time zone, including daylight saving.
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return leads.filter((l) => {
    if (status === "all" ? l.status === "deleted" : l.status !== status)
      return false;
    for (const [key, value] of [
      ["kind", l.kind],
      ["assignedTo", l.assignedTo || "unassigned"],
      ["verification", l.verificationStatus || "pending"],
    ]) {
      const filter = params.get(key);
      if (filter && filter !== "all" && filter !== value) return false;
    }
    const parts = formatter.formatToParts(new Date(l.createdAt));
    const date = ["year", "month", "day"]
      .map((p) => parts.find((v) => v.type === p)!.value)
      .join("-");
    if ((from && date < from) || (to && date > to)) return false;
    return (
      !q ||
      [l.name, l.email, l.phone, l.insurer, l.message].some((v) =>
        v?.toLowerCase().includes(q),
      )
    );
  });
}
export function csvCell(value: unknown) {
  let text = String(value ?? "");
  if (/^[\s]*[=+@\-]/.test(text) || /^[\t\r\n]/.test(text)) text = "'" + text;
  return `"${text.replaceAll('"', '""')}"`;
}
export function leadsCsv(leads: Lead[], names: Record<string, string>) {
  const rows = [
    [
      "Reference",
      "Received (UTC)",
      "Name",
      "Email",
      "Phone",
      "Type",
      "Status",
      "Assigned to",
      "Insurance provider",
      "Verification",
      "Source",
    ],
    ...leads.map((l) => [
      l.id,
      l.createdAt,
      l.name,
      l.email,
      l.phone,
      l.kind,
      l.status,
      names[l.assignedTo || ""] || "Unassigned",
      l.insurer,
      l.kind === "insurance" ? l.verificationStatus || "pending" : "",
      l.source,
    ]),
  ];
  return "\uFEFF" + rows.map((r) => r.map(csvCell).join(",")).join("\r\n");
}
