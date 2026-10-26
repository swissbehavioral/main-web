---
title: "Recovery and monitoring"
updated: 2026-10-18
tags: [sbh, context-vault]
---

# Recovery and monitoring

This is an operator plan; no production monitoring or backup configuration has been verified.

## Signals

- Monitor website availability and `/healthz` JSON values, not just its HTTP 200.
- For an Appwrite deployment expect `provider=appwrite`, `configured=true`, `reachable=true`.
- Probe currently exercises a read only. Use controlled staging write/update tests separately.
- Investigate submission 502s and backend exceptions. Avoid copying sensitive request data into logs or the vault.

## Failure triage

| Symptom | First checks |
|---|---|
| Provider is `file` unexpectedly | All three connection values present in the running process; restart after correction |
| Appwrite unreachable | Endpoint including `/v1`, DNS/TLS, network, project ID, key scopes, database/collection existence |
| Login loops | HTTPS and secure cookie; secrets loaded by serving process |
| Login fails in Appwrite mode | User credentials, selected project, remote service availability; inspect server logs |
| Missing/incorrect dashboard totals | Known 100/500 record limits and post-fetch ordering |
| Docker fallback data disappears | Persistent volume and correct `LEADS_DIR` |

## Recovery requirements

Define backup frequency/retention, recovery owner and acceptable data loss/downtime before production. Back up Appwrite database/storage and required configuration through the selected version's supported procedure; verify restoration into an isolated environment. Retain encryption material securely outside this vault.

For local JSON storage, preserve the file before repair or migration. A corrupt/unreadable file currently reads as empty and may be overwritten by a later mutation. Stop writes before attempting recovery.

When switching providers, explicitly migrate records and verify counts/fields. Configuration alone does not copy data. Record rollback steps for both website releases and Appwrite upgrades before performing them.
