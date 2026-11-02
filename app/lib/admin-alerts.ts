import type { Lead } from "./leads.types";
export type AlertKind = "inquiry" | "insurance" | "chat";
export interface WorkspaceEvent {
  id: string;
  kind: AlertKind;
  at: string;
  to: string;
}
export function leadEvents(
  leads: Lead[],
  identity: { id: string; role: string },
): WorkspaceEvent[] {
  return leads
    .filter(
      (l) =>
        l.status === "new" &&
        (l.kind === "inquiry" || l.kind === "insurance") &&
        (identity.role !== "agent" || l.assignedTo === identity.id),
    )
    .map((l) => ({
      id: `lead:${l.id}`,
      kind: l.kind as AlertKind,
      at: l.createdAt,
      to: `/admin/leads/${encodeURIComponent(l.id)}`,
    }));
}
export function unreadEvents(
  events: WorkspaceEvent[],
  seen: Record<string, string>,
) {
  return events.filter(
    (event) =>
      Date.parse(event.at) > (Date.parse(seen[event.kind] || "") || 0) &&
      Date.parse(event.at) > (Date.parse(seen[event.to] || "") || 0),
  );
}

export function shouldShowDesktopAlert(input: {
  hidden: boolean;
  enabled: boolean;
  permission: string;
  activeUntil: number;
  now: number;
}) {
  return (
    input.hidden &&
    input.enabled &&
    input.permission === "granted" &&
    input.activeUntil < input.now
  );
}
