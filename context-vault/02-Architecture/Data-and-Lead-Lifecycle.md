---
title: "Data and lead lifecycle"
updated: 2026-10-18
tags: [sbh, context-vault]
---

# Data and lead lifecycle

1. Contact, insurance or chat UI submits to `/api/lead`.
2. Server checks honeypot, parses bounded strings, validates name/contact/consent and normalizes lead kind.
3. `leads.server.ts` selects Appwrite when all three credentials are present at module load; otherwise it selects the file provider.
4. New records start at `new`; dashboard users can select `contacted`, `qualified`, `admitted` or `closed` and save notes. These are allowed values, not an enforced sequential state machine.
5. Dashboard reads and updates through the same provider facade.

| Group | Fields |
|---|---|
| Identity/contact | name, email, phone, preferredContact, bestTime |
| Inquiry | kind, reason, message, insurer, memberId, consent |
| Attribution | source, referrer, userAgent |
| Management | id, status, notes, createdAt, updatedAt |

Appwrite uses database `sbh` and collection `leads` by default. `$id`, `$createdAt`, `$updatedAt` map to the application fields. Optional values are written as empty strings and normalized on reads. Bootstrap creates string/boolean attributes and status/kind indexes.

File storage uses `LEADS_DIR` or `<working-directory>/storage/leads.json`. Writes are queued within one process and use temporary-file rename. This does not coordinate multiple processes. Read/parse errors are logged and returned as an empty list; a later write can therefore replace unreadable existing data. Address that before relying on this provider for durable records.

Switching configuration does not migrate records. There is no silent Appwrite outage fallback. No deletion, retention policy, notification queue or CRM export workflow is implemented in the reviewed lead facade.

Treat inquiry text, insurance identifiers and notes as potentially sensitive. A warning in a form cannot enforce the content of free text. See [[../05-Quality-and-Risks/Findings|Findings]].
