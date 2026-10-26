---
title: "Appwrite integration"
updated: 2026-10-18
tags: [sbh, context-vault]
---

# Appwrite integration

## Installation versus connection

The npm SDK is already installed. The Appwrite server is separate. `npm run setup:appwrite` uses an existing endpoint, project and API key to provision database resources and optionally a user. It does not install Appwrite or create the project.

| Option | Website connection | Status |
|---|---|---|
| VPS self-hosted Appwrite | HTTPS endpoint such as `https://appwrite.your-domain.com/v1` | Proposed direction for requested VPS approach |
| Appwrite Cloud | Endpoint copied from the project's console | Alternative, not selected |
| Local Appwrite Docker | Local development endpoint | Optional; not required to connect to remote Appwrite |

## Implemented behavior

Server SDK clients are in `app/lib/appwrite.server.ts`. Lead CRUD uses the Documents/Collections API. Defaults: database `sbh`, collection `leads`. Auth is independent and opt-in. Appwrite Realtime, Functions and Storage are not implemented.

Bootstrap creates attributes/indexes, waits for availability and optionally creates the first user from setup-only variables. Existing definitions are skipped by name, not reconciled against the desired schema. Review the selected server version, schema and scopes before running against an existing project.

Runtime requires database document read/write access. Optional auth cleanup also uses Users session deletion. Provisioning requires broader schema and optional user-creation permissions. Exact scope names must be checked in the selected server's console; current runbook scope examples have not been live-validated.

Use separate staging/production projects and separate provisioning/runtime keys. Keep collection access restricted; server credentials stay on the website server. No browser SDK access is necessary for the implemented flow.

See [[../04-Operations/Configuration|Configuration]], [[../04-Operations/VPS-Deployment|VPS deployment]] and [[../05-Quality-and-Risks/Findings|Findings]]. Official installation reference is recorded in [[../08-Reference/Source-Index|Source Index]].
