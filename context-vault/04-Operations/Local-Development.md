---
title: "Local development"
updated: 2026-10-18
tags: [sbh, context-vault]
---

# Local development

Run commands from `/Users/fidaali/swissbehavioralhealth`.

```bash
npm ci
cp .env.example .env
npm run dev
```

Copy the template only when `.env` does not already exist. Set real development secrets and choose local file storage or a staging Appwrite project. Do not put real credentials into Markdown.

| Command | Purpose |
|---|---|
| `npm run dev` | Development server, normally port 5173 |
| `npm run typecheck` | Route type generation plus TypeScript |
| `npm run build` | Client and SSR production bundles |
| `PORT=3000 npm run start:env` | Production bundle with `.env` explicitly loaded |
| `npm start` | Serve production bundle; environment must already be supplied |
| `npm run setup:appwrite` | Remote schema provisioning using `.env`; mutates the selected project |

The website can run without Appwrite and will use local JSON storage. Set `PORT` explicitly for predictable production serving. HTTPS is required for production secure-cookie login.

No test runner is configured. Follow [[../05-Quality-and-Risks/Verification|Verification]] for meaningful checks. Never run provisioning against production merely to check whether a command exists.
