---
title: "Repository map"
updated: 2026-10-18
tags: [sbh, context-vault]
---

# Repository map

All paths below are relative to the project root, one directory above this vault.

| Path | Responsibility |
|---|---|
| `app/root.tsx` | Document shell, shared UI, external font links |
| `app/routes.ts` | Explicit route registration |
| `app/routes/` | Page modules, server loaders/actions, API/SEO/health endpoints |
| `app/components/` | Forms, chat capture, layout and public sections |
| `app/data/` | Typed content, site settings and draft legal text |
| `app/lib/appwrite.server.ts` | Appwrite configuration, clients and read health probe |
| `app/lib/leads.server.ts` | Provider selection and common persistence API |
| `app/lib/leads.appwrite.server.ts` | Appwrite document mapping and CRUD |
| `app/lib/leads.file.server.ts` | Local JSON persistence |
| `app/lib/leads.types.ts` | Lead types and status/kind helpers |
| `app/lib/auth.server.ts` | Credential verification and cookie sessions |
| `app/lib/validation.ts` | Form parsing and validation |
| `scripts/appwrite-setup.mjs` | Remote schema/admin provisioning |
| `.env.example` | Environment template |
| `Dockerfile` | Multi-stage website image |
| `public/` | Static assets, logos and robots.txt |
| `docs/` | Existing build records and operator guides |
| `context-vault/` | Structured project memory |
| `storage/` | Runtime fallback records; excluded by gitignore |
| `build/`, `.react-router/`, `node_modules/` | Generated output/dependencies; not source memory |

Use [[Routes-and-Endpoints]] to locate a route and [[../08-Reference/Source-Index|Source Index]] for direct source links.
