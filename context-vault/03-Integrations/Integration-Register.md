---
title: "Integration register"
updated: 2026-10-18
tags: [sbh, context-vault]
---

# Integration register

| Integration | Evidence / current behavior | Readiness |
|---|---|---|
| React Router SSR website | React 19, React Router 7, Vite, Tailwind; production client/server build succeeds | Build verified |
| Appwrite SDK | `node-appwrite` server SDK; browser `appwrite` package also installed, with no browser SDK usage found in app code | Installed; remote compatibility untested |
| Lead capture | Contact, insurance and chat use `/api/lead`, then the same provider facade | Code wired; live Appwrite write untested |
| Appwrite database | `sbh` database, `leads` collection; create/read/update plus dashboard summaries | Schema bootstrap exists; not executed in this audit |
| Admin auth | Shared password by default; optional Appwrite credential verification then website cookie | Needs hardening below |
| Health | `/healthz` reads one document when Appwrite is configured | Read probe only; not a write/auth test |
| Local fallback | JSON file under `storage`, configurable via `LEADS_DIR` | Development/single-instance use; needs persistent storage and backups if retained |
| Website Docker image | Builds and serves the website only | No Appwrite service included |
| Google Fonts / Maps | External fonts in `app/root.tsx`, Maps embed configured in `app/data/site.ts` | URLs present; external availability not checked |
| Phone / email links | Click-to-call and email fallbacks | Links, not automated delivery integrations |
| Chat | Lead-capture widget | No staffed live-chat service or realtime transport integrated |
| CRM / email notifications | Mentioned as future work | No implemented delivery integration found |
| Appwrite Realtime / Storage / Functions | Described as future options | Not implemented |

“Code wired” is not a live service guarantee. Appwrite server credentials and external endpoints must be verified per environment. See [[Appwrite]] and [[../05-Quality-and-Risks/Verification|Verification]].
