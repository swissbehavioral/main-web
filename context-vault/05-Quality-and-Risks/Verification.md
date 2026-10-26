---
title: "Verification evidence and acceptance"
updated: 2026-10-18
tags: [sbh, context-vault]
---

# Verification evidence and acceptance

## Recorded evidence — 2026-10-18

| Check | Evidence level | Result |
|---|---|---|
| `npm run typecheck` | Command-verified during initial context audit | Exit 0 |
| `npm run build` | Command-verified during initial context audit | Exit 0 |
| Runtime/provider/auth review | Source-verified | Findings recorded separately |
| Historical HTTP/auth/form checks | Historical `docs/BUILD-LOG.md` | Reported passing; not repeated here |
| Live Appwrite create/read/update/auth | Unknown | No configured remote instance tested |
| VPS/DNS/TLS/backups | Unknown | Not inspected |

Build output reports Vite environment-option deprecation and React Router future-flag warnings. Passing compilation does not prove runtime authorization, schema compatibility or remote persistence.

## Staging acceptance sequence

1. Record website build identifier, Node/SDK versions and selected Appwrite server version.
2. Confirm runtime configuration selects the intended staging provider.
3. Provision schema with appropriate credentials; inspect attributes, indexes and access permissions.
4. Submit synthetic contact, insurance and chat leads. Confirm persistence and field mapping in Appwrite and dashboard.
5. Change status and notes, reload, restart website and confirm persistence.
6. Verify invalid inputs, missing consent and honeypot behavior.
7. Test authorized admin login, rejected credentials, unauthorized valid project users, logout and cookie behavior over HTTPS.
8. Exercise more than 100/500 records after pagination/totals fixes; confirm newest-first ordering and exact totals.
9. Simulate Appwrite outage in staging: submission fails visibly, health fields change and file store remains untouched.
10. Verify backups/restore and any file-to-Appwrite migration using counts and sampled fields.

Record actual date, environment, command/action and result. Use synthetic records only. Re-run checks after relevant changes, not as a substitute for investigating known findings.

## 2026-10-19 — redesign acceptance

- `npm run typecheck` and `npm run build`: exit 0 after final design edits; existing toolchain warnings remain.
- Browser: desktop 1440 × 900 and mobile 390 × 844 reviewed; home, treatment, staff login/dashboard/detail and mobile menu.
- Local file provider: synthetic inquiry captured; admin login/logout, search no-match/clear, status and notes saves verified.
- Synthetic record removed; screenshot of populated admin is explicitly test data.
- No Appwrite, VPS or production verification. Existing findings remain open.

## 2026-10-20 — configured Appwrite connection check

All three required connection variables were present in `.env`; no secrets were printed. DNS for the configured hostname resolved. Initial requests timed out, but an unauthenticated `/v1/health/version` check subsequently returned HTTP 200. An authenticated read of the configured leads collection then returned HTTP 401 `user_unauthorized`. Endpoint reachability is established; project/key permissions and collection access are not verified. Check that the server API key belongs to the configured project, is active, and permits database document reads. No remote resources or lead records were changed. The local website on port 5180 was not running (`ECONNREFUSED`).

## 2026-10-20 — Appwrite schema provisioned and read verified

User authorized running setup. Database `sbh`, collection `leads` and string attributes already existed. Initial setup failed because required boolean `consent` specified a default. Updated `scripts/appwrite-setup.mjs` to pass null for that default, then reran successfully: consent attribute available, status/kind indexes available. Optional admin creation skipped because setup admin credentials were absent. Authenticated SDK listDocuments succeeded with zero documents. Remote read connectivity and schema bootstrap are now verified; lead writes/updates and Appwrite admin login have not yet been tested. Existing authorization/pagination/security findings remain open.
