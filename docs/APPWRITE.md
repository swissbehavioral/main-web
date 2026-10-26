# Appwrite Backend — Setup & Runbook

Swiss Behavioral Health uses **Appwrite** as its backend for lead storage and
(optionally) admin authentication. This document is the operator's runbook.

> **Short answer to "is Appwrite possible here?" — yes.** It maps directly onto
> what the service agreement already promises: the admin dashboard must show
> "all leads, inquiries and admissions" (§3.1) and the site needs durable,
> queryable lead capture. Appwrite provides that without the Client having to run
> a database themselves.

---

## 1. What Appwrite is used for

| Concern | Appwrite service | Notes |
|---|---|---|
| Lead storage (inquiries, insurance requests, chat) | **Databases** — `sbh/leads` collection | Single source for the admin dashboard |
| Admin login (optional) | **Auth** — Users + email/password sessions | Enabled with `APPWRITE_AUTH_ENABLED=true` |
| Live dashboard updates (future) | **Realtime** | Subscribe to the `leads` collection |
| Email/CRM handoff (future, quoted separately §3.1/§3.5) | **Functions** + messaging/webhooks | The insertion point already exists in `leads.server.ts` |
| Media/documents (future) | **Storage** | e.g. licence certificates, team photos |

### Architecture

```
Visitor → form / live chat
            │  useFetcher POST
            ▼
      /api/lead (server action)
            │  validate + honeypot
            ▼
      app/lib/leads.server.ts        ← provider facade (chosen at boot)
            ├── leads.appwrite.server.ts   → Appwrite Databases  ✅ production
            └── leads.file.server.ts       → ./storage/leads.json  (fallback)
                                              │
                              /admin dashboard loaders read the same API
```

The provider is selected **once** at module load:

- `appwrite` when `APPWRITE_ENDPOINT` + `APPWRITE_PROJECT_ID` + `APPWRITE_API_KEY` are set.
- `file` otherwise (local development, offline builds, or a single-instance VPS
  launch with no backend).

There is **no silent failover**. If Appwrite is configured but unreachable, the
submission fails and the visitor is told to call instead. Silently writing to a
local file would split lead data across two stores — worse than a visible error.

---

## 2. Prerequisites

1. An Appwrite instance:
   - **Appwrite Cloud** — `https://cloud.appwrite.io/v1` (fastest to start), or
   - **Self-hosted** on the Client's VPS — `https://appwrite.<domain>/v1`
     (recommended if the Client wants all data on their own infrastructure).
2. A **project** in that instance → copy the **Project ID**.
3. An **API key** with scopes:
   `databases.read`, `databases.write`, `users.read`, `users.write`
   (the last only if the setup script creates the admin user).
4. Confirm the instance is reachable from the VPS.

---

## 3. Configuration

```bash
cp .env.example .env
```

Fill in:

```bash
SESSION_SECRET=<openssl rand -hex 32>
ADMIN_PASSWORD=<shared password, option A>

APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=<project id>
APPWRITE_API_KEY=<server api key>

# optional
APPWRITE_DATABASE_ID=sbh
APPWRITE_LEADS_COLLECTION_ID=leads

# option B — real Appwrite users for admin login
APPWRITE_AUTH_ENABLED=false
```

> ⚠️ `APPWRITE_API_KEY` is a **server-side** secret. It is only ever read by
> `app/lib/appwrite.server.ts`, which is excluded from the client bundle. Never
> commit `.env`.

---

## 4. Create the schema

One idempotent command creates the database, collection, attributes and indexes,
and optionally the first admin user:

```bash
npm run setup:appwrite
# or: node --env-file=.env scripts/appwrite-setup.mjs
```

It prints a per-resource log and waits (polling) until Appwrite finishes
provisioning attributes and indexes. Safe to re-run at any time.

**Attributes created** (`leads`): `kind`, `status`, `name`, `email`, `phone`,
`preferredContact`, `bestTime`, `reason`, `message`, `insurer`, `memberId`,
`consent`, `source`, `referrer`, `userAgent`, `notes`.
**Indexes**: `idx_status`, `idx_kind`.
`createdAt`/`updatedAt` come from Appwrite's built-in `$createdAt`/`$updatedAt`,
so they need no attributes.

