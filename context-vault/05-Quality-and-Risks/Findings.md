---
title: "Open findings"
updated: 2026-10-18
tags: [sbh, context-vault]
---

# Open findings

Status: **open; identified in source review, not fixed in this documentation pass**. Item numbers are stable references for handoffs.

1. **Admin authorization:** `app/lib/auth.server.ts` accepts any successful Appwrite project email/password login as a website admin. Add an explicit admin allowlist, team or role check before enabling Appwrite auth for a project with other users. Restrict public account creation as appropriate.
2. **Production defaults:** missing `SESSION_SECRET` or shared password only triggers warnings; development defaults remain usable. Fail startup in production when required secrets are missing or placeholders. `APPWRITE_AUTH_ENABLED=true` with incomplete Appwrite credentials also falls back to shared-password mode rather than failing configuration.
3. **Lead listing correctness:** Appwrite `listLeads()` fetches only 100 documents and sorts after fetching, without a server-side newest-first query. Newest leads can be omitted. Summaries fetch at most 500 and use the returned length as the total. Add server-side ordering, pagination and accurate totals.
4. **Monitoring:** `/healthz` always returns HTTP 200 and `status: "ok"`, including Appwrite failure. Until changed, monitor the JSON `provider`, `configured` and `reachable` fields. A read probe does not prove inserts or login work.
5. **Schema/bootstrap validation:** existing attributes/indexes are skipped by name, not checked for matching definitions. The required `consent` boolean is created with a default; verify this combination against the selected Appwrite server version. Validate scopes against that version's console; the runbook's broad database scope list is not a verified least-privilege policy. Separate provisioning credentials from runtime credentials.
6. **Error handling / field size:** `getLead()` treats every backend error as a missing record. The referrer header is saved without truncation although its schema field is 512 characters. These can obscure backend outages or reject otherwise valid submissions.
7. **Abuse protection:** forms have a honeypot, but no application rate limiter was found on submission or login. Add appropriate limits on the hosting proxy or application.
8. **Sensitive data claims:** existing comments/runbooks assert the store cannot contain health information. Actual fields include insurance member ID, treatment inquiry text and internal notes; free text is not technically prevented from containing sensitive information. Treat those assertions as unverified, and obtain the required data-handling review before collecting real submissions. Self-hosting alone does not settle that review.

These are audit findings; runtime code was not changed in this documentation pass.

9. **File-store recovery:** `readAll()` logs read/parse failures and returns an empty list. A subsequent create/update can overwrite unreadable prior data. Fail writes safely on corruption and define recovery before treating JSON storage as durable production storage.
10. **Session revocation:** the site cookie remains the authorization source after Appwrite credential verification; remote account/role changes are not rechecked on every request. Define revocation requirements alongside the admin authorization fix.

Prioritize findings 1–2 before exposing admin access, and findings 3–5 before calling Appwrite acceptance complete. Sensitive-data handling must be resolved before real collection. Owners and target dates remain unassigned.
