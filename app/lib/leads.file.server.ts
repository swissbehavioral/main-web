import type { LeadPatch } from "./leads.types";
import { randomBytes } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

import {
  isLeadStatus,
  type Lead,
  type LeadInput,
  type LeadStatus,
  type LeadSummary,
} from "./leads.types";

/**
 * File-backed lead store (server-only) — the zero-dependency fallback provider
 * used when Appwrite is not configured (local development, offline builds).
 *
 * Writes are serialised in-process to avoid lost updates on a single VPS
 * instance. Not suitable for multiple instances — use Appwrite for that.
 */

const STORAGE_DIR =
  process.env.LEADS_DIR ?? path.join(process.cwd(), "storage");
const STORE_FILE = path.join(STORAGE_DIR, "leads.json");

let writeQueue: Promise<unknown> = Promise.resolve();

function serialize<T>(op: () => Promise<T>): Promise<T> {
  const run = writeQueue.then(op, op);
  writeQueue = run.catch(() => undefined);
  return run;
}

async function readAll(): Promise<Lead[]> {
  try {
    const raw = await fs.readFile(STORE_FILE, "utf8");
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error("Invalid lead store");
    return parsed as Lead[];
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === "ENOENT") return [];
    console.error("[leads:file] failed to read store", error);
    throw error;
  }
}

async function writeAll(leads: Lead[]): Promise<void> {
  await fs.mkdir(STORAGE_DIR, { recursive: true, mode:0o700 });
  const tmp = `${STORE_FILE}.${randomBytes(4).toString("hex")}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(leads, null, 2), {encoding:"utf8",mode:0o600});
  await fs.rename(tmp, STORE_FILE);
}

export async function createLead(input: LeadInput): Promise<Lead> {
  return serialize(async () => {
    const leads = await readAll();
    const now = new Date().toISOString();
    const lead: Lead = {
      id: randomBytes(8).toString("hex"),
      kind: input.kind,
      status: "new",
      createdAt: now,
      updatedAt: now,
      name: input.name,
      email: input.email || undefined,
      phone: input.phone || undefined,
      preferredContact: input.preferredContact,
      bestTime: input.bestTime || undefined,
      reason: input.reason || undefined,
      message: input.message || undefined,
      insurer: input.insurer || undefined,
      memberId: input.memberId || undefined,
      consent: input.consent,
      source: input.source,
      referrer: input.referrer || undefined,
      userAgent: input.userAgent || undefined,
    };
    leads.unshift(lead);
    await writeAll(leads);
    return lead;
  });
}

export async function listLeads(): Promise<Lead[]> {
  const leads = await readAll();
  return leads.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getLead(id: string): Promise<Lead | undefined> {
  const leads = await readAll();
  return leads.find((lead) => lead.id === id);
}

export async function updateLead(
  id: string,
  patch: LeadPatch,
): Promise<Lead | undefined> {
  return serialize(async () => {
    const leads = await readAll();
    const index = leads.findIndex((lead) => lead.id === id);
    if (index === -1) return undefined;

    const current = leads[index];
    const next: Lead = {
      ...current,
      ...patch,
      status:
        patch.status && isLeadStatus(patch.status)
          ? patch.status
          : current.status,
      notes: patch.notes !== undefined ? patch.notes : current.notes,
      updatedAt: new Date().toISOString(),
    };
    leads[index] = next;
    await writeAll(leads);
    return next;
  });
}

export async function summariseLeads(): Promise<LeadSummary> {
  const leads = await readAll();
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