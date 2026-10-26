import type { LeadPatch } from "./leads.types";
import { isAppwriteConfigured } from "./appwrite.server";
import * as appwriteProvider from "./leads.appwrite.server";
import * as fileProvider from "./leads.file.server";
import type {
  Lead,
  LeadInput,
  LeadStatus,
  LeadSummary,
} from "./leads.types";

/**
 * Lead store facade (server-only).
 *
 * The provider is chosen once, at module load:
 * - **appwrite** — when APPWRITE_ENDPOINT / PROJECT_ID / API_KEY are set.
 * - **file**     — local `storage/leads.json` fallback (dev, offline, or a
 *                  single-instance VPS launch without a backend).
 *
 * There is deliberately **no silent failover**: if Appwrite is configured but
 * unreachable, the request fails and the visitor is asked to call instead. A
 * silent fallback would split the lead data across two stores, which is far
 * worse than a visible error.
 *
 * Treat stored submissions as sensitive personal data.
 */

export type LeadsProvider = "appwrite" | "file";

export const leadsProvider: LeadsProvider = isAppwriteConfigured()
  ? "appwrite"
  : "file";

if (leadsProvider === "file" && process.env.NODE_ENV === "production") {
  throw new Error("A configured Appwrite backend is required in production.");
}

/** Canonical provider contract. */
export interface LeadsProviderApi {
  createLead(input: LeadInput): Promise<Lead>;
  listLeads(): Promise<Lead[]>;
  getLead(id: string): Promise<Lead | undefined>;
  updateLead(
    id: string,
    patch: LeadPatch,
  ): Promise<Lead | undefined>;
  summariseLeads(): Promise<LeadSummary>;
}

const appwriteApi: LeadsProviderApi = {
  createLead: (input) => appwriteProvider.createLead(input),
  listLeads: () => appwriteProvider.listLeads(),
  getLead: (id) => appwriteProvider.getLead(id),
  updateLead: (id, patch) => appwriteProvider.updateLead(id, patch),
  summariseLeads: () => appwriteProvider.summariseLeads(),
};

const fileApi: LeadsProviderApi = {
  createLead: (input) => fileProvider.createLead(input),
  listLeads: () => fileProvider.listLeads(),
  getLead: (id) => fileProvider.getLead(id),
  updateLead: (id, patch) => fileProvider.updateLead(id, patch),
  summariseLeads: () => fileProvider.summariseLeads(),
};

const api: LeadsProviderApi =
  leadsProvider === "appwrite" ? appwriteApi : fileApi;

export const createLead = (input: LeadInput): Promise<Lead> =>
  api.createLead(input);

export const listLeads = (): Promise<Lead[]> => api.listLeads();

export const getLead = (id: string): Promise<Lead | undefined> =>
  api.getLead(id);

export const updateLead = (
  id: string,
  patch: LeadPatch,
): Promise<Lead | undefined> => api.updateLead(id, patch);

export const summariseLeads = (): Promise<LeadSummary> => api.summariseLeads();

export type { Lead, LeadInput, LeadStatus, LeadSummary };