---
title: "VPS deployment"
updated: 2026-10-18
tags: [sbh, context-vault]
---

# VPS deployment

Status: **proposed runbook; no VPS inspected or changed**.

1. Inventory the VPS: OS, CPU/RAM/disk, Docker/Compose, existing reverse proxy, domain/DNS and backup destination. None are confirmed yet.
2. Deploy Appwrite as a separate Docker Compose stack using the official installation guide. The guide checked on this date lists a minimum of 2 CPU cores, 4 GB RAM and 2 GB swap; allow additional capacity for the website and actual load. Coordinate proxy ports if sharing a VPS.
3. Give Appwrite a dedicated HTTPS hostname such as `appwrite.your-domain.com`. Configure persistent volumes, backups and restore verification, upgrades and restricted console access.
4. Create the Appwrite project in its console. Create provisioning credentials appropriate to the chosen server version. Use a separate project for staging.
5. Configure the website environment:

```dotenv
APPWRITE_ENDPOINT=https://appwrite.your-domain.com/v1
APPWRITE_PROJECT_ID=<project-id>
APPWRITE_API_KEY=<server-only-key>
APPWRITE_DATABASE_ID=sbh
APPWRITE_LEADS_COLLECTION_ID=leads
APPWRITE_AUTH_ENABLED=false
SESSION_SECRET=<long-random-secret>
ADMIN_PASSWORD=<strong-password>
SITE_URL=https://your-website-domain.com
PORT=3000
```

6. From a trusted checkout with these variables in `.env`, run `npm run setup:appwrite`. This can run locally against the remote instance or from the VPS. The website's final Docker image does not include `scripts/`, so run bootstrap outside that image or use a dedicated provisioning job.
7. Supply runtime variables through the process manager/container environment and restart the website. `npm start` does not load `.env`; `npm run start:env` does. The browser never needs the API key.
8. Verify `/healthz` reports Appwrite configured and reachable. Submit a synthetic lead, find it in Appwrite and `/admin`, update status/notes, and check persistence after restart. Test invalid credentials and an Appwrite outage. Confirm unauthorized users cannot access admin data before enabling Appwrite auth.
9. If real leads already exist in the file store, back up and migrate them explicitly. Changing the provider does not migrate records.

Keep Appwrite configuration/volumes separate from the website release directory. Record hostname, versions, proxy ownership, volume locations and backup references after deployment without recording credentials here. See [[Recovery-and-Monitoring]].
