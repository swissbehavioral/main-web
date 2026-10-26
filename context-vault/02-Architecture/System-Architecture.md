---
title: "System architecture"
updated: 2026-10-18
tags: [sbh, context-vault]
---

# System architecture

```mermaid
flowchart TD
  V[Visitor: contact, insurance or chat form] --> A[POST /api/lead: validation and honeypot]
  A --> F[Server lead provider]
  F -->|All three Appwrite credentials set| W[Appwrite API: sbh / leads]
  F -->|Credentials incomplete or absent| J[Local storage/leads.json]
  D[Admin dashboard: guarded loaders and actions] --> F
  L[Admin login] --> S[Shared password or Appwrite email/password]
  S --> C[Website signed cookie: 8 hours]
```

The provider is chosen at module initialization, so configuration changes require a restart. A configured Appwrite outage returns a submission error rather than silently switching to the file store.

SSR is enabled in `react-router.config.ts`. Server loaders/actions handle persistence and admin access. `.server.ts` modules hold backend credentials. Content is supplied through `app/data/`; there is no external CMS in the reviewed implementation.

Deployment has two independent components: the Node website process and an optional Appwrite service. A website Docker image does not install Appwrite. See [[../03-Integrations/Appwrite|Appwrite]] and [[Data-and-Lead-Lifecycle]].
