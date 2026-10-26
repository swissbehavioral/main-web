/**
 * Shared lead types. Kept in a plain module (no `.server`) so both the server
 * store and client components can import the *types* safely.
 */

export type LeadKind = "inquiry" | "insurance" | "chat";

export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "admitted"
  | "closed"
  | "deleted";

export const LEAD_KINDS: LeadKind[] = ["inquiry", "insurance", "chat"];
export const LEAD_STATUSES: LeadStatus[] = [
  "new",
  "contacted",
  "qualified",
  "admitted",
  "closed",
  "deleted",
];

export const leadKindLabels: Record<LeadKind, string> = {
  inquiry: "General inquiry",
  insurance: "Insurance verification",
  chat: "Live chat",
};

export const leadStatusLabels: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  admitted: "Admitted",
  closed: "Closed",
  deleted: "Deleted",
};

export interface Lead {
  id: string;
  kind: LeadKind;
  status: LeadStatus;
  createdAt: string;
  updatedAt: string;
  name: string;
  email?: string;
  phone?: string;
  preferredContact?: "phone" | "email";
  bestTime?: string;
  reason?: string;
  message?: string;
  insurer?: string;
  memberId?: string;
  consent: boolean;
  source: string;
  referrer?: string;
  userAgent?: string;
  notes?: string;
  assignedTo?: string;
  verificationStatus?: VerificationStatus;
  deletedAt?: string;
  deletedBy?: string;
}

/** Fields a visitor is allowed to submit (treat all submitted information as sensitive). */
export interface LeadInput {
  kind: LeadKind;
  name: string;
  email?: string;
  phone?: string;
  preferredContact?: "phone" | "email";
  bestTime?: string;
  reason?: string;
  message?: string;
  insurer?: string;
  memberId?: string;
  consent: boolean;
  source: string;
  referrer?: string;
  userAgent?: string;
}

export function isLeadKind(value: unknown): value is LeadKind {
  return typeof value === "string" && LEAD_KINDS.includes(value as LeadKind);
}

export function isLeadStatus(value: unknown): value is LeadStatus {
  return typeof value === "string" && LEAD_STATUSES.includes(value as LeadStatus);
}

/** Aggregate counts used by the admin dashboard. */
export interface LeadSummary {
  total: number;
  byKind: Record<string, number>;
  byStatus: Record<string, number>;
  last7Days: number;
}
export const VERIFICATION_STATUSES = ["pending", "in_review", "needs_information", "verified", "not_eligible"] as const;
export type VerificationStatus = typeof VERIFICATION_STATUSES[number];
export const verificationLabels: Record<VerificationStatus, string> = { pending: "Pending review", in_review: "In review", needs_information: "Needs information", verified: "Coverage verified", not_eligible: "Not eligible" };
export interface LeadPatch { status?: LeadStatus; notes?: string; assignedTo?: string; verificationStatus?: VerificationStatus; deletedAt?: string; deletedBy?: string; }
