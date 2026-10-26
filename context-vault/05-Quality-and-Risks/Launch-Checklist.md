---
title: "Launch checklist"
updated: 2026-10-18
tags: [sbh, context-vault]
---

# Launch checklist

All items are pending unless linked evidence explicitly closes them.

- [ ] Resolve admin authorization and production-secret fallback findings.
- [ ] Validate Appwrite version, scopes, schema, pagination and totals.
- [ ] Configure HTTPS, runtime environment, persistent data and restart policy.
- [ ] Complete staging acceptance in [[Verification]].
- [ ] Configure meaningful health monitoring and alert ownership.
- [ ] Establish backups, isolated restore test and rollback instructions.
- [ ] Confirm data collection, retention, access and deletion requirements.
- [ ] Obtain approved staff details, licence status, program scope, carriers and hours.
- [ ] Review privacy/NPP/terms and actual form fields with the responsible client reviewers.
- [ ] Confirm whether staffed chat, CRM or email delivery is required; none is currently integrated.
- [ ] Set production `SITE_URL`; inspect sitemap, robots and admin indexing behavior.
- [ ] Migrate existing records if changing providers.
- [ ] Record production deployment evidence and operator contacts in the vault.

A passing build or an older completed-deliverables table does not close these launch gates.
