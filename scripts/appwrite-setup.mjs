#!/usr/bin/env node
/**
 * Appwrite bootstrap — creates the database, the `leads` collection, all
 * attributes and indexes, and (optionally) the first admin user.
 *
 * Idempotent: safe to run repeatedly; existing resources are skipped.
 *
 * Usage:
 *   node --env-file=.env scripts/appwrite-setup.mjs
 *
 * Required env:
 *   APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID, APPWRITE_API_KEY
 * Optional env:
 *   APPWRITE_DATABASE_ID (default "sbh")
 *   APPWRITE_LEADS_COLLECTION_ID (default "leads")
 *   APPWRITE_ADMIN_EMAIL / APPWRITE_ADMIN_PASSWORD / APPWRITE_ADMIN_NAME
 *
 * The API key needs scopes: databases.read, databases.write, users.read,
 * users.write (users.write only if creating the admin user here).
 */
import { Client, Databases, Query, Users, ID } from "node-appwrite";

const endpoint = process.env.APPWRITE_ENDPOINT?.trim();
const projectId = process.env.APPWRITE_PROJECT_ID?.trim();
const apiKey = process.env.APPWRITE_API_KEY?.trim();
const databaseId = process.env.APPWRITE_DATABASE_ID?.trim() || "sbh";
const collectionId = process.env.APPWRITE_LEADS_COLLECTION_ID?.trim() || "leads";

function fail(message) {
  console.error(`\n✖ ${message}\n`);
  process.exit(1);
}

if (!endpoint || !projectId || !apiKey) {
  fail(
    "APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID and APPWRITE_API_KEY are all required.\n" +
      "Run with: node --env-file=.env scripts/appwrite-setup.mjs",
  );
}

const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId)
  .setKey(apiKey);

const databases = new Databases(client);
const users = new Users(client);

const ok = (msg) => console.log(`✓ ${msg}`);
const skip = (msg) => console.log(`· ${msg}`);

/** String attributes: [key, size, required, default] */
const STRING_ATTRIBUTES = [
  ["kind", 32, true, null],
  ["status", 32, true, null],
  ["name", 128, true, null],
  ["email", 254, false, ""],
  ["phone", 64, false, ""],
  ["preferredContact", 16, false, ""],
  ["bestTime", 64, false, ""],
  ["reason", 64, false, ""],
  ["message", 5000, false, ""],
  ["insurer", 128, false, ""],
  ["memberId", 64, false, ""],
  ["source", 256, false, ""],
  ["referrer", 512, false, ""],
  ["userAgent", 512, false, ""],
  ["notes", 5000, false, ""],
];

/** Boolean attributes: [key, required, default] */
const BOOLEAN_ATTRIBUTES = [["consent", true, null]];

/** Indexes: [key, [attributes]] */
const INDEXES = [
  ["idx_status", ["status"]],
  ["idx_kind", ["kind"]],
];

async function ensureDatabase() {
  try {
    await databases.get({ databaseId });
    skip(`database "${databaseId}" already exists`);
  } catch (error) {
    if (error?.code !== 404) throw error;
    await databases.create({ databaseId, name: "Swiss Behavioral Health" });
    ok(`created database "${databaseId}"`);
  }
}

async function ensureCollection() {
  try {
    await databases.getCollection(databaseId, collectionId);
    skip(`collection "${collectionId}" already exists`);
  } catch (error) {
    if (error?.code !== 404) throw error;
    // documentSecurity: false — this collection is only reachable with the
    // server API key, never from the browser.
    await databases.createCollection(
      databaseId,
      collectionId,
      "Leads",
      undefined,
      false,
    );
    ok(`created collection "${collectionId}"`);
  }
}

async function ensureAttributes() {
  const list = await databases.listAttributes(databaseId, collectionId);
  const existing = new Set(list.attributes.map((attribute) => attribute.key));

  for (const [key, size, required, xdefault] of STRING_ATTRIBUTES) {
    if (existing.has(key)) {
      skip(`attribute "${key}" exists`);
      continue;
    }
    await databases.createStringAttribute(
      databaseId,
      collectionId,
      key,
      size,
      required,
      xdefault,
    );
    ok(`creating attribute "${key}"`);
  }

  for (const [key, required, xdefault] of BOOLEAN_ATTRIBUTES) {
    if (existing.has(key)) {
      skip(`attribute "${key}" exists`);
      continue;
    }
    await databases.createBooleanAttribute(
      databaseId,
      collectionId,
      key,
      required,
      xdefault,
    );
    ok(`creating attribute "${key}"`);
  }

  await waitFor("attributes", async () => {
    const current = await databases.listAttributes(databaseId, collectionId);
    return current.attributes
      .filter((attribute) => attribute.status !== "available")
      .map((attribute) => attribute.key);
  });
}

async function ensureIndexes() {
  const list = await databases.listIndexes(databaseId, collectionId);
  const existing = new Set(list.indexes.map((index) => index.key));

  for (const [key, attributes] of INDEXES) {
    if (existing.has(key)) {
      skip(`index "${key}" exists`);
      continue;
    }
    await databases.createIndex(
      databaseId,
      collectionId,
      key,
      "key",
      attributes,
    );
    ok(`creating index "${key}"`);
  }

  await waitFor("indexes", async () => {
    const current = await databases.listIndexes(databaseId, collectionId);
    return current.indexes
      .filter((index) => index.status !== "available")
      .map((index) => index.key);
  });
}

/** Polls until Appwrite finishes provisioning the named resources. */
async function waitFor(label, pendingNames, timeoutMs = 90_000) {
  const started = Date.now();
  for (;;) {
    const pending = await pendingNames();
    if (pending.length === 0) {
      ok(`${label} are available`);
      return;
    }
    if (Date.now() - started > timeoutMs) {
      fail(`Timed out waiting for ${label}: ${pending.join(", ")}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 1500));
  }
}

async function ensureAdminUser() {
  const email = process.env.APPWRITE_ADMIN_EMAIL?.trim();
  const password = process.env.APPWRITE_ADMIN_PASSWORD?.trim();
  const name = process.env.APPWRITE_ADMIN_NAME?.trim() || "SBH Admin";

  if (!email || !password) {
    skip("APPWRITE_ADMIN_EMAIL/PASSWORD not set — skipping admin user");
    return;
  }
  if (password.length < 8) {
    fail("APPWRITE_ADMIN_PASSWORD must be at least 8 characters.");
  }

  const found = await users.list([Query.equal("email", [email])]);
  if (found.total > 0) {
    skip(`admin user "${email}" already exists`);
    return;
  }
  await users.create(ID.unique(), email, undefined, password, name);
  ok(`created admin user "${email}"`);
}

async function main() {
  console.log(`\nAppwrite setup → ${endpoint} (project ${projectId})\n`);
  await ensureDatabase();
  await ensureCollection();
  await ensureAttributes();
  await ensureIndexes();
  await ensureAdminUser();
  console.log(
    "\n✓ Appwrite is ready. Set APPWRITE_AUTH_ENABLED=true in .env to use Appwrite Auth for the admin panel.\n",
  );
}

main().catch((error) => {
  console.error("\n✖ Setup failed:", error?.message ?? error);
  if (error?.code === 401) {
    console.error(
      "  → Check APPWRITE_API_KEY scopes (databases.read, databases.write, users.read, users.write).",
    );
  }
  if (error?.code === 404) {
    console.error(
      "  → Check APPWRITE_PROJECT_ID and that the endpoint includes /v1.",
    );
  }
  process.exit(1);
});
