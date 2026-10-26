---
title: "Content and ownership"
updated: 2026-10-18
tags: [sbh, context-vault]
---

# Content and ownership

| Content | Source file from repository root | Required input |
|---|---|---|
| Brand, address, phone, hours, navigation and map | `app/data/site.ts` | Client confirmation |
| Programs and typical schedules | `app/data/programs.ts` | Licensed services confirmation |
| Staff | `app/data/team.ts` | Verified names and credentials |
| Licensing/accreditation | `app/data/licensing.ts` | Actual status and identifiers |
| FAQs / resource articles | `app/data/faqs.ts`, `app/data/resources.ts` | Editorial/clinical review |
| Privacy/NPP/terms | `app/data/legal.ts` | Client and appropriate legal review |
| Styling / shell | `app/app.css`, `app/root.tsx`, `app/components/` | Product/design work |

Staff entries publish only when marked verified. Do not invent personnel, credentials, licence numbers or program availability. Existing legal text is described as draft in project documentation.

Names of current deployment, security, content and infrastructure owners have not been recorded. Capture them when assigned; do not assign ownership by assumption.

Related: [[../05-Quality-and-Risks/Launch-Checklist|Launch checklist]].
