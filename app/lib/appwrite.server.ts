import { Client, Databases, ID, Query, Users } from "node-appwrite";

/**
 * Appwrite backend integration (server-only).
 *
 * Appwrite provides the managed persistence + auth layer for the site:
 * - **Databases** — the `leads` collection (all website inquiries, insurance
 *   requests and chat leads).
 * - **Auth (Users)** — admin dashboard accounts, when `APPWRITE_AUTH_ENABLED`
 *   is set.
 * - Optionally **Functions / Realtime** later (CRM or email delivery, live
 *   dashboard updates) — see docs/APPWRITE.md.
 *
 * Configuration is entirely environment-driven. Without credentials the app
 * falls back to the local file store (see `leads.server.ts`), so development
 * and offline builds keep working.
 *
 * SECURITY: `APPWRITE_API_KEY` is a server-side key and must never be exposed to
 * the browser. This module is `.server.ts`, so it is excluded from the client
 * bundle. Treat all submitted information as sensitive personal data.
 */

const endpoint = process.env.APPWRITE_ENDPOINT?.trim() ?? "";
const projectId = process.env.APPWRITE_PROJECT_ID?.trim() ?? "";
const apiKey = process.env.APPWRITE_API_KEY?.trim() ?? "";

export const appwriteConfig = {
  endpoint,
  projectId,
  databaseId: process.env.APPWRITE_DATABASE_ID?.trim() || "sbh",
  leadsCollectionId: process.env.APPWRITE_LEADS_COLLECTION_ID?.trim() || "leads",
} as const;

/** True when all three required credentials are present. */
export function isAppwriteConfigured(): boolean {
  return Boolean(endpoint && projectId && apiKey);
}

/** Admin auth is only delegated to Appwrite when explicitly enabled. */
export const appwriteAuthEnabled =
  process.env.APPWRITE_AUTH_ENABLED === "true" && isAppwriteConfigured();

let serverClient: Client | null = null;

export function getServerClient(): Client {
  if (!serverClient) {
    serverClient = new Client()
      .setEndpoint(appwriteConfig.endpoint)
      .setProject(appwriteConfig.projectId)
      .setKey(apiKey);
  }
  return serverClient;
}

let databases: Databases | null = null;

/** Admin-scoped Databases service. */
export function getDatabases(): Databases {
  if (!databases) databases = new Databases(getServerClient());
  return databases;
}

/** Admin-scoped Users service. */
export function getUsers(): Users {
  return new Users(getServerClient());
}

/**
 * A client WITHOUT the API key — used only to verify a user's email/password
 * (Appwrite issues the session, we then discard it and use our own cookie).
 */
export function createUserClient(): Client {
  return new Client()
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId);
}

export interface AppwriteHealth {
  configured: boolean;
  reachable: boolean;
  message: string;
}

/** Lightweight connectivity probe — surfaced on the admin dashboard. */
export async function checkAppwriteHealth(): Promise<AppwriteHealth> {
  if (!isAppwriteConfigured()) {
    return {
      configured: false,
      reachable: false,
      message: "Appwrite is not configured — using the local file store.",
    };
  }
  try {
    await getDatabases().listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.leadsCollectionId,
      [Query.limit(1)],
    );
    return { configured: true, reachable: true, message: "Connected." };
  } catch (error) {
    return {
      configured: true,
      reachable: false,
      message:
        error instanceof Error ? error.message : "Unknown Appwrite error.",
    };
  }
}

export { ID, Query };