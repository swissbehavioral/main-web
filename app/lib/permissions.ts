export const STAFF_ROLES = ["admin", "manager", "agent", "viewer"] as const;
export type StaffRole = (typeof STAFF_ROLES)[number];
export const roleLabels: Record<StaffRole, string> = {
  admin: "Administrator",
  manager: "Manager",
  agent: "Representative",
  viewer: "Read-only viewer",
};
export type Permission =
  | "read"
  | "edit"
  | "assign"
  | "delete"
  | "export"
  | "staff"
  | "reply"
  | "content";
export function can(role: StaffRole, permission: Permission) {
  return (
    {
      admin: [
        "read",
        "edit",
        "assign",
        "delete",
        "export",
        "staff",
        "reply",
        "content",
      ],
      manager: [
        "read",
        "edit",
        "assign",
        "delete",
        "export",
        "reply",
        "content",
      ],
      agent: ["read", "edit", "reply"],
      viewer: ["read"],
    } as Record<StaffRole, string[]>
  )[role].includes(permission);
}
export function roleFromLabels(labels: string[]): StaffRole | undefined {
  return STAFF_ROLES.find((role) => labels.includes(`sbh${role}`));
}
export function canWork(role: StaffRole, userId: string, assignee?: string) {
  return (
    role === "admin" ||
    role === "manager" ||
    (role === "agent" && assignee === userId)
  );
}