---

## 5. Switching admin auth to Appwrite (option B)

1. Set `APPWRITE_AUTH_ENABLED=true`.
2. Ensure at least one Appwrite user exists — the setup script creates one when
   `APPWRITE_ADMIN_EMAIL` + `APPWRITE_ADMIN_PASSWORD` are set, or add users in
   the Appwrite console.
3. Restart the server.

Login flow: the server verifies the email/password against Appwrite, discards
the Appwrite session, and issues the site's own signed httpOnly cookie (so SSR
loaders stay stateless). Unset `APPWRITE_AUTH_ENABLED` to fall back to the
shared `ADMIN_PASSWORD`.

---

## 6. Health check

The admin dashboard surfaces the provider and a live Appwrite health probe
(`checkAppwriteHealth()` → `app/lib/appwrite.server.ts`), so an operator can see
at a glance whether leads are hitting Appwrite or the local file store.

---

## 7. Compliance notes (read before changing anything)

- **PHI stays out of Appwrite.** The `leads` collection holds *general inquiry*
  data only — no diagnoses, medications, records or clinical notes. Every form
  says so explicitly. This is what keeps the site outside HIPAA's scope
  (agreement §7).
- **Appwrite Cloud is not a HIPAA-covered service** and Appwrite's standard terms
  do not include a BAA. Do **not** put PHI in it. If the Client ever wants to
  store clinical data in Appwrite, they must:
  1. self-host Appwrite on HIPAA-eligible infrastructure they control,
  2. execute BAAs with the infrastructure provider, and
  3. put a signed BAA in place covering the arrangement.
  That is a separate scoping conversation (agreement §3.5).
- **Access control.** The collection is created with `documentSecurity: false`
  and is only reachable via the server API key; there is no client-side Appwrite
  SDK in the browser bundle, so collection/row permissions are not a client
  attack surface.
- **Data retention.** Adjust retention to the Client's policy; the file fallback
  keeps a single JSON file on the VPS.

---

## 8. Troubleshooting

| Symptom | Cause / fix |
|---|---|
| `Setup failed: Unauthorized` (401) | API key missing scopes, or wrong project. |
| `Setup failed: Not Found` (404) | `APPWRITE_PROJECT_ID` wrong, or endpoint missing `/v1`. |
| Leads not appearing in Appwrite | `APPWRITE_*` empty → provider is `file`; check the startup log line. |
| Timed out waiting for attributes | Appwrite still provisioning; re-run the script. |
| Login always fails with Appwrite auth | No user with that email, or `APPWRITE_AUTH_ENABLED` not `true`. |
| Want to move off the file store | Set the three Appwrite vars, run the setup script, restart. |

## 9. Migrating the file store into Appwrite

If the site launched on the file fallback and you later enable Appwrite, import
the existing `storage/leads.json`:

```bash
node --env-file=.env -e "
const fs=require('node:fs');
const {Client,Databases,ID}=require('node-appwrite');
const leads=JSON.parse(fs.readFileSync('storage/leads.json','utf8'));
const db=new Databases(new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY));
(async()=>{
  for(const l of leads){
    const {id,...rest}=l;
    await db.createDocument(
      process.env.APPWRITE_DATABASE_ID||'sbh',
      process.env.APPWRITE_LEADS_COLLECTION_ID||'leads',
      ID.unique(),
      Object.fromEntries(Object.entries(rest).map(([k,v])=>[k,v??'']))
    );
  }
  console.log('imported',leads.length,'leads');
})();
"
```

## 10. Version compatibility

The integration uses the classic **Documents API**
(`createDocument` / `listDocuments`), which works across Appwrite 1.x. Appwrite
1.9+ also exposes the newer **Tables/Rows** API (`TablesDB`); migrating is a
contained change inside `leads.appwrite.server.ts` if the Client standardises on
1.9+. SDKs pinned in `package.json`: `node-appwrite@^30`, `appwrite@^29`.