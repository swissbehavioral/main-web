---
title: "Configuration"
updated: 2026-10-18
tags: [sbh, context-vault]
---

# Configuration

Source: `.env.example`, server modules and sitemap loader. Restart after changing provider/auth variables.

| Variable | Use |
|---|---|
| `SESSION_SECRET` | Website cookie signature; require a strong random value |
| `ADMIN_PASSWORD` | Shared-password login |
| `ADMIN_EMAIL` | Optional shared-password email restriction |
| `APPWRITE_AUTH_ENABLED` | Exact `true` enables Appwrite auth only with complete connection variables |
| `APPWRITE_ENDPOINT` | API origin/path including `/v1`; copy from the selected instance/project |
| `APPWRITE_PROJECT_ID` | Remote project identifier |
| `APPWRITE_API_KEY` | Server secret; never expose to browser |
| `APPWRITE_DATABASE_ID` | Defaults to `sbh` |
| `APPWRITE_LEADS_COLLECTION_ID` | Defaults to `leads` |
| `APPWRITE_ADMIN_EMAIL`, `APPWRITE_ADMIN_PASSWORD`, `APPWRITE_ADMIN_NAME` | Bootstrap-only optional first-user creation |
| `LEADS_DIR` | Optional local fallback storage directory |
| `SITE_URL` | Production origin for sitemap generation |
| `PORT` | Website serving port |
| `NODE_ENV` | Production cookie/security behavior |

All three connection values must be nonempty for Appwrite storage. Partial configuration falls back to file storage. Auth selection also falls back when credentials are incomplete; this is an open finding.

Development loads `.env` through the dev tooling. `start:env` explicitly loads it with Node. `npm start` and the final Docker image need environment injection by the host/container configuration. The final image includes the build and production dependencies but not the setup script.

The template contains placeholders, not valid deployment credentials. `.env` is gitignored, but the current workspace is not itself a Git checkout. Verify actual version-control/backup rules when setting one up.
