import { checkAppwriteHealth } from "../lib/appwrite.server";
import { leadsProvider } from "../lib/leads.server";

/**
 * Uptime probe for the Client's VPS (`/healthz`). Reports which lead provider is
 * active so a monitoring check can catch a misconfigured deploy.
 */
export async function loader() {
  const health = await checkAppwriteHealth();
  return Response.json(
    {
      status: "ok",
      provider: leadsProvider,
      appwrite: {
        configured: health.configured,
        reachable: health.reachable,
      },
      time: new Date().toISOString(),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}