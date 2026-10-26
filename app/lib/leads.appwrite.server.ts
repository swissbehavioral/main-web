import type { LeadPatch } from "./leads.types";
import type { Models } from "node-appwrite";

import {
  getDatabases,
  appwriteConfig,
  ID,
  Query,
} from "./appwrite.server";
import {
  isLeadStatus,
  type Lead,
  type LeadInput,
  type LeadStatus,
  type LeadSummary,
} from "./leads.types";

/**
 * Appwrite Databases lead provider.
 *
 * Uses the classic Documents API (`createDocument` / `listDocuments`) which is
 * supported across Appwrite 1.x instances (the newer Tables/Rows API is an
 * alternative — see docs/APPWRITE.md).
 *
 * Schema is created idempotently by `scripts/appwrite-setup.mjs`.
 * Treat stored submissions as sensitive personal data.
 */

interface LeadDocument extends Models.Document {
  kind: string;
  status: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  preferredContact?: string | null;
  bestTime?: string | null;
  reason?: string | null;
  message?: string | null;
  insurer?: string | null;
  memberId?: string | null;
  consent: boolean;
  source?: string | null;
  referrer?: string | null;
  userAgent?: string | null;
  notes?: string | null;
  assignedTo?: string;
  verificationStatus?: Lead["verificationStatus"];
  deletedAt?: string;
  deletedBy?: string;
}

function toLead(doc: LeadDocument): Lead {
  return {
    assignedTo: doc.assignedTo || "",
    verificationStatus: doc.verificationStatus || "pending",
    deletedAt: doc.deletedAt || "",
    deletedBy: doc.deletedBy || "",
    id: doc.$id,
    kind: (doc.kind as Lead["kind"]) ?? "inquiry",
    status: (doc.status as LeadStatus) ?? "new",
    createdAt: doc.$createdAt,
    updatedAt: doc.$updatedAt,
    name: doc.name,
    email: doc.email ?? undefined,
    phone: doc.phone ?? undefined,
    preferredContact:
      doc.preferredContact === "phone" || doc.preferredContact === "email"
        ? doc.preferredContact
        : undefined,
    bestTime: doc.bestTime ?? undefined,
    reason: doc.reason ?? undefined,
    message: doc.message ?? undefined,
    insurer: doc.insurer ?? undefined,
    memberId: doc.memberId ?? undefined,
    consent: Boolean(doc.consent),
    source: doc.source ?? "/",
    referrer: doc.referrer ?? undefined,
    userAgent: doc.userAgent ?? undefined,
    notes: doc.notes ?? undefined,
  };
}

/** Appwrite rejects `undefined`; empty strings are used for absent optionals. */
type LeadDocumentData = Omit<LeadDocument, keyof Models.Document>;

function toDocumentData(input: LeadInput): LeadDocumentData {
  return {
    kind: input.kind,
    status: "new",
    name: input.name,
    email: input.email ?? "",
    phone: input.phone ?? "",
    preferredContact: input.preferredContact ?? "",
    bestTime: input.bestTime ?? "",
    reason: input.reason ?? "",
    message: input.message ?? "",
    insurer: input.insurer ?? "",
    memberId: input.memberId ?? "",
    consent: input.consent,
    source: input.source,
    referrer: input.referrer ?? "",
    userAgent: input.userAgent ?? "",
    notes: "",
  };
}

export async function createLead(input: LeadInput): Promise<Lead> {
  const doc = await getDatabases().createDocument<LeadDocument>(
    appwriteConfig.databaseId,
    appwriteConfig.leadsCollectionId,
    ID.unique(),
    toDocumentData(input),
  );
  return toLead(doc);
}

/**
 * Newest-first list. Documents are ordered in application code so the provider
 * does not depend on a custom index for correct ordering.
 */
export async function listLeads(): Promise<Lead[]> {
  const all: Lead[] = []; let cursor: string | undefined;
  for (;;) {
    const result = await getDatabases().listDocuments<LeadDocument>(appwriteConfig.databaseId, appwriteConfig.leadsCollectionId, [Query.limit(100), Query.orderDesc("$createdAt"), ...(cursor ? [Query.cursorAfter(cursor)] : [])]);
    all.push(...result.documents.map(toLead));
    if (result.documents.length < 100) break;
    cursor = result.documents.at(-1)!.$id;
  }
  return all;
}

export async function getLead(id: string): Promise<Lead | undefined> {
  try {
    const doc = await getDatabases().getDocument<LeadDocument>(
      appwriteConfig.databaseId,
      appwriteConfig.leadsCollectionId,
      id,
    );
    return toLead(doc);
  } catch (error) {
    if ((error as {code:number}).code !== 404) throw error;
    return undefined;
  }
}

export async function updateLead(
  id: string,
  patch: LeadPatch,
): Promise<Lead | undefined> {
  const current = await getLead(id);
  if (!current) return undefined;

  const data: Partial<LeadDocumentData> = { ...patch };
  if (patch.status && isLeadStatus(patch.status)) data.status = patch.status;
  if (patch.notes !== undefined) data.notes = patch.notes;
  if (Object.keys(data).length === 0) return current;

  const doc = await getDatabases().updateDocument<LeadDocument>(
    appwriteConfig.databaseId,
    appwriteConfig.leadsCollectionId,
    id,
    data,
  );
  return toLead(doc);
}

export async function summariseLeads(): Promise<LeadSummary> {
  const leads = await listLeads();
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const summary: LeadSummary = {
    total: leads.length,
    byKind: {},
    byStatus: {},
    last7Days: 0,
  };
  for (const lead of leads) {
    summary.byKind[lead.kind] = (summary.byKind[lead.kind] ?? 0) + 1;
    summary.byStatus[lead.status] = (summary.byStatus[lead.status] ?? 0) + 1;
    if (new Date(lead.createdAt).getTime() >= weekAgo) summary.last7Days += 1;
  }
  return summary;
}