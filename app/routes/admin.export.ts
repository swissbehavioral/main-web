import { dateRangeError } from "../lib/calendar";
import { requirePermission } from "../lib/auth.server";
import { listLeads } from "../lib/leads.server";
import { listStaff } from "../lib/staff.server";
import { filterLeads, leadsCsv } from "../lib/lead-filters";
import type { Route } from "./+types/admin.export";
export async function loader({ request }: Route.LoaderArgs) {
  await requirePermission(request, "export");
  const params = new URL(request.url).searchParams;
  const error = dateRangeError(
    params.get("from") || "",
    params.get("to") || "",
  );
  if (error)
    return new Response(error, {
      status: 400,
      headers: { "Cache-Control": "no-store, private" },
    });
  const [leads, staff] = await Promise.all([listLeads(), listStaff()]);
  const filtered = filterLeads(leads, new URL(request.url).searchParams);
  return new Response(
    leadsCsv(
      filtered,
      Object.fromEntries(staff.map((s) => [s.id, s.name || s.email])),
    ),
    {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="sbh-leads-${new Date().toISOString().slice(0, 10)}.csv"`,
        "Cache-Control": "no-store, private",
        "X-Content-Type-Options": "nosniff",
      },
    },
  );
}
