---
title: "Source index"
updated: 2026-10-18
tags: [sbh, context-vault]
---

# Source index

## Existing project records

- [README](../../README.md) — introduction and commands.
- [Build plan](../../docs/BUILD-PLAN.md) — documented scope, architecture and acceptance criteria.
- [Build log](../../docs/BUILD-LOG.md) — historical implementation and verification claims.
- [Run guide](../../docs/RUN-GUIDE.md) — detailed operator reference.
- [Appwrite runbook](../../docs/APPWRITE.md) — existing setup instructions; read alongside current findings.
- [Environment template](../../.env.example).
- [Package scripts and dependencies](../../package.json).
- [Route table](../../app/routes.ts).
- [Appwrite client](../../app/lib/appwrite.server.ts).
- [Appwrite provider](../../app/lib/leads.appwrite.server.ts).
- [Authentication](../../app/lib/auth.server.ts).
- [Bootstrap script](../../scripts/appwrite-setup.mjs).
- [Website Dockerfile](../../Dockerfile).

Relative file links work in the repository. If this vault is copied elsewhere alone, external source links require the repository at the same relative location or link updates. Internal wiki-links stay within the vault.

## Official external references

Checked during the 2026-10-18 initial audit:

- [Appwrite installation](https://appwrite.io/docs/advanced/self-hosting/installation) — server installation; not npm SDK installation.
- [Self-hosting overview](https://appwrite.io/docs/advanced/self-hosting).
- [TLS configuration](https://appwrite.io/docs/advanced/self-hosting/configuration/tls-certificates).

External product instructions can change. Recheck selected-version instructions at deployment time. Existing runbooks include assertions about data sensitivity that the source audit does not establish; see [[../05-Quality-and-Risks/Findings|Findings]].
